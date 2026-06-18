// pages/merchant-register/merchant-register.js
const { request } = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName: '',
    logoUrl: '',
    phone: '',
    description: ''
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  // 选择店铺Logo
  chooseLogo() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadFile(tempFilePath);
      }
    });
  },

  // 【API】上传图片
  uploadFile(filePath) {
    const shopId = this.data.shopId;
    wx.showLoading({ title: '上传中' });
    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/upload/shoplogo/${shopId}',   // 【API】文件上传接口
      filePath,
      name: 'file',
      header: {
        'satoken': getApp().globalData.token
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 200) {
          this.setData({ logoUrl: data.data.url });   // 假设返回图片url
        } else {
          wx.showToast({ title: '上传失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络异常', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 提交注册
  submitRegister() {
    const { shopName, logoUrl, phone, description } = this.data;
    if (!shopName || !logoUrl || !phone) {
      wx.showToast({ title: '请完善必填信息', icon: 'none' });
      return;
    }

    // 【API】提交商家注册申请
    request('/merchant/register', 'POST', {
      shopName,
      logo: logoUrl,
      phone,
      description
    }).then(data => {
      wx.showToast({ title: '提交成功，等待审核' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      console.error(err);
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