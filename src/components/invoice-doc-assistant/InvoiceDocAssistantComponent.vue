<template>
  <div class="component-container">
    <div class="column list">
      <div class="list-header">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M8,0C3.588,0,0,3.589,0,8s3.589,8,8,8c4.411,0,8-3.589,8-8S12.411,0,8,0z M8,2c1.294,0,2.49,0.416,3.471,1.115l-8.356,8.357  C2.416,10.49,2,9.294,2,8C2,4.691,4.691,2,8,2z M8,14c-1.294,0-2.49-0.416-3.471-1.115l8.356-8.356C13.584,5.51,14,6.706,14,8  C14,11.309,11.309,14,8,14z"></path>
          </svg>
        </span>
        <span class="unsigned-text">Unsigned items</span>
        <span class="unsigned-number" v-if="mutator">({{appointments.length}})</span>
        <div class="list-header-bottom-border"></div>
      </div>
      <invoice-doc-assistant-list :appointments="appointments"/>
      <div class="list-footer">
      </div>
    </div>
    <div class="column detail">
      <invoice-doc-assistant-detail/>
    </div>
  </div>
</template>

<script>
  import InvoiceDocAssistantListComponent from './InvoiceDocAssistantListComponent'
  import InvoiceDocAssistantDetailComponent from './InvoiceDocAssistantDetailComponent'
  import InvoiceDocAssistantBO from '../../modules/InvoiceDocAssistantBO';
  const BO = InvoiceDocAssistantBO;

  export default {
    props: ['appointments'],
    data() {
      return {
        mutator: 1,
      }
    },
    components: {
      'invoice-doc-assistant-list': InvoiceDocAssistantListComponent,
      'invoice-doc-assistant-detail': InvoiceDocAssistantDetailComponent,
    },
    mounted() {
      BO.registerComponentChangeFunction(() => {
        this.mutator++;
      });
    }
  }
</script>

<style lang="less" scoped>
  .component-container {
    max-width: 1070px;
    min-width: 1070px;
    margin-left: 10px;
    display: flex;
    .column {
      border: 1px solid gray;
      border-radius: 5px;
    }
    .list {
      display:flex;
      flex:1;
      flex-flow:column;
      max-width: 300px;
      .list-header {
        padding: 15px 0 10px 10px;
        height: 20px;
        span svg {
          position: relative;
          margin-right: 3px;
          top: 3px;
          height: 17px;
          width: 17px;
          fill: #717171;
        }
        .unsigned-text {
          color: #666666;
          font-size: 17px;
          font-weight: bold;
        }
        .unsigned-number {
          margin-left: 1px;
          font-size: 15px;
        }
        .list-header-bottom-border {
          height:1px;
          border-bottom:1px solid darkgray;
        }
      }
      .list-footer {
        height:2px;
      }
      .pad-bottom {
        height: 2px;
      }
    }
    .detail {
      display:flex;
      flex:1;
      flex-flow:column;
      margin-left: 5px;
      border: 7px solid #222B34;
    }
  }

</style>
