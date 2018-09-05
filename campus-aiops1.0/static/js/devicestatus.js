/**
 * Created by nantian on 2016/11/10.
 */
$(document).ready(function(){
    //页面加载完成后通过GET获取设备准备和IP信息
    $.get("/static/config/deviceInformation.json",function(d){
        var data= d.data;
        var $html='<option value="0">请选择设备</option>';
        $.each(data,function(i,v){
            $html+='<option value="'+i+'">'+ v.masterDevice+'</option>';
        });
        tBody=$('#masterTbody').html();
        var $page_content=$("#page_m").html();
        $("#master_device").html($html).change(function(){
            var value=$(this).val();
            $("#page_m").html($page_content);
            $("#page_b").html($page_content);
            if(value!=="0"){
                var masterIP=data[value].masterIp;
                $("#master_ip").html(masterIP);
                $("#backup_device").html('<option>'+data[value].backupDevice+'</option>');
				var backupIP=data[value].backupIp;
                $("#backup_ip").html(backupIP);
                $(".preloader").removeClass("hidden");
                //通过改变select的选择触发post请求设备状态
                $.post("/devicestatus/fw_status/",{
                    "master_ip":masterIP,
                    "backup_ip":backupIP,
                    "command[]":["show interface","show failover","show cpu usag","show memory"]
                },function(data){
                    doResponse(data,masterIP,backupIP);
                },"json");
            }else{
                $("#master_ip").html("");
                $("#backup_device").html("");
                $("#backup_ip").html("");
            }
        });

        function doResponse(data,mIp,bIp){
            $.each(data,function(i,v){
                if(i==mIp){
                    var s="m";
                }else if(i==bIp){
                    var s="b";
                }
                if(s){
                    var li='<li><a class="tip">命令</a></li>';
                    var div='';
                    $.each(v.output,function(item,val){
                        var a=(item==0?"active":"");
                        li+='<li class="'+a+'"><a href="'+s+item+'">'+val.command+'</a></li>';
                        div+='<div data-target="'+s+item+'" class="page '+a+'">'
                            +'<pre>'+val.output+'</pre>'
                        +'</div>';
                    });
                    $("#ulTab_"+s).html(li);
                    $("#page_"+s).html(div);
                }
            });
            //添加高亮颜色
            $("div.page_content pre>a span[data-lim]").each(function(i,v){
                var val=parseInt($(v).html());
                var pro=$(v).attr("data-lim");
                if(!isNaN(val)){
                    if(val> d.lim[pro]){
                        $(v).css("backgroundColor","#ea4323");
                    }else{
                        $(v).css("backgroundColor","#00A65A");
                    }
                }
            });
            //添加链接的单击事件
            $("div.page_content pre>a").click(function(e){
                var e=e||event;
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
                var tar=$(this).attr("href");
                $(this).parents(".show_result").find("ul.nav>li>a[href]").each(function(i,v){
                    if($(v).html()==tar){
                        $(v).trigger("click");
                    }
                })
            });
            $(".preloader").addClass("hidden");
        }
        //添加页签切换事件
        $("body").on("click",".page_tab a[href]",function(e){
            var e=e||event;
            if(e.preventDefault){
                e.preventDefault();
            }else{
                e.returnValue = false;
            }
            var tar=$(this).attr("href");
            $(this).parent("li").addClass("active").siblings("li.active").removeClass("active");
            $("div[data-target="+tar+"]").addClass("active").siblings("div.active").removeClass("active");
        })
    },"json");
});