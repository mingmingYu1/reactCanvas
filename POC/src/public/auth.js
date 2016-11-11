/**
 * 用户会话信息，auth.user = window.user
 * auth 作为模块供其他模块使用
 */
const auth = {

  isLoggedIn() {
    return !!auth.user
  },

  register(user) {
    auth.user = user
  },

  destroy() {
    auth.user = null
  }
}

if (process.env.NODE_ENV !== 'production') { 
  window.user = {
    "createTime": 1473147297000,
    "createUser": "管理员",
    "depart": "99",
    "desc": "默认添加的用户",
    "email": "abc.com",
    // "headPic": "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP///////////////////…oEFFFFABRSUUALRRRQAUlLSUAPXv8A5/z0p4pg6f59qcKAEY0ylNJQAUUUUAFFFFABRRSUAf/Z",
    "id": 1,//1570,
    "loginId": "zhangjin",
    "modifyUser": "管理员",
    "name": "张瑾",
    "passwd": "f379eaf3c831b04de153469d1bec345e",
    "resources": [{
      "active": false,
      "desc": "",
      "extParam": "",
      "name": "部门空间",
      "type": 1,
      "uri": "/data/department"
    }, {
      "active": false,
      "desc": "资源绩效",
      "extParam": "",
      "name": "资源绩效",
      "type": 1,
      "uri": "/data/performance"
    }, {
      "active": false,
      "desc": "系统管理",
      "extParam": "",
      "name": "系统管理",
      "type": 1,
      "uri": "/data/manage"
    }],
    "roles": [],
    "sex": "1",
    "status": 1,
    "tDepart": {
      "code": "10005",
      "id": 99,
      "name": "数据中心"
    }
  }



}

auth.register(window.user)

export default auth