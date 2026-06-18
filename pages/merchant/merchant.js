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
      if (shop) {
        this.setData({ shop });
      } else {
        wx.showToast({ title: '店铺信息异常', icon: 'none' });
        setTimeout(() => { wx.navigateBack(); }, 1500);
      }
    }).catch(() => {
      wx.hideLoading();
    });
  },

  goGoods() {
    wx.redirectTo({ url: '/pages/merchant-goods/merchant-goods' });
  },

  goOrders() {
    wx.redirectTo({ url: '/pages/merchant-orders/merchant-orders' });
  },

  goManage() {
    wx.redirectTo({ url: '/pages/merchant-manage/merchant-manage' });
  }
});
