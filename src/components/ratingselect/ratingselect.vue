<template lang="html">
  <div>
    <div class="label">
      <div :class="{'on': this.sta === 0}" class="all" @click="showComment($event, 0)">
        <div class="all-swapper">
          <div class="all-tag">
            {{tag[0]}}
          </div><div class="all-number">
            {{CommentTotal(0)}}
          </div>
        </div>
      </div>
      <div :class="{'on': this.sta === 1}" class="positive" @click="showComment($event, 1)">
        <div class="positive-swapper">
            <span class="positive-tag">
              {{tag[1]}}</span><div class="positive-number">
              {{CommentTotal(1)}}
            </div>
        </div>
      </div>
      <div :class="{'on': this.sta === 2}" class="negative" @click="showComment($event, 2)">
        <div class="negative-swapper">
          <span class="negative-tag">
            {{tag[2]}}{{CommentTotal(2)}}
          </span>
        </div>
      </div>
    </div>
    <div class="select">
      <span class="icon-check_circle" @click="isShowAllComment()" :class="{'content-status': contentType === false}"></span>
      <span class="explain">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslin    t-disable no-unused-vars */

const ALL = 0
export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    typeSelect: {
      type: Number,
      default () {
        return ALL
      }
    },
    contentType: {
      type: Boolean,
      default () {
        return true
      }
    },
    tag: {
      type: Array,
      default () {
        return [
          '全部',
          '推荐',
          '吐槽'
        ]
      }
    }
  },
  data () {
    return {
      sta: ALL
    }
  },
  methods: {
    isShowAllComment () {
      // 只显示有内容的评论
      this.$emit('setContentType')
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
        return filterList
      }
    },
    CommentTotal (typeSelect) {
      // 功能：统计评价数目
      let com = this.filterByLabel(typeSelect)
      let comment = this.filterByContent(com, this.contentType)
      let commentTotal = comment.length
      return commentTotal
    },
    showComment (event, type) {
      this.sta = type
      this.$emit('setSelectType', type)
      this.$emit('setDefaultContentType')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.label
  padding-bottom: 18px
  border-bottom: 1px solid rgba(7, 17, 27, 0.1)
  .all
    display: inline-block
    position: relative
    cursor: pointer
    margin-right: 8px
    width: 80px
    height: 35px
    font-size: 12px
    color: rgb(77, 85, 93)
    line-height: 16px
    background-color: rgb(0, 160, 220)
    border-radius: 2px
    &.on
      color: #07111b
      font-weight: 600
      border: 0.5px solid black
    .all-swapper
      position: absolute
      display: inline-block
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      .all-tag
        display: inline-block
      .all-number
        display: inline-block
  .positive
    cursor: pointer
    display: inline-block
    position: relative
    margin-right: 8px
    width: 80px
    height: 35px
    font-size: 12px
    color: rgb(77, 85, 93)
    line-height: 16px
    border-radius: 2px
    background-color: rgba(0, 160, 220, 0.2)
    &.on
      color: #07111b
      font-weight: 600
      border: 0.5px solid black
    .positive-swapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      .positive-tag
        display: inline-block
      .positive-number
        display: inline-block
  .negative
    cursor: pointer
    position: relative
    display: inline-block
    width: 80px
    height: 35px
    font-size: 12px
    color: rgb(77, 85, 93)
    line-height: 16px
    border-radius: 2px
    background-color: rgba(77, 85, 93, 0.2)
    &.on
      color: #07111b
      font-weight: 600
      border: 0.5px solid black
    .negative-swapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      .negative-tag
        display: inline-block
      .negative-number
        display: inline-block
.select
  padding: 18px 0px 0px 0px
  .icon-check_circle
    cursor: pointer
    display: inline-block
    vertical-align: middle
    padding-right: 4px
    font-size: 24px
    color: rgb(147, 153, 159)
    line-height: 24px
    &.content-status
      color: green
  .explain
    display: inline-block
    font-size: 12px
    color: rgb(147, 153, 159)
    line-height: 24px
</style>
