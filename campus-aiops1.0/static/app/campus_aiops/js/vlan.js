/**
 * Created by nantian on 2018/3/13.
 */
$(document).ready(function(){
    /* 声明全局变量*/
    var tableField = [],
        table = null,
		hideField = [],
		hideNum = [],
		showField = {};
    /*获取表格字段 隐藏字段 限制字段*/
    $.ajax({
        url:'/static/app/campus_aiops/json/fields.json',
        type:'get',
        async:false,
        dataType:'json',
        success:function(data){
            tableField = data.vlanField.tableField;
            hideField = data.vlanField.hideField;
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
    //公用datatables渲染表格方法  --解决数据刷新问题
    function resetTable(){
        return table = $('#table_id_example').DataTable({
            aoColumnDefs:[//设置列的属性，此处设置第一列不排序
                { //设置某列不显示
                    "targets": hideNum,
                    "visible": false,
                    "searchable": false
                },
                {"bSortable": false, "aTargets": [ 0,-1 ]},{ "class": "tn", "targets": [ 0,-1 ] },//不排序
            ],
            aaSorting: [],//默认第几列开始排序
            responsive: true,//自适应屏幕
            paging: true,//分页
            pagingType: "full_numbers",//分页样式的类型
            ordering: true,//是否启用排序
            searching: true,//搜索
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
                zeroRecords: "没有内容",//table tbody内容为空时提示文字
                //下面三者构成了总体的左下角的内容。
                info: "总共_PAGES_ 页，显示第_START_ 条到第 _END_条 ，筛选之后得到 _TOTAL_ 条，总共_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                infoEmpty: "0条记录",//筛选为空时左下角的显示。
                infoFiltered: ""//筛选之后的左下角筛选提示，
            }
        });
    }
    //表格的重绘方法   --解决数据刷新问题
    function reDraw(vm){
        table.destroy();  //销毁table
        vm.$nextTick(function(){  //重绘table  实现刷新
            resetTable();
            vm.loading = false;
        })
    }   
//vue数据和方法
    //格式校验
    function isIPs(str) {
        var reg= /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(0)$/;
        return reg.test(str);
    };
    function isGateway(str){
        var reg= /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
        return reg.test(str);
    };
    function isMask(str){
        var reg= /^(255)\.(255)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(0)$/;
        return reg.test(str);
    };
    var checkIpSelection = function(rule, value, callback){
        if (!value) {
          return callback(new Error('请输入IP地址段'));
        }
        setTimeout(function(){
          if (!isIPs(value)) {
            callback(new Error('请输入IP地址段正确格式！'));
          } else {
            callback();
          }
        }, 500);
    };
    var checkIpGateway = function(rule, value, callback){
        if (!value) {
          return callback(new Error('请输入网关'));
        }
        setTimeout(function(){
          if (!isGateway(value)) {
            callback(new Error('请输入网关正确格式！'));
          } else {
            callback();
          }
        }, 500);
    };
    var checkIpMask = function(rule, value, callback){
        if (!value) {
          return callback(new Error('请输入掩码'));
        }
        setTimeout(function(){
          if (!isMask(value)) {
            callback(new Error('请输入掩码正确格式！'));
          } else {
            callback();
          }
        }, 500);
    };

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
    var vm = new Vue({
        el:'#vlan',
        data:{
            loading: true,
            dialogVisible: false,
            opera: null,
            area_list:[],
            vlanData:[],
            tableField:tableField,
			showField:showField,
            bOk:true,
            modalTitle: '',
            ruleForm: {
                note:'',
                vlan_id:'',
                vlan_name:'',
                department_name:'',
                area:'',
                ip_section:'',
                ip_gateway:'',
                ip_mask:''
            },
            rules: {
              vlan_id:[
                { required: true, message: '请输入vlan号', trigger: 'blur' }
              ],
              vlan_name:[
                { required: true, message: '请输入vlan名称', trigger: 'blur' }
              ],
              department_name:[
                { required: true, message: '请输入部门', trigger: 'blur' }
              ],
              area:[
                { required: true, message: '请选择地域', trigger: 'blur' }
              ],
              ip_section:[
                { required:true, validator: checkIpSelection, trigger: 'blur' }
              ],
              ip_gateway: [
                { required:true,validator: checkIpGateway, trigger: 'blur' }
              ],
              ip_mask:[
                { required:true,validator: checkIpMask, trigger: 'blur' }
              ]
            }
        },
        methods:{
            init:function(){
                /*$.post('/campus_aiops/vlan_list/',function(res){
                    vm.vlanData = res[0].vlan_list;
                    vm.area_list = res[0].area_list;
                    reDraw(vm);
                },"json");*/
                this.vlanData = [{vlan_id:'111'},{vlan_id:'222'},{vlan_id:'333'}];
                reDraw(vm);
            },
            /*测试区域*/
            toIp:function(index){
                console.log(index)
                var info = {aa:'hello',bb:'world'};
                sessionStorage.setItem('formKey', JSON.stringify(info));
                window.location.href="/campus_aiops/ip_list/";
            },
            // 操作显示的切换
            overShow:function(index){
                this.opera = index;
            },
            outHide:function(){
                this.opera = null;
            },
            // 表单新增
            addVlan:function(){
                this.bOk = true;
                this.dialogVisible = true;
                //初始化表单
                this.ruleForm = {
                    note:'',
                    vlan_id:'',
                    vlan_name:'',
                    department_name:'',
                    area:'',
                    ip_section:'',
                    ip_gateway:'',
                    ip_mask:''
                },
                this.modalTitle = 'VLAN新增';
            },
            // 表单编辑
            updataVlan:function(index){
                this.bOk = false;
                this.dialogVisible = true;
                this.modalTitle = 'VLAN编辑';
                $.extend( this.ruleForm, this.vlanData[index] );
            },
            // 表单提交
            submitForm:function(formName) {
                var _this=this;
                this.$refs[formName].validate(function(valid){
                  if(valid){
                      _this.loading = true;
                    if(_this.bOk){
                        //console.log(_this.ruleForm);
                        //url=/campus_aiops/vlan_create/   vlan_data:JSON.stringify(vlan_data)
                        $.post('/campus_aiops/vlan_create/',{"vlan_data":JSON.stringify(_this.ruleForm)},function(res){
                            _this.$message(res);
                            _this.init();
                            _this.dialogVisible = false;
                        })
                    }else{
                        //url=/campus_aiops/vlan_update/  vlan_data:JSON.stringify(editData)
                        //console.log(_this.ruleForm);
                        $.post('/campus_aiops/vlan_update/',{"vlan_data":JSON.stringify(_this.ruleForm)},function(res){
                            _this.$message(res);
                            _this.init();
                            _this.dialogVisible = false;
                        })
                    }
                  }
                });
            },
            resetForm:function(formName) {
                this.$refs[formName].resetFields();
                this.ruleForm = {
                    note:'',
                    vlan_id:'',
                    vlan_name:'',
                    department_name:'',
                    area:'',
                    ip_section:'',
                    vlan_purpose:'',
                    ip_gateway:'',
                    ip_mask:''
                }
            },
            cencelDialog:function(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
            },
            // 数据删除  url=campus_aiops/vlan_delete/ "id[]":vlan_ids
            deleteVlan:function(index){
                var _this = this;
                var vlan_ids = [];
                if(index == undefined){
                    $('.table .checkchild:checked').each(function(i){
                        vlan_ids.push($(this).val());
                        return vlan_ids;
                    })
                }else{
                    vlan_ids.push(this.vlanData[index].id);
                }
                if(vlan_ids.length == 0){
                    this.$message({
                        message: '请选择数据',
                        type: 'warning'
                    });
                }else{
                    this.$confirm('此操作将永久删除这'+vlan_ids.length+'条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                        //console.log(vlan_ids);
                        vm.loading = true;
                        $.post('/campus_aiops/vlan_delete/',{"id[]":vlan_ids},function(data){
                            vm.$message({
                                type: 'success',
                                message: data
                            });
                            vm.init();
                        })
                        resetCheck();
                    }).catch(function(){
                        this.$message({
                        type: 'info',
                        message: '已取消删除'
                        });          
                    });
                }
            },
            detailVlan:function(index){
                window.location.href="/campus_aiops/ip_list/?id="+this.vlanData[index].vlan_id;
            },
            // vlan下载
            downloadVlan:function(){ 
                var vlan_ids = [];
                $('.checkchild:checked').each(function(i){
                    vlan_ids.push($(this).val());
                    return vlan_ids;
                })
                //console.log(vlan_ids);
                var $inputContent = $('<input>').attr({ name: "id[]", value: JSON.stringify(vlan_ids) });
                var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action:'/campus_aiops/vlan_download/' }).append($inputContent);
                $(document.body).append($form);
                $form.submit();
                resetCheck();
            },
            // vlan信息导入
            exportVlan:function(){
                var impotrForm = $("#import_vlan").ajaxForm({
                    url:"/campus_aiops/import_vlan/",//批量导入接口
                    type:"POST",
                    success:function(txt){
                        $("#import_vlan input").val("");
                        if(txt.indexOf('成功') !== -1){
                            vm.$message({showClose: true,message: txt,type: 'success'});
                            vm.init();
                        }else{
                            vm.$message({showClose: true,duration: 0,message: txt,type: 'error'});
                            vm.loading = false;
                        }
                    },
                    error:function(e){
                        $("#import_vlan input").val("");
                        vm.loading = false;
                        vm.$message({message: e.statusText,type: 'error'});
                    }
                });
                this.loading = true;
                impotrForm.submit();
            }
        },
        mounted:function(){
            this.init();
        }
    })
    resetTable(); //用datatables初始化表格

    //字段显示或隐藏
    //jTable为jquery.dataTables表格对象
    //colNum为操作列的序号 为整数字
    function hidColumn(jTable, colNum) {
        var column = jTable.column(colNum);
        column.visible(!column.visible());
    }
    $('#vlan .show-filed .dropdown-menu').on('click','input',function(){
        var val = $(this).prop("checked");
        if (val == true) {
            //表示显示操作
            hidColumn(table, $(this).val());
        } else {
            //表示隐藏操作
            hidColumn(table, $(this).val());
        }
    })
    $(".show-filed .dropdown-menu").on('click', function (e) {
                e.stopPropagation();
    });

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
});
