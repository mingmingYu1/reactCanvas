/**
 * 接口API，统一管理。
 */

module.exports  = {
  
  /*
   *首页
   */
  "DOC_GETDOC":"doc/getDocs",
  "DOC_GETINFO": "doc/getinfos",
  "DOC_UPLOAD_DOCS":"doc/uploadDocs",
  "DOC_GET_MY_TEMPLATE":"doc/getMyTemplate",
  "CATEGORY_GETCATEGORYLIST":"category/getCategoryList",
  "DOC_SAVE_TEMPLATE":"doc/saveTemplate",
  "DOC_SAVE_DOCS":"doc/saveDocs",
  "CONSULT_GETDOC": "doc/getinfos",
  "CONTENT_RECOMMEND": "doc/getRecommendDocs",
  "AUTHOR_RECOMMEND": "doc/getRecommendDocs",
  "DOWNLOAD_RANK": "doc/getTopDownloadDocs",
  "READ_RANK": "doc/getTopReadDocs",
  "REPORT_TOTAL": "doc/getDocCount",
  "CONSULT_TOTAL": "doc/getInfoCount",
  "NEW_COLLECT": "doc/getNeeds",
  "DOC_SAVE_NEED_DOCS":"doc/saveNeedDocs",
  "DOC_GET_COMMENT":"doc/getReqComment",
  "DOC_SAVE_COMMENT":"doc/saveReqComment",
  "DOC_GET_IMGS":"doc/getImgs",


  /*
   *部门空间
   */
  "QUERY_DOC_CONUT": "query/findDeptContributionDocCount",      
  "QUERY_DOC_NEAR":"query/ findDeptContributionDocsNear",
  "QUERY_RANK_LIST":"query/findDeptContributionRanklist",
  "QUERY_DEPT_STAFF":"query/findDeptStaffPerformance",
  "QUERY_DEPT_RESOURCE":"query/findDeptResourcePerformance",
  "QUERY_DEPT_TREND":"query/findDeptPerformanceTrend",
  "QUERY_FIND_DEPT_INFO_BY_ID":"query/findDeptInfoById",

  /*
   *个人空间
   */
  "QUERY_PERSONAL_CONTRIBUTION":"query/findPersonalContributionDocs",
  "QUERY_PERSONAL_COLLECTION":"query/findPersonalCollectionDocs",
  "QUERY_PERSONAL_DOWNLOAD":"query/findPersonalDownloadDocs",
  "QUERY_PERSONAL_SHARE":"query/findPersonalShareDocs",
  "QUERY_PERSONAL_RECEIVE":"query/findPersonalReceiveDocs",
  "QUERY_PERSONAL_REQUEST":"query/findPersonalRequest",
  "QUERY_PERSONAL_NEAR":"query/findPersonalCollectionNear",
  "QUERY_PERSONAL_PERSONALINFO":"user/queryById",
  "QUERY_PERSONAL_UPDATEINFO":"user/updateInfo",
  "QUERY_PERSONAL_MODIFYPWD":"user/modifyPwd",
  /*
   *资源绩效
   */
  "QUERY_PERFORMANCE_CONTRIBUTON":"query/findResourceDepartmentContribution",
  "QUERY_PERFORMANCE_USE":"query/findResourceDepartmentUse",
  "QUERY_PERFORMANCE_DISTRIBUTION":"query/findResourceDistribution",
  "QUERY_PERFORMANCE_CONNECTION":"query/findResourceConnection",
  "QUERY_PERFORMANCE_READING":"query/findResourceReadingRanking",
  "QUERY_PERFORMANCE_DOWNLOAD":"query/findResourceDownloadRanking",
  "QUERY_PERFORMANCE_LIKE":"query/findResourceLikeRanking",
  "QUERY_PERFORMANCE_COLLECT":"query/findResourceCollectRanking",

  /*
   * 资讯详情
   */
  "URL_DETAILS_DOWNLOAD":"doc/download",
  "URL_DETAILS_COLLECTION":"doc/saveCollection",
  "URL_DETAILS_SHARE":"doc/saveShare",
  "URL_DETAILS_FAVOUR":"doc/saveFavour",
  "URL_DETAILS_ARTICLE":"query/findResourceArticle",
  "URL_DETAILS_PUBLISH":"doc/detail/saveDocComment",
  "URL_DETAILS_COMMENT":"doc/detail/getDocCommentList",
  "URL_DETAILS_VISITLOG":"query/findResourceVisitLog",
  "URL_DETAILS_DOWNLOADLOG":"query/findDownloadLog",
  "QUERY_DEPT_ALL":"dept/queryAll",  //查询所有部门
  "QUERY_USER_BYDEPT":"user/queryUserByDept",  //查询用户



  /*
   *登录页面
   */
   "URL_LOGIN":"user/login",  //登录
   "URL_LOGOUT":"user/logout", //退出
   "URL_NOTICE":"notice/queryNew", //公告
   "QUERY_DOWNLOAD_HANDBOOK":"query/downloadUserHandbook",
  /*
  *资源地图
  */
  "QUERY_SYNOPSIS_DOWNLOAD": "doc/download",
  "QUERY_SYNOPSIS_COLLECTION": "doc/saveCollection",
  "QUERY_SYNOPSIS_SHARE": "doc/saveShare",
  "QUERY_SYNOPSIS_SROURCEQUERY": "source/query",
  "QUERY_SYNOPSIS_SROURCEINFO": "category/getCategoryList",

  /*
  *系统管理 组织管理
  */
  "MANAGE_GROUP_QUERY": "group/query",
  "MANAGE_GROUP_DELETE": "group/delete",
  "MANAGE_GROUP_ADD": "group/add",
  "MANAGE_GROUP_UPDATE": "group/update",

  /*
  *系统管理 部门管理
  */
  "MANAGE_DEPT_QUERY": "dept/query",
  "MANAGE_DEPT_QUERYALL": "group/queryAll",
  "MANAGE_DEPT_DELETE": "dept/delete",
  "MANAGE_DEPT_ADD": "dept/add",
  "MANAGE_DEPT_UPDATE": "dept/update",

  /*
  *系统管理 岗位管理
  */
  "MANAGE_POST_QUERY": "role/query",
  "MANAGE_POST_GROUPALL": "group/queryAll",
  "MANAGE_POST_RESOURCE_QUERY": "resource/query",
  "MANAGE_POST_DELETE": "role/delete",
  "MANAGE_POST_ADD": "role/add",
  "MANAGE_POST_DEPTALL": "dept/queryAll",
  "MANAGE_POST_UPDATE": "role/update",

  /*
  *系统管理 用户管理
  */
  "MANAGE_USER_MANAGE": "user/query",
  "MANAGE_USER_GROUPALL": "group/queryAll",
  "MANAGE_USER_DEPTALL": "dept/queryAll",
  "MANAGE_USER_DELETE": "user/delete",
  "MANAGE_USER_ROLEALL": "role/queryAll",
  "MANAGE_USER_ADD": "user/add",
  "MANAGE_USER_UPDATE": "user/update",
  "MANAGE_USER_RESETPWD": "user/resetPwd",

  /*
  *系统管理 用户反馈
  */
  "MANAGE_USERFEEDBACK": "doc/getFeedBack",

  /*
  *系统管理 操作日志
  */
  "MANAGE_OPERATE_LOG": "log/getOptionLog",

  /*
  *我的反馈
  */
  "MY_FEEDBACK": "doc/saveMyFeedBack",

  "NOTICE_LIST": "notice/query",
  "NOTICE_ADD": "notice/add",
  "NOTICE_DELETE": "notice/delete"
}