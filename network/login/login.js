
var util = require('../../utils/util.js')

module.exports = {
  login: login,
  refresh: refresh
}

//登录
function login() {
  util.showLoadingToast('正在登录...');
  wx.login({
    success: res => {
      console.log(res)
      wx.request({
        url: 'https://api.bohetanglao.com/app/mina?code=' + res.code,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          util.hideToast();
          if (res.statusCode == 200) {
            console.log('服务器返回成功' + res.data['data']['access_token']);
            wx.setStorageSync('access_token', res.data['data']['access_token'])
            wx.setStorageSync('refresh_token', res.data['data']['refresh_token'])
            wx.setStorageSync('uid', res.data['data']['user']['uid'])
            if (res.data['data']['user']['nickname']) {
              wx.setStorageSync('nickname', res.data['data']['user']['nickname']) 
            }
            if (res.data['data']['user']['avatar']) {
              wx.setStorageSync('avatar', res.data['data']['user']['avatar'])
            }
            if (res.data['data']['user']['city']) {
              wx.setStorageSync('city', res.data['data']['user']['city'])
            }
            getUserInfo()
          } else {
            console.log(res.data);
          }
        }
      })
    },
    fail: function () {
      util.hideToast();
    }
  })
}

//刷新token
function refresh(refresh_token) {
  util.showLoadingToast('正在刷新...');
  wx.request({
    url: 'https://api.bohetanglao.com/app/refresh',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'Authorization': 'Bearer '+refresh_token
    },
    success: function (res) {
      wx.hideToast();
      if (res.statusCode == 200) {
        if (res.data['errorCode'] == 0) {
          wx.setStorageSync('access_token', res.data['data']['access_token'])
          wx.switchTab({
            url: '../../pages/index/index',
          })
        } else {
          login()
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

//获取微信个人信息
function getUserInfo() {
  wx.getUserInfo({
    success: function (res) {
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女 
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country
      updateUserInfo(nickName, avatarUrl, city)
    }
  })
}

//更新用户信息
function updateUserInfo(nickname, avatarUrl, city) {
  util.showLoadingToast('正在更新...');
  wx.request({
    url: 'https://api.bohetanglao.com/app/users',
    data: {
      'nickname': nickname,
      'avatar': avatarUrl,
      'city': city
    },
    method: 'PUT',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + wx.getStorageSync('access_token')
    },
    success: function (res) {
      wx.hideToast();
      if (res.statusCode == 200) {
        if (res.data['errorCode'] == 0) {
          if (nickname) {
            wx.setStorageSync('nickname', nickname)
          }
          if (avatarUrl) {
            wx.setStorageSync('avatar', avatarUrl)
          }
          if (city) {
            wx.setStorageSync('city', city)
          }
        }
        wx.switchTab({
          url: '../../pages/index/index',
        })
      } else {
        console.log(res.data);
      }
    },
    fail: function () {
      util.hideToast();
    }
  })
}