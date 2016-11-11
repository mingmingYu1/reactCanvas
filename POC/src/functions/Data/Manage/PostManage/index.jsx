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
import NewPost from './NewPost'
import SearchBox from './SearchBox'
import './index.less'

export default React.createClass({
  getInitialState() {
    this.update = update.bind(this)
    return {

      //用户
      auth: Auth,

      //搜索框
      searchValue: '',
      searchType: '',

      //modal
      visible: false,
      visible2: false,

      //错误提醒
      tipsShow: false,
      tipsShow2: false,

      // 所有组织
      groupAll: [],
      
      //所有权限
      allResource: [],

      // 修改岗位
      changePost: {
        id: '',
        group: {},
        groupId: '',
        dept: {},
        deptId: '',
        type: '',
        jurisdiction: '',
        deptAll: [],
        name: '',
        oldData: {}
      },
      changePower: [],

      // 表格数据
      tableData: {},
      column: [{
      title:'序号',
      key:'sequence'
      }, {
        title: '组织名称',
        key: 'group',
        render: (text, item) => {
          return (
            <div>{(item.group && item.group.name) ? item.group.name : ''}</div>
          )
        }
      }, {
        title: '部门名称',
        key: 'dept',
        render: (text, item) => {
          return (
            <div>{(item.dept && item.dept.name) ? item.dept.name : ''}</div>
          )
        }
      }, {
        title: '岗位名称',
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
        title: '类型',
        key: 'type',
        width: '100px',
        render: (item) => {
          return (
            <div>{ item === 1 ? '管理员' : '非管理员' }</div>
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
              <Button onClick={this.showConfirm.bind(this, item)}>
                删除
              </Button>
            </div>
          )
        },
        key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }],
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
    // 输出结果：2014-04-23 18:55:49
    return (Y+M+D+h+m+s)
  },

  searchBtnClick(str, type) {
    let searchBoxType = type;

    this.setState({
      searchValue: str,
      searchType: searchBoxType
    })

    // 初始化数据
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_QUERY}?&currentPage=1&pageSize=10&name=${str}&field=${searchBoxType}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  // 删除modal
  showConfirm(item) {
    let self = this
    Modal.confirm({
      title: '您是否确认要删除改岗位？',
      onOk() {
        xhr({
          type: 'get',
          url: `${URL.MANAGE_POST_DELETE}?id=${item.id}`,
          success: (result) => {
            if (result.flag) {
              //刷新表格
              xhr({
                type: 'get',
                url: `${URL.MANAGE_POST_QUERY}?&currentPage=1&pageSize=10`,
                success: (result) => {
                  self.setState({
                    tableData: result
                  })
                }
              })
            } else {
              if (result.message === '岗位正在使用中，不能删除') {
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

  // 修改岗位modal
  showModal2(item) {
    let changePost = this.state.changePost
    changePost.oldData = JSON.parse(JSON.stringify(item))

    for (let name in item) {
      changePost[name] = JSON.parse(JSON.stringify(item[name]))
    }
    this.setState({
      visible2: true,
      tipsShow: false,
      tipsShow2: false
    })

    // 部门列表
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_DEPTALL}?groupId=${item.groupId}`,
      success: (result) => {
        changePost.deptAll = result
        this.setState({
          changePost: changePost
        })
      }
    })

    //获取岗位权限
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_RESOURCE_QUERY}?roleId=${item.id}`,
      success: (result) => {
        this.setState({
          changePower: result
        })
      }
    })
  },

  handleOk2() {
    //权限拼接
    let allPower = this.state.changePower
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

    let orgId = this.state.changePost.groupId
    let depId = this.state.changePost.deptId
    let postId = this.state.changePost.id
    let postType = this.state.changePost.type
    let postName = this.state.changePost.name

    // 修改岗位
    if ( !choosePower || !orgId || !depId || !postId|| !postType || !postName || common.illegalChar(postName) || common.maxChar(postName)) {
      this.setState({
        tipsShow: true,
        tipsShow2: false,
      })
    } else {
      xhr({
        type: 'get',
        url: URL.MANAGE_POST_UPDATE 
              +'?id=' + this.state.changePost.id
              +'&name=' + this.state.changePost.name
              +'&type=' +　this.state.changePost.type
              +'&deptId=' + this.state.changePost.deptId
              +'&groupId=' + this.state.changePost.groupId
              +'&modifyUser=' + this.state.auth.user.name
              +'&uris=' + choosePower
        ,
        success: (result) => {
          if (result.flag) {
            //初始化数据
            xhr({
              type: 'get',
              url: `${URL.MANAGE_POST_QUERY}?&currentPage=1&pageSize=10`,
              success: (result) => {
                this.setState({
                  tableData: result,
                  visible2: false
                })
              }
            })
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

  handleCancel2(e) {
    this.setState({
      visible2: false,
    });
  },

  // 组织下拉
  changeSelectGroup(groupId) {
    let changePost = this.state.changePost
    changePost.groupId = groupId

    //部门重置
    $('.post-change-dept .title').html('请选择')
    changePost.dept = {}
    changePost.deptId = ''

    // 组织改变重新获取 部门列表
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_DEPTALL}?groupId=${groupId}`,
      success: (result) => {
        changePost.deptAll = result
        this.setState({
          changePost: changePost
        })
      }
    })
  },

  // 部门下拉
  changeSelectDept(deptId) {
    let changePost = this.state.changePost
    changePost.deptId = deptId

    this.setState({
      changePost: changePost
    })
  },

  // 岗位名输入
  changePost(ev) {
    let changePost = this.state.changePost
    let oldName = changePost.name
    changePost.name = ev.target.value
    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(changePost.name) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      changePost.name = common.replaceSpace(changePost.name)
    }
    this.setState({
      changePost: changePost
    })
  },

  //类型选择
  changeType(type) {
    let changePost = this.state.changePost
    changePost.type = type
    this.setState({
      changePost: changePost
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

  handleSelect2(data, item, path, checked) {
    // 所有子级节点是否选中
    this.updateChildren(item, ['changePower', ...path], checked)
    // 所有父级节点是否选中
    this.updateParent(data, ['changePower', ...path.slice(0, -2)], checked)
  },

  // 表数据
  /**
   * 列自定义点击事件
   * @param item 行数据
   */
  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
  },

  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
     // 表格数据
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_QUERY}?&currentPage=${page}&pageSize=10&name=${this.state.searchValue}&field=${this.state.searchType}`,
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

  newPostCallback() {
    // 表格数据
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_QUERY}?&currentPage=1&pageSize=10`,
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
      url: `${URL.MANAGE_POST_QUERY}?&currentPage=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })

    // 组织列表
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_GROUPALL}`,
      success: (result) => {
        this.setState({
          groupAll: result
        })
      }
    })

    // 所有权限
    xhr({
      type: 'get',
      url: `${URL.MANAGE_POST_RESOURCE_QUERY}`,
      success: (result) => {
        this.setState({
          allResource: result
        })
      }
    })
  },

	render() {

    // 修改岗位组织下拉
    const changeGroup = this.state.groupAll.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    //修改岗位部门下拉
    const changeDept = this.state.changePost.deptAll.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

		return (
			<div className="origin-manage-box">
        <h3 className="orgin-manage-tit">岗位管理</h3>
        <div className="clearfix origin-manage-head">
          <NewPost newPostCallback={this.newPostCallback} groupAll={this.state.groupAll} allResource={this.state.allResource}></NewPost>
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
        <Modal title="修改岗位" visible={this.state.visible2}
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
                <Select onChange={this.changeSelectGroup}>
                  <Option style={{display: 'none'}}>{ (this.state.changePost.group ? this.state.changePost.group.name : '请选择') }</Option>
                  {changeGroup}
                </Select>
              </div>
            </div>
            <div className="row eidt-inp-box post-change-dept">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">部门名称：</span>
              </div>
              <div className="col-md-9 edit-origin-dropDown">
                <Select onChange={this.changeSelectDept}>
                  <Option style={{display: 'none'}}>{ (this.state.changePost.dept && this.state.changePost.dept.name) ? this.state.changePost.dept.name : "请选择" }</Option>
                  {changeDept}
                </Select>
              </div>
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">岗位名称：</span>
              </div>
              <input className="col-md-9 edit-inp" type="text" value={ this.state.changePost.name } onKeyPress={ this.myKeyPress } onChange={ this.changePost } />
            </div>
            <div className="row eidt-inp-box">
              <div className="col-md-3 clearfix">
                <i className="pull-left con-star">*</i>
                <span className="pull-left con-tit">类型：</span>
              </div>
              <Select onChange={this.changeType}>
                <Option style={{display: 'none'}}>{this.state.changePost.type ?
                  (this.state.changePost.type === 1 ? '管理员' : '非管理员'):
                  '请选择'
                }</Option>
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
                  data={this.state.changePower} 
                  onChange={data => this.update('set', 'changePower', data)} 
                  onSelect={this.handleSelect2} 
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