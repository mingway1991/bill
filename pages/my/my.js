Page({
  data: {
    nickname: '',
    avatar: '',
    city: ''
  },
  onLoad: function () {
    let that = this;
    wx.setNavigationBarTitle({
      title: '我的'
    })
    that.setData({
      nickname: wx.getStorageSync('nickname'),
      avatar: wx.getStorageSync('avatar'),
      city: wx.getStorageSync('city')
    });
  },
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
  }
})