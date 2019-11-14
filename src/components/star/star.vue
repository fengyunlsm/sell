<template >
    <div class="star" :class ="starType">
        <span v-for="item in itemArray" class="star-item" :class="item" :key="item.id">
        </span>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemArray () {
      let starArray = []
      let integerNumber = Math.floor(this.score)
      let decimalNumber = this.score - integerNumber
      let addOff = function (integerNumber) {
        for (var i = 0; i < 5 - integerNumber; i++) {
          starArray.push('off')
        }
      }
      let addHalf = function (integerNumber) {
        for (var i = 0; i < (5 - integerNumber); i++) {
          starArray.push('half')
        }
      }
      let addOn = function (integerNumber) {
        for (var i = 0; i < integerNumber; i++) {
          starArray.push('on')
        }
      }
      addOn(integerNumber)
      if (decimalNumber === 0) {
        addOff(integerNumber)
      } else if (decimalNumber >= 0 && decimalNumber < 0.5) {
        addOff(integerNumber)
      } else {
        addHalf(integerNumber)
      }
      return starArray
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .star
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-24
      display: table
      .star-item
        display: table-cell
        width: 20px
        height: 20px
        margin-right: 6px
        background-size: 20px 19px
        &.on
          bg-image('star24_on')
          height: 20px
          width: 19px
        &.off
          bg-image('star24_off')
          height: 20px
          width: 19px
        &.half
          bg-image('star24_half')
          height: 20px
          width: 19px
    &.star-36
      display: table
      .star-item
        display: table-cell
        width: 30px
        height: 29px
        marign: auto
        margin-right: 6px
        background-size: 30px 29px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
          height: 30px
          width: 29px
        &.off
          bg-image('star36_off')
          height: 30px
          width: 29px
        &.half
          bg-image('star36_half')
          height: 30px
          width: 29px
    &.star-48
      display: table
      margin: 0 auto
      .star-item
        display: table-cell
<<<<<<< HEAD
        width: 19px
        height: 20px
        margin-right: 3px
        background-size: 20px 19px
=======
        width: 38px
        height: 40px
        margin-right: 6px
        background-size: 40px 38px
>>>>>>> dev
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
          height: 40px
          width: 38px
        &.off
          bg-image('star48_off')
          height: 40px
          width: 38px
        &.half
          bg-image('star48_half')
          height: 40px
          width: 38px
</style>
