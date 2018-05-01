import Vue from 'vue'
import Router from 'vue-router'
import InvoiceDocAssistantView from '@/views/InvoiceDocAssistantView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'InvoiceDocAssistantView',
      component: InvoiceDocAssistantView
    }
  ]
})
