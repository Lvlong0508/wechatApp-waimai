const app = getApp();
const { request } = require('../../utils/request');

Page({
  data: {
    loading: {
      visible: false,
      text: ''
    }
  },

  showLoading(text) {
    this.setData({ loading: { visible: true, text } });
  },

  hideLoading() {
    this.setData({ loading: { visible: false, text: '' } });
  },

  goUser() {
    wx.switchTab({ url: '/pages/user-index/user-index' });
  },

  goMerchant() {
    if (this.data.loading.visible) return;

    const token = app.globalData.token;
    if (!token) {
      this.merchantLogin();
    } else {
      this.checkShop();
    }
  },

  merchantLogin() {
    this.showLoading('登录中');
    app.login((ok) => {
      if (ok) {
        this.checkShop();
      } else {
        this.hideLoading();
        wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      }
    });
  },

  checkShop() {
    this.showLoading('检测中');
    request('/merchant/my-shop', 'GET')
      .then(shop => {
        this.hideLoading();
        if (shop) {
          wx.reLaunch({ url: '/pages/merchant/merchant' });
        } else {
          this.promptCreateShop();
        }
      })
      .catch(() => {
        this.hideLoading();
        wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
      });
  },

  promptCreateShop() {
    wx.showModal({
      title: '暂无店铺',
      content: '您还没有创建店铺，是否前往创建？',
      confirmText: '去创建',
      cancelText: '暂不',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({ url: '/pages/merchant-register/merchant-register' });
        }
      }
    });
  }
});
