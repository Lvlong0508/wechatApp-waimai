// pages/address-edit/address-edit.js
const { request } = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,           // 编辑时传入地址id
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
    regionStr: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadAddressDetail(options.id);
    }
  },

  // 【API】加载地址详情
  loadAddressDetail(id) {
    request(`/address/${id}`, 'GET')
      .then(data => {
        this.setData({
          name: data.name,
          phone: data.phone,
          province: data.province,
          city: data.city,
          district: data.district,
          detail: data.detail,
          isDefault: data.isDefault,
          regionStr: `${data.province} ${data.city} ${data.district}`
        });
      });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  // 选择省市区
  chooseRegion() {
    wx.chooseLocation({
      success: (res) => {
        // 微信 chooseLocation 返回的地址信息较简单，实际可能需要调用后端三级联动或使用 region 选择器
        // 此处仅做示例，实际项目请替换为完整省市区选择组件
        this.setData({
          province: res.address.split(',')[0] || '',
          city: res.address.split(',')[1] || '',
          district: res.address.split(',')[2] || '',
          detail: res.name || '',
          regionStr: res.address
        });
      }
    });
  },

  onSwitchChange(e) {
    this.setData({ isDefault: e.detail.value });
  },

  // 保存地址
  saveAddress() {
    const { id, name, phone, province, city, district, detail, isDefault } = this.data;
    if (!name || !phone || !province || !detail) {
      wx.showToast({ title: '请完善地址信息', icon: 'none' });
      return;
    }

    const params = { name, phone, province, city, district, detail, isDefault };
    // 【API】新增或更新地址
    const url = id ? `/address/update/${id}` : '/address/add';
    const method = id ? 'PUT' : 'POST';

    request(url, method, params)
      .then(() => {
        wx.showToast({ title: '保存成功' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      })
      .catch(err => console.error(err));
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