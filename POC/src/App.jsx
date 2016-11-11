import './App.less'
import 'antd/dist/antd.less'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'

import env from './env'
import { Nav, NavItem } from 'bfd/Nav'
import Button from 'bfd/Button'
import Icon from 'bfd/Icon'
import xhr from 'public/xhr'
import auth from 'public/auth'
import Loading from 'public/Loading'
import URL from 'public/url'
import { Affix , Spin , Tooltip} from 'antd'


const LOGIN_PATH = (/*env.basePath + */'/login').replace(/\/\//, '/')
const App = React.createClass({

  contextTypes: {
    history: PropTypes.object
  },

  getInitialState() {    
    return {

      //  用户搜索
      searchValue: '',

      // 用户是否登录
      loggedIn: auth.isLoggedIn(),
      allNavList: [{
        "desc": "首页",
        "extParam": "",
        "name": "首页",
        "type": 1,
        "uri": "homepage",
        "active": true
      }, {
        "desc": "资源地图",
        "extParam": "",
        "name": "资源地图",
        "type": 1,
        "uri": "sourcemap",
        "active": false
      }, {
        "desc": "资源绩效",
        "extParam": "",
        "name": "资源绩效",
        "type": 1,
        "uri": "zyjx",
        "active": false
      }, {
        "desc": "",
        "extParam": "",
        "name": "部门空间",
        "type": 1,
        "uri": "bmkj",
        "active": false
      }, {
        "desc": "",
        "extParam": "",
        "name": "个人空间",
        "type": 1,
        "uri": "grzx",
        "active": false
      }, {
        "desc": "系统管理",
        "extParam": "",
        "name": "系统管理",
        "type": 1,
        "uri": "xtgl",
        "active": false
      }],
      navList: [],
      isNavShow:true,
      url_logout:URL.URL_LOGOUT,
    }
  },

  componentWillMount() {
    if (auth.user) {
      window.user = auth.user
    }
    if (window.user) {
      this.myAuthor()
    }
    // 页面加载后判断是否需要跳转到登录页
    if (!this.state.loggedIn && !this.isInLogin()) {

      this.login()
    }
    this.navListClick(this.props.location.pathname); 
    this.handleResize();
  },

  componentDidMount() {
    this.myAuthor()
    this.onFeedback()
  },

  componentWillReceiveProps() {
    if (auth.user) {
      window.user = auth.user
    }
    if (window.user) {
      this.myAuthor()
    }
    
    this.setState({
      loggedIn: auth.isLoggedIn()
    }) 
  },

  handleCloseNav(){
    if(jQuery(window).width()>760){
      this.setState({isNavShow:true});      
    }else{
      this.setState({isNavShow:false});
    }    
  },

  handleResize(){
    window.onresize = ()=> {      
      jQuery(document.documentElement).animate({
        scrollTop: 0
      }, 20);
      jQuery(document.body).animate({
        scrollTop: 0
      }, 20);      
      this.handleCloseNav();
    }
  },

  navListClick() {    
    this.handleCloseNav();
  },

  //权限
  myAuthor() {
    //权限判断
    let allNav = this.state.allNavList
    let newNav = []
    newNav[0] = allNav[0]
    newNav[1] = allNav[1]
    if (window.user.resources.length === 0) {
      newNav[2] =allNav[4]
    } else if(window.user.resources.length === 1) {
      if (window.user.resources[0].name === '系统管理') {
        newNav[2] = allNav[4]
        newNav[3] = allNav[5]
      } else if(window.user.resources[0].name === '资源绩效') {
        newNav[2] = allNav[2]
        newNav[3] = allNav[4]
      } else if(window.user.resources[0].name === '部门空间') {
        newNav[2] = allNav[3]
        newNav[3] = allNav[4]
      }
    } else if(window.user.resources.length === 2) {
      newNav.length = 5
      if (window.user.resources[0].name === '系统管理') {
        newNav[4] = allNav[5]
        newNav[3] = allNav[4]
        newNav[2] = window.user.resources[1]
      } else if(window.user.resources[1].name === '系统管理') {
        newNav[4] = allNav[5]
        newNav[3] = allNav[4]
        newNav[2] = window.user.resources[0]
      } else {
        newNav[2] = allNav[2]
        newNav[3] = allNav[3]
        newNav[4] = allNav[4]
      }
    } else if(window.user.resources.length === 3) {
      newNav = allNav
    }
    this.setState({
      navList: newNav
    })
  },

  // 当前 URL 是否处于登录页
  isInLogin() {
    return this.props.location.pathname === LOGIN_PATH
  },

  // 权限判断
  hasPermission() {
    // ...根据业务具体判断
    return true 
  },

  // 跳转到登录页
  login() {
    this.context.history.replaceState({
      referrer: this.props.location.pathname
    }, LOGIN_PATH)
  },

  // 安全退出
  handleLogout(e) {
    e.preventDefault()
    xhr({
      url: this.state.url_logout,
      success: () => {
        auth.destroy()
        this.login()
      }
    })
  },

  toggleClick(){    
    const flag = this.state.isNavShow
    this.setState({isNavShow:!flag})
   
  }, 

  // 用户搜索事件
  searchInpClick(ev) {
    this.setState({
      searchValue: ev.target.value
    })
  },

  handleSearchClick(){
   // this.props.history.pushState({keyword:this.refs.keyword.value},'/data/synopsis');
    window.location.href = '/data/synopsis?searchWord=' + this.state.searchValue
  },

  handleSearchFocus(str) {
    // 参数str是为了判断是否是输入框，解决和form表单enter事件冲突
    if (str == 'searchBox') {
      window.addEventListener('keydown', this.handleDocumentEnter, false)
    }
  },

  handleSearchBlur() {
     window.removeEventListener('keydown', this.handleDocumentEnter, false)
  },

  handleDocumentEnter(e) {
    if (e.keyCode == 13) {
      this.handleSearchClick()
    }
  },

 componentWillUnmount() {
   window.removeEventListener('keydown', this.handleDocumentEnter, false)
 },

  onFeedback(){
   /* $.ajax({
      type:"GET",
      url:"http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=zh-CN&collectorId=787cd59a",
      cache:true,
      dataType:'script',
      timeout:3000,
    })*/
   $('#main-feedback').append('<script type="text/javascript" src="http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a"></script>');
  
  },
  render() {
    let Children = this.props.children

    // 当前 URL 属于登录页时，不管是否登录，直接渲染登录页
    if (this.isInLogin()) return Children
     
    if (this.state.loggedIn) {

      if (!this.hasPermission()) {
        Children = <div>您无权访问该页面</div>
        
      }
      const navList = this.state.navList.map((item,i)=>{     
          if (item.name === '首页') {
            return <li key={item.uri} onClick={this.navListClick}><Link activeClassName="active" to='/data/dashboard'>{item.name}<i></i></Link></li>
          } else if(item.name === '资源地图') {
            return <li key={item.uri} onClick={this.navListClick}><Link activeClassName="active" to="/data/synopsis">{item.name}<i></i></Link></li>
          } else if(item.name === '资源绩效') {
            return <li key={item.uri} onClick={this.navListClick}><Link activeClassName="active" to="/data/performance">{item.name}<i></i></Link></li>
          } else if(item.name === '部门空间') {
            return <li key={item.uri} onClick={this.navListClick}><Link activeClassName="active" to="/data/department">{item.name}<i></i></Link></li>
          } else if(item.name === '个人空间') {
            return <li key={item.uri} onClick={this.navListClick}><Link activeClassName="active" to="/data/mycenter">{item.name}<i></i></Link></li>
          } else if(item.name === '系统管理') {
            return <li key={item.uri} onClick={this.navListClick}><Link activeClassName="active" to="/data/manage">{item.name}<i></i></Link></li>
          }
      });
      return (
        <div id="wrapper">  
          <div id="body">            
              <Affix offsetTop={0}> 
                <div className="top-nav">
                  <div className="row mw-box header-bg">
                    <div className="col-md-3">
                      <h4 className="left-title">
                        <img src={require('./logo.png')}/>
                        <i className="fa fa-align-justify toggle" onClick={this.toggleClick}></i>
                      </h4>
                    </div>
                    <div className="col-md-9 nav-list">
                      <ul className="navbar-nav">{ (this.state.isNavShow ? navList :null) }</ul>
                      <div className="pull-right top-menu-right" id="main-feedback">
                        <div className="input-group top-nav-search">
                          <input ref="keyword" onFocus={this.handleSearchFocus.bind(this, 'searchBox')} onBlur={this.handleSearchBlur} type="text" vlaue={this.state.searchValue} onChange={this.searchInpClick} className="form-control" placeholder="全库搜索"/>
                          <Button type="primary" className="btn-search" onClick={this.handleSearchClick}>
                            <i className="fa fa-search"></i>         
                          </Button>
                          {/**}
                          <Link to='/data/synopsis' query={{searchWord: this.state.searchValue}}> 
                            <Button type="primary" className="btn-search" onClick={this.handleSearchClick}>
                                <i className="fa fa-search"></i>         
                            </Button>
                          </Link>
                        */}
                        </div>
                       {/* <script type="text/javascript" src="http://192.168.110.54:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a">
                        </script>*/}
                        <Link to="data/mycenter/feedback">我要反馈</Link>&nbsp;|&nbsp;                    
                        <Tooltip title={auth.user.name}>
                          <Link to="data/mycenter"><span className="user-info">{auth.user.name}&nbsp;</span></Link>
                        </Tooltip>
                        <Button type="primary" onClick={this.handleLogout} className="logout-btn">退出&nbsp;
                        <i className="fa fa-sign-out"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Affix>
              <div className="content">
                {Children}
              </div>            
            </div>
            <div id="footer">
              <div className="mw-box" style={{padding: '0 40px'}}>
                <div className="pull-left">
                  <span>中国经济信息社 版权所有</span>&nbsp;|&nbsp;
                  <span>Copyright 2016 China Economic Information Service.</span>
                </div>           
                <div className="pull-right">北京百分点信息科技有限公司 技术支持</div>
              </div>            
            </div>
            <Loading icon={require('./loading.gif')} text="正在加载。。。" /> 
        </div>
      )
    } else {
      return null
    }
  }
})

export default App