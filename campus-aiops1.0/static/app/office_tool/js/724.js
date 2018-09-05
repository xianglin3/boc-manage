/**
 * Created by wxt on 2017/7/19.
 */
$(document).ready(function () {
    var app = new Vue({
        el: '#appInfo',
        data: {
            message:'7*24常用工具集，用于处理7*24运维可能遇到的问题，欢迎使用,同祝尽量少用:）',

        }
    });
    var memusApp = new Vue({
        el: '#menus2user',
        data: {
            menus: [
                {name: '命令实时采集',url:'/cli_realtime/',
                    desc:'支持绝大部分设备，非3A设备请注意填写用户名密码，涉及外网地址的设备请勾选其平台'},
                {name: '阻断攻击相关工具',url:'/fwconf/juniper_fw/',
                    desc:'IP阻断、解封，实时更新黑名单数据库，生成配置完全自动化，啥都不用管哦~'},
                {name: '访问控制点查询',url:'/fwconf/search/',
                    desc:'查询源到目的的访问控制点,地址支持多样化书写'},
                {name: '防火墙状态分析',url:'/devicestatus/',
                    desc:'收集多条命令，实时查询分析防火墙运行状态（选择主，同时查询备机）'},
                {name: '外联VPN链路分析',url:'/vpnanalyzer/',
                    desc:'实时查询外联VPN的状态，并分析，同时针对某条线路可查询多次返回关键指标'},
                {name: '高等级事件查询处理',url:'/gaodengji/',
                    desc:'724必备工具，你懂得！'},
                {name: '应用接入定位查询',url:'/accessinfo_base/search_server/',
                    desc:'输入IP mac 或者端口描述可以快速定位交换机端口'},

                {name: '园区端口查询',url:'/portconfiger/campus_interfaces_info/',
                    desc:'注意，适用于园区的端口查询，区别于应用接入定位，mac arp配置，历史的，随意查询'},
                {name: 'WWN查询',url:'/san/search_wwn/',
                    desc:'wwn查询定位，点完后看看左侧，san的相关查询都在那里'},
                {name: '团队FTP',url:'ftp://21.122.17.165/',desc:'团队专用FTP，限于软件、设备配置备份，ftp://21.122.17.165/'},


            ]
        }
    })
});