import React from 'react'
import './index.less'
import ResourcePanel from './ResourcePanel'
import ResourceSmallPanel from './ResourceSmallPanel'
import RankingPanel from './RankingPanel'
import {Row, Col} from 'bfd/Layout'
import URL from 'public/url'

export default React.createClass({
    getInitialState(){
        return {           
        }
    },
    componentDidMount(){
        this.onFeedback()
    },
    onFeedback(){
   /* jQuery.ajax({
      type:"GET",
      url:"http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=zh-CN&collectorId=787cd59a",
      cache:true,
      dataType:'script',
      timeout:3000,
    })*/
    $('#main-feedback').append('<script type="text/javascript" src="http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a"></script>');
  
  },
    render(){
        return (
            <div className="performance-box" id="main-feedback">
                <ResourcePanel panel="0" data={this.state.resoureTitle} panelTitle="部门资源贡献" chartTipName="部门贡献" amountTitle="贡献量" 
                    chartId="contributeChart" xhrUrl={URL.QUERY_PERFORMANCE_CONTRIBUTON}>
                </ResourcePanel>
                <ResourcePanel panel="1" data={this.state.resoureTitle} panelTitle="部门资源使用" chartTipName="部门使用"  amountTitle="阅读量"
                 chartId="useChart" xhrUrl={URL.QUERY_PERFORMANCE_USE}>
                </ResourcePanel>
                <Row gutter className="clearfix clear-both">
                    <Col col="md-6">
                        <ResourceSmallPanel chartType="pie" panelTitle="资源分布" chartTipName="资源分布" chartId="contentChart" 
                            xhrUrl={URL.QUERY_PERFORMANCE_DISTRIBUTION}>
                        </ResourceSmallPanel>
                    </Col>
                    <Col col="md-6">
                        <ResourceSmallPanel chartType="graph" panelTitle="部门间联系" chartTipName="部门间联系" chartId="connectionChart" 
                            xhrUrl={URL.QUERY_PERFORMANCE_CONNECTION}>
                        </ResourceSmallPanel>
                    </Col>
                </Row> 
                <div className="ranking">     
                <div className="title"><h2>资源排行榜</h2></div>        
                    <Row gutter className="clearfix clear-both">
                        <Col col="md-6">
                            <RankingPanel rankingTitle="阅读排行" resourceTitle="资源名称" amountTitle="阅读次数" 
                                xhrUrl={URL.QUERY_PERFORMANCE_READING} history={this.props.history}>
                            </RankingPanel>
                        </Col>
                        <Col col="md-6">
                            <RankingPanel rankingTitle="下载排行" resourceTitle="资源名称" amountTitle="下载次数" 
                                xhrUrl={URL.QUERY_PERFORMANCE_DOWNLOAD} history={this.props.history}>
                            </RankingPanel>
                        </Col>
                    </Row>
                    <Row gutter className="clearfix clear-both">
                        <Col col="md-6">
                            <RankingPanel rankingTitle="点赞排行" resourceTitle="资源名称" amountTitle="点赞数" 
                                xhrUrl={URL.QUERY_PERFORMANCE_LIKE} history={this.props.history}>
                            </RankingPanel>
                        </Col>
                        <Col col="md-6">
                            <RankingPanel rankingTitle="收藏排行" resourceTitle="资源名称" amountTitle="收藏人数" 
                                xhrUrl={URL.QUERY_PERFORMANCE_COLLECT} history={this.props.history}>
                            </RankingPanel>
                        </Col>
                    </Row>
                </div>
            </div>

        )
    }
})