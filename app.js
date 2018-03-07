//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://api.bohetanglao.com/app/mina_openid?code='+res.code,
          data: {
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          }, // 设置请求的 header
          success: function (res) {
            Login(res.data['data']);
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              //请求自己的服务器
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

function Login(data) {
  //创建一个dialog
  wx.showToast({
    title: '正在登录...',
    icon: 'loading',
    duration: 10000
  });
  //请求服务器
  wx.request({
    url: 'https://api.bohetanglao.com/app/thirdpart_login',
    data: {
      'identity_type': 'MINA',
      'identifier': data['openid'],
      'credential': data['session_key']
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }, // 设置请求的 header
    success: function (res) {
      // success
      wx.hideToast();
      if (res.statusCode == 200) {
        console.log('服务器返回成功' + res.data['data']['access_token']);
        wx.setStorageSync('access_token', res.data['data']['access_token'])
      } else {
        console.log('服务器返回错误' + res.data);
      }
    },
    fail: function () {
      // fail
      wx.hideToast();
    },
    complete: function () {
      // complete
    }
  })
}