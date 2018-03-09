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
  },
  onLoad: function () {
    let that = this;
    wx.setNavigationBarTitle({
      title: '记账'
    })
    that.access_token = wx.getStorageSync('access_token')
    that.getLastRecord()
  },
  //动作
  changeValue: function (e) {
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
  saveRecord: function () {
    this.newRecord()
  },
  //跳转
  gotoSelectCategory: function() {
    let that = this
    var categoryIdArray = []
    for (var index in that.data.categories) {
      categoryIdArray.push(that.data.categories[index]['id'])
    }
    var categoryIdStr = categoryIdArray.join(',')
    wx.navigateTo({ url: '../../pages/selectCategory/selectCategory?categoryIdStr='+ categoryIdStr})
  },
  //请求最后一条记录
  getLastRecord: function () {
    let that = this;
    util.showLoadingToast('正在加载...');
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/last_record',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
        util.hideToast();
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
        util.hideToast();
      }
    })
  },
  //请求新增记录
  newRecord: function() {
    let that = this
    var items = []
    for (var index in that.data.categories) {
      var category = that.data.categories[index]
      items.push(category['id']+'#'+category['value'])
    }
    var record_str = items.join(',')
    console.log(record_str)
    util.showLoadingToast('正在创建...');
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/records',
      data: {
        'record_str': record_str
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
        util.hideToast();
        if (res.statusCode == 200) {
          if (res.data['errorCode'] == 0) {
            console.log(res.data['data']);
            util.showSuccessToast('创建成功');
          } else {
            console.log(res.data);
          }
        } else {
          console.log(res.data);
        }
      },
      fail: function () {
        util.hideToast();
      }
    })
  }
})