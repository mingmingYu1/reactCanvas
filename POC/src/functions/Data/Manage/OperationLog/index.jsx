import React from 'react'
import xhr from 'public/xhr'
import URL from 'public/url'
import Tree from 'bfd/Tree'
import DataTable from 'bfd/DataTable'
import { Modal, Button } from 'antd'
import SearchBox from './SearchBox'
import './index.less'

export default React.createClass({
  getInitialState() {
    return { 
      //搜索
      searchValue: '',
      // 搜索类型
      searchType: '',

      //modal
      visible2: false,

      //表格
      tableData: {},
      column: [{
      title:'序号',
      key:'sequence'
      }, {
        title: '用户名称',
        key: 'userName',
        render: (text, item) => {
          return (
            <div>{text}</div>
          )
        }
      }, {
        title: '账号',
        key: 'loginName',
        render: (text, item) => {
          return (
            <div>{text}</div>
          )
        }
      }, {
        title: '操作类型',
        key: 'optionType'
      }, {
        title: '操作模块',
        key: 'optionModel'
      }, {
        title: '描述',
        key: 'describe'
      }]
    }
  },
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
     //TODO
     xhr({
      type: 'post',
      url: `${URL.MANAGE_OPERATE_LOG}?pageCurrent=${page}&pageSize=10&name=${this.state.searchValue}&field=${this.state.searchType}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
        this.judgeTips(result.totalPageNum)
      }
    })
  },
  handleRowClick(row) {
    // console.log('rowclick', row)
  },
  handleOrder(name, sort) {
    // console.log(name, sort)
  },

  searchBtnClick(str, type) {
    let searchOpetionType = type ? type : ''
    this.setState({
      searchValue: str,
      searchType: searchOpetionType,
    })
    xhr({
      type: 'post',
      url: `${URL.MANAGE_OPERATE_LOG}?pageCurrent=1&pageSize=10&name=${str}&field=${searchOpetionType}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  componentDidMount() {
    xhr({
      type: 'post',
      url: `${URL.MANAGE_OPERATE_LOG}?pageCurrent=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

	render() {
		return (
			<div className="origin-manage-box">
        <div className="clearfix origin-manage-head">
          <h3 className="origin-manage-tit pull-left">操作日志</h3>
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
      </div>
		)
	}
})