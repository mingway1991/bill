Page({
  data: {
    access_token: '',
    categories: [],
    selectedCategoryIdArray: []
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '选择类别'
    })
    this.access_token = wx.getStorageSync('access_token')
    this.getAllCategories()
    var categoryIdArray = options['categoryIdStr'].split(',')
    this.setData({
      selectedCategoryIdArray: categoryIdArray
    })
  },
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
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
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        categories: new_categories
      })

      wx.navigateBack();
    }
  },
  getAllCategories: function () {
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
        // fail
        wx.hideToast();
      },
      complete: function () {
        // complete
      }
    })
  },
  removeAction: function (e) {
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
      url: 'https://api.bohetanglao.com/app/bill/category/' + id,
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