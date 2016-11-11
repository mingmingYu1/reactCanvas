import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Tree from 'public/Tree'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import FormInput from 'bfd-ui/lib/FormInput'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import DragLine from "public/DragLine"
import xhr from 'bfd-ui/lib/xhr'
import ContextMenu from "public/ContextMenu"
import DataTable from 'bfd-ui/lib/DataTable'
import './index.less'

const table={
  "totalList": [{
    "id": "1",
    "name": "函数名称",
    "desc": "mufds_dfsdf_sdfdd"
  }, {
    "id": "2",
    "name": "责任人",
    "desc": "操经纬"
  },  {
    "id": "3",
    "name": "函数类型",
    "desc": "自定义函数"
  },  {
    "id": "4",
    "name": "修改人",
    "desc": "dp-fsdf_001"
  },  {
    "id": "5",
    "name": "修改时间",
    "desc": "2016-03-02"
  }, {
    "id": "6",
    "name": "命令格式",
    "desc": "2016-03-02"
  }, {
    "id": "7",
    "name": "参数说明",
    "desc": "number：Double或bigint类型，\n" +
    "输入为bigint时返回bigint，输入为double时返回double类型。\n" +
    " 若输入为string类型会隐式转换到double类型后参与运算，\n" +
    "其它类型抛异常。返回值：Double或者bigint类型，\n" +
    "取决于输入参数的类型。若输入为null，返回null"
  }, {
    "id": "8",
    "name": "用途",
    "desc": "计算决定值"
  }],
  "currentPage": 1,
  "totalPageNum": 6
}


export default React.createClass({
  formData:{name:""},
  getInitialState() {
    this.rules = {
      name(v) {
        if (!v) return '请填写名称'
      }
    }
    return {
      url: "data/table.json",
      active:"",
      column: [{
        title: '属性名',
        order: false,
        width: '35%',
        key: 'name'
      }, {
        title: '属性信息',
        key: 'desc',
        width: '65%',
        render: (text, item) => {
          let html = text;
          if(item.name == "命令格式" || item.name == "参数说明"){
            html = <pre>{text}</pre>
          }
          return html
        },
        order: false
      }],
      data: [{
        name: '自定义函数',
        open: true,
        type:'custom',
        id:'1312323424',
        children: [{
          name: 'abc',
          type:'custom',
          Pid:'1312323424',
          id:'ssf2312323'
        }, {
          name: 'acd',
          type:'custom',
          Pid:'1312323424',
          id:'sfdsfwereww'
        }]
      },{
        name: '系统函数',
        open: true,
        type:'system',
        id:'aa323424',
        children: [{
          name: 'sdfds',
          type:'system',
          Pid:'aa323424',
          id:'sssf2312323'
        }, {
          name: 'dfs',
          type:'system',
          Pid:'aa323424',
          id:'ssf2312s323'
        }]
      }]
    }
  },
  componentDidMount() {
    const _this = this;
    ContextMenu.init({preventDoubleContext: false});
    ContextMenu.attach('.custom', [
      {text: '新建目录', action: function(e){
        _this.refs.addTreeFolder.open()
      }},
      {text: '新建函数', action: function(e){
        "use strict";
        _this.refs.addTreeNode.open()
      }},
    ]);
    ContextMenu.attach('.customFolder', [
      {text: '新建目录', action: function(e){
        _this.refs.addTreeFolder.open()
      }},
      {text: '新建函数', action: function(e){
        "use strict";
        _this.refs.addTreeNode.open()
      }},
      {text: '重命名',action: function(e){
      }},
      {text: '删除', href: 'http://contextjs.com/context.js', target:'_blank', action: function(e){
      }}
    ]);

    ContextMenu.attach('.customNode', [
      {text: '删除', action: function(e){
        console.log(this.pathname,this.innerHTML)
      }},
      {text: '移动',action: function(e){
      }}
    ]);

  },
  TreeNodeClass(d){
    let className;
    if( d.type === 'system'){
      className = d.name === "系统函数"?"system":d.children?"systemFolder":"systemNode"
    }
    else{
      className = d.name === "自定义函数"?"custom":d.children?"customFolder":"customNode"
    }
    return  className;
  },
  TreeNodeOpen(e){
   let nodedata = JSON.parse(e.target.dataset.data);
    console.log(nodedata.name+"--onDoubleClick")
  },
  TreeNodeRender(d,len){
    let className;
    let func;
    let indent;
    if(!d.children){
      func = this.TreeNodeOpen
      indent = {
        width: "100%",
        left: 0,
        margin: 0,
        paddingLeft: Math.floor(len/ 2) * 20+35 + 'px !important'
      }
    }
    className = 'treeNode'
    return <div data-data={JSON.stringify(d)}  style={indent}  className={className} onDoubleClick={func}>{d.name}</div>;
  },
  handleActive(dataPath){
    //const path =  dataPath[dataPath.length-1]
    //console.log(path.name)
  },
  handleBtnClick(e){
    "use strict";
    console.log(e.target.dataset.key)
  },
  modelSelectopen(item){
    $(".bfd-multiple-select").toggleClass("open");
  },
  getIcon(data) {
    return data.open== undefined?"cube":data.open?'folder-open' : 'folder'
  },
  Draging(position){
      const treeBox = this.refs.tree;
      const containerBox = this.refs.container;
      const conterBox = this.refs.main.parentNode;
      const dragline = this.refs.dragline.refs.dragline;

      const conterBoxStyle = getComputedStyle(conterBox);
      const treeBoxStyle = getComputedStyle(treeBox);

      const  padleft =conterBoxStyle.paddingLeft.substr(0,conterBoxStyle.paddingLeft.length-2)
      let width = treeBoxStyle.width.substr(0,treeBoxStyle.width.length-2);
      let minwidth = treeBoxStyle.minWidth.substr(0,treeBoxStyle.minWidth.length-2);
      let maxwidth = treeBoxStyle.maxWidth.substr(0,treeBoxStyle.maxWidth.length-2);
      width = (parseInt(width)+position.x-padleft)
      if (width > minwidth && width <  maxwidth){
        treeBox.style.width =width + 'px'
        containerBox.style.marginLeft =width + 'px'
        dragline.style.left = width-2+'px'
      }
  },
  render() {
    const  TreeData =this.state.data;
    const  formData=this.formData;
    return (
        <div className="main-box" ref="main">
          <div className="breadcrumb"><Link to="/DataDev">数据开发</Link> > <span>函数管理</span></div>
          <div className="Container">
            <div className="treebox"  ref="tree">
              <Tree data={TreeData}
                    render={this.TreeNodeRender}
                    getClass={this.TreeNodeClass}
                    getIcon={this.getIcon}
                    onActive={this.handleActive}  />
            </div>
            <DragLine ref="dragline" onDraging={this.Draging} className="public-vertical left170"/>
            <div className="Container_body"  ref="container">
              <div className="minder-view tableBox" >
                <DataTable
                    data={table}
                    //onPageChange={this.onPageChange}
                    showPage="false"
                    column={this.state.column}
                    className="funTable"
                    //onRowClick={this.handleRowClick}
                    //onOrder={this.handleOrder}
                    >
                </DataTable>
              </div>
            </div>
          </div>

          <Modal ref="addTreeFolder" lock>
            <ModalHeader >
              <h4 className="modal-title">新建目录</h4>
            </ModalHeader>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <FormItem label="目录名称" required name="name" help="20个字符以内">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary" onClick={this.handleModelSave}>确定</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn" onClick={this.handleModelClose}>取消</button>
              </Form>
            </ModalBody>
          </Modal>

          <Modal ref="addTreeNode" lock>
            <ModalHeader >
              <h4 className="modal-title">新建函数</h4>
            </ModalHeader>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <FormItem label="函数名称" required name="name" help="20个字符以内">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="类名" required name="typename" help="">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="资源" required name="tt" help="">
                  <MultipleSelect defaultValues={[]} onChange={this.handleChange} style={{width: '400px'}} >
                    <Option value="0">资源111</Option>
                    <Option value="1">资源222</Option>
                    <Option value="2">资源333</Option>
                    <Option value="4">资源444</Option>
                  </MultipleSelect>
                  <Icon type ="search findIcon" title="查找" onClick={this.modelSelectopen}></Icon>
                </FormItem>
                <FormItem label="用途"  name="row" help="">
                  <FormInput style={{width: '400px'}}></FormInput>
                </FormItem>
                <FormItem label="命令格式"  name="type" help="">
                  <FormInput style={{width: '400px'}}></FormInput>
                </FormItem>
                <FormItem label="参数说明"  name="desc" help="">
                  <FormTextarea style={{width: '400px',resize: "none",height:'80px'}}></FormTextarea>
                </FormItem>

                <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary"  >确定</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
              </Form>
            </ModalBody>
          </Modal>
        </div>
    )
  }
})
