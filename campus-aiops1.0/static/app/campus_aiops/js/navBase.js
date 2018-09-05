/*根据当前用户显示内容*/
// /UserManager/judge_group/
$.post('/UserManager/judge_group/',{group:"campus_administrator"},function(res){
	if(res == "success"){
		let element = "<li id='configAuto' role='presentation' class='dropdown'>"
					    +"<a class='dropdown-toggle' data-toggle='dropdown' href=''#'' role='button' aria-haspopup='true' aria-expanded='false'>配置自动化<span class='caret'></span></a>"
					    +"<ul class='dropdown-menu'>"
						    +"<li><a href='/CMCS_Tool/excel_push/' target='_blank'>CMCS批量任务自动创建</a></li>"
						    +"<li><a href='/cli_realtime/' target='_blank'>命令行实时采集</a></li>"
					    +"</ul>"
					  +"</li>";
		$(element).appendTo($('#nav'));
	}else{
		$('#configAuto').css('display','none');
		$('#comPres .nav-device').css('display','none');
		$('#infMan .nav-vlan').css('display','none');
		$('#infMan .nav-dev').css('display','none');
	}
});

/*面包屑设置*/
var pathname = this.location.pathname;
function breadcrumb(id,menu,path,title){
	$(id).addClass('active');
	$('.breadcrumb .menu a').text(menu).attr('href',path);
	$('.breadcrumb .active').text(title);
}
switch(pathname){
	case '/campus_aiops/':
		breadcrumb('#comPres','综合呈现','/campus_aiops/','总体图示');
		break;
	case '/campus_aiops/port_status_list/':
		breadcrumb('#comPres','综合呈现','/campus_aiops/','综合查询');
		break;
	case '/campus_aiops/auth_type_history_search/':
		breadcrumb('#comPres','综合呈现','/campus_aiops/','认证方式变更记录');
		break;
	case '/campus_aiops/device_data/':
		breadcrumb('#comPres','综合呈现','/campus_aiops/','接入资源发布');
		break;
	case '/campus_aiops/ip_list/':
		breadcrumb('#infMan','信息管理','/campus_aiops/ip_list/','白名单信息维护');
		break;
	case '/campus_aiops/vlan_list/':
		breadcrumb('#infMan','信息管理','/campus_aiops/ip_list/','VLAN信息维护');
		break;
	case '/campus_aiops/dev_list/':
		breadcrumb('#infMan','信息管理','/campus_aiops/ip_list/','园区设备信息维护');
		break;
	case '/campus_aiops/data_refresh/':
		breadcrumb('#infMan','信息管理','/campus_aiops/ip_list/','信息更细与同步');
		break;
	case '/campus_aiops/reference/':
		breadcrumb('#infMan','信息管理','/campus_aiops/ip_list/','参考文档与模块下载');
		break;
	case '/campus_aiops/links/':
		breadcrumb('#infMan','信息管理','/campus_aiops/ip_list/','友情链接');
		break;
	case '/campus_aiops/excel_push/':
		breadcrumb('#configAuto','配置自动化','/campus_aiops/excel_push/','CMCS批量任务自动创建');
		break;
	case '/campus_aiops/cli_realtime/':
		breadcrumb('#configAuto','配置自动化','/campus_aiops/excel_push/','命令行实时采集');
		break;
	case '/campus_aiops/portconfiger/':
		breadcrumb('#selfSer','自服务平台','/campus_aiops/portconfiger/','端口配置下发');
		break;
	default:
		break;
}