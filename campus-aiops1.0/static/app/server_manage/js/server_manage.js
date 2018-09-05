/**
 * Created by nantian on 2017/3/28.
 */
$(document).ready(function(){

    $(".preloader").removeClass("hidden");
    $.get("/static/app/server_manage/json/server_manage.json",init,"json");
    var searchFiled;
    function init(data){
        searchFiled = data['search'];
        addSearch(data['search']);
        table.init(data['server_list'],data['lang']);
    }
    //动态添加搜索功能
    function addSearch(data){
        var search = '';
        $(data).each(function(i,v){
            var isArry = Object.prototype.toString.call(v["options"]);
            var form_control;
            if(isArry == "[object Array]"){
                form_control = '<select class="form-control" id="'+v["field"]+'">' +
                    '<option value=""></option>';
                $.each(v["options"],function(item,val){
                    form_control += '<option value="'+val["value"]+'">'+val["name"]+'</option>';
                });
                form_control += '</select>';
            }else{
                form_control = '<input type="text" class="form-control" id="'+v["field"]+'">';
            }
            search += '<div class="col-lg-3 form-inline">' +
                '<div class="form-group">' +
                    '<label for="'+v["field"]+'">'+v["CH"]+':</label>' +
                    form_control+
                '</div>' +
            '</div>';
        });
        search += '<div class="col-lg-3">' +
            '<button type="button" class="btn btn-success" id="search_btn">搜索</button>' +
            '<button type="button" class="btn btn-info" id="reset_btn">重置</button>' +
        '</div>';
        $("#search_box").html(search);
        //重置按钮
        $("#reset_btn").click(function(){
            $("#search_box .form-control").val("");
        });
        //搜索按钮
        $("#search_btn").click(function(){
            var search = {};
            $("#search_box .form-control").each(function(i,v){
                search[$(v).attr("id")] = $(v).val();
            });
            table.searchData(search);
        });

    }

    //批量导入功能
    var impotrForm = $("#import_excel").ajaxForm({
        url:"/server_manage/import_excel/",//批量导入接口
        type:"POST",
        success:function(txt){
            $("#import_excel input").val("");
            if(txt=="ok"){
                table.requestData();
            }else{
                $(".preloader").addClass("hidden");
                window.alert(txt);
            }
        },
        error:function(e){
            $("#import_excel input").val("");
            $(".preloader").addClass("hidden");
            window.alert(e.statusText);
        }
    });
    $("#import_excel input").change(function(){
        $(".preloader").removeClass("hidden");
        impotrForm.submit();
    });

    $("#server_manage .btn[data-act]").click(function(){
        var act = $(this).attr("data-act");
        switch (act){
            case "bulk_delete":
                table.deleteData();
                break;
            case "excel_export":
                //table.t.button('.buttons-excel').trigger();
                table.exportData();
                break;
            case "addPmachine":
                createEditPmachine.init("新增物理机",0);
                break;
            case "addVmachine":
                createEditPmachine.init("新增虚拟机",2);
                break;
        }
    });

    //服务器列表
    var table = {
        ele:"#server_list",
        t:null,
        url:"/server_manage/",
        deleteUrl:"/server_manage/server_delete/",
        exportXslUrl:"/server_manage/report_download/",
        data:[],
        thead:null,
        col_idx:{},
        lang:null,
        selected:[],
        init:function(thead,lang){
            var me = this;
            var k = 'tHead'+location.pathname;
            if(sessionStorage.getItem(k)){
                me.thead = JSON.parse(sessionStorage.getItem(k));
            }else{
                sessionStorage.setItem(k,JSON.stringify(thead));
                me.thead = thead;
            }
            this.lang = lang;
            $(me.ele).on("draw.dt",function(){
                $(me.ele+" input").prop("checked",false);
                $(me.ele+" tr").removeClass("selected");
                me.selected = [];
            });
            me.drawHead();
            me.drawData();
            me.requestData();
            me.addEvent(k);
        },
        drawHead:function(){
            var me = this;
            var thead = '<thead><tr>';
            $(me.thead).each(function(i,v){
                thead += '<th>'+v['CH']+'</th>';
                me.col_idx[v['data']] = i;
            });
            thead += '</tr></thead>';
            $(me.ele).html(thead);
        },
        requestData:function(callback_fun){
            $(".preloader").removeClass("hidden");
            var me = this;
            $.post(me.url,function(data){
                $.each(data,function(i,v){
                    v['opt'] = '<div data-mtype="'+v['mtype']+'" data-id="'+v['id']+'">'+$("#hid_row_btn").html()+'</div>';
                    v['ID'] = v['id'];
                    v['id'] = '<input type="checkbox" data-id="'+v['ID']+'" />';
                });
                me.data = data;
                me.drawData();
                if(typeof(callback_fun) == "function"){
                    callback_fun();
                }
            },"json");
        },
        deleteData:function(ids){
            var me = this;
            ids = ids || me.selected;
            if(ids.length){
                if(confirm('确定要删除这'+ids.length+'条数据吗？')){
                    $(".preloader").removeClass("hidden");
                    $.post(me.deleteUrl,{"id[]":ids},function(data){
                        me.requestData();
                    });
                }
            }
        },
        searchData:function(search){
            var me = this;
            $.each(search,function(i,v){
                var col = me.col_idx[i];
                me.t.columns(col).search(v,false,true);
            });
            me.t.draw();
        },
        drawData:function(){
            $(".preloader").addClass("hidden");
            this.t && this.t.destroy();
            $(this.ele+" tbody").remove();
            this.t = $(this.ele).DataTable({
                //responsive:true,
                language:this.lang,
                lengthMenu:[[10,20,50,100,200,-1],[10,20,50,100,200,"所有"]],
                ordering: true,
                //禁用排序的列
                columnDefs: [
                    {"orderable": false,"targets": [0,22] }
                ],
                searching:true,
                //stateSave: true,
                columns: this.thead,
                data:this.data
                //dom: 'B<"clear">lfrtip',
                /*buttons: [{
                    extend: 'excelHtml5',
                    text: '导出到Excel',
                    exportOptions: {//自定义导出的列和行
                        columns:function (idx, data, node){
                            var colName = $(node).html();
                            return (colName == "操作" || idx==0) ?false : true;
                        },
                        rows:function(idx,data,tr){
                            return $(tr).hasClass("selected")?true:false;
                        }

                    },
                    filename:this.ele
                }]*/
            });
            this.colShow();
        },
        colShow:function(){
            var me = this;
            $.each(me.thead,function(i,v){
                me.t.column(i).visible(v["show"],false);
            });
        },
        exportData:function(){
            var $inputContent = $('<input>').attr({ name: "datas", value: JSON.stringify(this.selected) });
            var $form = $("<form>");
            $form.attr({ target: '_blank', method: 'post', action: this.exportXslUrl }).append($inputContent);
            $form.submit();
        },
        addEvent:function(k){
            var me = this;
            //保持选中状态
            $("#show_filed .dropdown-menu>li").each(function(i,v){
                var index = $(v).children('a').attr("href")-0;
                me.thead[index]['show']&&$(v).addClass('active');
            });
            $("#show_filed .dropdown-menu>li>a").click(function(e){
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                $(this).parent("li").toggleClass("active");
                var index = $(this).attr("href")-0;
                me.thead[index]['show'] = $(this).parent("li").hasClass("active");
                sessionStorage.setItem(k,JSON.stringify(me.thead));
                me.colShow();
            });
            //复选框事件
            $(me.ele).on("click","input[data-id]",function(){
                var id = $(this).attr("data-id");
                var isSel = $(this).prop("checked");
                if(id == "all"){
                    if(isSel){
                        $(me.ele+" tbody input[data-id]").prop("checked",true);
                    }else{
                        $(me.ele+" tbody input[data-id]").prop("checked",false);
                    }
                }else{
                    var total = $(me.ele+" tbody input[data-id]").length,
                        sel = $(me.ele+" tbody input:checked").length;
                    if(total == sel){
                        $(me.ele+" thead input[data-id]").prop("checked",true);
                    }else{
                        $(me.ele+" thead input[data-id]").prop("checked",false);
                    }
                }
                me.selected = [];
                $(me.ele+" tbody tr").removeClass("selected");
                $(me.ele+" tbody input:checked").each(function(i,v){
                    me.selected.push($(v).attr("data-id"));
                    $(v).parents("tr").addClass("selected");
                });
            });
            //操作按钮
            $(me.ele).on("click","td .btn",function(){
                var id = $(this).parent("div").attr("data-id");
                var v_p = $(this).parent("div").attr("data-mtype");
                if($(this).hasClass("btn_del")){
                    me.deleteData([id]);
                }else if($(this).hasClass("btn_mod")){
                    if(v_p == "物理机"){
                        createEditPmachine.init("修改物理机",1,id);
                    }
                    if(v_p == "虚拟机"){
                        createEditPmachine.init("修改虚拟机",3,id);
                    }
                }else if($(this).hasClass("btn_show_login")){
                    show_login.init(id);
                }
            });
        }
    };

    //新增/修改页面
    var createEditPmachine = {
        modal:"#server_modal",
        login:"#hid_login_ele",
        url:"/server_manage/server_search/",
        url_act:"",
        title:"",
        pmData:null,
        main:"",
        id:0,
        act:"",
        mtype:undefined,
        flag:undefined,//用于判断创建时重复是否覆盖
        init:function(title,type,id){
            this.pmData = table.data;
            this.title = title;
            this.id = id;
            switch (type){
                case 0:
                    this.url_act = "/server_manage/server_create/";
                    this.flag = "create";
                    this.mtype = "物理机";
                    this.main = $($("#hid_edit_pmachine").html());
                    this.initCreate();
                    break;
                case 1:
                    this.url_act = "/server_manage/server_update/";
                    this.main = $($("#hid_edit_pmachine").html());
                    this.initEdit();
                    break;
                case 2:
                    this.url_act = "/server_manage/server_create/";
                    this.flag = 'create';
                    this.mtype = "虚拟机";
                    this.main = $($("#hid_edit_vmachine").html());
                    this.initCreate();
                    break;
                case 3:
                    this.url_act = "/server_manage/server_update/";
                    this.main = $($("#hid_edit_vmachine").html());
                    this.initEdit();
                    break;
            }
        },
        initCreate:function(){
            this.appendOption();
            this.addLogin();
            this.popModal();
        },
        searchPmachine:function(key){
            var me = this;
            var data = [];
            $.each(this.pmData,function(i,v){
                if(v["mtype"] == "物理机"){
                    $.each(v,function(item,val){
                        if(String(val).indexOf(key) > -1){
                            data.push(v);
                            return false;
                        }
                    });
                }
            });
            var tr = '';
            $(data).each(function(i,v){
                tr += '<tr>' +
                    '<td><input name="select" value="'+v["ID"]+'" type="radio"/></td>' +
                    '<td class="ip_filed">'+v["ip"]+'</td>' +
                    '<td>'+v["hostname"]+'</td>' +
                    '<td>'+v["environment"]+'</td>' +
                '</tr>';
            });
            me.main.find(".table>tbody").html(tr);
        },
        initEdit:function(){
            var me = this;
            $(".preloader").removeClass("hidden");
            this.appendOption();
            $.post(this.url,{"id":this.id},function(data){
                data = data[0];
                $.each(data,function(i,v){
                    me.main.find(".form-control[data-edit="+i+"]").val(v);
                });

                var id = data['pm_id'],ip;
                if(id){
                    $.each(me.pmData,function(i,v){
                        id == v['ID']&&(ip = v['ip']);
                    });
                    me.main.find(".pmachine_ip").val(ip);
                    me.main.find(".input_checkbox").prop("checked",true);
                    me.main.find(".pmachine_info").removeClass("hidden");
                }
                $.each(data['login'],function(i,v){
                    me.addLogin(v);
                });
                if(data['login'].length == 0){
                    me.addLogin();
                }
                me.popModal();
                $(".preloader").addClass("hidden");
            },"json");

        },
        appendOption:function(){
            var index = {};
            $.each(searchFiled,function(i,v){
                var isArry = Object.prototype.toString.call(v["options"]);
                isArry=="[object Array]"&&(index[v["field"]] = v["options"]);
            });
            this.main.find("select.form-control").each(function(i,v){
                var option = '<option value=""></option>',
                    pro = $(v).attr("data-edit");
                $.each(index[pro],function(item,val){
                    option += '<option value="'+val["value"]+'">'+val["name"]+'</option>';
                });
                $(v).html(option);
            });

        },
        addLogin:function(data){
            var $login = $($(this.login).html());
            if(data){
                $login.find("ul.login_info").attr("data-id",data['id']);
                $login.find("[data-login=login_way]").val(data['login_way']);
                $login.find("[data-login=username]").val(data['username']);
                $login.find("[data-login=password]").val(data['password']);
            }
            $login.append('<i class="rmv_btn glyphicon glyphicon-minus-sign"></i>');
+           this.main.find(".user_info").append($login);
        },
        popModal:function(){
            $(this.modal).find(".modal-title").html(this.title);
            $(this.modal).find(".modal-body").html(this.main);
            $(this.modal).modal();
            this.addEvent();
        },
        closeModal:function(){
            $(this.modal).modal("hide");
            $(this.modal).find(".modal-title").html("");
            $(this.modal).find(".modal-body").html("");
        },
        onsubmit:function(){
            var allowed = true,
                index = {};
            $.each(searchFiled,function(item,val){
                index[val['field']] = val['CH'];
            });
            this.main.find(".form-control.require").each(function(i,v){
                var attr = $(v).attr("data-edit")||$(v).attr("data-login");
                if($(v).val() == ""){
                    window.alert("“ " + (index[attr]||attr) + " ”字段为必填字段！！");
                    $(v).trigger("focus");
                    allowed = false;
                    return false;
                }/*else if(attr == "ip"){
                    //ip地址正则
                    var ipReg = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;
                    if(!ipReg.test($(v).val())){
                        window.alert("请检查IP地址格式！！");
                        $(v).trigger("focus");
                        allowed = false;
                        return false;
                    }
                }*/
            });
            var param = {};
            this.main.find(".form-control[data-edit]").each(function(i,v){
                param[$(v).attr("data-edit")] = $(v).val();
            });
            var loginData = [];
            this.main.find("ul.login_info").each(function(i,v){
                loginData.push({
                    "id":$(v).attr("data-id"),
                    "login_way":$(v).find("[data-login=login_way]").val(),
                    "username":$(v).find("[data-login=username]").val(),
                    "password":$(v).find("[data-login=password]").val()
                });
            });
            var me = this;
            if(allowed){
                $(".preloader").removeClass("hidden");
                $.post(this.url_act,{
                    "id":this.id,
                    "flag":this.flag,
                    "mtype":this.mtype,
                    "server_data":JSON.stringify(param),
                    "login_data":JSON.stringify(loginData)
                },function(txt){
                    if(txt == "ok"){
                        me.closeModal();
                        var search = {};

                        //提交修改后保持原来搜索条件
                        table.requestData(function(){
                            $("#search_box .form-control").each(function(i,v){
                                search[$(v).attr("id")] = $(v).val();
                            });
                            table.searchData(search);
                        });

                    }else if(txt == "exist"){
                        $(".preloader").addClass("hidden");
                        if(confirm("所用的IP地址已被占用，是否覆盖已有设备?")){
                            me.flag = 'save';
                            me.onsubmit();
                        }else{
                            me.closeModal();
                        }
                    }else{
                        $(".preloader").addClass("hidden");
                        window.alert(txt);
                    }
                });
            }
        },
        addEvent:function(){
            var me = this;
            this.main.find("i.add_login").click(function(){
                me.addLogin();
            });
            this.main.on("click","i.rmv_btn",function(){
                $(this).parent(".col-xs-offset-1").remove();
            });
            this.main.find(".btn[data-act=cancel]").click(function(){
                me.closeModal();
            });
            this.main.find(".btn[data-act=reset]").click(function(){
                me.main.find(".form-control").val("");
            });
            this.main.find(".btn[data-act=submit]").click(function(){
                me.onsubmit();
            });
            this.main.find(".input_checkbox").click(function(){
                var isSel = $(this).prop("checked");
                if(isSel){
                    me.main.find(".pmachine_info").removeClass("hidden");
                }else{
                    me.main.find(".pmachine_info").addClass("hidden");
                    me.main.find("[data-edit=pm_id]").val("");
                    me.main.find(".pmachine_ip").val("");
                }
            });
            this.main.find(".search_pm").click(function(){
                var key = $(this).siblings("input").val();
                key&&me.searchPmachine( key );
            });
            this.main.on("click",".search_table .table input",function(){
                var id = $(this).val()-0,
                    ip = $(this).parent("td").siblings(".ip_filed").html();
                me.main.find("[data-edit=pm_id]").val(id);
                me.main.find(".pmachine_ip").val(ip);
            });
        }
    };

    //显示登陆信息
    var show_login = {
        modal:"#server_modal",
        title:"登陆信息",
        url:"/server_manage/server_search/",
        id:0,
        main:null,
        init:function(id){
            this.id = id;
            this.main = $($("#hid_show_login").html());
            this.requestData();
        },
        requestData:function(){
            var me = this;
            $(".preloader").removeClass("hidden");
            $.post(this.url,{"id":this.id},function(data){
                var tr = "";
                $.each(data[0]['login'],function(i,v){
                    tr += '<tr>' +
                        '<td>'+ v['login_way']+'</td>' +
                        '<td>'+ v['username']+'</td>' +
                        '<td>'+ v['password']+'</td>' +
                    '</tr>';
                });
                me.main.find("tbody").html(tr);
                me.popModal();
            },"json");
        },
        popModal:function(){
            $(this.modal).find(".modal-title").html(this.title);
            $(this.modal).find(".modal-body").html(this.main);
            $(this.modal).modal();
            $(".preloader").addClass("hidden");
        }
    };
});