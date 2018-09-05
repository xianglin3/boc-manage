/**
 * Created by wxt on 2017/7/19.
 */
$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            message: '无论是解封还是封堵IP，在使用前点击更新黑名单数据库，保证配置准确'

        }
    });
    var memusApp = new Vue({
        el: '#menus2user',
        data: {
            menus: [
                {name: '封堵IP',url:'/fwconf/juniper_fw/add_ip/',
                    desc:'可根据设备已有黑名单现状自动生成封堵IP（可填多个，无上限）的配置（读取最新黑名单的名称，自动计算新黑名单名称，已封堵IP不会重复生成'},
                {name: '解封IP',url:'/fwconf/juniper_fw/remove_ip/',
                    desc:'可根据设备已有黑名单现状自动生成解封IP（可填多个，无上限）的配置（去已有配置里查找，找到后解封，不需要解封的I也会提示）'},
                {name: '更新黑名单数据库',url:'/device_switch/update_fw_blacklist',
                    desc:'自动抓取黑名单配置，更新黑名单成员数据库，建议每次封堵IP及解封IP前点击此处，更新数据库，保证配置准确'},
                {name: '封堵IP(旧版本)',url:'/littletools/',
                    desc:'如果数次更新黑名单均失败，可以考虑使用旧版的封堵IP'}
            ]
        }
    })
});