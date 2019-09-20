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
            <li v-for="item in goods" v-bind:key="item.id" class="shop shoplists" >
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
      for (let i = 0; i < this.height.length; i++) {
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
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = document.querySelectorAll('.shoplists')
      for (var i = 0; i < foodList.length; i++) {
        // 将距离顶部的高度放到
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
      console.log('incrementTotal')
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

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 58px
  overflow: hidden
  width: 100%
  .menu-wrapper
    width: 80px
    background: #f3f5f7
    .item-menu
      cursor: pointer
      position: relative
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      font-size: 0px
      .each-item
        display: table-cell
        vertical-align: middle
        font-size: 0px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .icon
          display: inline-block
          position: relative
          width: 12px
          height: 12px
          padding-bottom: 2px
          margin-right: 1px
          background-size: 12px 12px
          background-repeat: no-repeat
          top: 2px
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
          font-size: 12px
          color: #6d7073
          line-height: 14px
          font-weight: 200
          &.current
            color: rgb(7, 17, 27)
            font-size: 12px
            line-height: 14px
            font-weight: 600
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
  .shoplist-wrapper
    position: relative
    width: 100%
    .shop
      .title
        height: 26px
        border-left: 2px solid #d9dde1
        padding-left: 14px
        background-color: #f3f5f7
        font-size: 12px
        color: rgb(147, 153, 159)
        line-height: 26px
      .package-information
        position: relative
        padding: 18px 18px
        font-size: 0px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .picture
          cursor: pointer
          display: inline-block
          marign-right: 10px
          background-size: 12px 12px
          background-repeat: no-repeat
        .detail
          display: inline-block
          vertical-align: top
          margin-left: 10px
          margin-top: 2px
          position: absolute
          .name
            font-size: 14px
            color: rgb(7, 17, 27)
            line-height: 14px
            margin-bottom: 8px
          .description
            margin: 8px 0px
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 15px
          .sale-information
            margin: 8px 0px
            font-size: 0px
            color: rgb(147, 153, 159)
            line-height: 10px
            .sellcount
              margin-right: 12px
              font-size: 10px
            .rating
              margin-right: 12px
              font-size: 10px
          .price
            display: inline-block
            margin-top: 8px
            margin-right: 8px
            .new-price
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
              font-weight: 350
              line-weight: 24px
            .old-price
              margin-left: 0px
              font-size: 10px
              color: rgb(147, 153, 159)
              font-weight: normal/700
              line-weight: 24px
        .cart
          position: absolute
          width: 48px
          height: 24px
          right: 0px
          bottom: 18px

</style>
