// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from './components/goods/goods'
import comments from './components/comments/comments'
import ratings from './components/ratings/ratings'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)

// let app = Vue.extend(App)
// let router = new VueRouter()
const routes = [
  {path: '/goods', component: goods},
  {path: '/comments', component: comments},
  {path: '/ratings', component: ratings}
]

const router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
})
/* eslint-disable no-unused-vars */

let vue = new Vue({
  el: '#app',
  render: c => c(App),
  router: router
})
