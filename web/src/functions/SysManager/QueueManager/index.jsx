import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import SearchInput from 'bfd-ui/lib/SearchInput'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import Switch from 'bfd-ui/lib/Switch'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import FormInput from 'bfd-ui/lib/FormInput'
import { FormSelect,Option } from 'bfd-ui/lib/FormSelect'
import { Select } from 'bfd-ui/lib/Select'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import confirm from 'bfd-ui/lib/confirm'
import xhr from 'bfd-ui/lib/xhr'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import './index.less'

const tableData={
  "totalList": [{
    "id": "1",
    "name": "队列1",
    "cpu": "5",
    ram:"1024",
    createTime:"2014-09-22"
  }, {
    "id": "1",
    "name": "队列1升水",
    "cpu": "5",
    ram:"1024",
    createTime:"2014-09-22"
  },  {
    "id": "1",
    "name": "队想列1",
    "cpu": "5",
    ram:"1024",
    createTime:"2014-09-22"
  },  {
    "id": "1",
    "name": "试试队列1",
    "cpu": "54",
    ram:"1024",
    createTime:"2014-09-22"
  },  {
    "id": "111",
    "name": "升水队列1",
    "cpu": "35",
    ram:"10234",
    createTime:"2014-09-22"
  }],
  "currentPage": 2,
  "totalPageNum": 11
}


export default React.createClass({
  formData:{name:"",time2:"天"},
  TableData:{
    totalList:[],
    currentPage: 1,
    totalPageNum:0
  },
  PageControl:{
    tableData:[],
    PageRow:10,
    dataMap:["name"]
  },
  getInitialState() {
    this.rules = {
      name(v) {
        if (!v) return '请填写名称'
      }
    }
    this.PageControl.column = [
      {
        title:'序号',
        key:'sequence'
      },{
        title: '队列名称',
        order: true,
        key: 'name'
      },
      {
        title: '内存',
        order: true,
        key: 'ram'
      },
      {
        title: 'CPU',
        order: true,
        key: 'cpu'
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
            <Icon type="edit" className="public-rowbtnIcon Bcolor_dodgerblue" onClick = {this.TableEditClick.bind(this, row,item)} data-key="edit" title="编辑"></Icon>
            <Icon type="trash-o" className="public-rowbtnIcon Bcolor_orange" onClick = {this.TableEditClick.bind(this, row,item)} data-key="del" title="删除"></Icon>
          </div>

          return html
        },
        order: false
      }
    ];
    return {
      currentPage:1,
      seach:"",
      order:{}
    }
  },
  componentDidMount(){
    this.PageControl.tableData = tableData.totalList;
    this.setState(this.state);
  } ,
  statusChange(){

  },
  TableEditClick(row,item,e){
    const  btn = e.target;
    if (btn.dataset.key === "edit"){
      this.refs.addQueue.open()
    }else {
      confirm('确认删除该队列吗？', () => {
        console.log(1)
      })
    }

  },
  TableSeachChange(val){
    if (val == ""){
      this.TableSeachClick(val);
    }
  },
  TableSeachClick(value){
    this.PageControl.dataMap[0] = "name";
    if (value !== this.state.seach){
      this.setState({
        currentPage:1,
        seach:value,
        order:this.state.order
      });
    }
  },
  TablePageChange(page){
    this.setState({
      currentPage:page,
      seach:this.state.seach,
      order:this.state.order
    });
  },
  TableOrder(name, sort){
    this.setState({
      currentPage:this.state.currentPage,
      seach:this.state.seach,
      order:{field:name,type:sort}
    });
  },
  handleModelClose(e) {
    this.refs.dispatch.close();
  },
  handleSelect(v){
    "use strict";

  },
  render() {
    const  formData=this.formData;
    const tableControl = this.PageControl;
    this.TableData = _table.updateDataTable(this.PageControl,this.state)
    return (
        <div className="main-box">
          <div className="breadcrumb"><Link to="/SysManager">系统管理</Link> > <span>队列管理</span></div>
          <div className="Container tableBox">
            <div className="tableTools" >
              <lable>队列名称：</lable>
              <SearchInput placeholder="请输入队列名称" className="seachInput " size="sm" onSearch={this.TableSeachClick} onChange={this.TableSeachChange} />
            </div>
            <DataTable
                data={this.TableData}
                onPageChange={this.TablePageChange}
                showPage="true"
                column={tableControl.column}
                howRow={tableControl.PageRow}
                //onRowClick={this.handleRowClick}
                onOrder={this.TableOrder}
                className="public-table"
                >
            </DataTable>
          </div>

          <Modal ref="addQueue" lock>
            <ModalHeader >
              <h4 className="modal-title">添加队列</h4>
            </ModalHeader>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={this.formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <FormItem label="队列名称" required name="name" help="25个字符以内">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="内存大小" required name="reason">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="CUP大小" required name="reason" >
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>

                <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
              </Form>
            </ModalBody>
          </Modal>

        </div>
    )
  }
})
