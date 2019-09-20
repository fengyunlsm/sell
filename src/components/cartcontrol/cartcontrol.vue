<template lang="html">
  <div class="control">
    <transition name="fade">

    <div class="decrease-control" v-show="this.food.count > 0"
       @click="decreaseCart($event)">
       <transition name="inner">
         <span class="inner icon-remove_circle_outline"></span>
       </transition>
    </div>
  </transition>

    <div class="shop-counts" v-show="this.food.count > 0">
      {{this.food.count}}
    </div>
    <div class="increase-control icon-add_circle" @click="addCart($event)">

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'

export default {
  props: {
    food: {
      type: Object
    }
  },
  data: function () {
    return {
      foodCount: 0
    }
  },
  methods: {
    addCart (event) {
      // if (!event._constructed) {
      //   return
      // }
      // this.foodCount = this.foodCount + 1
      // console.log('this.foodCount: ' + this.foodCount)
      // return this.foodCount

      // 第一部分：如果food.count 不存在时，添加属性并置1。否则，在原来的基础增加1
      // 第二部分：再修改html 的文本  --
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count = this.food.count + 1
      }
      this.$emit('increment', event.target)
    },
    decreaseCart (event) {
      // if (!event._constructed) {
      //   return
      // }
      // this.foodCount = this.foodCount - 1
      // console.log('this.foodCount: ' + this.foodCount)
      // return this.foodCount
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count = this.food.count - 1
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/style.css"

.control
  font-size: 0
  .decrease-control, increase-control
    cursor: pointer
    display: inline-block
    position: absolute
    right: 66px
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.4s linear
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0
      transform: translate3d(24px, 0, 0)
    }
    .inner
      display: inline-block
      font-size: 24px
      color: rgb(0, 160, 220)
      line-height: 24px
      &.inner-enter-active, &.inner-leave-active {
        transition: all 0.4s linear
        transform: rotate(0)
      }
      &.inner-enter, &.inner-leave-active {
        opacity: 0
        transform: rotate(180deg)
      }
  .shop-counts
    position: absolute
    right: 42px
    width: 24px
    text-align: center
    display: inline-block
    font-size: 10px
    color: rgb(147, 153, 159)
    line-height: 24px
  .increase-control
    cursor: pointer
    position: absolute
    right: 18px
    font-size: 24px
    color: rgb(0, 160, 220)
    line-height: 24px
</style>
