import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import xhr from 'bfd-ui/lib/xhr'
import Input from 'bfd-ui/lib/Input'
import formatTool from "public/formatTool.js"
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Select, Option } from 'bfd-ui/lib/Select'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import _ from 'underscore'
import './index.less'
import 'public/buttons.css'
export default React.createClass({
  formData:{},
  seachArr:[],
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
        title: '申请人',
        order: true,
        key: 'name'
      },
      {
        title: '申请权限',
        order: true,
        key: 'proname'
      },
      {
        title: '权限说明',
        order: true,
        key: 'desc'
      },
      {
        title: '是否审批',
        order: true,
        key: 'status',
        render: (row, item) => {
          let html ="";
          if(item.status == 1){
            html = <div className="public-status"><span className="on">审批通过</span></div>
          }else if (item.status == -1){
            html = <div className="public-status"><span className="off">审批驳回</span></div>
          }
          else{
            html = <div className="public-status"><span className="off">未审批</span></div>
          }
          return html
        }
      },
      {
        title: '操作',
        width: '250px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall" style={{height: '60px',padding:"13px 0px"}}>
            <button className="btn  btn-hover btn-info"  data-key="pass"  onClick = {this.TableEditClick.bind(this,row, item)} title="通过申请" >
              <span>通过申请</span>
              <Icon type="check"></Icon>
            </button>
            <button className="btn  btn-hover btn-warning"   data-key="back"   onClick = {this.TableEditClick.bind(this,row, item)} title="驳回申请">
              <span>驳回申请</span>
              <Icon type="remove"></Icon>
            </button>
          </div>

          return html
        },
        order: false
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
    tableData:[
      {id:"1",name:"张三",proname:"Owner",desc:"组织的拥有者，超级管理员有且仅有一个。",status:1},
      {id:"2",name:"李四",proname:"管理员",desc:"普通管理员，用于协助Owner管理组织。",status:-1},
      {id:"3",name:"王五",proname:"项目负责人",desc:"可以创建项目，并管理项目。",status:1},
      {id:"4",name:"王宝强",proname:"管理员",desc:"普通管理员，用于协助Owner管理组织。",status:0}
    ],
    PageRow:10,
    dataMap:["name"]
  },
  componentDidMount(){

  } ,
  handleSave() {
    console.log(this.formData)
    this.refs.form.save()
    if(this.formData.domain){
      this.handleSuccess({rec:1});
    }
  },
  handleSuccess(res) {
    console.log(res)
  },
  TableEditClick(row,item,e){
    const  btn = e.target.parentNode;
    const  key = btn.dataset.key
    if (key=== "pass"){
      confirm('确认通过该用户的申请吗？', () => {
        console.log(1)
      })
    }else if (key === "back"){
      this.refs.back.open();
    }
  },
  TablePageChange(page){
    this.state.currentPage = page
    this.setState(this.state);
  },
  TableSeachClick(){
    const seachObj=[];
    const status = $("#status").find("li.select").attr("value");
    const proname = $("#proname").find("li.select").attr("value");
    const name = $("#name").val();
    if (status != undefined){
      seachObj.push({"name":"status", "value": status})
    }
    if (proname != undefined){
      seachObj.push({"name":"proname", "value":proname})
    }
    if (name !== ""){
      seachObj.push({"name":"name", "value":name})
    }
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
              <h2>组织申请审批</h2>
              <h5>查看,审批申请</h5>
            </div>
            <div className= "informationPanel">
              <div className="panel-body">
                <div className="tableTools" >
                  <lable>审批状态：</lable>
                  <Select name="status" id="status">
                    <Option>全部</Option>
                    <Option value="1">审批通过</Option>
                    <Option value="-1">审批驳回</Option>
                    <Option value="0">未审批</Option>
                  </Select>
                  <lable>申请人：</lable>
                  <Input  placeholder="申请人" name = "name" id="name"  data-key="domain"/>
                  <Button icon="search"  type="button" onClick={this.TableSeachClick}>查询</Button>
                </div>
                <DataTable
                    data={this.TableData}
                    onPageChange={this.TablePageChange}
                    showPage="true"
                    column={tableControl.column}
                    howRow={tableControl.PageRow}
                    //onRowClick={this.handleRowClick}
                    onOrder={this.TableOrder}
                    className="public-table marginT20"
                    id ="authentication"
                    >
                </DataTable>
              </div>

              <Modal ref="back" lock>
                <ModalHeader >
                  <h4 className="modal-title">驳回申请</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="驳回理由" required name="reason" help="500个字符以内">
                      <FormTextarea   style={{resize:"none",height:"200px"}}></FormTextarea>
                    </FormItem>

                    <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
                    <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
                  </Form>
                </ModalBody>
              </Modal>

            </div>
          </div>
        </div>
    )
  }
})
