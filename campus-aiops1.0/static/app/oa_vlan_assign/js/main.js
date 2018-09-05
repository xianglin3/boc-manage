var app = new Vue({
	el:'#oa_vlan_assign_vlan',
	data:{
		message:'hello&nbsp;&nbsp;&nbsp;&nbsp;hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
		message2:'#这是一条天路'
	},
	methods:{
		doSomething:function(){
			this.message = 'test';
		}
	},
	computed:{
		sb:function(){
			return this.message;
		}
	},
	filters: {
    	capitalize: function (value) {
	      	if (!value) return ''
	      	value = value.toString()
    		console.log(value.length)
	      	return value+'      '
    	}
  	}
})