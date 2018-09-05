/**
 * Created by Administrator on 2016-11-23.
 * 代码运行时长（毫秒）
 * var start=new Date().getTime();
 * console.log(new Date().getTime()-start);
 */

$(document).ready(function(){
    function resize(){//窗口大小变化是，重新布置高度
         var height=$(window).height();
        $("div.content-wrapper").css({
            "min-height":"500px",
            "height":(height-83)+"px"
        });
        $("aside.control-sidebar").css({
            "height":height+"px",
            "overflow-y":"scroll"
        });
        $("#pie_statistics_image").css("height",$("#statistics_pie").height()-200+"px");
    }
    resize();
    $(window).resize(function() {
        resize();
    });
    //页签切换事件
    $("div.page_tab li>a").click(function(e){
        var e=e||event;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
        $(this).parent("li").addClass("active")
            .siblings("li").removeClass("active");
        var tar=$(this).attr("href");
        var tab=$(this).attr("data-tab");
        $("[data-target="+tar+"]").fadeIn("fast").siblings(".page").fadeOut("fast");
        var dis=(tar=="list"?"block":"none");
        $("li.search").css("display",dis);
        if(tar=="statistics"){
            if(tab=="b"){
                pieStatistics.getData(table.oldData,"b");
            }else if(tab=="z"){
                pieStatistics.getData(table.oldData,"z");
            }
        }
    });
    //隐藏或者显示筛选功能
    $("div.page .pull_btn span").click(function(){
        $(this).parents(".filter_box").toggleClass("open");
        var h=$("div.page .filter_box ").height();
        if($(this).parents(".filter_box").hasClass("open")){
            $("div.page .filter_box ").css("marginTop","0px");
        }else{
            $("div.page .filter_box ").css("marginTop",-h+"px");
        }

    });
    //筛选功能
    $.get("/device_switch/area_data/",function(data){///static/json_info/Filter.json
        var li='<li class="all"><a href="all">全选</a></li>';
        $.each(data,function(i,v){
            li+='<li class="option"><a href="'+i+'">'+i+'</a></li>'
        });
        $("#reg_pos").append(li);
        var computedH=$("div.page .filter_box ").height();
        $("div.page .filter_box ").css("marginTop",-computedH+"px");
        var filter={
            "reg_pos":[],
            "building_location":[],
            "floor":[],
            "room":[],
            "fun_area":[]
        };
        $("div.filter_box").on("click",".list-inline>li>a",function(e){
            var e=e||event;
            if(e.preventDefault){
                e.preventDefault();
            }else{
                e.returnValue = false;
            }
            e.stopPropagation();
            $(this).parent("li").toggleClass("active");
            var pro=$(this).attr("href");
            var field=$(this).parents("ul.list-inline").attr("id");
            var hasClass=$(this).parent("li").hasClass("active");
            if(pro=="all"){
                if(hasClass){
                    $(this).parent("li").siblings("li.option").addClass("active");
                    $(this).parent("li").siblings("li.option").each(function(i,v){
                        filter[field].push($(v).find("a").attr("href"));
                    });
                }else{
                    $(this).parent("li").siblings("li.option").removeClass("active");
                    filter[field]=[];
                }
            }else{
                if(hasClass){
                    var liTotal=$(this).parent("li").siblings("li.option").length+1;
                    var liActive=$(this).parents("ul.list-inline").find("li.option.active").length;
                    if(liActive>=liTotal){
                        $(this).parent("li").siblings("li.all").addClass("active");
                    }
                    filter[field].push($(this).attr("href"));
                }else{
                    $(this).parent("li").siblings("li.all").removeClass("active");
                    var href=$(this).attr("href");
                    var i=filter[field].indexOf(href);
                    if(i!==-1){
                        filter[field].splice(i,1);
                    }
                }
            }

            if(field=="reg_pos"){
                $("#building_location").html('<li>楼房:</li>');
                var li='<li class="all"><a href="all">全选</a></li>';
                var o={};
                $.each(data,function(i,v){
                    if(filter.reg_pos.indexOf(i)!=-1) {
                    $.each(data[i], function (i1, v1) {
                        if (o[i1] === undefined) {
                            o[i1] = true;
                            li += '<li class="option"><a href="' + i1 + '">' + i1 + '</a></li>'
                        }
                    });
                    }
                });
                $("#building_location").append(li);
            }else if(field=="building_location"){
                $("#floor").html('<li>楼层:</li>');
                var li='<li class="all"><a href="all">全选</a></li>';
                var o={};
                $.each(data,function(i,v){
                    if(filter.reg_pos.indexOf(i)!=-1) {
                    $.each(data[i],function(i1,v1){
                        if(filter.building_location.indexOf(i1)!=-1) {
                        $.each(data[i][i1],function(i2,v2){
                            if(o[i2]===undefined){
                                o[i2]=true;
                                li+='<li class="option"><a href="'+i2+'">'+i2+'</a></li>'
                            }
                        });
                        }
                    });
                    }
                });
                $("#floor").append(li);
            }else if(field=="floor"){
                $("#room").html('<li>机房:</li>');
                var li='<li class="all"><a href="all">全选</a></li>';
                var o={};
                $.each(data,function(i,v){
                    if(filter.reg_pos.indexOf(i)!=-1) {
                    $.each(data[i],function(i1,v1){
                        if(filter.building_location.indexOf(i1)!=-1) {
                        $.each(data[i][i1],function(i2,v2){
                            if(filter.floor.indexOf(i2)!=-1) {
                            $.each(data[i][i1][i2],function(i3,v3){
                                if(o[i3]===undefined){
                                    o[i3]=true;
                                    li+='<li class="option"><a href="'+i3+'">'+i3+'</a></li>'
                                }
                            });
                            }
                        });
                        }
                    });
                    }
                });
                $("#room").append(li);
            }else if(field=="room"){
                $("#fun_area").html('<li>功能区:</li>');
                var li='<li class="all"><a href="all">全选</a></li>';
                var o={};
                $.each(data,function(i,v){
                    if(filter.reg_pos.indexOf(i)!=-1) {
                    $.each(data[i],function(i1,v1){
                        if(filter.building_location.indexOf(i1)!=-1) {
                        $.each(data[i][i1],function(i2,v2){
                            if(filter.floor.indexOf(i2)!=-1) {
                            $.each(data[i][i1][i2],function(i3,v3){
                                if(filter.room.indexOf(i3)!=-1){
                                $.each(data[i][i1][i2][i3],function(i4,v4){
                                    if(o[i4]===undefined){
                                        o[i4]=true;
                                        li+='<li class="option"><a href="'+i4+'">'+i4+'</a></li>'
                                    }
                                });
                                }
                            });
                            }
                        });
                        }
                    });
                    }
                });
                $("#fun_area").append(li);
            }
            //var computedH=$("div.page .filter_box ").height();
            //$("div.page .filter_box ").css("marginTop",-computedH+"px");
        });
        $("#reset").click(function(){
            $("#reg_pos li").removeClass("active");
            $("#building_location li.all").removeClass("active");
            $("#building_location li.option").remove();
            $("#floor li.all").removeClass("active");
            $("#floor li.option").remove();
            $("#room li.all").removeClass("active");
            $("#room li.option").remove();
            $("#fun_area li.all").removeClass("active");
            $("#fun_area li.option").remove();
            $("ul.grouped li").removeClass("active");
            $("div.pageNum ul.list-inline").css("display","block");
            table.status="all";
            table.group=[];
            filter={
                "reg_pos":[],
                "building_location":[],
                "floor":[],
                "room":[],
                "fun_area":[]
            };
            table.requestData("/device_switch/device_data/",{
                "start":1,
                "end":table.pageNumber
            },table.drawTable.bind(table));
        });
        $("#start_filter").click(function(){
            var filterArr=[];
            $.each(filter.reg_pos,function(i,v){
                if(filter.building_location.length==0){filterArr.push({"reg_pos":v});}
                $.each(filter.building_location,function(i1,v1){
                    if(filter.floor.length==0){
                        if(data[v]&&data[v][v1]){
                            filterArr.push({
                                "reg_pos":v,
                                "building_location":v1
                            });
                        }
                    }
                    $.each(filter.floor,function(i2,v2){
                        if(filter.room.length==0){
                            if(data[v]&&data[v][v1]&&data[v][v1][v2]){
                                filterArr.push({
                                    "reg_pos":v,
                                    "building_location":v1,
                                    "floor":v2
                                });
                            }
                        }
                        $.each(filter.room,function(i3,v3){
                            if(filter.fun_area.length==0){
                                if(data[v]&&data[v][v1]&&data[v][v1][v2]&&data[v][v1][v2][v3]){
                                    filterArr.push({
                                        "reg_pos":v,
                                        "building_location":v1,
                                        "floor":v2,
                                        "room":v3
                                    });
                                }
                            }
                            $.each(filter.fun_area,function(i4,v4){
                                if(data[v]&&data[v][v1]&&data[v][v1][v2]&&data[v][v1][v2][v3]&&data[v][v1][v2][v3][v4]){
                                    filterArr.push({
                                        "reg_pos":v,
                                        "building_location":v1,
                                        "floor":v2,
                                        "room":v3,
                                        "fun_area":v4
                                    });
                                }
                            });
                            if(data[v]&&data[v][v1]&&data[v][v1][v2]&&data[v][v1][v2][v3]){
                                filterArr.push({
                                    "reg_pos":v,
                                    "building_location":v1,
                                    "floor":v2,
                                    "fun_area":v3
                                });
                            }
                        });
                    });
                });
            });
            table.status="search";
            $("div.pageNum ul.list-inline").css("display","none");
            table.requestData("/device_switch/device_data/",{
                data:JSON.stringify(filterArr)
            },table.drawTable.bind(table))

        });
        $("#download_start_filter").click(function(){
            var data = JSON.stringify(table.oldData);
            var data_group = JSON.stringify(table.data);
            function downLoad(url,data,data_group){
                var $inputContent1 = $('<input>').attr({ name: "data", value: data });
                var $inputContent2 = $('<input>').attr({ name: "data_group", value: data_group });
                var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action: url })
                    .append($inputContent1)
                    .append($inputContent2);
                $form.submit();
            }
            downLoad("/device_switch/export_device_data_xls/", data,data_group);
        });
    },"json")
    //固定表头
    $("#table_container").scroll(function(){
        var offset=$(this).scrollTop();
        if(offset){
            $('#list_table>thead').css("transform","translateY("+offset+"px)");
        }else{
            $('#list_table>thead').css("transform","translateY(0px)");
        }
    });
    //获取表头汉化文件
    $.get("/static/app/device_switch/json_info/tablehead.json",bootStrap,"json");
    function bootStrap(data){
        table.init(data);//初始化表格
    }
    var table={
        data:null,//根据需要变换的数据
        dataLength:0,
        emptyTable:"",//保存无数据的显示html
        oldData:null,//保存初始数据
        col:null,//表头数据
        group:[],
        search:"",//all表示搜索所有数据
        status:"all",//用来保存数据的当前状态all-所有数据  search-搜索数据
        pageNumber:10,//用来初始化每页显示数量
        currentPage:1,
        showCol:{//用来约束字段是否显示
            "groupName":true,
            "node":false,
            "manage_ip":true,
            "reg_pos":true,
            "building_location":true,
            "floor":true,
            "room":false,
            "row":false,
            "column":false,
            "detail_locate":true,
            "fun_area":true,
            "dev_name":true,
            "device_id":false,
            "total_interface":true,
            "total_used_interface":true,
            "total_unused_interface":true,
            "total_used_electricty_1G":false,
            "total_unused_electricty_1G":false,
            "total_used_electricty_10G":false,
            "total_unused_electricty_10G":false,
            "total_used_optical_1G":false,
            "total_unused_optical_1G":false,
            "total_used_optical_10G":false,
            "total_unused_optical_10G":false,
            "total_used_optical_40G":false,
            "total_unused_optical_40G":false,
            "total_used_optical_4G":false,
            "total_unused_optical_4G":false,
            "total_used_optical_8G":false,
            "total_unused_optical_8G":false,
            "total_used_optical_16G":false,
            "total_unused_optical_16G":false,
        },
        init:function(data){

            var me=this;
            this.col=data;
            this.emptyTable=$("#list_table").html();
            //初始化页面请求的第一页数据(post)
            this.requestData("/device_switch/device_data/",{
                "start":1,
                "end":me.pageNumber
            },this.drawTable.bind(this));
            //选择显示的字段
            $("#showHidden a").click(function(e){
                var e=e||event;
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
                e.stopPropagation();
                $(this).parent("li").toggleClass("active");
                var pro=$(this).attr("href");
                if($(this).parent("li.active").length){
                    me.showCol[pro]=true;
                }else{
                    me.showCol[pro]=false;
                }
                me.drawTable();
            });
            //分组显示功能
            $("ul.list-inline.grouped a").click(function(e){
                var e=e||event;
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
                e.stopPropagation();
                $(this).parent("li").toggleClass("active");
                var pro=$(this).attr("href");
                if($(this).parent("li.active").length){
                    me.group.push(pro);
                }else{
                    var i=me.group.indexOf(pro);
                    if(i>=0){
                        me.group.splice(i,1);
                    }
                }
                if(me.status=="search"){
                    me.data= $.statistics(me.oldData,me.group);
                    me.drawTable();
                }else{
                    if(me.group.length==0){//非搜索状态取消分组
                        me.requestData("/device_switch/device_data/",{
                            "start":1,
                            "end":me.pageNumber
                        },me.drawTable.bind(me));
                    }else{//非搜索状态分组（请求所有数据）
                        me.requestData("/device_switch/device_data/",{
                            "all":"all"
                        },function(){
                            me.data= $.statistics(me.oldData,me.group);
                            me.drawTable();
                        });
                    }
                }
            });
            //分页功能(选择每页数量是发出请求)
            $(".view_type select[name]").change(function(){
                me.pageNumber=parseInt($(this).val());
                $("ul.list-inline li").removeClass("active");
                me.group=[];
                $("#table_container button[data-tar=prev]").attr("disabled",true);
                me.currentPage=1;
                me.requestData("/device_switch/device_data/",{
                    "start":1,
                    "end":me.pageNumber
                },me.drawTable.bind(me));
            });
            //换页按钮
            $("#table_container button[data-tar]").click(function(){
                var prev_next=$(this).attr("data-tar");
                $("ul.list-inline li").removeClass("active");
                me.group=[];
                if(prev_next=="next"){
                    me.currentPage++;
                }else{
                    me.currentPage>1&&(me.currentPage--);
                }
                if(me.currentPage>1){
                    $("#table_container button[data-tar=prev]").attr("disabled",false);
                }else{
                    $("#table_container button[data-tar=prev]").attr("disabled",true);
                }
                var start=(me.currentPage-1)*me.pageNumber+1;
                var end=me.currentPage* me.pageNumber;
                me.requestData("/device_switch/device_data/",{//请求下一页数据
                    "start":start,
                    "end":end
                },me.drawTable.bind(me));
            });
            //模糊搜索功能
            $("#searchBtn").click(function(){
                me.search=$(this).siblings("input").val();
                if(me.search!==""){
                    $("li.search span").addClass("active");
                    me.status="search";
                    $("div.pageNum ul.list-inline").css("display","none");
                    me.requestData("/device_switch/device_data/",{
                        "search":me.search
                    },me.drawTable.bind(me));
                }
            });
            //回车开始搜索
            $("input.input").keydown(function(e){
                if(e.keyCode==13){
                    $("#searchBtn").trigger("click");
                }
            });
            //清除搜索状态
            $("li.search").on("click","span.active",function(){
                $(this).removeClass("active");
                $(this).siblings(".input").val("");
                $("div.pageNum ul.list-inline").css("display","block");
                $("ul.list-inline li").removeClass("active");
                me.group=[];
                me.currentPage=1;
                me.search=""
                me.status="all";
                me.requestData("/device_switch/device_data/",{
                    "start":1,
                    "end":me.pageNumber
                },me.drawTable.bind(me));
            });
            //调用添加事件函数
            this.addEvent();
        },
        //post请求数据
        requestData:function(url,option,fn){
            $("div.preloader").removeClass("hidden");
            var me=this;
            $.post(url,option,function(d){
                me.data= d.datas;
                me.oldData= d.datas;
                me.dataLength= d.data_length;
                if(me.dataLength<me.pageNumber){
                    $("#table_container button[data-tar=next]").attr("disabled",true);
                }
                fn&&(fn());
            },"json");
        },
        //渲染函数
        drawTable:function(d){
            if(this.currentPage<(this.dataLength/this.pageNumber)){
                $("#table_container button[data-tar=next]").attr("disabled",false);
            }else{
                $("#table_container button[data-tar=next]").attr("disabled",true);
            }
            !d&&(d=this.data);
            var proto=Object.prototype.toString.call(d);
            if(d.length||proto=="[object Object]"){
                $("#list_table").drawTable(d,this.showCol,this.col);//调用渲染函数
                if(d.length){
                    var start=(this.currentPage-1)*this.pageNumber+1;
                    var end=this.currentPage*this.pageNumber;
                    if(this.status=="search"){
                        start="*", end="*";
                    }
                    $("span[data-num=start]").html(start);
                    $("span[data-num=end]").html(end);
                    $("span[data-num=total]").html(this.dataLength);
                }else{
                    $("span[data-num=start]").html("*");
                    $("span[data-num=end]").html("*");
                    $("span[data-num=total]").html(this.dataLength);
                }
            }else{
                $("#list_table").html(this.emptyTable);
                $("span[data-num]").html("0");
            }
            $("div.preloader").addClass("hidden");
        },
        addEvent:function(){

            //添加每行的单机事件
            $("#list_table").on("click","span[data-act]",function(){
                var device_id=$(this).attr("data-act");
                var host = window.location.origin||"http://"+window.location.host
                window.open(host+"/device_switch/device_panel/?device_id="+device_id,"_blank")
            });
        }
    }
    //饼状图代码
    var pieStatistics={
        data:null,
        type:"",
        port:null,
        area:null,
        index:null,
        myChart_pie:null,
        groupName:"",
        getData:function(d,type){
            var me=this;
            this.data=d;
            this.type=type;
            this.index={};
            $(".port_status li").removeClass("active");
            $(".port_status li:nth-child(3)").addClass("active");
            $(".port_status li:nth-child(2)").addClass("active");
            this.port={
                isFirst:false,
                arr:["total_used_interface","total_unused_interface"]
            };
            this.area={
                isFirst:true,
                arr:[]
            };
            var aside={
                "reg_pos":"#pie_area ul.list-inline",
                "building_location":"#pie_building ul.list-inline",
                "floor":"#pie_floor ul.list-inline",
                "fun_area":"#pie_fun_area ul.list-inline"
            }
            //区域\楼房\位置\功能区
            $.each(aside,function(item,val){
                var data= $.statistics(d,[item]);
                $(val).html("");
                var pro=(item=="reg_pos"?"active":"");
                var li='<li class="all '+pro+'"><a href="all">全选</a></li>';
                $.each(data,function(i,v){
                    li+='<li class="option '+pro+'"><a href="'+i+'">'+i+'</a></li>';
                    me.index[i]=v;
                    pro=="active"&&(me.area.arr.push(i));
                });
                $(val).append(li);
            });
            if(this.type=="z"){
                this.refreshBar();
            }else if(this.type=="b"){
                this.refreshPie();
            }
        },
        init:function(){
            var me=this;
            $(".port_status li>a").click(function(e){
                var e=e||event;
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
                var pro=$(this).attr("href");
                var hasClass=$(this).parent("li").hasClass("active");
                if(me.area.isFirst!==true){
                    me.port.isFirst=true;
                    if(hasClass){
                        $(this).parent("li").removeClass("active");
                        me.port.arr=[];
                        me.port.isFirst=false;
                    }else{
                        $(this).parent("li").addClass("active")
                            .siblings("li.active").removeClass("active");
                        me.port.arr=[pro];
                    }

                }else{
                    me.port.isFirst=false;
                    if(hasClass){
                        $(this).parent("li").removeClass("active");
                        var i=me.port.arr.indexOf(pro);
                        if(i>=0){
                            me.port.arr.splice(i,1);
                        }
                    }else{
                        me.port.arr.push(pro);
                        $(this).parent("li").addClass("active");
                    }
                }
                //顶部单击事件
                if(me.type=="z"){
                    me.refreshBar();
                }else if(me.type=="b"){
                    me.refreshPie();
                }
            });
            //添加单击事件
            $("#accordion").on("click",".list-inline>li>a",function(e){
                var e=e||event;
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
                e.stopPropagation();
                if(me.port.isFirst){
                    me.area.isFirst=false;
                }else{
                    me.area.isFirst=true;
                }
                $(this).parent("li").toggleClass("active");
                var pro=$(this).attr("href");
                var field=$(this).parents("div.panel-collapse").attr("id");
                var hasClass=$(this).parent("li").hasClass("active");
                //全选功能
                $(this).parents("div.panel").siblings("div.panel")
                    .find("li.active").removeClass("active");
                if(pro=="all"){
                    if(hasClass){
                        $(this).parent("li").siblings("li.option").addClass("active");
                    }else{
                        $(this).parent("li").siblings("li.option").removeClass("active");
                    }
                }else{
                    if(hasClass){
                        var liTotal=$(this).parent("li").siblings("li.option").length+1;
                        var liActive=$(this).parents("ul.list-inline").find("li.option.active").length;
                        if(liActive>=liTotal){
                            $(this).parent("li").siblings("li.all").addClass("active");
                        }
                    }else{
                        $(this).parent("li").siblings("li.all").removeClass("active");
                    }
                }
                me.area.arr=[];
                $.each($("#"+field+" ul>li.option.active>a"),function(i,v){
                    me.area.arr.push($(v).attr("href"));
                });
                if(me.area.arr.length==0){
                    me.area.isFirst=false;
                }
                me.groupName=field;

                if(me.type=="z"){
                    me.refreshBar();
                }else if(me.type=="b"){
                    me.refreshPie();
                }
            });
        },
        refreshPie:function(){
            var me=this;
            if(this.myChart_pie!==null){
                echarts.dispose(document.getElementById('pie_statistics_image'));
            }
			this.myChart_pie=echarts.init(document.getElementById('pie_statistics_image'));
            if(this.area.arr.length&&this.port.arr.length){
                var data=[];
                if(this.port.isFirst){
                    var title=table.col[this.port.arr[0]];
                    var name=table.col[this.groupName.slice(4)];
                    $.each(this.area.arr,function(i,v){
                        data.push({
                            value:me.index[v][me.port.arr[0]],
                            name:me.index[v]["groupName"]
                        });
                    });
                }else if(this.area.isFirst){
                    var title="";
                    var name="接口分类";
                    $.each(this.port.arr,function(i,v){
                        title="";
                        var value=0;
                        $.each(me.area.arr,function(item,val){
                            title+=me.index[val]["groupName"]+";";
                            value+=me.index[val][v];
                        });
                        data.push({
                            value:value,
                            name:table.col[v]
                        });
                    });
                }
                var option = {
                    title:{
                        text:title
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    toolbox:{
                        show:true,
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {}
                        },
                        itemSize:18,
                        top:20,
                        right:30
                    },
                    //legend: {
                        //orient: 'vertical',
                        //x: 'right',
                        //data:['已用','可用','UP_noData','黑山扈','西单','A1','A2','A3','A4','A5']
                    //},
                    series: [
                        {
                            name:name,
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '75%'],
                            label: {
                                normal: {
                                    reg_pos: 'outer'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },
                            data:data
                        }
                    ]
                };
                this.myChart_pie.setOption(option);
            }
        },
        refreshBar:function(){
            var me=this;
            if(this.myChart_pie!==null){
                echarts.dispose(document.getElementById('pie_statistics_image'));
            }
			this.myChart_pie=echarts.init(document.getElementById('pie_statistics_image'));

            if(this.area.arr.length&&this.port.arr.length){
                var series=[{
                    name:'接口总数',
                    type:'bar',
                    barWidth: '60%',
                    data:[]
                }],xAxis=[];
                if(this.port.isFirst){
                    var title=table.col[this.port.arr[0]];
                    var name=table.col[this.groupName.slice(4)];
                    $.each(this.area.arr,function(i,v){
                        xAxis.push(me.index[v]["groupName"]);
                        series[0]["data"].push({
                            value:me.index[v][me.port.arr[0]]
                        });
                    });
                }else if(this.area.isFirst){
                    var title="";
                    $.each(this.port.arr,function(i,v){
                        title="";
                        var value=0;
                        $.each(me.area.arr,function(item,val){
                            title+=me.index[val]["groupName"]+";";
                            value+=me.index[val][v];
                        });
                        xAxis.push(table.col[v]);
                        series[0]["data"].push({
                            value:value
                        });
                    });
                }
                var option={
                    title:{
                        text:title
                    },
                    tooltip:{},
                    //legend:{
                    //    data:legendData
                    //},
                    toolbox:{
                        show:true,
                        feature: {
                            dataView: {readOnly: false},
                            restore: {},
                            saveAsImage: {},
                            magicType: {
                                type: ['line', 'bar']
                            }
                        },
                        itemSize:18,
                        top:20,
                        right:30
                    },
                    xAxis:{
                        data:xAxis,
                        axisLabel: {
                            interval: 0,
                            rotate: 60
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    //调整柱状图的整体位置
                    grid: [{
                        top: 70,
                        width: '80%',
                        bottom: '15%',
                        left: 80,
                        containLabel: true
                    }],
                    yAxis: {},
                    series:series,
                    backgroundColor:"#fff",
                    color:['#749f83', '#546570',  '#ca8622','#2f4554', '#d48265','#91c7ae','#c23531', '#61a0a8',  '#bda29a','#6e7074','#c4ccd3']
                }
                this.myChart_pie.setOption(option);
            }
        }
    }
    pieStatistics.init();
});