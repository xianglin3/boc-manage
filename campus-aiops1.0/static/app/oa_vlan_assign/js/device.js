$(document).ready(function(){
    $('.preloader').removeClass('hidden');

	var table = null;
	var deviceField = null;
    //公用datatables渲染表格方法  --解决数据刷新问题
    function resetTable(){
    	return table = $('#table_id_example').DataTable({
	        aoColumnDefs:[//设置列的属性，此处设置第一列不排序
	            // {"bSortable": false, "aTargets": [ 0,1,-1 ]},//不排序
	            { //设置某列不显示
	                "targets": '',
	                "visible": false,
	                "searchable": false
	            },
	        ],
	        // aaSorting: [[ 2, "desc" ]],//默认第几列开始排序
	        responsive: true,//自适应屏幕
	        paging: true,//分页
	        ordering: false,//是否启用排序
	        searching: true,//搜索
	        iDisplayLength : 10, //默认显示的记录数
	        autoWidth:true, 	//开启自动计算列宽
	        lengthMenu: [[5,10,20,50,100,200,-1],[5,10,20,50,100,200,"全部"]],//设置每页显示数量
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
	        },
	        paging: true, //开启分页
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
	$.ajax({
		url:'/static/app/oa_vlan_assign/json/ipdata/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			deviceField = data.deviceField;
		}
	})
	var vm = new Vue({
		el:'#oa_vlan_assign_device',
		data:{
			deviceData:'',
			deviceField:deviceField,
	        areas:'',
	        formArea: {
	          area: ''
	        }
		},
		methods:{
			searchBtn:function() {
                $('.preloader').removeClass('hidden');
                $.post('/oa_vlan_assign/dev_search/', {"area": vm.formArea.area}, function (res) {
                    vm.deviceData = res;
                    reDraw(vm);
                }, "json")
            },
            resetBtn:function(){
                vm.formArea.area = '';
            }
		},
		computed:{
            init:function(){
            	$.post('/oa_vlan_assign/device/',function(res){
            		//console.log(res[0])
            		vm.deviceData = res[0].device_list;
            		vm.areas = res[0].area_list;
            		reDraw(vm);
            	},"json");
            }
		}
	})

	//初始化表格
	resetTable();

    //字段显示或隐藏
    //jTable为jquery.dataTables表格对象
	//colNum为操作列的序号 为整数字
	function hidColumn(jTable, colNum) {
	    var column = jTable.column(colNum);
	    column.visible(!column.visible());
	}
	$('#oa_vlan_assign_device .dropdown-menu').on('click','input',function(){
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
})