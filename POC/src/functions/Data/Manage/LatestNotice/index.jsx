import React from 'react'
import DataTable from 'bfd/DataTable'
import { Modal, Button } from 'antd'
import classNames from 'classnames'
import message from 'bfd/message'
import TextOverflow from 'bfd/TextOverflow'
import SiteEditor from './SiteEditor'
import NewNotice from './NewNotice'
import xhr from 'public/xhr'
import URL from 'public/url'
import './index.less'

export default React.createClass({
	getInitialState() {
		return {
      // modal
      visible: false,

      // tips
      tipsShow: false,

      // 表格
			tableData: {
        "totalList": [], 
        "currentPage": 0, 
        "totalPageNum": 0 
      },
      column: [{
      title:'序号',
      width: '60px',
      key:'sequence'
      }, {
        title: '公告内容',
        key: 'content',
        render: (text, item) => {
          let createMarkup = () => { 
            return {__html: text}
          }
          return (
              <div className="notice-con" dangerouslySetInnerHTML={createMarkup()}></div>
          )
        }
      }, {
        title: '公告时间',
        key: 'addTime',
        width: '170px',
        render: (text, item) => {
          let addTime = this.stampChange(text)
          return (
            <div>{addTime}</div>
          )
        }
      }, {
        title: '操作',
        key: 'operation',
        width: '170px',
        render: (item) => {
          return(
            <div className="table-operation">
              <Button onClick={this.showConfirm.bind(this, item)}>
                删除
              </Button>
            </div>
          )
        }
      }],

      //输入框
      textareaValue: ''
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

  showConfirm(item) {
    let self = this
    Modal.confirm({
      title: '您是否确认要删除该公告？',
      onOk() {
        xhr({
          type: 'get',
          url: `${URL.NOTICE_DELETE}?id=${item.id}`,
          success: (result) => {
            if (result.flag) {
              xhr({
                type: 'get',
                url: `${URL.NOTICE_LIST}?currentPage=1&pageSize=10`,
                success: (result) => {
                  self.setState({
                    tableData: result
                  })
                }
              })
            } else {
              alert('删除失败，请重新删除！')
            }
          }
        })
      },
      onCancel() {},
    });
  },


	/**
	 * 表格数据
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
     // 重置数据
    xhr({
      type: 'get',
      url: `${URL.NOTICE_LIST}?currentPage=${page}&pageSize=10`,
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

  newCallBack() {
    xhr({
      type: 'get',
      url: `${URL.NOTICE_LIST}?currentPage=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  componentDidMount() {
    xhr({
      type: 'get',
      url: `${URL.NOTICE_LIST}?currentPage=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

	render() {
		return (
			<div className="origin-manage-box latest-notice">
        <div className="clearfix origin-manage-head latest-notice-head">
          <h3 className="origin-manage-tit pull-left">最新公告</h3>
        </div>
        <NewNotice newCallBack={this.newCallBack}></NewNotice>
        <DataTable 
	        className="manage-table"
          data={this.state.tableData} 
          onPageChange={this.onPageChange} 
          showPage="true" 
          column={this.state.column} 
          howRow={10}
          onRowClick={this.handleRowClick}
          onOrder={this.handleOrder} 
	      /> 
      </div>
		)
	}
})