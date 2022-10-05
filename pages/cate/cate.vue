<template>
  <view>
    <!-- 自定义组件 可以指定边框圆角的大小和背景颜色 -->
    <search bgcolor="#c00000" radius="18" @click="gotoSearch">></search>
    <view class="scroll-view-container">
      <scroll-view scroll-y="true" class="left-scroll-view" :style="{height: wh + 'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChange(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <scroll-view scroll-y="true" class="right-scroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="catel2" v-for="(item2,i2) in cateListl2" :key="i2">
          <view class="catel2-lv2-title">
            /{{item2.cat_name}}/
          </view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodList(item3)">
              <!-- 三级分类图片 -->
              <image :src="item3.cat_icon"></image> <!-- 三级分类文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        /* 当前设备可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 */
        wh: 0,
        // 分类数据列表
        cateList: [],
        // 为页面指定选中的列表项
        active: 0,
        // 二级商品分类列表
        cateListl2: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      }
    },
    onLoad() {
      // 获得当前设备信息
      const sysInfo = uni.getSystemInfoSync()
      // 动态赋值wh可用高度
      this.wh = sysInfo.windowHeight - 50

      this.getCateList()
    },
    methods: {
      async getCateList() {
        // 一级分类数据获取
        const { data: res } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 默认二级分类数据获取
        this.cateListl2 = res.message[0].children
      },
      activeChange(i) {
        this.active = i
        // 重新为二级分类赋值
        this.cateListl2 = this.cateList[i].children

        // 让scrollTop 的值在0、1px之间切换
        this.scrollTop = this.scrollTop ? 0 : 1
      },
      gotoGoodList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/goods_search/goods_search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px; // 激活项的样式

        &.active {
          // 渲染激活项左侧的红色指示边线 
          background-color: #ffffff;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .catel2-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
