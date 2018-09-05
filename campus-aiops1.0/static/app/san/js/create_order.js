/**
 * Created by Administrator on 2017-05-07.

*/
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    var QWeb = new QWeb2.Engine();
    var tempLoaded = false,create_order_json;
    QWeb.add_template("/static/app/san/xml/create_order.xml",function(e){
        if(create_order_json){
            order_zone.init(create_order_json);
        }else{
            tempLoaded = true;
        }
    });
    QWeb.debug = true;

    $.get("/static/app/san/json/create_order.json",function(data){
        if(tempLoaded){
            order_zone.init(data);
        }else{
            create_order_json = data;
        }

    },"json");

    $(".zone_help").click(function(){
        var html = QWeb.render("zone_help")
        $.alert(html,'划zone帮助',null,"modal-lg");
    });
    var order_zone = {
        id:"",
        data:null,
        order_pro:null,
        readonly:null,
        buttons:null,
        isModified:false,
        orderUrl:"/san/order/",//获取工单详情URL
        saveUrl:"/san/create_order/",//保存草稿
        submitUrl:"/san/submit_order/",//提交工单
        getSN_data:"/san/get_all_storage_sn/",//获取storage_sn数据
        checkStorage:"/san/check_storage_port/",//检查端口地址
        createScriptUrl:"/san/create_script/",//生成划zone脚本
        getScriptUrl:"/san/search_script/",//获取划zone脚本
        saveScriptUrl:"/san/update_script/",//保存脚本
        getBackArea:"/san/get_all_backup_area/",//获取所有备份域
        recordListUrl:"/san/record_list/",
        scriptData:null,//保存脚本数据
        isChecked:true,//用来保存端口是否检查过
        portIsOk:true,//用来保存端口坚持是否正常
        SnData:null,
        vila1:true,//校验报错标志
        vila2:true,//校验警告标志
        checkinfo:"",//保存检查的警告信息
        backAreaData:null,//用来保存备份域数据
        init:function(thead){
            var me = this;
            this.id = window.location.search.slice(4) || "none";
            this.order_pro = thead["order_pro"];
            this.readonly = thead["readonly"];
            this.buttons = thead["buttons"];
            $.get(this.getBackArea,function(data){
                me.backAreaData = data.sort();
                me.requestDate();
                me.addEvent();
            },"json");
            //set title
            var sessionData = JSON.parse(sessionStorage.getItem("san_session")),title;
            if(this.id == "none"){
                title = "SAN-新建工单";
                sessionData.type = '我的工单';
                sessionStorage.setItem("san_session",JSON.stringify(sessionData));
            }else if(sessionData.type == "需处理的工单" && sessionData.status == "审批"){
                title = "SAN-待审批工单";
            }else if(sessionData.type == "我的工单" && sessionData.status == "审批"){
                title = "SAN-审批中工单";
            }else if(sessionData.status == "草稿"){
                title = "SAN-草稿";
            }else{
                title = "SAN-已"+sessionData.status+"工单";
            }
            $("title").html(title);
        },
        requestDate:function(){
            $(".preloader").removeClass("hidden");
            var me = this;
            if(this.id == "none"){
                this.data = {
                    "order":{
                        "create_time":"后端自动生成",
                        "applicant":"后端自动生成",
                        "state":"草稿"
                    },
                    "zones":[],
                    "buttons":[0,3,4]
                };
                me.drawData();

            }else{
                $.post(this.orderUrl, {
                    order_id: this.id,
                    type:sessionStorage.getItem("san_session")
                }, function(data){
                    if(data.err){
                        $(".preloader").addClass("hidden");
                        $.alert(data.err);
                    }else{
                        me.data = data;
                        me.drawData();
                    }
                }, "json");
            }
        },
        drawData:function(){
            var me = this;
            var data = {
                pro: this.order_pro,
                val: this.data['order']
            };
            var html = QWeb.render("order_pro",data);
            $("#work_list_info").html(html);

            html = QWeb.render("zone_list",{val: this.data['zones'],ord:this.data['order'],area:this.backAreaData});
            $("#zone_list").html(html);

            var btns = [];
            $.each(this.data['buttons'],function(i,v){
                btns.push(me.buttons[v]);
            });

            html = QWeb.render("zone_list_btns", {btn:btns});
            $(".btn_foot").html(html);

            $("textarea[name=description]").val(this.data['order']['description']||"");

            this.setReadOnly();

            var allowNull = true;
            if(this.data['buttons'][2]  == 6){
                allowNull = false;
            }
            this.drawAfter(null,allowNull);

        },
        drawAfter:function(tr,allowNull){
            var me = this,
                textVal = '';
            if(this.SnData){
                var input = tr.find(".auto_complete"),
                    textarea = tr.find(".storage_port");
                input.each(function(i,v){
                    new Awesomplete(v, {list: me.SnData,minChars:1,sort: false,maxItems:Infinity});
                });
                input.blur(function(){blur(this);});
                input.keyup(function(){inputChange(this)});
                textarea.blur(function(){textareaBlur(this)});
                textarea.focus(function(){
                    textVal = $(this).val();
                });
            }else{
                $.get(this.getSN_data, function(data){
                    me.SnData = data;
                    $(".auto_complete").each(function(i,v){
                        new Awesomplete(v, {list: me.SnData,minChars:1,sort: false,maxItems:Infinity});
                    });
                    $(".auto_complete").blur(function(){
                        blur(this);
                    });
                    $(".auto_complete").keyup(function(){inputChange(this)});
                    $(".storage_port").blur(function(){textareaBlur(this)});
                    $(".storage_port").focus(function(){
                        textVal = $(this).val();
                    });
                    $(".preloader").addClass("hidden");
                },"json");
            }
            function blur(tar){
                var v = $(tar).val();
                if(me.SnData.indexOf(v)==-1){
                    var bx = $(tar).siblings("ul").find("li:first").html() || "";
                    bx = bx.replace(/<[\/]?mark>/g,"");
                    $(tar).val(bx||"");
                }
            }
            function inputChange(tar){
                $(tar).parents("tr[data-zid]").find(".form-control[name=storage_port_for_zone]").val("");
            }
            function textareaBlur(tar){
                var sn = $(tar).parents("tr[data-zid]").find(".form-control[name=storage_sn_for_zone]").val(),
                    text = $(tar).val();
                    wwn = $(tar).parents("tr[data-zid]").find(".form-control[name=wwn]").val();
                if(sn !== '其他sn' && wwn.split('\n').length>1){
                    if(textVal != text){
                        if(!(/^\w+\/\w+(\s\w+\/\w+)*$/.test(text))){
                            $(tar).val($(tar).attr("data-val"));
                        }
                    }
                }
            }
            $.each(this.data['zones'],function(i,v){
                if(!v['isok']){
                    me.isChecked = false;
                    return false;
                }
            });
            $(".form_datetime").datetimepicker({
               format: "yyyy-MM-dd hh:ii:ss",
               language: 'zh-CN',
               autoclose: true,
               todayBtn: true,
               pickerPosition: "bottom-left",
               minuteStep: 1,
               zIndex:1000
            });
        },
        setReadOnly:function(){
            var index = 0;
            var me = this;
            if(this.data['buttons'].indexOf(3)>-1){
                index = 1;
            }else if(this.data['buttons'].indexOf(6)>-1){
                index = 2;
            }
            $(".form-control[name]").each(function(i,v){
                var pro = $(v).prop("name");
                $(v).prop("readonly",me.readonly[index][pro]);
                if(pro == "backup_area"){
                    $(v).prop("disabled",me.readonly[index][pro]);
                }
            });
            if(this.readonly[index]['hidden_able']){
                $(".btn.hidden_able").addClass("hidden");
            }
        },
        preventOut:function(){//退出页面前确认
            if(!this.isModified){
                this.isModified = true;
                $(window).bind('beforeunload', function (e) {
                    var confirmationMessage = "确认退出吗？";
                    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
                    return confirmationMessage;
                });
            }
        },
        allowOut:function(){//取消退出确认
            this.isModified = false;
            $(window).unbind('beforeunload');
        },
        checkValue:function(){
            this.vila1 = true;
            this.vila2 = true;
            var me = this;
            $(".form-control.required").each(function(i,v){
                var name = $(v).attr("data-title");
                if($(v).val() == ""){
                    $(v).trigger("focus");
                    $.alert(name+" 字段不能为空！");
                    me.vila1 = false;
                    return false;
                }
            });

            if(this.vila1){
                $("#zone_list tr").each(function(i,v){
                    var wwn = $(v).find("[name=wwn]").val();
                    var wwnArr = wwn.split("\n");
                    if (wwnArr[0].indexOf(' ')<0 && wwnArr[0].indexOf(':')<0){
                        wwnArr = wwnArr.slice(1);
                        wwn = wwnArr.join("\n");
                        $(v).find("[name=wwn]").val(wwn);
                    }
                    var wwnLen = wwnArr.length,
                        storage_sn = $(v).find("[name=storage_sn]").val(),
                        storage_port = $(v).find("[name=storage_port]").val(),
                        backup_area = $(v).find("[name=backup_area]").val();
                    var hbaPortsStr = getHbaPortstr(wwnArr);
                    if(storage_sn == "纯备份域zone"){
                        if(backup_area){
                            if(checkWwn(wwnArr,i)){
                                if(hbaPortsStr != "23,24,13,14" && hbaPortsStr != "13,14,23,24"){
                                    me.checkinfo = "第 "+(i+1)+" 条wwn字段端口号不符合规范，端口号应为\n23,24,13,14或\n13,14,23,24\n是否继续提交？";
                                    me.vila2 = false;
                                    $(v).find("[name=wwn]").trigger("focus");
                                }
                            }else{
                                $(v).find("[name=wwn]").trigger("focus");
                                me.vila1 = false;
                                return false;
                            }
                        }else{
                            $.alert("如果存储SN为纯备份域zone，则备份域为必填项！！");
                            $(v).find("[name=backup_area]").trigger("focus");
                            me.vila1 = false;
                            return false;
                        }
                    }else{
                        if(backup_area){
                            if(checkWwn(wwnArr,i)){
                                if(hbaPortsStr != "21,22,23,24,11,12,13,14"
                                    && hbaPortsStr != "11,12,13,14,21,22,23,24"
                                    && hbaPortsStr != "fcs0,fcs1,fcs2,fcs3"){
                                    me.checkinfo = "第 "+(i+1)+" 条wwn字段端口号不符合规范,端口号应为\n21,22,23,24,11,12,13,14或\n11,12,13,14,21,22,23,24或\nfcs0,fcs1,fcs2,fcs3\n是否继续提交？";
                                    me.vila2 = false;
                                    $(v).find("[name=wwn]").trigger("focus");
                                }
                            }else{
                                $(v).find("[name=wwn]").trigger("focus");
                                me.vila1 = false;
                                return false;
                            }
                        }else{

                            if(wwnLen ==1){
                                if(!checkWwn(wwnArr,i)){
                                    $(v).find("[name=wwn]").trigger("focus");
                                    me.vila1 = false;
                                    return false;
                                }
                            }else{
                                if(checkWwn(wwnArr,i)){
                                    if(hbaPortsStr != "11,12,21,22"
                                        && hbaPortsStr != "21,22,11,12"
                                        && hbaPortsStr != "fcs0,fcs2"){
                                        me.checkinfo = "第 "+(i+1)+" 条wwn字段端口号不符合规范,端口号应为\n11,12,21,22或\n21,22,11,12或\nfcs0,fcs2\n是否继续提交？";
                                        me.vila2 = false;
                                        $(v).find("[name=wwn]").trigger("focus");
                                    }
                                }else{
                                    $(v).find("[name=wwn]").trigger("focus");
                                    me.vila1 = false;
                                    return false;
                                }
                            }
                        }
                        if(storage_sn != "其他sn"){
                            var reg = /^\w+\/\w+(\s\w+\/\w+)*$/;
                            if(wwnLen == 1){
                                reg = /^\w+$/;
                                if(!reg.test(storage_port)){
                                    $.alert("第 "+(i+1)+" 行存储端口必须为1个！！");
                                    $(v).find("[name=storage_port]").trigger("focus");
                                    me.vila1 = false;
                                    return false;
                                }
                            }else{
                                if(!reg.test(storage_port)){
                                    $.alert("第 "+(i+1)+" 行存储端口不符合格式要求！！");
                                    $(v).find("[name=storage_port]").trigger("focus");
                                    me.vila1 = false;
                                    return false;
                                }
                            }
                        }
                    }
                });
            }

            function checkWwn(arr,i){
                var val = true;
                var reg = /^\w*\d+\s*[\s\:]{1}\s*([\da-fA-F]{16}|([\da-fA-F]{2}:){7}([\da-fA-F]{2}))\s*$/;
                $.each(arr,function(item,val1){
                    if(!reg.test(val1)){
                        $.alert("第 "+(i+1)+" 条wwn字段的第 "+(item+1)+" 行不符合规范");
                        val = false;
                        return false;
                    }
                });
                return val
            }
            function getHbaPortstr(wwnArr){
                var strArr = [];
                $.each(wwnArr,function(i,v){
                    v = $.trim(v);
                    strArr.push(v.split(/:|\s/)[0]);
                });
                return strArr.join(",");
            }
        },
        checkSysWWNValue:function(){
            this.vila1 = true;
            this.vila2 = true;
            var me = this;
            $(".form-control.required").each(function(i,v){
                var name = $(v).attr("data-title");
                if($(v).val() == ""){
                    $(v).trigger("focus");
                    $.alert(name+" 字段不能为空！");
                    me.vila1 = false;
                    return false;
                }
            });

            if(this.vila1){
                $("#zone_list tr").each(function(i,v){
                    var wwn = $(v).find("[name=wwn]").val();
                    var wwnArr = wwn.split("\n");
                    if (wwnArr[0].indexOf(' ')<0 && wwnArr[0].indexOf(':')<0){
                        wwnArr = wwnArr.slice(1);
                        wwn = wwnArr.join("\n");
                        $(v).find("[name=wwn]").val(wwn);
                    }
                    var wwnLen = wwnArr.length,
                        storage_sn = $(v).find("[name=storage_sn]").val(),
                        storage_port = $(v).find("[name=storage_port]").val(),
                        backup_area = $(v).find("[name=backup_area]").val();
                    var hbaPortsStr = getHbaPortstr(wwnArr);
                    if(storage_sn == "纯备份域zone"){
                        if(backup_area){
                            if(checkWwn(wwnArr,i)){
                                if(hbaPortsStr != "23,24,13,14" && hbaPortsStr != "13,14,23,24"){
                                    me.checkinfo = "第 "+(i+1)+" 条wwn字段端口号不符合规范，端口号应为\n23,24,13,14或\n13,14,23,24\n是否继续提交？";
                                    me.vila2 = false;
                                    $(v).find("[name=wwn]").trigger("focus");
                                }
                            }else{
                                $(v).find("[name=wwn]").trigger("focus");
                                me.vila1 = false;
                                return false;
                            }
                        }else{
                            $.alert("如果存储SN为纯备份域zone，则备份域为必填项！！");
                            $(v).find("[name=backup_area]").trigger("focus");
                            me.vila1 = false;
                            return false;
                        }
                    }else{
                        if(backup_area){
                            if(checkWwn(wwnArr,i)){
                                if(hbaPortsStr != "21,22,23,24,11,12,13,14"
                                    && hbaPortsStr != "11,12,13,14,21,22,23,24"
                                    && hbaPortsStr != "fcs0,fcs1,fcs2,fcs3"){
                                    me.checkinfo = "第 "+(i+1)+" 条wwn字段端口号不符合规范,端口号应为\n21,22,23,24,11,12,13,14或\n11,12,13,14,21,22,23,24或\nfcs0,fcs1,fcs2,fcs3\n是否继续提交？";
                                    me.vila2 = false;
                                    $(v).find("[name=wwn]").trigger("focus");
                                }
                            }else{
                                $(v).find("[name=wwn]").trigger("focus");
                                me.vila1 = false;
                                return false;
                            }
                        }else{

                            if(wwnLen ==1){
                                if(!checkWwn(wwnArr,i)){
                                    $(v).find("[name=wwn]").trigger("focus");
                                    me.vila1 = false;
                                    return false;
                                }
                            }else{
                                if(checkWwn(wwnArr,i)){
                                    if(hbaPortsStr != "11,12,21,22"
                                        && hbaPortsStr != "21,22,11,12"
                                        && hbaPortsStr != "fcs0,fcs2"){
                                        me.checkinfo = "第 "+(i+1)+" 条wwn字段端口号不符合规范,端口号应为\n11,12,21,22或\n21,22,11,12或\nfcs0,fcs2\n是否继续提交？";
                                        me.vila2 = false;
                                        $(v).find("[name=wwn]").trigger("focus");
                                    }
                                }else{
                                    $(v).find("[name=wwn]").trigger("focus");
                                    me.vila1 = false;
                                    return false;
                                }
                            }
                        }
                    }
                });
            }

            function checkWwn(arr,i){
                var val = true;
                var reg = /^\w*\d+\s*[\s\:]{1}\s*([\da-fA-F]{16}|([\da-fA-F]{2}:){7}([\da-fA-F]{2}))\s*$/;
                $.each(arr,function(item,val1){
                    if(!reg.test(val1)){
                        $.alert("第 "+(i+1)+" 条wwn字段的第 "+(item+1)+" 行不符合规范");
                        val = false;
                        return false;
                    }
                });
                return val
            }
            function getHbaPortstr(wwnArr){
                var strArr = [];
                $.each(wwnArr,function(i,v){
                    v = $.trim(v);
                    strArr.push(v.split(/:|\s/)[0]);
                });
                return strArr.join(",");
            }
        },
        checkStoragePort:function(){
            var param = [];
            var me = this;
            $("#zone_list tr").each(function(i,v){
                param.push({
                    "id":$(v).attr("data-zid"),
                    "storage_sn_for_zone":$(v).find(".form-control[name=storage_sn_for_zone]").val(),
                    "storage_port_for_zone":$(v).find(".form-control[name=storage_port_for_zone]").val()
                })
            });
            $.post(this.checkStorage,{data:JSON.stringify(param)},function(data){
                var errArr = [];
                $.each(data,function(i,v){
                    if(v['error']){
                        errArr.push(v['error']);
                    }else{
                        $("#zone_list tr[data-zid="+v['id']+"] textarea[name=storage_port_for_zone]").val(v['storage_port_for_zone']);
                    }
                });
                if(errArr.length){
                    $.alert(String(errArr));
                }else{
                    $.alert('存储端口校验通过！');
                }
                checkPort();
            },"json");
            me.isChecked = true;
            function checkPort(){
                me.portIsOk = true;
                $(".form-control[name=storage_port]").each(function(i,v){
                    //var reg = /^\w+\s+\w+\/\w+\s+([\da-fA-F]{16}|([\da-fA-F]{2}:){7}([\da-fA-F]{2}))\s+/;
                    var reg = /^.*/;
                    var arr = $(v).val().split("\n");
                    $(v).removeClass("error");
                    $.each(arr,function(item,val){
                        if(!reg.test(val)){
                            me.portIsOk = false;
                            $(v).addClass("error");
                        }
                    });
                });
            }
        },
        saveData:function(isSubmit,fun){
            $(".preloader").removeClass("hidden");
            var me = this;
            var order = {
                id:this.id
            };
            $(".work_list_info .form-control").each(function(i,v){
                order[$(v).attr("name")] = $(v).val();
            });
            order['description'] = $("textarea[name=description]").val();
            var zones = [];
            $("#zone_list>tr").each(function(i,v){
                var zone = {
                    id:$(v).attr("data-zid")
                }
                $(v).find(".form-control").each(function(item,val){
                    zone[$(val).attr("name")] = $(val).val();
                });
                zones.push(zone);
            });
            $.post(this.saveUrl,{
                order:JSON.stringify(order),
                zones:JSON.stringify(zones)
            },function(id){
                if(isNaN(id)){
                    $.alert(id);
                }else{
                    if(isSubmit){
                        me.modState(id,"提交");
                    }else if(typeof(fun) == "function"){
                        fun(id);
                    }else{
                        location.search = "?id="+(id-0);
                    }
                }
            });
        },
        modState:function(id,act,fun){
            $(".preloader").removeClass("hidden");
            $.post(this.submitUrl,{
                "order_id":id,
                "opt_show":act
            },function(txt){
                $(".preloader").addClass("hidden");
                if(typeof fun == "function"){
                    fun(txt);
                }else{
                    if(txt == "ok"){
                        window.open("/san/order_list/","_self");
                    }else{
                        $.alert(txt);
                    }
                }
            });
        },
        createScript:function(){
            var me = this;
            if(this.isChecked){
                if(this.portIsOk){
                    me.saveData(false,function(id){
                        $.post(me.createScriptUrl,{
                            "order_id":id
                        },function(txt){
                            $(".preloader").addClass("hidden");
                            if(txt == "ok"){
                                window.location.reload()
                            }else{
                                $.alert(txt);
                            }
                        });
                    })
                }else{
                    $.alert("检验存储端口未通过，请修改后重新检查！！");
                }
            }else{
                $.alert("请先检验存储端口！！");
            }

        },
        viewScript:function(){
            var me = this;
            $(".preloader").removeClass("hidden");
            $(".view_script").remove();
            $.post(this.getScriptUrl,{order_id:me.id},function(data){
                me.scriptData = data;
                var modal = QWeb.render("view_script",{order:me.data['order'],script:data});
                $("body").append(modal);
                $(".view_script").modal();
                $(".preloader").addClass("hidden");
                me.scriptEvent();
            },"json");
        },
        scriptEvent:function(){
            var me = this;
            $("#device_list li>a").click(function(e){
                var e = e || event;
                e.preventDefault();
                var id = $(this).attr("href");
                $(this).parent("li").addClass("active")
                    .siblings(".active").removeClass("active");
                $(id).addClass("active")
                    .siblings(".active").removeClass("active");
            });

            var t = setInterval(function(){
                var height = $(".aside_menu").height();
                if(height){
                    clearInterval(t);
                    $(".script_area").height(height-32);
                }
            },100);

            $(".view_script .btn.save_script").click(function(){
                var id = $(this).attr("data-id");
                me.saveScript();
            });

            $(".view_script .btn.download_script").click(function(){
                var id = $(this).attr("data-id");
                var $inputContent1 = $('<input>').attr({ name: "id", value: id });
                var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action: "/san/download_scripts/" })
                    .append($inputContent1);
                $form.submit();
            });

        },
        saveScript:function(){
            $(".preloader").removeClass("hidden");
            $.each(this.scriptData['context'],function(i,v){
                v['zone_scrpit'] = $(".script_area[data-key=script"+i+"]").val();
            });
            $.post(this.saveScriptUrl,{"data":JSON.stringify(this.scriptData)},function(data){
                $(".view_script").modal('hide');
                $(".preloader").addClass("hidden");
            });
        },
        importZoneInfo:function(){
            var me = this;
            $("#zone_info_import").ajaxForm({
                url:"/san/zone_info_excel_import/",//批量导入接口
                type:"POST",
                dataType:"json",
                success:function(res){
                    $("#zone_info_import input").val("");
                    $(".preloader").addClass("hidden");
                    if(res.result != "success"){
                        $.alert(res.result);
                    }else{
                        if(res.msg){
                            $.alert(res.msg);
                        }
                        if(this.id == "none"){
                            $("#zone_list").html("");
                        }
                        var html = $(QWeb.render("zone_list",{val: res.zone_info_list,ord:me.data['order'],area:me.backAreaData}));
                        $("#zone_list").append(html);
                        me.drawAfter(html);
                        var txt = $(".brief_foot .form-control");
                        txt.val(res.description + txt.val());
                    }
                },
                error:function(e){
                    $("#import_excel input").val("");
                    $(".preloader").addClass("hidden");
                    window.alert(e.statusText);
                }
            }).submit();
        },
        previewRecordList:function(){
            $.post(this.recordListUrl,{
                "order_id":this.id
            },function(data){
                var html = QWeb.render("record_list",{"data":data});
                $.alert(html,"流转记录",'',"modal-lg");
            },"json");
        },
        toggle_detail:function(){
            var glyphicon = $(".action_show_hide .glyphicon");
            var show_hide_txt = $(".action_show_hide .action_show_hide_txt");
            if(glyphicon.hasClass("glyphicon-chevron-up")){
                glyphicon.removeClass("glyphicon-chevron-up")
                    .addClass("glyphicon-chevron-down");
                show_hide_txt.html("显示详细");
                $("#zone_list").fadeOut("fast");
            }else{
                glyphicon.removeClass("glyphicon-chevron-down")
                    .addClass("glyphicon-chevron-up");
                show_hide_txt.html("隐藏详细");
                $("#zone_list").fadeIn("fast");
            }
        },
        addEvent:function(){
            var me = this;
            $(".work_list_detail").on("click","button.btn_add",function(){
                var html = $("#zone_list tr:last").clone();
                if(html.length){
                    html.attr("data-zid","none");
                    html.find("div.awesomplete")
                        .before(html.find("input.auto_complete"))
                        .remove();
                    var $data_index = html.find(".data_index");
                    $data_index.html($data_index.html()-0+1);

                }else{
                    html = $(QWeb.render("zone_list",{val: [],ord:me.data['order'],area:me.backAreaData}));
                }
                $("#zone_list").append(html);
                me.drawAfter(html);
                me.preventOut();
            });
            $(".work_list_detail").on("click","button.btn_delete",function(){
                $(this).parents("tr").remove();
                me.preventOut();
            });
            $(".work_list_detail").on("click","button.btn_reset",function(){
                $(this).parents("tr").find(".form-control").val("");
                me.preventOut();
            });
            $(".work_list_detail").on("click","button.btn_cancel",function(){
                window.open("/san/order_list/","_self");
            });
            $(".work_list_detail").on("click","button.btn_save",function(){
                me.allowOut();
                me.saveData(false);
            });
            $(".work_list_detail").on("click","button.btn_submit",function(){
                me.checkValue();
                if(me.vila1){
                    if(me.vila2 || confirm(me.checkinfo)){
                        me.allowOut();
                        me.saveData(true);
                    }
                }
            });
            $(".work_list_detail").on("click","button.btn_recovery",function(){
                me.modState(me.id,"追回");
            });
            $(".work_list_detail").on("click","button.btn_back",function(){
                me.modState(me.id,"退回");
            });
            $(".work_list_detail").on("click","button.btn_close",function(){
                me.modState(me.id,"关闭");
            });

            $(".work_list_detail").on("click","button.btn_checkPort",function(){
                me.checkStoragePort();
            });
            $(".work_list_detail").on("click","button.btn_createScript",function(){
                me.createScript();
            });
            $(".work_list_detail").on("click","button.btn_viewScript",function(){
                me.viewScript();
            });
            $(".work_list_detail").on("click","button.check_sys_wwn_port",function(){
                me.checkSysWWNValue()
                if(me.vila1){
                    //$.alert("系统WWN及端口号校验通过（仅供参考）！");
                    $.get("/san/check_sys_wwn/?id="+me.id,function(data){
                        if(data.success){
                            $.alert("<pre>系统WWN及端口号格式校验通过（均有flogi信息）！flogi信息如下：\n"+data.msg+'</pre>', '成功','','modal-xs');
                        }else{
                            $.alert("<pre>系统WWN及端口号格式校验通过（部分wwn无flogi信息）！flogi信息如下：\n"+data.msg+'</pre>', '注意！！！','','modal-xs');
                        }
                    },"json");
                }else{
                    $.alert("<系统WWN及端口号格式校验未通过\n");
                }
            });
            $(".work_list_detail").on("click","button.btn_pushScript",function(){
                me.modState(me.id,"下发",function(req){
                    if(req == "ok"){
                        if(confirm("下发成功，点确定去列表页面，点取消留在当前页")){
                            window.open("/san/order_list/","_self");
                        }else{
                            window.location.reload();
                        }
                    }else{
                        $.alert(req)
                    }
                });
            });
            $("#zone_info_import input").change(function(){
                $(".preloader").removeClass("hidden");
                me.importZoneInfo();
            });
            $(".work_list_detail").on("keyup",".storage_port",function(){
                me.isChecked = false;
            });
            $(".record_list").click(function(){
                me.previewRecordList();
            });
            $(".action_show_hide").click(function(){
                me.toggle_detail();
            });
        }
    };

});

