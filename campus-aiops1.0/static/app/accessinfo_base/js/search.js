/**
 * Created by nantian on 2017/2/16.
 */
$(document).ready(function(){
    var dev_ip = window.location.search.slice(8);
    $(".preloader").removeClass("hidden");
    $.get("/static/app/accessinfo_base/json/table_header.json",function(d){
        table.init(d);
    },"json");
    var key = 'tHead'+location.pathname;
    var table={
        ele:"#port_search",
        field:null,
        allField:null,
        data:null,
        table:null,
        lang:null,
        url:"",//搜索接口地址
        init:function(field){
            this.allField = field['tHeadB'];
            this.lang={
                "sProcessing": "处理中...",
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "全文查找:",
                "sUrl": "",
                "sEmptyTable": "未搜索任何数据...",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                }
            };
            //根据不同页面，填充不同搜索接口


            switch ($("#page_name").html()){
                case "port":
                    this.url = "/accessinfo_base/search_port/";
                    if(sessionStorage.getItem(key)){
                        this.field = JSON.parse(sessionStorage.getItem(key));
                    }else{
                        this.field=field['tHeadB'];
                        sessionStorage.setItem(key,JSON.stringify(this.field));
                    }
                    break;
                case "sys":
                    this.url = "/accessinfo_base/search_sys/";
                    if(sessionStorage.getItem(key)){
                        this.field = JSON.parse(sessionStorage.getItem(key));
                    }else{
                        this.field=field['tHeadB'];
                        sessionStorage.setItem(key,JSON.stringify(this.field));
                    }
                    break;
                case "server":
                    this.url = "/accessinfo_base/search_server/";
                    if(sessionStorage.getItem(key)){
                        this.field = JSON.parse(sessionStorage.getItem(key));
                    }else{
                        this.field=field['tHeadC'];
                        sessionStorage.setItem(key,JSON.stringify(this.field));
                    }
                    break;
            }
            this.drawHead();
            this.addEvent();
            if(dev_ip===""){
                this.data=[];
                this.drawBody();
            }else if(dev_ip[0]==="["){
                var ipList = JSON.parse(decodeURIComponent(dev_ip));
                this.searchData(ipList);
            }else{
                $("#dev_ip").val(dev_ip);
                this.searchData();
            }

            var me=this;
            $("#search").click(function(){
                $(".preloader").removeClass("hidden");
                me.searchData();
            });
            $("#reset_btn").click(function(){
                $("div.form-group>input.form-control").each(function(i,v){
                    $(v).val("");
                });
            });
        },
        drawHead:function(){
            var thead='<thead><tr>';
            $.each(this.field,function(i,v){
                thead+='<th>'+v.CH+'</th>';
            });
            thead+='</tr></thead>';
            $(this.ele).append(thead);
        },
        searchData:function(parameters){
            var me=this;
            var requestBody = {};
            $("div.form-group>input.form-control").each(function(i,v){
                var pro = $(v).attr("id");
                var val = $(v).val();
                if(pro == "dev_ip"){
                    val = [$(v).val()];
                }
                requestBody[pro] = val;
            });
            if(parameters){
                requestBody["dev_ip"] = parameters;
            }
            $.post(this.url,requestBody,function(data){
                me.data=data;
                $.each(me.data,function(i,v){
                    $.each(me.field,function(item,val){
                        v[val["data"]] = v[val["data"]]||"";
                    });
                });
                me.drawBody();
            },"json");
        },
        drawBody:function(){
            var me=this;
            this.table&&this.table.destroy&&this.table.destroy();

            this.table=$(this.ele).DataTable({
                responsive: true,
                language:this.lang,
                ordering: true,
                columns:me.field,
                data:this.data,
                lengthMenu:[[100,300,500,1000,-1],[100,300,500,1000,"所有"]],
                bStateSave: true,
                dom: 'B<"clear">lfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: '导出到Excel'
                }]
            });
            me.showCols();
            me.addEvent();
            $(".preloader").addClass("hidden");
        },
        showCols:function(){
            var me = this;
            $.each(me.field,function(i,v){
                me.table.column(i).visible(v["show"],false);
            });
        },
        addEvent:function(){
            var me = this;

            $(me.ele+'_length').after('<div id="show_filed">'+$("#hid_show_col").html()+'</div>');
            //保持选中状态
            $("#show_filed .dropdown-menu>li").each(function(i,v){
                var index = $(v).children('a').attr("href")-0;
                me.field[index]['show']&&$(v).addClass('active');
            });

            $("#show_filed .dropdown-menu>li>a").click(function(e){
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                $(this).parent("li").toggleClass("active");
                var index = $(this).attr("href")-0;
                me.field[index]['show'] = $(this).parent("li").hasClass("active");
                sessionStorage.setItem(key,JSON.stringify(me.field));
                me.showCols();
            });
        }
    };
});