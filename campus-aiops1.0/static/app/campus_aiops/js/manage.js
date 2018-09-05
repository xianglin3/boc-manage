$(document).ready(function(){
	/*声明全局变量*/
	var tableField = [],
		hideField = [],
		hideNum = [],
		showField = {},
		table = null;
	/*同步请求获取表格字段 详情字段 下拉框字段*/
	$.ajax({
		url:'/static/app/campus_aiops/json/fields.json',
		type:'get',
		async:false,
		dataType:'json',
		success:function(data){
			tableField = data.manageField.tableField;
			hideField = data.manageField.hideField;
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
		el:'#manage',
		data:{
		    showTable:false,
            searchVal:'',
            searchRadio:'search_by_keyword',
            select:'',
            selectInput:'',
			loading:false,
			tableField:tableField,
			showField:showField,
            isTable:false,
            dialogSize:'',
            dialogVisible:false,
            dialogTitle:'',
			dialogField:[],
			dialogData:{},
            // dialogTable:false,
            /*前段分页保存所有表格数据*/
            allEleTableList: [],
            tableList: [],//表格数据
            pagination: {//分页属性
                current_page: 1,
                total: 0,
                //'page-count': 10,
                page_size: 10,
                page_sizes: [10, 20, 40, 80],
                layout: "total, sizes, prev, pager, next, jumper"
            },
            /*测试数据*/
            checkInput:'',
            restaurants: []
		},
		methods:{
			/*查询数据*/
			searchBtn:function(){
                if(this.selectInput){
                    this.loading = false;
			        var searchUrl = '/access_search/api/v1/'+this.searchRadio+'/'+this.selectInput +'/';
		            table.ajax.url(searchUrl).load();
                }else{
                    vm.$message({message:"请输入搜索内容",type:"warning"});
                }
			},
			searchFirst:function(){
			    // /access_search/api/v1/search_by_keyword/
                var reqUrl = '',columnsSet = [];
			    for(var i = 0;i<this.tableField.length;i++){
			        var obj = {};
			        obj.data = this.tableField[i].field;
			        columnsSet.push(obj);
                }
                var firstObj = {
			        "data": 'id',
                    "width":"10px",
                    "render":function(data,type,full,callback){
                        var checkBox = "<input type='checkbox' data-ip="+full.interface_dev_ip+" data-interfaces="+full.interface_name+" class='checkchild' value=" +data+ ">";
                        return checkBox;
                    }
                };
                var endObj = {
                    "data": null,
                    "width":"60px",
                    "render":function(data,type,full,callback){
                        var op = "<i class='el-icon-menu' style='margin-right:14px;font-size: 18px;color:#00acd6;cursor:pointer;'></i>"+
                                "<div style='position:absolute; display:none;top:0;right:0;z-index:999;' class='btn-group-vertical' role='group' aria-label='...'>"+
                                    "<button id='del' class='del-data btn btn-warning btn-sm'>查看端口详情</button>"+
                                    "<button id='seeData' class='see-data btn btn-success btn-sm'>查看接入系统详情</button>"+
                                "</div>";
                        return op;
                    }
                };
                columnsSet.push(endObj);
                columnsSet.unshift(firstObj);
                if(this.selectInput){
//                    this.loading =-true;
			        this.showTable = true;
			        reqUrl = '/access_search/api/v1/'+this.searchRadio+'/'+this.selectInput +'/';
			        drawTable(reqUrl,columnsSet);
                }else{
                    vm.$message({message:"请输入搜索内容",type:"warning"});
                }
			},
            checkGroup:function(){
                var interfaces_2_check = [],requestData = {};
                $('.checkchild:checked').each(function(i){
                    var obj = {};
                    obj.interfaces = $(this).attr('data-interfaces');
                    obj.ip = $(this).attr('data-ip');
                    interfaces_2_check.push(obj);
                })
                if(interfaces_2_check[0]){
                    requestData.interfaces_2_check = interfaces_2_check;
                    console.log(requestData);
                    /*这是测试字段,根据实际修改*/
                    vm.dialogField = [{key:'ip',label:'ip'},
                        {key:'sys_name',label:'应用名称'},
                        {key:'deploy_type',label:'部署方式'},
                        {key:'sys_team',label:'系统团队'},
                        {key:'application_team',label:'维护团队'},
                        {key:'sys_a',label:'A角'},
                    ];
                    vm.dialogSize = 'large';
                    vm.isTable = true;
                    vm.loading = false;
                    vm.dialogVisible = true;
                    vm.dialogTitle = '查看检查详情';
                    vm.drawTable([{ip:1,sys_name:'2020-09-10',},{ip:2,sys_name:'2017-09-10'},{ip:3,sys_name:'2017-09-10',},{ip:8,sys_name:'2017-09-10'},{ip:9,sys_name:'2017-09-10'},{ip:10,sys_name:'2017-09-10'},{ip:4,sys_name:'2017-09-10'},{ip:5,sys_name:'2017-09-10'},{ip:6,sys_name:'2017-09-10'},{ip:7,sys_name:'2017-06-10'},{ip:11,sys_name:'2019-09-10'},{ip:12,sys_name:'2018-09-10'},{ip:13,sys_name:'2017-09-11'},{ip:14,sys_name:'2017-10-10'}]);
                    /*$.ajax({
                        url:'/access_search/api/v1/interface_detail/',
                        type:'post',
                        data:JSON.stringify(requestData),
                        headers:{
                            "Content-Type" : "application/json;charset=UTF-8",
                            "token":'skjlsjfkoiewjkgjlgjskg',
                        },
                        dataType:'json',
                        success:function(res){
                            vm.dialogVisible = true;
                            vm.dialogTitle = '查看检查详情';
                            vm.loading = false;
                            vm.drawTable(res.data);
                        }
                    });*/
                    /*$.post('/access_search/api/v1/interface_detail/',{name:'hello world'},function(res){
                        vm.loading = false;
                        vm.drawTable(res.data);
                    },"json")*/
                }else{
                    vm.$message({message:"请勾选内容",type:"warning"});
                }
            },
            drawTable:function(data) {
              this.pagination.total = data.length;
              this.allEleTableList = data;
              this.loadData();
            },
            loadData:function() {
              var cur = this.pagination.current_page,
                size = this.pagination.page_size;
              this.tableList = this.allEleTableList.slice((cur - 1) * size, cur * size);
            },
            onChangeCurPage:function (page){
              /**
               * 切换当前页动作
               * */
              this.pagination.current_page = page;
              this.loadData();
            },
            onChangeCurPageSize:function (size){
              /**
               * 切换当前页显示数量动作
               * */
              this.pagination.page_size = size;
              if(this.pagination.current_page == 1){
                this.loadData();
              }else{
                this.pagination.current_page = 1;
              }
            },
            /*前端排序 所有数据*/
            sortData:function(option){
                    /*降序排列*/
                   function down(propertyName) {
                        return function(object1, object2) {
                            var value1 = object1[propertyName];
                            var value2 = object2[propertyName];
                            if(value2 < value1) {
                                return -1;
                            } else if(value2 > value1) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }
                    /*升序排列*/
                   function up(propertyName) {
                        return function(object1, object2) {
                            var value1 = object1[propertyName];
                            var value2 = object2[propertyName];
                            if(value2 > value1) {
                                return -1;
                            } else if(value2 < value1) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }
                    if(option.order == 'descending'){
                        this.allEleTableList.sort(down(option.prop));
                    }else{
                        this.allEleTableList.sort(up(option.prop));
                    }
                    this.loadData();
            },
            downLoad:function(){
                $(".downLoad").trigger("click");
            },
            /*测试方法*/
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            init() {
                var _this = this;
                setTimeout(function(){
                    _this.restaurants = [{value:'1.1.1.1',key:'hello'},{value:'1.2.1.1',key:'hello'},{value:'2.1.1.1',key:'hello'},{value:'2.2.1.1',key:'hello'},]
                },1000)
            },
            handleSelect(item) {
                console.log(item);
            },
            toPage:function(){
                window.open('/campus_aiops/detail/');
            }
		},
		mounted:function(){
		    this.init();
		}
	})
    /*声明table*/
    function drawTable(reqUrl,columnsSet){
        var arr = [];
        for(var i = 1;i<columnsSet.length-1;i++){
            arr.push(i);
        }
        table = $('#table_id_example').DataTable({
//            dom: 'Bfrtip',
            buttons: [{
                extend: 'excel',
                text: '导出Excel',
                title:'接口详情',
                className:'btn btn-info btn-xs downLoad',
                header:true,
                exportOptions: {
                    modifier: {
                        page: 'current',
                    },
                    columns: arr
                }
            }],
            fixedHeader: true,
            dom:'<<B>f<"row"<"col-sm-6"l><"col-sm-6"p>><t><"row"<"col-sm-6"i><"col-sm-6"p>>>',
            /*ajax: {
                url:reqUrl,
                type:"POST",
                "dataSrc":function(data){
                    vm.loading = false;
                    return data.data;
                }
            },*/
            data:[
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 777777,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136133,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7IVIOS02]",
            "interface_name": "port-channe1111",
            "interface_dev_ip": "333333333"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channe2222",
            "interface_dev_ip": "22222222"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channe3333",
            "interface_dev_ip": "11111111"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        },
        {
            "arp_dev_ip": null,
            "mac_id": null,
            "arp_update_time": null,
            "mac_vlan": null,
            "arp_dev_name": null,
            "arp_ip_addr": null,
            "mac_update_time": null,
            "interface_status": "up",
            "arp_id": 666666,
            "interface_dev_name": "B-HHA2C-2LA-AS04",
            "interface_id": 136143,
            "mac_addr": null,
            "interface_desc": "[S1:LP_HP7JVIOS02]",
            "interface_name": "port-channel381",
            "interface_dev_ip": "21.121.240.140"
        }
    ],
            columns: columnsSet,
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
        // 移入
        $('#manage #table_id_example tbody').on('mouseover','td',function(){
            $(this).css('position','relative');
            $(this).find('i').hide();
            $(this).find('div').show();
        })
        $('#table_id_example tbody').on('mouseout','td',function(){
            $(this).find('i').show();
            $(this).find('div').hide();
        })
        /*查看端口详情*/
        $('#table_id_example tbody').on( 'click', 'button.del-data', function () {
            var oneData = table.row($(this).parents("tr")).data();
            vm.dialogField = [
                {
                    label:'设备IP',
                    key:'dev_ip'
                },
                {
                    label:'设备名称',
                    key:'dev_name'
                },
                {
                    label:'端口名称',
                    key:'interface_name'
                },
                {
                    label:'接口描述',
                    key:'interface_description_string'
                },
                {
                    label:'光电',
                    key:'interface_module_type'
                },
                {
                    label:'rate类型',
                    key:'interface_rate_mode'
                },
                {
                    label:'admin状态',
                    key:'interface_admin_state'
                },
                {
                    label:'协议状态',
                    key:'interface_line_protocol_state'
                },
                {
                    label:'vlan',
                    key:'interface_allow_vlan'
                },
                {
                    label:'带宽',
                    key:'interface_bandwidth'
                },
                {
                    label:'速率',
                    key:'interface_speed'
                },
                {
                    label:'portchannel',
                    key:'interface_channel_group'
                },
                {
                    label:'portchannel成员',
                    key:'port-channel members'
                },
                {
                    label:'VPC',
                    key:'interface_vpc'
                },
                {
                    label:'配置',
                    key:'interface_config'
                },
                {
                    label:'更新时间',
                    key:'update_time'
                },
            ];
            vm.dialogSize = 'small';
            vm.isTable = false;
            vm.loading = false;
                vm.dialogVisible = true;
                vm.dialogTitle = '查看端口详情';
            var url = '/access_search/api/v1/interface_detail/' +oneData.interface_id+ '/';
            $.get(url,function(res){
                vm.loading = false;
                vm.dialogData = res;
            },"json");
        });
        /*查看接入系统详情*/
        $('#table_id_example tbody').on( 'click', 'button.see-data', function () {
            // var apiUrl ='/devicestatus/parse/?parserScriptName=interfaceCheck.InterfaceErrBySNMP';
            var twoData = table.row($(this).parents("tr")).data();
            var apiUrl ='/system_info/api/v1/ip/' + twoData.arp_ip_addr;
            vm.dialogField = [{key:'ip',label:'ip'},
                {key:'sys_name',label:'应用名称'},
                {key:'deploy_type',label:'部署方式'},
                {key:'sys_team',label:'系统团队'},
                {key:'application_team',label:'维护团队'},
                {key:'sys_a',label:'A角'},
            ];
            vm.dialogSize = 'large';
            vm.isTable = true;
            vm.loading = false;
                vm.dialogVisible = true;
                vm.dialogTitle = '查看接入系统详情';
            $.get(apiUrl,function(res){
                vm.loading = false;
                vm.drawTable(res.data);
            },"json");
        });
    }
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
	$('#manage .show-filed .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        if (val == true) {
            //表示显示操作
            hidColumn(table, $(this).attr('value'));
        } else {
            //表示隐藏操作
            hidColumn(table, $(this).attr('value'));
        }
	})
	$("#manage .show-filed .dropdown-menu").on('click', function (e) {
                e.stopPropagation();
    });
})