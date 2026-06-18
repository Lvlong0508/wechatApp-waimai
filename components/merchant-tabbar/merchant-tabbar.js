Component({
  properties: {
    active: {
      type: String,
      value: 'home'
    }
  },

  methods: {
    onTap(e) {
      const page = e.currentTarget.dataset.page;
      if (page === this.properties.active) return;

      const pages = {
        home: '/pages/merchant/merchant',
        goods: '/pages/merchant-goods/merchant-goods',
        orders: '/pages/merchant-orders/merchant-orders',
        manage: '/pages/merchant-manage/merchant-manage'
      };

      wx.redirectTo({ url: pages[page] });
    }
  }
});
