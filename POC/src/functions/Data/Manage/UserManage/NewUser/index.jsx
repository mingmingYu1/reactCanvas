import React from 'react'
import { Modal, Button } from 'antd'
import DataTable from 'bfd/DataTable'
import { Select, Option } from 'bfd-ui/lib/Select'
import xhr from 'public/xhr'
import URL from 'public/url'
import Auth from 'public/auth'
import './index.less'

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
		}
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
    newUser.newUserName = ev.target.value

    this.setState({
      newUser: newUser
    })
  },

  //新增登录名
  newLoginName(ev) {
    let newUser = this.state.newUser
    newUser.newLoginName = ev.target.value

    this.setState({
      newUser: newUser
    })
  },

  //新增邮箱
  newEmail(ev) {
    let newUser = this.state.newUser
    newUser.newEmail = ev.target.value

    this.setState({
      newUser: newUser
    })
  },

  //新增备注
  newRemark(ev) {
    let newUser = this.state.newUser
    newUser.newRemark = ev.target.value

    this.setState({
      newUser: newUser
    })
  },

  // 新增 组织选择
  newGroupSelect(data) {
    let newUser = this.state.newUser
    newUser.newGroupId = data

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
    debugger
    let checkInp = (obj) => {
      for (let name in obj) {
        if (!obj[name]) {
          return false
        }
      }
      if ((this.state.newUser.newUserName.length > 15) || (this.state.newUser.newLoginName.length > 15)) {
        return false
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

  componentDidMount() {

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

    return (
    	<div>
    		<Button type="primary" onClick={this.showModal}>
        	<i className="fa fa-plus"></i>
        	<span>新增</span>
      	</Button>
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
              <input onChange={this.newUserName} className="col-md-9" value={this.state.newUser.newUserName} type="text" /> 
            </div>
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">登录名：</span>
              </div>
              <input onChange={this.newLoginName} className="col-md-9" value={this.state.newUser.newLoginName} type="text" /> 
            </div>
            <div className="row modal-new-con">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">邮箱：</span>
              </div>
              <input onChange={this.newEmail} className="col-md-9" value={this.state.newUser.newEmail} type="text" /> 
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
            <div className="row modal-new-con2">
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
            <div className="row modal-new-con2">
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
              <textarea onChange={this.newRemark} className="col-md-9" value={this.state.newUser.newRemark}>
                
              </textarea>
            </div>
            <div className="row modal-new-con">
              <span className="col-md-3"></span>
              <div className={ "newTips col-md-9 " + (this.state.newTipsShow ? 'newTipsShow' : '') }>存在未输入项或用户名、登录名长度大于15</div>
            </div>
          </div>
        </Modal>
    	</div>
    )
	}
})