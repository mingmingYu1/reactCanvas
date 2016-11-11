/**
 * Bubble chart based on d3.js
 */
import d3 from 'd3'
import _ from 'underscore'
import ContextMenu from "public/ContextMenu"
import message from 'bfd-ui/lib/message'

const constructor=function(config) {
    "use strict";
    this._init(config);
}


constructor.prototype = {
    _getOptions: function(opt){
        return $.extend({
            dragNode: true,        //拖拽节点
            dragEdge: true,        //拖拽线
            mixed: true,           //混合模式
            alignment: 'default',  //horizontal、vertical、default
            direction: 'start'     //从线的哪端拖动
        }, opt);
    },
    $optoins: null,
    _init: function(config){

        this.$options = this._getOptions(config);
        this._initDrag(config);
    },
    _initDrag:function(config) {
        var me = this;
        var isDraggring = false;
        var draggingNode;
        var draggingEdge;
        var draggingEdgeData={};
        var mixedTimer;
        var dragTimer;
        var nodeCoords = [0, 0];

        const {
            container, sizeSet,index, name, value
            } = config
        const data = JSON.parse(JSON.stringify(config.data));
        const width =$(".Container")[0].clientWidth || sizeSet.Width
        const height = $(".Container")[0].clientHeight || sizeSet.Height

        const margin = {top: -5, right: -5, bottom: -5, left: -5}

        //path路径位置
        function diagonal(d) {
            var p = new Array();
            var  _source_y = d.source.y;
            var  _source_x = d.source.x;
            var  _target_y = d.target.y;
            var  _target_x= d.target.x;
            if (d.start == "BT"){
                _source_y = (_source_y + sizeSet.rectHeight);
                if(d.source.y == d.target.y ){
                    _target_y = _source_y;
                }

                var m = (_source_x + _target_x) / 2;
                var n = (_source_y + _target_y) / 2;
                p[1] = _source_x+ "," + n;
                p[2] = m + "," + n;
            }
            if (d.start == "LR"){
                _source_y = (_source_y + sizeSet.rectHeight/2);
                _source_x = (_source_x +  sizeSet.rectWidth/2);
                if(d.source.x == d.target.x){
                    _target_x = _source_x;
                }else{
                    _target_x = (_target_x - sizeSet.rectWidth / 2);
                }
                _target_y = (_target_y + sizeSet.rectHeight / 2);

                var m = (_source_x + _target_x) / 2;
                var n = (_source_y + _target_y) / 2;
                p[1] = m+ ","+_source_y;
                p[2] = m + "," + n;

            }

            p[0] =  _source_x+ "," + _source_y;
            p[3] = _target_x + "," + _target_y;

            return "M" + p[0] + "Q" + p[1] + " " + p[2] + " T" + p[3];
        }

        function drawingEdge(draggingdata){
            draggingEdge= d3.select("#flowchart"+index).select(".link")
                .append("path")
                .attr("d", diagonal(draggingdata))
                .attr("fill", "none")
                .attr("class", "templine")
                .attr("stroke", "#42a5f5")
                .attr("stroke-width", 1)
                .attr("marker-start", "url(#startCircle)")
                .attr("marker-mid", "url(#midArrow)")
                .attr("marker-end", "url(#midArrow)");

        }

        //检查连线终点成立
        function checkLineEnd (sourceEvent) {
            const graph_node = $(sourceEvent.target).parents(".graph-node").length;
            const data =  _.isEqual(draggingEdgeData.source,sourceEvent.target.__data__)
            return graph_node && !data
        }
        const zoom = d3.behavior.zoom()
            .scaleExtent([0.2,2])
            .scale(config.data.scale)
            .translate(config.data.translate)
            .on("zoom", function () {
                config.data.translate = d3.event.translate;
                config.data.scale = d3.event.scale;
                console.log(d3.event.scale)
                const slider = (d3.event.scale/2).toFixed(2);
                $(container).parent().find(".flowslider .slider").css("left",slider*100+'%')
                $(container).parent().find(".flowslider .selected").css("width",slider*100+'%')
                $(container).parent().find(".flowslider .slider .text").text(slider*2);

                center.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            });

        var drag = d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on("dragstart", d => {
                d3.event.sourceEvent.stopPropagation()
                const sourceEvent = d3.event.sourceEvent;
                //可划线
                if(me.$options.dragEdge){
                    //节点的端点
                    if(d3.select(sourceEvent.target).classed('drawpathend')){
                        isDraggring = true;
                        draggingEdgeData.source =d;
                        if (d3.select(sourceEvent.target).classed('path-node_tb') || d3.select(sourceEvent.target.parentNode).classed('path-node_tb')){
                            draggingEdgeData.start='BT'
                        }else{
                            draggingEdgeData.start='LR'
                        }
                        draggingEdgeData.target ={x:d.x,y:d.y};
                        drawingEdge(draggingEdgeData)
                    }else{
                        isDraggring = false;
                    }
                }
            })
            .on("drag", function (d) {
                const sourceEvent = d3.event.sourceEvent;
                //可拖拽节点
                if(me.$options.dragNode && !isDraggring){
                    d.x = d3.event.x, d.y = d3.event.y;
                    d3.select(this.parentNode).attr("transform", "translate(" + d.x + "," + d.y + ")");
                    path.filter(function (l) {
                        return l.source === d || l.target === d;
                    }).attr("d", diagonal);
                }
                else{
                    //拖拽到吸附区
                    if(checkLineEnd(sourceEvent)) {
                         $(sourceEvent.target).parents(".graph-node").parent().addClass('selected');
                         draggingEdgeData.target = sourceEvent.target.__data__
                    }else{
                        //拖拽终点为鼠标终点
                        if(draggingEdgeData.start == "BT"){
                            draggingEdgeData.target ={x:d3.event.x,y:d3.event.y+sizeSet.rectHeight};
                        }else{
                            draggingEdgeData.target ={x:d3.event.x+sizeSet.rectWidth,y:d3.event.y};
                        }
                    }
                    draggingEdge.attr("d", diagonal(draggingEdgeData));
                }

            })
            .on("dragend", d => {
                const sourceEvent = d3.event.sourceEvent;
                d3.select(container).select(".selected").classed("selected", false);
                d3.select(".templine").remove();
                if(isDraggring && checkLineEnd(sourceEvent)){
                    const  newlink={"source":1,"target":0,start:draggingEdgeData.start}
                    //连线是否已存在
                    const list = path.filter(function (l) {
                        return _.isEqual(draggingEdgeData,l);
                    })

                    if(list == 0){
                        //获取连接点的下标
                        data.nodes.map(function(d,i){
                            "use strict";
                            if (_.isEqual(draggingEdgeData.source,d) ){
                                newlink.source = i;
                            }
                            if (_.isEqual(draggingEdgeData.target,d) ){
                                newlink.target = i;
                            }
                        })
                        //判断是否造成闭环
                        me.CloseureList = [];
                        me._CheckClosure( config.data,newlink.target)

                        if(!_.contains(me.CloseureList,newlink.source)){
                            config.data.links.push(newlink);
                            this._initDrag(config);
                        }else{
                            message.success('不允许闭环连接！')
                        }

                    }

                }else{
                    config.data.nodes = data.nodes;
                }
                isDraggring = false;
             })


        const svg = d3.select(container).html("").append("svg")
            .attr("id","flowchart"+index)
            .attr("width", width)
            .attr("height", height)
            .call(zoom).on('dblclick.zoom', null);


        data.links.forEach(function (d) {
            d.source = data.nodes[d.source];
            d.target = data.nodes[d.target];
        });

        const defs = svg.append("defs");

        const arrowMarker = defs.append("marker")
            .attr("id", "midArrow")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "12")
            .attr("markerHeight", "12")
            .attr("viewBox", "0 0 12 12")
            .attr("refX", "6")
            .attr("refY", "6")
            .attr("orient", "auto");

        var arrow_path = "M2,2 L10,6 L2,10 L4,6 L2,2";
        arrowMarker.append("path")
            .attr("d", arrow_path)
            .attr("fill", "#000");

        const startCircleMarker = defs.append("marker")
            .attr("id", "startCircle")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "12")
            .attr("markerHeight", "12")
            .attr("viewBox", "0 0 12 12")
            .attr("refX", "6")
            .attr("refY", "6")
            .attr("orient", "auto");

        startCircleMarker.append("circle")
            .attr("cx", 6)
            .attr("cy",6)
            .attr("r", 2);

        const endCircleMarker = defs.append("marker")
            .attr("id", "endCircle")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "12")
            .attr("markerHeight", "12")
            .attr("viewBox", "0 0 12 12")
            .attr("refX", "6")
            .attr("refY", "6")
            .attr("orient", "auto");

        endCircleMarker.append("circle")
            .attr("cx", "6")
            .attr("cy", 6)
            .attr("r", 3);


        const center = svg.append("g")
            .attr("transform", "translate(" + config.data.translate + ")scale(" + config.data.scale + ")" )

         //背景网格线
        center.append("g")
            .attr("class", "x axis")
            .selectAll("line")
            .data(d3.range(0, width*2, 40))
            .enter().append("line")
            .attr("x1", function(d) { return d; })
            .attr("y1", 0)
            .attr("x2", function(d) { return d; })
            .attr("y2", height*2);

        center.append("g")
            .attr("class", "y axis")
            .selectAll("line")
            .data(d3.range(0, height*2, 40))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", function(d) { return d; })
            .attr("x2", width*2)
            .attr("y2", function(d) { return d; });

        //曲线
        const path = center.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(data.links)
            .enter().append("path")
            .attr("d", diagonal)
            .attr("fill", "none")
            .attr("stroke", "#42a5f5")
            .attr("stroke-width", 1)
            .attr("marker-start", "url(#startCircle)")
            .attr("marker-end", "url(#midArrow)");

        //块状
        const node = center.append("g")
            .attr("class", "node")
            .selectAll("rect")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", d=>{ return d.active?"active dag-node":"dag-node"})
            .attr("transform", d => {
                return "translate(" + d.x + "," + d.y + ")"
            })

        const graphNode = node.append('foreignObject')
            .attr({
                'x': d => {
                    return -sizeSet.rectWidth/2
                },
                'y': d => {
                    return 0
                },
                'width': sizeSet.rectWidth,
                "height": sizeSet.rectHeight
            }).call(drag).
            on("click", function(d) {
                if (!d.active) { // Don't deselect on shift-drag.
                    node.classed("active", function(p) {
                        p.active = d === p;
                        return p.active;
                    });
                }
            }).
            on("dblclick", function(d) {
               console.log("我要打开编辑呀")
            }).
            on("contextmenu", function(d) {
                if (!d.active) { // Don't deselect on shift-drag.
                    node.classed("active", function(p) {
                        p.active = d === p;
                        return p.active;
                    });
                }
            }).
            on("mousedown", function(d) {
                const Event = d3.event;
                //if(Event.button ==2){
                //    console.log("你点了右键");
                //    Event.preventDefault();
                //}
                d3.select(this).classed("selected",true);
            })
            .on("mouseup", function(d) {
              d3.select(container).select(".selected").classed("selected",false);
            });

       // //连线区上
       //graphNode.append('xhtml:div').
       //     attr({'class': 'drawpathstart path-node_tb'});



        //模块展示
        const graphContent = graphNode.append('xhtml:div').
            attr({'class': 'graph-node'})
            .attr('data-data',function(d){return JSON.stringify(d)});

        graphContent.append('div').attr("class",d=>{
           return    "icon_"+d.type
        });

        graphContent.append('div').attr({
            'class': 'graph-node-name'
        }).attr("title",d => {
            return d.name
        }).html(d => {
            return d.name
        });

        ////连线区右
        //graphContent.append('xhtml:div').
        //    attr({'class': 'drawpathstart path-node_lr'})
        //    .style({"margin-left":'-18px'});

        //连线区左
        graphContent.append('xhtml:div').
            attr({'class': 'drawpathend path-node_lr'})
            .style({"margin-left":'54px'}).append('div')
            .attr({'class': 'drawpathend circleEnd'});

        //连线区下
        graphNode.append('xhtml:div').
             attr({'class': 'drawpathend path-node_tb'}).append('div')
            .attr({'class': 'drawpathend circleEnd'});



        //可编辑状态下添加右键事件
        if(me.$options.dragNode){
            ContextMenu.init({preventDoubleContext: false});
            ContextMenu.attach('.graph-node', [
                {text: '修改', action: function(e){
                    let d =$(this).parents("ul").attr("data")
                    console.log(this.pathname,this.innerHTML)
                }},
                {text: '查看', action: function(e){
                }},
                {text: '删除', action: function(e){
                    "use strict";
                    let index;
                    let len=0;
                    let activeNode;
                    data.nodes.map(function (d,i) {
                        if(d.active){
                            index = i;
                            activeNode = d;
                            config.data.nodes.splice(i,1);
                        }
                    })
                    config.data.links.map(function (l,i) {
                        if(l.source > index ){
                            l.source = l.source-1
                        }
                        if(l.target> index ){
                            l.target = l.target-1
                        }
                    });
                    data.links.map(function (l,i) {
                        if(l.source == activeNode || l.target == activeNode){
                            config.data.links.splice(i-len,1);
                            len++;
                        }
                    })
                    me._initDrag(config);
                }}
            ]);
        }

    },
    CloseureList:[],
    //检查闭合
    _CheckClosure: function (data,s) {
        var _this = this;
        data.links.map(function(l,i){
            "use strict";
            if(l.source == s){
                _this.CloseureList.push(l.target);
                _this._CheckClosure(data,l.target)
            }
        })
    }
}

export default constructor