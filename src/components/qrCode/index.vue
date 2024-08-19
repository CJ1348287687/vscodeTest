<template>
  <div style="width: 200px;margin:20px auto;" id="qrCode" ref="qr"></div>
</template>
<script>
import QRCode from 'qrcodejs2'

export default {
  data() {
    return {
      qrcode: ''
    }
  },
  props: {
    id: {
      type: String,
      required: false
    },
    text: {  // 后端返回的二维码地址
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '200'
    },
    height: {
      type: String,
      default: '200'
    },
    colorDark: {
      type: String,
      default: '#000000'
    },
    colorLight: {
      type: String,
      default: '#ffffff'
    }
  },
  watch: {
    // text(newText) {
    //   this.createQrcode()
    // }
  },
  mounted() {
    this.createQrcode()
  },
  methods: {
    createQrcode() {
      let _this = this
      console.log(this.text)
      console.log(this.$refs['qr'])
      if (this.qrcode) {  // 有新的二维码地址了，先把之前的清除掉
        this.$refs['qr'].innerHTML = ''
      }
      this.qrcode = new QRCode(this.$refs['qr'], {
        text: this.text, //页面地址 ,如果页面需要参数传递请注意哈希模式#
        width: this.width, // 二维码宽度 （不支持100%）
        height: this.height, // 二维码高度 （不支持100%）
        colorDark: this.colorDark,
        colorLight: this.colorLight,
        correctLevel: QRCode.CorrectLevel.H
      })
      setTimeout(function() {
        let container = document.getElementById('qrCode').childNodes[1]
        let src = container.getAttribute('src')
        _this.$emit('abc', src)
      }, 100)

    },
    // 制作另一个二维码
    updateCode(sText) {
      this.qrcode.makeCode(sText)
    }
  }
}
</script>
