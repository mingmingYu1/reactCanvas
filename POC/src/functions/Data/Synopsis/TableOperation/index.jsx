import React from 'react'
import ShareModal from 'public/ShareModal'
import message from 'bfd/message'
import xhr from 'public/xhr'
import classNames from 'classnames'
import ajaxUrl from 'public/url'
import Env from '../../../../env.js'
import './index.less'

export default React.createClass({

	getInitialState() {
		return {
			data: this.props.data
		}
	},

	handleShareModalCancel() {
		this.props.showModal()
	},

	//收藏
	handleCollection() {
		xhr({
			type: 'get',
			url: ajaxUrl.QUERY_SYNOPSIS_COLLECTION + '?id=' + this.props.data.id,
			success: (result) => {
				if (result.flag) {
					// if (result.message == '不能重复收藏') {
					// 	message.success('不能重复收藏')
					// } else {
					// 	message.success('收藏成功')
					// }
					message.success('收藏成功')
					let itemData = this.state.data
					itemData.isCollect = true
					this.setState({
						data: itemData
					})
				} else {
					message.success('收藏失败，请重新收藏！')
				}
			}
		})
	},

	componentDidMount() {

	},

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data
		})
	},

	render() {
		return (
			<div className="row synopsis-article-operation">
        <div onClick={this.handleDownload} className="col-md-4">
          <a download href={Env.baseUrl + "/doc/download?id=" + this.props.data.id}  className="fa fa-download"></a>
          <span className="operation-tips">下载</span>
        </div>
        <div onClick={this.handleCollection} className="col-md-4">
          <i className={classNames({"fa fa-heart": true, "is-collect": this.state.data.isCollect})}></i>
          <span className="operation-tips">收藏</span>
        </div>
        <div className="col-md-4" onClick={this.props.showModal}>
          <i className="fa fa-share-alt"></i>
          <span className="operation-tips">分享</span>
        </div>
      </div>
		)
	}
})