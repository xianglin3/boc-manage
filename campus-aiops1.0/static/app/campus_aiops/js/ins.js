$(document).ready(function(){
	const url = 'http://127.0.0.1:3000/ip_list/';
	const id=decodeURI(window.location.search.replace('?','').split('=')[1]||'');

	// vue数据渲染和事件方法
	var vm = new Vue({
		el:'#ip',
		data:{
			searchData:'',
			fields:[
				{text:'ID'},
				{text:'状态'},
				{text:'使用人'},
				{text:'电话'}
			]
		},
		methods:{
			select:function(){
				console.log('vue')
				tables.api().ajax.url( 'http://127.0.0.1:3000/ip_search/').load()
			}
		},
		mounted:function(){
		},
		filters:{
		}
	});
    var tables = $("#tableList").dataTable({
        processing: false,//载入数据的时候是否显示“载入中”
        pageLength: 10,  //首次加载的数据条数
        pagingType: "full_numbers",
        autoWidth: true,
        stateSave: false,//保持翻页状态，和comTable.fnDraw(false);结合使用
        searching: true,//禁用datatables搜索
        ajax: {
        	url:url,
        	type:"POST",
        	"data":function(d){
				// return $.extend( {}, d, {"status": $('#searchInput').val()});
				/*var strCookie=document.cookie; 
				var arrCookie=strCookie.split("; "); 
				var vlanID; 
				//遍历cookie数组，处理每个cookie对 
				for(var i=0;i<arrCookie.length;i++){ 
				         var arr=arrCookie[i].split("="); 
				         //找到名称为userId的cookie，并返回它的值 
				         if("vlan_id"==arr[i]){ 
				                vlanID=arr[i]; 
				                break; 
				         } 
				} */

				/*if(id){
					return {status:vm.searchData,vlan_id:localStorage.vlanId};
				}else{
					return {status:vm.searchData,vlan_id:''};
				}*/

				return {status:vm.searchData,vlan_id:id};
				// return {status:vm.searchData,vlan_id:decodeURI(escape(vlanID))};
        	},
        	"dataSrc":function(data){
        		console.log(data)
        		if(data.text == '地址格式错误！'){
        			vm.$message({message:data.text});
        			let arr = [];
        			return arr;
        		}else{
        			return data.data
        		}
        	}
        },//ajax请求数据
        columns: [//对应html中thead里面的序列
            {"data": 'id',"width":"10px",
            	"render":function(data,type,full,callback){
            		let checkBox = `<input type='checkbox' class='checkchild' value="${data}">`
            		return checkBox;
            	}
        	},
            {"data": 'id'},
            {"data": 'status'},
            {"data": 'user'},
            {"data": 'tel'},
            {"data": null,"width":"60px",
            	"render":function(data,type,full,callback){
            		let op = `
                        <i class="el-icon-menu" style="margin-right:14px;font-size: 18px;color:#00acd6;cursor:pointer;"></i>
                        <div style="position:absolute; display:none;top:0;right:0;z-index:999;" class="btn-group-vertical" role="group" aria-label="...">
                            <button class="del btn btn-warning btn-sm">删除</button>
                            <button class="seeD btn btn-success btn-sm">配置下发</button>
                        </div>`;
                    return op;
            	}
        	}
        ],
        aoColumnDefs: [
			{ //设置某列不显示
				targets: [2],
				visible: false
			},
         	{//首列和末尾不排序
	　　　　	targets : [0,-1], 
	　　　　	orderable : false
　　　　	}
        ],
        order: [],//默认第几列开始排序
        /*汉化显示语言*/
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
        createdRow:function(row,data,index){
        	// console.log(index);
        },
        // 在每次table被draw完后回调函数
        fnDrawCallback: function(){

        },
        // 在每次table被draw前的回调函数
        fnPreDrawCallback:function(){

        }
	});
    //字段显示或隐藏
    //jTable为jquery.dataTables表格对象
	//colNum为操作列的序号 为整数字

	function hidColumn(jTable, colNum) {
	    var column = jTable.api().column(colNum);
	    column.visible(!column.visible());
	};
	$('#ip .show-filed .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        if (val == true) {
            //表示显示操作
            hidColumn(tables, $(this).attr('value'));
        } else {
            //表示隐藏操作
            hidColumn(tables, $(this).attr('value'));
        }
	})
	$("#ip .show-filed .dropdown-menu").on('click', function (e) {
                e.stopPropagation();
    });
	/*删除操作*/
	$('#tableList tbody').on( 'click', 'button.del', function () {
		let data = tables.api().row($(this).parents("tr")).data();

		console.log(tables.api().ajax.reload);
		tables.fnDraw(false);
		// console.log(data);
		$.post('http://127.0.0.1:3000/ip_delete/',{id:data.id},function(res){
			console.log(res.data);
			tables.api().ajax.reload();
			tables.api().draw(false);
		})
		//tables.ajax.reload();重新获取数据
		//tables.draw(false);重新刷新页面
	});
	/*查看详情*/
	$('#tableList tbody').on( 'click', 'button.seeD', function () {
		let data = tables.api().row($(this).parents("tr")).data();

		console.log(data);
	/*	tables.fnDraw(false);
		// console.log(data);
		$.post('http://127.0.0.1:3000/ip_delete/',{id:data.id},function(res){
			console.log(res.data);
			tables.api().ajax.reload();
			tables.api().draw(false);
		})*/
		//tables.ajax.reload();重新获取数据
		//tables.draw(false);重新刷新页面
	});
    // 移入
    $('#tableList tbody').on('mouseover','td',function(){
    	$(this).css('position','relative');
    	$(this).find('i').hide();
    	$(this).find('div').show();
    })
    $('#tableList tbody').on('mouseout','td',function(){
    	$(this).find('i').show();
    	$(this).find('div').hide();
    })

})