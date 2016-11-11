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
import { Select, Option } from 'bfd-ui/lib/Select'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import {  Radio } from 'bfd-ui/lib/Radio'
import confirm from 'bfd-ui/lib/confirm'
import './index.less'
import 'public/buttons.css'
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
        title: '权限名称',
        order: true,
        key: 'name'
      },
      {
        title: '权限说明',
        order: true,
        key: 'desc'
      },
      {
        title: '状态',
        order: true,
        key: 'status',
        render: (row, item) => {
          let html ="";
          if(item.status){
            html = <div className="public-status"><span className="on">拥有权限</span></div>
          }else{
            html = <div className="public-status"><span className="off">暂无权限</span></div>
          }
          return html
        }
      },
      {
        title: '操作',
        width: '400px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall" style={{height: '60px',padding:"13px 0px"}}>
            <button className="btn  btn-hover btn-warning"  data-key="attorn"  onClick = {this.TableEditClick.bind(this,row, item)} title="转让权限" >
              <span>转让权限</span>
              <Icon type="random"></Icon>
            </button>
            <button className="btn  btn-hover btn-primary"  data-key="apply"  onClick = {this.TableEditClick.bind(this,row, item)} title="申请权限">
              <span >申请权限</span>
              <Icon type="hand-paper-o"></Icon>
            </button>
            <button className="btn btn-hover btn-danger" data-key="delete"  onClick = {this.TableEditClick.bind(this,row, item)} title="放弃权限">
              <span >放弃权限</span>
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
      {id:"1",name:"Owner",desc:"组织的拥有者，超级管理员有且仅有一个。",status:1},
      {id:"2",name:"管理员",desc:"普通管理员，用于协助Owner管理组织。",status:0}
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
    const  btn =e.target.parentNode;
    const  key = btn.dataset.key
    if (key=== "attorn"){
      this.refs.attorn.open();
    }else if (key === "apply"){
      this.refs.apply.open();
    }else{
      confirm('确认删除吗', () => {
        console.log(1)
      })
    }
  },
  render() {
    const tableControl = this.PageControl;
    this.TableData = _table.updateDataTable(this.PageControl,this.state)
    return (
        <div className="main-box">
          <div className="Container orgbox">
            <div>
              <h2>我的权限</h2>
              <h5>查看，管理我的组织权限</h5>
            </div>
            <div className= "informationPanel">
              <div className="panel-body">
                  <DataTable
                      data={this.TableData}
                      showPage="false"
                      column={tableControl.column}
                      onOrder={this.TableOrder}
                      className="public-table marginT20"
                      id="authority"
                      >
                  </DataTable>
              </div>

              <Modal ref="attorn" lock>
                <ModalHeader >
                  <h4 className="modal-title">转让权限</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="接收人" required name="name">
                        <Select searchable style={{width:'200px'}}>
                          <Option>请选择</Option>
                          <Option value="0">张三</Option>
                          <Option value="1">李四</Option>
                          <Option value="2">王二</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="转让理由" required name="reason" help="500个字符以内">
                      <FormTextarea   style={{resize:"none",height:"200px"}}></FormTextarea>
                    </FormItem>

                    <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
                    <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
                  </Form>
                </ModalBody>
              </Modal>

              <Modal ref="apply" lock>
                <ModalHeader >
                  <h4 className="modal-title">申请权限</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="申请理由" required name="reason" help="500个字符以内">
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
