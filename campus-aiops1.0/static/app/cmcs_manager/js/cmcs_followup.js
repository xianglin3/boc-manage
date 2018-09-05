/**
 * Created by nantian on 2017/1/16.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");

    var chart_line=null,char_pie=null;
    //状态表格
    function table_status(data){
        var datas = {
            following:0,
            consult:0,
            waiting_follow:0,
            waiting_CMCS:0,
            nonsupport:0,
            success:0,
            offline:0,
            followup:0
        };

        var series = [],
            legendData = [],
            percentage=[0,0,0];//保存百分比

        //判断当前日期是否是本周
        function isThisWeek(date){
            var today = new Date().getTime();
            date = new Date(date).getTime();
            return today - date < 7*24*60*60*1000;
        }

        //区分日期的范围，如果2周内返回0，2-3周内返回1，3周以上返回2
        function dateRange(passing_day){
            if(passing_day < 14){
                return 0;
            }else if(passing_day < 21){
                return 1;
            }else{
                return 2;
            }
        }
        $(data).each(function(i,v){
            if(v['iskey']){

                isThisWeek(v['update_time'])&&datas['followup']++;

                var x = v['business_type']||"未知",
                    y = dateRange(v['passing_day']);
                if(v['status'] == 0||v['status'] == 1||v['status'] == 2||v['status'] == 5){
                    percentage[y]++;
                    var index = legendData.indexOf(x);
                    if(index == -1){
                        var seriesData = [0, 0, 0];
                        seriesData[y]++;
                        legendData.push(x);
                        series.push({
                            name: x,type: 'bar',
                            label: {normal: {show: true,position: 'insideRight'}},
                            data: seriesData
                        });
                    }else{
                        series[index].data[y]++;
                    }
                }

                switch (v['status']){
                    case 0:
                        datas['following']++;
                        datas['consult']++;
                        break;
                    case -1:
                        datas['nonsupport']++;
                        break;
                    case 1:
                        datas['waiting_follow']++;
                        datas['following']++;
                        break;
                    case 2:
                        datas['waiting_CMCS']++;
                        datas['following']++;
                        break;
                    case 3:
                        isThisWeek(v['update_time'])&&datas['success']++;
                        break;
                    case 4:
                        isThisWeek(v['update_time'])&&datas['offline']++;
                        break;
                    case 5:
                        datas['following']++;
                        break;
                }
            }
        });
        $("span[data-val=lt2]").html(percentage[0]+"，"+String(percentage[0]/datas['following']*100).slice(0,3)+"%");
        $("span[data-val=lt3]").html(percentage[1]+"，"+String(percentage[1]/datas['following']*100).slice(0,3)+"%");
        $("span[data-val=gt3]").html(percentage[2]+"，"+String(percentage[2]/datas['following']*100).slice(0,3)+"%");
        $("#statistics_txt span[data-val]").each(function(i,v){
            var pro = $(v).attr("data-val");
            $(v).html(datas[pro]);
        });
        img_line(series,legendData);
    }
    //柱状图
    function img_line(series,ld){
        var ele = document.getElementById('statistics_line');
        if(chart_line !== null){
            echarts.dispose(ele);
        }
        chart_line = echarts.init(ele);
        chart_line.setOption({
            title : {text: '运维组-跟进时间分布'},
            tooltip : {trigger: 'axis',axisPointer : {type : 'shadow'}},
            legend: {itemWidth:20,itemHeight:12,top:'12%',
                data:ld},
            grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
            yAxis:  {type: 'value'},
            xAxis: {type: 'category',data: ['1周以内','2-3周','3周以上']},
            series: series
        });
    }

    //饼图
    function img_pie(data){
        var ele = document.getElementById('statistics_pie');
        if(char_pie !== null){
            echarts.dispose(ele);
        }
        char_pie = echarts.init(ele);
        var legendData = [],seriesData=[],obj={};
        $(data).each(function(i,v){
            if(v['status'] == 1&&v['iskey']){
                var item = obj[v['business_type']];
                if(item){
                    seriesData[item-1]['value']++;
                }else{
                    obj[v['business_type']] = legendData.length+1;
                    legendData.push(v['business_type']);
                    seriesData.push({
                        value:1,
                        name:v['business_type']
                    });
                }
            }
        });
        var series=[{
            name: '待整改',type: 'pie',radius : '55%',center: ['50%', '65%'],
            data:seriesData
        }];
        char_pie.setOption({
            title : {text: '运维组待整改分布'},
            tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"},
            legend: {orient: 'horizontal',top: '12%',
                data: legendData
            },
            series : series
        });
    }

    $.get("/static/app/cmcs_manager/json/table_head.json",function(d){
        table.init(d);
    },"json");
    var table={
        ele:"#cmcs_followup",
        field:null,
        oldData:null,
        data:null,
        trChild:null,
        table:null,
        lang:null,
        options:null,
        url:"/cmcs_manager/get_records_list/",
        addFollowUp:"/cmcs_manager/addFollowUp/",
        init:function(field){
            this.field=field;
            this.lang={
                "sProcessing": "处理中...",
                "sLengthMenu": "每页显示 _MENU_ 组记录",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 个设备，共 _TOTAL_ 个",
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
            this.requestData();
            this.addEvent();
        },
        drawHead:function(){
            var thead='<thead><tr>';
            $.each(this.field,function(i,v){
                thead+='<th width="'+ v.width+'%">'+v.CH+'</th>';
            });
            thead+='</tr></thead>';
            $(this.ele).append(thead);
        },
        requestData:function(){
            var me=this;
            $.get(this.url,function(data){
                me.oldData=data.sort(function(a,b){
                    return a["id"]-b["id"];
                });
                me.classify("0125","all",[]);
                img_pie(data);//渲染饼图
                table_status(data);
            },"json");
        },
        classify:function(option,business_type,time){
            var me=this;
            me.options = {
                state:option,
                business_type:business_type,
                time:time
            };
            this.data=[];
            $.each(this.oldData,function(i,v){
                if(option=="all"){
                    me.data.push(v);
                }else if(option=="0125"){
                    if(v["iskey"]){
                        if(v["status"]==0||v["status"]==1||v["status"]==2||v["status"]==5){
                            me.data.push(v);
                        }
                    }else{
                        me.data.push(v);
                    }
                }else{
                    if(v["iskey"]){
                        if(v["status"]==option){
                            me.data.push(v);
                        }
                    }else{
                        me.data.push(v);
                    }
                }
            });
            if(business_type != "all"){
                $(me.data).each(function(i,v){
                    if(v['business_type'] != business_type){
                        var item = me.data.indexOf(v);
                        me.data.splice(item,1);
                    }
                });
            }
            if(time.length){
                var min = (new Date(time[0])).getTime();
                var max = (new Date(time[1])).getTime();
                max==""&&(max = Infinity);
                $(me.data).each(function(i,v){
                    var t = v['update_time'];
                    if(!v['iskey']){
                        if(/^\d{4}-\d{2}-\d{2}$/.test(t)){
                            var time = (new Date(t)).getTime();
                            if(time>max||time<min){
                                var item = me.data.indexOf(v);
                                me.data.splice(item,1);
                            }
                        }else{
                            var item = me.data.indexOf(v);
                            me.data.splice(item,1);
                        }
                    }
                });
            }
            this.drawBody();
        },
        drawBody:function(){
            var me=this;
            this.table&&this.table.destroy&&this.table.destroy();
            $(this.ele+' tbody').remove();
            var tbody=$('<tbody></tbody>');
            this.trChild={};
            var status=["不支持纳管","协商中","待运维组整改","待CMCS处理","已处理完成","已脱管待观察","长期遗留"];
            $.each(this.data,function(i,v){
                var data_attr= v.ip.replace(/\./g,"_");
                if(v.iskey){
                    var tr=$('<tr data-parent="'+data_attr+'" data-id="'+ v.id+'"></tr>');
                    tbody.append(tr);
                }else{
                    var tr=$('<tr data-child="'+data_attr+'"></tr>');
                    if(me.trChild[data_attr]){
                        me.trChild[data_attr].push(tr);
                    }else{
                        me.trChild[data_attr]=[tr];
                    }
                }
                $.each(me.field,function(item,val){
                    if(val["field"]=="iskey"){
                        var td=(v[val["field"]]?'<button type="button" class="btn btn-info">跟进</button>':"");
                    }else if(val["field"]=="status"){
                        var td=status[v[val["field"]]-0+1];
                    }else if(val["field"]=="ip"&&v["iskey"]){
                        var td=v[val["field"]]+'<span data-num="'+data_attr+'"></span>';
                    }else{
                        var td=v[val["field"]];
                    }
                    tr.append('<td data-field="'+val.field+'">'+td+'</td>');
                });
            });
            $(this.ele).append(tbody);
            $(this.ele+" span[data-num]").each(function(i,v){
                var pro=$(v).attr("data-num");
                var child=me.trChild[pro];
                $(v).html(" (<b> "+(child?child.length+1:1)+" </b>)");
            });
            this.table=$('#cmcs_followup').DataTable({
                responsive: true,
                language:this.lang,
                ordering: true,
                aaSorting:[[8,"desc"]],
                lengthMenu:[[10,25,50,100,-1],[10,25,50,100,"所有"]]
            });
            $(".preloader").addClass("hidden");

        },
        addEvent:function(){
            var me=this;
            var id;
            $(this.ele).on("click","tr[data-parent]",function(){
                var tar=$(this).attr("data-parent");
                var self=this;
                $(this).toggleClass("open");
                if($("tr[data-child="+tar+"]").length){
                    //$(this).removeClass("open");
                    $("tr[data-child="+tar+"]").remove();
                }else{
                    //$(this).addClass("open");
                    $.each(me.trChild[tar],function(i,v){
                        $(self).after($(v));
                    });
                }
            });
            $(this.ele).on("click","button.btn",function(e){
                e.stopPropagation();
                id=$(this).parents("tr").attr("data-id");
                var obj={};
                $(this).parent("td").siblings("td").each(function(i,v){
                    var pro=$(v).attr("data-field");
                    if(pro=="ip"){
                        obj["ip"]=/[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}/.exec($(v).html());
                    }else if(pro=="followup"){
                        obj[pro]="";
                    }else if(pro=="followup_person"){
                        obj[pro]="";
                    }else{
                        obj[pro]=$(v).html();
                    }
                });
                $("#myModal").modal();
                $("#myModal .form-control").each(function(i,v){
                    $(v).val(obj[$(v).attr("id")]);
                });
            });
            $("#myModal button.btn-success").click(function(){
                $(".preloader").removeClass("hidden");
                var obj={id:id};
                $("#myModal .form-control").each(function(i,v){
                    obj[$(v).attr("id")]=$(v).val();
                });
                $.post(me.addFollowUp,obj,function(data){
                    $(".preloader").addClass("hidden");
                    if(data=="1"){
                        $('#myModal').modal('hide');
                        me.requestData();
                    }else{
                        window.alert("数据格式存在问题，请修改后重新提交！");
                    }
                });
            });
            $("div.widget-content ul>li>a").click(function(e){
                var e=e||event;
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
                $(this).parent("li").addClass("active").siblings("li").removeClass("active");
                var business_type = $("#business_type_1").val();
                $("#time_start").val("");
                $("#time_end").val("");
                me.classify($(this).attr("href"),business_type,[]);
            });
            $("#filter_btn").click(function(){
                var business_type = $("#business_type_1").val(),
                    t_s = $("#time_start").val(),
                    t_e = $("#time_end").val();
                var status = $("div.widget-content ul>li.active>a").attr("href");
                t_s = t_s||"2010-01-01";
                t_e = t_e||"2080-01-01";
                if(/^\d{4}-\d+-\d+$/.test(t_s)&&/^\d{4}-\d+-\d+$/.test(t_e)){
                    me.classify(status,business_type,[t_s,t_e]);
                }else{
                    window.alert('输入的日期格式不符合格式！！！');
                }
            });
            $("#dateRange").change(function(){
                var val = $(this).val();
                var today = new Date(),before14,before21;
                today.setDate(today.getDate()-14);
                before14 = today.toLocaleDateString().replace(/\//g,"-");
                today.setDate(today.getDate()-7);
                before21 = today.toLocaleDateString().replace(/\//g,"-");
                if(val == "all"){
                    $("#time_start").val("");
                    $("#time_end").val("");
                }else if(val == "14"){
                    $("#time_start").val(before14);
                    $("#time_end").val("");
                }else if(val == "21"){
                    $("#time_start").val(before21);
                    $("#time_end").val(before14);
                }else{
                    $("#time_start").val("");
                    $("#time_end").val(before21);
                }
            });
            $("#export_excel").click(function(){
                var data = JSON.stringify(me.options);
                var url = "/cmcs_manager/export_data/";//后台保存文件接口
                var $inputContent = $('<input>').attr({ name: "data", value: data });
                var $form = $("<form>");
                console.log(data);
                $form.addClass("hidden").appendTo("body");
                $form.attr({ target: '_blank', method: 'post', action: url }).append($inputContent);
                $form.submit();
                $form.remove();
            });
        }
    };
});