$(document).ready(function(){
    $('.preloader').removeClass('hidden');
	//获取表格字段
	var portField = null;
	var seeField = null;
	var hideShow = null;
	$.ajax({
		url:'/static/app/oa_vlan_assign/json/ipdata/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			portField = data.portField;
			seeField = data.seeField;
			hideShow = data.portHidef;
		}
	})
	//数据表格显示
    var table = null;

    //公用datatables  --解决数据刷新问题
    function resetTable(){
    	return table = $('#table_id_example').DataTable({
	        aoColumnDefs:[//设置列的属性，此处设置第一列不排序
	            { //设置某列不显示
	                "targets": hides,
	                "visible": false,
	                "searchable": false
	            },
	            {"bSortable": false,
	             "aTargets": [ 0,-1 ]
	            },//某不排序
	            { "width": "5%", "targets": 0 },
	            { "width": "10%", "targets": 1 }
	        ],
	        autoWidth: false,
	        aaSorting: [[ 1, "desc" ]],//默认第几列开始排序
	        responsive: true,//自适应屏幕
	        paging: true,//分页
	        ordering: false,//是否启用排序
	        searching: true,//搜索
	        iDisplayLength : 10, //默认显示的记录数
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
	            //下面三者构成了总体的左下角的内容。
	            info: "总共_PAGES_ 页，显示第_START_ 条到第 _END_条 ，筛选之后得到 _TOTAL_ 条，总共_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
	            infoEmpty: "0条记录",//筛选为空时左下角的显示。
	            infoFiltered: ""//筛选之后的左下角筛选提示，
	        },
	        paging: true,
	        pagingType: "full_numbers"//分页样式的类型
	    });
    }
	//显示隐藏字段
	var hides = [];
	var hideField ={};
	hideShow.forEach(function(ele){
		portField.forEach(function(res,index){
			if(ele == res.text){
				hideField[ele] = index+1;
				hides.push(index+1);
			}
		})
	})
	var vm = new Vue({
		el:'#oa_vlan_assign_port',
		data:{
			portField:portField,
			portData:null,
			seeField:null,
			checkData:null,
			seeData:null,
			showHide:hideField,
			textarea:'',
            test:''
		},
		methods:{
			seePort:function(index){			//查看详情
				this.seeData = this.portData[index];
				this.seeField = seeField;
			},
			dowanloadExcel:function(){		//导出内容
		    	var port_ids = [];
			    $('.checkchild:checked').each(function(i){
			        port_ids.push($(this).val());
			        return port_ids;
			    });
		        console.log(port_ids);
		        var $inputContent = $('<input>').attr({ name: "datas", value: JSON.stringify(port_ids) });
		        var $form = $("<form>");
		        $form.attr({ target: '_blank', method: 'post', action: '/oa_vlan_assign/port_status_download/' }).append($inputContent);
		        //$form.submit();
		        resetCheck();
			},
			searchBtn:function(){			//搜索内容
				var _this = this;
                $('.preloader').removeClass('hidden');
				var arr = this.textarea.split('\n');
				for (var i = 0;i<arr.length;i++){
					if(arr[i] == ""){
						arr.remove("");
					}
				}
		        var searchData = {'addr[]':arr};
		        $.post("/oa_vlan_assign/port_status_search/",searchData,function(result){
                    //console.log(result);
		        	_this.portData = result;
		        	reDraw(_this);
		        },"json")
			},
			resetSearch:function(){
				$('#searchForm textarea').val('');
			}
		},
		computed:{
			initPort:function(){
				$.post('/oa_vlan_assign/port_status/',function(res){
                    vm.portData = res.slice(0,21);
                    reDraw(vm);
				},"json")
			}
		}
	})
    resetTable();  //初次渲染表格

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
   	//搜索框提示
   	$("#searchForm textarea").focus(function(){
   		// alert('hello');
   		$("#searchForm textarea").popover('show')
   	})
   	$("#searchForm textarea").blur(function(){
   		// alert('hello');
   		$("#searchForm textarea").popover('hide')
   	})
    //字段显示或隐藏
    //jTable为jquery.dataTables表格对象
	//colNum为操作列的序号 为整数字
	function hidColumn(jTable, colNum) {
	    var column = jTable.column(colNum);
	    column.visible(!column.visible());
	}
	$('#oa_vlan_assign_port .dropdown-menu').on('click','input',function(){
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

	//数据的重绘方法

	function reDraw(vT){
		table.destroy();  //销毁table
		vT.$nextTick(function(){  //重绘table  实现刷新
		    resetTable();
			$('.preloader').addClass('hidden');
		})
	}
})