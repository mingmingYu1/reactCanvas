import './index.less'

import React from 'react'
import { Link } from 'react-router'
import { Form, FormItem } from 'bfd/Form'
import FormInput from 'bfd/FormInput'
import FormTextarea from 'bfd/FormTextarea'
import { FormSelect, Option } from 'bfd/FormSelect'
import message from 'bfd/message'
import DatePicker from 'bfd/DatePicker'
import Button from 'bfd/Button'
import xhr from 'public/xhr'
import URL from 'public/url'

const SeekDoc = React.createClass({
    getInitialState() {
		this.rules = {
			name(v) {
				if (!v) return '请填写任务名称'
			},
			date(v) {
				if (!v) return '日期不能为空'
				if(v < new Date().getTime()) return '截止日期不应该早于当前日期'
			},
			contacts(v) {
				if (!v) return '请输入联系人'
			},
			contactWay(v) {
				if (!v) return '请输入联系方式'
			}
		}
		return {
			formData: {}
		}
},

handleDateSelect(date) {
	const formData = this.state.formData
	formData.date = date
	this.setState({
		formData
	})
},

handleSave() {
	this.refs.form.save()
},

handleSuccess(res) {
	message.success('保存成功！')
	this.props.history.replaceState(null,'/data/dashboard')
},
  render() {
  	const { formData } = this.state
  	return (
      <div className="seek-doc mw-box">
        <h5 style={{marginBottom:'10px'}}>个人空间&nbsp;&gt;&nbsp;点题需求&nbsp;&gt;&nbsp;发布点题</h5>
        <div className="bg-white seek-doc-box">
          <h3 className="top-title">发布点题</h3>
	      <Form ref="form" action={URL.DOC_SAVE_NEED_DOCS} data={formData} rules={this.rules} onSuccess={this.handleSuccess}>
	        <FormItem label="任务名称" required name="name">
	          <FormInput style={{width: '200px'}}></FormInput>
	        </FormItem>	        
	        <FormItem label="截止时间" name="endTime" required name="date">
	          <DatePicker style={{marginRight: '10px',width:'200px'}} date={formData.date} onSelect={this.handleDateSelect} />
	        </FormItem>
	        <FormItem label="联系人" required name="contacts">
	          <FormInput style={{width: '200px'}}></FormInput>
	        </FormItem>
	        <FormItem label="联系方式" required name="contactWay">
	          <FormInput style={{width: '200px'}}></FormInput>
	        </FormItem>
	        <FormItem label="任务描述" name="desc">
	          <FormTextarea></FormTextarea>
	        </FormItem>
	        <Button style={{marginLeft: '100px'}} onClick={this.handleSave}>发布点题</Button>
	        <Link to="/data/dashboard" style={{marginLeft: '20px'}}>
	        	<Button type="minor">取消</Button>	        
	        </Link>
	      </Form>
        </div>
      </div>
    )
  }
})

export default SeekDoc