Page({
  data: {
    access_token: ''
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '新增类别'
    })
    this.access_token = wx.getStorageSync('access_token')
  },
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
  formSubmit: function(e) {
    console.log(e)
    if (e['type'] == 'submit') {
      var value = e['detail']['value']['input']
      if (value.length == 0) {
        wx.showToast({
          title: '请输入内容',
          icon: 'success',
          duration: 1500,
          mask: true
        })
      } else {
        this.NewCategory(value)
      }
    }
  }, 
  NewCategory: function(name) {
    //创建一个dialog
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/categories',
      data: {
        'name': name
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
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
            title: '新建成功',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          console.log(res.data);
          wx.showToast({
            title: '新建失败',
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