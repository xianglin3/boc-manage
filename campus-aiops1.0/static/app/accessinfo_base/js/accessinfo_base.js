/**
 * Created by nantian on 2017/2/15.
 */
$(document).ready(function(){
    var device_list=JSON.parse($("#device_list").html());
    $(".preloader").removeClass("hidden");
    $.get("/static/app/accessinfo_base/json/table_header.json",function(d){
        table.init(d);
    },"json");
    //声明表格对象
    var table={
        ele:"#access_info",//保存接入设备表格
        field:null,//保存接入设备表头
        data:null,//接入设备表体
        table:null,//接入设备表
        lang:null,//datatables翻译
        url:"/accessinfo_base/",//点击接入设备批量查询按钮接口地址
        init:function(field){//初始化表格
            this.field=field["tHeadA"];
            this.lang={
                "sProcessing": "处理中...",
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "模糊搜索:",
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
            this.drawHead(this.ele,this.field);//绘制表头
            this.data=device_list;
            this.drawBody(this.ele,this.field,this.data);//绘制表体
            this.addEvent();//添加表格中的点击事件
        },
        drawHead:function(ele,field){//绘制表头
            var thead='<thead><tr>';
            $.each(field,function(i,v){
                thead+='<th width="'+ v.width+'">'+v.CH+'</th>';
            });
            thead+='</tr></thead>';
            $(ele).append(thead);
        },
        drawBody:function(ele,field,data){//绘制表体
            var me=this;
            this.table&&this.table.destroy&&this.table.destroy();
            $(ele+' tbody').remove();
            var tbody=$('<tbody></tbody>');
            $.each(data,function(i,v){
                var tr=$('<tr></tr>');
                $.each(field,function(item,val){
                    var td_html;
                    if(val["field"]=="select"){
                        td_html = '<input type="checkbox" class="checkbox item" value="'+v['ip']+'">';
                    }else if(val["field"]=="opt"){
                        td_html = '<button type="button" class="btn btn-info" data-act="'+v['ip']+'">接口查询</button>';
                    }else{
                        td_html = v[val["field"]];
                    }
                    tr.append('<td data-field="'+val.field+'">'+td_html+'</td>');
                });
                tbody.append(tr);
            });
            $(ele).append(tbody);
            this.table=$(ele).DataTable({
                //paging: false,
                responsive: true,
                language:this.lang,
                ordering: true,
                lengthMenu:[[100,300,500,1000,-1],[100,300,500,1000,"所有"]],
                bStateSave: true,
                searching:true
            });
            $(".preloader").addClass("hidden");

        },
        addEvent:function(){
            var me=this;
            //checkbox部分代码
            $(this.ele).on("click","input.checkbox",function(e){
                if($(this).hasClass("all")){
                    if(this.checked){
                        $("input.checkbox.item").prop("checked",true);
                    }else{
                        $("input.checkbox.item").prop("checked",false);
                    }
                }else{
                    var all = $("input.checkbox.item").length;
                    var checked = $("input.checkbox.item:checked").length;
                    if(checked==all){
                        $("input.checkbox.all").prop("checked",true);
                    }else{
                        $("input.checkbox.all").prop("checked",false);
                    }
                }
            });
            $("#device_query").click(function(){//接入设备批量查询按钮事件
                var ip_list=[];
                $("input.checkbox.item:checked").each(function(i,v){
                    ip_list.push($(v).val());
                });
                var ipListStr = JSON.stringify(ip_list);
                var host=window.location.origin||"http://"+window.location.host;
                if(ipListStr=="[]"){
                    window.open(host+"/accessinfo_base/search_port","_blank");
                }else{
                    window.open(host+"/accessinfo_base/search_port?dev_ip="+ipListStr,"_blank");
                }
            });
            $("div.box-body button[data-act]").click(function(){
                var data_act=$(this).attr("data-act");
                var host=window.location.origin||"http://"+window.location.host;
                if(data_act=="null"){
                    window.open(host+"/accessinfo_base/search_port","_blank");
                }else if(data_act=="search_sys"){
                    window.open(host+"/accessinfo_base/search_sys","_blank");
                }else{
                    window.open(host+"/accessinfo_base/search_port?dev_ip="+data_act,"_blank");
                }
            });

        }
    }
});