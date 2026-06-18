// pages/orders/orders.js
const { request } = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  onShow() {
    this.fetchOrderList();
  },

  fetchOrderList() {
    // 【API】获取用户订单列表，可传 status 等参数
    request('/orders', 'GET', { page: 1, size: 20 })
      .then(data => {
        const orders = (data.list || data).map(order => ({
          ...order,
          statusText: this.getStatusText(order.status),
          statusColor: this.getStatusColor(order.status)
        }));
        this.setData({ orderList: orders });
      })
      .catch(err => {
        console.error('获取订单失败', err);
      });
  },

  getStatusText(status) {
    const map = { '0': '待支付', '1': '制作中', '2': '已完成', '3': '已取消' };
    return map[status] || '未知';
  },

  getStatusColor(status) {
    const map = { '0': '#ff6b00', '1': '#07c160', '2': '#999', '3': '#ccc' };
    return map[status] || '#333';
  },

  onPullDownRefresh() {
    this.fetchOrderList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})