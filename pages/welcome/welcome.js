Page({
  data: {},

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var that = getApp()
    try {
      //首先检查缓存中是否有我们需要请求的数据，如果没有，我们再跟服务器连接，获取数据
      //首次登陆肯定是没有的
      var access_token = wx.getStorageSync('access_token')
      if (access_token) {
        //如果缓存不为空，即已经存在数据，我们不用再跟服务器交互了，那么直接跳转到首页
        wx.switchTab({
          url: '../index/index',
        })
      } else {
        this.login()
      }
    } catch (e) {
      this.login()
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
  },
  redirect: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  login: function () {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://api.bohetanglao.com/app/mina?code=' + res.code,
          data: {
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          }, // 设置请求的 header
          success: function (res) {
            if (res.statusCode == 200) {
              console.log('服务器返回成功' + res.data['data']['access_token']);
              wx.setStorageSync('access_token', res.data['data']['access_token'])
              wx.setStorageSync('refresh_token', res.data['data']['refresh_token'])
              wx.switchTab({
                url: '../index/index',
              })
            } else {
              console.log('服务器返回错误' + res.data);
            }
          }
        })
      }
    })
  }
})