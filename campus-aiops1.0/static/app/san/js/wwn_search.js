/**
 * Created by nantian on 2017/1/18.
 */
$(document).ready(function(){
    //页面加载完成后获取url里的IP
    var ip=window.location.search.slice(4);
    var wwns_search_url = "/san/search_wwn/";
    var ip_search_url = "/san/get_device_flogiwwns/";
    $(".preloader").removeClass("hidden");
    $.get("/static/app/san/json/table_head.json",function(d){
        table.init(d);
    },"json");
    var table={
        ele:"#wwn_search",
        field:null,
        data:null,
        table:null,
        lang:null,
        url:wwns_search_url,//搜索接口地址
        url_ip:ip_search_url,//按ip搜索接口地址
        init:function(field){
            this.field=field;
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
            this.drawHead();
            this.addEvent();
            if(ip==""){
                this.data=[];
                this.drawBody();
            }else{
                this.requestData(this.url_ip,ip);
            };
        },
        drawHead:function(){
            var thead='<thead><tr>';
            $.each(this.field,function(i,v){
                //if (v.field=="connection"){
                //    thead+='<th width="50%">'+v.CH+'</th>';
                //}else{
                //    thead+='<th>'+v.CH+'</th>';
                //}
                thead+='<th>'+v.CH+'</th>';
            });
            thead+='</tr></thead>';
            $(this.ele).append(thead);
        },
        requestData:function(url,search){
            var me=this;
            if (url == ip_search_url){
                $.post(ip_search_url,{
                    ip:search
                },function(data){
                    me.data=data;
                    me.drawBody();
                },"json");
            }else{
                $.post(wwns_search_url,{
                    wwns:search
                },function(data){
                    me.data=data;
                    me.drawBody();
                },"json");
            }
        },
        drawBody:function(){
            var me=this;
            this.table&&this.table.destroy&&this.table.destroy();
            $(this.ele+' tbody').remove();
            var tbody=$('<tbody></tbody>');
            $.each(this.data,function(i,v){
                var tr=$('<tr></tr>');
                $.each(me.field,function(item,val){
                    var td_html = (val["field"]=="opt"? '<button type="button" class="btn btn-info see_zone">查看ZONE</button>':
                    v[val["field"]]);
                    tr.append('<td data-field="'+val.field+'">'+td_html+'</td>');
                });
                tbody.append(tr);
            });
            $(this.ele).append(tbody);
            this.table=$(this.ele).DataTable({
                responsive: true,
                language:this.lang,
                ordering: true,
                order:[],
                //,order:[[7,'asc'],[7,'desc']] 空数组默认不排序,
                lengthMenu:[[100,300,500,1000,-1],[100,300,500,1000,"所有"]],
                bStateSave: true,
                searching:false
            });
            $(".preloader").addClass("hidden");

        },
        addEvent:function(){
            var me=this;
            $("button.search_btn").click(function(){
                $(".preloader").removeClass("hidden");
                me.requestData(me.url,$("#search").val());
            });

            $(me.ele).on("click","button.see_zone",function(){
                var wwn = $(this).parent("td").siblings("td[data-field=wwn]").html();
                var host=window.location.origin||"http://"+window.location.host;
                window.open(host+"/san/search_zone?wwn="+wwn,"_blank");
            });
        }
    };
});