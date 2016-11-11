import './index.less'
import React from 'react'
import Button from 'bfd/Button'
import { Row, Col } from 'bfd/Layout'
import Upload from 'bfd/Upload'
import { Form, FormItem } from 'bfd/Form'
import FormTextarea from 'bfd/FormTextarea'
import { Select, Option } from 'bfd-ui/lib/Select'
import message from 'bfd/message'
import Icon from 'bfd/Icon'
import Input from 'bfd/Input'
import { MultipleSelect, Option as MultipleSelectOption} from 'bfd/MultipleSelect'
import { Modal, ModalHeader, ModalBody } from 'bfd/Modal'
import ClearableInput from 'bfd/ClearableInput'
import emitter from '../../../../eventEmitter'
import { Steps, Step } from 'bfd/Steps'
import { Cascader ,message as loadingAntd } from 'antd'
import xhr from 'public/xhr'
import URL from 'public/url'
import { MultipleTreeSelect,searchNode } from 'public/MultipleTreeSelect'
import MultipleInputSelect from 'public/MultipleInputSelect'
import auth from 'public/auth'
import msgdanger from 'public/msgdanger'

const UploadPoc = React.createClass({

  getInitialState(){
    const self = this
    this.rules = {
      name(v) {
        if (!v) return '请填写标题'
      },
      rType(v){
        if (!v) return '请填写资源类型'
      },
      categoryContent(v){
        if (!v) return '请填写知识属性'
      },
      categoryGenre(v){
        if (!v) return '请填写产品属性'
      },
      categoryType(v){
        if (!v) return '请填写刊发频率'
      },
      categoryLanguage(v){
        if (!v) return '请填写语种'
      },
      categoryArea(v){
        if (!v) return '请填写地区'
      },
      categorySource(v) {
        if (!self.state.valueData.laiy || self.state.valueData.laiy.length == 0) return '请填写来源'
      }
    }
    return {
      // 产品属性
      goodsAttrBo: true,

      status:0,
      formData: {},
      isUploadBtnDisabled:false,
      templateData:[],
      title:'',
      type:'',
      saveTemValidate:{
        flag: true,
        text: ''
      },
      list:{        
        tic:[],
        kanf:[],        
        yuz:[],
        laiy:[],        
        zuz:[],
        guoc:[]
      },
      valueData:{      
        tic:[],
        kanf:[],        
        yuz:[],
        laiy:[],        
        zuz:[],
        guoc:[]
      },
      defaultValue:{
        guoc:[]
      }
    }
  }, 
  
  componentDidMount() {
    this.getMyTemplate()
    this.setData(2, 'tic')
    this.setData(3, 'kanf')
    this.setData(5, 'yuz')
    this.setData(14, 'laiy')  
    this.setData(9, 'zuz')
    this.setData(7, 'guoc')
    this.setStateData('报告','formData','rType')
    this.setStateData(0, 'formData', 'price')
    this.setGuocDefault()
    this.bindFileChange()
  },

  setGuocDefault() {
    const self = this
    xhr({
      type: 'GET',
      url: `${URL.CATEGORY_GETCATEGORYLIST}?type=7`,
      success(result) { 
        //TODO
        const item = self.getItemByName('中国', result)
        const arr = self.getCodeByItem(item)
        self.setStateData(arr, 'valueData', 'guoc')
        self.setStateData(arr.join(','), 'formData', 'categoryArea')
        self.setStateData(item.id, 'defaultValue', 'guoc')
      }
    })
  },

  getItemByName(name,array){
    let o = {}
    function tt(array){
      array.map(function(item,i){
        if(item.name == name){
          o= item
        }else if(item.name != name && item.children && item.children.length>0){
          tt(item.children)
        }
      })
    }
    tt(array)
    return o
  },

  getCodeByItem(item){
    let a = []
    function tt(item){
      a.push(item.code)
      if(item.children && item.children.length>0){
         item.children.map(function(_item,_i){
           tt(_item)
         })
      }
    }
    tt(item)
    return a
  },
  
  getMyTemplate(){
    const self = this
    xhr({
      type: 'GET',
      url: URL.DOC_GET_MY_TEMPLATE,      
      success(result) {
        self.setState({
          templateData:result.totalList
        })    
      }
    })
  },

  templateSelectChange(value){
    const self = this
    xhr({
      type: 'GET',
      url:`${URL.DOC_GET_MY_TEMPLATE}?id=${value}`,      
      success(result) {
        const data = result.totalList[0] 
        self.setTemplateItemData(data) 
        emitter.emit("MultipleTreeSelectSend")       
      }
    })
  },

  setTemplateItemData(data){
    
    if(!data) return

    const list = [{
      name: 'categoryGenre', //产品属性
      alias: 'tic'
    }, {
      name: 'categoryType', //刊发频率
      alias: 'kanf'
    },  {
      name: 'categoryLanguage', //语种
      alias: 'yuz'
    }, {
      name: 'categorySource', //来源
      alias: 'laiy'
    }, {
      name: 'categoryDepart', //组织机构
      alias: 'zuz'
    }]

    list.map((item, i) => {
      const arr = this.getValueList(data[item.name], this.state.list[item.alias],'value')
      this.setStateData(arr, 'valueData', item.alias)
      this.setStateData(data[item.name], 'formData', item.name)
    })

    //知识属性    
    this.setStateData(data.categoryContent.split(','), 'valueData', 'neic')
    this.setStateData(data.categoryContent, 'formData', 'categoryContent')
    
    //国家地区
    this.setStateData(data.categoryArea.split(','), 'valueData', 'guoc')
    this.setStateData(data.categoryArea, 'formData', 'categoryArea')  
    this.refs.form.validate()    
  },

  getValueList(id, array, name) {
    if (id == 'undefined') {
      return []
    } else {
      const arr = searchNode(id, array, name)
      let _array = []
      arr.map((item, i) => {
        _array.push(item.value)
      })
      return _array
    }
  },

  setData(type, key) {
    this.getList(type, (result) => {
      if (result && result.length > 0) {
        let array = []
        this.handleData(result, array)
        const list = this.state.list
        list[key] = array
        this.setState({
          list
        })
        if (type == 14) {
          const codeObj = searchNode(auth.user.tDepart.code, result, 'code')
          let codes = []
          codeObj.map((item, i) => {
            codes.push(item.code)
          })
          this.setStateData(codes, 'valueData', 'laiy')
          this.setStateData(auth.user.tDepart.code, 'formData', 'categorySource')  
        }
      }
    })
  },

  handleData(data, array) {
    data.map((item, i)=> {
      let obj = {}
      obj['label'] = item.name
      obj['value'] = item.code
      if (item.children.length > 0) {
        obj['children'] = []
        this.handleData(item.children, obj['children'])
      }
      array.push(obj)
    })
  },

  getList(type,callback){
    const self = this
    xhr({
      type: 'GET',
      url: URL.CATEGORY_GETCATEGORYLIST+`?type=${type}`,      
      success(result) {
        callback(result)  
      }
    })
  },  

  descChange(e){
    const value = e.target.value
    this.setStateData(value,'formData','desc')
  },

  rTypeChange(value){
    this.setStateData(value,'formData','rType')   
    this.refs.form.validate()  

    // 控制产品属性
    if (value == '方案素材') {
      this.setState({
        goodsAttrBo: false
      })
      this.rules.categoryGenre = () => {alert(1)}
    } else {
      this.setState({
        goodsAttrBo: true
      })
      this.rules.categoryGenre = (v) => {
        if (!v) return '请填写产品属性'
      }
    }
    
  },

  //标题
  titleChange(e){  
    this.setStateData(e.target.value,'formData','name')    
    this.refs.form.validate()   
  },
  
  tagChange(list){  
    this.setStateData(list.join(','),'formData','tag')  
    this.refs.form.validate() 
  },

  priceChage(e) {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    this.setStateData(value, 'formData', 'price')
    this.refs.form.validate()
  },

  priceBlur(e) {
    let value = e.target.value
    value = value.replace(/\D/g, '')
    if (!value) value = 0
    this.setStateData(value, 'formData', 'price')
    this.refs.form.validate()
  },

  ticChange(value){
    this.setStateFormValueData(value,'categoryGenre','tic')  
    this.refs.form.validate()
  }, 

  kanfChange(value){   
    this.setStateFormValueData(value,'categoryType','kanf') 
    this.refs.form.validate()
  },

  yuzChange(value){
    this.setStateFormValueData(value,'categoryLanguage','yuz') 
    this.refs.form.validate()   
  },

  laiyChange(value){
    this.setStateFormValueData(value,'categorySource','laiy')  
    this.refs.form.validate()  
  },  

  zuzChange(value){
    this.setStateFormValueData(value,'categoryDepart','zuz')
    this.refs.form.validate()
  },

  setStateFormValueData(value, formKey, valueKey) {
    const data = value[value.length - 1] 
    this.setStateData(data, 'formData', formKey)
    this.setStateData(value, 'valueData', valueKey)    
  },

  neicChange(value){
    this.setStateData(value.join(','),'formData','categoryContent') 
    this.setStateData(value,'valueData','neic')   
    this.refs.form.validate()
  },

  guocChange(value){    
    this.setStateData(value.join(','),'formData','categoryArea')
    this.setStateData(value,'valueData','guoc')
    this.refs.form.validate()
  },

  handleComplete(result){

    loadingAntd.destroy()
    this.setState({isUploadBtnDisabled:false})
    if(result.code == 500){
      msgdanger(result.message || '上传失败，请重试！')
      return;
    }

    this.setState({ status:1 })
    this.setStateData(result.data.name,'formData','name')  
    this.setStateData(result.data.id,'formData','id') 
    this.setState({type:result.data.type})
  }, 

  handleSave() {

    if(this.refs.form.validate()){
      this.setState({isUploadBtnDisabled:true})
      loadingAntd.loading('正在上传中...', 0);
    } 

    this.refs.form.save()
  },

  handleSuccess(res) { 

    loadingAntd.destroy()
    this.setState({isUploadBtnDisabled:false})

    if (res.code == 500) {
      msgdanger(res.message || '上传失败，请重试！')
      return;
    }
    message.success('保存成功！')
    this.setState({
      status: 2
    })
  },

  repeatUpload(){
    this.setState({
      status:0
    })
  },

  handleOpen() {
    this.refs.modal.open()
  },

  closeModel(){
    this.refs.modal.close()
  },

  templateNameChange(value) {

    this.setState({title:value})
    value ? this.setState({
      saveTemValidate: {
        flag: true,
        text: ''
      }
    }) : this.setState({
      saveTemValidate: {
        flag: false,
        text: '请填写模板名称'
      }
    })
  },

  saveTemplate() {

    if(!this.refs.form.validate()){
      this.refs.modal.close()
      return
    }

    const self = this,
      title = this.state.title,
      temp = this.state.templateData

    let isRepeat = false

    temp && temp.length >0 && temp.map((item,i)=>{
      if(item.name == title){
        isRepeat = true
      }
    })

    if (isRepeat) {
      this.setState({
        saveTemValidate: {
          flag: false,
          text: '模板名称已被使用，请更换后再试'
        }
      })
      return
    }

    if (!title) {
      this.setState({
        saveTemValidate: {
          flag: false,
          text: '请填写模板名称'
        }
      })
      return
    }    

    let obj = {}
        obj.name = title
        obj.rType = this.state.formData.rType
        obj.id = this.state.formData.id
        obj.categoryArea = this.state.formData.categoryArea
        obj.categoryContent = this.state.formData.categoryContent
        obj.categoryGenre = this.state.formData.categoryGenre
        obj.categoryType = this.state.formData.categoryType
        obj.categoryLanguage = this.state.formData.categoryLanguage
        obj.categoryDepart = this.state.formData.categoryDepart  
        obj.categorySource = this.state.formData.categorySource 

    xhr({
      type: 'POST',
      url: URL.DOC_SAVE_TEMPLATE,
      data: obj,
      success(result) {
        message.success('模板保存成功!')
        self.refs.modal.close()
        self.getMyTemplate()
      }
    })

  },

  setStateData(data, key, keyChild) {
    const obj = this.state[key]
    obj[keyChild] = data
    this.setState({ obj })   
  },

  bindFileChange(){

    const self = this

    jQuery('.bfd-upload').find('input[type="file"]')
      .on('change', function() {

        loadingAntd.loading('正在上传中...', 0)
        self.setState({ isUploadBtnDisabled: true })

        setTimeout(() => {
          loadingAntd.destroy()
          self.setState({ isUploadBtnDisabled: false })
          jQuery(this).val('')
        }, 60000)

      })
  },

  render() {  
    //文件上传
    const props = {
      action: URL.DOC_UPLOAD_DOCS,
      multiple: false,
      showFileList:false,
      onComplete: this.handleComplete,
      text:'上传资源'     
    } 

    return (
      <div className="poc-upload mw-box">
        <h5 style={{marginBottom:'10px',color:'#9e9e9e'}}>个人空间&nbsp;&gt;&nbsp;资源上传</h5>
        <h2 style={{marginBottom:'10px'}}>上传资源</h2>
        <div className="bg-white poc-box">
          <div className="poc-step">           
            <Steps height={40} current={this.state.status} >
              <Step title="选择资源"/>
              <Step title="补充信息"/>
              <Step title="完成上传" />             
            </Steps>
          </div> 
          {
            this.state.status == 0 ?
            (<div className="upload-btn-box" style={{pointerEvents:this.state.isUploadBtnDisabled ? 'none':'all'}}>
              <Upload {...props}>                   
              </Upload>  
              <Icon type="upload" style={{ position:'relative',bottom:'32px', right:'64px',color: '#fff', fontSize: '20px'}}/>
            </div>):
            null
          } 
          {
            this.state.status == 2 ?
            (<div className="text-center" >
              <div style={{fontSize:'30px',paddingTop:'40px'}}>
                <Icon type="chevron-circle-down" style={{color:'#42a5f5'}}/>&nbsp;恭喜，资源上传成功
              </div>                
              <Button style={{ marginTop:'40px', backgroundColor: '#ff9800'}} onClick={this.repeatUpload}>完成</Button>   
            </div>):
            null
          } 
        </div>    
        {
          this.state.status == 1 ?
          ( <div className="buc-box">
               <Form ref="form" action={URL.DOC_SAVE_DOCS} data={this.state.formData} rules={this.rules}  onSuccess={this.handleSuccess}>
                  <div className="header">
                    <h3 className="pull-left" style={{fontWeight:'bold'}}>请补充资源信息，完成上传</h3>
                    <Button type="primary" disabled={this.state.isUploadBtnDisabled} icon="arrow-right" className="pull-right" onClick={this.handleSave}>上传资源</Button>
                  </div>
                  <div className="buc-content bg-white">
                    <div className="row">
                      <div className="col-md-4">
                        <FormItem label="标题" required name="name" className="title-box">
                          <Input style={{width: '100%'}} value={this.state.formData.name} onChange={this.titleChange} />
                          {this.state.type == 'WORD' ? <Icon type="file-word-o" className="type-icon" style={{color:'#3f51b5'}}/> : null }  
                          {this.state.type == 'PDF' ? <Icon type="file-pdf-o" className="type-icon" style={{color:'#bd4040'}} /> : null }  
                          <div><Icon type="chevron-circle-down" style={{color:'#8bc34a'}}/>文档附件上传成功！</div>
                        </FormItem>                                               
                        <FormItem label="简介" name="desc">
                          <textarea placeholder="请输入描述" onChange={this.descChange} style={{ width: '100%', padding: '6px', border: '1px solid #ececec'}}></textarea>
                        </FormItem>
                        <FormItem label="标签" name="tag" help="标签之间请用空格分割">            
                          <MultipleInputSelect onChange={this.tagChange}/>
                        </FormItem>
                        <FormItem label="定价" name="price" className="price-box" help="建议：动态资讯：0-2分，分析稿件：2-5分，报告产品：5-20分">                          
                          <input style={{width:'40px',height:'30px',padding:'0 4px',border:'1px solid #ececec',borderRadius:'2px'}}                                 
                                 onChange={this.priceChage}
                                 onBlur={this.priceBlur}
                                 value={this.state.formData.price}/>
                          &nbsp;积分
                        </FormItem>                        
                      </div>
                      <div className="col-md-8" style={{borderLeft:'1px dotted #ececec'}}>
                        <FormItem label="我的模板" name="brand">
                          <Select style={{width: '96%'}} onChange={this.templateSelectChange}>
                            <Option>请选择</Option>
                            {
                             this.state.templateData.length>0 &&
                             this.state.templateData.map((item,i)=>{
                                  return (
                                    <Option key={i} value={item.id}>{item.name}</Option>                            
                                  )
                              })                                                           
                            }
                          </Select>
                        </FormItem>
                        <FormItem label="资源类型" required name="rType">                          
                          <Select style={{width:'96%'}} onChange={this.rTypeChange} value={this.state.formData.rType}>
                            <Option value="报告">报告</Option>
                            <Option value="动态信息">动态信息</Option>
                            <Option value="方案素材">方案素材</Option>
                          </Select>
                        </FormItem>
                        <FormItem label="知识属性" required name="categoryContent">                          
                          <MultipleTreeSelect value={this.state.valueData.neic}  url={`${URL.CATEGORY_GETCATEGORYLIST}?type=1`} onChange={this.neicChange} style={{width:'96%'}} />
                        </FormItem>
                       <FormItem label="产品属性" required={(this.state.goodsAttrBo ? true : false)} name="categoryGenre">                          
                            <Cascader value={this.state.valueData.tic} options={this.state.list.tic} onChange={this.ticChange} placeholder="请选择" displayRender={label=>label.join(' > ')}/>
                        </FormItem>
                        <FormItem label="刊发频率" required name="categoryType">                          
                            <Cascader value={this.state.valueData.kanf}  options={this.state.list.kanf} onChange={this.kanfChange} placeholder="请选择" displayRender={label=>label.join(' > ')}/>
                        </FormItem>                      
                        <FormItem label="语种" required name="categoryLanguage">                          
                            <Cascader value={this.state.valueData.yuz}  options={this.state.list.yuz} onChange={this.yuzChange} placeholder="请选择" displayRender={label=>label.join(' > ')}/>
                        </FormItem>
                        <FormItem label="地区" required name="categoryArea">                          
                          <MultipleTreeSelect defaultValue={this.state.defaultValue.guoc} value={this.state.valueData.guoc}   url={`${URL.CATEGORY_GETCATEGORYLIST}?type=7`} onChange={this.guocChange} style={{width:'96%'}} />
                        </FormItem>
                        <FormItem label="来源" required name="categorySource">                          
                            <Cascader value={this.state.valueData.laiy}  options={this.state.list.laiy} onChange={this.laiyChange} placeholder="请选择" displayRender={label=>label.join(' > ')}/>
                        </FormItem>    
                        <FormItem label="组织机构" name="categoryDepart">                          
                            <Cascader value={this.state.valueData.zuz}  options={this.state.list.zuz} onChange={this.zuzChange} placeholder="请选择" displayRender={label=>label.join(' > ')}/>
                        </FormItem> 
                        <div className="save-temp-box">
                          <span>*</span> 
                          您在设定分类的同时，可以将其保存为模板，以便下次使用。 
                          <Button onClick={this.handleOpen}>保存为模板</Button>                          
                        </div>                                        
                      </div>
                    </div>
                  </div>
              </Form>
              <Modal ref="modal" lock>
                <ModalHeader>
                  <h4 className="text-left">保存为模板</h4>
                </ModalHeader>
                <ModalBody>
                  <Row>
                    <Col col="md-3">
                      <label className="text-aglin-mymb">模板名称：</label>                                
                    </Col>
                    <Col col="md-6">
                        <ClearableInput onChange={this.templateNameChange}/>
                        {this.state.saveTemValidate.flag ? null : <div style={{color:'#cf7f7f',textAlign:'left'}}><Icon type="info-circle"/>{this.state.saveTemValidate.text}</div>}  
                    </Col>
                  </Row>
                  <div className="text-center" style={{marginTop:'10px'}}>
                    <Button onClick={this.saveTemplate}>确定</Button>
                    <Button type="minor" onClick={this.closeModel}>取消</Button>
                  </div>                               
                </ModalBody>
              </Modal>
            </div> ):null
        }                   
      </div>
    )
  }
})
 
export default UploadPoc