$(document).ready(function(){
//vue数据渲染和事件方法
    var table = null;
	var vm = new Vue({
		el:'#detail',
		data:{
		    loading:true,
            allData:[],
            tableTitle:''
		},
		methods:{
            init:function(){
                var _this = this;
               /* $.get('',function(res){
                     _this.allData = res.data;
                    var firstKey = _this.getFirstAttr(_this.allData);
                    _this.tableTitle = firstKey;
                    _this.reloadData(_this.allData[firstKey]);
                    _this.loading = false;
                },"json");*/
                this.allData = {
                    "arp采集为空的范围":[
                        {
                            "dev_name":"1111",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1222",
                            "ip":"1.1.1.1"
                        },
                        {
                            "dev_name":"1333",
                            "ip":"1.1.1.1"
                        }
                    ],
                    "arp采集为空的范围22":[
                        {
                            "dev_name":"21111",
                            "ip":"1.1.1.145"
                        },
                        {
                            "dev_name":"2222",
                            "ip":"1.1.1.661"
                        },
                        {
                            "dev_name":"2333",
                            "ip":"1.1.1.4541"
                        }
                    ],
                    "arp采集为空的范围33":[
                        {
                            "dev_name":"3333",
                            "ip":"1.1.1.145"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.661"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.4541"
                        }
                    ],
                    "arp采集为空的范围44":[
                        {
                            "dev_name":"44444",
                            "ip":"1.1.1.145"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.661"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.4541"
                        }
                    ],
                    "arp采集为空的范围55":[
                        {
                            "dev_name":"5555",
                            "ip":"1.1.1.145"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.661"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.4541"
                        }
                    ],
                    "arp采集为空的范围66":[
                        {
                            "dev_name":"6666",
                            "ip":"1.1.1.145"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.661"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.4541"
                        }
                    ],
                    "arp采集为空的范围77":[
                        {
                            "dev_name":"7777",
                            "ip":"1.1.1.145"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.661"
                        },
                        {
                            "dev_name":"abcd22",
                            "ip":"1.1.1.4541"
                        }
                    ]
                }
                var firstKey = _this.getFirstAttr(_this.allData);
                _this.tableTitle = firstKey;
                _this.reloadData(_this.allData[firstKey]);
                _this.loading = false;
            },
            /*获取第一个属性*/
            getFirstAttr:function(obj) {
                for (var k in obj) return k;
            },
            checkDetail:function(key){
                this.loading = true;
                this.tableTitle = key;
                this.reloadData(this.allData[key]);
            },
            reloadData(dataList) {
                var currentPage = table.page(); //该行是固定写死的
                table.clear();//清理原数据
                table.rows.add(dataList); //添加新数据
                table.page(currentPage).draw( false );
                this.loading = false;
            },
            downLoad:function(){
                $(".downLoad").trigger("click");
            },
		},
		mounted:function(){
		    drawTable();
            this.init();
		}
	})
    /*声明table*/
    function drawTable(){
        table = $('#table_id_example').DataTable({
            buttons: [{
                extend: 'excel',
                text: '导出Excel',
                title:'信息详情表',
                className:'btn btn-info btn-xs downLoad',
                header:true,
                exportOptions: {
                    modifier: {
                        page: 'current',
                    }
                }
            }],
//            fixedHeader: true,
            dom:'<<B><"row"<"col-sm-6"l><"col-sm-6"p>><t><"row"<"col-sm-6"i><"col-sm-6"p>>>',
            data:[],
            columns: [
                {
                    "data":'dev_name'
                },
                {
                    "data":'ip'
                },
            ],
            aaSorting: [],//默认第几列开始排序
            responsive: true,//自适应屏幕
            paging: true,//分页
            pagingType: "full_numbers",//分页样式的类型
            ordering: true,//是否启用排序
            iDisplayLength : 10, //默认显示的记录数
            autoWidth:true,
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
//              vm.loading = false;
            },
            // 在每次table被draw完后回调函数
            fnDrawCallback:function(){
                //vm.loading = false;
            }
        });
    }
})