import moment from 'moment';
import axios from 'axios';
import Auth from './Auth';

const API = axios.create({
  baseURL: `https://workplace.presencetest.com/api/`,
  timeout: 30000,
  headers: {
    authorization: `JWT ${Auth.token}`
  }
});
/**
 * Invoice Documentation Assistant Business Object
 *-----------------------------------------------------*/
class InvoiceDocAssistantBO {
  constructor() {
    this.model = {
      toggle: true,
      clientsMissingData: {},
    };

    // @see registerListChangeFunction(f)
    this.listChangeFunction = ()=>{};
  }

  // ============================
  // methods
  // ============================

  // TODO: move API calls to BO methods.

  // build the task list of unsigned appointment documentation records
  // --------------------------------------------------------
  buildAppointmentsList(appointmentsRaw, clientServicesRaw, billingCodesRaw) {
    this.model.signedAppointmentsCount = 0;
    this.model.appointmentsList = appointmentsRaw.reduce((result, appointment) => {
      const records = appointment.records;
      const clients = appointment.clients;
      const locations = appointment.locations;

      // handle client appointments
      if (clients && clients.length) {
        clients.map((client) => {
          this._addClientAppointment(appointment,client,records,clientServicesRaw,billingCodesRaw,result);
        })
      }
      // TODO: handle locations
      else if (locations && locations.length) {
        const location = location[0];
        this._addLocationAppointment(appointment,location,records,result);
      }

      // TODO: return the sorted list
      return this._sortAppointments(result);
    },[]);
    if (this.model.appointmentsList.length) {
      this.model.selectedAppointment = this.model.appointmentsList[0];
    }
  }

  /**
   * Construct list of unsigned client appointments.
   *
   * itemToAdd {
   *   appointment, client, record, billingCode, clientService, location,
   *   billingCodes, clientServices, displayTitle, sortKey, itemKey
   * }
   // TODO: ----- client service filtering -----
   // TODO: HERE: filter client services by the type of record client service here
   // TODO: TEMPLATE: on select of billing code dropdown, use a computed method to further filter client services
   // TODO: TEMPLATE: check client service required via bizobj rules
   // TODO: ----- billing code filtering -----
   // TODO: HERE: filter billing codes by the record billing code ELSE by the event billing code
   // TODO: HERE: filter by billing code types matching active client services
   * ------------------------------------------------------------------ */
  _addClientAppointment(appointment, client, records, clientServicesList, billingCodesList, result) {
    const apptDate = moment(appointment.start).format('MM/D');
    const sortKey = moment(appointment.start).valueOf() + client.first_name + client.last_name;
    const displayTitle = `${apptDate} - ${client.first_name} ${client.last_name.charAt(0)}.`;
    // TODO: make item key a proper hash of the appointment, even if client and times are the same
    const itemKey = this._buildAppointmentKey(appointment, client.uuid);
    const model = {};
    const missingData = {};

    // filter clientServices by this client;
    clientServicesList = clientServicesList.filter(item => {
      return item.client === client.uuid && (item.xName = item.service_expanded.name);
    });

    if (!clientServicesList || !clientServicesList.length) {
      missingData.clientServices = true;
      this.model.clientsMissingData[client.uuid] = client;
    }

    const itemToAdd = {appointment,client,billingCodesList,clientServicesList,displayTitle,sortKey,itemKey,model,missingData};

    // -- CLIENT APPOINTMENT RECORD
    if (records && records.length) {
      itemToAdd.record = records.find((item) => item.client === client.uuid);
      if (itemToAdd.record) {
        itemToAdd.billingCode = billingCodesList.find(item => item.uuid === itemToAdd.record.billing_code);
        itemToAdd.clientService = clientServicesList.find(item => item.uuid === itemToAdd.record.client_service);
        itemToAdd.location = this.model.locationsList.find(item => item.uuid === itemToAdd.record.location);
      }
    }

    // -- UNSIGNED
    if ((itemToAdd.record && !itemToAdd.record.signed) || !appointment.signed) {
      if (!itemToAdd.billingCode) {
        itemToAdd.billingCode = billingCodesList.find(item => item.uuid === itemToAdd.appointment.event.billing_code);
      }
      if (!itemToAdd.location) {
        const clientService = clientServicesList.find(item => item.client === client.uuid);
        if (clientService && clientService.client_expanded) {
          itemToAdd.location = clientService.client_expanded.locations[0];
        }
      }
      if (itemToAdd.location) {
        itemToAdd.displayTitle += ` - ${itemToAdd.location.name}`;
      } else {
        itemToAdd.displayTitle += ` - MISSING DATA`;
      }

      // BUILD FORM model
      if (itemToAdd.billingCode) {
        itemToAdd.model.billingCode = itemToAdd.billingCode.uuid;
      }

      // DONE
      result.push(itemToAdd);
    }
    // -- SIGNED
    else {
      this.signedAppointmentsCount++;
    }
  }

  /**
   * an "item" contains an appointment and other
   * attached data, including client, location objects
   * partial
      item: {
        appointment, // object
        client, // object
        model: { // user-entered form data
          oBillingCode, // object
          oClientService, // object
        },
        record, // if any
      }
   */
  saveItemDocumentation(item) {
    if (!item.appointment.uuid) {
      this.saveAppointment(item); // also saves record
    } else {
      if (!item.record) {
        this.saveRecord(item);
      } else {
        // TODO: handle record patch
        API.patch(`v1/records/${item.record.uuid}/`, {
          signed: true
        });
        this.updateComponentListState();
      }
    }
  }

  canSaveItemDocumentation(item) {
    return this.hasRequiredData(item);
  }

  hasRequiredData(item) {
    const hasClientServices = this.hasClientServices(item);
    return hasClientServices;
  }

  saveAppointment(item) {
    const A = item.appointment;
    if (!A.uuid) {
      const payload = {
        event: A.event.uuid,
        start: A.start,
        end: A.end,
        original_start: A.original_start,
        original_end: A.original_end,
      };
      const postAppointment = API.post('v3/appointments/', payload);
      postAppointment.then(response => {
        //console.log('--- SAVED appointment response', response, response.data, response.data.uuid);
        item.appointment.uuid = response.data.uuid;
        this.saveRecord(item);
      })
    }
  }

  saveRecord(item) {
    const A = item.appointment;
    //console.log('--- saveRecord item', item)
    const payload = {
      appointment: A.uuid,
      billing_code: item.model.oBillingCode.uuid,
      client: item.client.uuid,
      client_service: item.model.oClientService.uuid,
      location: item.location.uuid,
      note_schema: item.model.oBillingCode.record_note_type,
      provider: Auth.user.uuid,
      signed: true,
      signed_by: Auth.user.uuid,
      signed_on: new Date().  toISOString(),
      notes: '{"subjective":"","objective":"","assessment":"","plan":"","notes":"From inv doc assistant POC"}'
    };
    //console.log("--- saveRecord payload", payload);
    const postRecord = API.post('v1/records/', payload);
    postRecord.then(response => {
      //console.log('--- SAVED record response', response);
      this.updateComponentListState();
    })
  }

  // Order of operations matters!
  updateComponentListState() {
    const list = this.appointmentsList;
    let nextItem;
    if (list.length > 1) {
      // if at the head of the list, pick the next item
      if (this.getSelectedIndex() === 0) {
         nextItem = list[1];
      }
      // otherwise pick the previous item
      else {
        nextItem = list[this.getSelectedIndex()-1];
      }
    }
    const removedItem = list.splice(this.getSelectedIndex(),1);
    this.selectedAppointment = nextItem;
    this.signedAppointmentsCount++;
    this.refreshView()

    console.log('--- Save Success');
    // console.log('====== AFTER SAVE ======')
    // console.log('--- removed item', removedItem);
    // console.log('--- selected index', this.getSelectedIndex());
    // console.log('--- list length', this.appointmentsList.length);
    // console.log('--- signed count', this.signedAppointmentsCount);
    // console.log('--- selected item', this.selectedAppointment);
  }

  loadAppointmentListData() {
    const getAppointments = API.get('v3/appointments/', {
      params: {
        event_type_in: 'BILLING,AVAILABILITY,PERSONAL',
        provider: Auth.user.uuid,
        calendar_view: true,
        // TODO: dynamically get time period
        // TODO: dynamically adjust timezone
        start: '2017-12-01T-08:00',
        end: '2018-01-01T-08:00',
      }
    });
    const getClientServices = API.get('v2/client-services/', {
      params: {
        provider: Auth.user.uuid,
        limit: 1000,
      }
    });
    const getBillingCodes = API.get('v1/billing_codes/', {
      params: {
        with_can_provide: 1,
      }
    });
    const getLocations = API.get('v1/locations/', {
      params: {
        is_active: true,
        limit: 1000,
        provider: Auth.user.uuid,
      }
    });
    const getNotesSchemas = API.get('v1/notes/schemas/')
    return new Promise((resolve, reject) => {
      Promise.all([getAppointments, getClientServices, getBillingCodes, getLocations, getNotesSchemas]).then((values) => {
        const appointmentsRaw = values[0].data.results;
        this.clientServicesList = values[1].data.results;
        this.billingCodesList = values[2].data.results;
        this.locationsList = values[3].data.results;
        this.notesSchemasList = values[4].data.results;
        this.buildAppointmentsList(appointmentsRaw, this.clientServicesList, this.billingCodesList);
        resolve();
      });
    })
  }


  // location appointments
  // --------------------------------------------------------
  _addLocationAppointment(appointment, location, records, result) {}

  // eval appointments
  // --------------------------------------------------------
  _addEvaluationAppointment(appointment, records, result) {}


  // build a unique key to identify an appointment record
  // --------------------------------------------------------
  _buildAppointmentKey(appointment, uuid) {
    return `${appointment.start.substring(5,16).replace('T','-').replace(':','').replace('-','')},${uuid.substring(0,5)},${appointment.event.billing_code.substring(0,5)}`
  }

  _sortAppointments(list) {
    return list.sort((a,b) => {
      const A = a.sortKey;
      const B = b.sortKey;
      if (A===B) return 0;
      return A<B ? -1 : 1;
    });
  }

  // appointment row item handling
  getSelectedItem() {
    return this.model.selectedAppointment;
  }

  getSelectedIndex() {
    return this.model.appointmentsList.findIndex((item) => {
      return item.itemKey === this.model.selectedAppointment.itemKey;
    })
  }

  setSelectedItem(item) {
    this.toggle();
    this.model.selectedAppointment = item;
    setTimeout(() => {
      this.toggle();
    },500);
  }

  toggle() {
    this.model.toggle = !this.model.toggle;
  }

  registerListChangeFunction(f) {
    this.listChangeFunction = f;
  }

  registerComponentChangeFunction(f) {
    this.componentChangeFunction = f;
  }

  registerPageViewChangeFunction(f) {
    this.pageViewChangeFunction = f;
  }

  refreshPageViewState() {
    this.pageViewChangeFunction();
  }

  refreshComponentState() {
    this.componentChangeFunction();
  }

  refreshListState() {
    this.listChangeFunction();
  }

  refreshDetailState() {
    this.toggle();
    setTimeout(()=>{
      this.toggle();
    },100);
  }

  refreshView() {
    this.refreshListState();
    this.refreshDetailState();
    this.refreshComponentState();
    this.refreshPageViewState();
    if (this.appointmentsList.length) {
      document.getElementById(`item-${this.getSelectedIndex()}`).scrollIntoView({behavior:'smooth'});
    }
  }

  getToggle() {
    return this.model.toggle;
  }

  isSelected(item) {
    return item.itemKey === this.model.selectedAppointment.itemKey;
  }

  getDisplayIndex(idx) {
    return this.model.appointmentsList.length -1 - idx;
  }

  hasClientServices(item) {
    return item.clientServicesList && item.clientServicesList.length;
  }

  getClientsMissingData() {
    const data = this.model.clientsMissingData;
    const result = [];
    for (let item in data) {
      result.push(data[item]);
    }
    return result;
  }

  // ============================
  // model getters/setters
  // ============================

  set appointmentsList(list) {
    this.model.appointmentsList = list;
  }

  get appointmentsList() {
    return this.model.appointmentsList;
  }

  set signedAppointmentsCount(val) {
    this.model.signedAppointmentsCount = val;
  }

  get signedAppointmentsCount() {
    return this.model.signedAppointmentsCount;
  }

  get selectedAppointment() {
    return this.model.selectedAppointment;
  }

  set selectedAppointment(item) {
    this.model.selectedAppointment = item;
  }

  set clientServicesList(list) {
    this.model.clientServicesList = list;
  }

  get clientServicesList() {
    return this.model.clientServicesList;
  }

  set billingCodesList(list) {
    this.model.billingCodesList = list;
  }

  get billingCodesList() {
    return this.model.billingCodesList;
  }

  set locationsList(list) {
    this.model.locationsList = list;
  }

  get locationsList() {
    return this.model.locationsList;
  }

  set notesSchemasList(list) {
    this.model.notesSchemasList = list;
  }

  get notesSchemasList() {
    return this.model.notesSchemasList;
  }

}

export default new InvoiceDocAssistantBO();
