$(document).ready(function(){
	/*声明全局变量*/
	var tableField = [],
		seeField = [],
		hideField = [],
		hideNum = [],
		showField = {},
		portId = decodeURI(window.location.search.replace('?','').split('=')[1]||'');
	/*同步请求获取表格字段 详情字段 下拉框字段*/
	$.ajax({
		url:'/static/app/campus_aiops/json/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			tableField = data.authTypeHistoryField.tableField;
			hideField = data.authTypeHistoryField.hideField;
			seeField = data.authTypeHistoryField.seeField;
		}
	});
	/*处理隐藏字段,获取隐藏字段的位置数组*/
	hideField.forEach(function(ele){
		tableField.forEach(function(res,index){
			if(ele == res.text){
				showField[ele] = index+1;
				hideNum.push(index+1);
			}
		})
	});
//vue数据渲染和事件方法
	var vm = new Vue({
		el:'#authTypeHistory',
		data:{
            loading:false,
			infoSwitch:true,
			seeVisible:false,
			tableField:tableField,
			showField:showField,
			seeData:null,	//详情页数据
			seeField:null,
			ipStatus:null,
            valueStart:'',
            valueEnd:'',
            startDate:'',
            endDate:'',
            pickerOptionsStart: {
                disabledDate(time) {
                    let d = new Date(vm.valueEnd);
                    return time.getTime() > d.getTime();
                }
            },
            pickerOptionsEnd: {
                disabledDate(time) {
                    let d = new Date(vm.valueStart);
                    return time.getTime() < d.getTime()- 8.64e7;
                }
            }
		},
		methods:{
            filterDate:function(date){
                if(date){
                    console.log(date);
                    let d = new Date(date);
                    let getDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
                    return getDate;
                }else{
                    return '';
                }
            },
            getStartDate:function(value){
                this.startDate = value;
                console.log(value)
                var d = new Date(value);
                console.log(d.getTime());
            },
            getEndDate:function(value){
                this.endDate = value;
                console.log(value)
                var d = new Date(value);
                console.log(d.getTime());
            },
			/*查询数据*/
			search:function(){
		        table.ajax.reload()
			},
            /*认证方式变更记录下载*/
            dowanload:function(){
                let ids = [],downData = null;
                let searchData = {start_time:this.filterDate(this.valueStart),end_time:this.filterDate(this.valueEnd)};
                $('.checkchild:checked').each(function(i){
                    ids.push($(this).val());
                    return ids;
                })
                downData = {"id[]":ids,searchData:searchData,port_status_id:portId};
                var $inputContent = $('<input>').attr({ name: "downData", value: JSON.stringify(downData) });
                var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action: '/campus_aiops/auth_type_history_download/'}).append($inputContent);
                $(document.body).append($form);
                $form.submit();
                resetCheck();
            },
		}
	})
    /*公用datatable渲染表格方法*/
    var table = $('#table_id_example').DataTable({
        ajax: {
        	url:'/campus_aiops/auth_type_history_search/',
        	type:"POST",
        	"data":function(d){
				return {start_time:vm.startDate,end_time:vm.endDate,port_status_id:portId};
        	},
        	"dataSrc":function(data){
                vm.loading = false;
        		return data;
        	}
        },
        columns: [
            {"data": 'id',"width":"10px",
            	"render":function(data,type,full,callback){
            		let checkBox = `<input type='checkbox' class='checkchild' value="${data}">`
            		return checkBox;
            	}
        	},
            {"data": 'old_auth_type'},
            {"data": 'new_auth_type'},
            {"data": 'auth_type_update_time'},
            {"data": 'portstatus_interface_ip',
                "render":function(data,type,full,callback){
                    let aDev = `<a href="http://22.1.111.29/device_switch/device_panel/?device_id=${full['interface_device']}" target="_blank">${data}</a>`;
                    return aDev;
                }
            },
            {"data": 'portstatus_device_name',
                "render":function(data,type,full,callback){
                    let aDev = `<a href="http://22.1.111.29/device_switch/device_panel/?device_id=${full['interface_device']}" target="_blank">${data}</a>`;
                    return aDev;
                }
            },
            {"data": 'portstatus_interface_name'},
            {"data": 'portstatus_interface_mode'},
            {"data": 'portstatus_interface_status'},
            {"data": 'portstatus_interface_mac'},
            {"data": 'portstatus_interface_interface_ip'},
            {"data": 'portstatus_interface_auth_type'},
            {"data": 'portstatus_area'},
            {"data": 'portstatus_interface_show_run'},
            {"data": 'portstatus_interface_mac_history'},
            {"data": 'portstatus_interface_interface_ip_history'},
            {"data": 'portstatus_interface_log_status'},
            {"data": 'portstatus_interface_log_time'},
            {"data": 'portstatus_interface_update_time'},
            {"data": 'portstatus_ead_user_name'},
            {"data": 'portstatus_ead_full_name'},
            {"data": 'portstatus_ead_os_version'},
            {"data": 'portstatus_ead_terminal_vendor'},
            {"data": 'portstatus_ead_terminal_type'},
            {"data": 'portstatus_ead_service_template_name'},
            {"data": null,"width":"60px",
            	"render":function(data,type,full,callback){
            		let op = `<i class="el-icon-menu" style="margin-right:14px;font-size: 18px;color:#00acd6;cursor:pointer;"></i>
                            <div style="position:absolute; display:none;top:0;right:0;z-index:999;" class="btn-group-vertical" role="group" aria-label="...">
                                <button id="seeData" class=" see-data btn btn-success btn-sm">详细信息</button>
                            </div>`;
                    return op;
            	}
        	}
        ],
        aoColumnDefs:[//设置列的属性
            { //设置某列不显示
                "targets": hideNum,
                "visible": false,
                "searchable": false
            },
            {//不排序
            	"bSortable": false, 
            	"aTargets": [ 0,-1 ]
            },
        ],
        aaSorting: [],//默认第几列开始排序
        responsive: true,//自适应屏幕
        paging: true,//分页
        pagingType: "full_numbers",//分页样式的类型
        ordering: true,//是否启用排序
        searching: true,//搜索
        iDisplayLength : 10, //默认显示的记录数
        autoWidth:false,
        scrollX:true,
        lengthMenu: [[10,20,50,100,200,-1],[10,20,50,100,200,"全部"]],//设置每页显示数量
        language: {
            sLengthMenu: "_MENU_ 条数据",//每页显示信息数汉化
            search: '模糊搜索：',//右上角的搜索文本，可以写html标签
            paginate: {//分页的样式内容。
                previous: "上一页",
                next: "下一页",
                first: "首页",
                last: "末页"
            },
            zeroRecords: "没有内容",//table tbody内容为空时，tbody的内容。
            //下面三者构成了总体的左下角的内容。
            info: "总共_PAGES_ 页，显示第_START_ 条到第 _END_条 ，筛选之后得到 _TOTAL_ 条，总共_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
            infoEmpty: "0条记录",//筛选为空时左下角的显示。
            infoFiltered: ""//筛选之后的左下角筛选提示，
        },
        fnCreateRow:function(){
          vm.loading = false;
        },
        // 在每次table被draw完后回调函数
        fnDrawCallback:function(){
            //vm.loading = false;
        }
	});
//其他事件
    //复选框全选事件
    $('#table_id_example').on('click','input[class]',function(){
        var id = $(this).attr('class');
        var isSel = $(this).prop('checked');
        if(id == 'checkall'){
            if(isSel){
                $('#table_id_example tbody input[class]').prop('checked',true);
            }else{
                 $('#table_id_example tbody input[class]').prop('checked',false);
            }
        }else{
            var total = $('#table_id_example tbody input[class]').length,
                sel = $('#table_id_example tbody input:checked').length;
            if(total == sel){
                $('#table_id_example thead input[class]').prop('checked',true);
            }else{
                $('#table_id_example thead input[class]').prop('checked',false);
            }
        }
    })

//公用方法
    //重置复选框
    function resetCheck(){
        $('#table_id_example input:checkbox').removeAttr('checked');
    }
    //字段显示或隐藏
	function hidColumn(jTable, colNum) {
	    var column = jTable.column(colNum);
	    column.visible(!column.visible());
	}
	$('#authTypeHistory .show-filed .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        if (val == true) {
            //表示显示操作
            hidColumn(table, $(this).attr('value'));
        } else {
            //表示隐藏操作
            hidColumn(table, $(this).attr('value'));
        }
	})
	$("#authTypeHistory .show-filed .dropdown-menu").on('click', function (e) {
                e.stopPropagation();
    });
    // 移入
    $('#table_id_example tbody').on('mouseover','td',function(){
    	$(this).css('position','relative');
    	$(this).find('i').hide();
    	$(this).find('div').show();
    })
    $('#table_id_example tbody').on('mouseout','td',function(){
    	$(this).find('i').show();
    	$(this).find('div').hide();
    })
	/*查看详情*/
	$('#table_id_example tbody').on( 'click', 'button.see-data', function () {
		let data = table.row($(this).parents("tr")).data();
        // console.log(data);

		/*vm.seeVisible = true;
        vm.infoSwitch = true;
		vm.seeData = data;
		vm.seeField = seeField;
		vm.ipStatus = data.show_status;*/
	});
})