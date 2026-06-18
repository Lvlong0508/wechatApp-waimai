const { request } = require('../../utils/request');

Page({
  data: {
    goods: [],
    shopId: null
  },

  onLoad() {
    this.loadGoods();
  },

  loadGoods() {
    wx.showLoading({ title: '加载中' });
    request('/merchant/goods', 'GET').then(goods => {
      wx.hideLoading();
      this.setData({ goods: goods || [] });
    }).catch(() => {
      wx.hideLoading();
    });
  }
});
