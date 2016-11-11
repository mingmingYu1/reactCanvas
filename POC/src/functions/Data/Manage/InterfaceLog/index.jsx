import React from 'react'
import xhr from 'bfd/xhr'
import Tree from 'bfd/Tree'
import DataTable from 'bfd/DataTable'
import { Modal, Button } from 'antd'
import './index.less'

export default React.createClass({
  getInitialState() {
    return { 
      visible2: false,
      newOrganizeName: '',
      newOrganizeName2: '',
      tableData: {
        "totalList": [], 
        "currentPage": 1, 
        "totalPageNum": 0 
      },
      column: [{
      title:'序号',
      key:'sequence'
      }, {
        title: '接口名',
        key: 'name'
      }, {
        title: '调用方法',
        key: 'method'
      }, {
        title: '调用时间',
        key: 'time'
      }, {
        title: '状态',
        key: 'status'
      }, {
        title: '错误描述',
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
  },
  handleRowClick(row) {
    // console.log('rowclick', row)
  },
  handleOrder(name, sort) {
    // console.log(name, sort)
  },

  componentDidMount() {
    
  },

	render() {

		return (
			<div className="origin-manage-box">
        <div className="clearfix origin-manage-head">
          <h3 className="origin-manage-tit pull-left">接口日志</h3>
          <div className="pull-right clearfix search-box">
            <p className="search-con pull-left">
              <i className="fa fa-search"></i>
              <input type="text" placeholder="请输入接口名进行搜索" />
            </p>
            <input className="pull-right search-btn" type="button" value="查询" />
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
      </div>
		)
	}
})