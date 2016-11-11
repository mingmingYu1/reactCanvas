import React from 'react'
import './index.less'

export default React.createClass({
  getInitialState() {
    return {
      searchValue: this.props.initialSearchValue
    }
  },

  inpClick(ev) {
    this.setState({
      searchValue: ev.target.value
    })
  },

  // 输入框focus
  handleFocus() {
    window.addEventListener('keydown', this.handleDocumentEnter, false)
  },

  handleBlur() {
    window.removeEventListener('keydown', this.handleDocumentEnter, false)
  },

  handleDocumentEnter(e) {
    if (e.keyCode == 13) {
      this.props.handleCallback(this.state.searchValue)
    }
  },

  handleClick() {
    this.props.handleCallback(this.state.searchValue)
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleDocumentEnter, false)
  },

	render() {
		return (
			<div className="synopsis-search">
        <input className="search-inp" value={this.state.searchValue} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.inpClick} type="text" placeholder="请输入要搜索的关键字" />
        <button onClick={this.handleClick} className="synopisis-search-btn">
          <i className="fa fa-search"></i>
          <span>搜索</span>
        </button>
      </div>
		)
	}
})