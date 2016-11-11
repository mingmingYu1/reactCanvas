/**
 * 整个应用的入口，所有资源的根源
 */ 
import xhr from 'bfd/xhr'
import message from 'bfd/message'
import msgdanger from 'public/msgdanger'
import auth from 'public/auth'
import router from './router'
import env from './env'
import emitter from './eventEmitter'
import pace from './pace'
import './pace.less'


pace.start()

/**
 * AJAX 全局配置，比如请求失败、会话过期的全局处理。参考 bfd-ui AJAX 请求组件
 */
xhr.baseUrl = env.baseUrl + '/'

xhr.success = (res, option) => {
  emitter.emit("loading-false")
  if (typeof res !== 'object') {
    console.error(option.url + ': response data should be JSON')
    return
  }
  switch (res.code) {
    case 200:
      option.success && option.success(res.data)
      break;
    case 500:
      option.success && option.success(res)
      break;
    case 401:
      auth.destroy()
      router.history.replaceState({
        referrer: router.state.location.pathname
      }, '/login')
      break;
    default:
      console.log("登录超时！")
      console.error(res.message || 'unknown error')
  }
}

xhr.error = (res, option) =>{  
  msgdanger('您的网络不稳定，请检查后重试！')
  emitter.emit("loading-false")  
  option.error && option.error(res)
}