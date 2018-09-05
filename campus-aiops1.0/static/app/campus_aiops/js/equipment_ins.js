$(document).ready(function(){
//vue数据渲染和事件方法
	var vm = new Vue({
		el:'#equipment',
		data:{
		    checkIp:'',
		    dialogVisible:false,
		    dialogTitle:'',
            dataList:[],
            dialogList:'',
            icons:['orther','interface','banqia','port','cpu','module','logging']
		},
		methods:{
            init:function(){
                this.dataList = [
                {
                    status:'yes',
                    log:'ksjkgjksg',
                    name:'cpu-lalal',
                    title:'CPU',
                    check_rule:'klsjlgksdkjg',
                    result:'everyis\nkkslkjgg\nklskkjgjksdglg\nlksjkdgjlkjsldkjgk\nslkdjglksjdglj lskdjgl\nksd'
                },
                {
                    status:'no',
                    log:'ksjkgjksg',
                    name:'banqia-ddd',
                    title:'板卡',
                    check_rule:'klsjlgksdkjg',
                    result:'every is ok'
                },
                {
                    status:'no',
                    log:'ksjkgjksg',
                    name:'port1',
                    title:'portchannel',
                    check_rule:'klsjlgksdkjg',
                    result:'every is ok'
                },
                {
                    status:'yes',
                    log:'ksjkgjksg',
                    name:'port',
                    title:'端口',
                    check_rule:'klsjlgksdkjg',
                    result:'every is ok'
                },
                {
                    status:'yes',
                    log:'ksjkgjksg',
                    name:'module-info',
                    title:'光模块',
                    check_rule:'klsjlgksdkjg',
                    result:'every is ok'
                },
                {
                    status:'no',
                    log:'ksjkgjksg',
                    name:'logging-sdkgfk',
                    title:'logging',
                    check_rule:'klsjlgksdkjg',
                    result:'every is ok'
                }]
            },
            openDialog:function(data,title){
                this.dialogVisible = true;
                this.dialogList = data;
                this.dialogTitle = title;
            },
            check:function(){
                console.log(this.checkIp);
                this.$loading();
                this.init();
                this.$loading().close();
            },
            filterIcon:function(val){
                this.icons.forEach(function(item){
                    console.log(val.indexOf(item))
                    if(val.indexOf(item) != -1){
                        return 'hell world'
                    }
                })
            }
		},
		mounted:function(){
//            this.init();
		},
		computed:{
            filterIcon:function(val){
                console.log(val)
                /*this.icons.forEach(function(item){
                    if(val.indexOf(item) != -1){
                        return item;
                    }
                })*/
            }
		}
	})
})