import './index.less'
import React from 'react'
import message from 'bfd/message'
import ShareModal from 'public/ShareModal'
import { Link } from 'react-router'
import xhr from 'public/xhr'
import URL from 'public/url'
import Env from '../../env'
import Icon from 'bfd/Icon'
import TextOverflow from 'bfd/TextOverflow'

const SimpleList = React.createClass({ 

	getInitialState() {
		return {
			modalShow: false,
			articleId: '',
			data: []
		}
	},

  	//收藏
	handleCollection(item) {
		if(item.isCollect === 'true') return
		xhr({
			type: 'GET',
			url: URL.QUERY_SYNOPSIS_COLLECTION + '?id=' + item.id,
			success: (result) => {
				if (result.flag) {
					message.success('收藏成功')
					const { data } = this.state
					data && data.length>0 && data.map((_item,_i)=>{
						if(_item.id == item.id) _item.isCollect = 'true'
					})
					this.setState({data})
				} else {
					// message.success(result.message)
					message.success('收藏失败，请重新收藏！')
				}
			}
		})
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
				}
			}
		})
	},

	//分享
	handleShare(item) {
		this.setState({
			modalShow: true,
			articleId: item.id
		})
	},

	handleShareModalCancel() {
		this.setState({
			modalShow: false
		})
	},

  render() {
  	let list
  	const  options  = this.state.data	
	if (options && options.length > 0) {
  		list = options.map((item,i)=>{   		 
			if(!item) return 
	        return (
		       	<li key={i}>
	              <div className="row">
	              		<div className="col-md-8 article">
	              			<Link to='/data/details' query={{id: item.id}} target="_blank">
                        <TextOverflow>
			                   <h3>
				              	{item.type && item.type == 'PDF'? <Icon type="file-pdf-o" style={{color:'#bd4040'}} /> : null}  
			            		{item.type && item.type == 'WORD'? <Icon type="file-word-o" style={{color:'#0e539b'}}/> : null}  
				              	{item.name}
			                  </h3>
                        </TextOverflow>
	              			</Link>	  
		                  	<p className="article-info">
		                  		{item.createTime ? <span><span>发稿时间：</span><span>{item.createTime}</span>&nbsp;&nbsp;</span> : null} 
		                  		{item.categorySource ? <span><span>来源：</span><span>{item.categorySource}</span>&nbsp;&nbsp;</span> : null}
		                  		{item.price + '' ? <span><span>下载积分:</span><span>{item.price}</span>&nbsp;&nbsp;</span> :null}                     		                    
		                  	</p>	                 
		                </div>            
	                <div className="col-md-4 icons-list">
	                  <div className="icon-box consult-operation-box">
	                  	<div className="consult-operation-con">
	                    	<a download href={Env.baseUrl + "/doc/download?id=" + item.id} className="fa fa-download"></a>	
	                  		<span className="operation-tips">下载</span>
	                  	</div>         
	                  	<div className="consult-operation-con">
	                    	<i className="fa fa-heart" onClick={this.handleCollection.bind(this, item)} style={{color:item.isCollect==='true'?'#ff5722':'#2db7f5',pointerEvents:item.isCollect==='true'?'none':'all'}}></i>   
	                  		<span className="operation-tips">收藏</span>
	                  	</div>    
	                  	<div className="consult-operation-con">
	                    	<i className="fa fa-share-alt" onClick={this.handleShare.bind(this, item)}></i>
	                  		<span className="operation-tips">分享</span>
	                  	</div>                     
	                  </div>
	                </div>
	              </div>
	            </li>
	        );
	    });
  	}  
    return (
      <div className="poc-simple-list">
      	<ul>{list}</ul>    
        <ShareModal articleId={this.state.articleId} visible={this.state.modalShow} onCancleClick={this.handleShareModalCancel}>
        </ShareModal>         
      </div>
    )
  }
})
export default SimpleList