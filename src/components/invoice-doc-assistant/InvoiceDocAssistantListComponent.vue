<template>
  <div class="container" v-if="selected">
    <div v-for="(item, idx) in BO.appointmentsList" class="row" :class="{'selected': BO.isSelected(item)}" @click="onClickItem(item)" :id="`item-${idx}`">
      <span class="item-counter">{{BO.getDisplayIndex(idx)+1}}</span> {{item.displayTitle}}<p/>
    </div>
  </div>
</template>

<script>
import InvoiceDocAssistantBO from '../../modules/InvoiceDocAssistantBO';
const BO = InvoiceDocAssistantBO;

export default {
  props: ['appointments'],
  data() {
    return {
      selected: BO.selectedAppointment,
      BO,
    }
  },
  methods: {
    onClickItem(item) {
      if (item.itemKey === BO.getSelectedItem().itemKey) return;
      this.selected = item;
      BO.setSelectedItem(item);
    }
  },
  mounted() {
    BO.registerListChangeFunction(()=>{
      this.selected = BO.getSelectedItem();
    })
  },
}
</script>

<style lang="less" scoped>
.container {
  flex:1;
  overflow-y: scroll;
}
.row {
  // hover, selected order matters!
  &:hover {
    font-weight: bold;
    background-color: brown;
    color: white;
    .item-counter {
      color: white;
    }
  }
  &.selected {
    font-weight: normal;
    background-color: #222B34;
    color: silver;
    .item-counter {
      color: silver;
    }
    border: 4px solid silver;
    border-radius: 9px;
    padding: 5px 8px;
  }
  cursor: pointer;
  color: #333333;
  background-color: #F6F6F8;
  border-bottom: 1px solid #E4E4E4;
  padding: 5px 10px;
  height: 24px;
  line-height: 25px;
  vertical-align: middle;
  font-size: 14px;

  .item-counter {
    display: inline-block;
    color: black;
    font-size: 10px;
    min-width: 15px;
    height: 15px;
    border: 1px solid lightgray;
    border-radius: 10%;
    text-align: center;
    line-height: 15px;
    vertical-align: middle;
    padding: 2px;
    padding-top: 3px;
    padding-bottom: 1px;
    position:relative;
    top: -1px;
    margin-right: 5px;
  }
}
</style>
