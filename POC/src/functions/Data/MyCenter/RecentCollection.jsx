import React from 'react'
import './index.less'
import DocumentCount from 'public/DocumentCount'
import CardList from 'public/CardList'
import { Row, Col } from 'bfd/Layout'
import xhr from 'bfd/xhr'
import Fetch from 'bfd/Fetch'
import URL from 'public/url'
import auth from 'public/auth'


const RecentCollection = React.createClass({
   getInitialState(){
    return {
      "param":{"id":auth.user.id,
          "pageCurrent":1,
          "pageSize":10,
        },
      "collections":[],
      "total":0,
    }
  },
  componentDidMount(){
     xhr({
      type:'GET',
      url:URL.QUERY_PERSONAL_CONTRIBUTION+"?data="+JSON.stringify(this.state.param),
      success:(res) => {
          this.setState({total:res.totalPageNum})  
      }
    })
  },
  render(){
    return (
      <Row gutter>
          <Col col="md-3" className="">
            <div className="bg-white h-top  all-border">
              <DocumentCount title="我的贡献" count={this.state.total}/>
            </div>                  
          </Col>
          <Col col="md-9">
            <div className="bg-white h-top gx-list  all-border" style={{overflow: 'hidden'}}>
              <CardList history={this.props.history} options={this.state.collections} title="最近收藏的资源"/>
              <Fetch url={URL.QUERY_PERSONAL_NEAR+'?data={"id":'+this.state.param.id+'}'} onSuccess={res => {this.setState({collections:res.data})}}>
              </Fetch>
            </div>
          </Col>
        </Row>  
      )
  }
})

export default RecentCollection