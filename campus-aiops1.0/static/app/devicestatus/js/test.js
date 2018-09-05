$(document).ready(function () {

    var show_data = {output:'gogogog '};
    Vue.component("fw-show-component", {
        template: '<pre>{{output}}</pre>',
        data:function () {
            return show_data;
        }
    })

    new Vue({
        el: '#root',
            data: {
                fw_show_contents : {
                    'master': [{'command': '请选择设备11', 'output': '1111', 'href_id': 'master_show_output1'},
                        {'command': '请选择设备12', 'output': '请先选择主防火墙222222', 'href_id': 'master_show_output2'}],
                    'backup': [{'command': '请选择设备21', 'output': 'gogogogog', 'href_id': 'master_show_output1'},
                        {'command': '请选择设备22', 'output': '请先选择主防火墙2', 'href_id': 'master_show_output2'}]
                },
            },
        methods: {
            change_show_content: function (type,index) {
                show_data.output = this.fw_show_contents[type][index].output;
            }
        }
    });
});
