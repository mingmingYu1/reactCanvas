
import xhr2 from 'bfd/xhr'
import emitter from '../eventEmitter'

const xhr = function(option){ 
  option.beforeSend = function(){
    emitter.emit("loading-true")
  } 
  option.url = encodeURI(option.url)
  xhr2(option)
}
module.exports = xhr