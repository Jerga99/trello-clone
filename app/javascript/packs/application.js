import Vue from 'vue/dist/vue.esm'
import App from '../app.vue'

window.store = {}

document.addEventListener('turbolinks:load', function() {
  var element = document.querySelector('#boards');
  if (element != undefined) {
    window.store.lists = JSON.parse(element.dataset.lists);

    const app = new Vue({
      el: element,
      data: window.store,
      template: "<App :original_lists='lists' />",
      components: { App }
    });
  }
});

