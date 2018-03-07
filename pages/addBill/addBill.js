Page({
  data: {
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '记账'
    })
    var access_token = wx.getStorageSync('access_token')
  },
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
  }
})