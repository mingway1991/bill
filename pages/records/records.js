var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    records: [],
    page_index: 1,
    page_size: 20,
    has_more_data: true
  },
  onShow: function () {
    var that = this
    if (that.data.isBack) {
      wx.navigateBack()
    }
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '记录列表'
    })
    let that = this
    that.access_token = wx.getStorageSync('access_token')
    that.getAllRecords('正在加载数据...')
  },
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let that = this;
    that.data.page_index = 1
    that.getAllRecords('正在刷新数据')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.has_more_data) {
      that.getAllRecords()
    } else {
      util.showToast('没有更多数据');
    }
  },
  //请求所有记录
  getAllRecords: function () {
    let that = this;
    if (that.data.has_more_data) {
      wx.request({
        url: 'https://api.bohetanglao.com/app/bill/records?page_index=' + that.data.page_index + '&page_size=' + that.data.page_size,
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + that.access_token
        },
        success: function (res) {
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
            util.showToast('请求出错');
          }
        }
      }) 
    } else {
      console.log('没有更多数据了')
    }
  }
})