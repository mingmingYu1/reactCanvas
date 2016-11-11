import React from 'react'
import { Link } from 'react-router'
import { Nav, NavItem } from 'bfd/Nav'
import './index.less'

export default React.createClass({
  componentDidMount(){
    this.onFeedback()
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
    return (
      <div className="manage-box row" id="main-feedback">
        <Nav className="col-md-2 manage-nav">
          <NavItem key={ 0 } href="javascript:;" icon="file-text" title="系统管理" defaultOpen>
            <NavItem href="/data/manage/organizemanage" title="组织管理"></NavItem>
            <NavItem href="/data/manage/departmanage" title="部门管理"></NavItem>
            <NavItem href="/data/manage/postmanage" title="岗位管理"></NavItem>
            <NavItem href="/data/manage/usermanage" title="用户管理"></NavItem>
          </NavItem>
          <NavItem key={ 1 } href="javascript:;" icon="file-text" title="用户反馈" defaultOpen>
            <NavItem href="/data/manage/userfeedback" title="用户反馈"></NavItem>
          </NavItem>
          <NavItem key={ 2 } href="javascript:;" icon="file-text" title="日志审计" defaultOpen>
            <NavItem href="/data/manage/operationlog" title="操作日志"></NavItem>
            <NavItem href="/data/manage/interfacelog" title="接口日志"></NavItem>
          </NavItem>
          <NavItem key={ 3 } href="javascript:;" icon="file-text" title="系统公告" defaultOpen>
            <NavItem href="/data/manage/latestnotice" title="发布公告"></NavItem>
          </NavItem>
        </Nav>
        <div className="col-md-10 manage-con">
        	{ this.props.children }
        </div>
      </div>
    )
  }
})