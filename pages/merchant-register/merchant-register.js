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
    wx.showLoading({ title: '上传中' });
    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/upload/temp-shoplogo',   // 【API】文件上传接口
      filePath,
      name: 'file',
      header: {
        'satoken': getApp().globalData.token
      },
      success: (res) => {
        wx.hideLoading();
        try {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          if (data.code === 200 && data.data && data.data.url) {
            this.setData({ logoUrl: data.data.url });
          } else {
            wx.showToast({ title: data.msg || '上传失败', icon: 'none' });
          }
        } catch (err) {
          console.error('上传响应解析失败', res.data, err);
          wx.showToast({ title: '上传响应异常', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('上传网络错误', err);
        wx.showToast({ title: '网络异常', icon: 'none' });
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

    wx.showLoading({ title: '提交中' });

    // 【API】提交商家注册申请
    request('/merchant/register', 'POST', {
      shopName,
      logo: logoUrl,
      phone,
      description
    }).then(data => {
      wx.hideLoading();
      wx.showToast({ title: '提交成功，等待审核' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
      console.error(err);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkExistingShop();
  },

  checkExistingShop() {
    wx.showLoading({ title: '检测中' });
    request('/merchant/my-shop', 'GET').then(shop => {
      wx.hideLoading();
      if (shop) {
        wx.showToast({ title: '您已创建过店家', icon: 'none' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    }).catch(() => {
      wx.hideLoading();
    });
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
    wx.hideLoading();
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