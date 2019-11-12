<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(item, index) in this.goods" class="item-menu" :key="item.id" :class="{'current': currentIndex===index}"
        @click="selectMenu(index, $event)">
        <div class="each-item">
          <span class="icon" v-show="item.type > 0" :class="classMap[item.type]"></span>
          <span class="title" :class="{'current': currentIndex === index}">{{item.name}}</span>
        </div>
        </li>
      </ul>
    </div>
    <div class="shoplist-wrapper" >
        <ul>
            <li v-for="item in goods" v-bind:key="item.id" class="shop shoplists">
              <div class="title">
                {{item.name}}
              </div>
              <ul  class="package-information" v-for="food in item.foods" v-bind:key="food.id">
              <li>
                <div class="picture" @click="selectedFood(food, $event)">
                  <img :src="food.icon">
                </div>
                <div class="detail">
                  <div class="name">
                    {{food.name}}
                  </div>
                  <span class="description">
                    {{food.description}}
                  </span>
                  <div class="sale-information">
                    <span class="sellcount">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="new-price">¥{{food.price}}</span>
                    <span class="old-price" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                  </div>
                </div>
                <div class="cart">
                  <cartcontrol @increment="incrementTotal" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
            </li>
        </ul>
      </div>
    <div class="">
      <shopcart @clear="clear" ref="shopcart" :goodsList="this.selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
      <food :food="this.selectFood" ref="food"></food>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data: function () {
    return {
      goods: [],
      height: [0],
      scrollY: 0,
      shoplistscroll: [],
      selectFood: {}
    }
  },
  computed: {
    currentIndex () {
      // scrollY 垂直滚动的像素数
      // this.height 不同类型的商品在右侧的范围

      // 功能:
      // 根据滚动条垂直滚动的距离 来决定 商品分类 所在的位置
      // 例子:
      // 如果在热销榜（h0 到 h1 的范围内），则返回 0
      // 如果在单人精彩套餐(h1 到 h2 的范围内)， 则返回 1
      for (let i = 0; i < this.height.length; i++) {
        // 自提地址信息是不一致的情况下
        let height1 = this.height[i]
        let height2 = this.height[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let selectfoods = []
      if (this.goods === []) {
        return selectfoods
      }
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count && food.count > 0) {
            selectfoods.push(food)
          }
        })
      })
      return selectfoods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    _initScroll () {
      /* eslint-disable no-unused-vars */
      // 定位父元素(ps: 其中子元素内容大于父元素)
      let shoplistwrapper = document.querySelector('.shoplist-wrapper')
      // click 代表点击事件
      this.shoplistscroll = new BScroll(shoplistwrapper, {click: true, probeType: 3})
      let menuwrapper = document.querySelector('.menu-wrapper')
      let menuscroll = new BScroll(menuwrapper, {click: true})
      this.shoplistscroll.on('scroll', (pos) => {
        // pos 的意思是 什么？
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      // 功能：求出每个分类的高度，并存放到数组中
      let foodList = document.querySelectorAll('.shoplists')
      for (var i = 0; i < foodList.length; i++) {
        // 将距离顶部的高度放到
        // foodList[i].offsetHeight 返回元素的高度。包括内边距和边框
        // 求出每个分类的高度
        let newHeight = this.height[i] + foodList[i].offsetHeight
        this.height.push(newHeight)
      }
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        // 去掉自带的点击事件
        return
      }
      let foodList = document.querySelectorAll('.shoplists')
      this.shoplistscroll.scrollToElement(foodList[index], 300)
    },
    selectedFood (food, event) {
      if (!event._constructed) {
        // 去掉自带的点击事件
        return
      }
      this.selectFood = food
      this.$refs.food.setShowFlag()
    },
    incrementTotal (target) {
      this.$refs.shopcart.drop(target)
    },
    clear () {
      this.goods.forEach((good) => {
        // 清空购物车
        good.foods.forEach((food) => {
          if (food.count && food.count > 0) {
            food.count = 0
          }
        })
      })
      console.log('selectFood', this.selectFood)
      // this.goodsList.splice(0, this.goodsList.length)
    }
  },
  components: {
    'shopcart': shopcart,
    'cartcontrol': cartcontrol,
    'food': food
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/style.css"


.goods
  display: flex
  position: absolute
  top: 348px
  bottom: 561px
  overflow: hidden
  width: 100%
  height: 100%
  .menu-wrapper
    width: 160px
    background: #f3f5f7
    .item-menu
      cursor: pointer
      position: relative
      display: table
      height: 108px
      width: 112px
      padding: 0 24px
      font-size: 0px
      .each-item
        display: table-cell
        vertical-align: middle
        font-size: 0px
        border: 1px solid transparent
        border-image: svg(1px-border param(--color red)) 2 2 stretch
        .icon
          display: inline-block
          position: relative
          width: 24px
          height: 24px
          padding-bottom: 4px
          margin-right: 2px
          background-size: 24px 24px
          background-repeat: no-repeat
          top: 4px
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .title
          font-size: 24px
          color: #6d7073
          line-height: 28px
          font-weight: 200
          &.current
            color: rgb(7, 17, 27)
            font-size: 12px
            line-height: 28px
            font-weight: 600
      &.current
        position: relative
        z-index: 20
        margin-top: -1px
        background: #fff
        font-weight: 700
  .shoplist-wrapper
    position: relative
    width: 100%
    .shop
      .title
        height: 52px
        border-left: 4px solid #d9dde1
        padding-left: 28px
        background-color: #f3f5f7
        font-size: 24px
        color: rgb(147, 153, 159)
        line-height: 52px
      .package-information
        position: relative
        padding: 36px 36px
        font-size: 0px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .picture
          cursor: pointer
          display: inline-block
          marign-right: 20px
          background-size: 24px 24px
          background-repeat: no-repeat
        .detail
          display: inline-block
          vertical-align: top
          margin-left: 20px
          margin-top: 4px
          position: absolute
          .name
            font-size: 28px
            color: rgb(7, 17, 27)
            line-height: 28px
            margin-bottom: 16px
          .description
            margin: 16px 0px
            font-size: 20px
            color: rgb(147, 153, 159)
            line-height: 30px
          .sale-information
            margin: 16px 0px
            font-size: 0px
            color: rgb(147, 153, 159)
            line-height: 20px
            .sellcount
              margin-right: 24px
              font-size: 20px
            .rating
              margin-right: 24px
              font-size: 20px
          .price
            display: inline-block
            margin-top: 16px
            margin-right: 16px
            .new-price
              margin-right: 16px
              font-size: 28px
              color: rgb(240, 20, 20)
              font-weight: 750
              line-weight: 28px
            .old-price
              margin-left: 0px
              font-size: 20px
              color: rgb(147, 153, 159)
              font-weight: normal/700
              line-weight: 48px
        .cart
          position: absolute
          width: 96px
          height: 48px
          right: 0px
          bottom: 36px

</style>
