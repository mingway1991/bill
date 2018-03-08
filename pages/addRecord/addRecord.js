Page({
  data: {
    access_token: '',
    categories: []
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '记账'
    })
    this.access_token = wx.getStorageSync('access_token')
    this.getLastRecord()
  },
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
  gotoSelectCategory: function() {
    wx.navigateTo({ url: '../../pages/selectCategory/selectCategory' })
  },
  changeValue: function(e) {
    let that = this
    console.log(e)
    if (e['type'] == 'change') {
      var id = e['target']['dataset']['alphaBeta']
      var value = e['detail']['value']
      for (var index in that.data.categories) {
        if (that.data.categories[index]['id'] == id) {
          that.data.categories[index]['value'] = value
          break
        }
      }
    }
  },
  saveRecord: function() {
    this.newRecord()
  },
  getLastRecord: function () {
    let that = this;
    //创建一个dialog
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/last_record',
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
          if (res.data['errorCode'] == 0) {
            console.log(res.data['data']);
            if (res.data['data']) {
              var items = res.data['data']['items']
              var categories = []
              for (var index in items) {
                var item = items[index]
                var category = {}
                category['id'] = item['category_id']
                category['name'] = item['category_name']
                category['value'] = item['money']
                categories.push(category)
              }
              that.setData({
                categories: categories
              })
            }
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
  },
  newRecord: function() {
    let that = this
    var items = []
    for (var index in that.data.categories) {
      var category = that.data.categories[index]
      items.push(category['id']+'#'+category['value'])
    }
    var record_str = items.join(',')
    console.log(record_str)
    //创建一个dialog
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      duration: 10000
    });
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/records',
      data: {
        'record_str': record_str
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      }, // 设置请求的 header
      success: function (res) {
        // success
        wx.hideToast();
        if (res.statusCode == 200) {
          if (res.data['errorCode'] == 0) {
            console.log(res.data['data']);
            wx.navigateBack();
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