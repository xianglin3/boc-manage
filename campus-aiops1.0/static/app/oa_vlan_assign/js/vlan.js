/**
 * Created by nantian on 2017/9/19.
 */
$(document).ready(function(){
    $('.preloader').removeClass('hidden');
    var fields = [
        {
            field:"vlan_id",
            text:"VLAN号"
        },
        {
            field:"vlan_name",
            text:"VLAN名"
        },
        {
            field:"department_name",
            text:"所属部门名"
        },
        {
            field:"area",
            text:"地域"
        },
        {
            field:"vlan_purpose",
            text:"用途"
        },
        {
            field:"ip_section",
            text:"IP地址段"
        },
        {
            field:"ip_gateway",
            text:"网关"
        },
        {
            field:"ip_mask",
            text:"掩码"
        },
        {
            field:"note",
            text:"备注"
        },
        {
            field:"operator",
            text:"操作人"
        },
        {
            field:"update_time",
            text:"更新时间"
        }
    ]
    var table = null;
    //公用datatables渲染表格方法  --解决数据刷新问题
    function resetTable(){
        return table = $('#table_id_example').DataTable({
            aoColumnDefs:[//设置列的属性，此处设置第一列不排序
                { //设置某列不显示
                    "targets": [10,11],
                    "visible": false,
                    "searchable": false
                },
                {"bSortable": false, "aTargets": [ 0,-1 ]},{ "class": "tn", "targets": [ 0,-1 ] },//不排序
            ],
            aaSorting: [[ 2, "desc" ]],//默认第几列开始排序
            responsive: true,//自适应屏幕
            paging: true,//分页
            ordering: true,//是否启用排序
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
    //请求全部数据
    function requestData(){
        setTimeout(function(){
            vm.vlanData = [{},{},{},{}];
            reDraw(vm);
        })
        // $.post('/oa_vlan_assign/vlan/',function(res){
        //     //console.log(res);
        //     vm.vlanData = res;
        //     reDraw(vm);
        // },'json')
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
        el:'#oa_vlan_assign_vlan',
        data:{
            msg:'hello',
            vlanData:'',
            vlanField:fields,
            departmentData:'',
            bOk:true,
            updataId:'',
            ruleForm: {
                note:'',
                vlan_id:'',
                vlan_name:'',
                department_name:'',
                area:'',
                ip_section:'',
                vlan_purpose:'',
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
                { required: true, message: '请选择部门', trigger: 'blur' }
              ],
              ip_section:[
                { required:true, validator: checkIpSelection, trigger: 'blur' }
              ],
              ip_gateway: [
                { required:true,validator: checkIpGateway, trigger: 'blur' }
              ],
              ip_mask:[
                { required:true,validator: checkIpMask, trigger: 'blur' }
              ],
              vlan_purpose:[
                { required: true, message: '请输入用途', trigger: 'blur' }
              ]
            }
        },
        methods:{
            addVlan:function(){
                this.bOk = true;
                //初始化表单
                $('#myModal input').val('');
                $('#myModal textarea').val('');
                $('#myModal .modal-title').text('VLAN新增');
                $('#myModal #addBtn').text('提交');
                //获取部门
                $.post('/oa_vlan_assign/department/',function(res){
                    vm.departmentData = res;
                },'json')
            },
            change:function(){
                var _this =this;
                //console.log(this.ruleForm.department_name);
                //地域部门联动
                if(this.ruleForm.department_name){
                    $.ajax({
                        url:'/oa_vlan_assign/area_search_by_dep/',
                        type:'post',
                        data:{department_name:_this.ruleForm.department_name},
                        dataType:'json',
                        // async:false,
                        success:function(res){
                            //console.log(res)
                            _this.ruleForm.area = res;
                        }
                    })  
                }else{
                    _this.ruleForm.area = '';
                }
            },
            submitForm:function(formName) {
                var _this=this;
                this.$refs[formName].validate(function(valid){
                  if(valid){
                    // console.log(this.ruleForm)
                    if(_this.bOk){
                        //alert('新增');
                        //console.log(_this.ruleForm);
                        //url=/oa_vlan_assign/vlan_create/   vlan_data:stringJson(vlan_data)
                        $.post('/oa_vlan_assign/vlan_create/',{"vlan_data":stringJson(_this.ruleForm)},function(res){
                            layer.msg(res);
                            requestData();
                            $('#myModal').modal('hide');
                        })
                    }else{
                        //alert('更新');
                        //url=/oa_vlan_assign/vlan_update/  vlan_data:stringJson(editData)
                        var json = {};
                        for(key in _this.ruleForm){
                            json[key] = _this.ruleForm[key];
                        };
                        json.id = _this.updataId;
                        //console.log(json);
                        $.post('/oa_vlan_assign/vlan_update/',{"vlan_data":stringJson(json)},function(res){
                            layer.msg(res);
                            requestData();
                            $('#myModal').modal('hide');
                        })

                        //requestData() 更新数据
                    }
                  } else {
                    layer.msg('请完善提交内容！',{time:1000});
                    return false;
                  }
                });
            },
            resetForm:function(formName) {
                this.$refs[formName].resetFields();
            },
            deleteVlan:function(index){
                var _this = this;
                var vlan_ids = [];
                if(index == undefined){
                    $('.checkchild:checked').each(function(i){
                        vlan_ids.push($(this).val());
                        return vlan_ids;
                    })
                }else{
                    vlan_ids.push(this.vlanData[index].id);
                    // console.log(ip_ids);
                }

                //console.log(vlan_ids);
                // url=oa_vlan_assign/vlan_delete/ "id[]":vlan_ids
                if(vlan_ids.length == 0){
                    layer.msg('请选择数据',{time:1500,offset:'220px'})
                }else{
                    layer.confirm('确认回收这'+vlan_ids.length+'条数据吗?', {icon: 3, title:'提示',offset:'220px'}, function(index){
                        layer.close(index);
                        $('.preloader').removeClass('hidden');
                        $.post('/oa_vlan_assign/vlan_delete/',{"id[]":vlan_ids},function(data){

                            layer.msg(data,{time:1500});
                            requestData();
                        })
                        resetCheck();
                    })
                }
            },
            updataVlan:function(index){
                this.bOk = false;
                // console.log(this.vlanData[index])
                this.updataId = this.vlanData[index].id;
                $('#myModal .modal-title').text('VLAN编辑');
                //获取部门
                $.post('/oa_vlan_assign/department/',function(res){
                    vm.departmentData = res;
                },'json')

                this.ruleForm.vlan_id = this.vlanData[index].vlan_id;
                this.ruleForm.vlan_name = this.vlanData[index].vlan_name;
                this.ruleForm.vlan_purpose = this.vlanData[index].vlan_purpose;
                this.ruleForm.department_name = this.vlanData[index].department_name;
                this.ruleForm.area = this.vlanData[index].area;
                this.ruleForm.ip_section = this.vlanData[index].ip_section;
                this.ruleForm.ip_gateway = this.vlanData[index].ip_gateway;
                this.ruleForm.ip_mask = this.vlanData[index].ip_mask;
                this.ruleForm.note = this.vlanData[index].note;
            },
            detailVlan:function(index){
                window.location.href="/oa_vlan_assign/ip/?id="+this.vlanData[index].id;
            },
            downloadVlan:function(){             //批量导出
                var vlan_ids = [];
                $('.checkchild:checked').each(function(i){
                    // console.log($(this).val());
                    vlan_ids.push($(this).val());
                    return vlan_ids;
                })
                //console.log(vlan_ids);
                var $inputContent = $('<input>').attr({ name: "datas", value: JSON.stringify(vlan_ids) });
                var $form = $("<form>");
                $form.attr({ target: '_blank', method: 'post', action:'/oa_vlan_assign/vlan_download/' }).append($inputContent);
                $form.submit();
                resetCheck();//重置复选框
            },
            exportVlan:function(){               //导入文件
                var impotrForm = $("#import_vlan_excel").ajaxForm({
                    url:"/oa_vlan_assign/import_vlan_excel/",//批量导入接口
                    type:"POST",
                    success:function(txt){
                        $("#import_vlan_excel input").val("");
                        if(txt.indexOf('成功') !== -1){
                            layer.msg(txt,{time:1500,icon:1})
                            requestData();
                        }else{
                            layer.msg(txt,{time:150000,icon:0,btn:['我知道了'],btnAlign:'c'});
                            $('.preloader').addClass('hidden');
                        }
                    },
                    error:function(e){
                        //$("#import_excel input").val("");
                        $("#import_vlan_excel input").val("");
                        $(".preloader").addClass("hidden");
                        window.alert(e.statusText);
                    }
                });
                $(".preloader").removeClass("hidden");
                impotrForm.submit();
            }
        },
        mounted:function(){
                requestData();
                //$.post('/oa_vlan_assign/vlan/',function(res){
                //    vm.vlanData = res;
                //    reDraw(vm);
                //},'json')
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
    $('#oa_vlan_assign_vlan .dropdown-menu').on('click','input',function(){
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
