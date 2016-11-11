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
        title: '组织成员',
        order: true,
        key: 'name'
      },
      {
        title: '组织名称',
        order: true,
        key: 'proname'
      },
      {
        title: '所属权限',
        order: true,
        key: 'desc'
      },
      {
        title: '操作',
        width: '200px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall">
            <Icon type="user" className="public-rowbtnIcon Bcolor_darkcyan" onClick = {this.TableEditClick.bind(this,row, item)} data-key="admin" title="设置为管理员"></Icon>
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
      {id:"1",name:"张三",proname:"百分点",desc:"管理员,项目负责任",status:1},
      {id:"2",name:"李四",proname:"百分点",desc:"管理员",status:0},
      {id:"3",name:"王五",proname:"百分点",desc:"项目成员",status:1},
      {id:"4",name:"王宝强",proname:"百分点",desc:"组织Owner",status:0}
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
  TablePageChange(page){
    this.state.currentPage = page
    this.setState(this.state);
  },
  TableSeachClick(){
    const seachObj=[];
    const desc = $("#desc").find("li.select").attr("value");
    const name = $("#name").val();
    if (desc != undefined){
      seachObj.push({"name":"desc", "value": desc})
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
              <h2>权限分配</h2>
              <h5>查看组织成员,分配权限</h5>
            </div>
            <div className= "informationPanel">
              <div className="panel-body">
                <div className="tableTools" >
                  <lable>拥有权限：</lable>
                  <Select name="desc" id="desc" >
                    <Option>全部</Option>
                    <Option value="Owner">Owner</Option>
                    <Option value="管理员">管理员</Option>
                    <Option value="项目负责人">项目负责人</Option>
                    <Option value="项目成员">项目成员</Option>
                  </Select>
                  <lable>成员名称：</lable>
                  <Input  placeholder="成员名称" name = "name" id="name"  data-key="domain"/>
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
                    >
                </DataTable>
              </div>

              <Modal ref="project" lock>
                <ModalHeader >
                  <h4 className="modal-title">设置项目负责人</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={this.formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="选择项目" required name="reason" >
                      <Select searchable>
                        <Option>请选择</Option>
                        <Option value="0">探头管理</Option>
                        <Option value="1">BDI本地化</Option>
                        <Option value="2">数据仓库</Option>
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
