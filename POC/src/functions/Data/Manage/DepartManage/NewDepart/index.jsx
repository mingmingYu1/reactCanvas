import React from 'react'
import xhr from 'public/xhr'
import URL from 'public/url'
import common from 'public/common'
import Tree from 'bfd/Tree'
import { Select, Option } from 'bfd/Select'
import DataTable from 'bfd/DataTable'
import Auth from 'public/auth'
import { Modal, Button } from 'antd'
import './index.less'

export default React.createClass({
	getInitialState() {
		return {
			//modal
      visible: false,

      //错误展示
      tipsShow: false,
      tipsShow2: false,

      //监控空格编码
      isSpace: false,

      newDepartName: '',
      newOrganizeNameId: '',

      auth: Auth
		}
	},

	showModal() {
    this.setState({
      visible: true,
      newDepartName: ''
    })
  },

  handleOk() {
    // 关闭错误提示
    this.setState({
      tipsShow: false,
      tipsShow2: false,
    })
    let orgId = this.state.newOrganizeNameId
    let depName = this.state.newDepartName 

    if (!orgId || !depName || common.illegalChar(depName) || common.maxChar(depName) ) {
      this.setState({
        tipsShow: true
      })
    } else {
      xhr({
        type: 'get',
        url: `${URL.MANAGE_DEPT_ADD}?groupId=${this.state.newOrganizeNameId}&name=${this.state.newDepartName}&createUser=${this.state.auth.user.name}`,
        success: (result) => {
          if (result.flag) {
            // 交互成功取消提示
            this.setState({
              tipsShow: false,
              tipsShow2: false,
              visible: false
            })

            //添加成功 重新获取数据
            this.props.newGroupCallback()
          } else {
            // flag返回false：部门名重复
            this.setState({
              tipsShow2: true
            })
          }
        }
      })
    } 
  },

  handleCancel(e) {
    this.setState({
      visible: false,
      tipsShow: false,
      tipsShow2: false,
    });
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

  inpChange(ev) {
    let oldName = this.state.newDepartName
    let currentName = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(currentName) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      currentName = common.replaceSpace(currentName)
    }
    this.setState({
      newDepartName: currentName
    })
  },

  organizeDropDown(data) {
    this.setState({
      newOrganizeNameId: data
    })
  },

	render() {
		let groupDrop = this.props.groupData.map((item, i) => {
      return (
        <Option key={ i } value={item.id}>{item.name}</Option>
      )
    })
		return (
			<div>
				<Button className="pull-left new-origin" type="primary" onClick={this.showModal}>
          <i className="fa fa-plus"></i>
          <span>新增部门</span>
        </Button>
        <Modal title="新增部门" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          className="manage-modal"
        >
          <div className="organize-edit">
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">组织名称：</span>
              </div>
              <div className="col-md-9 edit-origin-dropDown">
                <Select onChange={this.organizeDropDown}>
                  <Option>请选择</Option>
                  {groupDrop}
                </Select>
              </div>
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">部门名称：</span>
              </div>
              <input className="col-md-9 edit-inp" type="text" value={ this.state.newDepartName } onKeyPress={ this.myKeyPress } onChange={ this.inpChange } />
            </div>
            <div className={"edit-tips-box " + (this.state.tipsShow ? 'active' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div>存在未输入项或部门名称长度大于15或部门名称包含空格、特殊字符</div>
            </div>
            <div className={"edit-tips-box " + (this.state.tipsShow2 ? 'active2' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div>部门名称已存在</div>
            </div>
          </div>
        </Modal>
			</div>
		)
	}
})