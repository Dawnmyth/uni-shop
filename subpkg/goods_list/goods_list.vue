<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <goods :goods="goods"></goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 关键词
          query: '',
          // 商品分类id
          cid: '',
          // 页码
          pagenum: 1,
          // 每页显示的数据量
          pagesize: 10
        },
        // 商品列表数据
        goodsList: [],
        // 总数
        total: 0,
        // 节流阀开关用以控制请求的发送
        isloading: false
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total)return uni.$showMsg('没有更多数据了')
      if(this.isloading) return
      this.queryObj.pagenum += 1
      this.getGoodsList()
    },
    // 下拉刷新的事件 
    onPullDownRefresh() { 
      // 重置关键数据 
      this.queryObj.pagenum = 1 
      this.total = 0 
      this.isloading = false 
      this.goodsList = [] 
      // 重新发起请求 
      this.getGoodsList(() => uni.stopPullDownRefresh()) 
    },
    methods: {
      // 获取商品列表数据
      async getGoodsList(cb) {
        // 发起请求 
        this.isloading = true
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isloading = false
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值 
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    }
  }
</script>

<style lang="scss">
  
</style>
