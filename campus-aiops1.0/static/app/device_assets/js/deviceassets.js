/**
 * Created by nantian on 2016-12-0.
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
        if(tar=="#deviceRoom"){
            $.get("/static/app/device_assets/json_info/deviceRoom.json",bootStrap,"json");
        }else if(tar=="#cabinet"){
            $.get("/static/app/device_assets/json_info/cabinet.json",bootStrap,"json");
        }else if(tar=="#device"){
            $.get("/static/app/device_assets/json_info/device.json",bootStrap,"json");
        }else if(tar=="#contract"){
            $.get("/static/app/device_assets/json_info/contract.json",bootStrap,"json");
        }else if(tar=="#u_pos"){
            $.get("/static/app/device_assets/json_info/u_pos.json",bootStrap,"json");
        }else if(tar=="#osinstance"){
            $.get("/static/app/device_assets/json_info/osinstance.json",bootStrap,"json");
        }else if(tar=="#route"){
            $.get("/static/app/device_assets/json_info/route.json",bootStrap,"json");
        }
    });
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

    $.get("/static/app/device_assets/json_info/deviceRoom.json",bootStrap,"json");
    function bootStrap(data){
        table.init(data);//初始化表格
    }
    var table={
        data:null,//根据需要变换的数据
        url:"",//保存URL
        dataLength:0,
        emptyTable:"",//保存无数据的显示html
        oldData:null,//保存初始数据
        col:null,//表头数据
        group:[],
        search:"",//all表示搜索所有数据
        status:"all",//用来保存数据的当前状态all-所有数据  search-搜索数据
        pageNumber:10,//用来初始化每页显示数量
        currentPage:1,
        showCol:null,//用来约束字段是否显示
        isFirst:true,
        type:"",//用来保存当前表格的数据类型
        init:function(data){
            var me=this;
            //初始化页面状态
            this.dataLength=0;
            this.group=[];//清除分组数据
            this.search="";//清除搜索状态
            $("li.search span").removeClass("active");
            $("li.search input.input").val("");
            //恢复分页模式
            this.status="all",this.currentPage=1;
            $("div.pageNum ul.list-inline").css("display","block");
            $(".page button[data-tar=prev]").attr("disabled",true);
            this.col={};
            this.showCol={};
            this.emptyTable="<thead><tr>";
            var thN=0;
            $.each(data.filed,function(i,v){
                me.col[i]=v[0];
                me.showCol[i]=v[1];
                if(v[1]){
                    thN++;
                    me.emptyTable+="<th>"+v[0]+"</th>";
                }
            });
            this.emptyTable+='</tr></thead><tbody>' +
                '<tr data-tar="list">' +
                    '<td colspan="'+thN+'" style="height: 34px;vertical-align:middle;text-align: center;color:#f42">无数据可展示！</td>' +
                '</tr>' +
            '</tbody>';
            //初始化页面请求的第一页数据(post)
            this.requestData(data.url,{
                "start":1,
                "end":me.pageNumber
            },this.drawTable.bind(this));

            //分组显示功能
            var li='<li>分组:</li>';
            $.each(data.group,function(i,v){
                li+='<li><a href="'+v.href+'">'+ v.html+'</a></li>';
            });
            $("#group_item").html(li);
            $("#group_item a").click(function(e){
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
                        me.requestData(data.url,{
                            "start":1,
                            "end":me.pageNumber
                        },me.drawTable.bind(me));
                    }else{//非搜索状态分组（请求所有数据）
                        me.requestData(data.url,{
                            "all":"all"
                        },function(){
                            me.data= $.statistics(me.oldData,me.group);
                            me.drawTable();
                        });
                    }
                }
            });
            this.url=data.url;
            if(this.isFirst){
                this.isFirst=false;
                this.addEvent();
            }
            this.type=data.type;
        },
        addEvent:function(){
            var me=this;
            //分页功能(选择每页数量是发出请求)
            $(".page select[name]").change(function(){
                me.pageNumber=parseInt($(this).val());
                $("ul.list-inline li").removeClass("active");
                me.group=[];
                $(".page button[data-tar=prev]").attr("disabled",true);
                me.currentPage=1;
                me.requestData(me.url,{
                    "start":1,
                    "end":me.pageNumber
                },me.drawTable.bind(me));
            });
            //换页按钮
            $(".page button[data-tar]").click(function(){
                var prev_next=$(this).attr("data-tar");
                $("ul.list-inline li").removeClass("active");
                me.group=[];
                if(prev_next=="next"){
                    me.currentPage++;
                }else{
                    me.currentPage>1&&(me.currentPage--);
                }
                if(me.currentPage>1){
                    $(".page button[data-tar=prev]").attr("disabled",false);
                }else{
                    $(".page button[data-tar=prev]").attr("disabled",true);
                }
                var start=(me.currentPage-1)*me.pageNumber+1;
                var end=me.currentPage* me.pageNumber;
                me.requestData(me.url,{//请求下一页数据
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
                    me.requestData(me.url,{
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
                me.search="";
                me.status="all";
                me.requestData(me.url,{
                    "start":1,
                    "end":me.pageNumber
                },me.drawTable.bind(me));
            });
            //添加每行的单机事件
            $("#list_table").on("click","span[data-act]",function(){
                var id=$(this).attr("data-act");
                dialog.loadData(me.type,id);
            });
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
                    $(".page button[data-tar=next]").attr("disabled",true);
                }
                fn&&(fn());
            },"json");
        },
        //渲染函数
        drawTable:function(d){
            if(this.currentPage<(this.dataLength/this.pageNumber)){
                $(".page button[data-tar=next]").attr("disabled",false);
            }else{
                $(".page button[data-tar=next]").attr("disabled",true);
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
        }
    };
    //弹出框对象
    var dialog={
        id:"",
        title:"",
        body:"",
        footer:"",
        size:"modal-md",
        init:function(id){
            this.id=id;
            this.size="modal-lg";
        },
        loadData:function(t,id){
            var me=this;
            if(t=="deviceRoom"){
                var url="/device_assets/cabinet_data/"
                this.title="机房-";
                var pro="roomName";
                this.size="modal-lg";
                var width=899;
                var js_Plugin="engineRoom";
                a();
            }else if(t=="cabinet"){
                var url="/device_assets/u_data/"
                this.title="机柜-";
                var pro="name";
                this.size="modal-md";
                var width=599;
                var js_Plugin="cabinet_v";
                a();
            }
            function a(){
                $.post(url,{id:id},function(d){
                    me.title+= d[pro];
                    var html='<div class="canvasContainer">' +
                        '<canvas id="canvas" width="'+width+'" height="500"></canvas>' +
                        '</div>';
                    me.body=html;
                    me.dialogOpen();
                    $("#canvas")[js_Plugin]().start(d).init();
                },"json");
            }
        },
        dialogOpen:function(){
            $('#'+this.id+' .modal-title').html(this.title);
            $('#'+this.id+' .modal-body').html(this.body);
            $('#'+this.id+' .modal-footer').html(this.footer);
            $('#'+this.id+' .modal-dialog').removeClass("modal-lg").removeClass("modal-md").addClass(this.size);
            $('#'+this.id).modal();
        }
    };
    dialog.init("myModal");
});