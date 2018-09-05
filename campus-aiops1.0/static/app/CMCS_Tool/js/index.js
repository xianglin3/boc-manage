/**
 * Created by wxt on 2017/7/19.
 */
$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            message: '' +
            '可以通过CMCS及并行任务配置下发平台推送配置。' +
            '其中通过CMCS的任务均推送到CMCS的管理——》NCCM服务器管理——》任务管理——》草稿任务管理',
            downloadUrl: 'http://22.1.111.29:8090/%C4%A3%B0%E5%CF%C2%D4%D8/CMCS%CD%C6%CB%CD/'

        }
    });
});