var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    total: 0,
    create_time: ''
  },
  onShow: function () {
    this.access_token = wx.getStorageSync('access_token')
    this.getTotalMoney()
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '天天爱记账'
    })
  },
  getTotalMoney: function() {
    let that = this;
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/total',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
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
      }
    })
  }
})