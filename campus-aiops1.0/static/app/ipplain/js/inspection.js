/**
 * Created by nantian on 2017/6/30.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");

    $("ul.nav-tabs>li>a").click(function(e){
        var e = e || event;
        e.preventDefault();
        $(this).parent("li").addClass("active")
            .siblings("li").removeClass("active");
        var href = $(this).attr("href");
        table.toggleTab(href);
    });
    //获取表头信息
    $.get("/static/app/device_switch/json_info/inspectionHead.json",function(thead){
        table.init(thead);
    },"json");

    var table = {
        ele:$("#dataTable"),
        url:"",
        thead:null,
        lang:null,
        table:false,
        title:"",
        init:function(thead){
            this.lang = thead["lang"];
            this.thead = thead["thead"];
            this.drawHead();
            //获取选中的tab页面
            var tab = $("ul.nav>li.active>a").attr("href");
            this.toggleTab(tab);

        },
        toggleTab:function(tab){
            var me = this;
            this.title = $("ul.nav>li.active>a").html();
            $(".preloader").removeClass("hidden");
            $.post("",{"tab":tab},function(data){
                me.drawBody(data);
            },"json");
        },
        drawHead:function(){
            var head = "<thead><tr>";
            $.each(this.thead,function(i,v){
                head += '<th>'+v["CH"]+'</th>';
            })
            head += "</tr></thead>";
            this.ele.append(head);
        },
        drawBody:function(data){
            var me = this;
            me.table && me.table.destroy();
            me.table = me.ele.DataTable({
                dom: 'B<"clear">lfrtip',
                responsive: false,
                columns:me.thead,
                stateSave: true,
                lengthMenu:[[10,20,50,100,-1],[10,20,50,100,"所有"]],
                language:me.lang,
                data:data,
                buttons: [{
                    extend: 'excelHtml5',
                    text: '导出到Excel',
                    /*exportOptions: {//自定义导出的列
                        columns:( function ( idx, data, node ) {
                            return idx== 11 ?false : true;
                        } )
                    },*/
                    filename:me.title
                }]
            });
            $(".preloader").addClass("hidden");
        }
    };

})