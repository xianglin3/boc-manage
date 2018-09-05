/**
 * Created by nantian on 2017/3/24.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    var table_header = null;
    $("div.link_list>a.btn").click(function(e){
        var e = e||event;
        e.preventDefault();
        $(this).addClass("active").siblings("a.btn").removeClass("active");
        var tar = $(this).attr("href");
        $(tar).addClass("active").siblings("div.page").removeClass("active");
        if(tar == "#record_page"){
            recordPage.init();
        }else if(tar == "#course_list"){
            coursePage.init();
        }else if(tar == "#human_page"){
            humanPage.init();
        }
    });

    var coursePage = null, humanPage = null;
    $.get("/static/app/select_course/json/table_header.json",function(thead){
        table_header = thead;
        selectPage.init();
        var selF = {"work_group":thead["work_group"],"required_elective":thead["required_elective"]};
        //实例化课程总表
        coursePage = new Course_Human(
            "#table_course",
            "/select_course/course_list/",
            table_header['all_course'],
            "#add_course",
            selF,
            false
        );
        //实例化人员总表
        humanPage = new Course_Human(
            "#table_human",
            "/select_course/human_list/",
            table_header['all_human'],
            "#add_human",
            selF,
            true
        );
    },"json");
    //在线选课
    var selectPage = {
        tHead:null,
        isFist:true,
        ele:"#table_select",
        data:null,
        selected:null,
        url:"/select_course/",//获取当前用户选课状态、提交更新选课状态
        init:function(){
            if(this.isFist){
                this.isFist = false;
                this.tHead = table_header['select_course'];
                this.drawHead();
                this.requestData();
                this.addEvent();
            }

        },
        drawHead:function(){
            var thead = '<thead><tr>';
            $(this.tHead).each(function(i,v){
                thead += '<th>'+v['CH']+'</th>';
            });
            thead += '</tr></thead>';
            $(this.ele).html(thead);
        },
        requestData:function(req){
            var me = this;
            var obj = {"isFirst":true}
            if(req){
                obj["isFirst"] = false;
                obj["selected[]"] = req;
                console.log(req);
            }
            $.post(this.url,obj,function(data){
                me.data = data;
                me.drawBody();
            },"json");
        },
        drawBody:function(){
            var me = this;
            $("div.user_info span[data-val]").each(function(i,v){
                var html = me.data['user_info'] || {"name":"未未登陆或者未注册","hire_data":"","work_group":""}
                $(v).html(html[$(v).attr("data-val")]);
            });
            $(me.ele+" tbody").remove();
            me.selected = me.data["selected"];
            var tbody = $("<tbody/>");
            $.each(me.data['enable_select'],function(i,v){
                var cls = "";
                me.selected.indexOf(v["id"]) != -1&&(cls = "selected");
                var isRequire = v['required_elective'];
                isRequire == "必修"&&(cls += ' required');
                var tr = $('<tr class="'+cls+'" data-id="'+v["id"]+'"></tr>');
                $.each(me.tHead,function(item,val){
                    var field = val['field'];
                    var td = v[val['field']];
                    var btn = (tr.hasClass("selected")?"取消":"选中");
                    field == "opt"&&(td = '<button type="button" class="btn">'+btn+'</button>');
                    tr.append('<td data-field="'+field+'">'+td+'</td>');
                });
                tbody.append(tr);
            });
            $(me.ele).append(tbody);
            $(".preloader").addClass("hidden");
        },
        addEvent:function(){
            var me = this;
            $(me.ele).on("click","button.btn",function(){
                $(".preloader").removeClass("hidden");
                var hasClass = $(this).parents("tr").hasClass("selected");
                if(hasClass){
                    $(this).html("选中").parents("tr").removeClass("selected");
                }else{
                    $(this).html("取消").parents("tr").addClass("selected");
                }
                me.selected = [];
                $(me.ele+" tr.selected").each(function(i,v){
                    me.selected.push($(v).attr("data-id")-0);
                });
                me.requestData(me.selected);
            });
        }

    };

    //选课记录
    var recordPage = {
        url:"/select_course/record/",
        mySelected:"#my_selected",
        record:"#record_tBody",
        mySelPage:null,
        isFirst:true,
        data:null,
        init:function(){
            var me = this;
            $(".preloader").removeClass("hidden");

            $.post(this.url,function(data){
                me.data = data;
                me.drawMyS();
                me.drawPage();
            },"json");

        },
        drawMyS:function(){
            var me = this;
            if(me.isFirst){
                me.isFirst = false;
                me.mySelPage = new Course_Human(
                    me.mySelected,
                    false,
                    table_header['selected_course'],
                    "",
                    undefined,
                    false
                );
            }
            me.mySelPage.init(me.data['mySelected']);
        },
        drawPage:function(){
            var trs = ""
            $(this.data["recordList"]).each(function(i,v){
                var span_td = "";
                $(v["humans"]).each(function(item,val){
                    span_td += '<span class="human_item">'+val+'</span>';
                });
                trs += '<tr>' +
                    '<td>'+v["course"]+'</td>' +
                    '<td>'+span_td+'</td>' +
                '</tr>';
            });
            $(this.record).html(trs);
            $(".preloader").addClass("hidden");
        }
    }

    //课表和人员表格(类)
    function Course_Human(ele,url,thead,add_btn,sel,isAllowDelete){
        this.ele = ele;
        this.url =url;
        this.isFist = true;
        this.tHead = thead;
        this.data = null;
        this.table = null;
        this.add_btn = add_btn;
        this.sel = sel;
        this.isAllowDelete = isAllowDelete;
    }
    Course_Human.prototype.init = function(data){
        if(this.isFist){
            this.drawHead();
            this.addEvent();
            this.isFist = false;
        }
        this.data = data;
        this.requestData({"act":"get"});
    };
    Course_Human.prototype.drawHead = function(){
        var thead = '<thead><tr>';
        $(this.tHead).each(function(i,v){
            thead += '<th>'+v['CH']+'</th>';
        });
        thead += '</tr></thead>';
        $(this.ele).html(thead);
    };
    Course_Human.prototype.requestData = function(req){
        $(".preloader").removeClass("hidden");
        var me = this;
        if(me.url){
            $.post(me.url,req,function(response){
                if(typeof(response[0]) == "object" ||  typeof(response[0]) == "undefined"){
                    me.data = response;
                    me.drawBody();
                }else if(typeof(response[0]) == "string"){
                    window.alert(response[0]);
                }
            },"json");
        }else{
            me.drawBody();
        }

    };
    Course_Human.prototype.drawBody = function(){
        var me = this;
        me.table&&me.table.destroy&&me.table.destroy();
        $(me.ele+" tbody").remove();
        var tbody = $("<tbody/>");
        $.each(me.data,function(i,v){
            var tr = $('<tr data-id="'+v["id"]+'"></tr>');
            $.each(me.tHead,function(item,val){
                var field = val['field'];
                var td = v[val['field']];
                if(me.isAllowDelete){
                    field == "opt"&&(td = '<button type="button" class="btn" data-act="mod">修改</button><button type="button" class="btn" data-act="del">删除</button>');
                }else{
                    field == "opt"&&(td = '<button type="button" class="btn" data-act="mod">修改</button>');
                }
                tr.append('<td data-field="'+field+'">'+td+'</td>');
            });
            tbody.append(tr);
        });
        $(me.ele).append(tbody);

        me.table=$(me.ele).DataTable({
                responsive: true,
                ordering: true,
                lengthMenu:[[4,8,16,32,-1],[4,8,16,32,"所有"]],
                searching:true,
                bStateSave: true,
                language:{
                    "sProcessing": "处理中...",
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "模糊搜索:",
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
                },
                dom: 'B<"clear">lfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: '导出到Excel',
                    exportOptions: {//自定义导出的列
                        columns:function (idx, data, node){
                            var colName = $(node).html();
                            return colName == "操作" ?false : true;
                        }
                    },
                    filename:me.ele
                }]
            });
        $(".preloader").addClass("hidden");
    };
    Course_Human.prototype.addEvent = function(){
        var me = this;
        //添加数据
        $(me.add_btn).click(function(){
            var tr = $('<tr data-id="null"></tr>');
            $.each(me.tHead,function(item,val){
                var field = val['field'];
                var td = '<input name="'+field+'" class="mod_input" />';
                field == "selected_num"&&(td = "");
                if(me.sel[field]){
                    var $sel = '<select class="mod_input" name="'+field+'">';
                    $(me.sel[field]).each(function(item,val){
                        $sel += '<option value="'+val['val']+'">'+val['name']+'</option>';
                    });
                    td = $sel + '</select>';
                }else if(field == "opt"){
                    td = '<button type="button" class="btn" data-act="save">保存</button><button type="button" class="btn" data-act="drop">放弃</button>';
                }
                tr.append('<td data-field="'+field+'">'+td+'</td>');
            });
            $(me.ele+" tbody>tr:first-child").before(tr);

        });
        //删除、修改数据
        $(this.ele).on("click","button.btn",function(){
            var act = $(this).attr("data-act");
            var field = {"act":act};
            var tr = $(this).parents("tr[data-id]");
            if(act == "save"||act == "del"){
                field['id'] = tr.attr("data-id");
                var isAllowRequest = true;
                tr.find(".mod_input").each(function(i,v){
                    field[$(v).attr("name")] = $(v).val();
                    if($(v).val()==""){
                        isAllowRequest = false;
                        $(v).trigger("focus");
                        return false;
                    }
                });
                if(act == "del"){
                    confirm("确认删除该条数据吗？")&&me.requestData(field);
                }else{
                    isAllowRequest&&me.requestData(field);
                }
            }else if(act == "mod"){
                $(this).html("保存").attr("data-act","save");
                $(this).siblings(".btn").html("放弃").attr("data-act","drop");
                tr.children("td[data-field]").each(function(i,v){
                    var data_field = $(v).attr("data-field");
                    var html = $(v).html();
                    if(me.sel[data_field]){
                        var $sel = '<select class="mod_input" name="'+data_field+'">';
                        $(me.sel[data_field]).each(function(item,val){
                            var selected = "";
                            html == val['val']&&(selected = "selected");
                            $sel += '<option value="'+val['val']+'" '+selected+'>'+val['name']+'</option>';
                        });
                        $(v).html($sel + "</select>");
                    }else if(data_field != "opt"&&data_field !="selected_num"){
                        $(v).html('<input type="text" class="mod_input" name="'+data_field+'" value="'+html+'" />');
                    }
                });
            }else if(act == "drop"){
                me.requestData({"act":"get"});
            }
        });
    };
});