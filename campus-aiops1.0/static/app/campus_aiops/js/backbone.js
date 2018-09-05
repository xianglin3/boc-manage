$(document).ready(function(){
	var vm = new Vue({
		el:'#backbone',
		data:{
            dialogVisible:false,
            dialogTitle:'',
            isDialogTable:true,
            radio:'1',
            city:"",
            tableData:[],
            checkedData:[],
            dialogData1:[],
            dialogData2:[],
            configData:[],
            allData:null,
            checkStatus:'',
            formInput:{
                value1:'1000',
                value2:'1001',
                value3:'1002'
            },
            fieldName:{zz:'园区一',hh:'园区二'}
		},
		methods:{
		    tabRadio:function(val){
		        this.city = '';
//		        console.log(val);
		    },
            querySearch:function(queryString, cb) {
                var results = queryString ? this.inputData.filter(this.createFilter(queryString)) : this.inputData;
                cb(results);
            },
            createFilter:function(queryString) {
                return function(restaurant){
                    return (restaurant.value.indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            handleSelect:function(item){
                this.tableData = [];
                console.log(item);
                console.log(this.allData[this.radio][item.value]);
                for(var key in this.allData[this.radio][item.value]){
                    var obj = {};
                    obj = this.allData[this.radio][item.value][key];
                    obj.name = this.fieldName[key];
                    this.tableData.push(obj)
                }
            },
            check:function(val){
                this.checkStatus = 'checked'
                var _this = this
                if(this.city){
                    switch(val){
                        case 'passiveB':
                            /*$.get('url',function(res){
                                if(res.code == 200){
                                    var arr = JSON.parse(JSON.stringify(this.tableData));
                                    for(var i = 0;i<res.data.length;i++){
                                        arr[i].xianlu_status = res.data[i].xianlu_status;
                                    }
                                    this.tableData = arr;
                                }else{
                                    this.$message({message:info,type:"warning"});
                                }
                            },"json")*/
                            break;
                        case 'opera':
                            alert('opera')
                            break;
                        case 'reCheck':
                            alert('reCheck')
                            break;
                        default:
                            alert('rePassive')
                    }
//                    this.$loading();
                    setTimeout(function(){
                        var reqData = [{
                        "dc": "hh","dcdevice": "A_HHA02_WAN_AR01",
                        "dcport": "G0/0/1/7","brip": "11.14.1.2",
                        "cmd": "ping 11.14.1.2 count 1000 size 1500",
                        "status": "",
                        "desc": "",
                        "loss_count": 0,
                        "xianlu_status": "",
                        "panglu_cmd": "router bgp 65000\nneighbor 11.14.1.2 shutdown",
                        "huifu_cmd": "",xianlu_status:'ok'},{
                        "dc": "zz","dcdevice": "A_HHA02_WAN_AR01",
                        "dcport": "G0/0/1/7","brip": "11.14.1.2",
                        "cmd": "ping 11.14.1.2 count 1000 size 1500",
                        "status": "",
                        "desc": "",
                        "loss_count": 0,
                        "xianlu_status": "",
                        "panglu_cmd": "router bgp 65000\nneighbor 11.14.1.2 shutdown",
                        "huifu_cmd": "",xianlu_status:'no'}];
                        _this.checkedData = reqData;
                        var arr = JSON.parse(JSON.stringify(_this.tableData));
                        for(var i = 0;i<reqData.length;i++){
                            arr[i].xianlu_status = reqData[i].xianlu_status;
                        }
                        _this.tableData = arr;
                        console.log(_this.tableData);
//                        _this.$loading().close();
                    },500)
                }else{
                    this.$message({message:"请输入城市",type:'warning'})
                }
            },
            detail:function(){
                this.isDialogTable = true;
                this.dialogVisible = true;
                this.dialogTitle = '检查详情';
                this.dialogData1 = this.checkedData.slice(0,1)
                this.dialogData2 = this.checkedData.slice(1)
            },
            configSet:function(){
                if(this.checkStatus){
                    console.log(this.checkStatus)
                    this.isDialogTable = false;
                    this.dialogVisible = true;
                    this.dialogTitle = '配置指导';
                }else{
                    this.$message({message:"未进行检查!",type:'warning'})
                }
            },
            dialogTable:function(){
            }
		},
		mounted: function(){
		    this.$loading();
            var _this = this;
            /*请求下拉框数据*/
            /*获取总数据*/
            /*$.get('/backbone/api/v1/passive/line_info/',function(res){
                if(res.code == 200){
                    this.$loading().close();
                   this.allData = data;
                }else{
                    this.$loading().close();
                    this.$message({message:res.info,type:'warning'});
                }
            },"json");*/
            setTimeout(function(){
                let data = {
                    "1": {
                        "北京": {
                            "hh": {
                                "branch": "北京",
                                "dcdevice": "A_HHA02_WAN_AR01",
                                "dcport": "G0/0/1/7",
                                "dcip": "11.14.1.1/30",
                                "brport": "G0/1/0",
                                "brip": "11.14.1.2/30",
                                "brdevice": "A_BJA02_WAN_AR01",
                                "as": 65111.0
                            },
                            "zz": {
                                "branch": "北京",
                                "dcdevice": "A_ZZA02_WAN_AR01",
                                "dcport": "ATM0/2/0/0.511",
                                "dcip": "11.46.5.1/30",
                                "brport": "ATM1/1/0.500",
                                "brip": "11.46.5.2/30",
                                "brdevice": "A_BJA02_WAN_AR02",
                                "as": 65111.0
                            }
                        },
                        "天津": {
                            "hh": {
                                "branch": "天津",
                                "dcdevice": "A_HHA02_WAN_AR01",
                                "dcport": "ATM0/2/0/0.112",
                                "dcip": "11.14.1.5/30",
                                "brport": "ATM0/1/0.100",
                                "brip": "11.14.1.6/30",
                                "brdevice": "A_TJA02_WAN_AR01",
                                "as": 65112.0
                            },
                            "zz": {
                                "branch": "天津",
                                "dcdevice": "A_ZZA02_WAN_AR01",
                                "dcport": "ATM0/2/0/0.512",
                                "dcip": "11.46.5.5/30",
                                "brport": "ATM0/1/0.500",
                                "brip": "11.46.5.6/30",
                                "brdevice": "A_TJA02_WAN_AR02",
                                "as": 65112.0
                            }
                        }
                  },
                      "2": {
                            "武汉": {
                                "hh": {
                                    "branch": "北京",
                                    "dcdevice": "A_HHA02_WAN_AR01",
                                    "dcport": "G0/0/1/7",
                                    "dcip": "11.14.1.1/30",
                                    "brport": "G0/1/0",
                                    "brip": "11.14.1.2/30",
                                    "brdevice": "A_BJA02_WAN_AR01",
                                    "as": 65111.0
                                },
                                "zz": {
                                    "branch": "北京",
                                    "dcdevice": "A_ZZA02_WAN_AR01",
                                    "dcport": "ATM0/2/0/0.511",
                                    "dcip": "11.46.5.1/30",
                                    "brport": "ATM1/1/0.500",
                                    "brip": "11.46.5.2/30",
                                    "brdevice": "A_BJA02_WAN_AR02",
                                    "as": 65111.0
                                }
                            },
                            "上海": {
                                "hh": {
                                    "branch": "天津",
                                    "dcdevice": "A_HHA02_WAN_AR01",
                                    "dcport": "ATM0/2/0/0.112",
                                    "dcip": "11.14.1.5/30",
                                    "brport": "ATM0/1/0.100",
                                    "brip": "11.14.1.6/30",
                                    "brdevice": "A_TJA02_WAN_AR01",
                                    "as": 65112.0
                                },
                                "zz": {
                                    "branch": "天津",
                                    "dcdevice": "A_ZZA02_WAN_AR01",
                                    "dcport": "ATM0/2/0/0.512",
                                    "dcip": "11.46.5.5/30",
                                    "brport": "ATM0/1/0.500",
                                    "brip": "11.46.5.6/30",
                                    "brdevice": "A_TJA02_WAN_AR02",
                                    "as": 65112.0
                                }
                            }
                        }
                }
                _this.allData = data;
                _this.$loading().close();
            },1000)
		},
		computed:{
            inputData:function(){
                var arr = [];
                if(this.allData[this.radio]){
                    for(var key in this.allData[this.radio]){
                        var obj = {value:key};
                        arr.push(obj);
                    }
                }
                return arr;
            },
            tableShow:function(){
                return this.tableData;
            }
		}
	});
})