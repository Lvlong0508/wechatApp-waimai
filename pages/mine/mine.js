// pages/mine/mine.js
const app = getApp();
const { request } = require('../../utils/request');

Page({
  data: {
    userInfo: {},
    defaultAddress: '',
    showAuthModal: false,
    tempAvatarUrl: '',
    tempNickName: '',
    submitting: false
  },

  onShow() {
    this.setData({ userInfo: app.globalData.userInfo || {} });
    if (app.globalData.token) {
      this.fetchDefaultAddress();
    } else {
      wx.showModal({
        title: '提示',
        content: '您还未登录，是否前往登录？',
        success: (res) => {
          if (res.confirm) {
            this.setData({ showAuthModal: true });
          }
        }
      });
    }
  },

  // 空函数，用于阻止冒泡
  noop() {},

  // 点击头像区
  onAvatarTap() {
    if (app.globalData.token) {
      return;
    }
    this.setData({
      showAuthModal: true,
      tempAvatarUrl: '',
      tempNickName: ''
    });
  },

  // 微信选择头像回调
  onChooseAvatar(e) {
    this.setData({ tempAvatarUrl: e.detail.avatarUrl });
  },

  // 昵称输入
  onNickNameInput(e) {
    this.setData({ tempNickName: e.detail.value });
  },

  // 关闭弹框
  closeAuthModal() {
    if (this.data.submitting) return;
    this.setData({
      showAuthModal: false,
      tempAvatarUrl: '',
      tempNickName: ''
    });
  },

  // 提交授权并登录
  submitAuth() {
    const { tempAvatarUrl, tempNickName } = this.data;
    if (!tempAvatarUrl) {
      wx.showToast({ title: '请选择头像', icon: 'none' });
      return;
    }
    const nick = (tempNickName || '').trim();
    if (!nick) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    // 步骤1：上传头像换 URL
    wx.uploadFile({
      url: `${app.globalData.baseUrl}/upload/temp-avatar`,
      filePath: tempAvatarUrl,
      name: 'file',
      success: (uploadRes) => {
        let avatarUrl = '';
        try {
          const parsed = JSON.parse(uploadRes.data);
          if (parsed.code === 200 && parsed.data && parsed.data.url) {
            avatarUrl = parsed.data.url;
          } else {
            wx.showToast({ title: parsed.msg || '头像上传失败', icon: 'none' });
            this.setData({ submitting: false });
            return;
          }
        } catch (err) {
          wx.showToast({ title: '头像上传响应异常', icon: 'none' });
          this.setData({ submitting: false });
          return;
        }

        // 步骤2：wx.login 拿 code
        wx.login({
          success: (loginRes) => {
            if (!loginRes.code) {
              wx.showToast({ title: '微信登录失败', icon: 'none' });
              this.setData({ submitting: false });
              return;
            }
            // 步骤3：调登录接口
            app.loginWithProfile(loginRes.code, nick, avatarUrl, (ok) => {
              if (ok) {
                this.setData({
                  userInfo: app.globalData.userInfo,
                  showAuthModal: false,
                  submitting: false,
                  tempAvatarUrl: '',
                  tempNickName: ''
                });
                wx.showToast({ title: '登录成功', icon: 'success' });
                this.fetchDefaultAddress();
              } else {
                this.setData({ submitting: false });
              }
            });
          },
          fail: () => {
            wx.showToast({ title: '微信登录失败', icon: 'none' });
            this.setData({ submitting: false });
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '头像上传失败', icon: 'none' });
        this.setData({ submitting: false });
      }
    });
  },

  // 【API】获取默认地址
  fetchDefaultAddress() {
    request('/address/default', 'GET')
      .then(addr => {
        const addrStr = addr ? `${addr.province}${addr.city}${addr.district} ${addr.detail}` : '';
        this.setData({ defaultAddress: addrStr });
      })
      .catch(() => {});
  },

  // 跳转地址管理
  goToAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  // 跳转商家注册
  goToMerchantRegister() {
    if (!app.globalData.token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/merchant-register/merchant-register' });
  },

  onLoad(options) {},
  onReady() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {}
});
