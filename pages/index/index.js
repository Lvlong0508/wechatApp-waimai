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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})