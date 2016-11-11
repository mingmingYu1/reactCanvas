import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Row, Col } from 'bfd-ui/lib/Layout'
import xhr from 'bfd-ui/lib/xhr'
import formatTool from "public/formatTool.js"
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormInput from 'bfd-ui/lib/FormInput'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import { Steps, Step } from 'public/wizard'
import '../index.less'
export default React.createClass({
  formData:{},
  getInitialState() {
    this.rules = {
      name(v) {
        if (!v) return '请填写组织代号'
      },
      desc(v) {
        if (!v) return '请填写组织名称'
      },
      domain(v) {
        if (!v) return '请填写组织域名'
      }
    }
    this.PageControl.column = [
      {
        title: '组织代号',
        order: true,
        key: 'name'
      },
      {
        title: '中文名称',
        order: true,
        key: 'desc'
      },
      {
        title: '组织域名',
        order: true,
        key: 'domain'
      }]

    return {
      current:0
    }
  },
  PageControl:{
    tableData:{ "totalList":[{name:"wfd",desc:"万分点",domain:"www.wanfendian.com"},{name:"qfd",desc:"千分点",domain:"www.qianfendian.com"}]},
    PageRow:10,
    dataMap:["name"]
  },
  componentDidMount(){
    "use strict";
   if (this.state.current== 0){
      $("#lastStep").attr("disabled",true)
    }
  } ,
  lastStepClick(e){
    if (!$("#lastStep").attr("disabled")){
      let value = this.state.current - 1;
      $(".stepBox").addClass("hidden");
      $("#step"+value).removeClass("hidden");
      if (value == 0){
        $("#lastStep").attr("disabled",true)
        $("#nextStep").removeAttr("disabled")
      }
      this.setState({
        current: value
      })
    }

  },
  nextStepClick(e){
    if (!$("#nextStep").attr("disabled")){
      let value = this.state.current + 1

      if(value == 1){
        this.handleSave();
      }else{
        $(".stepBox").addClass("hidden");
        $("#step"+value).removeClass("hidden");
        $("#lastStep").removeAttr("disabled")
        $("#nextStep").attr("disabled",true)
        this.setState({
          current: value
        })
      }

    }

  },
  handleInputChange(e){
    const input = e.target;
    this.formData[input.name] = input.value;
  },
  handleSave() {
    console.log(this.formData)
    this.refs.form.save()
    if(this.formData.domain){
      this.handleSuccess({rec:1});
    }
  },

  handleSuccess(res) {
    console.log(res)
    $(".stepBox").addClass("hidden");
    $("#step1").removeClass("hidden");
    $("#lastStep").removeAttr("disabled")
    $("#nextStep").attr("disabled",true)
    if(res.rec == 0){
      $("#AddSuccess").hide()
    }else{
      $("#AddErrow").hide()
      $("#nextStep").removeAttr("disabled")
    }
    this.setState({
      current: 1
    })
  },
  render() {
    const tableControl = this.PageControl;
    return (
        <div className="main-box">
          <div className="Container orgbox">
            <div>
              <h2>新建组织</h2>
              <h5>创建一个全新的组织</h5>
            </div>
            <div className= "informationPanel" id="addOrg">
              <div className="panel-body listRow">
                <Steps  current={this.state.current}>
                  <Step title="填写组织信息" smalltitle="填写组织基本信息" />
                  <Step title="确认信息" smalltitle="确认组织信息是否重复"/>
                  <Step title="完成" smalltitle="完成创建"/>
                </Steps>
                <div className= "content-box" >
                  <div id= "step0" className="stepBox">
                  <h3 className="title-bule">第一 步：填写组织基本信息</h3>
                    <div  className="content-body" >
                      <Form
                          ref="form"
                          action="/api/form"
                          data={this.formData}
                          rules={this.rules}
                          onSuccess={this.handleSuccess}
                          className="public-from"
                          >
                        <FormItem label="组织代号" required name="name" help=" 仅支持字符格式,长度不超过35">
                          <FormInput style={{width: '200px'}}></FormInput>
                        </FormItem>
                        <FormItem label="组织名称" required name="desc">
                          <FormInput style={{width: '200px'}}></FormInput>
                        </FormItem>
                        <FormItem label="组织域名" required  name="domain">
                          <FormInput style={{width: '200px'}}></FormInput>
                        </FormItem>
                      </Form>
                      </div>
                  </div>
                  <div id= "step1" className="stepBox hidden">
                    <h3 className="title-bule" style={{background:"#38AFBB"}}>第二步：确认组织信息是否重复</h3>
                    <div  className="content-body" >
                      <div id="AddErrow">
                        <div className="public-Prompt warning">
                          <Icon type="remove" className="TipsBtn"></Icon>
                          <div className="TipsText">
                            <h3>警告提示：</h3>
                            <p>已经检索到可能重复的组织信息如下，请勿重复创建重复的组织</p>
                          </div>
                        </div>
                        <DataTable
                            data={tableControl.tableData}
                            showPage="false"
                            column={tableControl.column}
                            className="public-table marginT20"
                            >
                        </DataTable>
                      </div>
                      <div id="AddSuccess">
                        <div className="public-Prompt checkok ">
                          <Icon type="heart" className="TipsBtn"></Icon>
                          <div className="TipsText">
                            <h3>检测完成：</h3>
                            <p>当前不存在同名组织,点击下一步完成创建！</p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  <div id= "step2" className="stepBox hidden">
                    <h3 className="title-bule" style={{background:"#38BB66"}}>第三步：完成创建</h3>
                    <div  className="content-body" >
                      <div className="public-Prompt success ">
                        <Icon type="check" className="TipsBtn"></Icon>
                        <div className="TipsText">
                          <h3>创建成功：</h3>
                          <p>您的组织已经创建成功！你是这个组织的所有者，您可以点击这里<a href="/OrgManager/MyOrg" title="查看组织">查看组织</a>，或点击这里<a href="/OrgManager/MyOrg" title="管理组织">管理组织</a></p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="margin20">
                  <Button   id="lastStep"  className="pull-left btn-circle" onClick={this.lastStepClick}>上一步</Button>
                  <Button  id="nextStep"  className="pull-right btn-circle" onClick={this.nextStepClick}>下一步</Button>
                </div>

              </div>
            </div>
          </div>
        </div>
    )
  }
})
