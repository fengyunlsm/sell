<template>
  <div id='app'>
    <v-header :seller="seller"></v-header>
    <div class="bar">
      <div class="bar-item">
          <router-link to="/goods">商品</router-link>
      </div>
      <div class="bar-item">
          <router-link to="/ratings">评价</router-link>
      </div>
      <div class="bar-item">
          <router-link to="/comments">商家</router-link>
      </div>
    </div>
      <keep-alive >
        <router-view :seller="seller" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    <router-view :seller="seller" v-if="!$route.meta.keepAlive"></router-view>

    <!-- <router-view ></router-view> -->
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header.vue'

const ERR_OK = 0

export default {
  data: function () {
    return {
      seller: {},
      ratings: {}
    }
  },
    created: function () {
      this.$http.get('/api/seller').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.seller = response.data
        }
      })
    },
      components: {
        'v-header': header
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.bar
    display: flex
    width: 100%
    height: 80px
    line-height: 80px
    .bar-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 28px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
