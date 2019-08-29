<template >
  <div class="header">
      <div class="content-wrapper">
          <div class="avatar">
              <img :src="seller.avatar" width="64px" height="64px">
          </div>
          <div class="content">
            <div class="title">
                <span class="brand"></span>
                <span class="name">{{seller.name}}</span>
            </div>
            <div class="description">
                {{seller.description}}/{{seller.deliveryTime}}分钟送达
            </div>
            <div v-if="seller.supports" class="supports">
                <span class="icon" :class="this.classMap[this.seller.supports[0].type]"></span>
                <span class="text">{{this.seller.supports[0].description}}</span>
            </div>
        </div>
          <div v-if="seller.supports" class="support-count" @click="showDetail" >
            <div class="supports-swapper">
              <div class="count">
                {{seller.supports.length}}个
              </div><i class="icon-keyboard_arrow_right"></i>
            </div>
          </div>
      </div>
      <div class="bulletin-wrapper" @click="showDetail">
          <span class="notice"></span>
          <span class="introduce">{{seller.bulletin}}</span>
          <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
          <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <div class="detail" v-show="detailShow" transition="fade">
          <div class="detail-wrapper clearfix">
              <div class="detail-main">
                  <div class="name">{{seller.name}}</div>
                  <div class="star-wrapper">
                    <star :size="48" :score="seller.score"></star>
                  </div>
                  <div class="title">
                    <div class="line"></div>
                    <div class="text">
                      优惠信息
                    </div>
                    <div class="line"></div>
                  </div>
                  <div v-if="seller.supports" class="suports">
                    <ul class="item-supports" v-for="item in seller.supports" v-bind:key="item.id">
                      <li>
                        <span class="icon" :class="classMap[item.type]"></span>
                        <span class="text">{{seller.supports[item.type].description}}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="title">
                    <div class="line"></div>
                    <div class="text">
                      商家公告
                    </div>
                    <div class="line"></div>
                  </div>
                  <div class="bulletin">
                    <div class="content">
                      <p>{{seller.bulletin}}</p>
                    </div>
                  </div>
              </div>
          </div>
          <div class="detail-close" @click="closeDetail">
            <i class="icon-close"></i>
          </div>
      </div>
  </div>
</template>

<script type="text/javascript">
  import star from '../star/star'
    export default {
      props: {
        seller: {
          type: Object
        }
      },
      data () {
        return {
            detailShow: false
        }
      },
      methods: {
        showDetail () {
          this.detailShow = true
        },
        closeDetail () {
          this.detailShow = false
        }
      },
      created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      },
      components: {
        'star': star
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
@import "../../common/style.css"

.header
  position: relative
  color: #fff
  background: rgba(7, 17, 27, 0.5)
  .content-wrapper
    font-size: 0px
    position: relative
    padding: 24px 12px 18px 24px
    .avatar
      display: inline-block
      vertical-align: top
    .content
      display: inline-block
      font-size: 12px
      padding-left: 16px
      .title
        margin: 2px 0px 8px 0px
        .brand
          display: inline-block
          vertical-align: top
          width:30px
          height:18px
          bg-image("brand")
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          margin-left: 6px
          font-size: 16px
          font-weight:blod
          line-height: 18px
      .description
        padding-bottom: 10px
        font-size: 12px
        font-weight: 200
        line-height: 12px
      .supports
        .icon
          display: inline-block
          vertical-align:top
          width: 12px
          height: 12px
          padding-bottom: 2px
          margin-right: 4px
          background-size: 12px 12px
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
        .text
          font-size: 10px
          font-weight: 100
          line-weight: 12px
    .support-count
      cursor: pointer
      position: absolute
      right: 12px
      bottom: 24px
      height: 24px
      padding: 0 8px
      font-size: 10px
      line-height: 24px
      border-radius: 12px
      background: rgba(0, 0, 0, 0.2)
      text-align: center
      .supports-swapper
        .count
          display: inline-block
          font-size: 10px
          color: rgb(255, 255, 255)
          font-weight: 200
          line-height: 12px
        .icon-keyboard_arrow_right
          display: inline-block
  .bulletin-wrapper
    cursor: pointer
    display: block
    position: relative
    padding: 0px 22px 0px 12px
    height: 28px
    line-height: 28px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    background: rgba(7, 17, 27, 0.2)
    font-size: 0px
    .notice
      display: inline-block
      vertical-align: middle
      width: 22px
      height: 12px
      background-size: 22px 12px
      background-repeat: no-repeat
      bg-image("bulletin")
    .introduce
      vertical-align: middle
      margin: 0px 4px 0px 4px
      font-size: 10px
      font-weight: 100
    .icon-keyboard_arrow_right
      position: absolute
      font-size: 10px
      right: 12px
      top: 50%
      transform: translate(0, -50%)
  .background
    position: absolute
    top: 0px
    left: 0px
    width: 100%
    height:100%
    z-index: -1
    blur:(10px)
  .detail
    position: fixed
    top: 0px
    left: 0px
    width: 100%
    height: 100%
    overflow: auto
    background-color: rgba(7, 17, 27, 0.8)
    blur: (10px)
    z-index: 100
    transition: all 0.8s
    &.fade-transition
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
    &.fade-enter, &.fade-leave
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrapper
      min-height: 100%
      .detail-main
        position: relative
        margin-top: 64px
        margin-bottom: 64px
        margin-left: 36px
        margin-right: 36px
        .name
          display: relative
          font-size: 16px
          font-weight: 700
          line-height: 16px
          text-align: center
        .star-wrapper
          margin-top: 18px
          padding: 2px 0
          text-align: center
        .title
          display: flex
          margin: 30px 0px 24px 0px
          .line
            flex: 1
            display: relative
            top: 50%
            transform: translate(0, -45%)
            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
          .text
            margin: 0px 12px
        .suports
          position: relative
          margin: 24px 12px 28px 12px
          .item-supports
            display: relative
            font-size: 0px
            .icon
              display: inline-block
              width: 16px
              height: 16px
              margin-bottom: 12px
              margin-right: 6px
              background-size: 16px 16px
              background-repeat: no-repeat
              &:last-child
                margin-bottom: 0px
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              position: absolute
              margin-top: 2px
              font-size: 12px
              font-weight: 100
              color: rgb(255, 255, 255)
              line-height: 12px
        .bulletin
          position: relative
          .content
            margin: 0px 12px
            font-size: 12px
            font-weight: 100
            color: rgb(255, 255, 255)
            line-height: 24px
    .detail-close
      position: relative
      width: 32px
      height: 32px
      margin: 64px auto 0 auto
      clear: both
      font-size: 32px
</style>
