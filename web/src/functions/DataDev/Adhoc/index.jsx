import React from 'react'
import Tree from 'bfd-ui/lib/Tree'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import SeachTree from './../SeachTree.jsx'
import Icon from 'bfd-ui/lib/Icon'
import { Select, Option } from 'bfd-ui/lib/Select'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormInput from 'bfd-ui/lib/FormInput'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import xhr from 'bfd-ui/lib/xhr'
import ContextMenu from "public/ContextMenu"
import SqlResultTab from "./SqlResultTab.jsx"
import DragLine from "public/DragLine"
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/chrome';

import './index.less'


const  sql={"查询":"select * from test \nselect","查询2":"select aner sds adsa adsad from test123 \ndelete","层级3":"delete dsfsd from testweww/n/rselect"}

export default React.createClass({
  TreeData:[{
    name: '查询文件',
    open: true,
    children: [{
      name: '查询',
      pid:"11"
    }, {
      name: '查询2',
      pid:"11"
    }, {
      name: '查询3',
      open: false,
      pid:"11",
      children: [{
        name: 'hi诶嘿嘿IE',
        open: true,
        pid:"11",
        children: [{
          name:"层级3",
          pid:"11",
        },{
          name:"sssssss",
          pid:"11"
        }]
      },{
        name: 'heheihie',
        pid:"11",
        open:true,
        children: [{
          name:"层级22",
          pid:"11",
          open:true,
          children: [{
            name:"层级4",
            pid:"11"
          },{
            name:"dsdfsd",
            pid:"11"
          }]
        },{
          name:"ssssss",
          pid:"11"
        }]
      }]
    }]
  }],
  formData:{name:"1"},
  SqlString:"",
  getInitialState() {
    this.rules = {
      name(v) {
        if (!v) return '请填写名称'
      }
    }
    return {
      tabs: [{
        name: '新建页签A',
        value:"select * from test1"
      }, {
        name: '新建页签B',
        value:"select * from test2"
      }],
      activeIndex:0
    }
  },
  handleSelectChange(value){
    console.log(value)
  },
  componentDidMount() {
    let _this = this
    ContextMenu.init({preventDoubleContext: false});
    ContextMenu.attach('.custom', [
      {text: '新建目录', action: function(e){
        _this.refs.addTreeFolder.open()
      }},
      {text: '新建查询', action: function(e){
        "use strict";
        _this.refs.addTreeNode.open()
      }},
    ]);
    ContextMenu.attach('.customFolder', [
      {text: '新建目录', action: function(e){
        _this.refs.addTreeFolder.open()
      }},
      {text: '新建查询', action: function(e){
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
  handleBtnClick(e){
    "use strict";
    console.log(e.target.dataset.key)
  },
  TreeNodeActive(dataPath){
    console.log(dataPath[dataPath.length-1].name)
  },
  TreeNodeOpen(e){
    //e.stopPropagation();
    let nodedata = JSON.parse(e.target.dataset.data);
    this.state.tabs.push({name:nodedata.name,value:sql[nodedata.name]})
    this.setState({
      tabs:this.state.tabs,
      activeIndex:this.state.tabs.length-1
    });
    console.log(nodedata.name+"--onDoubleClick")
  },
  TreeNodeChange(data){
    "use strict";
    this.TreeData = data
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
  TreeNodeClass(d){
    let className;
    className = d.pid ?d.children?"customFolder":"customNode":"custom"
    return  className;
  },
  handleBtnClick(e){
    "use strict";
    console.log(e.target.dataset.key)
  },
  getIcon(data) {
    return data.open== undefined?"database":data.open?'folder-open' : 'folder'
  },
  handleSuccess(res) {
    console.log(res)
    message.success('保存成功！')
  },
  Draging(position){
    this.DragingLine && this.DragingLine("tree",position)
  },
  DragingLine(type,position){
    if (type === "tab"){
      const aceBox = this.refs["acebox"+this.state.activeIndex];
      const aceBoxStyle = getComputedStyle(aceBox);
      var height = aceBoxStyle.height.substr(0,aceBoxStyle.height.length-2)
      aceBox.style.height =(parseInt(height)+position.y -80) + 'px'
    }else if (type === "tree"){
      const treeBox = this.refs.tree.refs.treeBox;
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

    }

  },
  TabsClose(index) {
    const tabs = this.state.tabs
    tabs.splice(index, 1)
    this.setState({ tabs, activeIndex: tabs.length - 1 })
  },

  TabsAdd(e) {
    e.preventDefault()
    const tabs = this.state.tabs
    tabs.push({
      name: '新建页签' + String.fromCharCode((67 + Math.random() * 24).toFixed(0))
    })
    this.setState({ tabs, activeIndex: tabs.length - 1 })
  },

  TabsChange(activeIndex) {
    this.setState({ activeIndex })
  },
  render() {
    const formData =this.formData;
    const _this = this
    const pageTabs = <Tabs dynamic handleClose={this.TabsClose}  activeIndex={this.state.activeIndex} onChange={this.TabsChange}>
      <TabList>
        {this.state.tabs.map((tab, i) => <Tab key={i}>{tab.name}</Tab>)}
        <li className="addbtn">
          <a><Icon type="plus" onClick={this.TabsAdd}></Icon></a>
        </li>
      </TabList>
      {this.state.tabs.map((tab, i) => <TabPanel key={i}>
        <div className="AceEditorbox" ref={"acebox"+i}>
        <AceEditor
            mode="sql"
            theme="chrome"
            height="450px"
            width="100%"
            onChange={newValue=> {console.log('change',JSON.stringify(newValue));}}
            name={"IdeEdit"+i}
            value={tab.value}
            editorProps={{$blockScrolling: true}}
            />
      </div>
        <SqlResultTab DragingLine={_this.DragingLine}/>
      </TabPanel>)}
     </Tabs>

    return (
        <div className="main-box" ref="main">
          <div className="Container">
            <SeachTree ref="tree"
                       defaultData={this.TreeData}
                       render={this.TreeNodeRender}
                       onChange={this.TreeNodeChange}
                       getClass={this.TreeNodeClass}
                       onActive={this.TreeNodeActive}
                       DragingLine={this.DragingLine}>
            </SeachTree>
            <DragLine ref="dragline" onDraging={this.Draging} className="public-vertical left170"/>
            <div className="Container_body"  ref="container">
              <div className="navbar_btn">
                <ul>
                  <li>结果最大显示数
                    <Select onChange={this.handleSelectChange} value="1000">
                      <Option value="1000" >1000</Option>
                      <Option value="2000">2000</Option>
                      <Option value="3000">3000</Option>
                      <Option value="4000" >4000</Option>
                    </Select>
                  </li>
                  <li onClick={this.handleBtnClick} ><Icon type="times" title="清空" className="public-butIcon color_darkcyan" data-key="empty"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="caret-square-o-right " className="public-butIcon color_dodgerblue"   title= "运行" data-key="run"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="pause" className="public-butIcon color_dodgerblue"  title= "暂停" data-key="stop"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="trash" title="删除" className="public-butIcon color_orange"  data-key="del"/></li>
                </ul>
              </div>
              <div className="adhoc-tabs" >{pageTabs}</div>
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
                <h4 className="modal-title">新建查询</h4>
              </ModalHeader>
              <ModalBody>
                <Form
                    ref="form"
                    action="form"
                    data={formData}
                    rules={this.rules}
                    onSuccess={this.handleSuccess}
                    >
                  <FormItem label="查询名称" required name="name" help="20个字符以内">
                    <FormInput style={{width: '200px'}}></FormInput>
                  </FormItem>

                  <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary"  >确定</button>
                  <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
                </Form>
              </ModalBody>
            </Modal>

          </div>
        </div>
    )
  }
})
