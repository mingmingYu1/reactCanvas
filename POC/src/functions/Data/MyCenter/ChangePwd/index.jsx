import './index.less'

import React from 'react'
import { Form, FormItem } from 'bfd/Form'
import FormInput from 'bfd/FormInput'
import message from 'bfd/message'
import Button from 'bfd/Button'
import URL from 'public/url'
import auth from 'public/auth'

export default React.createClass({
  getInitialState() {
    this.rules = {
      oldPwd(v) {
        if(!v) return '原始密码不能为空'
      },
      newPwd(v) {
        if (!v) return '新密码不能为空'
        if(v.length < 6 || /^[a-z]*$/g.test(v) || /^[A-Z]*$/g.test(v) || /^\d*$/g.test(v)) return '密码应为6位以上的数字、符号、字母组合'
      },
      repwd(v){
      //  if(v !== newPwd) return '两次新密码输入不一致'
      }
    };
    return {
      formData: {
        id: auth.user.id,

      },
      error:"",
    }
  },

  handleDateSelect(date) {
    const formData = this.state.formData
    formData.date = date
    this.setState({ formData })
  },

  handleSave() {
    if(this.refs.form.validate()){
      this.refs.form.save()
    } 
  },
  handleChange(data){
    if(data.repwd !== data.newPwd){
      this.setState({error:"error"})
    }else{
      this.setState({error:""})
    }
  },
  handleSuccess(res) {
    if(res.flag){
      message.success(res.message+"!")
    }else{
      message.success(res.message+"!")
    }
  },

  render() {

  	const { formData } = this.state
    return (
    	<div className="chnge-pwd ">
        <div><h5>修改密码</h5></div>
          <Form className="col-md-8 form"
            ref="form" 
            action={URL.QUERY_PERSONAL_MODIFYPWD}
            data={formData} 
            rules={this.rules} 
            onSuccess={this.handleSuccess}
            onChange={this.handleChange}
          >
            <FormItem label="原始密码" required name="oldPwd" help="">
              <FormInput type="password" style={{width: '200px'}}></FormInput>
            </FormItem>  
            <FormItem label="新密码" required name="newPwd" help="">
              <FormInput type="password" style={{width: '200px'}}></FormInput>
            </FormItem>   
            <FormItem label="确认新密码" required name="repwd" help="">
              <FormInput type="password" style={{width: '200px'}}></FormInput>
              <div className={"tip add-tip "+this.state.error}>
                <span className="glyphicon glyphicon-exclamation-sign"></span>
                <span>两次新密码输入不一致</span>
              </div>
            </FormItem>     
            <Button className="btn-save" type="primary" style={{marginLeft: '100px'}} onClick={this.handleSave}>保存</Button>
        </Form>
    		
    	</div>      
    )
  }
})