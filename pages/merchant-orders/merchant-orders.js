const { request } = require('../../utils/request');

Page({
  data: {
    orders: []
  },

  onLoad() {
    this.loadOrders();
  },

  loadOrders() {
    wx.showLoading({ title: '加载中' });
    request('/merchant/orders', 'GET', { page: 1, size: 20 }).then(data => {
      wx.hideLoading();
      this.setData({ orders: data.list || data || [] });
    }).catch(() => {
      wx.hideLoading();
    });
  },

  statusText(status) {
    const map = { 0: '待支付', 1: '制作中', 2: '已完成', 3: '已取消' };
    return map[status] || '未知';
  }
});
