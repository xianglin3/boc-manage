$(document).ready(function(){
    /*公用方法*/
    //删除数组中的某一项
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
	/*获取表格字段*/
    var seeField = [],
		hideField = [],
		tableField = [],
		hideNum = [],
		showField = {};
    $.ajax({
        url:'/static/app/campus_aiops/json/fields.json',
        type:'get',
        async:false,
        dataType:'json',
        success:function(data){
        	tableField = data.portField.tableField;
        	seeField = data.portField.seeField;
        	hideField = data.portField.hideField;
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
	var modeOptions = ['access','trunk',''];
	var statusOptions = ['up','down','administratively down',''];
    var typeOptions = ['iNode','mac','no'];
// vue数据渲染和事件方法
	var vm = new Vue({
		el:'#port',
		data:{
            /*端口状态*/
			checkAllStatus: true,
        	checkedStatus: [],
        	statuss: statusOptions,
        	isIndeterminateStatus: true,
            /*端口类型*/
			checkAllMode: true,
        	checkedMode: [],
        	modes: modeOptions,
        	isIndeterminateMode: true,
            /*地域*/
            checkAllArea: true,
            checkedArea: [],
            isIndeterminateArea: true,
            /*认证方式*/
            checkAllType: true,
            checkedType: [],
            types: typeOptions,
            isIndeterminateType: true,

			infoSwitch:true,
			loading:false,
			advSearch:false,
			advIcon:false,
			iconClass:'el-icon-minus',
			ipSeeVisible:false,
			advTab:false,
			selected:'', //下拉框绑定
			areas:[],
			textareaSearch: '',
			tableField:[],
			showField:showField,
			seeData:[],	//详情页数据
			seeField:null
		},
		methods:{
			init(){
				$.post('/campus_aiops/area_list/',function(res){
		    		vm.areas = res;
		    	},"json")
			},
            /*端口状态*/
			handleCheckAllChangeStatus(event) {
				this.checkedStatus = event.target.checked ? statusOptions : [];
				this.isIndeterminateStatus = false;
			},
			handleCheckedStatusChange(value) {
				let checkedCount = value.length;
				this.checkAllStatus = checkedCount === this.statuss.length;
				this.isIndeterminateStatus = checkedCount > 0 && checkedCount < this.statuss.length;
			},
            /*端口类型*/
			handleCheckAllChange(event) {
				this.checkedMode = event.target.checked ? modeOptions : [];
				this.isIndeterminateMode = false;
			},
			handleCheckedModeChange(value) {
				let checkedCount = value.length;
				this.checkAllMode = checkedCount === this.modes.length;
				this.isIndeterminateMode = checkedCount > 0 && checkedCount < this.modes.length;
			},
            /*地域*/
			handleCheckAllChangeArea(event) {
				this.checkedArea = event.target.checked ? this.areas : [];
				this.isIndeterminateArea = false;
			},
			handleCheckedAreaChange(value) {
				let checkedCount = value.length;
				this.checkAllArea = checkedCount === this.areas.length;
				this.isIndeterminateArea = checkedCount > 0 && checkedCount < this.areas.length;
			},
            /*认证方式*/
            handleCheckAllChangeType(event) {
                this.checkedType = event.target.checked ? typeOptions : [];
                this.isIndeterminateType = false;
            },
            handleCheckedTypeChange(value) {
                let checkedCount = value.length;
                this.checkAllType = checkedCount === this.types.length;
                this.isIndeterminatetype = checkedCount > 0 && checkedCount < this.types.length;
            },
			/*根据搜索条件查询数据*/
			searchIp:function(){
                //url = '/campus_aiops/port_status_search/';
                tables.fnDraw();
			},
            /*拼接地域和编号*/
            returnData(el,field){
                if(field == 'area_name'){
                    return el['area_name']+' | '+el['area_no'];
                }else{
                    return el[field];
                }
            },
            /*信息下载*/
			dowanloadExcel:function(){
                let ps_ids = [],arr = [],downData = null;
                arr = vm.textareaSearch.split('\n');
                for (var i = 0;i<arr.length;i++){
                    if(arr[i] == ""){
                        arr.remove("");
                    }
                };
                let searchData = {'mode[]':vm.checkedMode,'area[]':vm.checkedArea,'addr[]':arr,'status[]':vm.checkedStatus,'auth_type[]':vm.checkedType};
			    $('.checkchild:checked').each(function(i){
			        ps_ids.push($(this).val());
			        return ps_ids;
			    });
                downData = {"id[]":ps_ids,searchData:searchData};
		        var $inputContent = $('<input>').attr({ name: "downData", value: JSON.stringify(downData)});
		        
                var $form = $("<form>");
		        $form.attr({ target: '_blank', method: 'post', action: '/campus_aiops/port_status_download/' }).append($inputContent);
                $(document.body).append($form);
		        $form.submit();
		        resetCheck();
			},
			/*普通查询按钮*/
			resetSearch:function(){
				this.textareaSearch = '';
				this.selected = '';
				this.checkedArea = [];
				this.checkedMode = [];
				this.checkedStatus = [];
				this.advSearch = false;
				this.advIcon = false;
				this.advTab = false;
			},
			/*高级查询按钮*/
			searchTab:function(){
				this.advIcon = true;
				this.advSearch = true;
				this.advTab = true;
			},
			/*显示隐藏高级查询条件*/
			hideSearch:function(){
				this.advSearch = !this.advSearch;

			}
		},
		mounted:function(){
			this.init();
		},
        filters:{
            retrunValue(val){
                if(val == ''){
                    return '未配置';
                }else{
                    return val;
                }
            },
            retrunType(val){
                switch(val){
                    case "iNode":
                        return 'iNode认证';
                        break;
                    case "mac":
                        return "mac认证";
                        break;
                    default:
                        return "无认证";
                        break;
                }
            }
        }
	});

    /*创建tables实例*/
    var tables = $("#dataTable").dataTable({
        serverSide: true,//分页，取数据等等的都放到服务端去
        processing: false,//载入数据的时候是否显示“载入中”
        pageLength: 10,  //首次加载的数据条数
        //ordering: true, //排序操作。
        pagingType: "full_numbers",
        autoWidth: true,
        stateSave: true,//保持翻页状态，和comTable.fnDraw(false);结合使用
        //searching: true,//禁用datatables搜索
        lengthMenu: [[10,20,50,100,200,-1],[10,20,50,100,200,"全部"]],//设置每页显示数量
        ajax: {   
            type: "post",
            url: '/campus_aiops/port_status_search/',
            cache:false,
            dataSrc: "data",
               data: function (d) {
                   	let param = {},arr = [],mode = [],area = [];
                    arr = vm.textareaSearch.split('\n');
                    if(arr[0] == ''){
                       arr = [];
                    }
		        	let searchData = {'mode[]':vm.checkedMode,'area[]':vm.checkedArea,'addr[]':arr,'status[]':vm.checkedStatus,'auth_type[]':vm.checkedType};
                    param = d;
                    param.searchData = JSON.stringify(searchData);
					return param;
                },
        },
        columns: [//对应上面thead里面的序列
            {"data": 'id',"width":"10px",
                "render":function(data,type,full,callback){
                    let checkbox = `<input type='checkbox' class='checkchild' value='${data}'>`;
                    return checkbox;
                }
            },
            // 终端定位;
            {"data": 'interface_ip',
                "render":function(data,type,full,callback){
                    let aDev = `<a href="http://22.1.111.29/device_switch/device_panel/?device_id=${full['interface_device']}" target="_blank">${data}</a>`;
                    return aDev;
                }
            },
            {"data": 'device_name',
                "render":function(data,type,full,callback){
                    let aDev = `<a href="http://22.1.111.29/device_switch/device_panel/?device_id=${full['interface_device']}" target="_blank">${data}</a>`;
                    return aDev;
                }
            },
            {"data": 'interface_name'},
            {"data": 'interface_mode'},
            {"data": 'interface_status'},
            {"data": 'interface_mac'},
            {"data": 'interface_interface_ip'},
            {"data": 'interface_auth_type'},
            {"data": 'area'},
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
            {"data": null,"width":"60px",
                "render":function(data,type,full,callback){
                    let operStr = `<i class="el-icon-menu" style="margin-right:14px;font-size: 18px;color:#00acd6;cursor:pointer;"></i>
                            <div style="position:absolute; display:none;top:0;right:0;z-index:999;" class="btn-group-vertical" role="group" aria-label="...">
                                <button id="seeData" class="btn btn-warning btn-sm">详细信息</button>
                                <button type="button"
                                class="btn btn-info btn-sm"
                                data-toggle="modal"
                                data-target="#interfaceConfigModal"
                                data-whatever="${full['interface_ip']} ${full['device_name']} ${full['interface_name']}">配置下发</button>
                            </div>`;
                    return operStr;
                }
            }
        ],
        //列配置
        columnDefs: [
            { //设置某列不显示
                targets: hideNum,
                visible: false
            },
         	{
　　　　	   targets : [0,-1],
　　　　	   orderable : false
　　　　	}
        ],
        order: [],//默认第几列开始排序
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
        fnDrawCallback: function(){
        	vm.loading = false;
        },
        fnPreDrawCallback:function(){
        	vm.loading = true;
        }
    });
    //查看详情
    $("#dataTable tbody").on("click", "#seeData", function () {
        var data = tables.api().row($(this).parents("tr")).data();
        vm.seeField = seeField;
    	vm.ipSeeVisible = true;
        vm.infoSwitch = true;
    	vm.seeData = data;
       
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
    //复选框全选事件
    $('#dataTable').on('click','input[class]',function(){
        var id = $(this).attr('class');
        var isSel = $(this).prop('checked');
        if(id == 'checkall'){
            if(isSel){
                $('#dataTable tbody input[class]').prop('checked',true);
            }else{
                 $('#dataTable tbody input[class]').prop('checked',false);
            }
        }else{
            var total = $('#dataTable tbody input[class]').length,
                sel = $('#dataTable tbody input:checked').length;
            if(total == sel){
                $('#dataTable thead input[class]').prop('checked',true);
            }else{
                $('#dataTable thead input[class]').prop('checked',false);
            }
        }
    })
    //重置复选框
    function resetCheck(){
        $('#dataTable input:checkbox').removeAttr('checked');
    }
    //字段显示或隐藏
	function hidColumn(jTable, colNum) {
	    var column = jTable.api().column(colNum);
	    column.visible(!column.visible());
	};
	$('#port .show-filed .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        hidColumn(tables, $(this).attr('value'));
	})
	$("#port .show-filed .dropdown-menu").on('click', function (e) {
                e.stopPropagation();
    });


/*配置下发JS代码*/

    /*配置下发全局变量*/
    var device_ip;
    var interface;
    var device_name;
    /*确认下发按钮操作*/
    $('#pushBut').click(function () {
        var configText = $('#configText').val();
        var old_config = $('#showRun').html();
        if (configText == undefined) {
            alert('请选择配置模式');
            return false;

        }
        var ip = device_ip;
        var configText = $('#configText').val();
        if (window.confirm("您确定下要发配置吗？") == false) {
            return false;
        }
        ;
        $('#show_loader').removeClass('hidden');
        $.ajax({
            type: 'POST',
            url: '/portconfiger/port_config/',
            data: {"ip": ip, "config_text": configText, "old_config": old_config},
            success: function (data) {
                var port_config_result = data.port_config_result;
                $('#show_loader').addClass('hidden');
                if (port_config_result == "success") {
                    alert("配置下发成功！");
                } else {
                    alert("推送失败，原因如下：" + port_config_result);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('err');
                console.log("error");
            },
            dataType: 'json'
        });
    });
    /*下发配置--调出模态框--请求数据*/
    $('#interfaceConfigModal').on('show.bs.modal', function (event) {
        var typeoption_list = $('input[name="typeoption"]');
        $.each(typeoption_list, function (i, ele) {
            ele.checked = false;
        });
        $('#config').html('</textarea>');
        $('#show_loader').removeClass('hidden');
        $('#showRun').html('<pre>端口配置请求中...</pre>');
        var button = $(event.relatedTarget); // Button that triggered the modal
        var iinterface_info_arr = button.data('whatever').split(' '); // Extract info from data-* attributes
        device_ip = iinterface_info_arr[0];
        device_name = iinterface_info_arr[1];
        interface = iinterface_info_arr[2];
        $.ajax({
            type: 'POST',
            url: '/cli_realtime/ssh_get_info/',
            data: {
                "ip_list": device_ip,
                "commands": 'show run interface ' + interface,
                "platform": '',
                "ssh_user": '',
                "ssh_password": ''
            },
            timeout: 2000000,
            success: function (data) {
                var infocollection = data['infocollection'];
                var showContentStr = '';
                var output_array = infocollection[device_ip].output;
                $.each(output_array, function (n, value) {
                    showContentStr = showContentStr + value.output;
                });
                $('#showRun').html('<pre>' + showContentStr + '</pre>');
                $('#show_loader').addClass('hidden');
            },

            error: function (jqXHR, textStatus, errorThrown) {
                $('#show_loader').addClass('hidden');
                alert('收集过程中发生错误，可能是因为访问控制未开通，或者是设备型号暂时不支持等原因');
                console.log("error");
            },
            dataType: 'json'
        });
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-title').text(device_ip + ' ' + device_name + ' ' + interface);

    });
    /*配置下发--选择类型*/
    $('#interfaceConfigModal .form-group .radio-inline').on('click','input',function(){
        $('#show_loader').removeClass('hidden');
        var portFullName = interface;
        var type = $(this).attr("value");
        var sw_ip = device_ip
        $.ajax({
            type: 'POST',
            url: '/devicestatus/parse/?parserScriptName=campusPortStandardConf',
            data: {
                "portFullName": portFullName,
                "type": type,
                "device_ip":sw_ip
            },
            timeout: 10000,
            success: function (data) {
                var configText = data['configText'];
                $('#config').html('<textarea rows="12" cols="70" id="configText">' + configText + '</textarea>');
                $('#show_loader').addClass('hidden');
            },

            error: function (jqXHR, textStatus, errorThrown) {
                $('#show_loader').addClass('hidden');
                $('#config').html('<textarea rows="12" cols="70" id="configText">获取配置失败，请联系管理人员确认模板配置正确</textarea>');
                $('#show_loader').addClass('hidden');
            },
            dataType: 'json'
        });
    })

});