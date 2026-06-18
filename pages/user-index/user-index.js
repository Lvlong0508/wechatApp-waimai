// index.js
const { request } = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: []
  },

  onLoad() {
    this.fetchShopList();
  },

  // 获取店铺列表
  fetchShopList() {
    // 【API】获取店铺列表，可能需传入经纬度、关键词等
    request('/shops', 'GET', { page: 1, size: 10 })
      .then(data => {
        this.setData({ shopList: data.list || data });
      })
      .catch(err => {
        console.error('获取店铺失败', err);
      });
  },

  // 进入店铺点单（后续补点单页面）
  goToShop(e) {
    const shopId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/shop/shop?id=${shopId}`,
      fail() {
        wx.showToast({ title: '点单页面开发中', icon: 'none' });
      }
    });
  },

  onPullDownRefresh() {
    this.fetchShopList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

})