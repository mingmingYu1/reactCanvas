import React from 'react'
import Tree from 'public/Tree'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import { FormSelect } from 'bfd-ui/lib/FormSelect'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import FormInput from 'bfd-ui/lib/FormInput'
import Upload from 'bfd-ui/lib/Upload'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import Icon from 'bfd-ui/lib/Icon'
import xhr from 'bfd-ui/lib/xhr'
import DragLine from "public/DragLine"
import ContextMenu from "public/ContextMenu"
import DataTable from 'bfd-ui/lib/DataTable'
import './index.less'

const table={
  "totalList": [{
    "id": "1",
    "name": "资源名称",
    "desc": "test.csv"
  }, {
    "id": "2",
    "name": "责任人",
    "desc": "操经纬"
  },  {
    "id": "3",
    "name": "资源类型",
    "desc": "file"
  },  {
    "id": "4",
    "name": "修改人",
    "desc": "dp-fsdf_001"
  },  {
    "id": "5",
    "name": "修改时间",
    "desc": "2016-03-02"
  },{
    "id": "8",
    "name": "描述",
    "desc": "有关的数据信息包"
  }],
  "currentPage": 1,
  "totalPageNum": 6
}

export default React.createClass({
  formData:{name:""},
  getInitialState() {
    return {
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
        order: false
      }],
      data: [{
        name: '资源管理',
        open: true,
        id:112,
        children: [{
          name: '资源1',
          id:113,
          pid:112
        }, {
          name: '资源文件夹2',
          open: true,
          id:113,
          pid:112,
          children: [{
            name: '资源1',
            id:113,
            pid:112
          }, {
            name: '资源2',
            id:113,
            pid:112
          }]
        }]
      }]
    }
  },
  componentDidMount() {
    const  _this = this;
    ContextMenu.init({preventDoubleContext: false});
    ContextMenu.attach('.custom', [
      {text: '新建目录', action: function(e){
         _this.refs.addTreeFolder.open()
      }},
      {text: '上传资源', action: function(e){
        "use strict";
        _this.refs.addTreeNode.open()
      }},
    ]);
    ContextMenu.attach('.customFolder', [
      {text: '新建目录', action: function(e){
        _this.refs.addTreeFolder.open()
      }},
      {text: '上传资源', action: function(e){
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
    className = d.pid?d.children?"customFolder":"customNode":"custom"
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
  TreeNodegetIcon(data) {
    return data.open== undefined?"reorder":data.open?'folder-open' : 'folder'
  },
  handleActive(dataPath){
    //const path =  dataPath[dataPath.length-1]
    //console.log(path.name)
  },
  handleBtnClick(e){
    "use strict";
    console.log(e.target.dataset.key)
  },
  handleComplete(data) {
    console.log('complete', data)
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
    const  formData = this.formData;
    const props = {
      action: 'data',
      multiple: true,
      onComplete: this.handleComplete
    }
    return (
        <div className="main-box" ref="main">
          <div className="breadcrumb"><Link to="/DataDev">数据开发</Link> > <span>资源管理</span></div>
          <div className="Container">
            <div className="treebox"  ref="tree">
              <Tree data={TreeData}
                    render={this.TreeNodeRender}
                    getClass={this.TreeNodeClass}
                    getIcon={this.TreeNodegetIcon}
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
              <h4 className="modal-title">资源上传</h4>
            </ModalHeader>
            <ModalBody>
              <Form
                  ref="form"
                  action="form"
                  data={formData}
                  rules={this.rules}
                  onSuccess={this.handleSuccess}
                  >
                <FormItem label="资源名称" required name="name" help="20个字符以内">
                  <FormInput style={{width: '200px'}}></FormInput>
                </FormItem>
                <FormItem label="类别" required name="typename" help="">
                  <FormSelect style={{width: '200px'}}>
                    <Option>请选择</Option>
                    <Option value={0}>jar</Option>
                    <Option value={1}>file</Option>
                    <Option value={2}>archive</Option>
                  </FormSelect>
                </FormItem>
                <FormItem label="上传" required name="tt" help="">
                  <Upload {...props}/>
                </FormItem>
                <FormItem label="说明"  name="desc" help="">
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
