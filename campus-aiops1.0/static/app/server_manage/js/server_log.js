$(document).ready(function(){

    $(".preloader").removeClass("hidden");

    $.get("/static/app/server_manage/json/server_log.json",init,"json");
    function init(data){
        table.init(data);
    }

    var table = {
        ele:"#log_list",
        t:null,
        url:"/server_manage/server_log/",
        data:[],
        thead:null,
        lang:null,
        init:function(thead){
            var me = this;
            me.thead = thead['thead'];
            me.lang = thead['lang'];
            me.drawHead();
            me.drawData();
            me.requestData();
            me.addEvent();
        },
        drawHead:function(){
            var me = this;
            var thead = '<thead><tr>';
            $(me.thead).each(function(i,v){
                thead += '<th width="'+v['width']+'">'+v['CH']+'</th>';
            });
            thead += '</tr></thead>';
            $(me.ele).html(thead);
        },
        requestData:function(){
            $(".preloader").removeClass("hidden");
            var me = this;
            $.post(me.url,function(data){
                me.data = data;
                $.each(me.data,function(i,v){
                    v.context = JSON.stringify(JSON.parse(v.context));
                })
                me.drawData();
            },"json");
        },
        drawData:function(){
            $(".preloader").addClass("hidden");
            this.t && this.t.destroy();
            $(this.ele+" tbody").remove();
            this.t = $(this.ele).DataTable({
                //responsive:true,
                language:this.lang,
                lengthMenu:[[10,20,50,100,-1],[10,20,50,100,"所有"]],
                ordering: true,
                order: [[ 0, 'desc' ]],
                searching:true,
                //stateSave: true,
                columns: this.thead,
                data:this.data,
                dom: 'B<"clear">lfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: '导出到Excel',
                    exportOptions: {//自定义导出的列和行
                        columns:function (idx, data, node){
                            var colName = $(node).html();
                            return (colName == "操作" || idx==0) ?true : true;
                        },
                        rows:function(idx,data,tr){
                            //return $(tr).hasClass("selected")?true:false;
                            return true;
                        }

                    },
                    filename:this.ele
                }]
            });
        },
        addEvent:function(k){

        }
    };
})