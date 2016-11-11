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
        title: '责任人',
        order: true,
        key: 'people'
      },
      {
        title: '生效时间',
        order: true,
        key: 'time1'
      },
      {
        title: '调度周期',
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
        title: '状态',
        order: true,
        key: 'status',
        render: (row, item) => {
          let rowhtml;
          if (item.status){
            rowhtml =  <Switch labelOn="上线" onChange={this.statusChange}  on labelOff="下线" />
          }else{
            rowhtml =  <Switch labelOn="上线" onChange={this.statusChange} labelOff="下线" />
          }
          return rowhtml

        }
      },
      {
        title: '操作',
        width: '200px',
        key: 'operation',
        render: (row, item) => {
          const html =  <div className="editCall">
            <Icon type="sitemap " className="public-rowbtnIcon Bcolor_blue" onClick = {this.TableEditClick.bind(this,row, item)} data-key="look" title="查看"></Icon>
            <Icon type="retweet" className="public-rowbtnIcon Bcolor_yellow" onClick = {this.TableEditClick.bind(this,row, item)} data-key="dispatch" title="调度"></Icon>
            <Icon type="eyedropper" className="public-rowbtnIcon Bcolor_darkcyan" onClick = {this.TableEditClick.bind(this, row,item)} data-key="supply" title="补数据"></Icon>
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
    if (btn.dataset.key === "look"){
     if (btn.title === "查看" ){
       btn.title = "收起";
       $(btn).parents("tr").after("<tr><td colspan='8'>此处应该是svg任务图</td></tr>")
     } else{
       btn.title = "查看";
       $(btn).parents("tr").next("tr").remove();
     }

    }else if (btn.dataset.key === "dispatch"){
      this.refs.dispatch.open()
    }else if (btn.dataset.key === "monitor"){

    }else if (btn.dataset.key === "supply"){

    }
    console.log(row)
    console.log(e)

  },
  TableDelClick(e,row,item){
    confirm('确认删除吗', () => {
      console.log(1)
    })
  },
  TableRadioClick(val){
    this.PageControl.dataMap[0] = "people";
    val = val == 0?"":val
    this.setState({
      currentPage:1,
      seach:val,
      order:this.state.order
    });
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
          <div className="breadcrumb"><Link to="/DataDev">数据开发</Link> > <span>数据源管理</span></div>
          <div className="Container tableBox">
            <div className="tableTools" >
              <RadioGroup defaultValue="0" className="pull-left" onChange={this.TableRadioClick}>
                <Radio value="李丹丹">我的任务</Radio>
                <Radio value="0">全部任务</Radio>
              </RadioGroup>
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

          <Modal ref="dispatch" lock>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <h3>调度属性</h3>
                <FormItem label="调度状态" name="name">
                  <div style={{lineHeight: '30px'}}>下线</div>
                </FormItem>
                <FormItem label="生效日期" required name="time1" help="">
                  <DateRange onSelect={this.handleSelect} />
                </FormItem>
                <FormItem label="调度周期" required  name="time2" help="">
                  <FormSelect style={{width: '200px'}}>
                    <Option value="天">天</Option>
                    <Option value="周">周</Option>
                    <Option value="月">月</Option>
                    <Option value="分钟">分钟</Option>
                    <Option value="小时">小时</Option>
                  </FormSelect>
                </FormItem>
                <FormItem label="具体时间" required  name="name" help="">
                  <FormInput type="time" style={{width: '200px'}}></FormInput>
                  <span className="seperator">至</span>
                  <FormInput type="time" style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="重试次数"  required name="password" help="">
                  <FormInput type="number" style={{width: '200px'}} min="0"  max="10" step="2"></FormInput>
                </FormItem>
                <h3>依赖属性</h3>
                <div  className="SeachDiv">
                  <Select searchable>
                    <Option>请选择</Option>
                    <Option value="0">苹果</Option>
                    <Option value="1">三星</Option>
                    <Option value="2">小米</Option>
                  </Select>
                  <Select searchable>
                    <Option>请选择</Option>
                    <Option value="0">苹果</Option>
                    <Option value="1">三星</Option>
                    <Option value="2">小米</Option>
                  </Select>
                  <Button icon="plus" className="pull-right" onClick={this.modelAddRow} >添加</Button>
                </div>
                <table className="pubilc-modelTable">
                  <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>任务名称</th>
                    <th>责任人</th>
                    <th>操作</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>test1</td>
                      <td>测试1</td>
                      <td>张三</td>
                      <td><a>删除</a></td>
                    </tr>
                  </tbody>
                </table>
                <h3>跨周期依赖</h3>
                <RadioGroup className="pubilc-block" defaultValue="1" onChange={this.handleChange}>
                  <Radio value="1">不依赖上一调度周期</Radio>
                  <Radio value="2">自动依赖等待上一周期结束才能继续</Radio>
                  <Radio value="3">等待下游任务上一周期结束，才能继续运行</Radio>
                  <Radio value="4">等待自定义任务的上一周期结束，才能继续</Radio>
                </RadioGroup>
                <br/>
                <div style={{textAlign:'center'}}>
                  <button type="button"  className="btn btn-primary"  >保存</button>
                  <button type="button" style={{marginLeft: '20px'}} className="btn" onClick={this.handleModelClose}>取消</button>
                </div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
    )
  }
})
