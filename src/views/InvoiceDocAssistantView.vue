<template>
  <div class="view-container">
    <div class="view-header">
      <div v-if="pageReady">
        Documentation Assistant for Invoice - Period Ending 12/31/2017
      </div>
    </div>
    <transition name="fade" mode="in-out">
      <div v-if="!pageReady" class="loading">
          Loading<p/><b>INVOICE DOCUMENTATION ASSISTANT</b>
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="pageReady" class="view-module-container">
        <div class="view-module-header">
          <span class="info-icon">i</span>
          <span class="info-text" v-if="mutator">You have <span class="signed-record-count">{{BO.signedAppointmentsCount}}</span> signed records and <span class="unsigned-record-count">{{BO.appointmentsList.length}}</span> unsigned records. Let's finish your documentation to get you the money you deserve.</span>
        </div>
        <div class="view-module-header warning" v-if="clientsMissingData.length">
          <span class="info-text" v-if="mutator">
            The following clients are missing data:<br/>
            <ul>
              <li v-for="(client, idx) in clientsMissingData" class="clients-missing-data">
                {{client.first_name}} {{client.last_name}}<span v-if="idx < clientsMissingData.length-1">, </span>
              </li>
            </ul>
          </span>
        </div>
        <div class="view-component-container">
          <invoice-doc-assistant :appointments="BO.appointmentsList">
          </invoice-doc-assistant>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Auth from '../modules/Auth';
  import InvoiceDocAssistantComponent from '../components/invoice-doc-assistant/InvoiceDocAssistantComponent';
  import InvoiceDocAssistantBO from '../modules/InvoiceDocAssistantBO';
  const BO = InvoiceDocAssistantBO;

  // load animation delays
  const PAGE_READY = {
    splashScreen:false,
    dataLoad:false,
    minWait:1500};

  export default {
    data() {
      return {
        Auth,
        pageReady: false,
        mutator: 1,
        BO,
      }
    },
    methods: {
      init() {
        setTimeout(()=>{
          PAGE_READY.spashScreen = true;
          this._start();
        }, PAGE_READY.minWait);

        BO.loadAppointmentListData().then(()=>{
          PAGE_READY.dataLoad = true;
          this._start();
        });
      },
      _start() {
        if (PAGE_READY.spashScreen && PAGE_READY.dataLoad) {
          this.pageReady = 1;
        }
      }
    },
    components: {
      'invoice-doc-assistant': InvoiceDocAssistantComponent
    },
    computed: {
      clientsMissingData() {
        return BO.getClientsMissingData();
      }
    },
    mounted() {
      this.init();
      BO.registerPageViewChangeFunction(() => {
        this.mutator++;
      });
    }
  }
</script>

<style lang="less" scoped>
  .view-container {
    vertical-align: top;
    display: flex;
    flex-flow: column;
    height: 100%;

    box-sizing: border-box;
    /* Ensure that the height of the element includes the  box border, not just the content */
    border: 0;
    /* Leave some space for the header and footer to  overlay. */
    border-top: 45px solid white;
    border-bottom: 15px solid white;
    .view-header {
      padding: 10px;
      font-size: 25px;
      color: white;
      background-color: #242627;
      margin-bottom: 20px;
      text-align: center;
    }
    .loading {
      z-index: 999999999;
      position:fixed;
      top: 45px;
      background-color: black;
      height: 100%;
      width: 100%;
      padding-top: 200px;
      font-size: 40px;
      text-align: center;
      color: brown;
      line-height: 100%;
      vertical-align: middle;
    }
  }

  .view-module-container {
    display: flex;
    flex-flow: column;
    margin: 0 auto;
    margin-left: 20px;
    .view-module-header {
      box-shadow: inset 1px 4px 9px -6px;
      background-color: #DEF2FC;
      width: 1048px;
      margin-left: 10px;
      margin-bottom: 5px;
      text-align: left;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #EEEEEE;
      &.warning {
        background-color: brown;
        color: white;
        .info-icon {
          display: none;
        }

      }
      .info-icon {
        display: inline-block;
        padding-top: 2px;
        padding-left: 2px;
        padding-right: 1px;
        margin-right: 5px;
        border-radius: 50%;
        background-color: #3E76B0;
        height: 20px;
        width: 20px;
        vertical-align: middle;
        text-align: center;
        font-family: serif;
        font-weight: bold;
        color: white;
      }
      .info-text {
        font-size: 14px;
      }
      .signed-record-count {
        font-weight: bold;
      }
      .unsigned-record-count {
        font-weight: bold;
      }
    }
  }

  .view-component-container {
    display: flex;
  }

  /**
   * TRANSITIONS and ANIMATIONS
   */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  // .slide-fade-enter-active {
  //   transition: all .3s ease;
  // }
  // .slide-fade-leave-active {
  //   transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  // }
  // .slide-fade-enter, .slide-fade-leave-to
  // /* .slide-fade-leave-active below version 2.1.8 */ {
  //   transform: translateX(10px);
  //   opacity: 0;
  // }
  .slide-leave-active,
  .slide-enter-active {
    transition: 1s;
  }
  .slide-enter {
    //transform: translate(0, 100%);
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    //transform: translate(0, -100%);
    transform: translate(-100%, 0);
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

</style>
