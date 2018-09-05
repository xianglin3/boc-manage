/**
 * Created by nantian on 2016/11/10.
 */
$(document).ready(function(){
    //页面加载完成后通过GET获取设备准备和IP信息
    $.get("/static/config/deviceInformation.json",function(data){
        var $html='<option value="0">请选择设备</option>';
        $.each(data,function(i,v){
            $html+='<option value="'+i+'">'+ v.masterDevice+'</option>';
        });
        tBody=$('#masterTbody').html();
        $("#master_device").html($html).change(function(){
            var value=$(this).val();
            if(value!=="0"){
                var masterIP=data[value].masterIp;
                $("#master_ip").html(masterIP);
                $("#backup_device").html('<option>'+data[value].backupDevice+'</option>');
				var backupIP=data[value].backupIp;
                $("#backup_ip").html(backupIP);
                $(".preloader").removeClass("hidden");
                //通过改变select的选择触发post请求设备状态
                $.post("/static/config/devicestatus.json",{
                    "ip":masterIP,
                    "command1":"show interface",
                    "command2":"show failover",
                    "command3":"show cpu usag",
                    "command4":"show process memory"
                },function(data){
                    doResponse(data,masterIP,backupIP);
                },"json");
            }else{
                $('#masterTbody').html(tBody);
                $('#backupTbody').html(tBody);
                $("#master_ip").html("");
                $("#backup_device").html("");
                $("#backup_ip").html("");
            }
        });

        function doResponse(data,mIp,bIp){
            $.each(data,function(i,v){
                var html='<tr class="secondTitle">'
                    +'<td>命令</td>'
                    +'<td>内容</td>'
                    +'<td class="fix_width_td">是否正常</td>'
                +'</tr>',emptyHtml=html;
                $.each(v.output,function(item,val){
                    html+='<tr>'
                        +'<td>'+val.command+'</td>'
                        +'<td><pre>'+val.output+'</pre></td>'
                        +'<td>'+val.status+'</td>'
                    +'</tr>';
                })
                if(v.ip==mIp){
                    $('#masterTbody').html(html);
                }else if(v.ip==bIp){
                    $('#backupTbody').html(html);
                }else{
					$('#masterTbody').html(emptyHtml);
					$('#backupTbody').html(emptyHtml);
				}
            });
            $(".preloader").addClass("hidden");
        }
    },"json");
    //固定表头
    //$(document).scroll(function(e){
    //    var startTop=$('#masterTbody').offset().top;
    //    var top=$('body').scrollTop(),
    //        offset=top-startTop;
    //    if(offset>0){
    //        $('tr.secondTitle:first').css("transform","translateY("+offset+"px)");
    //        console.log(offset);
    //    }else{
    //        console.log(0);
    //        $('tr.secondTitle:first').css("transform","translateY(0px)");
    //    }
    //});
});