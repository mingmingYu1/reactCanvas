import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Row, Col } from 'bfd-ui/lib/Layout'
import xhr from 'bfd-ui/lib/xhr'
import Input from 'bfd-ui/lib/Input'
import formatTool from "public/formatTool.js"
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormInput from 'bfd-ui/lib/FormInput'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import {  Radio } from 'bfd-ui/lib/Radio'
import { Steps, Step } from 'bfd-ui/lib/Steps'
import './index.less'
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
        title:'选择',
        key: 'id',
        order: false,
        render:(item, component)=> {
          return  <div className='bfd-radio'>
                <label>
                  <input type="radio"  name= "rowRadio" value={component .id} onClick={this.TableRadioClick}/>
                  <span className="status"></span>
                </label>
              </div>
        }
      },
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
      current:0,
      currentPage:1,
      seach:[],
      order:{}
    }
  },
  TableData:{
    totalList:[],
    currentPage: 1,
    totalPageNum:0
  },
  PageControl:{
    tableData:[{id:"1",name:"wfd",desc:"万分点",domain:"www.wanfendian.com"},{id:"2",name:"qfd",desc:"千分点",domain:"www.qianfendian.com"}],
    PageRow:10,
    dataMap:["name"]
  },
  componentDidMount(){
    if (this.state.current== 0){
      $("#lastStep").attr("disabled",true)
      $("#nextStep").attr("disabled",true)
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
      $(".stepBox").addClass("hidden");
      $("#step"+value).removeClass("hidden");
      $("#lastStep").removeAttr("disabled")
      $("#nextStep").attr("disabled",true)
      this.state.current = value;
      if (value == 2){
        $(".btn-circle").hide();
        this.handleSave();
      }
      this.setState(this.state);
    }

  },
  handleInputChange(fromData){
    if (fromData.reason !==""){
      $("#nextStep").removeAttr("disabled")
    }else{
      $("#nextStep").attr("disabled",true)
    }
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
  TableRadioClick(e){
    if($("[name=rowRadio]:checked")){
      this.formData.id= $("[name=rowRadio]:checked").val();
      $("#nextStep").removeAttr("disabled")
    }else{
      $("#nextStep").attr("disabled",true)
    }
  },
  TableSeachClick(){
    const seachObj=[];
    $(".tableTools input").each(function(i,obj) {
          if(obj.value !== ""){
            seachObj[i] = {"name":$(obj).data("key"), "value": obj.value}
          }
        }
    )
    if (seachObj !== this.state.seach){
      this.state.seach = seachObj
      this.setState(this.state);
    }
  },
  TableOrder(name, sort){
    this.state.order = {field: name, type: sort}
    this.setState(this.state);
  },
  render() {
    const tableControl = this.PageControl;
    this.TableData = _table.updateDataTable(this.PageControl,this.state)
    return (
        <div className="main-box">
          <div className="Container orgbox">
            <div>
              <h2>加入组织</h2>
              <h5>加入已存在的组织</h5>
            </div>
            <div className= "informationPanel" id="addOrg">
              <div className="panel-body listRow">
                <Steps onStepClick={this.handleStepClick} className="bfd-steps public-steps" height={70} current={this.state.current}>
                  <Step title="选择组织" />
                  <Step title="发送申请" />
                  <Step title="等待审批" />
                </Steps>
                <div className= "content-box" >
                  <div id= "step0" className="stepBox">
                    <h3 className="title-bule">第一 步：选择要加入的组织</h3>
                    <div  className="content-body" >
                      <div className="public-Prompt warning margiB10 hidden">
                        <Icon type="remove" className="TipsBtn"></Icon>
                        <div className="TipsText">
                          <h3>错误提示：</h3>
                          <p>请选择要加入的组织！</p>
                        </div>
                      </div>
                      <div className="tableTools" >
                        <Input  placeholder="组织代号"  data-key="name"/>
                        <Input  placeholder="组织名称"  data-key="desc" />
                        <Input  placeholder="组织域名"  data-key="domain"/>
                        <Button icon="search"  type="button" onClick={this.TableSeachClick}>查询</Button>
                      </div>

                      <DataTable
                          data={this.TableData}
                          showPage="false"
                          column={tableControl.column}
                          onOrder={this.TableOrder}
                          className="public-table marginT20"
                          >
                      </DataTable>

                    </div>
                  </div>
                  <div id= "step1" className="stepBox hidden">
                    <h3 className="title-bule" style={{background:"#38AFBB"}}>第二步：发送审批申请</h3>
                    <div  className="content-body" >
                      <Form
                          ref="form"
                          action="/api/form"
                          data={this.formData}
                          rules={this.rules}
                          onChange= {this.handleInputChange}
                          onSuccess={this.handleSuccess}
                          >
                        <FormItem label="申请理由" required name="reason" help="500个字符以内">
                          <FormTextarea   style={{resize:"none",height:"200px"}}></FormTextarea>
                        </FormItem>
                      </Form>

                    </div>

                  </div>

                  <div id= "step2" className="stepBox hidden">
                    <h3 className="title-bule" style={{background:"#38BB66"}}>第三步：等待管理员审批</h3>
                    <div  className="content-body" >
                      <div className="public-Prompt success ">
                        <Icon type="check" className="TipsBtn"></Icon>
                        <div className="TipsText">
                          <h3>申请成功：</h3>
                          <p>您的申请已经提交成功！请您耐心等待组织管理员的答复，答复结果会以邮件的形式发送到您的注册邮箱</p>
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
