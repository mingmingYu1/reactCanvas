import React, { PropTypes } from 'react'
import { Form, FormItem } from 'bfd/Form2'
import FormInput from 'bfd/FormInput'
import { Checkbox } from 'bfd/Checkbox'
import message from 'bfd/message'
import xhr from 'bfd/xhr'
import auth from 'public/auth'
import './index.less'
import URL from 'public/url'
import ReactDOM from 'react-dom'
import {Link} from 'react-router'
import env from '../../env'
/*import imgSrc_1 from './login_main_1.jpg'
import imgSrc_2 from './login_main_2.jpg'
import imgSrc_3 from './login_main_3.jpg'*/
export default React.createClass({

  contextTypes: {
    history: PropTypes.object,
  },

  getInitialState() {
    this.rules = {
      loginId(v) {
        if (!v) return '请输入用户名'
      },
      password(v) {
        if (!v) return '请输入密码'
      }
    }
    return {
      "env":env.baseUrl,
      "backImg":"./login_main_1.jpg",
      user: {},
      error:"",
      hideNotice:"",
      notice:{"addTime":"","content":""}
    }
  },

  handleChange(user) {
    this.setState({ user })
  },

  handleLogin() {
    this.refs.form.save()    
  },

  handleSuccess(user) {
    if(!user.flag) {
      this.setState({error:'error'})
      return;
    }
    this.setState({error:''})
    auth.register(user.userInfo)
    let referrer = this.props.location.state && this.props.location.state.referrer || 'data/dashboard'
    this.context.history.push(referrer)
    
  },
  handleRemember(e) {
    const user = this.state.user
    user.remember = e.target.checked
    if(user.remember){
      localStorage.setItem('zjs_user',JSON.stringify(user))
    }else{
      localStorage.removeItem('zjs_user')
    }
    this.setState({ user })
  },
  onNoticeClose(){
    this.changeHeight("hide");
   // this.setState({hideNotice:"hide-notice"})
  },

  changeHeight(str){
    let noticeHeight = parseInt(this.refs.notice.clientHeight)
    let bottom = parseInt(this.refs.notice.style.bottom) || -noticeHeight;
    var _this = this
    this.noticeInterval = setInterval(function(){
      if(str == "show"){
        if(bottom >= 60){
          clearInterval(this.noticeInterval)
        }else{
          bottom += 4
          _this.refs.notice.style.bottom = bottom +"px"
        }       
      }else if(str == "hide"){
        if(bottom <= -noticeHeight){
          clearInterval(this.noticeInterval)
          _this.setState({hideNotice:"hide-notice"})
        }else{
          bottom -= 4
          _this.refs.notice.style.bottom = bottom +"px"
        }
      }   
    }, 2)
  },
  downloadHandbook(e){
    e.preventDefault()
    window.open('./login/bg_title.png');
      
  },
  changeBackground(){
   // const back_img = [imgSrc_1,imgSrc_2,imgSrc_3]
    const back_img = ["./login_main_1.jpg","./login_main_2.jpg","./login_main_3.jpg"]
    let rand = Math.round(Math.random()*10)
    let len = back_img.length
    let img = back_img[rand%len]
    this.setState({backImg:img})
  //  ReactDOM.findDOMNode(this.refs.login).style.backgroundImage = 'url(./login_main_2.jpg)' //this.state.backImg
  },
  componentDidMount(){
    xhr({
      type:"GET",
      url:URL.URL_NOTICE,
      success:(res) => {
        if(res.content){
          this.setState({"notice":res})
        }
      }
    })
    this.changeHeight("show");
    let user = JSON.parse(localStorage.getItem('zjs_user'))
    if(user && user.remember){
      this.setState({user:user})
    }
    this.changeBackground();
  },
  render() {
    return (
      <div className="login" id="login" ref="login" style={{backgroundImage:"url("+require(this.state.backImg)+")"}}>
        <div className="body">
          <div className="bg-title-container">
            <div className="bg-logo-title"></div>
          </div>
          <Form ref="form" action={URL.URL_LOGIN} onSuccess={this.handleSuccess} data={this.state.user} onChange={this.handleChange} labelWidth={0} rules={this.rules}>
            <div className="logo">
            </div>
            <FormItem name="loginId">
              <FormInput placeholder="用户名"></FormInput>
            </FormItem>
            <FormItem name="password">
              <FormInput placeholder="密码" type="password"></FormInput>
            </FormItem>
            <FormItem name="error">
              <div className={"tip add-tip "+this.state.error}>
                <span className="glyphicon glyphicon-exclamation-sign"></span>
                <span>用户名或密码错误，请重新输入</span>
              </div>
            </FormItem>
            <FormItem name="remember">
              <Checkbox onChange={this.handleRemember} checked={this.state.user.remember?true:false}>记住密码</Checkbox>
            </FormItem>
            {/*<FormItem name="remember">
              <Checkbox onChange={this.handleRemember}>下次自动登录</Checkbox>
            </FormItem>*/}   
            <button type="submit" className="btn btn-primary" onClick={this.handleLogin}>登录</button>
          </Form>
        </div>
        <div id="footer">
              <div className="mw-box" style={{padding: '0 40px'}}>
                <div className="pull-left">
                  <span>中国经济信息社 版权所有&nbsp;|&nbsp;Copyright 2016 China Economic Information Service.&nbsp;&nbsp;</span>
                  <span></span>
                </div>           
                <div className="pull-right"><a href={this.state.env+"/"+URL.QUERY_DOWNLOAD_HANDBOOK} target="_blank">用户使用手册下载</a>&nbsp;|&nbsp;北京百分点信息科技有限公司 技术支持</div>
              </div>            
        </div>
        <div className={"notice "+ this.state.hideNotice} ref="notice">
          <div className="notice-title"><h5><i className="fa fa-list-alt"></i>最新公告<i className="fa fa-close" onClick={this.onNoticeClose}></i></h5></div>
          <div className="notice-content">
            <div dangerouslySetInnerHTML={{__html:this.state.notice.content}}></div>
          {/*<div className="notice-content">
            <p>尊敬的用户，您好！</p>
            <p>感谢您参与中经社资源共享平台（一期）内测！</p>
            <p>平台建设采取迭代开发模式，该版本是一期内测版本，有些功能不尽完备，有些细节体验可能不尽如人意，感谢您的包容和理解！</p>
            <p>您对平台的任何批评、建议和需求对我们都极为重要，恳请您通过平台反馈模块、电话、微信等任何方式联系我们，我们会根据您的指导不断升级和完善。
            同时，我们将通过技术接入和人工上传等方式不断汇聚更多资源，努力使该平台成为您日常工作中的好帮手。</p>*/}
            <p>祝您工作愉快！我们静候您的反馈与指正。</p>
            <p>联系电话：010-63074549</p>
          </div>
        </div>
      </div>
    )
  }
})