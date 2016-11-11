import _ from 'underscore'

const formatTool = {
  //清理表单
  cleanFrom:function(id) {
    $("#"+id).find("input").val("");
    $("#"+id).find("textarea").text("");
  },
  fillValues:function(id,valuesObj){
    const _this = this;
    const from=$("#"+id);
    let name="";
    //填充input:text
    from.find("input:text").each(function () {
      $(this).val("");
      name=$(this).attr("name");
      if (name && valuesObj[name]) {
        $(this).val(valuesObj[name]);//填充值
      }
    });
    //填充input:hidden
    from.find("input[type=hidden]").each(function () {
      $(this).val("");
      name=$(this).attr("name");
      if (name && valuesObj[name]) {
        $(this).val(valuesObj[name]);//填充值
      }
    });
    //填充input:textarea
    from.find("textarea").each(function () {
      $(this).val("");
      name=$(this).attr("name");
      if (name && valuesObj[name]) {
        if (_.isObject(valuesObj[name])){
          if(name=="emails"){
            $(this).val(_this.replaceHTML(valuesObj[name].join(";")));//填充值
          }
          else{
            $(this).val(_this.replaceHTML(valuesObj[name].join(",")));//填充值
          }
        }
        else{
          $(this).val(_this.replaceHTML(valuesObj[name]));//填充值
        }

      }
    });
    //input:checkbox
    from.find("input:checkbox").each(function () {
      $(this).attr("checked", false);
      name=$(this).attr("name");
      var value=$(this).attr("value");
      if (name && valuesObj[name]) {
        if (_.isObject(valuesObj[name])){
          if(_.contains(valuesObj[name],value)){
            $(this).prop("checked", true);
          }
        }
        else{
          $(this).prop("checked", true);
        }

      }

    });
    //input:radio
    from.find("input:radio").each(function () {
      if ($(this).attr("name") && $(this).val() == valuesObj[$(this).attr("name")]) {
        $(this).attr("checked", "checked");
      }
    });

    //input:radio
    from.find(".fromText").each(function () {
      if ($(this).attr("name")) {
         $(this).html(valuesObj[$(this).attr("name")])
      }
    });

  },
  replaceHTML:function(str) {
    str = str.replace(/<[^>]+>/g, "");
    re1 = new RegExp("///", "g");
    re = new RegExp("//n", "g");
    rr = new RegExp("//t", "g");
    rn = new RegExp("//r", "g");
    str = str.replace(rn, '');
    str = str.replace(re, '\n');
    str = str.replace(rr, ' ');
    str = str.replace(re1, "/");
    //去右边的空格
    str = str.replace(/(\s*$)/g, "");
    return str;
  },
  replaceStr:function(str) {
    var s = str;
    if(typeof  s == "string"){
      s = s.replace(/<[^>]+>/g, "");
      s = s.replace(/>/g, "");
      s = s.replace(/</g, "");
    }
    //s = s.replace(/[ ]/g, "");
    return s;
  },
  number: function(data) {
    if(typeof(data)=="number") {
      var s=data.toString();
      return this.string(s);
    }
    else {
      return data;
    }
  },
  datatimeStr:function(text){
    var html_="";
    var time = 0
    if (timeFilterControl.granularity  == "week"){
      if( formatTool.NewDate(text).getTime()+6*24*3600*1000 > new Date().getTime()){
        time = new Date().getTime();
      }else{
        time = formatTool.NewDate(text).getTime()+6*24*3600*1000;
      }
      html_=text+"~"+formatTool.date(new Date(time));
    }
    else if (timeFilterControl.granularity  == "month"){
      var max_date = new Date(text.slice(0,4), parseInt(text.slice(5,7)), 0);
      if (max_date.getTime() > new Date().getTime())
      {
        max_date = new Date();
      }
      html_=text+"~" + formatTool.date(max_date);
    }
    else if (timeFilterControl.granularity  == "hour" || typeof text == "number" ) {
      var hour_str =("0" +text).slice(-2);
      var next_hour_str = ('00'+(parseInt(text)+1)).slice(-2);
      html_ = hour_str + ':00~' + next_hour_str +':00';
    }else{
      html_=text;
    }
    return html_;
  },
  NewDate:function (str) {
    var day=str.split(' ')[0];
    day=day.split('-');
    var date=new Date();
    date.setUTCFullYear(day[0], day[1]-1, day[2]);
    if(str.split(' ').length >1 ){
      var hours= str.split(' ')[1];
      hours=hours.split(':');
      date.setUTCHours(hours[0]-8,hours[1], hours[2] == undefined?0:hours[2], 0);
    }else{
      date.setUTCHours(0, 0, 0, 0);
    }

    return date;
  },
  time_clock:function(s_num) {
    if(parseInt(s_num)){
      s_num= parseInt(s_num);
      var time="";
      var seconds = s_num % 60;
      var minutes = parseInt((s_num / 60)%60);
      var hours = parseInt(s_num /3600);
      time += ('00'+hours).slice(-2);
      time += ':';
      time += ('00'+minutes).slice(-2);
      time += ':';
      time += ('00'+seconds).slice(-2);
      return time==""?'00:00:00':time;
    }else{
      return '--';
    }

  },
  string: function(data) {
    if(typeof(data)=="string") {
      var temp=data.split(".");
      data=temp[0];
      if(data.length>3){
        var len=Math.ceil(data.length/3);
        var t=data.length;
        var tData=data.slice(t-3, t);
        for(var i=1; i<len; i++) {
          tData=data.slice(t-3*(i+1), t-3*i)+','+tData;
        }
        if(t-3*i<0) {
          tData=data.slice(0, t-3*i+3)+tData;
        }
      }
      else {
        var tData=data;
      }

      if(temp.length===2) {
        tData=tData+"."+temp[1];
      }
      return tData;
    }
    else {
      return data;
    }
  },
  percent: function(data, n) {
    n = n== undefined?2:n;
    if (parseFloat(data)){
      return (parseFloat(data)*100).toFixed(n)+"%";
    }else{
      return "--";
    }

  },
  text: function(str, len) {
    if(str.length>len) {
      str = str.slice(0, len-3)+"...";
      return str.replace(/>/g, "&gt;");
    }
    else {
      return str=str.replace(/>/g, "&gt;");
    }
  },
  date: function(dd, flag) {
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    if(m<10)
    {
      m='0'+m;
    }
    var d = dd.getDate();
    if(d<10)
    {
      d='0'+d;
    }
    if(flag==null){
      return y+"-"+m+"-"+d;
    }
    else if(flag=="/") {
      return Date.parse(y+"/"+m+"/"+d);
    }
    else {
      return Date.parse(y+flag+m+flag+d);
    }
  }
};


export default formatTool