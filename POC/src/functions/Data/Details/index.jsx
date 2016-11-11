import './index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import URL from 'public/url'
import { Modal, Button ,Tooltip} from 'antd'
import xhr from 'public/xhr'
import {Select, Option} from 'bfd/Select'
import Fetch from 'bfd/Fetch'
import message from 'bfd/message'
import DataTable from 'bfd/DataTable'
import ShareModal from 'public/ShareModal'
import env from '../../../env'
import auth from 'public/auth'

export default React.createClass({
  getInitialState(){
    return {
      "env":env.baseUrl,
      "fontChange":"15",
      "ShareModalVisible":false,
      "pviewVisible":false,
      "downloadVisible":false,
      "pviewColumn":[{"title":"序号","key":"sequence"},
                {"title":"阅读人","key":"name"},
                {"title":"阅读时间","key":"date"},
                {"title":"所属部门","key":"dept"},
                ],
      "downloadColumn":[{"title":"序号","key":"sequence"},
                {"title":"下载人","key":"name"},
                {"title":"下载时间","key":"date"},
                {"title":"所属部门","key":"dept"},
      ],
       "pviewParam":{
          "id":this.props.location.query.id,//this.props.location.params.id,
          "pageCurrent":1,
          "pageSize":10,
      },
      "downloadParam":{
          "id":this.props.location.query.id,//this.props.location.params.id,
          "pageCurrent":1,
          "pageSize":10,
      },
      "pviewTableData":{},
      "downloadTableData":{},
      "backgroundDisplay":"block",
      'articleParam':{},     
      "id":this.props.location.query.id,//this.props.location.state.id,
      "userId":auth.user.id,
      "limit":3,
      "curPageNum":0,
      "leftPageNum":0,
      "isCollected":false,
      "isMarked":false,
      "comments":[],
      "article":{"title":'',
                 "publishTime":"",
                 "author":"",
                 "pviews":0,
                 "downloads":0,
                 "size":"",
                 "contents":[],
                 "type":"word",
                 "totalPageNum":0,
                
      },
    }
  },
  onOptionsClick(option){
  //  this.showModal();
    switch(option){
      /*case 'download':
        this.onDownload();
      break;*/
      case 'share':
        this.showShareModal()
      break;
      case 'collection':
        this.onCollection();
      break;
      case 'favour':
        this.onFavour();
      break;
    }
  },
  onDownload(){
  //  this.showModal();
    xhr({
      type:"GET",
      url:URL.URL_DETAILS_DOWNLOAD+"?id="+this.state.id,
      success:(res) =>{
        
      }
    })
  },
  // onShare(){
  // var _this = this
  //   xhr({
  //     type:"GET",
  //     url:URL.URL_DETAILS_SHARE+'?id='+this.state.id+"&toUserIds="+"2",
  //     success(res){
  //       if(res.message && res.message === "不能重复分享"){
  //         console.log("res",res);
  //       }
  //     },
  //   })
  // },
  onCollection(){
    xhr({
      type:"GET",
      url:URL.URL_DETAILS_COLLECTION+'?id='+this.state.id,
      success:(res)=>{
         res.flag && message.success("收藏成功！")
         this.setState({isCollected:true})
      }
    })
  },
  onFavour(){
    xhr({
      type:"GET",
      url:URL.URL_DETAILS_FAVOUR+'?dId='+this.state.id,
      success:(res)=>{
        res.flag && message.success("点赞成功！")
    //    !res.flag && message.danger("不能重复点赞！")
         this.setState({isMarked:true})
      }
    })
  },
  showLogin(){
    this.showModal();  //TODO:是否有权限请求
  },
  showModal(){
    this.setState({"visible":true})
  },
  handleModalOk(){
    this.setState({"visible":false})
  },
  onMoreRead(){
  //  this.showModal();    //TODO:是否有权限请求
  //  let limit = this.state.article.totalPageNum - this.state.curPageNum
    this.getArticle(10);  
  },
  showPview(){
    this.setState({pviewVisible:true})
  },
  handlePviewModalCancel(){
    this.setState({pviewVisible:false})
  },
  showDownload(){
    this.setState({downloadVisible:true})
  },
  handleDownloadModalCancel(){
    this.setState({downloadVisible:false})
  },
  handleModalCancel(){

  },
  showShareModal(){
    this.setState({"ShareModalVisible":true})
  },
  handleShareModalCancel(){
    this.setState({"ShareModalVisible":false})
  },
  onPviewPageChange(currentPage){
    var pviewParam = {
          "id":this.state.id,
          "pageCurrent":currentPage,
          "pageSize":this.state.pviewParam.pageSize,
    };
    this.setState({pviewParam:pviewParam})
  },
  onDownloadPageChange(currentPage){
    var pviewParam = {
          "id":this.state.id,
          "pageCurrent":currentPage,
          "pageSize":this.state.pviewParam.pageSize,
    };
    this.setState({downloadParam:pviewParam})
  },
  handlePviewTableAjax(res){
    let data = {
              "totalList":res.totalList,
              "totalPageNum":parseInt(res.totalPageNum),
              "currentPage":parseInt(res.currentPage),
    }
    this.setState({pviewTableData:data})
  },
  handleDownloadTableAjax(res){
    let data = {
              "totalList":res.totalList,
              "totalPageNum":parseInt(res.totalPageNum),
              "currentPage":parseInt(res.currentPage),
    }
    this.setState({downloadTableData:data})
  },
  getComment(){
    xhr({
        type:"GET",
        url:URL.URL_DETAILS_COMMENT+'?dId='+this.state.id,
        success:(res) => {
          res.map((item, i) => {
            item.time = new Date(parseInt(item.time)).toLocaleString().replace(/:\d{1,2}$/,' ')
            return item
          })
         this.setState({"comments":res})
        } 
      })
  },
  onPublishComment(){

/*    console.log($("#test").val())

    return;*/
 //   this.showModal();  //TODO:是否有权限请求
    if(this.refs.ownComment.value == ""){
      message.success("请先填写评论！")
      return;
    }
    let data = {"dId":this.state.id,
                "userId":this.state.userId,
                "criticisms":this.refs.ownComment.value
              };
    xhr({
      type:"POST",
      url:URL.URL_DETAILS_PUBLISH,
      data:data,
      success:(res)=>{
        message.success("评论成功！")
        this.getComment();
        this.refs.ownComment.value = ""
      }
    })
  },
  getArticle(limit=3){
    let  data = {"id":this.state.id,
                 "userId":this.state.userId,
                 "limit":limit,
                 "curPageNum":this.state.curPageNum
               };
 //this.setState({"articleParam":data})
    xhr({
      type:"GET",
      url:URL.URL_DETAILS_ARTICLE+'?data='+JSON.stringify(data), 
      success:(res) => {
        var contents = this.state.article.contents
        res.contents.map((item, i) => {
          return contents.push(item)
        })
        res.contents = this.state.article.contents;
        var curPageNum = this.state.curPageNum + limit ;
        this.setState({"article":res,"curPageNum":curPageNum,limit:limit,isCollected:res.isCollected,isMarked:res.isMarked})
        window.scrollBy(0,-300);
        /*if(this.state.curPageNum >= this.state.article.totalPageNum){
           let back = document.getElementsByClassName('background')
           for(let i=4; i<this.state.article.totalPageNum; i++){
            if(back[i]) back[i].style.display = "none"
           }
        }*/
      }
    })
  },
  getArticleSuccess(res){
    var contents = this.state.article.contents
        res.contents.map((item, i) => {
          return contents.push(item)
        })
        res.contents = this.state.article.contents;
        var curPageNum = this.state.curPageNum + this.state.articleParam.limit ;
        this.setState({"article":res,"curPageNum":curPageNum})
  },
  handleBackground(){
    let back = document.getElementsByClassName('background')
    if(back.length == 0) return;
    if(!back[0].style || !back[0].style["background-size"]) return;
   // let display = back[0].style["background-size"] == "0%" ?"100%":"0%";
   let display = "0%";
    for(var i=0; i < back.length; i++){
      back[i].style["background-size"] = display
    }
  //  back[0].style["background-size"] = (display == "0px" ?"100%":"0px")
  },
  handleScroll({target}){
   /*let articleDom = ReactDOM.findDOMNode(this.refs.articleDom)
    let aScrollHeight = articleDom.scrollHeight;
    let aScrollTop = articleDom.scrollTop;
    let perHeight =aScrollHeight/pageNum;
    let topPageNum = parseInt(aScrollTop/perHeight);*/

    /*let pageNum = this.state.curPageNum >= this.state.article.totalPageNum ? this.state.article.totalPageNum :this.state.curPageNum;
    let perHeight = target.scrollHeight/pageNum;
    let topPageNum = parseInt(target.scrollTop/perHeight);
    let back = document.getElementsByClassName("background")
    for(let i=topPageNum-3; i >= 0; i--){
       if(back[i]) back[i].style.display = "none"
    }
    for(let i=topPageNum+1; i < topPageNum+2 && i < this.state.article.totalPageNum; i++){
     if(back[i]) back[i].style.display = "block"
    }
    for(let i=topPageNum+3; i < this.state.article.totalPageNum; i++){
       if(back[i])  back[i].style.display = "none"
    }*/
  },
  fontChange({target}){
    this.setState({fontChange:target.value})
  },
  componentDidMount(){
    this.getComment();
    this.getArticle();
    this.onFeedback()
 //   console.log("request:", this.props.location.query.id, window.location.search.substr(1));
  },
  // articleWrap(str) {
  //   let strReg = /\\r\\n/g
  //   let strReg2 = /\\n/g
  //   let strReg3 = /\\t/g
  //   return str.replace(strReg, '<br/>').replace(strReg2, '<br/>').replace(strReg3, '&nbsp;&nbsp;&nbsp;&nbsp;')
  // },
  onFeedback(){
    $('#main-feedback').append('<script type="text/javascript" src="http://172.16.184.116:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a"></script>');
  },
  render(){
    const CommentItems = this.state.comments.map((item,i )=> {
      return( 
       <div key={i} className="comment-item" id="main-feedback">
            <div className="com-photo">
              <img src={item.pic} alt="" />
            </div>
            <div className="com-content">
              <dl>
                <dt><span className="item-name">{item.name}</span><span className="item-time">{item.time}</span></dt>
                <dd>{item.criticisms}</dd>
              </dl>
            </div>
        </div>
        )
    });
    const pageInnerStyle = {
      width:this.state.article.width,
      height:this.state.article.height
    };
  //  const clientWid = document.body.clientWidth;
  const contentWid = document.getElementById("all_article_content") && document.getElementById("all_article_content").clientWidth //|| 0
  //  const contentWid = document.getElementById("all-article-content") && document.getElementById("all-article-content").clientWidth || 0
  //  console.log("clientWid:",clientWid,contentWid)
  //  const scaleValue = contentWid / this.state.article.width;
    const scaleStyle = {
               "height":this.state.article.height  +"px",
               "width":this.state.article.width + "px",
    };
    const ArticlePages = this.state.article.contents.map((item, i) => {
      // let articleCon = this.articleWrap(item)
      let articleCon = item
      return (
          <div key={i} className="article-page" id={"reader-page-"+(i+1)} style={{width:contentWid < this.state.article.width ? this.state.article.width+20+'px': '', border: this.state.article.type !== "consulting" ? '1px solid':'none'}}>
            <div className={"page-item type-pdf"} style={{}}>
              <div className="page-inner " style={scaleStyle} dangerouslySetInnerHTML={{__html:articleCon}}></div>
              {this.state.article.type !== "consulting" && 
                 <div className="pagination" style={{top:this.state.article.height+"px"}}>第{i+1}页/总共{this.state.article.totalPageNum}页</div>
              }
            </div>
          </div>       
        )
    });
    return (
      <div className="details-page">
        <div className="col-md-10 details-content">
          <div className="title">    
            <h2><i className={"fa fa-file-"+this.state.article.type+"-o"}></i>{this.state.article.title}</h2>
            <h6>
	            <span>{this.state.article.author}</span>
              <span>{this.state.article.publishTime.slice(0,10)} &nbsp;{this.state.article.type === "consulting" && this.state.article.publishTime.slice(11) == "00:00:00"?"":this.state.article.publishTime.slice(11)}</span>
              <span>{this.state.article.source}</span>
              <span><a onClick={this.showPview}>{this.state.article.pviews}人阅览</a></span>
              <span><a onClick={this.showDownload}>{this.state.article.downloads}次下载</a></span>
             { this.state.article.type !== "consulting" && 
                (<span><span>文档大小：{this.state.article.size}</span>
               <span style={{float:"right"}}><a href="javascript:;" onClick={this.handleBackground}>文字重影看不清？试试点这里</a></span>
               </span>)
             }

            
             { this.state.article.type === "consulting" && (<span style={{float:"right"}} >字体大小：
                <ul className="font-change">
                  <li className={this.state.fontChange == "15"?"active":""} value="15" onClick={this.fontChange}>小</li>
                  <li className={this.state.fontChange == "17"?"active":""} value="17" onClick={this.fontChange}>中</li>
                  <li className={this.state.fontChange == "20"?"active":""} value="20" onClick={this.fontChange}>大</li>
                </ul>            
              </span>) }
            </h6>
          </div>
          <div ref="articleDom" className="article" style={{height:this.state.article.height+160+"px",fontSize:this.state.fontChange}} onScroll={this.handleScroll}>
           { /*<Fetch url={URL.URL_DETAILS_ARTICLE+'?data='+JSON.stringify(this.state.articleParam)} onSuccess={this.getArticleSuccess}>
            </Fetch> */}
            <div className="all-article-content" ref="allArticleContent" id="all_article_content" style={{width: contentWid < this.state.article.width ? this.state.article.width+40+"px" : ''}} >
              {ArticlePages}
            </div> 
          </div>       
          <div className="download">
            <h3>下载文档到电脑</h3>
            <div className="options">
              <Tooltip title="下载">
              <Button type="primary" onClick={this.onOptionsClick.bind(this,'download')}>
                <a href={this.state.env+"/"+URL.URL_DETAILS_DOWNLOAD+"?id="+this.state.id} target="_blank"><i className="fa fa-download"></i>
                下载</a>
              </Button>
              </Tooltip>
              <Tooltip title="分享">
              <Button type="primary" onClick={this.onOptionsClick.bind(this,'share')}><i className="fa fa-share-alt"></i>分享</Button>
              </Tooltip>
              <Tooltip title="收藏">
              <Button type="primary" onClick={this.onOptionsClick.bind(this,'collection')} className={this.state.isCollected ? 'not-click':''}><i className="fa fa-heart"></i>收藏</Button>
              </Tooltip>
              <Tooltip title="点赞">
              <Button type="primary" onClick={this.onOptionsClick.bind(this,'favour')} className={this.state.isMarked?'not-click':''}><i className="fa fa-thumbs-up"></i>点赞</Button>
              </Tooltip>
            </div>
            <div className="left-read">
              <div className={"more-page "+(this.state.curPageNum >= this.state.article.totalPageNum ?"no-display":"has-display" )}>
                <h5>
                  <i className="fa fa-unlock"></i>还剩{(this.state.article.totalPageNum - this.state.curPageNum)}页未读，
		请<span className="more-read" onClick={this.onMoreRead}>点击阅读下10页</span>
                </h5>
                <i className="fa fa-angle-down"></i>
              </div>
              <div className={"no-more-page "+(this.state.curPageNum >= this.state.article.totalPageNum ? "has-display":"no-display")}>
                <h5>已显示全部内容</h5>
              </div>
            </div>    
          </div>
          <div className="own-comment">
            <h3>您的评论</h3>
            <div>
              <textarea placeholder="写点评论支持下文章贡献者" ref="ownComment" id="test">
              </textarea>
              <div className="publish-com">
                <Button type="primary" onClick={this.onPublishComment}>发表评论</Button>
              </div>
            </div>
          </div>
          <div className="user-comment">
            <h3><span>用户评论</span><span className="com-num">（{this.state.comments.length}）</span></h3>
            <div className="comment-list">
              <div className={"comment-item "+(this.state.comments.length==0? "has-com" :"no-com" ) }>
                暂时，没有用户评论
              </div>           
              {CommentItems}    
              {/*<Fetch url={URL.URL_DETAILS_COMMENT+'?data={"id":"'+this.state.id+'""}'} onSuccess={res => {this.setState({comments:res.data})}}>
              </Fetch> */}   
            </div>
          </div>
        </div>
        <div className="clearfix"> </div>
        <Modal title="模态框啊" visible={this.state.visible} onOk={this.handleModalOk} onCancel={this.handleModalCancel}>
          <p>您还未登录，请先<a href="">登录去...</a></p>
        </Modal>
        <Modal title={"浏览记录("+this.state.article.pviews+")"} visible={this.state.pviewVisible} 
          onCancel={this.handlePviewModalCancel} onOk={this.handlePviewModalCancel}>
          <Fetch url={URL.URL_DETAILS_VISITLOG+'?data='+JSON.stringify(this.state.pviewParam)} onSuccess={this.handlePviewTableAjax}>
          </Fetch>
          <DataTable data={this.state.pviewTableData} onPageChange={this.onPviewPageChange} column={this.state.pviewColumn}
            showPage="true" howRow={this.state.pviewParam.pageSize} >
          </DataTable>
        </Modal>
        <Modal title={"下载记录("+this.state.article.downloads+")"} visible={this.state.downloadVisible} 
          onCancel={this.handleDownloadModalCancel} onOk={this.handleDownloadModalCancel}>
          <Fetch url={URL.URL_DETAILS_DOWNLOADLOG+'?data='+JSON.stringify(this.state.downloadParam)} onSuccess={this.handleDownloadTableAjax}>
          </Fetch>
          <DataTable data={this.state.downloadTableData} onPageChange={this.onDownloadPageChange} column={this.state.downloadColumn}
            showPage="true" howRow={this.state.downloadParam.pageSize} >
          </DataTable>
        </Modal>
        <ShareModal articleId={this.state.id}  visible={this.state.ShareModalVisible}  onCancleClick={this.handleShareModalCancel}> 
        </ShareModal>
      </div>
      )
  }
})