import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import SearchInput from 'bfd-ui/lib/SearchInput'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import FormInput from 'bfd-ui/lib/FormInput'
import { FormSelect,Option } from 'bfd-ui/lib/FormSelect'

import xhr from 'bfd-ui/lib/xhr'
import _table from "public/table"
import DataTable from 'bfd-ui/lib/DataTable'
import './index.less'

const tableData={
  "totalList": [{
    "id": "1",
    "name": "数据源1",
    "type": "mufds_dfsdf_sdfdd",
    "addres": ":182.22.111.2",
    "people": "操经纬"
  }, {
    "id": "2",
    "name": "数据源2",
    "type": "ssssql",
    "addres": ":182.22.111.2",
    "people": "李丹丹"
  },  {
    "id": "3",
    "name": "数据源3",
    "type": "mufds_dfsdf_sdfdd",
    "addres": ":182.22.111.2",
    "people": "啦啦啦"
  },  {
    "id": "4",
    "name": "数据源1",
    "type": "mufds_dfsdf_sdfdd",
    "addres": ":182.22.111.2",
    "people": "嘿嘿嘿"
  },  {
    "id": "5",
    "name": "数据源5",
    "type": "sqlq",
    "addres": ":182.22.111.2",
    "people": "是是是"
  }, {
    "id": "6",
    "name": "数据源5",
    "type": "sqlq",
    "addres": ":182.22.111.2",
    "people": "是是是"
  }, {
    "id": "7",
    "name": "数据源5",
    "type": "sqlq",
    "addres": ":182.22.111.2",
    "people": "是是是"
  }, {
    "id": "8",
    "name": "数据源5",
    "type": "sqlq",
    "addres": ":182.22.111.2",
    "people": "是是是"
  },
    {
      "id": "8",
      "name": "数据源5",
      "type": "sqlq",
      "addres": ":182.22.111.2",
      "people": "是是是"
    },
    {
      "id": "8",
      "name": "数据源5",
      "type": "sqlq",
      "addres": ":182.22.111.2",
      "people": "是是是"
    },
    {
      "id": "8",
      "name": "数据源5",
      "type": "sqlq",
      "addres": ":182.22.111.2",
      "people": "是是是"
    }],
  "currentPage": 2,
  "totalPageNum": 11
}


export default React.createClass({
  formData:{name:""},
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
    this.PageControl.column = [{
      title: '数据源名',
      order: true,
      key: 'name'
    },
      {
        title: '数据源类型',
        order: true,
        key: 'type'
      },
      {
        title: '数据源地址',
        order: true,
        width: '200px',
        key: 'addres'
      },
      {
        title: '责任人',
        order: true,
        key: 'people'
      },
      {
        title: '操作',
        width: '150px',
        key: 'operation',
        render: (text, item) => {
          const html =  <div className="editCall">
            <Icon type="edit" className="public-rowbtnIcon Bcolor_dodgerblue" onClick = {this.TableEditClick.bind(this, item)} data-key="edit" title="编辑"></Icon>
            <Icon type="trash-o" className="public-rowbtnIcon Bcolor_orange" onClick = {this.TableDelClick.bind(this, item)} data-key="del" title="删除"></Icon>
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
  TableEditClick(e,row){

  },
  TableDelClick(e,row){

  },
  TableSeachChange(val){
    if (val == ""){
      this.TableSeachClick(val);
    }
  },
  TableSeachClick(value){
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
  TableAddRow(){
    this.refs.addRow.open()
  },
  render() {
    const  formData=this.formData;
    const tableControl = this.PageControl;
    this.TableData = _table.updateDataTable(this.PageControl,this.state)
    return (
        <div className="main-box">
          <div className="breadcrumb"><Link to="/DataDev">数据开发</Link> > <span>数据源管理</span></div>
          <div className="Container tableBox">
                <div className="tableTools" >
                  <lable>数据源名：</lable>
                  <SearchInput placeholder="请输入数据源名称" className="seachInput " size="sm" onSearch={this.TableSeachClick} onChange={this.TableSeachChange} />
                  <Button icon="plus" className="pull-right" onClick={this.TableAddRow} >新增数据源</Button>
                </div>
                <DataTable
                    data={this.TableData}
                    onPageChange={this.TablePageChange}
                    showPage="true"
                    column={tableControl.column}
                    className="DataSetTable public-table"
                    howRow={tableControl.PageRow}
                    //onRowClick={this.handleRowClick}
                    onOrder={this.TableOrder}
                    >
                </DataTable>
          </div>

          <Modal ref="addRow" lock>
            <ModalHeader >
              <h4 className="modal-title">新增数据源</h4>
            </ModalHeader>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <FormItem label="数据源名称" required name="name" help="20个字符以内">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="类型" required name="typename" help="">
                  <FormSelect style={{width: '200px'}}>
                    <Option value={0}>MySql</Option>
                  </FormSelect>
                </FormItem>
                <FormItem label="url"  name="url" help="">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="用户名"  name="name" help="">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="密码"  name="password" help="">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="数据库名"  name="basename" help="">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>

                <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary"  >保存</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn btn-primary"  >测试连接</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn" >放弃</button>
              </Form>
            </ModalBody>
          </Modal>
        </div>
    )
  }
})
