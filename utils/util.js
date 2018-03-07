var CryptoJS = require('aes.js').CryptoJS;
var Base64 = require('base64.js').Base64;
var sha = require("sha/sha.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  encrpy: encrpy
}

function encrpy(plaintText) {
  plaintText = '1234567890098765'
  var shaObj = new sha("SHA-384", "TEXT");
  shaObj.update("0123456789abcdef");
  var hashResult = shaObj.getHash("HEX");
  var key = hashResult.substring(0, 32);
  var iv = hashResult.substring(32, 48);
  console.log(key);
  console.log(iv);
  var encrypted = CryptoJS.AES.encrypt(plaintText, key, { iv: iv, mode:   
  CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
  var encryptedStr = encrypted.ciphertext.toString().toUpperCase();
  console.log(encryptedStr);
  var base64 = new Base64();
  var result = base64.encode(encryptedStr);
  return result;
}
