Page({
  data: {
    access_token: '',
    records: [],
    page_index: 1,
    page_size: 20,
    has_more_data: true
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '记录列表'
    })
  },
  onShow: function () {
    var that = this
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
  onLoad: function () {
    let that = this
    that.access_token = wx.getStorageSync('access_token')
    that.getAllRecords('正在加载数据...')
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.data.page_index = 1
    this.getAllRecords('正在刷新数据')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.has_more_data) {
      this.getAllRecords('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  getAllRecords: function (message) {
    let that = this;
    if (that.data.has_more_data) {
      //请求服务器
      wx.request({
        url: 'https://api.bohetanglao.com/app/bill/records?page_index=' + that.data.page_index + '&page_size=' + that.data.page_size,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + that.access_token
        }, // 设置请求的 header
        success: function (res) {
          // success
          if (res.statusCode == 200) {
            var cur_records = []
            if (res.data['data']) {
              cur_records = res.data['data']
            }
            for (var indexX in cur_records) {
              var record = cur_records[indexX]
              var total = 0
              for (var indexY in record['items']) {
                var item = record['items'][indexY]
                total += item['money']
              }
              record['money'] = total
            }
            if (cur_records.length < that.data.page_size) {
              that.setData({
                records: that.data.records.concat(cur_records),
                has_more_data: false
              })
            } else {
              that.setData({
                records: that.data.records.concat(cur_records),
                has_more_data: true,
                page_index: that.data.page_index + 1
              })
            }
          } else {
            wx.showToast({
              title: '错误'
            })
          }
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      }) 
    } else {
      console.log('没有更多数据了')
    }
  }
})