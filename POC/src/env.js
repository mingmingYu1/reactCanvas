/**
 * 开发环境、线上环境下的不同配置
 */

var env = {}

if (process.env.NODE_ENV === 'production') {

  /**
   * 线上环境
   */

  // 数据接口基础 URL
  env.baseUrl = '/api'

  // 页面根路径
  env.basePath = '/'

} else {

  /**
   * 开发环境
   */

  // 数据接口基础 URL
  //  env.baseUrl = 'http://localhost:9000'
  // env.baseUrl = 'http://172.24.5.127:8080/api'
  // env.baseUrl = 'http://localhost:9000'
  //env.baseUrl = 'http://172.24.5.127:8080/api'
 //env.baseUrl = 'http://192.168.173.85:8080/api' //***向冉的 
    // env.baseUrl = 'http://192.168.172.121:8080/api'  //**力文的
    // env.baseUrl = 'http://192.168.173.40:8080/api'  //**剑玉的
    // env.baseUrl = 'http://172.24.5.127:8080/api' // 线上接口
    // env.baseUrl = 'http://192.168.172.48:8080/api'  //**金伟的
    // env.baseUrl = 'http://10.12.4.166:8080/api'
    env.baseUrl = 'http://10.12.8.150:8080/api'
    // env.baseUrl = 'http://10.12.8.138:8080/api'
  // 页面根路径
  env.basePath = '/'


}

module.exports = env