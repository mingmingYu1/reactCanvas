import './index.less'

import React from 'react'
import { Link } from 'react-router'
import { Row, Col } from 'bfd/Layout'

import ButtonGroup from 'bfd/ButtonGroup'
import Button from 'bfd/Button'

import DocumentCount from 'public/DocumentCount'
import CardList from 'public/CardList'
import RadarChart from 'public/RadarChart'
import LineChart from 'public/LineChart'
import xhr from 'public/xhr'
import URL from 'public/url'
import auth from 'public/auth'


const Department = React.createClass({

  getInitialState(){
  	return {
  		docCounts:0,
  		docNears:[],
  		rankList:[],
  		staffData:{},
  		sourceData:{},
  		trendData:{},
  		infoData:{},
  		id:auth.user.id
  	}
  },

  componentDidMount() {	 	
  	this.getDocCounts()
  	this.getDocNear()
  	this.getRankList()
  	this.getDeptStaff()
  	this.getDeptResource()
  	this.getDeptTrend()
  	this.getDeptInfoById()
    this.onFeedback()
  },

  getDeptInfoById(){
  	const self = this 
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_FIND_DEPT_INFO_BY_ID, 
	  data: {
	    data:{
	    	id:this.state.id
	    }
	  }, 		 
	  success(result) {		  	
	  	self.setState({
	  		infoData:result
	  	})
	  }		  
	})
  },

  getDocCounts(){
  	const self = this 	
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_DOC_CONUT, 
	  data: {
	    data:{
	    	id:this.state.id
	    }
	  }, 		 
	  success(result) {		  	
	  	self.setState({
	  		docCounts:result.data
	  	})
	  }		  
	})
  },

  getDocNear(){
  	const self = this 	
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_DOC_NEAR, 
	  data: {
	    data:{
	    	id:this.state.id
	    }
	  }, 		 
	  success(result) {		
	    self.setState({
	  		docNears:result.data
	  	})
	  }		  
	})
  },

  getRankList(){
  	const self = this 	
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_RANK_LIST, 
	  data: {
	    data:{
	    	id:this.state.id
	    }
	  }, 		 
	  success(result) {	
	  	console.log(result)	
	    self.setState({
	  		rankList:result.data
	  	})
	  }		  
	})
  },

  getDeptStaff(){
  	const self = this 	
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_DEPT_STAFF, 
	  data: {
	    data:{
	    	id:this.state.id
	    }
	  }, 		 
	  success(result) {	
	  	self.setState({
	  		staffData:result
	  	})  	
	  }		  
	})
  },

  getDeptResource(){
  	const self = this 	
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_DEPT_RESOURCE, 
	  data: {
	    data:{
	    	id:this.state.id
	    }
	  }, 		 
	  success(result) {		
	    self.setState({
	  		sourceData:result
	  	})  	
	  }		  
	})
  },

  getDeptTrend(){
  	this.loadLinechart(0);
  },

  buttonGroupClick(value) {
	this.loadLinechart(value);	
  },

  loadLinechart(value){
  	const self = this 	
  	xhr({
	  type: 'POST', 
	  url: URL.QUERY_DEPT_TREND, 
	  data: {
	    data:{
	    	id:this.state.id,
	    	interval:'d',
	    	type:value
	    }
	  }, 		 
	  success(result) {	
	  	self.setState({
	  		trendData:result
	  	})  	
	  }		  
	})
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
      	<div className="depart-box mw-box" id="main-feedback">
        	<Row gutter className="first-section m-b">
        	   <Col col="md-2">
		        <div className="bg-white right-box h-top all-border">
		        	<img alt="img" src={this.state.infoData.base64}/>
		        	<h5>{this.state.infoData.title}</h5>
		        </div>
		      </Col>
		      <Col col="md-10">
		        <div>
		        	<Row gutter>
		        		<Col col="md-3">
		        			<div className="bg-white h-top all-border">
		        				<DocumentCount title="部门贡献" count={this.state.docCounts} />
		        			</div>		        			
		        		</Col>
		        		<Col col="md-9">
			        		<div className="bg-white h-top gx-list  all-border">
			        			<CardList options={this.state.docNears} title="最新贡献"/>
                    <div className="moreContri"><Link to="data/synopsis" query={{id:this.state.id}}>更多<i className="fa fa-angle-right"></i></Link></div>
			        		</div>
		        		</Col>
		        	</Row>
		        </div>
		      </Col>		     
		    </Row>
		    <Row gutter className="second-section">
		    	<Col col="md-2">
		    		<div className="bg-white top10-list all-border">
			    		<h5><span>部门贡献排行TOP10</span></h5>
			    		<ul>
				    		{this.state.rankList.map((item,i)=>{
							  return (
								<li key={i}>
									<img src={item.base64}/>
									<div className="text-box">
									  <span>{item.name}</span>
									  <div><span className="number">{item.total}</span>篇文档</div>
									</div>
								</li>
							  )
							})}
						</ul>
		    		</div>
		    	</Col>
		    	<Col col="md-10">		    		
		    		<Row gutter>
		        		<Col col="md-6">
		        			<div className="bg-white all-border" style={{paddingTop:'10px'}}>
		        				<RadarChart config={this.state.staffData} title="部门人员绩效" height="400px" color={['#f48fb1','#b39ddb']}/>
		        			</div>		        			
		        		</Col>
		        		<Col col="md-6">
			        		<div className="bg-white all-border" style={{paddingTop:'10px'}}>
			        			<RadarChart config={this.state.sourceData} title="部门资源绩效" height="400px" color={['#f48fb1','#b39ddb']}/>
			        		</div>
		        		</Col>
		        	</Row>
		        	<div className="bg-white all-border" style={{marginTop:'20px',marginBottom:'100px'}}>
		        		<ButtonGroup defaultValue="0" onClick={this.buttonGroupClick} className="b-g-b">
					        <Button value="0" size="sm">贡献</Button>
					        <Button value="1" size="sm">阅读</Button>
					        <Button value="2" size="sm">下载</Button>
					        <Button value="3" size="sm">收藏</Button>
					        <Button value="4" size="sm">点赞</Button>
					        <Button value="5" size="sm">分享</Button>
					    </ButtonGroup>
		        		<LineChart height="400px" config={this.state.trendData} title="部门绩效历史走势" color={["#6a7ec4"]}/>  
		        	</div>
		    	</Col>		    	
		    </Row>
      	</div>
    	)
  	}
})

export default Department