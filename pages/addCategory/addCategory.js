var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    showTopTips: false,
    errorMsg: ''
  },
  onShow: function () {
    var that = this
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
  onLoad: function () {
    let that = this;
    wx.setNavigationBarTitle({
      title: '新增类别'
    })
    that.access_token = wx.getStorageSync('access_token')
  },
  inputChange: function(e) {
    let that = this;
    if (e['type'] == 'input') {
      if (e['detail']['value'].length > 0) {
        that.setData({
          showTopTips: false,
          errorMsg: ''
        });
      }
    }
  }
  ,
  //提交
  formSubmit: function(e) {
    let that = this;
    if (e['type'] == 'submit') {
      var value = e['detail']['value']['input']
      if (value.length == 0) {
        that.setData({
          showTopTips: true,
          errorMsg: '请输入内容'
        });
      } else {
        // that.setData({
        //   showTopTips: false,
        //   errorMsg: ''
        // });
        that.NewCategory(value)
      }
    }
  }, 
  //请求创建类别
  NewCategory: function(name) {
    let that = this;
    util.showLoadingToast('正在创建...');
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/categories',
      data: {
        'name': name
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.access_token
      },
      success: function (res) {
        // success
        wx.hideToast();
        if (res.statusCode == 200) {
          console.log(res.data['data']);
          util.showSuccessToast('创建成功');
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          console.log(res.data);
          util.showToast('创建失败');
        }
      },
      fail: function () {
        util.hideToast();
      }
    })
  }
})