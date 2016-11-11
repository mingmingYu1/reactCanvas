import React from 'react'
import xhr from 'public/xhr'
import URL from 'public/url'
import common from 'public/common'
import Tree from 'bfd/Tree'
import { Select, Option } from 'bfd/Select'
import DataTable from 'bfd/DataTable'
import Auth from 'public/auth'
import { Modal, Button } from 'antd'
import NewDepart from './NewDepart'
import SearchBox from './SearchBox'
import './index.less'

export default React.createClass({
  getInitialState() {
    return { 

      //用户
      auth: Auth,

      // 模糊搜索
      searchValue: '',
      tipsShow3: false,
      tipsShow4: false,
      visible2: false,
      organizeAll: [],
      changeDepartData: {
        oldData: {},
        createUser: '',
        group: {},
        groupId: '',
        id: '',
        name: ''
      },
      newOrganizeName2: '',
      newDepartName2: '',
      tableData: {},
      column: [{
      title:'序号',
      width: '60px',
      key:'sequence'
      }, {
        title: '组织名称',
        key: 'groupName',
        render: (text, item) => {
          return (
            <div>{(item.group ? item.group.name : '')}</div>
          )
        }
      }, {
        title: '部门名称',
        key: 'name'
      }, {
        title: '创建时间',
        key: 'createTime',
        width: '170px',
        render: (text, item) => {
          let newTime = this.stampChange(text)
          return (
            <div>{newTime}</div>
          )
        }
      }, {
        title: '操作',
        width: '170px',
        /**
         * @param item  当前数据对象
         * @param component 当前
         * @returns {XML}  返回dom对象
         */
        // render:(item, component)=> {
        //   return <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>编辑</a>
        // },
        render: (item) => {
          return (
            <div className="table-operation">
              <Button type="primary" onClick={this.showModal2.bind(this, item)}>修改</Button>
              <Button onClick={this.showConfirm.bind(this, item.id)}>
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

  searchBtnClick(str, type) {
    let searchBoxType = (type ? type : '')

    this.setState({
      searchValue: str,
      searchType: searchBoxType
    })

    // 表格数据
    xhr({
      type: 'get',
      url: `${URL.MANAGE_DEPT_QUERY}?currentPage=1&pageSize=10&name=${str}&field=${searchBoxType}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  // 删除部门
  showConfirm(id) {
    let self = this
    Modal.confirm({
      title: '您是否确认要删除该部门',
      onOk() {
        xhr({
          type: 'get',
          url: `${URL.MANAGE_DEPT_DELETE}?id=${id}`,
          success: (result) => {
            if (result.flag) {
              xhr({
                type: 'get',
                url: `${URL.MANAGE_DEPT_QUERY}?currentPage=1&pageSize=10`,
                success: (result) => {
                  self.setState({
                    tableData: result
                  })
                }
              })
            } else {
              if (result.message === '部门正在使用中，不能删除') {
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

  //修改部门
  showModal2(item) {
    this.setState({
      visible2: true,
      changeDepartData: {
        oldData: item,
        createUser: item.createUser,
        group: item.group,
        groupId: item.groupId,
        id: item.id,
        name: item.name
      }
    })
  },

  handleOk2() {
    // 关闭错误提示
    this.setState({
      tipsShow3: false,
      tipsShow4: false,
    })
    let orgId = this.state.changeDepartData.groupId
    let depName = this.state.changeDepartData.name

    if (!orgId || !depName || common.illegalChar(depName) || common.maxChar(depName) ) {
      // 输入为空错误提示
      this.setState({
        tipsShow3: true
      })
    } else {
      xhr({
        type: 'get',
        url: `${URL.MANAGE_DEPT_UPDATE}?id=${this.state.changeDepartData.id}&groupId=${this.state.changeDepartData.groupId}&name=${this.state.changeDepartData.name}`,
        success: (result) => {
          if (result.flag) {
            this.setState({
              visible2: false,
            })

            // 交互成功初始化数据
            xhr({
              type: 'get',
              url: `${URL.MANAGE_DEPT_QUERY}?currentPage=1&pageSize=10`,
              success: (result) => {
                this.setState({
                  tableData: result
                })
              }
            })
          } else {
            // flag返回false：部门名重复错误提示
            this.setState({
              tipsShow4: true
            })
          }
        }
      })
    }
    
  },

  handleCancel2(e) {
    this.setState({
      visible2: false,
    });
  },

  inpChange2(ev) {
    let inpData = this.state.changeDepartData
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
      changeDepartData: inpData
    })
  },

  organizeDropDown2(dataGroupId) {
    let departData = this.state.changeDepartData
    departData.groupId = dataGroupId
    this.setState({
      changeDepartData: departData
    })
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
      url: `${URL.MANAGE_DEPT_QUERY}?currentPage=${page}&pageSize=10&name=${this.state.searchValue}&field=${this.state.searchType}`,
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

  //新增部门回调函数
  newGroupCallback() {
    //添加成功 重新获取数据
    xhr({
      type: 'get',
      url: `${URL.MANAGE_DEPT_QUERY}?currentPage=1&pageSize=10`,
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
      url: `${URL.MANAGE_DEPT_QUERY}?currentPage=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })

    // 组织下拉
    xhr({
      type: 'get',
      url: `${URL.MANAGE_DEPT_QUERYALL}`,
      success: (result) => {
        this.setState({
          organizeAll: result
        })
      }
    })
  },

	render() {
    let groupDrop = this.state.organizeAll.map((item, i) => {
      return (
        <Option key={ i } value={item.id}>{item.name}</Option>
      )
    })
		return (
			<div className="origin-manage-box">
        <h3 className="orgin-manage-tit">部门管理</h3>
        <div className="clearfix origin-manage-head">
          <NewDepart newGroupCallback={this.newGroupCallback} groupData={this.state.organizeAll}></NewDepart>
          <SearchBox callBackFn={this.searchBtnClick}></SearchBox>
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
        
        <Modal title="修改部门" visible={this.state.visible2}
          onOk={this.handleOk2} onCancel={this.handleCancel2}
          className="manage-modal"
        >
          <div className="organize-edit">
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">组织名称：</span>
              </div>
              <div className="col-md-9 edit-origin-dropDown">
                <Select onChange={this.organizeDropDown2}>
                  <Option style={{ display: 'none' }}>{this.state.changeDepartData.group ? this.state.changeDepartData.group.name : '请选择'}</Option>
                  {groupDrop}
                </Select>
              </div>
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">部门名称：</span>
              </div>
              <input className="col-md-9 edit-inp" type="text" value={ this.state.changeDepartData.name } onKeyPress={ this.myKeyPress } onChange={ this.inpChange2 } />
            </div>
            <div className={"edit-tips-box " + (this.state.tipsShow3 ? 'active' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div>存在未输入项或部门名称长度大于15或部门名称包含空格、特殊字符</div>
            </div>
            <div className={"edit-tips-box " + (this.state.tipsShow4 ? 'active2' : '') }>
              <p className="col-md-3 edit-tit"></p>
              <div>部门名称已存在</div>
            </div>
          </div>
        </Modal>
      </div>
		)
	}
})