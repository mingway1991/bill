var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    categories: []
  },
  onShow: function () {
    var that = this
    if (that.data.isBack) {
      wx.navigateBack()
    }
    that.getAllCategories()
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '类别列表'
    })
    this.access_token = wx.getStorageSync('access_token')
  },
  //跳转 
  gotoAddCategory: function () {
    wx.navigateTo({ url: '../../pages/addCategory/addCategory' })
  },
  //删除类别
  removeAction: function (e) {
    console.log(e)
    let that = this;
    if (e['type'] == 'tap') {
      var value = e['target']['dataset']['alphaBeta']
      console.log(value)
      that.DelCategory(value)
    }
  },
  //请求
  getAllCategories: function() {
    let that = this; 
    util.showLoadingToast('获取类别列表...');
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/categories',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
        util.hideToast();
        if (res.statusCode == 200) {
          var categories = []
          if (res.data['data']) {
            categories = res.data['data']
          }
          that.setData({
            categories: categories
          }); 
        } else {
          console.log(res.data);
        }
      },
      fail: function () {
        util.hideToast();
      }
    })
  },
  DelCategory: function (id) {
    let that = this; 
    util.showLoadingToast('正在删除...');
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/category/'+id,
      data: {
      },
      method: 'DELETE',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
        util.hideToast();
        if (res.statusCode == 200) {
          console.log(res.data['data']);
          util.showSuccessToast('删除成功');
          setTimeout(function () {
            that.getAllCategories() 
          }, 1500)
        } else {
          console.log(res.data);
          util.showToast('删除失败');
        }
      },
      fail: function () {
        util.hideToast();
      }
    })
  }
})