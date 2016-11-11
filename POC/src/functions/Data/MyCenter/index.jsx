import './index.less'

import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd/Button'
import Icon from 'bfd/Icon'
import auth from 'public/auth'
import { Nav, NavItem } from 'bfd/Nav'
import xhr from 'public/xhr'

export default React.createClass({
  getInitialState(){
    return {
      headPic:auth.user.headPic
    }
  },
  handleInfosaved(pic){
    this.setState({headPic:pic})
  },
  handleAClicked(e){
    e.preventDefault()
  },
  componentDidMount(){
    this.onFeedback()
  },
  onFeedback(){
 /*   jQuery.ajax({
      type:"GET",
      url:"http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=zh-CN&collectorId=787cd59a",
      cache:true,
      dataType:'script',
      timeout:3000,
    })*/
    $('#main-feedback').append('<script type="text/javascript" src="http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a"></script>');
  
  },
  render() {
    return (
      <div className="center-board" id="main-feedback">
	      <div className="mw-box">
		      <div className="row content">
		      	<div className="col-md-2 content-left">
              <div className="portrait">
                <img src={this.state.headPic !== "" && this.state.headPic ||  require('./images/portrait.png')} alt="个人头像"/>
                <h5>{auth.user.name}</h5>
                <Link to="/data/mycenter/upload">
                <Button type="primary" className="upload-btn"><Icon type="upload"/>上传资源</Button>
                </Link>
              </div>              
              <Nav>
                <NavItem key={0} href="javascript:;" title="我的文档" icon="file-text" defaultOpen onClick={this.handleAClicked}>
                  <NavItem href="/data/mycenter/board/contribution" title="我的贡献"></NavItem>
                  <NavItem href="/data/mycenter/board/collection" title="我的收藏"></NavItem>
                  <NavItem href="/data/mycenter/board/down" title="我的下载"></NavItem>
                </NavItem>
                <NavItem key={1} href="javascript:;" title="我的分享" icon="share-alt" defaultOpen>
                  <NavItem href="/data/mycenter/board/share" title="我的分享"></NavItem>
                  <NavItem href="/data/mycenter/board/shareWithMe" title="分享给我"></NavItem>
                </NavItem>
                <NavItem key={2} href="javascript:;" title="点题需求" icon="bullhorn" defaultOpen>
                  <NavItem href="/data/mycenter/board/help" title="点题需求"></NavItem>
                </NavItem>
                <NavItem key={3} href="javascript:;" title="我的账号" icon="user" defaultOpen>
                  <NavItem href="/data/mycenter/board/personalInfo" title="个人信息"></NavItem>
                  <NavItem href="/data/mycenter/board/changePwd" title="修改密码"></NavItem>
                </NavItem>
              </Nav>
             </div>
		      	<div className="col-md-10" style={{borderLeft: '1px solid #dce3eb'}} >
              { this.props.children && React.cloneElement(this.props.children, {
                onInfoSaved: this.handleInfosaved,
                history:this.props.history
              })}
            </div>
		      </div>
	      </div>
      </div>
    )
  }

})