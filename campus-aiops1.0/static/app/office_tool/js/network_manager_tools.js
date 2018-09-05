/**
 * Created by wxt on 2017/7/19.
 */
$(document).ready(function () {

    var nmctListApp = new Vue({
        el: '#nmct_list',
        data: {
            nmcts: [
                {name: '新疆分行', url: 'http://21.80.132.181:8070/NMCT/'},
                {name: '陕西分行', url: 'http://21.64.63.200:8070/NMCT/'},
                {name: '甘肃分行', url: 'http://21.68.6.66:8070/NMCT/'},
                {name: '青海分行', url: 'http://21.72.1.87:8070/NMCT/'},
                {name: '宁夏分行', url: 'http://21.76.3.252:8070/NMCT/'},
                {name: '安徽分行', url: 'http://21.216.125.24:8070/NMCT/'},
                {name: '江西分行', url: 'http://21.220.133.60:8070/NMCT/'},
                {name: '黑龙江分行', url: 'http://21.44.7.70:8070/NMCT/'},
                {name: '吉林分行', url: 'http://21.40.1.200:8070/NMCT/'},
                {name: '内蒙古分行', url: 'http://21.32.50.77:8070/NMCT/'},
                {name: '河北分行', url: 'http://21.24.3.102:8070/NMCT/'},
                {name: '福建分行', url: 'http://21.224.14.10:8070/NMCT/'},
                {name: '宁波分行', url: 'http://21.210.20.209:8070/NMCT/'},
                {name: '西藏分行', url: 'http://21.116.3.22:8070/NMCT/'},
                {name: '重庆分行', url: 'http://21.104.100.86:8070/NMCT/'},
                {name: '贵州分行', url: 'http://21.108.19.133:8070/NMCT/'},
                {name: '广东分行', url: 'http://21.136.86.184:8070/NMCT/'},
                {name: '深圳分行', url: 'http://21.144.220.221:8070/NMCT/'},
                {name: '湖南分行', url: 'http://21.148.1.242:8070/NMCT/'},
                {name: '广西分行', url: 'http://21.152.121.25:8070/NMCT/'},
                {name: '山东分行', url: 'http://21.48.121.253:8070/NMCT/'},
                {name: '山西分行', url: 'http://21.28.12.61:8070/NMCT/'},
                {name: '辽宁分行', url: 'http://21.36.6.24:8070/NMCT/'},
                {name: '天津分行', url: 'http://21.20.19.217:8070/NMCT/'},
                {name: '上海分行', url: 'http://21.196.82.220:8070/NMCT/'},
                {name: '苏州分行', url: 'http://21.164.12.70:8070/NMCT/'},
                {name: '湖北分行', url: 'http://21.160.99.83:8070/NMCT/'},
                {name: '海南分行', url: 'http://21.156.103.37:8070/NMCT/'},
                {name: '河南分行', url: 'http://21.56.8.168:8070/NMCT/'},
                {name: '江苏分行', url: 'http://21.200.229.150:8070/NMCT/'},
                {name: '浙江分行', url: 'http://21.208.90.20:8070/NMCT/'},
                {name: '四川分行', url: 'http://21.96.51.119:8070/NMCT/'},
                {name: '云南分行', url: 'http://21.112.4.23:8070/NMCT/'},
                {name: '北京分行1#', url: 'http://29.0.8.23:8070/NMCT'},
                {name: '北京分行2#', url: 'http://21.16.121.23:8070/NMCT'},


            ]
        }
    })
});