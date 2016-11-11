import './index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import Icon from 'bfd/Icon'
import { Timeline, Modal, Button } from 'antd'
import TextOverflow from 'bfd/TextOverflow'
import message from 'bfd/message'
import './index.less'
import { Pagination } from 'antd'
import xhr from 'public/xhr'
import URL from 'public/url'
import auth from 'public/auth'

const Theme = React.createClass({
  getInitialState() {
    return {
      newCollect: [],
      visible: false,
      modalData: '',
      commentList: this.props.commentList,

      //评论内容
      textareaValue: '',

      //求助id
      articleId: '',
      articleInfo: {}
    }
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
      url: `${URL.DOC_SAVE_COMMENT}?content=${this.state.textareaValue}&reqId=${this.props.theme.id}`,
      success: (result) => {
        if (result.flag) {
          // 重置评论列表
          this.getAllComment(this.props.theme.id);
        } else {
          message.success('回复失败，请重新回复')
        }
      }
    })
  },
  getAllComment(id){
    xhr({
      type: 'get',
      url: `${URL.DOC_GET_COMMENT}?pageCurrent=1&pageSize=10&id=` + id,
      success: (result) => {
        this.setState({
          commentList: result,
          textareaValue: ''
        })
      }
    })
  },
  shouldComponentUpdate(newProps, newState){
    if(!this.props.visible && newProps.visible){
      this.getAllComment(newProps.theme.id)
    }
    return true;
  },

  render(){
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
      <Modal title={this.props.theme.title} visible={this.props.visible}
          onOk={this.props.onCancel} onCancel={this.props.onCancel}
          className="latest-theme-modal"
        >
          <div className="comment-con">
            <div className="modal-tit">
              <p>
                <span>部门:{auth.user.depart}</span>
                <span>发布人:{auth.user.name}</span>        
              </p>
              <p>
                <span>发布时间:{this.props.theme.inDate}</span>
                <span>截止时间:{this.props.theme.date}</span>
              </p>
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
      )
  }
})

export default Theme