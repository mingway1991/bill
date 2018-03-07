var recordStartX = 0;
var currentOffsetX = 0;

Page({
  data: {
    access_token: '',
    categories: []
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
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
    that.getAllCategories()
  },
  getAllCategories: function() {
    let that = this; 
    //创建一个dialog
    wx.showToast({
      title: '获取类别列表...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/categories',
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
          that.setData({
            categories: res.data['data']
          }); 
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
  },
  removeAction: function(e) {
    console.log(e)
    let that = this;
    if (e['type'] == 'tap') {
      var value = e['target']['dataset']['alphaBeta']
      console.log(value)
      that.DelCategory(value)
    }
  },
  DelCategory: function (id) {
    let that = this; 
    //创建一个dialog
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/category/'+id,
      data: {
      },
      method: 'DELETE', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.access_token
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        if (res.statusCode == 200) {
          console.log(res.data['data']);
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          setTimeout(function () {
            that.getAllCategories() 
          }, 1500)
        } else {
          console.log(res.data);
          wx.showToast({
            title: '删除失败',
            icon: 'success',
            duration: 1500,
            mask: true
          })
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