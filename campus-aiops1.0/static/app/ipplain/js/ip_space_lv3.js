/**
 * Created by nantian on 2017/2/23.
 */
$(document).ready(function () {
    var ipspace_id;
    var ipspace_display;
    $(".preloader").removeClass("hidden");
    $.get("/static/app/ipplain/json_info/ipspacelv3Thead.json", function (d) {
        table.init(d);
    }, "json");
    var table = {
        ele: "#examination",
        thead: null,
        url: "/ipplain/ipspacelist/3/",//获取表格数据接口
        lang: {
            "sProcessing": "处理中...",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项结果",
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
        },
        init: function (thead) {
            var me = this;
            this.thead = thead;
            this.drawHead();
            //this.addEvent(); //通过js添加事件 实现跳转 与按钮不可同时使用
        },
        drawHead: function () {
            var thead = '<thead><tr>';
            $.each(this.thead, function (i, v) {
                thead += '<td>' + v["CH"] + '</td>';
            });
            thead += '</tr></thead>';
            $(this.ele).html(thead);
            this.drawBody();
        },
        drawBody: function () {
            $(this.ele).dataTable({
                "processing": true,
                "ajax": {
                    "url": this.url,
                    "type": 'POST',
                    "dataSrc": function (jsonData) {
                        $.each(jsonData['data'], function (i, v) {
                            v['opt'] = '<a class="btn btn-primary" href="/ipplain/ipspace/3/' + v["id"] + '" target="_blank" class="btn btn-info btn-sm">编辑</a>';
                            v['opt'] = v['opt'] + '<button type="button" class="btn btn-primary" ' +
                                'data-toggle="modal" data-target="#ipplainModal" ' +
                                'data-whatever="' + v["id"] + '_' + v["network_address"] + '/' + v["network_mask"] + '"' +
                                '>规划</button>';
                        });
                        return jsonData['data'];
                    }
                },
                "columns": this.thead,
                "serverSide": true,
                "language": this.lang,
                "ordering": false,
                bStateSave: true,
                lengthMenu:[[10,50,100,500,-1],[10,50,100,500,"所有"]],
                dom: 'B<"clear">lfrtip',
                buttons: [{
                    extend: 'excelHtml5',
                    text: '导出到Excel'
                }]
            });
            $(".preloader").addClass("hidden");
        },
        addEvent: function () {
            $(this.ele).on("click", "tbody>tr", function () {
                var id = $(this).children("td:first-child").html();
                window.open("/ipplain/ipspacelevel3/edit/" + id, "_blank");
            });
        }
    };

    var ipspace_info = new Vue({
        el: '#ipplainModal',
        data: {
            ipspace_list: [],
            selected: ''
        },
        methods: {
            get_ipspace_info: function () {
                $(".preloader").removeClass("hidden");
                var network_mask = $("#network_mask").val();
                $.post("/ipplain/get_ipspaces_info/", {
                    "ipspace_id": ipspace_id,
                    network_mask: network_mask
                }, function (d) {
                    ipspace_info.ipspace_list = d;
                }, "json");
                $(".preloader").addClass("hidden");
            },
            write_ipspace:function (ipspace) {
                $('#network_address').val(ipspace);
            }
        }
    });

    $('#ipplainModal').on('show.bs.modal', function (event) {
        var network_mask = $("#network_mask").val('');
        ipspace_info.ipspace_list = [{used: true, value: "请输入掩码，系统会自动划分子网,点选相应的子网"}];
        var button = $(event.relatedTarget); // Button that triggered the modal
        var ipspace_info_arr = button.data('whatever').split('_'); // Extract info from data-* attributes
        ipspace_id = ipspace_info_arr[0];
        ipspace_display = ipspace_info_arr[1];

        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-title').text('规划地址空间：' + ipspace_display);
        modal.find('.modal-body #network_address-name').val(ipspace_id);
    });
    $('#save_sub_ipspace').click(function () {
        // var data = {
        //     network_address: $('#network_address').val(),
        //     network_mask: $('#network_mask').val(),
        //     organization: $('#organization').val(),
        //     org_type: $('#org_type').val(),
        //     manage_group: $('#manage_group').val(),
        //     distribute_group: $('#distribute_group').val(),
        //     parent_id: ipspace_id
        // };
        $(".preloader").removeClass("hidden");
        $.post("/ipplain/save_ipspace/3/", {
            network_address: $('#network_address').val().split('/')[0],
            network_mask: $('#network_address').val().split('/')[1],
            organization: $('#organization').val(),
            org_type: $('#org_type').val(),
            manage_group: $('#manage_group').val(),
            distribute_group: $('#distribute_group').val(),
            parent_id: ipspace_id
        }, function (d) {
            $(".preloader").addClass("hidden");
            if (d=='ok'){
                alert('成功');
            }else{
              alert('失败，原因：'+d);
            };
        }, "json");
    })

});