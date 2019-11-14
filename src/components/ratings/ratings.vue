<template lang="html">
  <div class="evaluate">
    <div class="evaluate-wrapper">
      <div class="comprehensive-wrapper">
        <div class="score">
          {{seller.score}}
        </div>
        <h1 class="text">综合评分</h1>
        <div class="precentage">
          高于周边商家{{seller.rankRate}}%
        </div>
      </div>
      <div class="service-wrapper">
        <div class="serviceScore">
          <span class="text">服务态度</span>
          <div class="star-wrapper">
            <star :size="36" :score="seller.serviceScore"></star>
          </div>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="foodScore">
          <span class="text">食品质量</span>
          <div class="star-wrapper">
            <star :size="36" :score="seller.foodScore"></star>
          </div>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="deliveryTime">
          <span class="text">送达时间</span><span class="time">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <split></split>
    <div class="ratingselect-wrapper">
      <ratingselect ref="ratingselect" @filterByLabel="filterByLabel" @filterByContent="filterByContent" @setSelectType="setSelectType" @setDefaultContentType="setDefaultContentType" @setContentType="setContentType" :ratings="ratings" :type-Select="selectType" :contentType="contentType" :tag="tag"></ratingselect>
    </div>
    <ul class="comment-wrapper">
      <li class="comment-list" v-for="rating in selectEval" v-bind:key="rating.id">
        <div class="comment-header">
          <div class="header-left">
            <img :src="rating.avatar" class="img">
          </div>
          <div class="header-right">
            <div class="header-right-one">
              <span class="username">{{rating.username}}</span>
              <span class="time">{{date(rating.rateTime)}}</span>
            </div>
            <div class="header-right-two">
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
              </div>
              <span class="delivery-time" v-if="rating.deliveryTime>0">{{rating.deliveryTime}}分钟送达</span>
              <span class="delivery-time" v-else>38分钟送达</span>
            </div>
          </div>
        </div>
        <div class="comment-content">
          {{rating.text}}
        </div>
        <div class="comment-footer">
          <i class="icon" :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></i><ul class="recommend-list">
            <li v-for="rec in rating.recommend" v-bind:key="rec.id" class="each-recommend">
              <span class="recommend">{{rec}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import star from '../star/star'

/* eslint-disable no-unused-vars */
const ALL = 0
const POSITIVE = 1
const NEVIGATE = 2
const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data: function () {
    return {
      showFlag: false,
      selectType: POSITIVE,
      contentType: true,
      tag: ['全部', '满意', '吐槽'],
      ratings: []
    }
  },
  created: function () {
    this.$nextTick(() => {
      // this.selectEval = this.ratings   // 有必要删除这一行
      // this.showEval(this.selectType, this.contentType) 有必要删除这一行
    })
    this.$http.get('/api/ratings').then((response) => {
      let resp = response.body
      if (resp.errno === ERR_OK) {
        this.ratings = resp.data
      }
    })
  },
  computed: {

    selectEval () {
      // 根据类型 和  切换内容 来显示 所有评论
      let resultByLabel = this.filterByLabel(this.selectType)
      let result = this.filterByContent(resultByLabel, this.contentType)
      return result
    }
  },
  methods: {
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
    filterByContent (filterList, contentType) {
        // 根据是否显示全部内容进行过滤
      let getNoContentComment = function () {
        let newList = []
        for (let i = 0; i < filterList.length; i++) {
          if (filterList[i].text !== '') {
            newList.push(filterList[i])
          }
        }
        return newList
      }

      let noContentComment = getNoContentComment()
      let hasContentComment = filterList
      // console.log('contentType:', contentType)
      // console.log('noContentComment', noContentComment)
      // console.log('hasContentComment', hasContentComment)
      if (contentType === true) {
        return hasContentComment
      } else {
        return noContentComment
      }
    },
    filterByLabel (filterType) {
      // 根据标签来筛选评论
      if (filterType === 0) {
        // 全部, 这里显示默认为空
        return this.ratings
      } else {
        let newFilterType = filterType - 1
        let filterList = []
        // 推荐 和 吐槽 和
        for (let i = 0; i < this.ratings.length; i++) {
          if (this.ratings[i].rateType === newFilterType) {
            filterList.push(this.ratings[i])
          }
        }
        // 过滤内容为空/全部的评价
        console.log('filterList:', filterList)
        return filterList
      }
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
  },
  components: {
    'split': split,
    'ratingselect': ratingselect,
    'star': star
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.evaluate
  .evaluate-wrapper
    margin: 36px 48px 36px  0px
    position: relative
    .comprehensive-wrapper
      display: inline-block
      margin-bottom: 24px
      width: 275px
      .score
        text-align:center
        font-size: 48px
        color: rgb(255, 153, 0)
        line-height: 56px
        margin-bottom: 12px
      .text
        text-align:center
        margin: 12px 0px 16px 0px
        font-size: 24px
        color: rgb(7, 17, 27)
        line-height: 24px
      .precentage
        text-align:center
        font-size: 20px
        color: rgb(147, 153, 159)
        line-height: 20px
    .service-wrapper
      display: inline-block
      position: absolute
      right: 0px
      padding-left: 48px
      width: 378px
      padding: 0px 48px
      border-left: 1px solid rgba(7,17,27,0.1)
      .serviceScore
        margin-bottom: 16px
        .text
          display: inline-block
          font-size: 24px
          color: rgb(7, 17, 27)
          line-height: 36px
          padding-right: 24px
        .star-wrapper
          display: inline-block
          padding-right: 24px
          vertical-align: middle
        .score
          display: inline-block
          font-size: 24px
          color: rgb(255, 153, 0)
          line-height: 36px
      .foodScore
        margin: 16px 0px
        .text
          display: inline-block
          font-size: 24px
          color: rgb(7, 17, 27)
          line-height: 36px
          padding-right: 24px
        .star-wrapper
          display: inline-block
          padding-right: 24px
          vertical-align: middle
        .score
          display: inline-block
          font-size: 24px
          color: rgb(255, 153, 0)
          line-height: 36px
      .deliveryTime
        margin-top: 16px
        .text
          display: inline-block
          font-size: 24px
          color: rgb(7, 17, 27)
          line-height: 36px
          padding-right: 24px
        .time
          display: inline-block
          font-size: 24px
          color: rgb(147, 153, 159)
          line-height: 36px
  .ratingselect-wrapper
    position: relative
    padding: 36px 36px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
  .comment-wrapper
    margin: 36px 36px
    .comment-list
      position: relative
      padding: 36px 36px
      border-bottom: 1px solid rgba(7,17,27,0.1)
      .comment-header
        font-size: 0px
        .header-left
          display: inline-block
          .img
            display: inline-block
            width: 56px
            height: 56px
            border-radius: 50%
            margin-right: 24px
        .header-right
          display: inline-block
          marign-left: 24px
          margin-bottom: 12px
          .header-right-one
            display: inline-block
            .username
              display: inline-block
              font-size: 20px
              color: rgb(7, 17, 27)
              line-height: 24px
            .time
              display: inline-block
              position: absolute
              right: 36px
              font-size: 20px
              font-weight: 200
              color: rgb(147, 153, 159)
              line-height: 24px
          .header-right-two
            margin-top: 8px
            .star-wrapper
              display: inline-block
              margin-right: 12px
            .delivery-time
              display: inline-block
              font-size: 20px
              font-weight: 200
              color: rgb(147, 153, 159)
              line-height: 24px
      .comment-content
        position: relative
        left: 80px
        marign-top: 12px
        margin-bottom: 16px
        font-size: 24px
        color: rgb(7, 17, 27)
        line-height: 36px
      .comment-footer
        position: relative
        left: 80px
        margin-top: 16px
        .icon
          display: inline-block
          &.icon-thumb_up
            margin-right: 16px
            font-size: 24px
            color: rgb(0, 160, 220)
            line-height: 32px
          &.icon-thumb_down
            font-size: 24px
            color: rgb(183, 187, 191)
            line-height: 31px
        .recommend-list
          display: inline-block
          .each-recommend
            display: inline-block
            margin-right: 16px
            font-size: 18px
            color: rgb(147, 153, 159)
            line-height: 64px
            .recommend
              border: 4px solid rgba(7, 17, 27, 0.1)
              border-radius: 4px
              background-color: rgb(255, 255, 255)

</style>
