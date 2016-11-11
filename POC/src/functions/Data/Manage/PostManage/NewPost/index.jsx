import React from 'react'
import xhr from 'public/xhr'
import URL from 'public/url'
import common from 'public/common'
import Tree from 'bfd/Tree'
import update from 'react-update'
import get from 'lodash/get'
import { SelectTree } from 'bfd/Tree'
import { Select, Option } from 'bfd/Select'
import DataTable from 'bfd/DataTable'
import { Modal, Button } from 'antd'
import message from 'bfd/message'
import Auth from 'public/auth'
import './index.less'

export default React.createClass({
	getInitialState() {
		this.update = update.bind(this)
		return {
			//用户
      auth: (Auth.user ? Auth : window),

      //modal
      visible: false,

      //错误提醒
      tipsShow: false,
      tipsShow2: false,

      //监控空格编码
      isSpace: false,

      // 所有组织
      groupAll: (this.props.groupAll ? this.props.groupAll : []),

      // 所有权限
      allResource: (this.props.allResource ? this.props.allResource : []),

      // 新增岗位
      newPost: {
        groupId: '',
        chooseGroup: false,
        deptId: '',
        chooseDept: false,
        post: '',
        fillInPost: false,
        power: '',
        choosePower: false,
        // 所有部门
        deptAll: [],
        // 类型
        type: '',
        chooseType: false
      },
		}
	},

	// 增加岗位modal
  showModal() {
    this.setState({
      visible: true,
      tipsShow: false,
      tipsShow2: false,
    })
  },

  handleOk() {
    let newPost = this.state.newPost

    // 权限拼接
    let allPower = this.state.allResource
    let choosePower = ''
    let powerFn = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
          choosePower += arr[i].uri + ','
        }
        if (arr[i].children && arr[i].children.length) {
          powerFn(arr[i].children)
        }
      }
    }
    powerFn(allPower)

    this.setState({
      newPost: newPost
    })

    let orgId = this.state.newPost.chooseGroup
    let depId = this.state.newPost.chooseDept
    let postType = this.state.newPost.chooseType
    let postName = this.state.newPost.post
    let postfillInPost = this.state.newPost.fillInPost

    // 判断是否错误提示
    if ( !choosePower || !orgId || !depId || !postType || !postfillInPost || common.illegalChar(postName) || common.maxChar(postName)) {
      this.setState({
        tipsShow: true
      })
    } else {
      xhr({
        type: 'get',
        url: URL.MANAGE_POST_ADD 
              + '?name=' + this.state.newPost.post
              +'&type=' + this.state.newPost.type
              +'&deptId=' + this.state.newPost.deptId
              +'&groupId=' + this.state.newPost.groupId
              +'&uris=' + choosePower
              +'&createUser=' + this.state.auth.user.name
              +'&modifyUser=' + this.state.auth.user.name
        ,
        success: (result) => {
          if (result.flag) {
            this.setState({
              visible: false,
              tipsShow: false,
              tipsShow2: false
            })
            //初始化数据
            this.props.newPostCallback()
          } else {
            if (result.message === '岗位名称已存在') {
              this.setState({
                tipsShow: false,
                tipsShow2: true
              })
            } else {
              this.setState({
                tipsShow2: false
              })
              alert('新增岗位失败')
            }
          }
          
        }
      })
    }
  },

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  },

  //组织下拉
  newSelectGroup(groupId) {
    let newPost = this.state.newPost
    newPost.groupId = groupId

    //组织下拉，重置部门
    $('.new-post .new-post-dept .title').html('请选择')
    newPost.deptId = ''
    newPost.chooseDept = false

    if (groupId) {
      newPost.chooseGroup = true
      // 获取部门
      xhr({
        type: 'get',
        url: `${URL.MANAGE_POST_DEPTALL}?groupId=${groupId}`,
        success: (result) => {
          let newPost = this.state.newPost
          newPost.deptAll = result
          this.setState({
            newPost: newPost
          })
        }
      })
    } else {
      newPost.chooseGroup = false
    }
    this.setState({
      newPost: newPost
    })
  },

  //部门下拉
  newSelectDepat(deptId) {
    let newPost = this.state.newPost

    newPost.deptId = deptId
    if (deptId) {
      newPost.chooseDept = true
    } else {
      newPost.chooseDept = false
    }

    this.setState({
      newPost: newPost
    })
  },

  //岗位名称
  newPostName(ev) {
    let newPost = this.state.newPost
    let oldName = newPost.post
    newPost.post = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(newPost.post) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      newPost.post = common.replaceSpace(newPost.post)
    }
    newPost.fillInPost = true
    this.setState({
      newPost: newPost
    })
  },

  myKeyPress(ev) {
    if (ev.charCode == 32) {
      this.setState({
        isSpace: true,
      })
    } else {
      this.setState({
        isSpace: false,
      })
    }
  },

  //类型下拉
  newSelectType(type) {
    let newPost = this.state.newPost
    newPost.type = type
    if (type) {
      newPost.chooseType = true
    } else {
      newPost.chooseType = false
    }
    this.setState({
      newPost: newPost
    })
  }, 

  // 权限

  // 树结构
  updateChildren(item, path, checked) {
    if (!item || !item.children) return
    path = path = [...path, 'children']
    item.children.forEach((item, i) => {
      if (item.checked !== checked) {
        this.update('set', [...path, i, 'checked'], checked)  
      }
      this.updateChildren(item, [...path, i], checked)
    })
  },

  updateParent(data, path, checked) {
    if (path.length <= 1) return
    const parent = get(data, path.slice(1))
    if (checked) {
      checked = parent.children.filter(item => !item.checked).length === 0
    }
    data = this.update('set', [...path, 'checked'], checked)
    this.updateParent(data, path.slice(0, -2), checked)
  },

  handleSelect(data, item, path, checked) {
    // 所有子级节点是否选中
    this.updateChildren(item, ['allResource', ...path], checked)
    // 所有父级节点是否选中
    this.updateParent(data, ['allResource', ...path.slice(0, -2)], checked)
  },

  componentWillReceiveProps(nextProps) {
  	this.setState({
  		groupAll: nextProps.groupAll,
  		allResource: nextProps.allResource
  	})
  },

	render() {

    // 新增岗位组织下拉
    const newGroup = this.state.groupAll.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    //新增岗位部门下拉
    const newDept = this.state.newPost.deptAll.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

		return (
			<div>
				<Button className="pull-left new-origin" type="primary" onClick={this.showModal}>
          <i className="fa fa-plus"></i>
          <span>新增岗位</span>
        </Button>
        <Modal title="新增岗位" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          className="manage-modal new-post"
        >
          <div className="organize-edit">
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">组织名称：</span>
              </div>
              <div className="col-md-9 edit-origin-dropDown">
                <Select onChange={this.newSelectGroup}>
                  <Option>请选择</Option>
                  {newGroup}
                </Select>
              </div>
            </div>
            <div className="row eidt-inp-box new-post-dept">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">部门名称：</span>
              </div>
              <div className="col-md-9 edit-origin-dropDown">
                <Select onChange={this.newSelectDepat}>
                  <Option>请选择</Option>
                  {newDept}
                </Select>
              </div>
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">岗位名称：</span>
              </div>
              <input className="col-md-9 edit-inp" type="text" value={ this.state.newPost.post } onKeyPress={ this.myKeyPress } onKeyPress={ this.myKeyPress } onChange={ this.newPostName } />
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">类型：</span>
              </div>
              <Select onChange={this.newSelectType}>
                <Option>请选择</Option>
                <Option value="1">管理员</Option>
                <Option value="2">非管理员</Option>
              </Select>
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">权限分配：</span>
              </div>
              <div className="col-md-9 edit-jurisdiction">
                <SelectTree 
                  data={this.state.allResource} 
                  onChange={data => this.update('set', 'allResource', data)} 
                  onSelect={this.handleSelect} 
                />
              </div>
            </div>
            <div className={"edit-tips-box row " + (this.state.tipsShow ? 'active' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div className="col-md-9">存在未输入项或岗位名称长度大于15或岗位名称包含空格、特殊字符</div>
            </div>
            <div className={"edit-tips-box row " + (this.state.tipsShow2 ? 'active' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div className="col-md-9">岗位名称已存在</div>
            </div>
          </div>
        </Modal>
			</div>
		)
	}
})