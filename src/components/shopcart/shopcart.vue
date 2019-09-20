<template lang="html">
  <div class="shopcart">
    <div class="background" v-show="this.isShowShopCart" @click="closeCart">
    </div>
    <div class="content" @click="isClickShopcart">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="shops-count">
            {{this.shopsCount}}
          </div>
          <div class="logo" :class="{'logo-hightline': this.shopsCount > 0}">
            <span class="icon-shopping_cart" :class="{'shopping-cart-hightline': this.shopsCount > 0}"></span>
          </div>
          <div class="stuffs-count">
            {{this.shopsCount}}
          </div>
        </div>
        <div class="price" :class="{'price-hightline': this.shopsCount > 0}">
        ¥ {{sumPrice}}
        </div>
        <div class="description" >
        另需配送费¥ {{deliveryPrice}}元
        </div>
      </div>
      <div class="content-right" :class="{'content-right-hightline': this.sumPrice >= 20}">
        {{settlementStatus}}
      </div>
    </div>
    <div class="ball-container">
      <div v-for="ball in balls" v-bind:key="ball.id">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div v-show="ball.show" class="ball">
            <div class="inner inner-hook">
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="shopcart-detail" v-show="this.isShowShopCart">
      <div class="shopcart-header">
        <h1 class="cart-header">购物车</h1>
        <span class="clear" @click="clearShopcart" >清空</span>
      </div>
      <div class="shopcart-content">
        <ul>
          <li class="shopcart-list" v-for="food in this.goodsList" v-bind:key="food.id">
            <div class="name">
              {{food.name}}
            </div>
            <div class="price">
              ¥ {{food.price * food.count}}
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import cartcontrol from '../cartcontrol/cartcontrol'

export default {
  props: {
    deliveryPrice: {
      type: Number
    },
    minPrice: {
      type: Number
    },
    goodsList: {
      type: Array,
      default () {
        return [
          {
            price: 0,
            count: 0
          }
        ]
      }
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }],
        dropBalls: [],
        shopcartStatus: false
    }
  },

  created () {
    console.log('shopcart start')
  },
  computed: {
    // 商品总价 = sum(商品数量 * 商品单价)
    //
    // 商品数量 goodsList.length    商品单价 goodsList[i].price
    // goodsList 是未知
    sumPrice () {
      let sumPrice = 0
      // for (var i = 0; i < this.shopsCount(); i++) {
      //   sumPrice = sumPrice + this.goodsList[i].price
      // }
      // return sumPrice
      this.goodsList.forEach((food) => {
        sumPrice = sumPrice + food.price * food.count
      })
      return sumPrice
    },
    // 当购物车有数量的时候 ， 购物车样式发生改变， 价格亮度发生改变
    // 如果 sumPrice = 0, 则返回  ¥ 20元起送
    // 如果 0 < sumPrice < 20, 则返回 还差¥ (20-sumPrice)元起送
    // 如果 sumPrice >= 20，则返回  去结算 并且样式变成绿色
    settlementStatus () {
      let remainPrice = 0
      if (this.sumPrice === 0) {
        return '¥ 20元起送'
      } else if (this.sumPrice > 0 && this.sumPrice < 20) {
        remainPrice = 20 - this.sumPrice
        return '还差 ¥ ' + remainPrice.toString() + '起送'
      } else {
        return '去结算'
      }
    },
    // 购物车的数量大于 0 时， 购物车的背景显示为蓝色， 购物车显示为白色
    // 购物车的数量 大于 0 时， 左上角的数字显示
    shopsCount () {
      let count = 0
      // for (var i = 0; i < this.goodsList.length; i++) {
      //   count = count + 1
      // }
      // console.log('shopsCount: ', count)
      // return 4
      // 如果this.goodsList 是空怎么处理
      if (this.goodsList === []) {
        return count
      }
      this.goodsList.forEach((food) => {
        count = count + food.count
      })
      return count
    },
    isShowShopCart () {
      // 如果被点击且有商品，则弹出弹窗， 显示内容
      // 如果没有，则关闭弹窗， 显示内容
      // 再次被点击则关闭前端窗口
      if (this.shopcartStatus && this.goodsList.length > 0) {
        console.log('showShopCart: ', 'true')
        return true
      } else {
        console.log('showShopCart: ', 'false')
        return false
      }
    }
  },
  methods: {
    closeCart () {
      this.shopcartStatus = false
    },
    isClickShopcart () {
      if (!this.shopcartStatus) {
        // 设置为真
        this.shopcartStatus = true
      } else {
        // 设置为假
        this.shopcartStatus = false
      }
      return this.shopcartStatus
    },
    drop (el) {
      console.log('el', el)
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter (el) {
      // 求出add-dom 距离购物车的x，y距离
      // 起始状态
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
      enter (el) {
        /* eslint-disable no-unused-vars */
        // 最终状态
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3d(0, 0, 0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
        })
      },
      afterEnter (el) {
        // 作为一个动画，取一个dropball,恢复小球的默认值
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      clearShopcart () {
        // 清空购物车
        // 关闭购物车
        // 将购物车数量清零
        // 数量还在
        // 购物车件数仍旧存在
        // this.goodsList.splice(0, this.goodsList.length)
        // 设置一定
        this.shopcartStatus = false
        this.$emit('clear')
        console.log('this.goodsList: ', this.goodsList)
      }
      // 点击下方，如果有商品，则弹出列表窗口;否则，不显示
      // how to make money
  },
  components: {
    'cartcontrol': cartcontrol
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.shopcart
  position: fixed
  bottom: 0
  left: 0
  height: 54px
  width: 100%
  z-index: 50
  .background
    position: fixed
    left: 0px
    top: 0px
    width: 100%
    height: 100%
    background-color: rgba(7,17,27,0.8)
    z-index: -1
  .content
    position: relative
    background-color: #141d27
    font-size: 0
    height: 100%
    .content-left
      .logo-wrapper
        display: inline-block
        position: relative
        width: 44px
        height: 44px
        padding: 6px
        margin: 0px 12px
        top: -10px
        border-radius: 50%
        background: #141d27
        .logo
          cursor: pointer
          position: relative
          width: 100%
          height: 100%
          border-radius: 50%
          background-color: #2b343c
          &.logo-hightline
            background-color: rgb(0, 160, 220)
          .icon-shopping_cart
            position: absolute
            line-height: 44px
            font-size: 24px
            color: #80858a
            left: 10px   // 使用计算的方法进行居中
            &.shopping-cart-hightline
              color: white
        .stuffs-count
          display: inline-block
          position: absolute
          top: 0px
          right: 0px
          width: 24px
          height: 12px
          font-size: 9px
          font-weight: 700
          border-radius: 6px
          color: rgb(255, 255, 255)
          line-height: 12px
          background-color: rgb(240, 20, 20)
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4)
          text-align: center
      .price
        display: inline-block
        position: absolute
        padding-right: 12px
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        font-size: 16px
        color: rgba(255, 255, 255, 0.4)
        font-weight: 700
        line-weight: 24px
        margin-top: 12px
        height: 30px
        margin-bottom: 12px
        line-height: 30px
        box-sizing: border-box
        &.price-hightline
          color: white
      .description
        display: inline-block
        vertical-align: top
        margin: 0 50px
        font-size: 16px
        color: rgba(255, 255, 255, 0.4)
        font-weight: 700
        line-height: 54px
    .content-right
      position: absolute
      right: 0px
      bottom: 0px
      width: 105px
      height: 54px
      margin-left: 8px
      font-size: 12px
      color: rgba(255, 255, 255, 0.4)
      font-weight: 700
      line-height: 54px
      text-align: center
      background-color: #2b333b
      &.content-right-hightline
        background-color: rgb(0, 160, 220)
        color: rgb(255, 255, 255)
        cursor: pointer
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200px
      transition: all 0.4s cubic-bezier(.25, -0.69, .58, .78)
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background: rgb(0, 160, 220)
        transition: all 0.4s linear
  .shopcart-detail
    position: absolute
    left: 0px
    top: 0px
    z-index: -1
    width: 100%
    transform translate3d(0, -100%, 0)
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s
      transform translate3d(0, -100%, 0)
    }
    &.fade-enter, &.fade-leave-active {
      transform translate3d(0, 0, 0)
    }
    .shopcart-header
      height: 40px
      line-height: 40px
      padding: 0px 18px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .cart-header
        float: left
        font-size: 14px
        color: rgb(7, 17, 27)
      .clear
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)
        cursor: pointer
    .shopcart-content
      padding: 0 18px
      max-height: 217px
      background-color: #ffffff
      overflow: auto
      .shopcart-list
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          display: inline-block
          fonts-size: 14px
          color: rgb(7, 17, 27)
          line-height: 24px
        .price
          display: inline-block
          position: absolute
          bottom: 12px
          right: 90px
          font-size: 14px
          color: rgb(240, 20, 20)
          line-height: 24px
          font-weight: 700
        .cartcontrol-wrapper
          display: inline-block
          position: absolute
          width: 72px
          height: 24px
          right: 0px
          bottom: 12px
</style>
