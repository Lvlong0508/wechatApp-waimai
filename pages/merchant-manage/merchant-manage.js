const { request } = require('../../utils/request');

Page({
  data: {
    shop: null
  },

  onLoad() {
    this.loadShop();
  },

  loadShop() {
    wx.showLoading({ title: '加载中' });
    request('/merchant/my-shop', 'GET').then(shop => {
      wx.hideLoading();
      this.setData({ shop });
    }).catch(() => {
      wx.hideLoading();
    });
  }
});
