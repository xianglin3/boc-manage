$(document).ready(function(){
    var dom = document.getElementById("tree");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    myChart.showLoading();
    var data4 = {"info":"","code":200,"data":{"children":[{"children":[{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_cer_hsh_vs\n118.228.159.151:443 ratio:  1 enabled","children":[{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnetc-ssl-Cernet 10443\ncurConn: 0 True","children":[{"name":"26.120.10.172:0 user-down"},{"name":"26.120.28.17:0 up"},{"name":"26.120.10.171:0 user-down"},{"name":"26.120.28.18:0 up"},{"name":"26.120.28.19:0 up"},{"name":"26.120.28.16:0 up"}]},{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnet-ssl-Cernet 443\ncurConn: 467 True","children":[{"name":"26.120.10.42:0 user-down"},{"name":"26.120.10.43:0 user-down"},{"name":"26.120.10.41:0 user-down"},{"name":"26.120.26.28:0 up"},{"name":"26.120.26.30:0 up"},{"name":"26.120.26.29:0 up"},{"name":"26.120.26.31:0 up"},{"name":"26.120.3.97:0 user-down"},{"name":"26.120.3.96:0 user-down"}]}]}],"name":"pool_ebsnew.boc.cn_cer_ratio"},{"children":[{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_cuc_zj_vs\n112.64.122.151:443 ratio:  1 enabled","children":[]},{"itemStyle":{"color":"red"},"name":"ebsnew_boc_cn_xd_cuc_vs\n202.99.10.174:443 ratio:  1 disabled-by-parent","children":[]},{"itemStyle":{"color":"red"},"name":"ebs_boc_cn_cuc_hsh_vs3\n123.124.191.96:443 ratio:  1 disabled-by-parent","children":[{"itemStyle":{"color":"green"},"name":"vip-ebs-bocnet-ssl-CUC-bak2 443\ncurConn: 0 True","children":[{"name":"26.120.26.16:0 up"},{"name":"26.120.26.17:0 up"},{"name":"26.120.3.118:0 user-down"},{"name":"26.120.10.12:0 user-down"},{"name":"26.120.26.19:0 up"},{"name":"26.120.3.108:0 user-down"},{"name":"26.120.10.13:0 user-down"},{"name":"26.120.26.18:0 up"},{"name":"26.120.10.11:0 user-down"}]},{"itemStyle":{"color":"red"},"name":"vip-ca-bocnet-ssl-CUC-bak2 442\ncurConn: 0 True","children":[]},{"itemStyle":{"color":"green"},"name":"vip-pay-bocnet-ssl-CUC-bak2 441\ncurConn: 1 True","children":[{"name":"26.120.10.18:0 user-down"},{"name":"26.120.26.21:0 up"},{"name":"26.120.3.110:0 user-down"},{"name":"26.120.26.20:0 up"},{"name":"26.120.26.22:0 up"},{"name":"26.120.10.17:0 user-down"},{"name":"26.120.26.23:0 up"},{"name":"26.120.10.19:0 user-down"},{"name":"26.120.3.120:0 user-down"}]}]},{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_xd_cuc_vs2\n202.99.10.40:443 ratio:  1 enabled","children":[]},{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_cuc_hsh_vs\n123.124.191.151:443 ratio:  1 enabled","children":[{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnetc-ssl-CNC 10443\ncurConn: 17 True","children":[{"name":"26.120.10.172:0 user-down"},{"name":"26.120.28.17:0 up"},{"name":"26.120.10.171:0 user-down"},{"name":"26.120.28.18:0 up"},{"name":"26.120.28.19:0 up"},{"name":"26.120.28.16:0 up"}]},{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnet-ssl-CUC 443\ncurConn: 26004 True","children":[{"name":"26.120.10.42:0 user-down"},{"name":"26.120.10.43:0 user-down"},{"name":"26.120.10.41:0 user-down"},{"name":"26.120.26.28:0 up"},{"name":"26.120.26.30:0 up"},{"name":"26.120.26.29:0 up"},{"name":"26.120.26.31:0 up"},{"name":"26.120.3.97:0 user-down"},{"name":"26.120.3.96:0 user-down"}]}]}],"name":"pool_ebsnew.boc.cn_cuc_ratio"},{"children":[{"itemStyle":{"color":"red"},"name":"ebsnew_boc_cn_ctc1_zj_vs\n180.167.159.151:443 ratio:  1 disabled","children":[]},{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_xd_ctc_vs2\n219.141.226.40:443 ratio:  1 enabled","children":[]},{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_ctc_hsh_vs\n219.141.191.151:443 ratio:  1 enabled","children":[{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnetc-ssl-CTC 10443\ncurConn: 47 True","children":[{"name":"26.120.10.172:0 user-down"},{"name":"26.120.28.17:0 up"},{"name":"26.120.10.171:0 user-down"},{"name":"26.120.28.18:0 up"},{"name":"26.120.28.19:0 up"},{"name":"26.120.28.16:0 up"}]},{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnet-ssl-CTC 443\ncurConn: 60103 True","children":[{"name":"26.120.10.42:0 user-down"},{"name":"26.120.10.43:0 user-down"},{"name":"26.120.10.41:0 user-down"},{"name":"26.120.26.28:0 up"},{"name":"26.120.26.30:0 up"},{"name":"26.120.26.29:0 up"},{"name":"26.120.26.31:0 up"},{"name":"26.120.3.97:0 user-down"},{"name":"26.120.3.96:0 user-down"}]}]},{"itemStyle":{"color":"red"},"name":"ebsnew_boc_cn_xd_ctc_vs\n219.141.226.174:443 ratio:  1 disabled-by-parent","children":[]},{"itemStyle":{"color":"red"},"name":"ebs_boc_cn_ctc_hsh_vs3\n219.141.191.96:443 ratio:  1 disabled-by-parent","children":[{"itemStyle":{"color":"green"},"name":"vip-pay-bocnet-ssl-CTC-bak2 441\ncurConn: 0 True","children":[{"name":"26.120.10.18:0 user-down"},{"name":"26.120.26.21:0 up"},{"name":"26.120.3.110:0 user-down"},{"name":"26.120.26.20:0 up"},{"name":"26.120.26.22:0 up"},{"name":"26.120.10.17:0 user-down"},{"name":"26.120.26.23:0 up"},{"name":"26.120.10.19:0 user-down"},{"name":"26.120.3.120:0 user-down"}]},{"itemStyle":{"color":"green"},"name":"vip-ebs-bocnet-ssl-CTC-bak2 443\ncurConn: 0 True","children":[{"name":"26.120.26.16:0 up"},{"name":"26.120.26.17:0 up"},{"name":"26.120.3.118:0 user-down"},{"name":"26.120.10.12:0 user-down"},{"name":"26.120.26.19:0 up"},{"name":"26.120.3.108:0 user-down"},{"name":"26.120.10.13:0 user-down"},{"name":"26.120.26.18:0 up"},{"name":"26.120.10.11:0 user-down"}]},{"itemStyle":{"color":"red"},"name":"vip-ca-bocnet-ssl-CTC-bak2 442\ncurConn: 0 True","children":[]}]},{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_ctc_zj_vs\n124.74.250.151:443 ratio:  1 enabled","children":[]},{"itemStyle":{"color":"red"},"name":"ebsnew_boc_cn_ctc1_hsh_vs\n1.202.135.151:443 ratio:  1 disabled","children":[{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnetc-ssl-CTC1 10443\ncurConn: 0 True","children":[{"name":"26.120.10.172:0 user-down"},{"name":"26.120.28.17:0 up"},{"name":"26.120.10.171:0 user-down"},{"name":"26.120.28.18:0 up"},{"name":"26.120.28.19:0 up"},{"name":"26.120.28.16:0 up"}]},{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnet-ssl-CTC1 443\ncurConn: 0 True","children":[{"name":"26.120.10.42:0 user-down"},{"name":"26.120.10.43:0 user-down"},{"name":"26.120.10.41:0 user-down"},{"name":"26.120.26.28:0 up"},{"name":"26.120.26.30:0 up"},{"name":"26.120.26.29:0 up"},{"name":"26.120.26.31:0 up"},{"name":"26.120.3.97:0 user-down"},{"name":"26.120.3.96:0 user-down"}]}]}],"name":"pool_ebsnew.boc.cn_ctc_ratio"},{"children":[{"itemStyle":{"color":"green"},"name":"ebsnew_boc_cn_cmc_hsh_vs\n39.155.236.151:443 ratio:  1 enabled","children":[{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnetc-ssl-CMC 10443\ncurConn: 0 True","children":[{"name":"26.120.10.42:0 user-down"},{"name":"26.120.10.43:0 user-down"},{"name":"26.120.10.41:0 user-down"},{"name":"26.120.26.28:0 up"},{"name":"26.120.26.30:0 up"},{"name":"26.120.26.29:0 up"},{"name":"26.120.26.31:0 up"},{"name":"26.120.3.97:0 user-down"},{"name":"26.120.3.96:0 user-down"}]},{"itemStyle":{"color":"green"},"name":"vip-ebsnew-bocnet-ssl-CMC 443\ncurConn: 84367 True","children":[{"name":"26.120.10.42:0 user-down"},{"name":"26.120.10.43:0 user-down"},{"name":"26.120.10.41:0 user-down"},{"name":"26.120.26.28:0 up"},{"name":"26.120.26.30:0 up"},{"name":"26.120.26.29:0 up"},{"name":"26.120.26.31:0 up"},{"name":"26.120.3.97:0 user-down"},{"name":"26.120.3.96:0 user-down"}]}]}],"name":"pool_ebsnew.boc.cn_cmc_ratio"}],"name":"ebsnew.boc.cn"}}
//    setHeight();
    $.get('/url/',function(res){
        myChart.setOption(option = {
            tooltip: {
                show:false,
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function(data){
                    console.log(data);
                }
            },
            series:[
                {
                    type: 'tree',

                    name: 'tree1',

                    data: [res.data],

                    top: '5%',
                    left: '7%',
                    bottom: '2%',
                    right: '25%',

                    symbolSize: 25,
                    symbol:'circle',
                    initialTreeDepth:3,

                    label: {
                        normal: {
                            position: 'bottom',
                            verticalAlign: 'middle',
                            align: 'left',
    //                        borderColor:'#ccc',
    //                        borderWidth:1,
    //                        padding:5,
                            fontSize:20,
                            offset:[20,-20]
                        },
                    },

                    leaves: {
                        label: {
                            normal: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left',
                                offset:0,
                                borderWidth:0
                            }
                        }
                    },

                    expandAndCollapse: true,

                    animationDuration: 550,
                    animationDurationUpdate: 750

                }
            ]
        });
    },"json");
    setTimeout(function(){
        myChart.hideLoading();
        myChart.setOption(option = {
            tooltip: {
                show:false,
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function(data){
                    console.log(data);
                }
            },
            series:[
                {
                    type: 'tree',

                    name: 'tree1',

                    data: [data4.data],

                    top: '5%',
                    left: '2%',
                    bottom: '2%',
                    right: '18%',

                    symbolSize: 25,
                    symbol:'circle',
                    initialTreeDepth:3,

                    label: {
                        normal: {
                            position: 'bottom',
                            verticalAlign: 'middle',
                            align: 'left',
                            fontSize:12,
                            offset:[20,-20]
                        },
                    },

                    leaves: {
                        label: {
                            normal: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left',
                                offset:0,
                                borderWidth:0
                            }
                        }
                    },

                    expandAndCollapse: true,

                    animationDuration: 550,
                    animationDurationUpdate: 750

                }
            ]
        });
        setHeight();
    },1000)
     myChart.on("click", clickFun);
     function clickFun(param) {
        if (typeof param.seriesIndex == 'undefined') {
            return;
        }
        if (param.type == 'click') {
//            alert(param.name);
            if(param.name.indexOf('curConn') == '-1'){
                setHeight();
            }
        }
    }
    function setHeight(){
         var allNode=0;
        var nodes=myChart._chartsViews[0]._data._graphicEls;
        for(var i=0,count =nodes.length;i<count;i++){
            var node=nodes[i];
            if(node===undefined)
            continue;
            allNode++;
        }
         var height=window.innerHeight;
         console.log(height,allNode);
        var currentHeight=45*allNode;
        console.log(currentHeight);
        var newWidth=Math.max(currentHeight,height);
        console.log(newWidth);
//        dom.style.width = window.innerWidth + 'px';
        dom.style.height = newWidth + 'px';
        myChart.resize();
    }


	var vm = new Vue({
		el:'#treeEcharts',
		data:{
		    fullscreenLoading: false,
            checkInput:'',
            restaurants: [],
            casData: [{
              value: 'bb.cn',
              label: 'bb.cn',
              children: [{
                value: 'aa.bb.cn',
                label: 'aa.bb.cn',
              }, {
                value: 'c.bb.cn',
                label: 'c.bb.cn'
              }, {
                value: 'd.bb.cn',
                label: 'd.bb.cn'
              }]
            }]
		},
        methods:{
            changeVal:function(val){
                console.log(val)
            },
            drawEchart:function(){
                /*dom = document.getElementById("tree");
                myChart = echarts.init(dom);
                var option = null;
                myChart.on("click", clickFun);
                var url = '/f5tool/service/domainName/' + this.checkInput;
                if(this.checkInput !== ''){
                    myChart.showLoading();
                    $.get(url,function(res){
                        console.log(res);
                        myChart.hideLoading();
                        myChart.setOption(option = {
                            tooltip: {
                                show:false,
                                trigger: 'item',
                                triggerOn: 'mousemove',
                            },
                            series:[
                                {
                                    type: 'tree',
                                    name: 'tree1',
                                    data: [res.data],
                                    top: '5%',
                                    left: '2%',
                                    bottom: '2%',
                                    right: '18%',
                                    symbolSize: 12,
                                    symbol:'circle',
                                    initialTreeDepth:3,
                                    label: {
                                        normal: {
                                            position: 'bottom',
                                            verticalAlign: 'middle',
                                            align: 'left',
                    //                        borderColor:'#ccc',
                    //                        borderWidth:1,
                    //                        padding:5,
                                            fontSize:12,
                                            offset:[20,-20]
                                        },
                                    },
                                    leaves: {
                                        label: {
                                            normal: {
                                                position: 'right',
                                                verticalAlign: 'middle',
                                                align: 'left',
                                                offset:0,
                                                borderWidth:0
                                            }
                                        }
                                    },
                                    expandAndCollapse: true,
                                    animationDuration: 550,
                                    animationDurationUpdate: 750

                                }
                            ]
                        },true);
                        setHeight();
                    },"json");
                }else{
                    this.$message({message:'请输入域名',type:'warning'});
                }*/
            },
            querySearch:function(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter:function(queryString) {
                return (restaurant) => {
                    return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
                };
            },
            init:function() {
                var _this = this;
                // setTimeout(function(){
                //     _this.restaurants = [{value:'1.1.1.1',key:'hello'},{value:'1.2.1.1',key:'hello'},{value:'2.1.1.1',key:'hello'},{value:'2.2.1.1',key:'hello'},]
                // },1000);

                $.get('/f5tool/domainNames/',function(res){
                    var arr = [];
                    for(var i = 0;i<res.data.length;i++){
                        var obj = {};
                        obj.value = res.data[i];
                        arr.push(obj);
                    }
                    _this.restaurants = arr;
                },'json');
            },
            handleSelect:function(item) {
                // console.log(item);
            },
            upDate:function(){
                var _this = this;
//                this.fullscreenLoading = true;
                console.log(document.getElementById('textarea').innerText)
                console.log($('#textVal').val())

               /* setTimeout(() => {
                    this.fullscreenLoading = false;
                    this.$message({message:'更新成功',type:'success'});
                }, 3000);*/
            }
        },
        mounted:function(){
//		    this.init();
		}
	})
});