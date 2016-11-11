import React from 'react'
import { Modal, Button } from 'antd'
import DataTable from 'bfd/DataTable'
import { Select, Option } from 'bfd-ui/lib/Select'
import xhr from 'public/xhr'
import URL from 'public/url'
import common from 'public/common'
import Auth from 'public/auth'
import SearchBox from './SearchBox'
import './index.less'
import message from 'bfd/message'

export default React.createClass({
	getInitialState() {
		return {
      //用户
      auth: (Auth.user ? Auth : window),

      // 查询
      searchInp: '',

			visible: false,
			visible2: false,
      visible4: false,
      //监控空格编码
      isSpace: false,
      tableData: {},
      allGroup: [],
      allDept: [],
      newUser: {
        newUserName: '',
        newLoginName: '',
        newEmail: '',
        newSex: '',
        newGroupId: '',
        newDeptId: '',
        newPostId: '',
        newRemark: ''
      },
      newTipsShow: false,
      newAllDept: [],
      newAllPost: [],
      changeUser: {
        oldData: {
          createTime: '',
          createUser: '',
          email: '',
          id: '',
          loginId: '',
          name: '',
          resources: [],
          roles: [{
            id: '',
            name: ''
          }],
          tDepart: {
            id: '',
            name: ''
          }
        },
        changeUserName: '',
        // changeLoginName: '',
        changeEmail: '',
        changeSex: '',
        changeDeptId: '',
        changePostId: '',
        changeRemark: '',
        changeAllPost: []
      },
      column: [{
        title:'序号',
        key:'sequence'
      }, {
        title: '用户名',
        width: '100px',
        key: 'name'
      }, {
        title: '登录名',
        width: '100px',
        key: 'loginId'
      }, {
        title: '部门',
        key: 'depart',
        render: (text, item) => {
          return (
            <div>{item.tDepart.name}</div>
          )
        }
      }, {
        title: '岗位',
        key: 'post',
        render: (text, item) => {
          return (
            <div>{ (item.roles.length ? item.roles[0].name : '')}</div>
          )
        } 
      }, {
        title: '邮箱',
        key: 'email'
      }
      , {
        title: '操作',
        width: '235px',
        /**
         * @param item  当前数据对象
         * @param component 当前
         * @returns {XML}  返回dom对象
         */
        render:(item, component)=> {
          // return <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>编辑</a>
          return (
          	<div className="usermanage-operation">
          		<Button type="primary" onClick={this.showModal2.bind(this, item)}>修改</Button>
              <Button type="nomal" onClick={this.changePassword.bind(this, item)}>重置密码</Button>
              <Button onClick={this.showConfirm.bind(this, item)}>删除</Button>
          	</div>
          )
        },
        key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }]
		}
	},
  
  handleCancel(e) {
    this.setState({
      visible: false,
      newTipsShow: false
    });
  },

  showConfirm(item) {
    let self = this
  	Modal.confirm({
  		title: '您是否确认要删除该用户',
	    onOk() {
        xhr({
          type: 'get',
          url: `${URL.MANAGE_USER_DELETE}?id=${item.id}`,
          success: (result) => {
            if (result.flag) {
              //初始化表格数据
              xhr({
                type: 'get',
                url: `${URL.MANAGE_USER_MANAGE}?currentPage=1&pageSize=10`,
                success: (result) => {
                  self.setState({
                    tableData: result
                  })
                }
              })
            } else {
              if (result.message === '用户正在使用中，不能删除') {
                alert(result.message)
              } else {
                alert('删除失败，请重新删除！')
              }
            }
          }
        })
	    },
	    onCancel() {},
  	})
  },
  handleClick(item, event) {
    event = event ? event : window.event
    event.stopPropagation()
  },
  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
     //TODO
     xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_MANAGE}?currentPage=${page}&pageSize=10&name=${this.state.searchInp}&field=${this.state.searchType}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },
  handleRowClick(row) {
    // console.log('rowclick', row)
  },
  handleOrder(name, sort) {
    // console.log(name, sort)
  },

  //新增用户
  showModal() {
    this.setState({
      visible: true
    })
  },

  //新增用户名
  newUserName(ev) {
    let newUser = this.state.newUser
    let oldName = newUser.newUserName
    newUser.newUserName = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(newUser.newUserName) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      newUser.newUserName = common.replaceSpace(newUser.newUserName)
    }

    this.setState({
      newUser: newUser
    })
  },

  //新增登录名
  newLoginName(ev) {
    let newUser = this.state.newUser
    let oldName = newUser.newLoginName
    newUser.newLoginName = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(newUser.newLoginName) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      newUser.newLoginName = common.replaceSpace(newUser.newLoginName)
    }

    this.setState({
      newUser: newUser
    })
  },

  //新增邮箱
  newEmail(ev) {
    let newUser = this.state.newUser
    let oldName = newUser.newEmail
    newUser.newEmail = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(newUser.newEmail) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      newUser.newEmail = common.replaceSpace(newUser.newEmail)
    }

    this.setState({
      newUser: newUser
    })
  },

  //新增备注
  newRemark(ev) {
    let newUser = this.state.newUser
    let oldName = newUser.newRemark
    newUser.newRemark = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(newUser.newRemark) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      newUser.newRemark = common.replaceSpace(newUser.newRemark)
    }

    this.setState({
      newUser: newUser
    })
  },

  // 新增 组织选择
  newGroupSelect(data) {
    let newUser = this.state.newUser
    newUser.newGroupId = data

    //部门岗位重置
    $('.user-new-dept .title').html('请选择')
    $('.user-new-post .title').html('请选择')
    newUser.newDeptId = ''
    newUser.newPostId = ''

    //获取对应的所有部门
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_DEPTALL}?groupId=${data}`,
      success: (result) => {
        this.setState({
          newAllDept: result
        })
      }
    })

    this.setState({
      newUser: newUser
    })
  },

  // 新增 部门选择
  newDeptSelect(data) {
    let newUser = this.state.newUser
    newUser.newDeptId = data

    //岗位重置
    $('.user-new-post .title').html('请选择')
    newUser.newPostId = ''

    //获取对应的所有岗位
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_ROLEALL}?deptId=${data}`,
      success: (result) => {
        this.setState({
          newAllPost: result
        })
      }
    })

    this.setState({
      newUser: newUser
    })
  },

  // 岗位选择
  newPostSelect(data) {
    let newUser = this.state.newUser
    newUser.newPostId = data
    this.setState({
      newUser: newUser
    })
  },

  // 性别选择
  newSexSelect(data) {
    let newUser = this.state.newUser
    newUser.newSex = data
    this.setState({
      newUser: newUser
    })
  },

  //增加modal 确定事件
  handleOk() {
    let email = this.state.newUser.newEmail
    let loginName = this.state.newUser.newLoginName
    let userName = this.state.newUser.newUserName
    let remark = this.state.newUser.newRemark

    let checkList = {
      email: [email],
      max15: [userName, loginName],
      max255: [remark, email],
      illegal: [userName, loginName,remark]
    }

    let checkInp = (obj) => {
      for (let name in obj) {
        if (!obj[name]) {
          return false
        }
      }
      for (let myKey in checkList) {
        switch (myKey) {
          case 'email': 
            for (let myIndex in checkList[myKey]) {
              if ( !common.isEmail(checkList[myKey][myIndex]) ) {
                 return false 
              }
            }
            break;
          case 'max15':
            for (let myIndex in checkList[myKey]) {
              if ( common.maxChar(checkList[myKey][myIndex]) ) {
                 return false 
              }
            }
            break;
          case 'max255': 
            for (let myIndex in checkList[myKey]) {
              if ( common.maxChar(checkList[myKey][myIndex],255) ) {
                 return false 
              }
            }
            break;
          case 'illegal': 
            for (let myIndex in checkList[myKey]) {
              if ( common.illegalChar(checkList[myKey][myIndex]) ) {
                 return false 
              }
            }
            break; 
        }
      }
      return true
    }
    
    if (checkInp(this.state.newUser)) {
      this.setState({
        newTipsShow: false
      })
      xhr({
        type: 'get',
        url: URL.MANAGE_USER_ADD 
              +'?name=' + this.state.newUser.newUserName
              +'&loginId=' + this.state.newUser.newLoginName
              +'&email=' + this.state.newUser.newEmail
              +'&depart=' + this.state.newUser.newDeptId
              +'&sex=' + this.state.newUser.newSex
              +'&roleIds=' + this.state.newUser.newPostId
              +'&desc=' + this.state.newUser.newRemark
              +'&createUser=' + this.state.auth.user.name
              +'&modifyUser=' + this.state.auth.user.name
              +'&status=0'
              ,
        success: (result) => {
          if (result.flag) {
            //添加成功，初始化表格数据
            xhr({
              type: 'get',
              url: `${URL.MANAGE_USER_MANAGE}?currentPage=1&pageSize=10`,
              success: (result) => {
                this.setState({
                  tableData: result,
                  visible: false,
                })
              }
            })
          } else {
            if (result.message === '登录名不能重复') {
              alert('登录名已存在，请重新输入')
            } else {
              alert('添加失败，请重新添加')
            }
          }
        }
      })
    } else {
      this.setState({
        visible: true,
        newTipsShow: true
      })
    }
  },

  // 修改modal
  showModal2(item) {
    // 后台返回的没有组织的信息
    // console.log(item)
    let changeUser = this.state.changeUser
    changeUser.oldData = item
    changeUser.changeUserName = item.name
    // changeUser.changeLoginName = item.loginId
    changeUser.changeEmail = item.email
    changeUser.changeSex = item.sex
    changeUser.changeDeptId = item.tDepart.id
    changeUser.changePostId = (item.roles.length ? item.roles[0].id : '')
    changeUser.changeRemark = item.desc
    this.setState({
      visible2: true,
      changeUser: changeUser,
      changeTipsShow: false
    })
  },

  //重置密码
  changePassword(item) {
    let userId =  item.id    
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_RESETPWD}?id=${userId}`,
      success: (result) => {
        if (result.flag) {
          message.success(result.message)
        } else {
          message.danger(result.message)
        }
      }
    })
  },

  // 修改modal 用户名
  changeUserName (ev) {
    let changeUser = this.state.changeUser
    let oldName = changeUser.changeUserName
    changeUser.changeUserName = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(changeUser.changeUser) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      changeUser.changeUser = common.replaceSpace(changeUser.changeUser)
    }

    this.setState({
      changeUser: changeUser
    })
  },

  // 修改modal 登录名
  // changeLoginName(ev) {
  //   let changeUser = this.state.changeUser
  //   let oldName = changeUser.changeLoginName
  //   changeUser.changeLoginName = ev.target.value
  //   //切换中文输入时候不会进入keypress事件
  //   if (this.state.isSpace && oldName == common.replaceSpace(changeUser.changeLoginName) ) {
  //     this.setState({
  //       isSpace: false
  //     })
  //   }
  //   if (this.state.isSpace) {
  //     changeUser.changeLoginName = common.replaceSpace(changeUser.changeLoginName)
  //   }
  //   this.setState({
  //     changeUser: changeUser
  //   })
  // },

  // 修改modal 邮箱
  changeEmail(ev) {
    let changeUser = this.state.changeUser
    let oldName = changeUser.changeEmail
    changeUser.changeEmail = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(changeUser.changeEmail) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      changeUser.changeEmail = common.replaceSpace(changeUser.changeEmail)
    }

    this.setState({
      changeUser: changeUser
    })
  },

  //修改modal 取消
  handleCancel2(e) {
    this.setState({
      visible2: false,
    })
  },

  // 修改modal 性别
  changeSexSelect(data) {
    let changeUser = this.state.changeUser
    changeUser.changeSex = data
    this.setState({
      chagneUser: changeUser
    })
  },

  //修改modal 部门
  changeDeptSelect(data) {
    let changeUser = this.state.changeUser
    changeUser.changeDeptId = data

    //岗位重置
    // $('.user-change-post .title').html('请选择')
    // changeUser.changePostId = ''

    //获取部门下的岗位
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_ROLEALL}?deptId=${data}`,
      success: (result) => {
        console.log(result)
        console.log('haha')
        changeUser.changeAllPost = result
        this.setState({
          chagneUser: changeUser
        })
      }
    })
  },

  // 修改modal 岗位
  changePostSelect(data) {
    let changeUser = this.state.changeUser
    changeUser.changePostId = data
    this.setState({
      chagneUser: changeUser
    })
  },

  // 修改modal备注
  changeRemark(ev) {
    let changeUser = this.state.changeUser
    let oldName = changeUser.changeRemark
    changeUser.changeRemark = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(changeUser.changeRemark) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      changeUser.changeRemark = common.replaceSpace(changeUser.changeRemark)
    }
    this.setState({
      chagneUser: changeUser
    })
  },

  // 修改modal确定
  handleOk2() {
    let email = this.state.changeUser.changeEmail
    // let loginName = this.state.changeUser.changeLoginName
    let userName = this.state.changeUser.changeUserName
    let remark = this.state.changeUser.changeRemark

    let checkList = {
      email: [email],
      max15: [userName],
      max255: [remark, email],
      illegal: [userName, remark]
    }

    let checkInp = (obj) => {
      for (let name in obj) {
        if (!obj[name]) {
          return false
        }
      }
      for (let myKey in checkList) {
        switch (myKey) {
          case 'email': 
            for (let myIndex in checkList[myKey]) {
              if ( !common.isEmail(checkList[myKey][myIndex]) ) {
                 return false 
              }
            }
            break;
          case 'max15':
            for (let myIndex in checkList[myKey]) {
              if ( common.maxChar(checkList[myKey][myIndex]) ) {
                 return false 
              }
            }
            break;
          case 'max255': 
            for (let myIndex in checkList[myKey]) {
              if ( common.maxChar(checkList[myKey][myIndex],255) ) {
                 return false 
              }
            }
            break;
          case 'illegal': 
            for (let myIndex in checkList[myKey]) {
              if ( common.illegalChar(checkList[myKey][myIndex]) ) {
                 return false 
              }
            }
            break; 
        }
      }
      return true
    }
    //提交修改
    if ( checkInp(this.state.changeUser) ) {
      this.setState({
        changeTipsShow: false
      })
      xhr({
        type: 'get',
        url: URL.MANAGE_USER_UPDATE 
              +'?id=' + this.state.changeUser.oldData.id
              + '&name=' + this.state.changeUser.changeUserName
              // + '&loginId=' + this.state.changeUser.changeLoginName
              + '&email=' + this.state.changeUser.changeEmail
              + '&depart=' + this.state.changeUser.changeDeptId
              + '&roleIds=' + this.state.changeUser.changePostId
              + '&sex=' + this.state.changeUser.changeSex
              + '&desc=' + this.state.changeUser.changeRemark
              + '&modifyUser=' + this.state.auth.user.name
        ,
        success: (result) => {
          if (result.flag) {
            this.setState({
              visible2: false,
            })
            // 初始化表格数据
            xhr({
              type: 'get',
              url: `${URL.MANAGE_USER_MANAGE}?currentPage=1&pageSize=10`,
              success: (result) => {
                this.setState({
                  tableData: result
                })
              }
            })
          } else {
            alert('修改失败，请重新修改')
          }
          
        }
      })
    } else {
      this.setState({
        changeTipsShow: true
      })
    }
  },

  // 模糊搜索
  searchBtn(str, type) {
    let searchBoxType = type ? type : ''
    this.setState({
      searchInp: str,
      searchType: searchBoxType
    })
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_MANAGE}?name=${str}&currentPage=1&pageSize=10&field=${searchBoxType}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },


  componentDidMount() {

    // 表格数据
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_MANAGE}?currentPage=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })

    // 所有组织
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_GROUPALL}`,
      success: (result) => {
        this.setState({
          allGroup: result
        })
      }
    })

    // 所有部门
    xhr({
      type: 'get',
      url: `${URL.MANAGE_USER_DEPTALL}`,
      success: (result) => {
        this.setState({
          allDept: result
        })
      }
    })
  },

	render() {

    // 所有组织
    const allGroup = this.state.allGroup.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    //所有部门
    const allDept = this.state.allDept.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    // 新增 对应部门
    const newAllDept = this.state.newAllDept.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    // 新增 对应岗位
    const newAllPost = this.state.newAllPost.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    // 修改 岗位
    const changeAllPost = this.state.changeUser.changeAllPost.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

		return (
			<div className="usermanage-box">
				<h3 className="usermanage-tit">用户管理</h3>
				<div className="usermanage-top clearfix">
					<div className="pull-left">
						<div className="pull-left new-user">
							<Button type="primary" onClick={this.showModal}>
	            	<i className="fa fa-plus"></i>
	            	<span>新增</span>
	          	</Button>
						</div>
					</div>
          <SearchBox callBackFn={this.searchBtn}></SearchBox>
				</div>
				<div className="usermanage-main">
					<DataTable 
            className="manage-table"
		        data={this.state.tableData} 
		        onPageChange={this.onPageChange} 
		        showPage="true" 
		        column={this.state.column} 
		        howRow={10}
		        onRowClick={this.handleRowClick}
		        onOrder={this.handleOrder} >
		      </DataTable>
				</div>
				<Modal title="新增用户" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          className="manage-modal"
        >
          <div className="modal-new-box">
          	<div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">用户名：</span>
              </div>
              <input onChange={this.newUserName} onKeyPress={ this.myKeyPress } className="col-md-9" value={this.state.newUser.newUserName} type="text" /> 
            </div>
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">登录名：</span>
              </div>
              <input onChange={this.newLoginName} onKeyPress={ this.myKeyPress } className="col-md-9" value={this.state.newUser.newLoginName} type="text" /> 
            </div>
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">邮箱：</span>
              </div>
              <input onChange={this.newEmail} onKeyPress={ this.myKeyPress } className="col-md-9" value={this.state.newUser.newEmail} type="text" /> 
            </div>
            <div className="row modal-new-con2">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">性别：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.newSexSelect}>
                  <Option>请选择</Option>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con2">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">组织：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.newGroupSelect}>
                  <Option>请选择</Option>
                  {allGroup}
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con2 user-new-dept">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">部门：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.newDeptSelect}>
                  <Option>请选择</Option>
                  {newAllDept}
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con2 user-new-post">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">岗位：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.newPostSelect}>
                  <Option>请选择</Option>
                  {newAllPost}
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">备注：</span>
              </div>
              <textarea onKeyPress={ this.myKeyPress } onChange={this.newRemark} className="col-md-9" value={this.state.newUser.newRemark}>
                
              </textarea>
            </div>
            <div className="row modal-new-con">
              <span className="col-md-3"></span>
              <div className={ "newTips col-md-9 " + (this.state.newTipsShow ? 'newTipsShow' : '') }>存在未输入项或用户名、登录名长度大于15或包含空格、特殊字符或邮箱格式正确</div>
            </div>
          </div>
        </Modal>
        <Modal title="修改用户" visible={this.state.visible2}
          onOk={this.handleOk2} onCancel={this.handleCancel2}
          className="manage-modal"
        >
          <div className="modal-new-box">
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">用户名：</span>
              </div>
              <input onChange={this.changeUserName} onKeyPress={ this.myKeyPress } className="col-md-9" value={this.state.changeUser.changeUserName} type="text" /> 
            </div>
          {/**
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">登录名：</span>
              </div>
              <input style={{borderColor: '#ccc', color: '#ccc'}} disabled="true" className="col-md-9" value={this.state.changeUser.changeLoginName} type="text" /> 
            </div>
          */}
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">邮箱：</span>
              </div>
              <input onChange={this.changeEmail} onKeyPress={ this.myKeyPress } className="col-md-9" value={this.state.changeUser.changeEmail} type="text" /> 
            </div>
            <div className="row modal-new-con2">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">性别：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.changeSexSelect}>
                  <Option style={{ display: 'none' }}>{(this.state.changeUser.oldData.sex == 1 ? '男' : '女')}</Option>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con2">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">部门：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.changeDeptSelect}>
                  <Option style={{display: 'none'}}>{(this.state.changeUser.oldData.tDepart.name ? this.state.changeUser.oldData.tDepart.name : '请选择')}</Option>
                  {allDept}
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con2 user-change-post">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">岗位：</span>
              </div>
              <div className="col-md-9 modal-drop-down">
                <Select onChange={this.changePostSelect}>
                  <Option style={{display: 'none'}}>{(this.state.changeUser.oldData.roles.length ? this.state.changeUser.oldData.roles[0].name : '请选择')}</Option>
                  {changeAllPost}
                </Select>
              </div> 
            </div>
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">备注：</span>
              </div>
              <textarea onChange={this.changeRemark} onKeyPress={ this.myKeyPress } className="col-md-9" value={this.state.changeUser.changeRemark}>
                
              </textarea>
            </div>
            <div className="row modal-new-con">
              <span className="col-md-3"></span>
              <div className={ "newTips col-md-9 " + (this.state.changeTipsShow ? 'newTipsShow' : '') }>存在未输入项或用户名、登录名长度大于15或包含空格、特殊字符或邮箱格式正确</div>
            </div>
          </div>
        </Modal>
			</div>
		)
	}
})