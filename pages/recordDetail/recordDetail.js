var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    record: null
  },
  onShow: function () {
  },
  onLoad: function (options) {
    let that = this;
    that.access_token = wx.getStorageSync('access_token')
    wx.setNavigationBarTitle({
      title: '记录详情'
    })
    var bean = JSON.parse(options['record']);
    that.setData({
      record: bean
    });
  }
})