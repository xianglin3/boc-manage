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
	/*声明全局变量*/
	var tableField = [],
		seeField = [],
		checkField = [],
		hideField = [],
		hideNum = [],
		showField = {},
		limitField = {},
		vlanID = decodeURI(window.location.search.replace('?','').split('=')[1]||''),
		toForm = JSON.parse(sessionStorage.getItem('formKey'));
	/*同步请求获取表格字段 详情字段 下拉框字段*/
	$.ajax({
		url:'/static/app/campus_aiops/json/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			tableField = data.ipField.tableField;
			hideField = data.ipField.hideField;
			seeField = data.ipField.seeField;
			checkField = data.ipField.checkField;
			limitField = data.ipField.limitField;
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
    /*表单验证 mac验证*/
    function isMac(str) {
        var reg= /^[a-zA-Z0-9]{4}.[a-zA-Z0-9]{4}.[a-zA-Z0-9]{4}$/;
        return reg.test(str);
    }; 
    var checkMac = function(rule, value, callback){
        if (!value) {
          return callback(new Error('请输入MAC地址'));
        }
        setTimeout(function() {
            let arr = value.split('\n');
            for (let i = 0;i<arr.length;i++){
                if(arr[i] == ""){
                    arr.remove("");
                }
                if(!isMac(arr[i])){
                    callback(new Error(`第${i+1}个MAC格式不正确`));
                    return false;
                }
            }
            callback();
        }, 500);
    };
//vue数据渲染和事件方法
	var vm = new Vue({
		el:'#ip',
		data:{
			infoSwitch:true,
			loading:false,
			advSearch:false,
			advIcon:false,
			iconClass:'el-icon-minus',
			AssignIpVisible:false,
			ipSeeVisible:false,
			checkVisible:false,
			advTab:false,
			activeIndex: '0',
			checkDesc: '',
			opera:null,
			selected:'0', //下拉框绑定
			textareaSearch: '',
			tableField:tableField,
			checkField:checkField,
			showField:showField,
			limitField:{},
			ipData:null, //ip数据
			checkData:null, //检查数据
			seeData:null,	//详情页数据
			seeField:null,
			ipStatus:null,
            ruleForm: {
                user_department:'',
                user:'',
                account:'',
                head_office:'',
                tel:'',
                location:'',
                info_id:'',
                ip:'',
                mac:'',
                switch_ip:'',
                switch_int:'',
                terminal_type:'',
                reason:'',
                note:''
            },
            rules: {
              user_department:[
                { required: true, message: '请输入用户部门', trigger: 'blur' }
              ],
              user:[
                { required: true, message: '请输入使用人', trigger: 'blur' }
              ],
              ip:[
                { required: true, message: '请输入现有IP地址', trigger: 'blur' }
              ],
              mac:[
                { required:true, validator: checkMac, trigger: 'blur' }
              ],
              switch_ip:[
                { required: true, message: '请输入交换机IP', trigger: 'blur' }
              ],
              switch_int:[
                { required: true, message: '请输入接口', trigger: 'blur' }
              ],
              terminal_type:[
                { required: true, message: '请选择终端类型', trigger: 'blur' }
              ],
              reason:[
                { required: true, message: '请选择未准入原因', trigger: 'blur' }
              ]
            },
            allTableList:[],
            tableList:[],
            pagination: {
            	current_page: 1,
            	total: 0,
            	page_size: 10,
            	page_sizes: [10,20,40,80],
            	layout: "total,sizes,prev,pager,next,jumper"
            }
		},
		methods:{
            /*过滤分配数中的数组空格*/
            filterFormdata(value){
                for (let i = 0;i<value.length;i++){
                    if(value[i] == ""){
                        value.remove("");
                    }
                }
                return value;
            },
			/*IP分配按钮*/
			addIp:function(){
				this.AssignIpVisible = true;
	            this.ruleForm = {
                    user_department:'',
	                user:'',
	                account:'',
	                head_office:'',
	                tel:'',
	                location:'',
	                info_id:'',
	                ip:'',
	                mac:'',
	                switch_ip:'',
	                switch_int:'',
	                terminal_type:'',
	                reason:'',
	                note:''
	            };
	            this.limitField = limitField;
			},
			/*IP分配提交*/
            submitForm:function(formName) {
                let formData = {};
                $.extend(formData,this.ruleForm);
                this.$refs[formName].validate(function(valid){
                  	if (valid) {
                        vm.loading = true;
                        formData.ip = vm.filterFormdata(formData.ip.split('\n'));
                        formData.mac = vm.filterFormdata(formData.mac.split('\n'));
                        console.log(formData);
                        setTimeout(function(){
                            vm.AssignIpVisible = false;
                            vm.loading = false;
                            if(toForm){
                                sessionStorage.removeItem('formKey');
                            }
                        },1000)
                        /*$.post('/campus_aiops/ip_create/',{"ip_data":JSON.stringify(formData)},function(res){
                            if(res.indexOf('失败') !== -1){
                                vm.loading = false;
                                vm.$message({showClose: true,duration: 0,message: res,type: 'error'});
                            }else{
                                vm.$message({message: res,type: 'success'});
                                table.ajax.reload();
                                table.draw(false);
                            }

                        })*/
                  	}
                });
            },
			/*分配表单重置*/
            resetForm:function(formName) {
	            this.ruleForm = {
                    user_department:'',
	                user:'',
	                account:'',
	                head_office:'',
	                tel:'',
	                location:'',
	                info_id:'',
	                ip:'',
	                mac:'',
	                switch_ip:'',
	                switch_int:'',
	                terminal_type:'',
	                reason:'',
	                note:''
	            };
                this.$refs[formName].resetFields();
            },
            /*分配表单取消*/
            cancelDialog:function(formName) {
            	this.AssignIpVisible = false;
                this.$refs[formName].resetFields();
                if(toForm){
                    sessionStorage.removeItem('formKey');
                }
            },
			/*IP回收*/
			deleteBtn:function(){
		        let ip_ids = [];
		        $('.checkchild:checked').each(function(i){
		            ip_ids.push($(this).val());
		            return ip_ids;
		        })
		        deletes(ip_ids);
			},
            /*ip信息下载*/
			downloadExcel:function(){
		    	let ip_ids = [],downData = null;
                let arr = vm.textareaSearch.split('\n');
                for (var i = 0;i<arr.length;i++){
                    if(arr[i] == ""){
                        arr.remove("");
                    }
                }
                let searchData = {'addr[]':arr,show_status:vm.selected};
			    $('.checkchild:checked').each(function(i){
			        ip_ids.push($(this).val());
			        return ip_ids;
			    })
                downData = {"id[]":ip_ids,searchData:searchData,vlan_id:vlanID};
		        var $inputContent = $('<input>').attr({ name: "downData", value: JSON.stringify(downData) });		        var $form = $("<form>");
		        var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action: '/campus_aiops/ip_download/' }).append($inputContent);
                $(document.body).append($form);
		        $form.submit();
		        resetCheck();
			},
			/*ip信息导入*/
			importIp:function(){
		    	vm.loading = true;
			    var impotrForm = $("#import_ip_excel").ajaxForm({
			        url:"/campus_aiops/import_ip/",
			        type:"POST",
			        success:function(txt){
			        	if(txt.indexOf('成功') !== -1){
                            vm.loading = false;
			        		vm.$message({message:txt,type:"success"});
				            $("#import_ip_excel input").val("");
                            table.ajax.reload();
                            table.draw(false);
			        	}else{
			                vm.loading = false;
				            $("#import_ip_excel input").val("");
			        		vm.$message({message:txt,showClose:true,type:"error",duration:0});
			        	}
			        },
			        error:function(e){
			        	vm.$message({message:e.statusText,type:"error"});
			            $("#import_ip_excel input").val("");
			            vm.loading = false;
			        }
			    });
		        impotrForm.submit();
			},
			/*一致性检查按钮 -- 默认显示数据*/
			conCheck:function(){

				this.checkVisible = true;
				this.loading = true;
				this.checkDesc = '注：在交换机IP和端口相同的情况下,检查自动采集结果与手动录入信息中终端IP或MAC不一致的记录';
				$.post('/campus_aiops/ip_compare/',function(result){
		    		vm.drawTable(result);
				},'json')
			},
            /*一致性检查数据下载*/
			downloadCheck:function(){
		        var $inputContent = $('<input>').attr({ name: "", value:"" });
		        var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action: '/campus_aiops/ip_compare_download/' }).append($inputContent);
                $(document.body).append($form);
		        $form.submit();
			},
			/*一致性检查分页操作*/
			drawTable:function(data){
				this.pagination.total = data.length;
				this.allTableList = data;
				this.loadData();
				this.loading = false;
			},
			loadData:function(){
				let cur = this.pagination.current_page,
					size = this.pagination.page_size;
				this.tableList = this.allTableList.slice((cur - 1) * size, cur * size);
			},
			handleCurrentChange:function(page){
				this.pagination.current_page = page;
				this.loadData();
			},
			handleSizeChange:function(size){
				this.pagination.page_size = size;
				if(this.pagination.current_page == 1){
					this.loadData();
				}else{
					this.pagination.current_page = 1;
				}
			},
			/*查询数据*/
			searchIp:function(){
				this.loading = true;
				var arr = this.textareaSearch.split('\n');
				for (var i = 0;i<arr.length;i++){
					if(arr[i] == ""){
						arr.remove("");
					}
				}
		        table.ajax.url( '/campus_aiops/ip_search/').load()
			},
			/*普通查询按钮*/
			resetSearch:function(){
                this.selected = '0';
				this.textareaSearch = '';
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
		    if(toForm){
				this.AssignIpVisible = true;
	            this.ruleForm = {
                    user_department:'',
	                user:toForm.aa,
	                account:'',
	                head_office:'',
	                tel:toForm.bb,
	                location:'',
	                info_id:'',
	                ip:'',
	                mac:'',
	                switch_ip:'',
	                switch_int:'',
	                terminal_type:'',
	                reason:'',
	                note:''
	            };
	            this.limitField = limitField;
		    }
		}
	})
    /*公用datatable渲染表格方法  --解决数据刷新问题*/
    var table = $('#table_id_example').DataTable({
        /*ajax: {
        	url:'/campus_aiops/ip_list/',
        	type:"POST",
        	"data":function(d){
        		let arr = vm.textareaSearch.split('\n');
				for (var i = 0;i<arr.length;i++){
					if(arr[i] == ""){
						arr.remove("");
					}
				}
		        // var searchData = {'addr[]':arr,show_status:this.selected};
				return {'addr[]':arr,show_status:vm.selected,vlan_id:vlanID};
        	},
        	"dataSrc":function(data){
                vm.loading = false;
        		if(data.text == '地址格式错误！'){
        			vm.$message({message:data.text});
        			let arr = [];
        			return arr;
        		}else{
        			return data
        		}
        	}
        },//ajax请求数据*/
        data:[{},{},{}],
        columns: [//对应html中thead里面的序列
            {"data": 'id',"width":"10px",
            	"render":function(data,type,full,callback){
            		let checkBox = `<input type='checkbox' class='checkchild' value="${data}">`
            		return checkBox;
            	}
        	},
            {"data": 'show_status',
                "render":function(data,type,full,callback){
                    if(data == '0'){
                        return '在用'
                    }else{
                        return '已回收'
                    }
                }
            },
            {"data": 'user_department'},
            {"data": 'user'},
            {"data": 'account'},
            {"data": 'head_office'},
            {"data": 'tel'},
            {"data": 'location'},
            {"data": 'info_id'},
            {"data": 'ip'},
            {"data": 'mac'},
            {"data": 'interface_ip'},
            {"data": 'device_name'},
            {"data": 'interface_name'},
            {"data": 'vlan_vlan_id',
                "render":function(data,type,full,callback){
                    if(full['vlan_vlan_id']){
                        return data;
                    }else{
                        return '无';
                    }
                }
            },
            {"data": 'terminal_type'},
            {"data": 'vlan_area',
                "render":function(data,type,full,callback){
                    if(full['vlan_area']){
                        return data;
                    }else{
                        return '无';
                    }
                }},
            {"data": 'reason'},
            {"data": 'assign_time'},
            {"data": 'assign_user'},
            {"data": 'note'},
            {"data": 'delete_time'},
            {"data": 'delete_user'},
            {"data": null,"width":"60px",
            	"render":function(data,type,full,callback){
            		let op = `<i class="el-icon-menu" style="margin-right:14px;font-size: 18px;color:#00acd6;cursor:pointer;"></i>
                            <div style="position:absolute; display:none;top:0;right:0;z-index:999;" class="btn-group-vertical" role="group" aria-label="...">
                                <button id="del" class="del-data btn btn-warning btn-sm">回收</button>
                                <button id="seeData" class=" see-data btn btn-success btn-sm">详细信息</button>
                                <button type="button"
                                class="btn btn-info btn-sm"
                                data-toggle="modal"
                                data-target="#interfaceConfigModal"
                                data-whatever="${full['interface_ip']} ${full['device_name']} ${full['interface_name']}">配置下发</button>
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
            	"aTargets": [ 0,1,-1 ]
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
	$('#ip .show-filed .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        if (val == true) {
            //表示显示操作
            hidColumn(table, $(this).attr('value'));
        } else {
            //表示隐藏操作
            hidColumn(table, $(this).attr('value'));
        }
	})
	$("#ip .show-filed .dropdown-menu").on('click', function (e) {
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

    /*回收函数*/
    function deletes(ids){
    	if(ids.length == 0){
    		vm.$message({message:"请选择数据",type:"warning"});
    	}else{
			vm.$confirm('此操作将回收这'+ids.length+'条数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				vm.loading = true;
	    		//url = /campus_aiops/ip_delete/   ip_ids
	    		$.post('/campus_aiops/ip_delete/',{"id[]":ids},function(res){
					table.ajax.reload();
					table.draw(false);
	    		})
			}).catch(() => {
				vm.$message({
					type: 'info',
					message: '已取消回收'
				});          
			});
    	}
    }
    /*单条回收操作*/
	$('#table_id_example tbody').on( 'click', 'button.del-data', function () {
		let data = table.row($(this).parents("tr")).data();
		let ip_ids = [];
		ip_ids.push(data.id);
		deletes(ip_ids);
	});
	/*查看详情*/
	$('#table_id_example tbody').on( 'click', 'button.see-data', function () {
		let data = table.row($(this).parents("tr")).data();
		vm.ipSeeVisible = true;
        vm.infoSwitch = true;
		vm.seeData = data;
		vm.seeField = seeField;
		vm.ipStatus = data.show_status;
	});

/*配置下发JS代码*/

    /*配置下发全局变量*/
    var device_ip;
    var interface;
    var device_name;
    /*确认下发按钮操作*/
    $('#pushBut').click(function () {
        if (document.getElementById('configText') == null) {
            alert('请选择配置模式');
            return false;
        }
//        var configText = $('#configText').val();
        var configText = document.getElementById('configText').innerText;
        var old_config = $('#showRun').html();
        var ip = device_ip;
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
                $('#config').html('<div contenteditable=true id="configText">' + configText + '</div>');
                $('#show_loader').addClass('hidden');
            },

            error: function (jqXHR, textStatus, errorThrown) {
                $('#show_loader').addClass('hidden');
                $('#config').html('<div contenteditable=true id="configText">获取配置失败，请联系管理人员确认模板配置正确</div>');
                $('#show_loader').addClass('hidden');
            },
            dataType: 'json'
        });
    })


})