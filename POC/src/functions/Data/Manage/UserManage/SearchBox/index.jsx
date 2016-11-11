import React from 'react'
import common from 'public/common'
import classNames from 'classnames'
import './index.less'

export default React.createClass({
	getInitialState() {
		return {
			//监控空格编码
	    isSpace: false,
	    // 模糊搜索
	    searchValue: '',

	    chooseBoolean: false,
		}
		
	},

	myKeyPress(ev) {
    if (ev.charCode == 32) {
      this.setState({
        isSpace: true,
      })
    } else {
      this.setState({
        isSpace: false,
      })
    }
  },

  // 模糊搜索
  searchChange(ev) {
    let oldName = this.state.searchValue
    let currentName = ev.target.value

    // 下拉框
    if (ev.target.value) {
      this.setState({
        chooseBoolean: true
      })
    } else {
      this.setState({
        chooseBoolean: false
      })
    }

    //切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(currentName) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      currentName = common.replaceSpace(currentName)
    }
    this.setState({
      searchValue: currentName
    })
  },

  searchBtnClick(str) {
  	this.props.callBackFn(this.state.searchValue, str)
  },

  handleWindowClick() {
		this.setState({
  		chooseBoolean: false
  	})
  },

  componentDidMount() {
  	window.addEventListener('click', this.handleWindowClick, false)
  },

  componentWillUnmount() {
  	window.removeEventListener('click', this.handleWindowClick, false)
  },

	render() {
		return (
			<div className="pull-right clearfix search-box">
				<div className="pull-left search-con-box">
					<p className="search-con">
	          <i className="fa fa-search"></i>
	          <input type="text" value={this.state.searchValue} onKeyPress={ this.myKeyPress } onChange={this.searchChange} placeholder="请输入名称进行搜索" />
	        </p>
	        <div className={classNames('search-choose', {'choose-boolean': this.state.chooseBoolean})}>
	        	<ul>
              <li onClick={this.searchBtnClick.bind(this, 'u.NAME')}>
                <div>
                  <span>用户名：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
              <li onClick={this.searchBtnClick.bind(this, 'u.LOGIN_ID')}>
                <div>
                  <span>登录名：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
              <li onClick={this.searchBtnClick.bind(this, 'd.NAME')}>
                <div>
                  <span>部&nbsp;&nbsp;&nbsp;&nbsp;门：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
              <li onClick={this.searchBtnClick.bind(this, 'r.NAME')}>
                <div>
                  <span>岗&nbsp;&nbsp;&nbsp;&nbsp;位：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
              <li onClick={this.searchBtnClick.bind(this, 'u.EMAIL')}>
                <div>
                  <span>邮&nbsp;&nbsp;&nbsp;&nbsp;箱：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
            </ul>
	        </div>
				</div>
        <input onClick={this.searchBtnClick.bind(this, 'u.NAME')} className="pull-right search-btn" type="button" value="搜索" />
      </div>
		)
	}
})