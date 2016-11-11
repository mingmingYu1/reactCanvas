import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import xhr from 'bfd-ui/lib/xhr'
import Input from 'bfd-ui/lib/Input'
import { Row, Col } from 'bfd-ui/lib/Layout'
import SearchInput from 'bfd-ui/lib/SearchInput'
import formatTool from "public/formatTool.js"
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Select, Option } from 'bfd-ui/lib/Select'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import _ from 'underscore'
import './index.less'
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
        title: '用户名称',
        order: true,
        key: 'name'
      },
      {
        title: '邮箱',
        order: true,
        key: 'email'
      },
      {
        title: '联系电话',
        order: true,
        key: 'phone'
      },
      {
        title: '组织名称',
        order: true,
        key: 'orgName'
      },
      {
        title: '操作',
        width: '200px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall">
            <Icon type="user" className="public-rowbtnIcon Bcolor_darkcyan" onClick = {this.TableEditClick.bind(this,row, item)} data-key="admin" title="设置为项目负责任"></Icon>
            <Icon type="trash-o" className="public-rowbtnIcon Bcolor_orange" onClick = {this.TableEditClick.bind(this, row,item)} data-key="del" title="删除组织成员"></Icon>
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
      {id:"1",name:"张三",email:"1126787608@qqq.com",phone:"18739928719",orgName:"百分点",desc:"管理员,项目负责任",status:1},
      {id:"2",name:"李四",email:"1126787608@qqq.com",phone:"18739928719",orgName:"百分点",desc:"管理员",status:0},
      {id:"3",name:"王五",email:"1126787608@qqq.com",phone:"18739928719",orgName:"百分点",desc:"项目成员",status:1},
      {id:"4",name:"王宝强",email:"1126787608@qqq.com",phone:"18739928719",orgName:"百分点",desc:"组织Owner",status:0}
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
    const  btn = e.target;
    const  key = btn.dataset.key
    if (key=== "admin"){
      confirm('确认设置该用户为管理员吗？', () => {
        console.log(1)
      })
    }else if (key === "project"){
      this.refs.project.open();
    }else if (key === "del"){
      confirm('确认删除该用户吗？', () => {
        console.log(1)
      })
    }
  },
  TableAddProjectUser(){
    this.refs.projectUser.open();
  },
  TablePageChange(page){
    this.state.currentPage = page
    this.setState(this.state);
  },
  TableSeachChange(val){
    if (val == ""){
      this.TableSeachClick(val);
    }
  },
  TableSeachClick(value){
    if (value !== this.state.seach){
      this.state.seach = value
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
              <h2>项目管理</h2>
              <h5>管理项目人员,添加,删除和设置管理员</h5>
            </div>
            <div className= "informationPanel">
              <div className="panel-body">
                <div className="tools">
                  <lable>项目名称：</lable>
                  <Select name="proname" id="proname" searchable style={{width:"400px"}}>
                    <Option>全部</Option>
                    <Option value="数据仓库">数据仓库</Option>
                    <Option value="bdi">bdi</Option>
                    <Option value="探头管理">探头管理</Option>
                    <Option value="id拉通">id拉通</Option>
                  </Select>
                </div>
                <div className="projectBox" style={{background: "aliceblue"}}>
                  <h4>项目基础信息</h4>
                  <Row gutter>
                    <Col col="sm-3"> 项目名称 </Col>
                    <Col col="sm-8">数据仓库 </Col>
                  </Row>
                  <Row gutter>
                    <Col col="sm-3"> 组织介绍 </Col>
                    <Col col="sm-8"> 这是一个项目，有收到粉红色的开发的数据库分客户端是粉红色的粉红色的福建省</Col>
                  </Row>
                </div>
                <div className="projectBox" style={{background: "#FBFBFB"}}>
                  <h4>项目用户列表</h4>
                <div className="tableTools" >
                  <lable>成员名称：</lable>
                  <SearchInput placeholder="请输入成员名称" className="seachInput " size="sm" onSearch={this.TableSeachClick} onChange={this.TableSeachChange} />
                  <Button icon="plus" className="pull-right" onClick={this.TableAddProjectUser} >添加项目成员</Button>
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
                    >
                </DataTable>
                </div>
              </div>

              <Modal ref="projectUser" lock>
                <ModalHeader >
                  <h4 className="modal-title">添加项目成员</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="选择组织成员" required name="user" >
                      <Select searchable style={{width:"300px"}}>
                        <Option>请选择</Option>
                        <Option value="0">张三</Option>
                        <Option value="1">李四</Option>
                        <Option value="2">王二麻子</Option>
                      </Select>
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
