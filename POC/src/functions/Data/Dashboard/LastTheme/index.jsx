import React from 'react'
import ReactDom from 'react-dom'
import Icon from 'bfd/Icon'
import { Timeline, Modal, Button } from 'antd'
import TextOverflow from 'bfd/TextOverflow'
import message from 'bfd/message'
import './index.less'
import { Pagination } from 'antd'
import xhr from 'public/xhr'
import URL from 'public/url'

export default React.createClass({
	getInitialState() {
		return {
			newCollect: [],
			visible: false,
			modalData: '',
			commentList: {
				totalList: [],
				totalPageNum: 0,
				currentPage: 0
			},

			//评论内容
			textareaValue: '',

			//求助id
			articleId: '',
			articleInfo: {}
		}
	},

	componentDidMount() {
		// 发布点题
    xhr({
      type: 'get',
      url: `${URL.NEW_COLLECT}?pageCurrent=1&pageSize=100`,
      success: (result) => {
        if (result.flag) {
          this.setState({
            newCollect: result.totalList
          })
        }
      }
    });
    //最新求助 动态效果
    this.helpDataChange()
	},

	componentWillUnmount() {
    this.dataChangeTimer && clearInterval(this.dataChangeTimer)
  },

  helpDataChange() {
  	this.dataChangeTimer = setInterval(() => {
      let siteNewCollect = this.state.newCollect
      siteNewCollect.push(siteNewCollect[0])
      siteNewCollect.shift()
      this.setState({
        newCollect: siteNewCollect
      })
    }, 1500)
  },

  //鼠标移入
  handleMouseOver() {
  	this.dataChangeTimer && clearInterval(this.dataChangeTimer)
  },

  //鼠标移出
  handelMouseOut() {
  	this.helpDataChange()
  },

  //文章点击
	handleArticle(item) {
		this.setState({
			articleInfo: item
		})

		//获取评论列表
    xhr({
    	type: 'get',
    	url: `${URL.DOC_GET_COMMENT}?pageCurrent=1&pageSize=10&id=` + item.id,
    	success: (result) => {
    		this.setState({
    			commentList: result
    		})
    	}
    })
		this.setState({
      visible: true,
      modalData: item
    });
		this.dataChangeTimer && clearInterval(this.dataChangeTimer)
	},

	// modal
  handleOk() {
    this.setState({
      visible: false,
    });
  },
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  },

  //评论分页
  showTotal(total) {
	  return `共 ${total} 条`;
	},

	//评论输入框
	textareaChange(ev) {
		this.setState({
			textareaValue: ev.target.value
		})
	},

	//添加评论
	handleAddComment() {
		xhr({
			type: "post",
			url: `${URL.DOC_SAVE_COMMENT}?content=${this.state.textareaValue}&reqId=${this.state.articleInfo.id}`,
			success: (result) => {
				if (result.flag) {
					// 重置评论列表
			    xhr({
			    	type: 'get',
			    	url: `${URL.DOC_GET_COMMENT}?pageCurrent=1&pageSize=10&id=` + this.state.articleInfo.id,
			    	success: (result) => {
			    		this.setState({
			    			commentList: result,
			    			textareaValue: ''
			    		})
			    	}
			    })
				} else {
					message.success('回复失败，请重新回复')
				}
			}
		})
	},

	render() {

		// 最新点题
    const newCollect = this.state.newCollect.map((item, i) => {
      return (
        <Timeline.Item key={i}>
          <div onClick={this.handleArticle.bind(this, item)} className="list-item latest-theme">
            <div className="triangle-left"></div> 
            <h5>{item.name}</h5>
            <h4>{item.insertTime}</h4>
          </div>
        </Timeline.Item>
      )
    })    

    // 回复列表
    const commentList = this.state.commentList.totalList.map((item, i) => {
    	return (
    		<div key={i} className="row modal-comment-list">
    			<TextOverflow>
    				<div className="col-md-4 comment-tit">{item.content}</div>
    			</TextOverflow>
    			<TextOverflow>
    				<div className="col-md-3 comment-tit">{item.createTime}</div>
    			</TextOverflow>
    			<TextOverflow>
    				<div className="col-md-2 comment-tit">{item.user.name}</div>
    			</TextOverflow>
    			<TextOverflow>
    				<div className="col-md-3 comment-tit">{item.deptName}</div>
    			</TextOverflow>
      	</div>
    	)
    })

		return (
			<div onMouseOver={this.handleMouseOver} onMouseOut={this.handelMouseOut} className="right-collect bg-white  all-border">
        <h4 className="title"><Icon type="bullhorn" />&nbsp;最新点题</h4>
        <div className="right-collect-container">
	        <Timeline ref="timeline">                    
	          {newCollect}
	        </Timeline>
        </div>
        <Modal title={this.state.modalData.name} visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          className="latest-theme-modal"
        >
        	<div className="comment-con">
        		<div className="modal-tit">
	          	<div className="clearfix">
	          		<p className="pull-left">
                  <span>部门：</span>
                  <span>{this.state.modalData.deptName}</span>
                </p>
                <p className="pull-left">
                  <span>发布人：</span>
                  <span>{this.state.modalData.userName}</span>
                </p>
	          	</div>
              <div className="clearfix">
                <p className="pull-left">
                  <span>开始时间：</span>
                  <span>{this.state.modalData.insertTime}</span>
                </p>
                <p className="pull-left">
                  <span>结束时间：</span>
                  <span>{this.state.modalData.endTime}</span>
                </p>
              </div>
              <div className="clearfix">
                <p className="pull-left">
                  <span>联系人：</span>
                  <span>{this.state.modalData.contacts}</span>
                </p>
                <p className="pull-left">
                  <span>联系方式：</span>
                  <span>{this.state.modalData.contactWay}</span>
                </p>
              </div>
	          </div>
	          <div className="modal-con ask-con-box clearfix">
	          	<div className="ask-con-tit pull-left">点题内容：</div>
              {this.state.modalData.desc ? 
                <div className="ask-con-main">
                  {this.state.modalData.desc}
                </div>
                :
                <div className="ask-con-main ask-con-main2">
                  (用户未输入内容)
                </div>
              }
	          </div>
	          <div className="modal-comment clearfix">
	          	<textarea value={this.state.textareaValue} onChange={this.textareaChange} className="pull-left"></textarea>
	          	<input onClick={this.handleAddComment} className="pull-right" type="button" value="回复" />
	          </div>
	          <div className="modal-comment-box">
	          	<div className="row modal-comment-list">
	          		<div className="col-md-4 comment-tit-head">回复内容</div>
	          		<div className="col-md-3 comment-tit-head">回复时间</div>
	          		<div className="col-md-2 comment-tit-head">回复人</div>
	          		<div className="col-md-3 comment-tit-head">回复部门</div>
	          	</div>
	          	{commentList}
	          	<div className="modal-page clearfix">
	          		<Pagination showTotal={this.showTotal} size="small" showQuickJumper defaultCurrent={parseInt(this.state.commentList.currentPage)} total={parseInt(this.state.commentList.totalPageNum)} />
	          	</div>
	          </div>
        	</div>
        </Modal>
      </div>
		)
	}
})