<template>
  <div>
    <div class="map-head">
      <el-select
        v-model="keywords"
        :loading="loading"
        clearable
        remote
        filterable
        reserve-keyword
        placeholder="请输入关键词"
        style="width: 500px"
        :remote-method="remoteMethod"
        @change="currentSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.name + '_' + item.district"
        >
          <div class="option" style="display: flex; justify-content: space-between">
            <span>{{ item.name }}</span>
            <span style="margin-left: 20px; color: #999; font-size: 12px">
              {{ item.district }}
            </span>
          </div>
        </el-option>
      </el-select>
      <div class="currentAddr"style="margin: 10px;" v-if="form.lng!='' && form.lat!=''">
        <span style="color: red;font-size: larger;">当前选择坐标：</span>{{ form.lng }},{{ form.lat }}</div>
      <div class="currentAddr"style="margin: 10px;" v-if="form.address!=''">
        <span style="color: red;font-size: larger;">当前选择地址：</span>{{ form.address }}</div>
    </div>
    <div id="mapContainer" style="width: 100%; height: 89%;margin-top:10px"></div>
  </div>
</template>
 
<style lang="scss"></style>

<script setup>
  import AMapLoader from '@amap/amap-jsapi-loader';
  import '@/components/AMap/index.js'
  window._AMapSecurityConfig = {
    // 安全密钥
    securityJsCode: 'ad5870a73e6350fc6b2e789c40b2d63e',//高德地图申请key值的秘钥
  };
  export default {
    name: 'mapContainer',
    data(){
      return{
        form:{
          lat:'',//纬度
          lng:'',//经度
          address:'',//地址
          adcode:'',
        },
        map:null, //地图
        keywords:'',
        marker:'',
        geoCoder:'',
        options:[],
        loading:false,
        // 搜索提示
        AutoComplete:null,
      }
    },
    methods: {
      initMap(){
        var _this = this;
        AMapLoader.load({
          key: '006d9c2f4a4f8a2a0f57affc8146e88f', // 申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: ['AMap.Scale', 'AMap.Geocoder', 'AMap.AutoComplete'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        }).then((AMap) => {
          let center = [116.397428, 39.90923]
          console.log("this.form",this.form);
          if(this.form.lng!='' && this.form.lat!=''){
            center = [this.form.lng, this.form.lat]
          }
          _this.map = new AMap.Map('mapContainer', {
            // 设置地图容器id
            viewMode: '2D', // 是否为3D地图模式
            zoom: 11, // 初始化地图级别
            center: center, // 初始化地图中心点位置
          });

          _this.geoCoder = new AMap.Geocoder({
            city: '010', //城市设为北京，默认：“全国”
            radius: 1000, //范围，默认：500
          });
          if (_this.form.lng != '' && _this.form.lat != '') {
            _this.setMapMarker();
          }
          _this.AutoComplete = new AMap.AutoComplete({ city: '全国' });
          _this.map.on('click', this.showInfoClick);
        })
        .catch((e) => {
          _this.$message.error('地图加载失败')
          console.log("地图加载失败",e);
        });
      },
      getData(xy,address){
        this.options=[]
        this.keywords = ''
        if(xy!=null && xy!=undefined && xy!='' && xy.includes(',') && address!=null && address!=undefined && address!=''){
          this.form = {
            lat: (xy.split(',')[1]==null || xy.split(',')[1]==undefined || xy.split(',')[1]=='' || xy.split(',')[1]==NaN) ? '' : xy.split(',')[1],//纬度
            lng: (xy.split(',')[0]==null || xy.split(',')[0]==undefined || xy.split(',')[0]=='' || xy.split(',')[0]==NaN) ? '' : xy.split(',')[0],//经度
            address: address,//地址
            adcode: '',
          }
        }else{
          this.form = {
            lat:'',//纬度
            lng:'',//经度
            address:'',//地址
            adcode:'',
          }
        }
        this.initMap()
      },
      showInfoClick(e){
        this.removeMarker();
        this.form.address = '';
        this.form.adcode = '';
        this.form.lat = e.lnglat.getLat();
        this.form.lng = e.lnglat.getLng();
        console.log('您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置单击了地图！');
        this.toGeoCoder();
        this.setMapMarker();
      },
      // 标记点
      setMapMarker(){
        // 自动适应显示想显示的范围区域
        this.map.setFitView();
        this.marker = new AMap.Marker({
          map: this.map,
          label: {
            content: this.form.address // 文本标注的内容
          },
          position: [this.form.lng, this.form.lat],
        });
        this.map.setFitView();
        this.map.add(this.marker);
      },
      removeMarker(){
        if (this.marker) {
          this.map.remove(this.marker);
        }
      },
      toGeoCoder(){
        let lnglat = [this.form.lng, this.form.lat];
        console.log(lnglat);
        var _this = this;
        this.geoCoder.getAddress(lnglat, function (status, result) {
          console.log(status, result);
          if (status === 'complete' && result.regeocode) {
            _this.form.address = result.regeocode.formattedAddress;
            _this.keywords = result.regeocode.formattedAddress;
          }else{
            _this.$message.error('坐标解析失败')
            console.log("坐标解析失败",status,result);
          }
        });
      },
      // 搜索
      remoteMethod(query){
        console.log(query);
        var _this = this
        if (query !== '') {
          _this.loading = true;
          setTimeout(() => {
            _this.loading = false;
            _this.AutoComplete.search(query, (status, result) => {
              _this.options = result.tips;
            });
          }, 200);
        } else {
          _this.options = [];
        }
      },
      // 选中提示
      currentSelect(val){
        // 清空时不执行后面代码
        if (!val) {
          return;
        }
        let info = this.options.find((v) => v.name + '_' + v.district == val)
        if (info.location) {
          // 自动适应显示想显示的范围区域
          // this.mapEl.setFitView()
          console.log("info.location",info.location)
          this.form.lng = info.location.lng;
          this.form.lat = info.location.lat;
          this.form.address = info.district + info.address;
          this.form.adcode = info.adcode;
          // 清除点
          this.removeMarker();
          // 标记点
          this.setMapMarker();
          // this.addmark({ ...info.location, name: info.name })
        } else {
          this.$message.warning('该地点经纬度信息缺失')
        }
      },
      chooseAddress() {
        return this.form
      }
    },
    created(){
      this.getData()
    }
  }
  </script>