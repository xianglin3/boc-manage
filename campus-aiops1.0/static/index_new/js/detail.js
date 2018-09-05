$(document).ready(function(){
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
             context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }
    var devName = GetQueryString("devName");
    var vm = new Vue({
        el:'#detail',
        data:{
            message:'hello world!',
            tableData:[],
            options:{
               text:'加载中...'
            },
            loading:null
        },
        methods:{
            init:function(){
                var _this = this;
                /*请求该设备对应的设备警告信息*/
                this.tableData = [
       {
           "lasttime": "2018-07-03 06:47:49",
           "dev_name": "B-SAA2B-WAN-AR01",
           "summary": "22:47:47.8 B-SAA2B-WAN-AR01 %%01SSH/4/SSHS_IP_BLOCK_CLIENT(s):VS Admin-VS-CID 0x80930452;SSH client IP blocked due to authentication failure in last 1 hour. (IpAddress 21.122.17.175 VpnName _public_ BlockCount 6).#015",
           "node": "21.86.255.253",
           "area": "B-SA-WAN"
       },
       {
           "lasttime": "2018-07-03 07:47:49",
           "dev_name": "B-SAA2B-WAN-AR01",
           "summary": "23:47:47.9 B-SAA2B-WAN-AR01 %%01SSH/4/SSHS_IP_BLOCK_CLIENT(s):VS Admin-VS-CID 0x80930452;SSH client IP blocked due to authentication failure in last 1 hour. (IpAddress 21.122.17.175 VpnName _public_ BlockCount 6).#015",
           "node": "21.86.255.253",
           "area": "B-SA-WAN"
       },
       {
           "lasttime": "2018-07-03 08:47:49",
           "dev_name": "B-SAA2B-WAN-AR01",
           "summary": "00:47:48.2 B-SAA2B-WAN-AR01 %%01SSH/4/SSHS_IP_BLOCK_CLIENT(s):VS Admin-VS-CID 0x80930452;SSH client IP blocked due to authentication failure in last 1 hour. (IpAddress 21.122.17.175 VpnName _public_ BlockCount 6).#015",
           "node": "21.86.255.253",
           "area": "B-SA-WAN"
       },
       {
           "lasttime": "2018-07-03 08:47:49",
           "dev_name": "B-SAA2B-WAN-AR01",
           "summary": "00:47:48.2 B-SAA2B-WAN-AR01 %%01SSH/4/SSHS_IP_BLOCK_CLIENT(s):VS Admin-VS-CID 0x80930452;SSH client IP blocked due to authentication failure in last 1 hour. (IpAddress 21.122.17.175 VpnName _public_ BlockCount 6).#015",
           "node": "21.86.255.253",
           "area": "B-SA-WAN"
       },
       {
           "lasttime": "2018-07-03 08:47:49",
           "dev_name": "B-SAA2B-WAN-AR01",
           "summary": "00:47:48.2 B-SAA2B-WAN-AR01 %%01SSH/4/SSHS_IP_BLOCK_CLIENT(s):VS Admin-VS-CID 0x80930452;SSH client IP blocked due to authentication failure in last 1 hour. (IpAddress 21.122.17.175 VpnName _public_ BlockCount 6).#015",
           "node": "21.86.255.253",
           "area": "B-SA-WAN"
       },
       {
           "lasttime": "2018-07-03 08:47:49",
           "dev_name": "B-SAA2B-WAN-AR01",
           "summary": "00:47:48.2 B-SAA2B-WAN-AR01 %%01SSH/4/SSHS_IP_BLOCK_CLIENT(s):VS Admin-VS-CID 0x80930452;SSH client IP blocked due to authentication failure in last 1 hour. (IpAddress 21.122.17.175 VpnName _public_ BlockCount 6).#015",
           "node": "21.86.255.253",
           "area": "B-SA-WAN"
       }
   ]
                $.get('/index/v1/events/devices/summary/' + devName,function(result){
                    if(result.info == 'success'){
                        _this.tableData = result.data;
                        _this.loading.close();
                    }else{
                        //console.log(result.info);
                        _this.loading.close();
                    }
                });
            }
        },
        mounted:function(){
            this.init();
        },
        beforeMount:function(){
//            this.loading = this.$loading(this.options);
        }
    })
});