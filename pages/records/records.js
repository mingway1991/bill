var util = require('../../utils/util.js')

Page({
  data: {
    access_token: '',
    records: [],
    page_index: 1,
    page_size: 20,
    has_more_data: true,
    is_loading: true
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
    that.getRecords(true)
  },
  tapRecord: function (e) {
    let that = this;
    if (e['type'] == 'tap') {
      var value = e['currentTarget']['dataset']['alphaBeta'];
      console.log(value)
      var pass_record = null;
      for (var index in that.data.records) {
        var record = that.data.records[index]
        if (record.id == value) {
          pass_record = record
          break
        }
      }
      console.log(pass_record)
      var model = JSON.stringify(pass_record);
      wx.navigateTo({
        url: '../../pages/recordDetail/recordDetail?record=' + model,
      })
    }
  },
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading()
    that.data.page_index = 1
    that.getRecords(true)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.has_more_data) {
      that.getRecords(false)
    }
  },
  //请求记录
  getRecords: function (is_refresh) {
    let that = this;
    that.setData({
      is_loading: true
    });
    wx.request({
      url: 'https://api.bohetanglao.com/app/bill/records?page_index=' + that.data.page_index + '&page_size=' + that.data.page_size,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + that.access_token
      },
      success: function (res) {
        that.setData({
          is_loading: false
        });
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
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
            if (is_refresh) {
              that.setData({
                records: cur_records,
                has_more_data: false
              })
            } else {
              that.setData({
                records: that.data.records.concat(cur_records),
                has_more_data: false
              })
            }
          } else {
            if (is_refresh) {
              that.setData({
                records: cur_records,
                has_more_data: true,
                page_index: that.data.page_index + 1
              })
            } else {
              that.setData({
                records: that.data.records.concat(cur_records),
                has_more_data: true,
                page_index: that.data.page_index + 1
              })
            }
          }
        } else {
          that.setData({
            is_loading: false
          });
          util.showToast('请求出错');
        }
      }
    }) 
  }
})