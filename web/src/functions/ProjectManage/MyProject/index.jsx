import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import xhr from 'bfd-ui/lib/xhr'
import Input from 'bfd-ui/lib/Input'
import FormInput from 'bfd-ui/lib/FormInput'
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
        title: '项目名称',
        order: true,
        key: 'name'
      },
      {
        title: '组织名称',
        order: true,
        key: 'orgName'
      },
      {
        title: '项目描述',
        order: true,
        key: 'desc'
      },
      {
        title: '项目Owner',
        order: true,
        key: 'owner'
      },
      {
        title: '创建时间',
        order: true,
        key: 'createTime'
      },
      {
        title: '操作',
        width: '200px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall">
            <Icon type="exchange" className="public-rowbtnIcon Bcolor_darkcyan " onClick = {this.TableEditClick.bind(this, row,item)} data-key="attorn" title="转让Owner"></Icon>
            <Icon type="edit" className="public-rowbtnIcon Bcolor_dodgerblue" onClick = {this.TableEditClick.bind(this, row,item)} data-key="edit" title="编辑"></Icon>
            <Icon type="trash-o" className="public-rowbtnIcon Bcolor_orange" onClick = {this.TableEditClick.bind(this, row,item)} data-key="del" title="删除"></Icon>
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
      {id:"1",name:"百分点探头系统",orgName:"佰分点",desc:"点探头系统管理员,项目负责任",createTime:"2016/7/13 14:36:18",owner:"zahng.xiaosaan"},
      {id:"2",name:"百分点BDI系统",orgName:"佰分点",desc:"BDI系统管理员",createTime:"2016/7/13 14:36:18",owner:"xia.dfdfv"},
      {id:"3",name:"采集系统",orgName:"佰分点",desc:"采集系统项目成员",createTime:"2016/7/13 14:36:18",owner:"dsdf.sdf"},
      {id:"4",name:"百分点探头系统",orgName:"佰分点",desc:"探头系统组织Owner",createTime:"2016/7/13 14:36:18",owner:"sfdf.sdss.sdfs"}
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
    if (key=== "attorn"){
      this.refs.attorn.open();
    }else if (key === "edit"){

      this.refs.editProject.open();
    }else if (key === "del"){
      confirm('确认删除该项目吗？', () => {
        console.log(1)
      })
    }
  },
  TableAddProject(){
    this.formData={};
    this.refs.addProject.open();
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
              <h2>我的项目</h2>
              <h5>查看或创建我的项目,添加删除项目成员或转让Owner</h5>
            </div>
            <div className= "informationPanel">
              <div className="panel-body">
                <div className="tableTools" >
                  <lable>项目名称：</lable>
                  <SearchInput placeholder="请输入项目名称" className="seachInput " size="sm" onSearch={this.TableSeachClick} onChange={this.TableSeachChange} />
                  <Button icon="plus" className="pull-right" onClick={this.TableAddProject} >创建项目</Button>
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

              <Modal ref="addProject" lock>
                <ModalHeader >
                  <h4 className="modal-title">修改项目</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="项目名称" required name="name" help="20个字符以内">
                      <FormInput style={{width: '200px'}}></FormInput>
                    </FormItem>
                    <FormItem label="项目描述" required name="desc" help="500个字符以内">
                      <FormTextarea   style={{resize:"none",height:"200px"}}></FormTextarea>
                    </FormItem>

                    <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
                    <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
                  </Form>
                </ModalBody>
              </Modal>

              <Modal ref="editProject" lock>
                <ModalHeader >
                  <h4 className="modal-title">修改项目</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="项目名称" required name="name" help="20个字符以内">
                      <FormInput style={{width: '200px'}}></FormInput>
                    </FormItem>
                    <FormItem label="项目描述" required name="desc" help="500个字符以内">
                      <FormTextarea   style={{resize:"none",height:"200px"}}></FormTextarea>
                    </FormItem>

                    <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
                    <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
                  </Form>
                </ModalBody>
              </Modal>

              <Modal ref="attorn" lock>
                <ModalHeader >
                  <h4 className="modal-title">转让项目</h4>
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
            </div>
          </div>
        </div>
    )
  }
})
