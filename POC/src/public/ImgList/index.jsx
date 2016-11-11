import './index.less'
import React from 'react'
import { Router, Route, Link, IndexRoute, Redirect} from 'react-router'
import { createHistory, browserHistory } from 'history'
import TextOverflow from 'bfd/TextOverflow'
import { Card } from 'antd'
import Icon from 'bfd/Icon'

import xhr from 'public/xhr'
import URL from 'public/url'

export default React.createClass({
  

  getInitialState() {
	return {
		data: []
	}
  },

  componentDidMount() {
	xhr({
		type: 'GET',
		url: this.props.url,
		success: (result) => {
			if (result.totalList && result.totalList.length > 0) {
				this.setState({
					data: result.totalList
				})
				this.getImg(result.totalList)
			}
		}
	})
  },

  getImg(list) {
	list.map((item, i) => {
		xhr({
			type: 'GET',
			url: `${URL.DOC_GET_IMGS}?id=${item.id}`,
			success: (result) => {
				if (result && result.data && result.data.img) {
					this.setImg(item.id, result.data.img)
				}
			}
		})
	})
  },

  setImg(id,img){
  	let data = this.state.data
  	data && data.length>0 && data.map((item,i)=>{
  		if(item.id == id) item.img = img
  	})
  	this.setState({data})
  },   

  render() {  
    return (
	    <div className="img-list-box">
	    	<div className="row">
	    		{
		      	this.state.data.length>0 && this.state.data.map((item,i)=>{	      	  
		      	  if(!item) return	  
		      	  if (i < 6) {
		      	  	return (
			            <Card className="card col-md-2" bodyStyle={{ padding: 0 }} key={i}>
				            <Link to='/data/details' query={{id: item.id}} target="_blank">
				              <div className="custom-image">
				                <img alt="example" width="100%" src={item.img ? item.img : item.type && item.type == 'PDF' ? require('./pdf.png'):require('./word.png')} />
				                <i className={item.type && item.type == 'PDF'? "file-pdf" : "file-word"}></i> 
				              </div>
				              <div className="custom-card">
				              	<TextOverflow>
				               		<h5 className="report-title report-title-hidden">{item.name}</h5>
				               	</TextOverflow>
				               	<h5 className="report-title">{item.name.length>14?`${item.name.substring(0,14)}...`:item.name}</h5>               
				              </div>
				            </Link>	            
			            </Card>
		            ) 
		      	  }     
		        })
		      }      	
	    	</div>
	      <div className="row">
	    		{
		      	this.state.data.length>0 && this.state.data.map((item,i)=>{	      	  
		      	  if(!item) return	  
		      	  if (i >= 6) {
		      	  	return (
			            <Card className="card col-md-2" bodyStyle={{ padding: 0 }} key={i}>
				            <Link to='/data/details' query={{id: item.id}} target="_blank">
				              <div className="custom-image">
				                <img alt="example" width="100%" src={item.img ? item.img : item.type && item.type == 'PDF' ? require('./pdf.png'):require('./word.png')} />
				                <i className={item.type && item.type == 'PDF'? "file-pdf" : "file-word"}></i> 
				              </div>
				              <div className="custom-card">
				              	<TextOverflow>
				               		<h5 className="report-title report-title-hidden">{item.name}</h5>
				               	</TextOverflow>
				               	<h5 className="report-title">{item.name.length>14?`${item.name.substring(0,14)}...`:item.name}</h5>               
				              </div>
				            </Link>	            
			            </Card>
		            ) 
		      	  }     
		        })
		      }      	
	    	</div>
	    </div>
    )
  }
})


{/**
<div className="img-list-box">
	      {
	      	this.state.data.length>0 && this.state.data.map((item,i)=>{	      	  
	      	  if(!item) return	          
	          return (
	            <Card className="card" bodyStyle={{ padding: 0 }} key={i}>
		            <Link to='/data/details' query={{id: item.id}} target="_blank">
		              <div className="custom-image">
		                <img alt="example" width="100%" src={item.img ? item.img : item.type && item.type == 'PDF' ? require('./pdf.png'):require('./word.png')} />
		                <i className={item.type && item.type == 'PDF'? "file-pdf" : "file-word"}></i> 
		              </div>
		              <div className="custom-card">
		               <h5 className="report-title">{item.name.length>13?`${item.name.substring(0,13)}...`:item.name}</h5>               
		              </div>
		            </Link>	            
	            </Card>
	            ) 
	        })
	      }      	
	    </div>
*/}