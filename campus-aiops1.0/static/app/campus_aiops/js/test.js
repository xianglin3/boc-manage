$(document).ready(function(){
	var timestamp = new Date().getTime()
    $(function () {
        //添加、修改异步提交地址
        var url = "";

        var tables = $("#dataTable").dataTable({
            serverSide: true,//分页，取数据等等的都放到服务端去
            processing: false,//载入数据的时候是否显示“载入中”
            pageLength: 10,  //首次加载的数据条数
            ordering: false, //排序操作在服务端进行，所以可以关了。
            pagingType: "full_numbers",
            autoWidth: false,
            stateSave: true,//保持翻页状态，和comTable.fnDraw(false);结合使用
            searching: false,//禁用datatables搜索
            ajax: {   
                type: "post",
                url: "http://127.0.0.1:3000/getIp/?timestamp="+timestamp,
                dataSrc: "data",
                   data: function (d) {
                       var param = {};
                       param.draw = d.draw;
                       param.start = d.start;
                       param.length = d.length;
                      /* param.order = d.order;
                       param.search = d.search;*/
                       var formData = $("#queryForm").serializeArray();//把form里面的数据序列化成数组
                       formData.forEach(function (e) {
                           param[e.name] = e.value;
                       });
                        return param;//自定义需要传递的参数。
                },
            },
            columns: [//对应上面thead里面的序列
                {"data": null,"width":"10px"},
                // 终端定位;
                {"data": 'interface_ip'},
                {"data": 'device_name'},
                {"data": 'interface_name'},
                {"data": 'interface_status'},
                {"data": 'interface_mac'},
                {"data": 'interface_interface_ip'},
                {"data": 'interface_auth_type'},
                {"data": 'area_name',
                    "render":function(data,type,full,callback) {
                        return full.area_name+'|'+full.area_no;
                    }
                },

                {"data": 'interface_show_run'},
                {"data": 'interface_mac_history'},
                {"data": 'interface_interface_ip_history'},
                {"data": 'interface_log_status'},
                {"data": 'interface_log_time'},
                {"data": 'interface_update_time'},
                {"data": 'ead_user_name'},
                {"data": 'ead_full_name'},
                {"data": 'ead_os_version'},
                {"data": 'ead_terminal_vendor'},
                {"data": 'ead_terminal_type'},
                {"data": 'ead_service_template_name'},
                {"data": null,"width":"60px"}
            ],
            //操作按钮
            columnDefs: [
             {
                 targets: 0,
                 defaultContent: "<input type='checkbox' name='checkList'>"
             },
             {
                 targets: -1,
                 defaultContent: `
                                <i class="el-icon-menu" style="margin-right:14px;font-size: 18px;color:#00acd6;cursor:pointer;"></i>
                                <div style="position:absolute; display:none;top:0;right:0;z-index:999;" class="btn-group-vertical" role="group" aria-label="...">
                                    <button class="btn btn-warning btn-sm">详细信息</button>
                                    <button class="btn btn-success btn-sm">配置下发</button>
                                </div>`
             },
             { //设置某列不显示
                 targets: [9,10,11,12,13,14,15,16,17,18,19,20],
                 visible: false
              }
            ],
            language: {
                sLengthMenu: "_MENU_ 条数据",//每页显示信息数汉化
                search: '模糊搜索：',//右上角的搜索文本，可以写html标签
                paginate: {//分页的样式内容。
                    previous: "上一页",
                    next: "下一页",
                    first: "首页",
                    last: "末页"
                },
                zeroRecords: "没有内容",//table tbody内容为空时提示文字
                //下面三者构成了总体的左下角的内容。
                info: "总共_PAGES_ 页，显示第_START_ 条到第 _END_条 ，筛选之后得到 _TOTAL_ 条，总共_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                infoEmpty: "0条记录",//筛选为空时左下角的显示。
                infoFiltered: ""//筛选之后的左下角筛选提示，
            },
            //在每次table被draw完后回调函数
            // fnDrawCallback: function(){
            //     var api = this.api();
            //     //获取到本页开始的条数
            // 　　  var startIndex= api.context[0]._iDisplayStart;
            // 　　  api.column(1).nodes().each(function(cell, i) {
            // 　　　　    cell.innerHTML = startIndex + i + 1;
            // 　　 }); 
            // }
           });

        //查询按钮
        $("#btn-query").on("click", function () {
        	console.log('hello');
            tables.fnDraw();//查询后不需要保持分页状态，回首页
        });

        //添加
        $("#btn-add").on("click", function () {
            url = "<%=path%>/goodsType/add";
            $("input[name=typeId]").val(0);
            $("input[name=typeNameCn]").val("");
            $("input[name=typeNameEn]").val("");
            $("#editModal").modal("show");
        });

        //批量删除
        $("#btn-delAll").on("click", function () {

        });

        //导出
        $("#btn-export").on("click", function () {
        });

        //刷新
        $("#btn-re").on("click", function () {
        	tables.fnDraw();
            // tables.fnDraw(false);//刷新保持分页状态
        });

        //checkbox全选
        $("#checkAll").on("click", function () {
            if ($(this).prop("checked") === true) {
                $("input[name='checkList']").prop("checked", $(this).prop("checked"));
                //$("#dataTable tbody tr").addClass('selected');
                $(this).hasClass('selected')
            } else {
                $("input[name='checkList']").prop("checked", false);
                $("#dataTable tbody tr").removeClass('selected');
            }
        });

        //修改
        $("#dataTable tbody").on("click", "#editRow", function () {
            var data = tables.api().row($(this).parents("tr")).data();
            $("input[name=typeId]").val(data.typeIdStr);
            $("input[name=typeNameCn]").val(data.typeNameCn);
            $("input[name=typeNameEn]").val(data.typeNameEn);

            url = "<%=path%>/goodsType/update";

            $("#editModal").modal("show");
        });
        // 移入
        $('#dataTable tbody').on('mouseover','td',function(){
        	$(this).css('position','relative');
        	$(this).find('i').hide();
        	$(this).find('div').show();
        })
        $('#dataTable tbody').on('mouseout','td',function(){
        	$(this).find('i').show();
        	$(this).find('div').hide();
        })

        $("#btn-submit").on("click", function(){
            $.ajax({
              cache: false,
              type: "POST",
              url: url,
              data:$("#editForm").serialize(),
              async: false,
              error: function(request) {
                  showFail("Server Connection Error...");
              },
              success: function(data) {
                if(data.status == 1){
                    $("#editModal").modal("hide");
                    showSuccess("<sp:message code='sys.oper.success'/>");
                    tables.fnDraw();
                }else{
                    showFail("<sp:message code='sys.oper.fail'/>");
                }
              }
          });
        });

        //删除
        $("#dataTable tbody").on("click", "#delRow", function () {
            var data = tables.api().row($(this).parents("tr")).data();
            if(confirm("是否确认删除这条信息?")){
                $.ajax({
                    url:'<%=path%>/goodsType/del/'+data.typeIdStr,
                    type:'delete',
                    dataType: "json",
                    cache: "false",
                    success:function(data){
                        if(data.status == 1){
                            showSuccess("<sp:message code='sys.oper.success'/>");
                            tables.api().row().remove().draw(false);
                        }else{
                            showFail("<sp:message code='sys.oper.fail'/>");
                        }
                    },
                    error:function(err){
                        showFail("Server Connection Error...");
                    }
                });
            }
        });
    });
})