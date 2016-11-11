import React from 'react'
import DataTable from 'bfd/DataTable'
import { Modal, Button } from 'antd'
import classNames from 'classnames'
import message from 'bfd/message'
import TextOverflow from 'bfd/TextOverflow'
import SiteEditor from '../SiteEditor'
import xhr from 'public/xhr'
import URL from 'public/url'
import './index.less'

export default React.createClass({
  getInitialState() {
    return {
      // modal
      visible: false,

      // tips
      tipsShow: false,
      textareaValue: ''
    }
  },
  // modal
  showModal() {
    this.setState({
      visible: true,
    });
  },
  handleOk() {
    if (this.state.textareaValue) {
      this.setState({
        visible: false,
        tipsShow: false,
      });

      xhr({
        type: 'get',
        url: `${URL.NOTICE_ADD}?content=${this.state.textareaValue}`,
        success: (result) => {
          if (result.flag) {
            this.props.newCallBack()
          } else {
            alert('发布失败，请重新发布！')
          }
        }
      })
    } else {
      this.setState({
        tipsShow: true
      })
    }
    
  },
  handleCancel(e) {
    this.setState({
      visible: false
    });
  },

  // modal输入框
  editorCallBack(value) {
    this.setState({
      textareaValue: value
    })
  },
	render() {
    return (
      <div className="new-modal-box">
        <Button type="primary" onClick={this.showModal}>发布公告</Button>
        <Modal ref="modal"
          className="latest-modal-box"
          visible={this.state.visible}
          title="发布公告" onOk={this.handleOk} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
              发布
            </Button>,
          ]}
        >
          <div>
            <SiteEditor editorCallBack={this.editorCallBack} defaultValue=""></SiteEditor>
          </div>
          <div className={classNames({"modal-tips": true, "modal-tips-show": this.state.tipsShow})}>请输入内容！</div>
        </Modal>
      </div>
    )
	}
})