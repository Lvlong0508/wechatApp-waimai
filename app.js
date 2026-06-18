// app.js
App({

  globalData: {
    userInfo: null,      // 当前用户信息
    token: '',           // 登录凭证
    baseUrl: 'http://localhost:8080/api'  // 后端接口基地址
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.checkSessionAndRefresh();
    }
  },

  // 带头像和昵称登录（首次注册或更新资料场景）
  loginWithProfile(code, nickName, avatarUrl, callback) {
    wx.request({
      url: `${this.globalData.baseUrl}/user/login`,
      method: 'POST',
      data: { code, nickName, avatarUrl },
      success: (response) => {
        const data = response.data;
        if (data.code === 200) {
          this.globalData.token = data.data.token;
          this.globalData.userInfo = data.data.userInfo;
          wx.setStorageSync('token', data.data.token);
          callback && callback(true);
        } else {
          wx.showToast({ title: data.msg || '登录失败', icon: 'none' });
          callback && callback(false);
        }
      },
      fail: () => {
        wx.showToast({ title: '网络异常', icon: 'none' });
        callback && callback(false);
      }
    });
  },

   // 微信登录，获取 code 并传给后端换取 token 和用户信息
   login(callback) {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: `${this.globalData.baseUrl}/user/login`,  // 【API】登录接口
            method: 'POST',
            data: { code: res.code },
            success: (response) => {
              const data = response.data;
              if (data.code === 200) {
                this.globalData.token = data.data.token;
                this.globalData.userInfo = data.data.userInfo;
                wx.setStorageSync('token', data.data.token);
                callback && callback(true);
              } else {
                wx.showToast({ title: '登录失败', icon: 'none' });
                callback && callback(false);
              }
            },
            fail: () => {
              wx.showToast({ title: '网络异常', icon: 'none' });
              callback && callback(false);
            }
          });
        } else {
          callback && callback(false);
        }
      }
    });
  },

  // 检查会话有效性，失效则重新登录
  checkSessionAndRefresh() {
    wx.checkSession({
      success: () => {
        // session_key 未过期，可静默获取用户信息（如果后端支持）
        this.getUserInfo();
      },
      fail: () => {
        this.login();
      }
    });
  },

  // 获取用户信息（需先有 token）
  getUserInfo() {
    wx.request({
      url: `${this.globalData.baseUrl}/user/info`,  // 【API】获取用户信息
      method: 'GET',
      header: { 'satoken': this.globalData.token },
      success: (res) => {
        if (res.data.code === 200) {
          this.globalData.userInfo = res.data.data;
        }
      }
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
