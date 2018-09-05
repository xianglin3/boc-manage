$(document).ready(function(){
    var branch;//用来保存分行信息
    var requestData=null;
    var sort=1;
    var lim;//用来保存百分比的门限

    //封装摸态框调用函数
    function dialog(id,title,body,footer,size){//传入摸态框id、标题、内容、按钮、大小(modal-lg\modal-md)
        $('#'+id+' .modal-title').html(title);
        $('#'+id+' .modal-body').html(body);
        $('#'+id+' .modal-footer').html(footer);
        $('#'+id+' .modal-dialog').removeClass("modal-lg").removeClass("modal-md").addClass(size);
        $('#'+id).modal();
    }

    //获取设备信息
    $.get("/static/json/vpnsearch/deviceInfo.json",function(data){
        var option="";
        $.each(data,function(i,v){
            option+='<option value="'+ v.device_ip+'">'+ v.device_name+'('+ v.device_ip+')</option>';
        });
        $("#deviceList").html(option);
    },"json");

    //获取分行信息
    $.get("/static/json/vpnsearch/branch.json",function(data){
        branch=data;
        var options="<option value='selectAll'>全部分行</option>";
        $.each(data,function(i,v){
            options+="<option value='"+v.peer_ip+"'>"+ v.branch +"</option>";
        });
        $("#selLocation").append(options);
    },"json");

    //获取门限配置
    $.get("/static/json/vpnsearch/heightLight.json",function(d){
        lim=d;
    },"json");

    //刷新设备信息（获取ｖｐｎ设备的cpu、内存等信息）
    $("#reload").click(function(){
        $(".preloader").removeClass("hidden");
        $.post("/vpnanalyzer/get_vpn_device_status/",{
            "ip":$("#deviceList").val()
        },function(data){
            $('#cpu').html(data.cpu);
            $('#mem').html(data.memory);
            $('#log').html('<button type="button" id="popLog" class="btn btn-info">查看详情</button>');
            $("#checkPeer").attr("disabled",false);
            $("#selLocation").val('selectAll')
                .attr("disabled",false)
                .trigger("change");
            $("#popLog").click(function(){
                var button=$('<a class="copy btn btn-info">复制到剪切板</a>');
                dialog("myModal","设备日志详细","<div class='modalDeviceLog'><pre>"+data.log+"</pre></div>",button,"modal-lg");
                //console.log($("#myModal").css("display"));
                var timer=setInterval(function(){
                    if($("#myModal").css("display")=="block"){
                        clearInterval(timer);
                        $(".copy").zclip({
                            path: "/static/js/ZeroClipboard.swf",
                            copy: function(){
                                return data.log;
                            },
                            afterCopy:function(){/* 复制成功后的操作 */
                                window.alert("复制成功！");
                            }
                        });
                    }
                },100);
            });
            $("div.status span[data-lim]").each(function(i,v){
                var val=parseInt($(v).html());
                var pro=$(v).attr("data-lim");
                if(val>lim[pro]){
                    $(v).css("background-color","#e4393c");
                }else{
                    $(v).css("background-color","#00A65A");
                }
                $(v).css("color","#fff");
            });
            //$(".preloader").addClass("hidden");
        },"json");
    });

    //获取分行peer信息
    $("#checkPeer").click(function(){
        $(".searchVpnTable tbody").remove();
        $(".preloader").removeClass("hidden");
        var selectVal=$("#selLocation").val();
        var peer_ip_list=[];
        if(selectVal=='selectAll'){
            $.each(branch,function(i,v){
                peer_ip_list.push(v.peer_ip);
            });
        }else{
            peer_ip_list.push(selectVal);
        }
        $.post("/vpnanalyzer/get_branch_status/",
            {
                "ip":$("#deviceList").val(),
                'peer_ip_list[]':peer_ip_list
            },function(d){
                requestData=d;
                drawTable(d);
                $(".preloader").addClass("hidden");
            },'json'
        );
    });
    //表格排序功能
    $("th[data-title]").click(function(){
        $(".searchVpnTable tbody").remove();
        var col=$(this).attr("data-title");
        sort>0?sort=-1:sort=1;
        requestData.sort(function(a,b){
            if(isNaN(a[col])){
                for(var i=0;i<a[col].length-1&&(i<b[col].length-1);i++){
                    var ac=a[col].charCodeAt(i),bc=b[col].charCodeAt(i);
                    if(ac!==bc){
                        return sort*(ac-bc);
                        break;
                    }
                }
            }else{
                var ac=parseInt(a[col]),bc=parseInt(b[col]);
                return sort*(ac-bc);
            }

        })
        drawTable(requestData);
    });
    function drawTable(data){
        var ip_name={};//创建一个对象用来索引IP和分行的名字
        $.each(branch,function(i,v){
            ip_name[v.peer_ip]= v.branch;
        });
        var tbody=$("<tbody></tbody>");
        $(data).each(function(i,v){
            var tr=$("<tr>" +
            "<td>"+ (i+1) +"</td>" +
            "<td class='col_ip'>"+ v.peer_ip +"</td>"+
            "<td>"+ ip_name[v.peer_ip] +"</td>" +
            "<td>"+ v.type +"</td>" +
            "<td>"+ v.role +"</td>" +
            "<td>"+ v.rekey +"</td>" +
            "<td>"+ v.state +"</td>" +
            "<td>" +
            "<button type='button' class='btn btn-info codeSeek'>查看</button>" +
            "</td>" +
            "</tr>");
            tbody.append(tr);
        });
        $(".searchVpnTable").append(tbody);
    }
    //下拉选项与查询分行绑定触发
    $("#selLocation").change(function(){
        $("#checkPeer").trigger("click");
    });
    //获取分行某peer加解密包信息
    $("body").on("click","button.codeSeek",function(){
        $(".preloader").removeClass("hidden");
        var ip=$(this).parents("td").siblings("td.col_ip").html();
        $.post("/vpnanalyzer/get_vpn_peer_info/",{
            "ip":$("#deviceList").val(),
            "peer_ip":ip
        },function(data){
            $("#modal_table").html("");
            var table='<table class="table table-bordered">' +
                '<thead>' +
                    '<tr>' +
                        '<th>第N次</th>' +
                        '<th>encrypt</th>' +
                        '<th>decrypt</th>' +
                        '<th width="75%">access-list</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
            $.each(data,function(i,v){
                var rowNum= v.length;
                i=i-0;
                $.each(v,function(item,val){
                    var firstTd=(item==0?'<td class="rowSpan" rowspan="'+rowNum+'">第'+i+'次</td>':'');
                    table+='<tr>' +firstTd+
                        '<td>'+ val.encrypt+'</td>' +
                        '<td>'+ val.decrypt+'</td>' +
                        '<td>'+ val["access-list"]+'</td>' +
                    '</tr>';
                });
            });
            table+='</tbody></table>';
            dialog("myModal","加密解密包数量变化",table,"","modal-lg");
            $(".preloader").addClass("hidden");
        },"json");
    });
})