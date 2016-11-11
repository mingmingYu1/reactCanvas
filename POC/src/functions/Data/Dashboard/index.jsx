import './index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import SearchInput from 'bfd/SearchInput'
import Button from 'bfd/Button'
import ButtonGroup from 'bfd/ButtonGroup'
import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import { Row, Col } from 'bfd/Layout'
import Icon from 'bfd/Icon'
import TextOverflow from 'bfd/TextOverflow'
import auth from 'public/auth'
import { Card, Col as ColAnt, Row as RowAnt, Tabs, Timeline } from 'antd'
const TabPane = Tabs.TabPane

import CardList from 'public/CardList'
import SimpleList from 'public/SimpleList'
import ImgList from 'public/ImgList'
import NumCutThree from 'public/NumCutThree'

//最新点题
import LastTheme from './LastTheme'

import xhr from 'public/xhr'
import URL from 'public/url'

const Dashboard = React.createClass({  

  getInitialState(){
    return {

      // 假用户id
      userId: auth.user.id,

      status: '1',
      newDocList:[],
      hotDocList:[],

      // 咨询列表
      consultNewDocList: [],
      consultHotDocList: [],

      // 作者推荐
      authorRecommend: [],

      // 下载排行榜
      downLoadRank: [],

      // 阅读排行榜
      readRank: [],

      // 最新征集
      newCollect: [],

      // 报告贡献总量
      reportContributeAll: {},

      // 咨询贡献总量
      consultContributeAll: {},

      //文档数
      userDocNum: '',

      url:{
        bgNewDocList:`${URL.DOC_GETDOC}?pageCurrent=1&pageSize=12&searchType=1`,
        bgHotDocList:`${URL.DOC_GETDOC}?pageCurrent=1&pageSize=12&searchType=2`,
        bgNewDocListFive:`${URL.DOC_GETDOC}?pageCurrent=1&pageSize=5&searchType=1`,
        bgHotDocListFive:`${URL.DOC_GETDOC}?pageCurrent=1&pageSize=5&searchType=2`,
        zxNewDocList:`${URL.DOC_GETINFO}?pageCurrent=1&pageSize=5&searchType=1`,
        zxHotDocList:`${URL.DOC_GETINFO}?pageCurrent=1&pageSize=5&searchType=2`
      }
    }
  },

  componentDidMount(){ 
    //作者推荐
    xhr({
      type: 'get',
      url: `${URL.AUTHOR_RECOMMEND}?pageCurrent=1&pageSize=6&docSize=3`,
      success: (result) => {
        if (result.flag) {
          this.setState({
            authorRecommend: result.totalList
          })
        }
      }
    })

    //下载排行榜
    xhr({
      type: 'get',
      url: `${URL.DOWNLOAD_RANK}?pageCurrent=1&pageSize=10`,
      success: (result) => {
        if (result.flag) {
          this.setState({
            downLoadRank: result.totalList
          })
        }
        
      }
    })

    //阅读排行榜
    xhr({
      type: 'get',
      url: `${URL.READ_RANK}?pageCurrent=1&pageSize=10`,
      success: (result) => {
        if (result.flag) {
          this.setState({
            readRank: result.totalList
          })
        }
        
      }
    })

    //报告贡献总量
    xhr({
      type: 'get',
      url: `${URL.REPORT_TOTAL}`,
      success: (result) => {
        this.setState({
          reportContributeAll: result
        })
      }
    })

    //咨询贡献总量
    xhr({
      type: 'get',
      url: `${URL.CONSULT_TOTAL}`,
      success: (result) => {
        this.setState({
          consultContributeAll: result
        })
      }
    })

    //文档数
    let requestData = {
      id: this.state.userId,
      pageCurrent: 1,
      pageSize: 1
    }
    xhr({
      type: 'get',
      url: URL.QUERY_PERSONAL_CONTRIBUTION + '?data=' + JSON.stringify(requestData),
      success: (result) => {
        this.setState({
          userDocNum: result.totalPageNum
        })
      }
    })

    this.onFeedback()
  },

  componentWillUnmount() {

  },

  handleClick(value) {
    this.setState({status:value});
  },  

  //文章跳转到详情页 资讯
  authorArticleClick(item) {
    //跳转到详情页
    // this.props.history.pushState({"id": item.id},'/data/details')
    // window.location.href = "/data/details?id=" + item.id
    window.open("/data/details?id=" + item.id)
  },
  rankNumColor(i){
    // let colors = ["#ae9ec7","#d7e8c8", "#f3cf92", "#b1b5ba"];
    let colors = ["#2db7f5","#2db7f5", "#2db7f5", "#b1b5ba"];
    return i < 3 ? colors[i] : colors[3];
  },
  onFeedback(){
    /*jQuery.ajax({
      type:"GET",
      url:"http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=zh-CN&collectorId=787cd59a",
      cache:true,
      dataType:'script',
      timeout:3000,
    })*/
   $('#main-feedback').append('<script type="text/javascript" src="http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a"></script>');
  
  },
  render() {    
    //作者推荐
    const authorFn = (arr) => {
      return arr.map((item, i) => {
        return (
          <div onClick={this.authorArticleClick.bind(this, item)} key={i} className="article-item">
            <Icon type="file-pdf-o"/>                    
            <TextOverflow>
              <p className="article-list-tit">{item.name}</p>
            </TextOverflow>
          </div>
        )
      })
    }

    const authorRecommend = this.state.authorRecommend.map((item, i) => {
      if( i < 6){
      return (
        <div key= {i} className="autor-item">
          <div className="top-msg">                     
            <img src={item.headPic} />
            <div className="right-text">
              <h3>{item.name}</h3>
              <span>{item.docCount}份资源</span>
            </div>
          </div>
          <div className="article-list">
            <div className="triangle-top"></div>
          {
            authorFn(item.docs)
          }
          </div>
        </div>
      )
    }
    })

    // 下载排行榜
    const downLoadRank = this.state.downLoadRank.map((item, i) => {
      return <li onClick={this.authorArticleClick.bind(this, item)} key={i}><i style={{color:this.rankNumColor(i)}}>{(i + 1)}</i>
                <TextOverflow><p>{item.name}</p></TextOverflow>
            </li>
    })

    //阅读排行榜
    const readRank = this.state.readRank.map((item, i) => {
      return <li onClick={this.authorArticleClick.bind(this, item)} key={i}><i style={{color:this.rankNumColor(i)}}>{(i + 1)}</i>
            <TextOverflow><p>{item.name}</p></TextOverflow>
        </li>
    })

    return (
      <div className="dashboard" id="main-feedback">
        <div className="mw-box asset-box">
          <Row gutter>
            <Col col="md-9">
              <div className="left-box">
                <div className="bg-white tab-list m-b report-box all-border">
                  <h3 className="title">
                    <Icon type="file-text-o" />&nbsp;报告                   
                    <div className="btn-group">
                      <button value="1" className={"icon-btn fa fa-th-large "+(this.state.status === '1'? 'icon-active':'') }icon="th-large" size="sm" onClick={this.handleClick.bind(this,'1')}></button>
                      <button value="2" className={"icon-btn fa fa-bars "+(this.state.status === '2'? 'icon-active':'')} icon="bars" size="sm" onClick={this.handleClick.bind(this,'2')}></button>
                    </div>
                  </h3>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="最新" key="1">                
                      { this.state.status === '1' ? <ImgList history={this.props.history} url={this.state.url.bgNewDocList}/> : <SimpleList history={this.props.history} url={this.state.url.bgNewDocListFive}/>}       
                      <div className="text-right clear"><Link className="more-btn" to="data/synopsis">更多></Link></div>                   
                   </TabPane>                                   
                    <TabPane tab="最热" key="2"> 
                      { this.state.status === '1' ?  <ImgList history={this.props.history} url={this.state.url.bgHotDocList}/> : <SimpleList history={this.props.history} url={this.state.url.bgHotDocListFive}/>}  
                      <div className="text-right clear"><Link className="more-btn" to="data/synopsis">更多></Link></div> 
                    </TabPane>                            
                  </Tabs>
                </div>
                <div className="bg-white tab-list m-b news-box all-border">
                  <h3 className="title"><Icon type="list-alt" />&nbsp;资讯</h3>
                  <Tabs defaultActiveKey="1" className="zixun">
                    <TabPane tab="最新" key="1">
                      <SimpleList history={this.props.history} url={this.state.url.zxNewDocList}/> 
                      <div className="text-right clear"><Link className="more-btn" to="data/synopsis">更多></Link></div>  
                    </TabPane>
                    <TabPane tab="最热" key="2"> 
                      <SimpleList history={this.props.history} url={this.state.url.zxHotDocList}/>
                      <div className="text-right clear">                        
                        <Link to='/data/synopsis' className="more-btn">更多</Link>
                      </div> 
                    </TabPane>                            
                  </Tabs>
                </div>
                <div className="autor-box m-b bg-white all-border">       
                  <h3><Icon type="user-plus" />&nbsp;贡献排行</h3>  
                  <div className="autor-list">
                    { authorRecommend }                   
                  </div>                   
                </div>
              </div>
            </Col>
            <Col col="md-3">
              <div className="right-box">
                <div className="right-count m-b">
                  <Row gutter>
                    <Col col="md-6">
                      <div className="bg-white">
                        <Card title="报告贡献总量" bordered={false}  style={{ width: '100%', minHeight: '125px' }}>
                          <h3 className="text-center">
                            <Icon type="file-text-o"/>
                            <NumCutThree number={this.state.reportContributeAll.totalPageNum}/>
                            <div className="date">{this.state.reportContributeAll.time}</div>
                          </h3>
                        </Card>
                      </div>
                    </Col>
                    <Col col="md-6">
                      <div className="bg-white">                        
                        <Card title="资讯贡献总量" bordered={false}  style={{ width: '100%', minHeight: '125px' }}>
                          <h3 className="text-center">
                            <Icon type="list-alt"/>
                            <NumCutThree number={this.state.consultContributeAll.totalPageNum}/>
                            <div className="date">{this.state.consultContributeAll.time}</div>
                          </h3>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="bg-white right-doc m-b all-border">
                  <Row>
                    <Col col="md-6" className="lf-bx">
                      <img alt="img" src={auth.user.headPic !== "" && auth.user.headPic ||  require('./images/portrait.png')} />
                      <h4 style={{ marginTop:'10px'}}>{auth.user.name}</h4>
                      <a href="/data/mycenter/upload">
                        <Button type="primary" icon="upload" style={{backgroundColor:'#ffa726'}}>上传资源</Button>
                      </a>
                    </Col>
                    <Col col="md-6">
                      <div className="doc_list">
                        <div className="pull-left">
                          <Icon type="file-text-o" style={{fontSize:'50px',margin:'0 10px',color:'#2db7f5'}}/>
                        </div>
                        <div className="pull-left">
                          <p className="doc-num">{this.state.userDocNum}</p>
                          <p className="doc-tip">文档数</p>
                        </div>
                        <div className="clear"></div>                     
                      </div>
                      <h4 style={{marginTop:'10px'}}><Link className="linkA" to="data/mycenter">进入个人空间</Link></h4>
                      <a href="/data/mycenter/seekDoc">
                        <Button type="minor" icon="bullhorn">发布点题</Button>
                      </a>                      
                    </Col>
                  </Row>
                </div>
                <div className="bg-white right-tabs-rank m-b all-border">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab={<span><Icon type="align-right" />&nbsp;下载排行榜</span>} key="1">
                      <div className="billboard-list">
                        <ul>
                          {downLoadRank}
                        </ul>
                      </div>
                    </TabPane>
                    <TabPane tab={<span><Icon type="align-right" />&nbsp;阅读排行榜</span>} key="2">
                      <div className="billboard-list">
                        <ul>
                          {readRank}
                        </ul>
                      </div>
                    </TabPane>                  
                  </Tabs> 
                </div>
                {/**
                  发布点题
                */}
                <LastTheme></LastTheme>
              </div>
            </Col>
          </Row>       
        </div>
      </div>
    )
  }
})
export default Dashboard