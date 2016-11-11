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
import Theme from 'public/Theme'

export default React.createClass({
  getInitialState(){
    return {
      "param":{"id":auth.user.id,
          "pageCurrent":1,
          "pageSize":10,
        },
      "column":[{"title":"标题","key":"title"},
                {"title":"截止时间","key":"date"},
                ],
      "collections":[],
      "data":{"totalList":[],
            "totalPageNum":0
      },
      "articleInfo":"",
      "theme":{id:"","title":"",inDate:"",date:""},
      commentList: {
        totalList: [],
        totalPageNum: 0,
        currentPage: 0
      },
      "visible":false,
    }
  },
  handleRowClick(row){
  //  this.props.history.pushState({id:row.id},'/data/details');
   //  window.location.href = "/data/details?id="+row.id;

    this.setState({
      theme:row,
          visible: true,
          
        })
   //获取评论列表
 /*   xhr({
      type: 'get',
      url: `${URL.DOC_GET_COMMENT}?pageCurrent=1&pageSize=10&id=` + row.id,
      success: (result) => {
 //       console.log(result)
        this.setState({
          commentList: result,
          visible: true,
          theme:row
        })
      }
    })*/    
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
      // modal
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  },
  render() {
    return (
      <div className="collection-box">
        <RecentCollection history={this.props.history}></RecentCollection> 
        <div className="list-box my-help  all-border">
          <div className="header">
            <h3>我发布的点题</h3>
          </div>
          <Fetch url={URL.QUERY_PERSONAL_REQUEST+'?data='+JSON.stringify(this.state.param)} onSuccess={this.handleTableAjax}>
          </Fetch>
          <DataTable data={this.state.data} onPageChange={this.onPageChange} column={this.state.column}
            showPage="true" howRow={this.state.param.pageSize} onRowClick={this.handleRowClick} >
          </DataTable>
        </div>    
        <Theme visible={this.state.visible} theme={this.state.theme} commentList={this.state.commentList} onCancel={this.handleCancel} ></Theme>    
      </div>
    )
  }
})