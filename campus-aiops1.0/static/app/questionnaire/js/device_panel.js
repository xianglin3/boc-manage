/**
 * Created by nantian on 2017/1/13.
 */
$(document).ready(function(){
    //设置画布高度
    function resizeCanvas(){
        var h=$(window).height(),
            w=$(window).width();
        $("#canvas").attr("width",w);
        $("#canvas").attr("height",h-50);
    }
    resizeCanvas();
    $(window).resize(function(){
        resizeCanvas();
    });

    //以下canvas的代码
    var canvas={
        timer:null,
        images:null,
        ethPortImg:null,
        devIp:"",
        url:"/device_switch/switch_interface_data/",
        init:function(deviceIp){
            var me=this;
            deviceIp&&(this.devIp=deviceIp);
            if(this.images===null){
                $.L("canvas",{
                    t_up:"/static/app/device_switch/images/t_normal.png",
                    b_up:"/static/app/device_switch/images/b_normal.png",
                    t_Adown:"/static/app/device_switch/images/t_shutdown.png",
                    b_Adown:"/static/app/device_switch/images/b_shutdown.png",
                    t_down:"/static/app/device_switch/images/t_up_nodata.png",
                    b_down:"/static/app/device_switch/images/b_up_nodata.png"
                },function(img){
                    me.ethPortImg=img;
                    me.images=$("#canvas").eth_switch({
                        defaultScale:0.45,
                        minScale:0.3,
                        maxScale:2.7//设置为0时不限制
                    });
                    //页面加载后第一个加载
                    me.firstRequest();
                });
            }else{
                this.firstRequest();
            }
        },
        firstRequest:function(){
            var me=this;
            $.post(this.url,{
                "device_id":this.devIp
            },function(data){
                var newData={
                    brd_number:0,
                    name:data.device.dev_name,
                    id:data.ip,
                    brd:{}
                }
                $("div.device_info td[data-val]").each(function(i,v){
                    var pro=$(v).attr("data-val");
                    $(v).html(data.device[pro]);
                });
                var brdId=1;
                $.each(data.interfaces,function(i,v){
                    if(!newData.brd[v.module]){
                        newData.brd[v.module]={};
                        newData.brd[v.module]["id"]=""+brdId;
                        newData.brd[v.module]["brd_pos"]=brdId;
                        newData.brd[v.module]["port_number"]=0;
                        newData.brd[v.module]["port"]={};
                        brdId++;
                    }
                    newData.brd[v.module]["port_number"]++;
                    var itemArr=/([0-9]+)\/([0-9]+)\/*([0-9]*)/.exec(v.interface_name),item;
                    if(itemArr[3]==""){
                        item=itemArr[2];
                    }else{
                        item=itemArr[3];
                    }
                    var s;
                    switch (v["interface_line_protocol_state"]){
                        case "up":
                            s = "up";
                            break;
                        case "down":
                            s = v["interface_admin_state"]=="up"?"down":"Adown";
                            break;
                        case "No_Module":
                            s = "Adown";
                            break;
                        case "Online":
                            s = "up";
                            break;
                        default :
                            s = "down";
                    }
                    newData.brd[v.module]["port"][item]={
                        status: s,
                        name: v["interface_name"]
                    }
                });
                me.images.start(newData,me.ethPortImg);
                me.images.init();
                me.images.click(function(tar){
                    if(tar){
                        $.each(data["interfaces"],function(i,v){
                            if(v["interface_name"]==tar.name){
                                $('#dialog_table tr[data-title]').each(function(item,val){
                                    var pro = $(val).attr("data-title");
                                    $(val).find("[data-v]").html(v[pro]);
                                });
                            }
                        });
                        $("#myModal").modal();
                    }
                });
                //me.refreshData();//间隔请求后台数据
            },"json")
        },
        refreshData:function(){
            var me=this;
            this.timer=setInterval(function(){
                $.post(me.url,{
                    "device_id":me.devId
                },function(data){
                    me.images.refreshData(data);
                },"json");
            },5000)
        },
        stop:function(){//离开页面时停止刷新端口状态
            clearInterval(this.timer)
            this.timer=0;
        }
    }

    canvas.init(window.location.search.slice(11));//把变量后的值提取出来，比如当前为?device_id=122 122之前长度为11填入
});