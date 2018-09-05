$(document).ready(function(){
	var vm = new Vue({
		el:'#refresh',
		data:{
			loading:false
		},
		methods:{
			/*手动EAD信息更新*/
			eadRe(){
                this.$confirm('【该操作每天13:15自动执行】手动同步EAD信息更新用时较长,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.loading = true;
                    $.post('/campus_aiops/ead_info_update/',function(text){
                    	vm.loading = false;
                        vm.$message({showClose: true,duration: 0,message: 'EAD信息更新完成',type: 'success'});
                    })
                }).catch(() => {
                    vm.$message({
                    type: 'info',
                    message: '已取消信息更新'
                    });
                });
			},
			/*手动园区端口信息更新*/
			allPortRe(){
                this.$confirm('【该操作每天13:30自动执行】手动同步园区端口信息更新用时较长,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.loading = true;
                    $.post('/campus_aiops/update_all_ports_info/',function(text){
                    	vm.loading = false;
                        vm.$message({showClose: true,duration: 0,message: '园区端口信息更新完成',type: 'success'});
                    })
                }).catch(() => {
                    vm.$message({
                    type: 'info',
                    message: '已取消信息更新'
                    });
                });
			},
			/*手动园区只能运维信息同步*/
			portRe(){
                this.$confirm('【该操作每天14:00自动执行】园区智能运维信息同步需要最后进行,且手动同步用时较长,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.loading = true;
                    $.post('/campus_aiops/port_status_update/',function(text){
                    	vm.loading = false;
                        if(text.indexOf('成功') !== -1){
                            vm.$message({showClose: true,duration: 0,message: text,type: 'success'});
                        }else{
                            vm.$message({showClose: true,duration: 0,message: text,type: 'error'});
                        }
                    })
                }).catch(() => {
                    vm.$message({
                    type: 'info',
                    message: '已取消信息同步'
                    });          
                });
			}
		},
		mounted: function(){

		},
		filters:{
			
		}
	});
})