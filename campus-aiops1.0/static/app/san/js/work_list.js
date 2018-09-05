/**
 * Created by nantian on 2017/5/4.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    var QWeb = new QWeb2.Engine();
    QWeb.add_template("/static/app/san/xml/create_order.xml",function(){
        $.get("/static/app/san/json/work_list_thead.json",function(thead){
            //请求分类菜单和个数
            $.get("/san/order_list_num",function(data){
                var html = QWeb.render("menu_list_num",data);
                $(".aside_menu").html(html);
                table.init(thead);
            },"json");
        },"json");
    });



    //searching
    $(".search_box .search_btn").click(function(){
        var search = $(this).parent(".input-group-btn").siblings(".form-control").val();
        if(search != table.search){
            table.search = search;
            table.reloadData();
        }
    });

    var table = {
        ele: "#work_list",
        $table:null,//保存表格的jquery元素
        table:null,//保存datatable对象
        url: "/san/order_list/",
        lang:null,
        status:"草稿",//保存显示那种状态的工单
        type:"",
        search:"",
        thead: null,
        menuList:".aside_menu",
        deleteUrl:"/san/delete_order/",
        init:function(data){
            this.$table = $(this.ele);
            this.thead = data["thead"];
            this.lang = data["lang"];
            var sessionData = sessionStorage.getItem("san_session")
            if(sessionData){
                sessionData = JSON.parse(sessionData);
                this.status = sessionData.status;
                this.type = sessionData.type;
                if(sessionData.type == "我的工单"){
                    var id = "#my_states";
                }else{
                    var id = "#deal_states";
                }
                $(".aside_menu li.active").removeClass("active");
                $(id+" li>a[href="+sessionData.status+"]").parent("li").addClass("active");

            }else{
                this.status = $(this.menuList+" li.active a").attr("href");
                this.type = "我的工单";
                sessionData = {status:this.status,type:this.type};
                sessionStorage.setItem("san_session",JSON.stringify(sessionData));
            }
            this.drawHead();
            this.drawBody();
            this.addEvent();
        },
        drawHead:function(){
            var thead = '<thead><tr>';
            $.each(this.thead,function(i,v){
                thead += '<th>'+v["CH"]+'</th>';
            });
            thead += '</tr></thead>';
            this.$table.html(thead);
        },
        reloadData:function(a,b){
            $(".preloader").removeClass("hidden");

            this.table.ajax.reload(a,b);
        },
        drawBody:function(){
            var me = this;
            this.table = this.$table.DataTable({
                "processing": true,
                "ajax": {
                    "url":this.url,
                    "type": 'POST',
                    "data":function(reqData){
                        reqData['status'] = me.status;
                        reqData['search'] = me.search;
                        reqData['type'] = me.type;
                    },
                    "dataSrc":function(d){
                        $.each(d['data'],function(i,v){
                            var del = '';
                            me.status == "草稿" && (del = ' <button type="button" data-delete="'+v["id"]+'" class="btn btn-xs btn-warning">删除</button>');
                            me.type == "我的工单" && me.status == "退回" && (del = ' <button type="button" data-delete="'+v["id"]+'" class="btn btn-xs btn-warning">删除</button>');
                            v['opt'] = '<button type="button" data-detail="'+v["id"]+'" class="btn btn-xs btn-info">查看详情</button>'+del;
                        });
                        $(".preloader").addClass("hidden");
                        return d['data'];
                    }
                },
                "columns": this.thead,
                "serverSide": true,
                "language": this.lang,
                "ordering":  false,
                "dom": 'lirtp'
            });
        },
        deleteItem:function(id){
            var me = this;
            $(".preloader").removeClass("hidden");
            $.post(this.deleteUrl,{id:id},function(data){
                if(data == "ok"){
                    me.reloadData();
                }else{
                    window.alert(data);
                }
            });
        },
        addEvent:function(){
            var me = this;
            //toggle status
            $(this.menuList).on("click","li>a",function(e){
                var e = e || event;
                e.preventDefault();
                $(".aside_menu li.active").removeClass("active");

                $(this).parent("li").addClass("active");
                me.status = $(this).attr("href");
                var id = $(this).parents("ul.menu_list").attr("id");
                me.type = (id=="my_states"?"我的工单":"需处理的工单");
                var sessionData = {status:me.status,type:me.type};
                sessionStorage.setItem("san_session",JSON.stringify(sessionData));
                //me.search = '';
                me.reloadData();
            });
            //row btn
            this.$table.on("click",".btn[data-detail]",function(){
                var id = $(this).attr("data-detail");
                window.open("/san/create_order/?id="+id, "_self");
            });
            this.$table.on("click",".btn[data-delete]",function(){
                var id = $(this).attr("data-delete");
                me.deleteItem(id);
            });
        }
    };
});
