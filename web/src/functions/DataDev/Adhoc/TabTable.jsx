import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import './index.less'

const  TabTable = React.createClass({
  getInitialState: function () {
    return {url: "../data/table.json",
      column: [{
        title:'序号',
        key:'sequence'
      }, {
        title: '姓名',
        order: true,
        width: '100px',
        render: (text, item) => {
          return <a href="javascript:void(0);" onClick={this.handleClick.bind(this, item)}>{text}</a>
        },
        key: 'name'
      }, {
        title: '年龄',
        key: 'age',
        order: true
      }, {
        title: '体重',
        key: 'weight',
        order: true
      }, {
        title: '国家/地区',
        key: 'country',
        width: '15%'
      }, {
        title: '学校',
        key: 'school'
      }, {
        title: '生日',
        key: 'birthday',
        order: true
      }, {
        title: '操作',
        /**
         * @param item  当前数据对象
         * @param component 当前
         * @returns {XML}  返回dom对象
         */
        render:(item, component)=> {
          return <a href = "javascript:void(0);" onClick = {this.handleClick.bind(this, item)}>编辑</a>
        },
        key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
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
    console.log(item)
  },
  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
      onPageChange(page) {
    //TODO
  },
  handleCheckboxSelect(selectedRows) {
    console.log('rows:', selectedRows)
  },
  handleRowClick(row) {
    console.log('rowclick', row)
  },
  handleOrder(name, sort) {
    console.log(name, sort)
  },
  render() {
    return (
        <DataTable
            url={this.state.url}
            onPageChange={this.onPageChange}
            showPage="true"
            column={this.state.column}
            howRow={8}
            onRowClick={this.handleRowClick}
            onOrder={this.handleOrder}
            onCheckboxSelect={this.handleCheckboxSelect} >
        </DataTable>
    )
  }
})

export default TabTable