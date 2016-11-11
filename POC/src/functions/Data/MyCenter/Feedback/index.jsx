import React from 'react'
import xhr from 'public/xhr'
import URL from 'public/url'
import message from 'bfd/message'
import { Link } from 'react-router'
import './index.less'

export default React.createClass({
	getInitialState() {
		return {
			userInp: ''
		}
	},

	userInp(ev) {
		this.setState({
			userInp: ev.target.value
		}) 
	},

	feedbackSubmit() {
      if (this.state.userInp) {
        xhr({
          type: 'post',
          url: `${URL.MY_FEEDBACK}?feedbackContent=${this.state.userInp}`,
          success: (result) => {
            console.log(result)
            if (result.flag) {
              message.success('反馈成功')
              window.history.go(-1)
            } else {
              message.success('反馈失败，请重新反馈')
            }
            this.setState({
              userInp: ''
            })
          }
        })
      } else {
        message.success('请输入内容')
      }
	},

  handleCancel() {
    alert(1)
  },

  render() {
    return (
      <div className="feedback-box">
        <div className="clearfix feedback-tit">
        	<span className="pull-left">个人空间</span>
        	<i className="fa fa-angle-right pull-left"></i>
        	<span className="pull-left">我要反馈</span>
        </div>
        <div className="feedback-con">
        	<h3 className="feedback-con-tit">我的反馈</h3>
        	<div className="feedback-text row">
        		<span className="col-md-2">反馈内容：</span>
        		<textarea onChange={ this.userInp } value={ this.state.userInp } className="col-md-10">
        			
        		</textarea>
        	</div>
        	<div className="row feedback-btn">
        		<div className="col-md-6 clearfix">
        			<input onClick={ this.feedbackSubmit } className="pull-right feedback-sure" type="button" value="提交反馈" />
        		</div>
        		<div className="col-md-6 clearfix">
        			<Link to='/data/dashboard'><input className="pull-left feedback-cancel" type="button" value="取消" /></Link>
        		</div>
        	</div>
        </div>
      </div>
    )
  }
})