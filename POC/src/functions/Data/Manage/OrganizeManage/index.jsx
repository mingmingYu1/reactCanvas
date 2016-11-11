import React from 'react'
import xhr from 'public/xhr'
import URL from 'public/url'
import common from 'public/common'
import Tree from 'bfd/Tree'
import DataTable from 'bfd/DataTable'
import { Modal, Button } from 'antd'
import message from 'bfd/message'
import Auth from 'public/auth'
import './index.less'

export default React.createClass({
  getInitialState() {
    return { 

      auth: Auth,

      //新增错误提示
      tipsShow: false,
      tipsShow2: false,
      tipsShow3: false,
      tipsShow4: false,

      //监控空格编码
      isSpace: false,

      //模糊搜索
      searchValue: '',
      visible: false,
      visible2: false,
      newOrganizeName: {
        "createUser": "",
        "name": ""
      },
      changeOrganizeName: {
        oldData: {},
        name: '',
        id: ''
      },
      tableData: {},
      column: [{
      title:'序号',
      key:'sequence',
      width: '60px'
      }, {
        title: '创建者',
        key: 'createUser',
        width: '150px'
      }, {
        title: '组织名称',
        key: 'name'
      }, {
        title: '创建时间',
        key: 'createTime',
        width: '170px',
        render: (text, item) => {
          let newTiem = this.stampChange(text)
          return (
            <div>{newTiem}</div>
          )
        }
      }, {
        title: '操作',
        width: '170px',
        render: (item, component) => {
          return (
            <div className="table-operation">
              <Button type="primary" onClick={this.showModal2.bind(this, item)}>修改</Button>
              <Button onClick={this.showConfirm.bind(this, item)}>
                删除
              </Button>
            </div>
          )
        },
        key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }]
    }
  },

  //时间戳转时间
  stampChange(time) {
    let date = new Date(time);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds(); 
    return (Y+M+D+h+m+s)
  },

  // 模糊搜索
  searchInpChange(ev) {
    let oldName = this.state.searchValue
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
      searchValue: currentName
    })
  },

  searchBtnClick() {
    xhr({
      type: 'get',
      url: `${URL.MANAGE_GROUP_QUERY}?currentPage=1&pageSize=10&name=${this.state.searchValue}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  showConfirm(item) {
    let self = this

    Modal.confirm({
      title: '您是否确认要删除该组织',
      onOk() {
        xhr({
          type: 'get',
          url: `${URL.MANAGE_GROUP_DELETE}?id=${item.id}`, 
          success: (result) => {
            if (result.flag) {

              // 删除成功之后重新获取一下数据
              xhr({
                type: 'get',
                url: `${URL.MANAGE_GROUP_QUERY}?currentPage=1&pageSize=10`,
                success: (result) => {
                  self.setState({
                    tableData: result
                  })
                }
              })
            } else {
              if (result.message === '组织正在使用中，不能删除') {
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

  showModal(organizeName) {
    let inpData = {
      "createUser": this.state.auth.user.name,
      "name": ''
    }
    this.setState({
      visible: true,
      tipsShow: false,
      tipsShow2: false,
      newOrganizeName: inpData
    })
  },

  showModal2(item) {
    this.setState({
      visible2: true,
      changeOrganizeName: {
        oldData: item,
        name: item.name,
        id: item.id
      },
      tipsShow3: false,
      tipsShow4: false,
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

  inpChange(ev) {
    let inpData = this.state.newOrganizeName
    let oldName = inpData.name
    inpData.name = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(inpData.name) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      inpData.name = common.replaceSpace(inpData.name)
    }
    this.setState({
      newOrganizeName: inpData
    })
  },

  inpChange2(ev) {
    let inpData = this.state.changeOrganizeName
    let oldName = inpData.name
    inpData.name = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(inpData.name) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      inpData.name = common.replaceSpace(inpData.name)
    }
    this.setState({
      changeOrganizeName: inpData
    })
  },

  handleOk() {
    let myStr = `${this.state.newOrganizeName.name}`
    if (!myStr || common.illegalChar(myStr) || common.maxChar(myStr)) {
      this.setState({
        tipsShow2: true
      })
    } else {
      this.setState({
        tipsShow2: false
      })
      xhr({
        type: 'get',
        url: `${URL.MANAGE_GROUP_ADD}?name=${this.state.newOrganizeName.name}&createUser=${this.state.newOrganizeName.createUser}`,
        contentType: "charset=utf-8",
        success: (result) => {
          if (result.flag) {
            this.setState({
              visible: false,
            })

            // 增加成功之后重新获取一下数据
            xhr({
              type: 'get',
              url: `${URL.MANAGE_GROUP_QUERY}?currentPage=1&pageSize=10`,
              success: (result) => {
                this.setState({
                  tableData: result,
                  tipsShow: false
                })
              }
            })
          } else {
            if (result.message === '组织名称已存在') {
              this.setState({
                tipsShow: true
              })
            } else {
              alert('新增组织失败，请重新操作')
            }
          } 
        }
      })
    }
  },

  handleOk2() {
    let myStr = `${this.state.changeOrganizeName.name}`
    if (!myStr || common.illegalChar(myStr) || common.maxChar(myStr)) {
      this.setState({
        tipsShow4: true
      })
    } else {
      this.setState({
        tipsShow4: false
      })
      xhr({
        type: 'get',
        url: `${URL.MANAGE_GROUP_UPDATE}?name=${this.state.changeOrganizeName.name}&id=${this.state.changeOrganizeName.id}`,
        success: (result) => {
          if (result.flag) {
            // 修改成功之后重新获取一下数据
            xhr({
              type: 'get',
              url: `${URL.MANAGE_GROUP_QUERY}?currentPage=1&pageSize=10`,
              success: (result) => {
                this.setState({
                  tableData: result,
                  tipsShow3: false,
                  visible2: false,
                })
              }
            })
          } else {
            if (result.message === '组织名称已存在') {
              this.setState({
                tipsShow3: true
              })
            } else {
              alert('修改组织失败，请重新操作')
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

  handleCancel2(e) {
    // 点击取消按钮有bug
    this.setState({
      visible2: false,
    });
  },

  /**
   * 列自定义点击事件
   * @param item 行数据
   */
  handleClick(item, event) {
    event = event ? event : window.event
    event.stopPropagation()
  },

  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
    xhr({
      type: 'get',
      url: `${URL.MANAGE_GROUP_QUERY}?currentPage=${page}&pageSize=10&name=${this.state.searchValue}`,
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

  componentDidMount() {
    xhr({
      type: 'get',
      url: `${URL.MANAGE_GROUP_QUERY}?currentPage=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

	render() {
		return (
			<div className="origin-manage-box" id="originManageBox">
        <h3 className="orgin-manage-tit">组织管理</h3>
        <div className="clearfix origin-manage-head">
          <Button className="pull-left new-origin" type="primary" onClick={this.showModal.bind(this, this.state.newOrganizeName.name)}>
            <i className="fa fa-plus"></i>
            <span>新增组织</span>
          </Button>
          <div className="pull-right clearfix search-box">
            <p className="search-con pull-left">
              <i className="fa fa-search"></i>
              <input type="text" value={this.state.searchValue} onKeyPress={ this.myKeyPress } onChange={this.searchInpChange} placeholder="请输入组织名称进行搜索" />
            </p>
            <input onClick={this.searchBtnClick} className="pull-right search-btn" type="button" value="搜索" />
          </div>
        </div>
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
        <Modal title="新增组织" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          className="manage-modal"
        >
          <div className="organize-edit">
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">组织名称：</span>
              </div>
              <input className="col-md-9 edit-inp" type="text" value={ this.state.newOrganizeName.name } onKeyPress={ this.myKeyPress } onChange={ this.inpChange } />
            </div>
          </div>
          <div className={"row edit-tips-box " + (this.state.tipsShow ? 'active' : '') }>
            <p className="col-md-3 edit-tit"></p>
            <div className="col-md-9">部门名称已存在</div>
          </div>
          <div className={"row edit-tips-box " + (this.state.tipsShow2 ? 'active' : '') }>
            <p className="col-md-3 edit-tit"></p>
            <div className="col-md-9">组织名称不能为空，且长度不可超过15及组织名称不能包含空格和特殊字符</div>
          </div>
        </Modal>
        <Modal title="修改组织" visible={this.state.visible2}
          onOk={this.handleOk2} onCancel={this.handleCancel2}
          className="manage-modal"
        >
          <div className="organize-edit">
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">组织名称：</span>
              </div>
              <input className="col-md-9 edit-inp" type="text" value={ this.state.changeOrganizeName.name } onKeyPress={ this.myKeyPress } onChange={ this.inpChange2 } />
            </div>
            <div className={"row edit-tips-box " + (this.state.tipsShow3 ? 'active2' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div className="col-md-9">部门名称已存在</div>
            </div>
            <div className={"row edit-tips-box " + (this.state.tipsShow4 ? 'active2' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div className="col-md-9">存在未输入项或组织名称长度大于15或组织名称包含空格、特殊字符</div>
            </div>
          </div>
        </Modal>
      </div>
		)
	}
})