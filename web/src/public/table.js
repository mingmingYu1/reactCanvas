import _ from 'underscore'

const _table = {
  exportData:[],
  /*
  * datamap为查询的数据名称 ["name","test"]，param为查询的文本
  * */
  seachTableData: function (pageData,dataMap,param) {
    pageData = $.grep(pageData, function(n,i){
      var bool = false;
      $.each(dataMap, function(i,v){
        if(typeof(n[v]) == "string"){
          //url查询用完全匹配
          if (v === "url" || v === "raw_url"){
            bool=bool || n[v.key].toLowerCase() === param.toLowerCase();
          }else{
            bool=bool || n[v].toLowerCase().indexOf(param.toLowerCase()) > -1;
          }
        }
      });
      return bool;
    });
    return pageData;
  },
  /*
   * datamap为查询的数据名称 ["name","test"]，param为查询的文本
   * */
  seachTableData1: function (pageData,param) {
    pageData = $.grep(pageData, function(n,i){
      var bool = true;
      $.each(param, function(i,v){
        if(typeof(n[v.name]) == "string"){
          bool=bool && n[v.name].toLowerCase().indexOf(v.value.toLowerCase()) > -1;
        }
        if(typeof(n[v.name]) == "number"){
          bool=bool && n[v.name] == parseInt(v.value);
        }
      });
      return bool;
    });
    return pageData;
  },
  updateDataTable: function(pageControl,tableSet) {
    //实现页面缓存分页跳转和查询功能by-ldd
    var dataMap =  _.clone(pageControl.dataMap);
    //ajax查询出的原始数据pageControl.tableData
    var pageData =  _.clone(pageControl.tableData);
    var pageSize = pageControl.PageRow;

    var param = tableSet.seach;
    var sort = tableSet.order

    //查询出需要筛选的数据
    if(!_.isEmpty(param) && param != undefined){
      if(_.isArray(param)){
        pageData = this.seachTableData1(pageData,param);
      }else{
        pageData = this.seachTableData(pageData,dataMap,param);
      }

    }
    //排序
    if(sort.field != undefined){
      pageData= pageData.sort(this.sort_by(sort.field,sort.type));
    }
    //导出的数据等于当前排序查询后的数据
    this.exportData=pageData;

    //分页出当页数据
    let length=pageData.length;

    const Data = _.chain(pageData)
        .rest((tableSet.currentPage-1)*pageSize)//第n条开始
        .first(pageSize)//每页pagesize条
        .value();

    const tablePageData={
      "totalList":Data,
      "currentPage":tableSet.currentPage,
      "totalPageNum": length
    }
    return tablePageData;
  },
  sort_by :function(name,sorttype){
    return function(o, p){
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          if(sorttype=="asc" ){return a <b ? -1 : 1;}
          else{ return a > b ? -1 : 1; }
        }
        return typeof a < typeof b ? -1 : 1;
      }
      else {
        throw ("error");
      }
    }
  }
}


export default _table