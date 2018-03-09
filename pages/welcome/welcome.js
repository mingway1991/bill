var login = require('../../network/login/login.js')

Page({
  data: {},

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '天天爱记账'
    })

    var that = getApp()
    try {
      var refresh_token = wx.getStorageSync('refresh_token')
      if (refresh_token) {
        login.refresh(refresh_token)
      } else {
        login.login()
      }
    } catch (e) {
      login.login()
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})