<template>
  	<div style="height: 35rem;padding-left: 50px;">
  		<div class="">
  			<div class="prev_pho_tweet por">
  				<div v-if="shareUrl">
					  <!-- sjkShow -->
            <img src="../../assets/images/phone.png" 
              style="width: 300px;height: 590px;position: absolute;top: 0;left: 0px;" alt="">
            <iframe id="myIframe" @load="iframeLoad()" style="width: 270px;height: 525px;position: absolute;top: 44px;left: 14px;border-radius: 0px 0px 20px 20px;border: none;" :src="shareUrl"></iframe>
  				</div>
  			</div>
  		</div>
  	</div>
  </div>
</template>
<script>
import previewFormStyle from "./previewFormStyle.vue";
export default {
  components: { previewFormStyle },
  data() {
    return {
      shareUrl:""
    }
  },
  methods:{
    iframeLoad(){
      let iframe = document.getElementById('myIframe');
      console.log('iframe',iframe);
      //目前跨域无法获取内容进行操作
      var iframeDoc = iframe.contentWindow.document;
      console.log('iframeDoc1', iframeDoc)
      //某些内容是动态加载的（例如，通过 JavaScript 或 AJAX）
      setTimeout(()=>{
        //改变iframe内元素样式
        var elementInIframe = iframeDoc.getElementsByClassName('bg_width_Y');
        if(elementInIframe.length){
          console.log('iframeDom2', elementInIframe.length);
          elementInIframe[0].style.height = 'calc(100vh - 60px)';
        }
        //监听按钮-设置底部弹框form表单容器高度
        iframeDoc.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'button') {
              setTimeout(()=>{
                //按钮click事件被触发的逻辑
                var vanPopupElement = iframeDoc.getElementsByClassName('van-popup');
                console.log('容器0',vanPopupElement)
                if(vanPopupElement.length){
                  console.log('容器1', vanPopupElement.length, vanPopupElement[0], vanPopupElement[0].offsetHeight);
                  const scrollFrom =  vanPopupElement[0].children[0].children[1];
                  console.log('容器2',scrollFrom, scrollFrom.style.height, vanPopupElement[0].offsetHeight - 70 - 50)
                  scrollFrom.style.height = vanPopupElement[0].offsetHeight - 70 - 50 + 'px' ;
                }
              },100);
            }
          })
      },300);
    },
    getData(shareUrl) {
      this.shareUrl = shareUrl;
    },
  }
}
</script>
<style scope>
  .position-relative {
    position: relative;
  }
  
  .position-absolute {
    position: absolute;
  }
  
  .font-14 {
    font-size: 14px !important;
  }
  
  .font-12 {
    font-size: 12px !important;
  }
  
  .font-10 {
    font-size: 10px !important;
  }
  
  .line-20 {
    line-height: 20px;
  }
  
  .mt-5 {
    margin-top: 5px !important;
  }
  
  .mb-5 {
    margin-bottom: 5px !important;
  }
  
  .mb-10 {
    margin-bottom: 10px !important;
  }
  
  .mt-10 {
    margin-top: 10px !important;
  }
  
  .mt-20 {
    margin-top: 20px !important;
  }
  
  .scrol::-webkit-scrollbar {
    width: 0 !important;
  }
  
  .prev_pho_tweet {
    align-items: center;
    justify-content: center;
    width: 400px;
    margin: 0 auto;
    position: relative;
  }
  
  .prev_pho_tweetPreview {
    width: 252px;
    margin: 14px 0 0px 4px;
    border-radius: 20px;
    z-index: 20;
    height: 32.9rem !important;
    overflow-y: scroll;
  }
  .prev_pho_tweet ::-webkit-scrollbar {
    display: none !important;
  }
  .prev_pho_tweet .el-drawer__container{
    position: relative;
    left: 13px;
    right: 0;
    top: -22px;
    bottom: 0;
    height: 100%;
    width: 91%;
  }
  .prev_pho_tweet .el-drawer__open .el-drawer.btt {
    height: auto !important;
    /* max-height: 63% !important; */
    border-radius: 5px 5px 20px 20px !important;
    display: flex;
    justify-content: flex-end;
  }
  .prev_pho_tweet .el-drawer__body {
    display: flex;
    align-items: flex-end;
  }
  </style>
