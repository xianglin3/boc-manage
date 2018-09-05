/**
 * Created by nantian on 2017/2/23.
 */
$(document).ready(function () {
    var ipspace_info = new Vue({
        el: '#ipspace_info',
        data: {
            ipspace_list: [],
            selected: ''
        },
        methods: {
            checkIP: function () {
                var ip_regex = new RegExp(/^(\d{1,3}\.{1}){3}\d{1,3}$/);
                if (ip_regex.test($('#id_network_address').val())){
                }else{
                    $('#id_network_address').val("");
                    alert("网络号不符合规范，请重新填写");
                }
            },

        }
    });
});