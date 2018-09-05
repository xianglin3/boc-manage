$(document).ready(function(){
	var vm = new Vue({
		el:'#logAnalysis',
		data:{
		    tableData:[
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                test:'1.1.1.1..11.1.1.1.11..1.111.1.1.1.11..1.111.1.1.1.11..1.111.1.1',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning1:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning2:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning3:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning4:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning5:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning6:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"',
		                warning7:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		        {
		            date:'2018-09-03',
		            source:{
		                message:'helloworldfree',
		                path:'a/b/c/d/e/f',
		                warning:'"\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95\\x95"'
		            }
		        },
		    ],
		    tableLoading:false,
		    lazLoad:true,
		    sort:'order',
		    searchVal:''
		},
		methods:{
		    /*初始化数据及图表*/
            init:function(){
                var eChart = echarts.init(document.getElementById('echart'));
                var option = {
                        title: {
                            text: '日志分析柱状图',
                            x:'center',
                            bottom:'0',
                            textStyle:{
                                color:'#666',
                                fontSize:'14px'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '12%',
                            top:'5%',
                            containLabel: true
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b} : {c}"
                        },
                        xAxis: {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: [120, 200, 150, 80, 70, 110, 130, 200, 150, 80, 70, 110, 130, 200, 150, 80, 70, 110, 130, 200, 150, 80, 70, 110, 130, 200, 150, 80, 70, 110, 130, 200, 150, 80, 70, 110, 130],
                            type: 'bar'
                        }],
                        color:['#409eff']
                };
                eChart.setOption(option);
            },
            /*显示所有数据*/
            showAll:function(ev){
                var ic = $(ev.target).attr('class');
                if(ic == 'el-icon-caret-right'){
                    $(ev.target).attr('class','el-icon-caret-bottom');
                    $(ev.target.parentNode.parentNode).attr('class','activeShow');
                }else{
                    $(ev.target).attr('class','el-icon-caret-right');
                    $(ev.target.parentNode.parentNode).removeAttr('class');
                }
            },
            /*时间排序*/
            sortData:function(){
                if(this.sort == 'order'){
                    this.sort = 'sequence';
                }else{
                    this.sort = 'order'
                }
                console.log(this.sort);
            },
            /*懒加载*/
            handleScroll:function () {
              var bodyHeight = document.body.scrollHeight;
              var cliHeight = document.documentElement.clientHeight;
              var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
              var hideHeight = bodyHeight - cliHeight - scrollTop;
              if(hideHeight == 0){
                  if(this.tableData.length < 40){
                      var _this = this;
                      if(this.lazLoad){
                          this.lazLoad = false;
                          this.tableLoading = true;
                          setTimeout(function(){
                            var arr = [{},{},{},{}]
                            if(arr[0]){
                                _this.tableData = _this.tableData.concat(arr);
                            }else{
                                _this.$message({message:'数据已加载完!',type:'success'});
                            }
                            _this.tableLoading = false;
                            _this.lazLoad = true;
                          },1000)
                      }
                  }
              }
              /*console.log('可见区域高度:',document.documentElement.clientHeight)
              console.log('全文高度:',document.body.scrollHeight)
              console.log('上面被遮住的高度:',scrollTop)
              console.log('下面被遮住的高度',document.body.scrollHeight - (document.documentElement.clientHeight + scrollTop))*/
            },
            /*查询*/
            search:function(){
                console.log(this.searchVal)
            },
		    getSource:function(val){
		        var str = '';
		        for(var key in val){
		            str+='<i>'+key+':</i>'+'<span>'+val[key]+'</span>';
		        }
		        return str;
		        console.log(str)
		    }
		},
		mounted: function(){
		    this.init();
		    this.tableLoading = false;
		    window.addEventListener('scroll', this.handleScroll)
		},
		computed:{
            showTable:function(){
                return this.tableData;
            }
		},
		filters:{
		    /*getSource:function(val){
		        console.log(val)
		        var str = '';
		        for(var key in val){
		            str+='<i>'+key+'</i>'+val[key];
		        }
		        return str;
		        console.log(str)
		    }*/
		}
	});
})