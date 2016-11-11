import './index.less'

import React from 'react'
import { Link } from 'react-router'
import RecentCollection from '../RecentCollection'
import TextOverflow from 'bfd/TextOverflow'
import DataTable from 'bfd/DataTable'
import { Row, Col } from 'bfd/Layout'
import xhr from 'public/xhr'
import Fetch from 'bfd/Fetch'
import URL from 'public/url'
import auth from 'public/auth'

export default React.createClass({
  getInitialState(){
    return {
      "param":{"id":auth.user.id,
          "pageCurrent":1,
          "pageSize":10,
        },
      "column":[{"title":"标题","key":"name"},
                {"title":"定价","key":"price"},
                {"title":"阅读量","key":"pviews"},
                {"title":"下载量","key":"downloads"},
                {"title":"收藏","key":"collections"},
                {"title":"上传时间","key":"date"}
                ],
      "data":{"totalList":[],
            "totalPageNum":0,
            "currentPage":0,
      }
    }
  },
  handleRowClick(row){
  //  this.props.history.pushState({id:row.id},'/data/details');
   //  window.location.href = "/data/details?id="+row.id;
    window.open("/data/details?id="+row.id)
      /*var form = document.createElement('form');
      form.style.display = "none";
      form.action = "/data/details";
      form.method = "post";
      form.innerHTML = '<input type="hidden" name="id" value="'+row.id+'" />'
      document.body.appendChild(form)
      form.submit()*/
  },
  handleTableAjax(res){
    let data = {
              "totalList":res.totalList,
              "totalPageNum":parseInt(res.totalPageNum),
              "currentPage":parseInt(res.currentPage),
    }
    this.setState({data:data})
  },
  onPageChange(currentPage){   
    var param = {
          "id":this.state.param.id,
          "pageCurrent":currentPage,
          "pageSize":this.state.param.pageSize,
    }
   this.setState({param:param})
  },
  render() {
    return (
      <div className="collection-box">
        <RecentCollection history={this.props.history}></RecentCollection>
        <div className="list-box  all-border">
          <div className="header">
            <h3>我的贡献</h3>
          </div>
          <Fetch url={URL.QUERY_PERSONAL_CONTRIBUTION+'?data='+JSON.stringify(this.state.param)} onSuccess={this.handleTableAjax}>
          </Fetch>
          <DataTable data={this.state.data} onPageChange={this.onPageChange} column={this.state.column}
            showPage="true" howRow={this.state.param.pageSize} onRowClick={this.handleRowClick} >
          </DataTable>
        </div>    
      </div>
    )
  }
})