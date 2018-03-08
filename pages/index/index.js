//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    access_token: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    total: 0,
    create_time: ''
  },
  //跳转 
  gotoCategories: function () {
    wx.navigateTo({ url: '../../pages/categories/categories' })
  }, 
  gotoAddBill: function () {
    wx.navigateTo({ url: '../../pages/addRecord/addRecord' })
  },
  onShow: function () {
    this.access_token = wx.getStorageSync('access_token')
    this.getTotalMoney()
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '天天爱记账'
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getTotalMoney: function () {
    let that = this;
    //创建一个dialog
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/total',
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        if (res.statusCode == 200) {
          if (res.data['errorCode']==0) {
            console.log(res.data['data']);
            var create_time = ''
            if (res.data['data'].hasOwnProperty("create_time")) {
              create_time = res.data['data']['create_time']
            }
            that.setData({
              total: res.data['data']['money'],
              create_time: create_time
            })
          } else {
            console.log(res.data);
          }
        } else {
          console.log(res.data);
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
})