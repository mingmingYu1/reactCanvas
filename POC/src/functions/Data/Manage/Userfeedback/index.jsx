import React from 'react'
import DataTable from 'bfd/DataTable'
import xhr from 'public/xhr'
import URL from 'public/url'
import TextOverflow from 'bfd/TextOverflow'
import './index.less'

export default React.createClass({
  getInitialState() {
    return {
      // 表格数据
      tableData: {},
      column: [{
        title:'序号',
        width: '110px',
        key:'sequence'
      }, {
        title:'建议',
        key:'feedbackContent',
        render: (text, item) => {
          return (
            <TextOverflow>
              <div style={{'minWidth': '200px', 'maxWidth': '450px'}}>{text}</div>
            </TextOverflow>
          )
        }
      }, {
        title: '反馈人',
        key: 'userName',
        width: "150px",
        render: (text, item) => {
          return (
            <div>{item.userInfo.name}</div>
          )
        }
      },{
        title: '反馈时间',
        key: 'time',
        width: '200px',
        // render: (text, item) => {
        //   let newTime = this.stampChange(text)
        //   return(
        //     <div>{newTime}</div>
        //   )
        // }
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
      url: `${URL.MANAGE_USERFEEDBACK}?pageSize=10&pageCurrent=${page}`,
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

    // 表格数据
    xhr({
      type: 'post',
      url: `${URL.MANAGE_USERFEEDBACK}?pageCurrent=1&pageSize=10`,
      success: (result) => {
        this.setState({
          tableData: result 
        })
      }
    })
  },

  render() { 

    return (
      <div className="userfeedback-box">
        <h3 className="userfeedback-tit">反馈建议</h3>
        <div className="userfeedback-table">
          <DataTable 
            data={this.state.tableData} 
            onPageChange={this.onPageChange} 
            showPage="true" 
            column={this.state.column} 
            howRow={10}
            onRowClick={this.handleRowClick}
            onOrder={this.handleOrder} >
          </DataTable>
        </div>
      </div>
    )
  }
})

