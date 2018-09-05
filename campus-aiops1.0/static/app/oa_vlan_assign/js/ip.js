$(document).ready(function(){

	$('.preloader').removeClass('hidden'); //loading 加载中。。。。

//公用变量声明和方法
	//获取表格字段 在vue的数据中进行赋值
	var ipField = null,//ip表格显示字段
		seeField = null,//详情页显示表格字段
		checkField = null,//检查页显示字段
		hideShow = null;//显示隐藏字段
	$.ajax({
		url:'/static/app/oa_vlan_assign/json/ipdata/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			ipField = data['ipField'];
			seeField = data['seeField'];
			checkField = data['checkField'];
			hideShow = data['hideField'];
		}
	})
	//获取vlan的ID--用于搜索某个vlan下的ip
    var vlanID=window.location.search.replace('?','').split('=')[1]||'';
    var table = null; //声明全局table变量
	//显示隐藏字段处理
	var hides = [];  //存储隐藏字段下标
	var hideField = {};
	hideShow.forEach(function(ele){
		ipField.forEach(function(res,index){
			if(ele == res.text){
				hideField[ele] = index+2;
				hides.push(index+2);
			}
		})
	})
    //公用datatables渲染表格方法  --解决数据刷新问题
    function resetTable(){
    	return table = $('#table_id_example').DataTable({
	        aoColumnDefs:[//设置列的属性，此处设置第一列不排序
	            { //设置某列不显示
	                "targets": hides,
	                "visible": false,
	                "searchable": false
	            },
	            {"bSortable": false, "aTargets": [ 0,1,-1 ]},{ "class": "tn", "targets": [ 0,1,-1 ] },//不排序
	        ],
	        aaSorting: [[ 2, "desc" ]],//默认第几列开始排序
	        responsive: true,//自适应屏幕
	        paging: true,//分页
	        ordering: false,//是否启用排序
	        searching: true,//搜索
	        iDisplayLength : 10, //默认显示的记录数
	        autoWidth:true,
	        lengthMenu: [[5,10,20,50,100,200,-1],[5,10,20,50,100,200,"全部"]],//设置每页显示数量
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
	            Processing: "<img src='static/app/oa_vlan_assign/images/loading.gif' />",
	            //下面三者构成了总体的左下角的内容。
	            info: "总共_PAGES_ 页，显示第_START_ 条到第 _END_条 ，筛选之后得到 _TOTAL_ 条，总共_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
	            infoEmpty: "0条记录",//筛选为空时左下角的显示。
	            infoFiltered: ""//筛选之后的左下角筛选提示，
	        },
	        paging: true,
	        pagingType: "full_numbers"//分页样式的类型
	    });
    }
	//表格的重绘方法   --解决数据刷新问题
	function reDraw(vm){
		table.destroy();  //销毁table
		vm.$nextTick(function(){  //重绘table  实现刷新
		    resetTable();
		    $('.preloader').addClass('hidden');
		})
	}

    //检查弹出框表格
	var tableB = null;
	function checkTable(){
		return tableB = $('#checkTable').DataTable({
			        responsive: true,//自适应屏幕
			        paging: true,//分页
			        ordering: false,//是否启用排序
			        searching: true,//搜索
			        iDisplayLength : 10, //默认显示的记录数
			        autoWidth:true,
			        lengthMenu: [[5,10,20,50,100,200,-1],[5,10,20,50,100,200,"全部"]],//设置每页显示数量
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
			            Processing: "<img src='static/app/oa_vlan_assign/images/loading.gif' />",
			            //下面三者构成了总体的左下角的内容。
			            info: "总共_PAGES_ 页，显示第_START_ 条到第 _END_条 ，筛选之后得到 _TOTAL_ 条，总共_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
			            infoEmpty: "0条记录",//筛选为空时左下角的显示。
			            infoFiltered: ""//筛选之后的左下角筛选提示，
			        },
			        paging: true,
			        pagingType: "full_numbers"//分页样式的类型
			    });
	}
	function reCt(vm){
		tableB.destroy();
		vm.$nextTick(function(){
			checkTable();
			$('.preloader').addClass('hidden');
		})
	}
	//获取列表
    function getAll(){
    	$.post('/oa_vlan_assign/ip/',{id:vlanID},function(res){
            //console.log(res);
    		vm.ipData = res;
    		reDraw(vm);
    	},"json")
    }
    //mac验证
    var checkMac = function(rule, value, callback){
        if (!value) {
          return callback(new Error('请输入MAC地址'));
        }
        setTimeout(function() {
          if (!isMac(value)) {
            callback(new Error('请输入MAC正确格式！'));
          } else {
            callback();
          }
        }, 500);
    };
    //友情链接地址
    var linkAddress = [
        {
            title:"同城EAD服务器",
            linkAddress:"http://22.122.51.80:8080/imc/"

        },
        {
            title:"同城DHCP服务器",
            linkAddress:"https://22.122.51.68/ui/"

        },
        {
            title:"西单EAD服务器",
            linkAddress:"http://22.1.84.80:8080/imc/"

        },
        {
            title:"西单DHCP服务器",
            linkAddress:"https://22.1.84.68/ui/"

        },
        {
            title:"命令行实时采集",
            linkAddress:"http://22.1.111.29/cli_realtime/"

        },
        {
            title:"CMCS批量任务创建",
            linkAddress:"http://22.1.111.29/CMCS_Tool/excel_push/"

        },
        {
            title:"CMCS管理平台",
            linkAddress:"https://22.122.32.128:8001/nccmweb/#initial"

        },
    ]
//vue数据渲染和事件方法
	var vm = new Vue({
		el:'#oa_vlan_assign_ip',
		data:{
			selected:0, //下拉框绑定
			ipField:ipField,
			checkField:checkField,
			showField:hideField,
			ipData:null, //ip数据
			checkData:null, //检查数据
			seeData:null,	//详情页数据
			seeField:null,
			ipStatus:null,
			department:'',
			limitFields:'',
            links:linkAddress,
            ruleForm: {
                department_name:'',
                user:'',
                account:'',
                head_office:'',
                tel:'',
                location:'',
                info_id:'',
                ip:'',
                mac:'',
                asset:'是',
                application:'',
                app_ip:'',
                app_interface:'',
                switch_ip:'',
                switch_int:'',
                terminal_type:'',
                reason:'',
                exist:'是',
                note:''
            },
            rules: {
              department_name:[
                { required: true, message: '请选择部门', trigger: 'blur' }
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
              ],
              exist:[
                { required: true, message: '请选择是否在白名单中', trigger: 'blur' }
              ]
            }
		},
		methods:{
			getCheck:function(tag){			//检查
				var _this = this;
				$('.preloader').removeClass('hidden');
				if(tag == 1){
                    $('#check #desText').text('在交换机IP和端口相同的情况下,检查自动采集结果与手动录入信息中终端IP和MAC不一致的记录。');
                    $.post('/oa_vlan_assign/ip_compare/',{"tag":tag},function(result){
                        //console.log(result);
                        _this.checkData = result;
                        reCt(_this);
                    },"json")
					// this.checkData = checkData2;
				}else{
                    $('#check #desText').text('在终端IP和MAC相同的情况下,检查自动采集结果与手动录入信息中交换机IP和端口不一致的记录。');
                    $.post('/oa_vlan_assign/ip_compare/',{"tag":tag},function(result){
                        //console.log(result);
                        _this.checkData = result;
                        reCt(_this);
                    },'json')
					// this.checkData = checkData
				}  
			},
			resetCheck:function(){			//重置检查.获取默认数据
				var _this = this;
                checkTable();
				$('.preloader').removeClass('hidden');
                $('#check #desText').text('在终端IP和MAC相同的情况下,检查自动采集结果与手动录入信息中交换机IP和端口不一致的记录。');
				$.post('/oa_vlan_assign/ip_compare/',{"tag":"0"},function(result){
                    //console.log(result);
					_this.checkData = result;
                    reCt(_this);
				},'json')
				// this.checkData = checkData;
				$('#check .btn-group label').removeClass('active');   
				$('#check .btn-group label[tag=0]').addClass('active');   
			},
			deleteBtn:function(index){ //删除
				var _this = this;
		        var ip_ids = [];
				if(index == undefined){
			        $('.checkchild:checked').each(function(i){
			       		if($(this).attr("deletes")){
			            	ip_ids.push($(this).attr("deletes"));
			       		}
			            return ip_ids;
			        })
				}else{
					if(this.ipData[index].show_status == 0){
		        		ip_ids.push(this.ipData[index].id);
						// console.log(ip_ids);
					}else{
						return false;
					}
				}
		    	//console.log(ip_ids);
		    	if(ip_ids.length == 0){
		    		layer.msg('请选择数据',{time:1500,offset:'220px'})
		    	}else{
					layer.confirm('确认回收这'+ip_ids.length+'条数据吗?', {icon: 3, title:'提示',offset:'220px'}, function(index){
						layer.close(index);
		        		$('.preloader').removeClass('hidden');
		        		//url = /oa_vlan_assign/ip_delete/   ip_ids
		        		// getAll();
		        		$.post('/oa_vlan_assign/ip_delete/',{"id[]":ip_ids},function(data){
                            layer.msg(data,{icon:1,time:2000});
                            getAll();
		        		})
		        		resetCheck();
					})
		    	}
			},
			seeIp:function(index){			//查看详情
				this.seeData = this.ipData[index];
				this.seeField = seeField;
				this.ipStatus = this.ipData[index].show_status;
                //console.log(this.seeData);
			},
			seeDelete:function(){
		        var ip_ids = [];
		        var _this = this;
		        ip_ids.push(this.seeData.id);
				layer.confirm('确认回收这'+ip_ids.length+'条数据吗?', {icon: 3, title:'提示',offset:'220px'}, function(index){
					layer.close(index);
			        $('#datas').modal('hide');
	        		$('.preloader').removeClass('hidden');
	        		//url = /oa_vlan_assign/ip_delete/   ip_ids
	        		$.post('/oa_vlan_assign/ip_delete/',{"id[]":ip_ids},function(data){
                        layer.msg(data);
	        			//console.log(stringJson(data).data);
	        			//_this.ipData = stringJson(data).data;
	        			//reDraw(_this);
	        			//layer.msg('删除成功',{time:1500});
	        		})
				})
			},
			addIp:function(formName){			//新增按钮
                this.$refs[formName].resetFields();
        		//获取全部部门
                $.post('/oa_vlan_assign/department/',function(res){
                    //console.log(res);
                    vm.department = res;
                },'json')
        		//获取限制字段
        		$.post('/static/app/oa_vlan_assign/json/ipdata/limitFields.json',function(res){
        			vm.limitFields = res;
        		},"json")
			},
            submitForm:function(formName) {		//新增提交
                var _this = this;
                this.$refs[formName].validate(function(valid){
                  if (valid) {
                        //console.log(_this.ruleForm);
                        //url=/oa_vlan_assign/ip_create/   ip_data:stringJson(json)
                        $.post('/oa_vlan_assign/ip_create/',{"ip_data":stringJson(_this.ruleForm)},function(res){
                        	layer.msg(res);
                            $('#ipAdd').modal('hide');
                        	getAll();
                        })
                  } else {
                    layer.msg('请完善提交内容！',{time:1000});
                    return false;
                  }
                });
            },
            resetForm:function(formName) {		//新增重置
                this.$refs[formName].resetFields();
            },
			dowanloadExcel:function(){		//导出内容
		    	var ip_ids = [];
			    $('.checkchild:checked').each(function(i){
			        ip_ids.push($(this).val());
			        return ip_ids;
			    })
		        //console.log(ip_ids);
		        var $inputContent = $('<input>').attr({ name: "datas", value: JSON.stringify(ip_ids) });
		        var $form = $("<form>");
		        $form.attr({ target: '_blank', method: 'post', action: '/oa_vlan_assign/ip_download/' }).append($inputContent);
		        $form.submit();
		        resetCheck();
			},
			searchIp:function(){			//搜索内容
				var _this = this;
				$('.preloader').removeClass('hidden');
				var arr = $('#searchForm textarea').val().split('\n');
				for (var i = 0;i<arr.length;i++){
					if(arr[i] == ""){
						arr.remove("");
					}
				}
		        var searchIpUrl = '/oa_vlan_assign/ip_search/';
		        var searchData = {'addr[]':arr,show_status:_this.selected};

		        $.post("/oa_vlan_assign/ip_search/",searchData,function(result){
		        	if(result == "地址格式错误！"){
		        		$('.preloader').addClass('hidden');
		        		layer.msg(result);
		        	}else{
		        	_this.ipData = stringJson(result);
			        	reDraw(_this);
		        	}
		        })
			},
			resetSearch:function(){			//搜索重置
				$('#searchForm textarea').val('');
			}
		},
		computed:{
			initData:function(){  //获得初始数据
				getAll();
			}
		}
	})
	
//其他事件
    table = resetTable();//初始化表格
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
    //批量导入功能
    var impotrForm = $("#import_ip_excel").ajaxForm({
        url:"/oa_vlan_assign/import_ip_excel/",//批量导入接口
        type:"POST",
        success:function(txt){
        	if(txt.indexOf('成功') !== -1){
	            $("#import_ip_excel input").val("");

	            $.post('/oa_vlan_assign/ip/',{"id":vlanID},function(result){
	            	vm.ipData = stringJson(result);
	            	reDraw(vm);
                    layer.msg(txt,{time:1500,icon:1});
	            })
        	}else{
        		layer.msg(txt,{time:100000,icon:0,btn:['知道了'],btnAlign:'c'});
                $('.preloader').addClass('hidden');
        	}
        },
        error:function(e){
            $("#import_ip_excel input").val("");
            $(".preloader").addClass("hidden");
        }
    });
    $("#import_ip_excel input").change(function(){
        $(".preloader").removeClass("hidden");
        impotrForm.submit();
    });
   	//搜索文字提示
   	$("#searchForm textarea").focus(function(){
   		// alert('hello');
   		$("#searchForm textarea").popover('show')
   	})
   	$("#searchForm textarea").blur(function(){
   		// alert('hello');
   		$("#searchForm textarea").popover('hide')
   	})

//公用方法
    //重置复选框
    function resetCheck(){
        $('#table_id_example input:checkbox').removeAttr('checked');
    }
    //数据格式转换方法
    function stringJson(data){
        if(typeof data =='string'){
            return JSON.parse(data);
        }else{
            return JSON.stringify(data);
        }
    }
    //mac格式校验
    function isMac(str) {
        var reg= /^[a-zA-Z0-9]{4}.[a-zA-Z0-9]{4}.[a-zA-Z0-9]{4}$/;
        return reg.test(str);
    };
    //字段显示或隐藏
    //jTable为jquery.dataTables表格对象
	//colNum为操作列的序号 为整数字
	function hidColumn(jTable, colNum) {
	    var column = jTable.column(colNum);
	    column.visible(!column.visible());
	}
	$('#oa_vlan_assign_ip .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        if (val == true) {
            //表示显示操作
            hidColumn(table, $(this).attr('data-column'));
        } else {
            //表示隐藏操作
            hidColumn(table, $(this).attr('data-column'));
        }
	})
	$(".dropdown-menu").on('click', function (e) {
                e.stopPropagation();
    });
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
})