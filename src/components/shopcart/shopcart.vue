<template lang="html">
  <div class="shopcart">
    <div class="background" v-show="this.isShowShopCart" @click="shopcartStatus = false">
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
  computed: {

    sumPrice () {
      // 商品总价 = sum(商品数量 * 商品单价)
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
    settlementStatus () {
      // 当购物车有数量的时候 ， 购物车样式发生改变， 价格亮度发生改变
      // 如果 sumPrice = 0, 则返回  ¥ 20元起送
      // 如果 0 < sumPrice < 20, 则返回 还差¥ (20-sumPrice)元起送
      // 如果 sumPrice >= 20，则返回  去结算 并且样式变成绿色
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
        return true
      } else {
        return false
      }
    }
  },
  methods: {
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
      // el 当前的DOM
      // window.innerHeight 浏览器视口高度
      // top left right bottom 距离视口的位置
      // transform 属性向元素应用2D 到 3D 的转换
      // 起始状态
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)` // 考虑了兼容性问题
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
          let inner = el.getElementsByClassName('inner-hook')[0] // inner-hoot 是什么意思
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
        this.shopcartStatus = false
        this.$emit('clear')
      }
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
  height: 108px
  width: 100%
  z-index: 100
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
        width: 88px
        height: 88px
        padding: 12px
        margin: 0px 24px
        top: -20px
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
            line-height: 88px
            font-size: 48px
            color: #80858a
            left: 20px
            &.shopping-cart-hightline
              color: white
        .stuffs-count
          display: inline-block
          position: absolute
          top: 0px
          right: 0px
          width: 48px
          height: 24px
          font-size: 18px
          font-weight: 700
          border-radius: 12px
          color: rgb(255, 255, 255)
          line-height: 24px
          background-color: rgb(240, 20, 20)
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
          text-align: center
      .price
        display: inline-block
        position: absolute
        padding-right: 24px
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        font-size: 32px
        color: rgba(255, 255, 255, 0.4)
        font-weight: 700
        line-weight: 48px
        margin-top: 24px
        height: 60px
        margin-bottom: 24px
        line-height: 60px
        box-sizing: border-box
        &.price-hightline
          color: white
      .description
        display: inline-block
        vertical-align: top
        margin: 0 100px
        font-size: 32px
        color: rgba(255, 255, 255, 0.4)
        font-weight: 700
        line-height: 108px
    .content-right
      position: absolute
      right: 0px
      bottom: 0px
      width: 210px
      height: 108px
      margin-left: 16px
      font-size: 24px
      color: rgba(255, 255, 255, 0.4)
      font-weight: 700
      line-height: 108px
      text-align: center
      background-color: #2b333b
      &.content-right-hightline
        background-color: rgb(0, 160, 220)
        color: rgb(255, 255, 255)
        cursor: pointer
  .ball-container
    .ball
      position: fixed
      left: 64px
      bottom: 44px
      z-index: 200px
      transition: all 0.4s cubic-bezier(.25, -0.69, .58, .78)
      .inner
        width: 32px
        height: 32px
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
      height: 80px
      line-height: 80px
      padding: 0px 36px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .cart-header
        float: left
        font-size: 28px
        color: rgb(7, 17, 27)
      .clear
        float: right
        font-size: 24px
        color: rgb(0, 160, 220)
        cursor: pointer
    .shopcart-content
      padding: 0 36px
      max-height: 434px
      background-color: #ffffff
      overflow: auto
      .shopcart-list
        position: relative
        padding: 24px 0
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          display: inline-block
          fonts-size: 28px
          color: rgb(7, 17, 27)
          line-height: 48px
        .price
          display: inline-block
          position: absolute
          bottom: 24px
          right: 180px
          font-size: 28px
          color: rgb(240, 20, 20)
          line-height: 48px
          font-weight: 700
        .cartcontrol-wrapper
          display: inline-block
          position: absolute
          width: 144px
          height: 48px
          right: 0px
          bottom: 24px
</style>
