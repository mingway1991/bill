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
  checkboxChange: function (e) {
    let that = this;
    var categories = that.data.categories, values = e.detail.value;
    for (var i = 0, lenI = categories.length; i < lenI; ++i) {
      if (categories[i]['isDisabled']) {
        continue;
      }
      categories[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (categories[i].id == values[j]) {
          categories[i].checked = true;
          break;
        }
      }
    }
    that.setData({
      categories: categories
    });
  },
  //保存选择
  saveSelected: function () {
    let that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var newCategories = prevPage.data.categories;
    for (var index in that.data.categories) {
      var category = that.data.categories[index];
      if (category['isDisabled'] == false && category['checked'] == true) {
        newCategories.push({ 'id': category['id'], 'name': category['name'], 'value': category['value']});
      }
    }
    prevPage.setData({
      categories: newCategories
    });
    console.log(prevPage.data.categories)
    wx.navigateBack();
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
            category['value'] = 0
            category['isDisabled'] = isDisabled
            category['checked'] = isDisabled
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