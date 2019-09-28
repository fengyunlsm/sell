<template>
  <div class="food" v-show="showFlag" transition="move">
    <div class="content">
      <div class="content-header">
        <div class="image-wrapper">
          <img :src="food.image">
        </div>
        <div class="leave-wrapper" @click="showFlag = false">
          <i class="icon-arrow_lift" ></i>
        </div>
      </div>
      <div class="content-detail">
        <h1 class="food-header">{{food.name}}</h1>
        <div class="detail">
          <span class="detail-sellcount">月售{{food.sellCount}}份</span>
          <span class="detail-rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="new-price">¥ {{food.price}}</span>
          <span class="old-price" v-show="food.oldPrice">¥ {{food.oldPrice}}</span>
        </div>
        <div class="shopcart-wrapper">
          <cartcontrol :food="food" ref="cartcontrol" v-show="food.count > 0 || food.count"></cartcontrol>
          <transition name="fade">
          <div class="buy" v-show="!food.count" @click="addFirstShop($event)">
            <span class="detail" >加入购物车</span>
          </div>
        </transition>
        </div>
      </div>
      <split v-show="food.info!=''"></split>
      <div class="commodity-introduce" v-show="food.info!=''">
        <div class="name">
          商品介绍
        </div>
        <div class="contents">
          {{food.info}}
        </div>
      </div>
      <split></split>
      <div class="commodity-evaluate">
        <div class="headers">
          商品评价
        </div>
        <ratingselect @filterByLabel="filterByLabel" @setSelectType="setSelectType"
        @filterByContent="filterByContent"
        @setDefaultContentType="setDefaultContentType"
        @setContentType="setContentType" ref="ratingselect" :ratings="food.ratings"
         :type-Select="selectType" :contentType="contentType" :tag="tag">
       </ratingselect>
      </div>
      <div class="comments-wrapper">
        <ul>
          <li v-for="rating in selectEval" v-bind:key="rating.id">
            <div class="user-info">
              <span class="time">{{date(rating.rateTime)}}</span>
              <span class="username">{{rating.username}}</span>
              <img class="user-avater" :src="rating.avatar">
            </div>
            <div class="user-comment">
              <i class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i>
              <span class="comment">{{rating.text}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'

/* eslint-disable no-unused-vars */
const ALL = 0
const POSITIVE = 1
const NEVIGATE = 2

export default {
  props: {
    food: {
      type: Object,
      default () {
        return {
          'ratings': []
        }
      }
    }
  },
  components: {
    'cartcontrol': cartcontrol,
    'split': split,
    'ratingselect': ratingselect
  },
  data: function () {
    return {
      showFlag: false,
      selectType: ALL,
      contentType: true,
      tag: ['全部', '推荐', '吐槽']
    }
  },
  created () {
    // 计算属性是不一致的情况下  进行设定  参考 混日子
    console.log('food.ratings:', this.food.ratings)
  },
  computed: {
    selectEval () {
      // 根据标签和内容显示与否 来显示评论
      let resultByLabel = this.filterByLabel(this.selectType)
      let result = this.filterByContent(resultByLabel, this.contentType)
      return result
    }
  },
  methods: {
    filterByContent (filterList, contentType) {
      // 根据是否显示全部内容进行过滤
      let getNoContentComment = function () {
        let newList = [] // 不能获取到长度  如何才能获取到长度呢
        for (let i = 0; i < filterList.length; i++) {
          if (filterList[i].text !== '') {
            newList.push(filterList[i])
          }
        }
        return newList
      }

      let noContentComment = getNoContentComment()
      let hasContentComment = filterList

      if (contentType === true) {
        return hasContentComment
      } else {
        return noContentComment
      }
    },
    filterByLabel (filterType = 0) {
      // 根据标签来筛选评论
      if (filterType === 0) {
        // 全部, 这里显示默认为空
        return this.food.ratings
      } else {
        let newFilterType = filterType - 1
        let filterList = []
        // 推荐 和 吐槽 和
        // length 拿不到这个长度 那怎么才能拿到
        // 获取生命周期
        for (let i = 0; i < this.food.ratings.length; i++) {
          if (this.food.ratings[i].rateType === newFilterType) {
            filterList.push(this.food.ratings[i])
          }
        }
        // 过滤内容为空/全部的评价
        // 不能获取长度
        return filterList
      }
    },
    setShowFlag () {
      /* eslint-disable no-unused-vars */
      // 功能：点击显示该页面
      // showFlag 默认是flag , 其次 当被点击的时候，就显示
      this.showFlag = true
      this.$nextTick(() => {
        if (!this.shopscroll) {
          let shopdetail = document.querySelector('.food')
          this.shopscroll = new BScroll(shopdetail)
        } else {
          this.shopscroll.refresh()
        }
      })
    },
    addFirstShop (event) {
      console.log('addFirstShop')
      // if (!event._constructed) {
      //   // 去掉自带的点击事件,暂时不需要，暂时认为是better-scroll才需要
      //   return
      // }
      this.$refs.cartcontrol.addCart(event)
    },
    date (time) {
      let date = new Date(time)
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
    },
    setSelectType (selectType) {
      this.selectType = selectType
    },
    setDefaultContentType () {
      this.contentType = true
    },
    setContentType () {
      if (this.contentType === true) {
        this.contentType = false
      } else {
        this.contentType = true
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
@import "../../common/style.css"
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-idnex: 30px
    height: 100%
    width: 100%
    overflow: auto
    backdrop-filter: blur(10px)
    background: #ffffff
    &.move-transition
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave
      transform: translate3d(100%, 0, 0)
    .content
      padding-bottom: 134px
      .content-header
        .image-wrapper
          position: relative
          width: 100%
          height: 0
          padding-top: 100%
          img
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
        .leave-wrapper
          cursor: pointer
          position: absolute
          left: 0px
          top: 10px
          padding: 2px 2px
          .icon-arrow_lift
            display: block
            font-size: 20px
            color: #fff
      .content-detail
        position: relative
        padding: 18px 18px 0px 18px
        .food-header
          marign-bottom:18px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
          line-height: 14px
        .detail
          margin-top: 8px
          marign-bottom: 18px
          .detail-sellcount
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 10px
            marign-right: 12px
          .detail-rating
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 10px
            margin-left: 12px
        .price
          display: inline-block
          margin-top: 18px
          margin-right: 8px
          margin-bottom: 18px
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
        .shopcart-wrapper
          display: inline-block
          position: absolute
          width: 74px
          height: 24px
          right: 18px
          bottom: 18px
          .buy
            display: table
            z-index: 5px
            width: 74px
            height: 24px
            border-radius: 12px
            background-color: rgb(0, 160, 220)
            text-align: center
            cursor: pointer
            &.fade-enter-active, &.fade-leave-active {
              transition: all 1s
            }
            &.fade-enter, &.fade-leave-to {
              opacity:0
            }
            .detail
              display: table-cell
              vertical-align: middle
              font-size: 10px
              color: rgb(255, 255, 255)
              height: 12px
      .commodity-introduce
        position: relative
        margin: 18px 18px
        .name
          position: absolute
          left: 0px
          top: 0px
          padding-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)
          line-height: 14px
          font-weight: 700
        .contents
          position: relative
          top: 10px
          display: block
          padding: 6px 8px 0px 8px
          font-size: 12px
          font-weight: 200
          color: rgb(77, 85, 93)
          line-height: 24px
      .commodity-evaluate
        margin: 18px 18px
        .headers
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)
          line-height: 14px
          font-weight: 700
      .comments-wrapper
        margin: 16px 18px 0px 18px
        .user-info
          position: relative
          .time
            display: inline-block
            margin-bottom: 6px
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px
          .username
            display: inline-block
            position: absolute
            top: 0px
            right: 18px
            margin: 0px 6px 6px 0px
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px
          .user-avater
            display: inlibe-block
            position: absolute
            top: 0px
            right: 0px
            width: 12px
            height: 12px
            border-radius: 50%
        .user-comment
          position: relative
          margin: 6px 0px 16px 0px
          font-size: 1px
          .icon
            display: inline-block
            margin-right: 4px
            font-size: 12px
            line-height: 24px
            &.icon-thumb_up
              color: rgb(0, 160, 220)
            &.icon-thumb_down
              color: rgb(147, 153, 159)
          .comment
            vertical-align: center
            margin-left: 4px
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 16px
</style>
