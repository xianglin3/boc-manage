/**
 * Created by nantian on 2017/2/10.
 */
$(document).ready(function(){
    var wwn=window.location.search.slice(5);
    $(".preloader").removeClass("hidden");

    $.get("/static/app/san/json/table_head.json",function(d){
        table.init(d);
    },"json");
    var table={
        ele:"#table_container",
        tableHead:null,
        data_null:'<div class="data_null"><p>未查询到匹配的数据！！！！</p></div>',
        url:'/san/search_zone/',
        data:null,
        init:function(data){
            this.tableHead=data;
            this.addEvent();
            if(wwn){
                this.requestData(this.url,wwn)
            }else{
                this.data=[];
                this.drawTable();
            }
        },
        requestData:function(url,wwns){
            var me=this
            $.post(url,{
                "wwns":wwns
            },function(data){
                me.data=data;
                me.drawTable();
            },"json");
        },
        drawTable:function(){
            var me=this;
            if(this.data.length){
                $(this.ele).html("");//清空table_container
                $.each(this.data,function(i,v){
                    var table=$('<table class="table table-striped table-bordered table-hover" id="t'+i+'"></table>');
                    //渲染caption
                    var caption='<caption>' +
                        '<p><b>zoneset_name</b>：<span>'+v.zoneset_name+'</span></p>' +
                        '<p><b>zone_name</b>：<span>'+v.zone_name+'</span></p>' +
                    '</caption>';
                    table.append(caption);
                    //渲染thead
                    var thead="<thead><tr>";
                    $.each(me.tableHead,function(item,val){
                        if(val['field']!="opt"){
                            thead+='<th>'+val['CH']+'</th>';
                        }
                    });
                    thead+="</tr></thead>";
                    table.append(thead);
                    //渲染tbody
                    var tbody=$('<tbody/>');
                    $.each(v['members'],function(item,val){
                        var tr='<tr>';
                        $.each(me.tableHead,function(item1,val1){
                            if(val1['field']!="opt") {
                                tr += '<td>' + val[val1['field']] + '</td>';
                            }
                        });
                        tr+='</tr>';
                        tbody.append(tr);
                    });
                    table.append(tbody);
                    $(me.ele).append(table);
                })
            }else{
                $(this.ele).html(this.data_null);
            }
            $(".preloader").addClass("hidden");
        },
        addEvent:function(){
            var me=this;
            $("button.search_btn").click(function(){
                $(".preloader").removeClass("hidden");
                me.requestData(me.url,$("#search").val());
            });
        }
    }
});