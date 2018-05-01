<template>
  <transition name="bounce" mode="out-in">
  <div class="container missing-data" v-if="!BO.canSaveItemDocumentation(item())">
    {{item().client.first_name}} {{item().client.last_name}} has no Client Services.
  </div>
  <div class="container" v-if="BO.getToggle() && BO.canSaveItemDocumentation(item())">
    <div class="detail-header">
      <div class="columns">
        <div class="col col1">
          <svg viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg"><g fill="#3697CC"><ellipse cx="14.5" cy="14.241" rx="14.5" ry="14.241"></ellipse><path d="M14.45 7.876c-1.027 0-1.862.84-1.862 1.875 0 1.04.835 1.88 1.863 1.88s1.867-.84 1.867-1.875c0-1.034-.835-1.874-1.862-1.874m0 5.626c-2.054 0-3.725-1.682-3.725-3.75C10.724 7.68 12.394 6 14.45 6s3.726 1.683 3.726 3.75c0 2.07-1.67 3.752-3.725 3.752M9.01 19.13h10.88c-.556-1.697-2.638-2.815-5.44-2.815-2.8 0-4.883 1.118-5.44 2.814zm12.89 1.874H7v-.938c0-3.313 3.064-5.626 7.45-5.626 4.388 0 7.45 2.313 7.45 5.626v.938z" fill="#FFF"></path></g></svg>
        </div>
        <div class="col col2">
          {{item().client.first_name}} {{item().client.last_name}}
          <div class="row2">
            {{BO.getSelectedItem().location.name}}
          </div>
        </div>
        <div class="col col3">
          <div class="row1 item-id" @click="onClickItemId(`item-${BO.getSelectedIndex()}`)">
            Item {{BO.getDisplayIndex(BO.getSelectedIndex())+1}}
          </div>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <section class="billing-info">
        <div class="header">
          Billing Information
        </div>
        <div class="content">
          <div class="col1">
            <div class="field">
              <span class="label">Billing code:</span>
              <span class="value">
                <multiselect v-model="item().model.oBillingCode" :options="BO.getSelectedItem().billingCodesList" label="name" :value="item().billingCode" select-label="" :max-height="250" :allow-empty="false" deselect-label="" placeholder="⟶ pick a billing code "></multiselect>
              </span>
            </div>
            <div class="field">
              <span class="label">Service:</span>
              <span class="value">
                <multiselect v-model="item().model.oClientService" :options="item().clientServicesList" label="xName" value="uuid" select-label="" :max-height="250" :allow-empty="false" deselect-label="" placeholder="⟶ pick a service "></multiselect>
              </span>
            </div>
            <div class="field">
              <span class="label">Location:</span>
              <span class="value">{{item().location.name}}</span>
            </div>
          </div>
          <div class="col2">
            <div class="field">
              <span class="label">Appt time:</span>
              <span class="value">{{appointmentTime()}}</span>
            </div>
          </div>
        </div>
      </section>
      <section class="clinical-info">
        <div class="header">
          Clinical Information
        </div>
        <div class="content">
          <div>
            <span class="label">Session Notes</span>
          </div>
          <div>
            <textarea rows="5" cols="75"></textarea>
          </div>
          <div>
            <span class="label">General Notes</span>
          </div>
          <div>
            <textarea rows="5" cols="75"></textarea>
          </div>
        </div>
      </section>
      <section class="empty">
        <div class="header"></div>
      </section>
      <section class="signoff">
        <div class="header">
          Sign off to complete this record
          <div class="content">
            <toggle-button class="signoff-toggle" :value="false" :height="30" :width="110"
                 :labels="{checked: 'Signed', unchecked: 'Unsigned'}"
                 :color="{checked: '#4DAD49', unchecked: '#CD3C3D'}"/>
          </div>
        </div>
      </section>
    </div>
    <div class="detail-footer">
      <div class="save button" @click="onClickSave()">
        Save record
      </div>
    </div>
  </div>
</transition>
</template>

<script>
  import moment from 'moment';
  import Multiselect from 'vue-multiselect';

  import InvoiceDocAssistantBO from '../../modules/InvoiceDocAssistantBO';
  const BO = InvoiceDocAssistantBO;
  export default {
    props: [],
    data() {
      return {
        BO,
      }
    },
    methods: {
      item() {
        return BO.getSelectedItem();
      },
      onClickItemId(id) {
        document.getElementById(id).scrollIntoView({behavior:'smooth'});
      },
      onClickSave() {
        BO.saveItemDocumentation(this.item());
      },
      appointmentTime() {
        return `
          ${moment(BO.getSelectedItem().appointment.start).format('dddd, MMM D h:mm a')}
          -
          ${moment(BO.getSelectedItem().appointment.end).format('h:mm a')}
        `;
      }
    },
    components: {Multiselect},
  }
</script>

<style lang="less" scoped>
  .container {
    display:flex;
    flex:1;
    flex-flow:column;
    overflow-x: hidden;
    &.missing-data {
      padding: 20px;
      font-size: 20px;
    }
  }
  .detail-header {
    background-color: #222B34;
    height: 75px;
    color: #DDDDDD;
    font-size: 22px;
    font-weight: 500;

    .columns {
      .col {
        padding: 7px 0 15px 10px;
        display: inline-block;
        &.col1 {
          position:relative;
          top: 4px;
          width: 47px;
          height: 47px;
          padding-left: 15px;
        }
        &.col2 {
          .row2 {
            font-size: 15px;
          }
        }
        &.col3 {
          padding-top: 18px;
          padding-right: 20px;
          color: gray;
          float: right;
          .item-id {
            cursor: pointer;
          }
          .row1 {
            display: inline-block;
            font-size: 13px;
            height: 15px;
            line-height: 16px;
            border: 1px solid lightgray;
            color: lightgray;
            border-radius: 10%;
            padding: 5px;
          }
        }
      }
    }
  }
  .detail-footer {
    border-top: 1px solid silver;
    height: 35px;
    color: lightgray;
    padding: 5px;
  }
  .detail-body {
    padding: 5px;
    overflow-y: scroll;
    flex: 1;
    section {
      .header {
        background-color: #D6DDE3;
        padding: 12px 26px;
        font-size: 18px;
        font-weight: 500;
        margin: 5px;
      }
      .content {
        font-size: 14px;
        .label {
          font-weight: bold;
        }
        .value {
        }
      }
    }
    section.billing-info {
      .content {
        margin-left: 20px;
        padding: 10px;
        display: flex;
        flex-flow: row;
        .field {
          margin-bottom: 10px;
        }
        .col1 {
          flex:1;
        }
        .col2 {
          text-align: center;
          flex:1;
        }
      }
    }
    section.clinical-info {
      .content {
        margin-left: 20px;
        padding: 10px;
      }
    }
    section.empty {
      .header {
        height:1px;
        padding:0;
      }
    }
    section.signoff {
      display: inline-block;
      //text-align: center;
      margin-top: 10px;
      .header {
        font-size: 16px;
        color: #666666;
        font-weight: bold;
        background-color: white;
        //border: 1px solid silver;
        padding: 5px;
      }
    }
  }
  .detail-footer {
    background-color: #EFEFEF;
    div {
      display: inline-block;
    }
    .save {
      font-size: 16px;
      height: 25px;
      padding: 5px 15px;
      line-height: 25px;
      margin-left: 10px;
      position: relative;
      top: -1px;
      cursor: pointer;
    }
  }
  .button {
    display: inline-block;
    font-size: 15px;
    font-weight: 550;
    border-radius: 5px;
    color: white;
    border: 1px solid #EEEEEE;
    background-color: darkorange;
    padding: 5px 15px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .slide-leave-active {

  }
  .slide-enter-active {
    transition: 0.5s;
  }
  .slide-enter {
    transform: translate(0, 100%);
  }
  .slide-leave-to {
    display: none;
  }

  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  .bounce-leave-active {

  }
  @keyframes bounce-in {
    0% {
      transform: scale(0.5);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }
  .vue-js-switch.signoff-toggle {
    margin-top: 5px;
    font-size: 14px;
  }
  .v-select .dropdown-menu {
    display:none;
  }
</style>
