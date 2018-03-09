var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    categories: [],
    selectedCategoryIdArray: []
  },
  onShow: function () {
    var that = this
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
  onLoad: function (options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '选择类别'
    })
    that.access_token = wx.getStorageSync('access_token')
    that.getAllCategories()
    var categoryIdArray = options['categoryIdStr'].split(',')
    that.setData({
      selectedCategoryIdArray: categoryIdArray
    })
  },
  //选择类别动作
  selectCategoryAction: function (e) {
    let that = this;
    if (e['type'] == 'tap') {
      var value = e['target']['dataset']['alphaBeta']
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      for (var index in that.data.categories) {
        if (that.data.categories[index]['id'] == value) {
          that.setData({
            selectedCategory: that.data.categories[index]
          })
          break
        }
      }
      var new_categories = prevPage.data.categories
      that.data.selectedCategory['value'] = 0
      new_categories.push(that.data.selectedCategory)
      console.log(new_categories)
      prevPage.setData({
        categories: new_categories
      })
      wx.navigateBack();
    }
  },
  //请求获取所有类别
  getAllCategories: function () {
    let that = this;
    util.showLoadingToast('获取类别列表...');
    //请求服务器
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/categories',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
        wx.hideToast();
        if (res.statusCode == 200) {
          var categories = res.data['data']
          for (var indexX in categories) {
            var category = categories[indexX]
            var isDisabled = false
            for (var indexY in that.data.selectedCategoryIdArray) {
              var selectedId = that.data.selectedCategoryIdArray[indexY]
              if (category['id'] == selectedId) {
                isDisabled = true
                break
              }
            }
            category['disabled'] = isDisabled
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
  }
})