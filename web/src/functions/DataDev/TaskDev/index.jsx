import React from 'react'
import Tree from 'bfd-ui/lib/Tree'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import AutoComplete from 'bfd-ui/lib/AutoComplete'
import ReactDOM from 'react-dom'
import SeachTree from './../SeachTree.jsx'
import Icon from 'bfd-ui/lib/Icon'
import xhr from 'bfd-ui/lib/xhr'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'
import { Tabs, TabList, TabPanel } from 'bfd-ui/lib/Tabs'
import Tab from 'public/tab'
import FormInput from 'bfd-ui/lib/FormInput'
import DragFlowChart from 'public/DragFlowChart'
import ChartNavbar from './ChartNavbar.jsx'
import NodeGroup from './NodeGroup.jsx'
import DragLine from "public/DragLine"
import ContextMenu from "public/ContextMenu"
import './index.less'



const chartdata=[{"nodes":[
  {"x":114,"y":275,"name":"测试",type:"sql"},
      {"x":574,"y":333,"name":"的是否都是个",type:"spark"},
      {"x":620,"y":205,"name":"是否水电费",type:"mr"},
      {"x":421,"y":130,"name":"而温柔",type:"output"},
      {"x":221,"y":130,"name":"独立节点",type:"sql"}],
    "links":[{"source":0,"target":1,start:"LR"},{"source":2,"target":1,start:"BT"},
  {"source":3,"target":1,start:"BT"}],
  translate:[0,0],
  scale:1
  },{"nodes":[
  {"x":154,"y":275,"name":"啦啦",type:"sql"},
  {"x":574,"y":333,"name":"的是否都是个",type:"spark"},
  {"x":620,"y":205,"name":"啦啦",type:"mr"},
  {"x":421,"y":130,"name":"而温柔",type:"output"},
  {"x":521,"y":230,"name":"独立节点",type:"sql"}],
  "links":[{"source":2,"target":0,start:"BT"},{"source":2,"target":1,start:"BT"},
    {"source":3,"target":1,start:"BT"}],
  translate:[0,0],
  scale:1
},{"nodes":[
  {"x":454,"y":275,"name":"啦啦",type:"sql"},
  {"x":574,"y":333,"name":"的是否都是个",type:"spark"},
  {"x":320,"y":205,"name":"啦啦",type:"mr"},
  {"x":421,"y":130,"name":"而温柔",type:"output"},
  {"x":221,"y":230,"name":"独立节点",type:"sql"}],
  "links":[{"source":2,"target":3},{"source":2,"target":1},
    {"source":3,"target":0}],
  translate:[0,0],
  scale:1
},{"nodes":[
  {"x":354,"y":275,"name":"啦啦",type:"input"},
  {"x":474,"y":133,"name":"的是否都是个",type:"spark"},
  {"x":320,"y":205,"name":"啦啦",type:"mr"},
  {"x":421,"y":130,"name":"而温柔",type:"output"},
  {"x":221,"y":240,"name":"独立节点",type:"sql"}],
  "links":[{"source":2,"target":3},{"source":2,"target":1},
    {"source":3,"target":0}],
  translate:[0,0],
  scale:1
}]

const sizeSet={ rectWidth:60,rectHeight:60}
export default React.createClass({
  TreeData:[{
      name: '任务文件',
      open: true,
      id:'111',
      children: [{
        name: '短任务',
        id:'1222',
        pid:"111",
        type:"0"
      }, {
        name: '长任务',
        id:'1333',
        pid:"111",
        type:"1"
      }, {
        name: '任务3',
        open: false,
        id:'1444',
        pid:"111",
        type:"group1",
        children: [{
          name: 'hi诶嘿嘿IE',
          open: true,
          id:'1411',
          pid:"1444",
          children: [{
            name:"层级3",
            id:'14111',
            pid:"1411",
            type:"group2",
          },{
            name:"sssssss",
            id:'14112',
            pid:"1411",
          }]
        },{
          name: 'heheihie',
          open:true,
          id:'1422',
          pid:"1444",
          children: [{
            name:"层级22",
            open:true,
            id:'14221',
            pid:"1422",
            children: [{
              name:"层级4",
              id:'14222',
              pid:"1422",
            },{
              name:"dsdfsd",
              id:'14223',
              pid:"1422",
            }]
          },{
            name:"ssssss",
            id:'1433',
            pid:"1444",
          }]
        }]
      }]
    }],
  formData:{name:"1"},
  getInitialState() {
    this.rules = {
      name(v) {
        if (!v) return '请填写名称'
      }
    }
    return {
      tabs: [],
      activeIndex:0,
      seachval:"",
      data:chartdata[0]
    }
  },
  componentDidMount() {
    let _this = this
    ContextMenu.init({preventDoubleContext: false});
    ContextMenu.attach('.custom', [
      {text: '新建目录', action: function(e){
        _this.refs.addTreeFolder.open()
      }},
      {text: '新建任务', action: function(e){
        "use strict";
         _this.refs.addTreeNode.open()
      }},
    ]);
    ContextMenu.attach('.customFolder', [
      {text: '新建目录', action: function(e){
        console.log(this.pathname,this.innerHTML)
      }},
      {text: '新建任务', action: function(e){
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
      {text: '克隆', action: function(e){
      }},
      {text: '移动',action: function(e){
      }}
    ]);
    ContextMenu.attach('.tabli', [
      {text: '关闭当前', action: function(e){
      }},
      {text: '关闭左测', action: function(e){
      }},
      {text: '关闭右侧', action: function(e){
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
    let index=-1;
    this.state.tabs.map(function(v,i){
      "use strict";
      if(v.name === nodedata.name){
        index = i
      }
    })
    if (index <0){
      this.state.tabs.push({
        name:nodedata.name,
        data:chartdata[this.state.tabs.length],
        type:nodedata.type
      })
      this.setState({
        tabs:this.state.tabs,
        activeIndex:this.state.tabs.length-1
      });
    }else{
      this.setState({
        tabs:this.state.tabs,
        activeIndex:index
      });
    }

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
  handleSvgDrop(ev){
    ev.preventDefault()
    const type = ev.dataTransfer.getData("Text")
    const workflow= this.state.tabs[this.state.activeIndex].data;
    this.refs.modal.open()
    console.log("pageX:"+ev.pageX +"——pageY:"+ev.pageY)
    console.log(ev.target.getBoundingClientRect().left +"——"+ev.target.getBoundingClientRect().top)
    console.log(workflow.translate +":" +workflow.scale)
    const node={
      x:(ev.pageX - $("#flowchart"+this.state.activeIndex)[0].getBoundingClientRect().left - sizeSet.rectHeight/2-workflow.translate[0])/workflow.scale ,
      y:(ev.pageY -$("#flowchart"+this.state.activeIndex)[0].getBoundingClientRect().top - sizeSet.rectHeight/2 - workflow.translate[1])/workflow.scale
      ,type:type,name:"新建节点"
    };
    let data = JSON.parse(JSON.stringify(workflow));
    data.nodes.push(node);
    this.state.tabs[this.state.activeIndex].data = data;
    this.setState(this.state);
  },
  handleModelClose(e) {
    this.refs.modal.close(() => {
      let data = JSON.parse(JSON.stringify(this.state.tabs[this.state.activeIndex].data));
      data.nodes.pop();
      this.state.tabs[this.state.activeIndex].data = data;
      this.setState(this.state);
    });
  },
  handleModelSave(e) {
    this.refs.modal.close(() => {
      let data = JSON.parse(JSON.stringify(this.state.tabs[this.state.activeIndex].data));
      data.nodes[data.nodes.length-1].name = this.formData.name;
      this.state.tabs[this.state.activeIndex].data = data;
      this.setState(this.state);
    });
    //this.handleModelClose;
    //this.refs.form.save()
  },
  handleSuccess(res) {
    console.log(res)
    message.success('保存成功！')
  },
  Draging(position){
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
      name: '新建任务' + String.fromCharCode((67 + Math.random() * 24).toFixed(0))
    })
    this.setState({ tabs, activeIndex: tabs.length - 1 })
  },

  TabsChange(activeIndex) {
    this.setState({ activeIndex })
  },
  render() {
    const  formData = this.formData
    const _this = this
    const pageTabs = <Tabs dynamic handleClose={this.TabsClose}  activeIndex={this.state.activeIndex} onChange={this.TabsChange}>
      <TabList>
        {this.state.tabs.map((tab, i) => <Tab key={i} className="tabli" data={JSON.stringify(tab)} >{tab.name}</Tab>)}
      </TabList>
      {this.state.tabs.map((tab, i) => <TabPanel key={i}>
        <div className="minder-view" onDrop={_this.handleSvgDrop} onDragOver={(ev) => {ev.preventDefault();}}>
          <NodeGroup type={tab.type} />
          <DragFlowChart data={tab.data} index={i} sizeSet={sizeSet} />
        </div>
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
                ></SeachTree>
            <DragLine ref="dragline" onDraging={this.Draging} className="public-vertical left170"/>
            <div className="Container_body"  ref="container">
              <div className="breadcrumb"><Link to="/DataDev">数据开发</Link> > <span>任务开发</span></div>
              <ChartNavbar/>
              {pageTabs}

              <Modal ref="modal" lock onClose={this.handleModelClose}>
                <ModalHeader >
                  <h4 className="modal-title">新建节点</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="名称" required name="name" help="5个字符以内">
                      <FormInput style={{width: '200px'}}></FormInput>
                    </FormItem>

                    <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary" onClick={this.handleModelSave}>确定</button>
                    <button type="button" style={{marginLeft: '20px'}} className="btn" onClick={this.handleModelClose}>取消</button>
                  </Form>
                </ModalBody>
              </Modal>

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

                  <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
                  <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
                </Form>
              </ModalBody>
            </Modal>

              <Modal ref="addTreeNode" lock>
                <ModalHeader >
                  <h4 className="modal-title">新建任务</h4>
                </ModalHeader>
                <ModalBody>
                  <Form
                      ref="form"
                      action="form"
                      data={formData}
                      rules={this.rules}
                      onSuccess={this.handleSuccess}
                      >
                    <FormItem label="任务名称" required name="name" help="20个字符以内">
                      <FormInput style={{width: '200px'}}></FormInput>
                    </FormItem>
                    <FormItem label="任务类型" name="type">
                      <FormSelect style={{width: '200px'}}>
                        <Option>请选择</Option>
                        <Option value={0}>短任务</Option>
                        <Option value={1}>长任务</Option>
                        <Option value={2}>ETL</Option>
                      </FormSelect>
                    </FormItem>
                    <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary"  >确定</button>
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
