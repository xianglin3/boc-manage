$(document).ready(function(){
	/*声明全局变量*/
	var table = null,tableField = null;

	/*同步获取表格字段*/
	$.ajax({
		url:'/static/app/campus_aiops/json/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			tableField = data.devField.tableField;
		}
	})
    /*公用datatables渲染表格方法  --解决数据刷新问题*/
    function resetTable(){
    	return table = $('#table_id_example').DataTable({
	        aoColumnDefs:[//设置列的属性，此处设置第一列不排序
	            {"bSortable": false, "aTargets": [ 0 ]},//不排序
	            { //设置某列不显示
	                "targets": '',
	                "visible": false,
	                "searchable": false
	            },
	        ],
	        // aaSorting: [[ 2, "desc" ]],//默认第几列开始排序
	        responsive: true,//自适应屏幕
	        paging: true,//分页
	        pagingType: "full_numbers",//分页样式的类型
	        ordering: true,//是否启用排序
            aaSorting: [],//默认第几列开始排序
	        searching: true,//搜索
	        iDisplayLength : 10, //默认显示的记录数
	        autoWidth:true, 	//开启自动计算列宽
	        lengthMenu: [[10,20,50,100,200,-1],[10,20,50,100,200,"全部"]],//设置每页显示数量
	        language: {
	            sLengthMenu: "_MENU_ 条数据",//每页显示信息数汉化
	            search: '模糊搜索：',//右上角的搜索文本，可以写html标签
	            paginate: {	//分页的样式内容
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
	        }
	    });
    }
	/*表格的重绘方法   --解决数据刷新问题*/
	function reDraw(vm){
		table.destroy();  //销毁table
		vm.$nextTick(function(){  //重绘table  实现刷新
		    resetTable();
		    vm.loading = false;
		})
	}
	var vm = new Vue({
		el:'#dev',
		data:{
			loading:true,
			devList:[],
	        areaList:[],
	        searchArea:'',
			tableField:tableField
		},
		methods:{
			/*初始化 获取数据*/
			init:function(){
            	$.post('/campus_aiops/dev_list/',function(res){
            		vm.devList = res[0].device_list;
            		vm.areaList = res[0].area_list;
            		reDraw(vm);
            	},"json");
			},
            /*过滤展示数据*/
            returnData(el,field){
                //此处可进行过滤操作
                return el[field];
            },
			/*搜索数据*/
			searchBtn:function() {
				// this.loading = true;
                $.post('/campus_aiops/dev_search/', {"area": vm.searchArea}, function (res) {
                    vm.devList = res;
                    reDraw(vm);
                }, "json")
            },
            /*批量下载*/
            downloadDev:function(){
                var ids = [],downData = null;
                $('.checkchild:checked').each(function(i){
                    ids.push($(this).val());
                    return ids;
                })
                let searchData = {area:vm.searchArea};
                downData = {"id[]":ids,searchData:searchData};
                var $inputContent = $('<input>').attr({ name: "downData", value: JSON.stringify(downData)});
                
                var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action:'/campus_aiops/dev_download/' }).append($inputContent);
                $(document.body).append($form);
                $form.submit();
                resetCheck();
            }
		},
		mounted: function(){
			this.init();
		}
	});

	/*初始化表格*/
	resetTable();

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
})