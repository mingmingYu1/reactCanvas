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
    "name": "数据源1",
    "people": "操经纬",
    time1:"2014-09-22~2016-02-12",
    time2:"天",
    time3:"00 00 00 00 ",
    status:1,
    time4:"2014-09-22"
  }, {
    "id": "2",
    "name": "数据源2",
    time1:"2014-09-22~2016-02-12",
    time2:"天",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:1,
    "people": "李丹丹"
  },  {
    "id": "3",
    "name": "数据源3",
    time1:"2014-09-22~2016-02-12",
    time2:"天",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:0,
    "people": "啦啦啦"
  },  {
    "id": "4",
    "name": "数据源1",
    time1:"2014-09-22~2016-02-12",
    time2:"日",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:0,
    "people": "嘿嘿嘿"
  },  {
    "id": "5",
    "name": "数据源5",
    time1:"2014-09-22~2016-02-12",
    time2:"日",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:0,
    "people": "是是是"
  }, {
    "id": "6",
    "name": "数据源5",
    time1:"2014-09-22~2016-02-12",
    time2:"日",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:0,
    "people": "是是是"
  }, {
    "id": "7",
    "name": "数据源5",
    time1:"2014-09-22~2016-02-12",
    time2:"月",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:0,
    "people": "是是是"
  }, {
    "id": "8",
    "name": "数据源5",
    time1:"2014-09-22~2016-02-12",
    time2:"天",
    time3:"00 00 00 00 ",
    time4:"2014-09-22",
    status:0,
    "people": "是是是"
  },
    {
      "id": "8",
      "name": "数据源5",
      time1:"2014-09-22~2016-02-12",
      time2:"月",
      time3:"00 00 00 00 ",
      time4:"2014-09-22",
      status:0,
      "people": "是是是"
    },
    {
      "id": "8",
      "name": "数据源5",
      time1:"2014-09-22~2016-02-12",
      time2:"天",
      time3:"00 00 00 00 ",
      time4:"2014-09-22",
      status:0,
      "people": "是是是"
    },
    {
      "id": "8",
      "name": "数据源5",
      time1:"2014-09-22~2016-02-12",
      time2:"月",
      time3:"00 00 00 00 ",
      time4:"2014-09-22",
      status:0,
      "people": "是是是"
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
      title: '任务名',
      order: true,
      key: 'name'
    },
      {
        title: '所属项目',
        order: true,
        key: 'people'
      },
      {
        title: '所属队列',
        order: true,
        key: 'time1'
      },
      {
        title: '责任人',
        order: true,
        key: 'time2'
      },
      {
        title: '创建日期',
        order: true,
        width: '200px',
        key: 'time4'
      },
      {
        title: '操作',
        width: '100px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall">
            <Icon type="edit" className="public-rowbtnIcon Bcolor_dodgerblue" onClick = {this.TableEditClick.bind(this, row,item)} data-key="edit" title="编辑"></Icon>
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
    this.refs.editQueue.open()
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
  fromNumChange(e){
    console.log(e.target.value)
    e.target.setAttribute("value",e.target.value)
  },
  modelAddRow(){
  },
  render() {
    const  formData=this.formData;
    const tableControl = this.PageControl;
    this.TableData = _table.updateDataTable(this.PageControl,this.state)
    return (
        <div className="main-box">
          <div className="breadcrumb"><Link to="/SysManager">系统管理</Link> > <span>队列分配</span></div>
          <div className="Container tableBox">
            <div className="tableTools" >
              <lable>任务名称：</lable>
              <SearchInput placeholder="请输入任务名称" className="seachInput " size="sm" onSearch={this.TableSeachClick} onChange={this.TableSeachChange} />
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

          <Modal ref="editQueue" lock>
            <ModalHeader >
              <h4 className="modal-title">修改队列</h4>
            </ModalHeader>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={this.formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <FormItem label="选择队列" required name="queueId" >
                  <Select searchable style={{width:"300px"}}>
                    <Option>请选择</Option>
                    <Option value="0">队列1</Option>
                    <Option value="1">队列2</Option>
                    <Option value="2">队列3</Option>
                  </Select>
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
