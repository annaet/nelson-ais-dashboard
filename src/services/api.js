import Vue from 'vue'

export default {
  getShipHistory () {
    return Vue.http
      .get('api/history')
  }
}
