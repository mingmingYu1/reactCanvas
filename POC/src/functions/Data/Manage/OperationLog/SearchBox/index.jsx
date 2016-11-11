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

    // 切换中文输入时候不会进入keypress事件
    if (this.state.isSpace && oldName == common.replaceSpace(currentName) ) {
      this.setState({
        isSpace: false
      })
    }
    if (this.state.isSpace) {
      currentName = common.replaceSpace(currentName)
    }

    // 下拉框显示
    if (currentName) {
      this.setState({
        chooseBoolean: true
      })
    } else {
      this.setState({
        chooseBoolean: false
      })
    }

    this.setState({
      searchValue: currentName
    })
  },

  // 下拉框选择
  chooseBtnClick(str, ev) {
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
	        		<li onClick={this.chooseBtnClick.bind(this, 'user_name')}>
                <div>
                  <span>用&nbsp;&nbsp;户&nbsp;&nbsp;名：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
	        		<li onClick={this.chooseBtnClick.bind(this, 'login_name')}>
                <div>
                  <span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
	        		<li onClick={this.chooseBtnClick.bind(this, 'option_type')}>
                <div>
                  <span>操作类型：</span>
                  <span>{this.state.searchValue}</span>
                </div>
              </li>
	        		<li onClick={this.chooseBtnClick.bind(this, 'option_model')}>
                <div>
                  <span>操作模块：</span>
                  <span>{this.state.searchValue}</span>
                </div> 
              </li>
	        	</ul>
	        </div>
				</div>
        <input onClick={this.chooseBtnClick.bind(this, 'user_name')} className="pull-right search-btn" type="button" value="搜索" />
      </div>
		)
	}
})