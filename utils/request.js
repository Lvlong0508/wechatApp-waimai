const app = getApp();

const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + url,
      method,
      data,
      header: {
        'content-type': 'application/json',
        'satoken': app.globalData.token || ''
      },
      success(res) {
        if (res.data.code === 200) {
          resolve(res.data.data);
        } else {
          wx.showToast({ title: res.data.msg || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      }
    });
  });
};

module.exports = { request };