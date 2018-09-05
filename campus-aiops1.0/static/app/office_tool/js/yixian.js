/**
 * Created by wxt on 2017/7/19.
 */
$(document).ready(function () {
    var app = new Vue({
        el: '#appInfo',
        data: {
            message:'一线常用工具集，用于处理一线运维可能遇到的问题，欢迎使用',

        }
    });
    var memusApp = new Vue({
        el: '#menus2user',
        data: {
            menus: [
                {name: '命名行信息实时采集',url:'/cli_realtime/',target:'',desc:'命名行信息实时采集,注意非AAA设备的用户名密码填写'},
                {name: '运维库',url:'http://22.122.18.192:9988/assets/',target:'_blank',desc:'运维数据库by天时'},
                {name: 'CMCS',url:'https://22.122.32.128:8001/nccmweb/#initial',target:'_blank',desc:'CMCSby思科'},
                {name: '防火墙配置生成工具',url:'http://22.1.111.29:8002/web/login?redirect=http%3A%2F%2F22.1.111.29%3A8002%2Fweb%3F',target:'_blank',desc:'防火墙配置生成工具by李融，账号密码适事宜请联系开发者'},
                {name: '园区端口查询',url:'/portconfiger/campus_interfaces_info/',target:'',desc:'注意，适用于园区的端口信息查询'},
                {name: 'WWN查询',url:'/san/search_wwn/',target:'',desc:'wwn查询定位，点完后看看左侧，san的相关查询都在那里'},
                {name: '阻断攻击相关工具',url:'/fwconf/juniper_fw/',target:'',desc:'IP阻断、解封，实时更新黑名单数据库，生成配置完全自动化'},
                {name: '访问控制点查询',url:'/fwconf/search/',target:'',desc:'填写源、目的地址，一键定位访问控制点设备,每日更新'},
                {name: '接入资源信息发布',url:'/device_switch/device_data/',target:'',desc:'资源发布，每日更新，如发现有设备未添加请联系开发者'},
                {name: '配置下发工具',url:'/CMCS_Tool/index/',target:'',desc:'文本、Excel两种导入方式，均推送到CMCS草稿任务'},
                {name: '团队门户by运营平台研发',url:'http://oa-dc.bocsys.cn/teams/wltx/SitePages/%E4%B8%BB%E9%A1%B5.aspx',target:'_blank',desc:'团队门户，通知、任务、会议等信息'},
                {name: '一线笔记OneNote',url:'http://oa-dc.bocsys.cn/teams/wltx/_layouts/15/WopiFrame.aspx?sourcedoc=/teams/wltx/DocLib/%E5%9B%A2%E9%98%9F%E7%AC%94%E8%AE%B0%EF%BC%88%E7%BD%91%E7%BB%9C%EF%BC%89/%E3%80%9001%E3%80%91%E4%B8%80%E7%BA%BF%E5%80%BC%E7%8F%AD.one&action=default',target:'_blank',desc:'团队笔记，一线值班，必看'},
                {name: '办公FTP',url:'ftp://22.122.32.88/',target:'_blank',desc:'办公环境FTPby总控，ftp://22.122.32.88/'},
                {name: '生产FTP',url:'ftp://21.122.49.88/',target:'_blank',desc:'生产环境FTPby总控，ftp://21.122.49.88/'},
                {name: '团队FTP',url:'ftp://21.122.17.165/',target:'_blank',desc:'团队专用FTP，限于软件、设备配置备份，ftp://21.122.17.165/'},
                ]
        }
    })
});