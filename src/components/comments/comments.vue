<template lang="html">
  <div class="seller-wrapper">
    <div class="title-wrapper">
        <div class="title-header">
          <div class="title">
            {{seller.name}}
          </div>
          <div class="description">
            <div class="star-wrapper" style="display: inline-block;">
              <star :size="36" :score="seller.score"></star>
            </div>
            <span class="ratingCount">({{seller.ratingCount}})
            </span>
            <span class="sellcount">月售{{seller.sellCount}}单</span>
          </div>
        </div>
        <div class="collection">
          <i class="icon-favorite"></i>
          <div class="favorite-status">
            已收藏
          </div>
        </div>
    </div>
    <div class="detail-wrapper">
      <div class="minprice">
        <div class="title">
          起送价
        </div>
        <div class="price">
          {{seller.minPrice}}元
        </div>
      </div>
      <div class="deliveryprice">
        <div class="title">
          商家配送
        </div>
        <div class="price">
          {{seller.deliveryPrice}}元
        </div>
      </div>
      <div class="deliverytime">
        <div class="title">
          平均配送时间
        </div>
        <div class="time">
          {{seller.deliveryTime}}分钟
        </div>
      </div>
    </div>
    <split></split>
    <div class="bulletin-wrapper">
      <div class="title">
        公告与活动
      </div>
      <div class="bulletin">
        {{seller.bulletin}}
      </div>
    </div>
    <ul class="support-wrapper">
      <li class="each-supports" v-for="support in seller.supports" v-bind:key="support.id">
        <span class="brand" :class="classMap[support.type]"></span><span class="description">{{support.description}}</span>
      </li>
    </ul>
    <split></split>
    <div class="realscence-wrapper">
      <div class="title">
        商家实景
      </div>
      <div class="picture" ref="bigWrapper">
        <ul class="picture-wrapper" ref="picWrapper">
          <li class="each-picture" v-for="pic in seller.pics" v-bind:key="pic.id">
            <img :src="pic" width="120" height="120" alt="">
          </li>
        </ul>
      </div>
    </div>
    <split></split>
    <div class="info-wrapper">
      <div class="title">
        商家信息
      </div>
      <div class="info">
        <ul class="info-wrappers">
          <li class="each-info" v-for="info in seller.infos" v-bind:key="info.id">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star'
import split from '../split/split'
import BScroll from 'better-scroll'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.$nextTick(() => {
      this.pictureScroll()
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    pictureScroll () {
      let picWidth = 120
      let margin = 6
      let width = (picWidth + margin) * this.seller.pics.length - margin
     this.$refs.picWrapper.style.width = width + 'px'
     this.$nextTick(() => {
       if (!this.scroll) {
         this.scroll = new BScroll(this.$refs.bigWrapper, {
           startX: 0,
           click: true,
           scrollX: true,
           scrollY: false,
           eventPassthrough: 'vertical'
         })
       } else {
         this.scroll.refresh()
       }
     })
    }
  },
  components: {
    'split': split,
    'star': star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.seller-wrapper
  margin: 18px 18px
  .title-wrapper
    position: relative
    margin-bottom: 18px
    .title-header
      display: inline-block
      .title
        margin-bottom: 8px
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
      .description
        display: table
        postion: relative
        margin-top: 8px
        font-size: 0px
        .star-wrapper
          /* position: absolute */
          display: inline-block
          left: 0px
          margin-right: 8px
        .ratingCount
          display: inline-block
          margin-right: 12px
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 18px
        .sellcount
          display: inline-block
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 18px
    .collection
      display: inline-block
      text-align: center
      position: absolute
      right: 0px
      bottom: 0px
      .icon-favorite
        margin-bottom: 8px
        font-size: 24px
        color: rgb(240, 20, 20)
        line-height: 24px
      .favorite-status
        margin-top: 8px
        font-size: 10px
        color: rgb(77, 85, 93)
        line-height: 10px
  .detail-wrapper
    display: flex
    margin: 18px 0px
    border-top: 1px solid rgba(7, 17, 27, 0.1)
    .minprice
      flex: 1
      text-align: center
      position: relative
      margin-top: 18px
      border-right: 1px solid rgba(7, 17, 27, 0.1)
      .title
        postion: absolute
        margin-bottom: 4px
        font-size: 10px
        color: rgb(147, 153, 159)
        line-height: 10px
      .price
        margin-top: 10px
        font-weight: 200
        color: rgb(7, 17, 27)
        line-height: 24px
    .deliveryprice
      flex: 1
      text-align: center
      margin-top: 18px
      border-right: 1px solid rgba(7, 17, 27, 0.1)
      .title
        margin-bottom: 4px
        font-size: 10px
        color: rgb(147, 153, 159)
        line-height: 10px
      .price
        margin-top: 10px
        font-weight: 200
        color: rgb(7, 17, 27)
        line-height: 24px
    .deliverytime
      flex: 1
      text-align: center
      .title
        margin-top: 18px
        postion: absolute
        top: 18px
        margin-bottom: 4px
        font-size: 10px
        color: rgb(147, 153, 159)
        line-height: 10px
      .time
        margin-top: 10px
        font-weight: 200
        color: rgb(7, 17, 27)
        line-height: 24px
  .bulletin-wrapper
    padding: 18px 18px 16px 18px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    .title
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
      margin-bottom: 8px
      font-weight: 600
    .bulletin
      margin: 8px 12px 0px 12px
      font-size: 12px
      font-weight: 200
      color: rgb(240, 20, 20)
      line-height: 24px
  .support-wrapper
    position: relative
    margin: 0px 16px 0px 18px
    .each-supports
      padding: 16px 12px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .brand
        display: inline-block
        vertical-align: middle
        width: 16px
        height: 16px
        padding-right: 6px
        line-height: 16px
        vertical-align: center
        background-size: 16px 16px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_1')
        &.discount
          bg-image('discount_1')
        &.guarantee
          bg-image('guarantee_1')
        &.invoice
          bg-image('invoice_1')
        &.special
          bg-image('special_1')
      .description
        display: inline-block
        font-size: 12px
        font-weight: 200
        color: rgb(7, 17, 27)
        line-height: 16px
  .realscence-wrapper
    padding: 18px 18px
    .title
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
      padding-bottom: 12px
      font-weight: 600
    .picture
      cursor: pointer
      width: 100%
      overflow: hidden
      white-space: nowrap
      .picture-wrapper
        font-size: 0px
        .each-picture
          pointer-events: none
          display: inline-block
          width: 120px
          height: 90px
          padding-right: 6px
          background-repeat: no-repeat
  .info-wrapper
    margin: 18px 18px
    .title
      margin-bottom: 12px
      font-size: 14px
      color: rgb(7, 17, 27)
      line-height: 14px
      font-weight: 600
    .info
      .info-wrappers
        position: relative
        .each-info
          padding-left: 12px
          padding-top: 16px
          padding-bottom: 16px
          border-top: 1px solid rgba(7, 17, 27, 0.1)
          font-size: 12px
          font-weight: 200
          color: #07111b
          line-height: 16px
</style>
