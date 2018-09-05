from django.shortcuts import render
from django.http import HttpResponse
#from rest_framework.response import Response
# from deviceassets.json_update import CJsonEncoder
from rest_framework.decorators import api_view, permission_classes
# from rest_framework import permissions,status
# from UserManager.views import request_statistic
# from django.contrib.auth.decorators import login_required
# from deviceassets.helper import *
# from .models import *
# #from deviceassets.models import DeviceAsset, DeviceList
# from .helper import *
# from deviceassets.helper import get_device_by_group
# import xlrd,csv,datetime,codecs
# from common_service.excel_writer import save_excel_to_response
from django import http

from django.db import connection 


@api_view(["POST","GET"])
def campus_interfaces_usage_info(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/campus_interfaces_usage_info.html')
    
def admin_type(request):
    if request.method == 'POST':
        return HttpResponse('success')
def index(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/homePage/home.html')

def auth_type_history_search(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/auth_type_history.html')
def detail(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/homePage/detailList.html')

def dev_list(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/dev_list.html')

def inspection(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/inspection.html')

def campus_interfaces_usage_info(request):
	if request.method == 'GET':
		return render(request,'campus_aiops/campus_interfaces_usage_info.html')

def port_status_list(request):
	if request.method == 'GET':
		return render(request,'campus_aiops/port_status_list.html')

def device_data(request):
	if request.method == 'GET':
		return render(request,'campus_aiops/device_data.html')


def ip_list(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/ip_list.html')

def vlan_list(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/vlan_list.html')
    else :
        return HttpResponse('successheheheheh')
def manage(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/manage.html')
    else :
        return HttpResponse('successheheheheh')
def equipment(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/equipment_ins.html')
def backbone(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/backbone.html')
def log(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/log_analysis.html')
def tree(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/tree.html')
    else :
        return HttpResponse('successheheheheh')
def detail(request):
    if request.method == 'GET':
        return render(request,'campus_aiops/base_detail.html')
    else :
        return HttpResponse('successheheheheh')

def data_refresh(request):
	if request.method == 'GET':
		return render(request,'campus_aiops/data_refresh.html')

def links(request):
    return render(request,'campus_aiops/links.html')

def excel_push(request):
    return render(request,'campus_aiops/excel_push.html')

def cli_realtime(request):
    return render(request,'campus_aiops/cli_realtime.html')
    
def portconfiger(request):
    return render(request,'campus_aiops/portconfiger.html')



# #ip白名单下载
def ip_download(request):
    if request.method == 'POST':
        print('hello')

# #一致性检查下载
def ip_compare_download(request):
    if request.method == 'POST':
        print('hello')
# my python test

def python_test(request):
    if request.method == 'post':
        # 打开数据库连接
        db = pymysql.connect("localhost","root","","boc" )
         
        # 使用cursor()方法获取操作游标 
        cursor = db.cursor()
         
        rowNums = cursor.execute('SELECT * FROM vlan_table')  
        print('查询的行数为' + str(rowNums))
        cur.execute('')
         
        # 关闭数据库连接
        db.close()


# @request_statistic
# @login_required
# #vlan展示
# def vlan_list(request):
#     if request.method == 'GET':
#         return render(request,'campus_aiops/vlan_list.html')
#     elif request.method == 'POST':
#         datas = []
#         vlan_index_dict = {}
#         vlan_list = []

#         #获得地域列表
#         area_list = []
#         area_list = get_area1_by_tags()  #给下拉列表用，格式：地域|地域编号
#         vlan_index_dict['area_list'] = area_list

#         #获得vlan集合
#         vlans = Vlan.objects.all()
#         if vlans:
#             for vlan in vlans:
#                 vlan_dict = obj_to_dict(vlan)
#                 vlan_list.append(vlan_dict)
#         vlan_index_dict['vlan_list'] = vlan_list

#         datas.append(vlan_index_dict)
#         return HttpResponse(json.dumps(datas, cls=CJsonEncoder))

# @request_statistic
# @login_required
# #创建新vlan
# def vlan_create(request):
#     if request.method == 'POST':
#         last_name = request.user.last_name
#         vlan_data = json.loads(request.POST['vlan_data'])
#         try:
#             vlan_id  = vlan_data['vlan_id']
#             vlan_name = vlan_data['vlan_name']
#             area_name = ''
#             area_no = ''
#             area_str = vlan_data['area']   #前台传过来的地域格式为：地域|地域编号
#             areas = re.split('\|',area_str)
#             area_name = areas[0]
#             area_no = areas[1]

#             vlans_id_same = Vlan.objects.filter(vlan_id = vlan_id)
#             if vlans_id_same:
#                 for v in vlans_id_same:
#                     if v.area_no == area_no:
#                         return HttpResponse('新增失败，vlan号在当前地域下已存在！')
#             new_vlan = Vlan()
#             new_vlan.vlan_id = vlan_data['vlan_id']
#             new_vlan.vlan_name = vlan_data['vlan_name']
#             new_vlan.ip_section = vlan_data['ip_section']
#             new_vlan.ip_gateway = vlan_data['ip_gateway']
#             new_vlan.ip_mask = vlan_data['ip_mask']
#             new_vlan.department_name = vlan_data['department_name']
#             new_vlan.area_name = area_name
#             new_vlan.area_no = area_no
#             new_vlan.note = vlan_data['note']
#             new_vlan.operator = last_name
#             new_vlan.save()
#         except Exception as e:
#             return HttpResponse(str(e))
#         return HttpResponse('新增成功！')

# @request_statistic
# @login_required
# #删除vlan
# def vlan_delete(request):
#     if request.method == 'POST':
#         vlan_ids = request.POST.getlist('id[]')
#         delete_vlans = Vlan.objects.filter(id__in=vlan_ids)
#         for delete_vlan in delete_vlans:
#             delete_vlan.delete()
#         return HttpResponse('删除成功！')

# @request_statistic
# @login_required
# #修改vlan
# def vlan_update(request):
#     if request.method == 'POST':
#         last_name = request.user.last_name
#         try:
#             vlan_data = json.loads(request.POST['vlan_data'])
#             id = vlan_data['id']
#             vlan_id = vlan_data['vlan_id']
#             vlan_name = vlan_data['vlan_name']
#             area_name = ''
#             area_no = ''
#             area_str = vlan_data['area']   #前台传过来的地域格式为：地域|地域编号
#             areas = re.split('\|',area_str)
#             area_name = areas[0]
#             area_no = areas[1]
#             #判断相同地域下vlan号是否重复
#             vlans_id_same = Vlan.objects.filter(vlan_id = vlan_id)
#             if vlans_id_same:
#                 for v in vlans_id_same:
#                     if v.area_no == area_no:
#                         return HttpResponse('修改失败，vlan号在当前地域下已存在！')
#             vlan_obj = Vlan.objects.get(id=id)
#             vlan_obj.vlan_id = vlan_data['vlan_id']
#             vlan_obj.vlan_name = vlan_data['vlan_name']
#             vlan_obj.ip_section = vlan_data['ip_section']
#             vlan_obj.ip_gateway = vlan_data['ip_gateway']
#             vlan_obj.ip_mask = vlan_data['ip_mask']
#             vlan_obj.department_name = vlan_data['department_name']
#             vlan_obj.area_name = area_name
#             vlan_obj.area_no = area_no
#             vlan_obj.note = vlan_data['note']
#             vlan_obj.operator = last_name
#             vlan_obj.save()
#             return HttpResponse('修改成功!')
#         except Exception as e:
#             return HttpResponse(str(e))
#         return HttpResponse('ok')

# @request_statistic
# @login_required
# #批量导入vlan
# def import_vlan(request):
#     try:
#         if request.method == 'POST':
#             last_name = request.user.last_name
#             datas = request.FILES['excel']
#             if datas:
#                 if re.match(r".*.xls.?", datas.name):
#                     tmp = datas.read()
#                     if tmp:
#                         excel = xlrd.open_workbook(filename=datas.name, file_contents=tmp)
#                         sh = excel.sheets()[0]
#                         nrows = sh.nrows
#                         ncols = sh.ncols
#                         if nrows <= 1:
#                             return HttpResponse('导入失败！请检查excel文件中是否存在内容！(少于2行)')
#                         excel_fields = sh.row_values(0)
#                         vlan_fields = Vlan._meta.get_fields()  #获得models里的各字段名
#                         vlan_fields_and_verbose_name = {}
#                         for field in vlan_fields:
#                             if field.name == 'update_time'or field.name == 'id' or field.name == 'operator':
#                                 pass
#                             else:
#                                 vlan_fields_and_verbose_name[field.verbose_name] = field.name  #field.verbose_name是models里的verbose_name，field.name是models里的变量名
#                         datas = []
#                         num = 0  #记录覆盖了多少条记录
#                         for k in range(nrows):
#                             vlan_data = {}
#                             if k == 0:
#                                 if not set(excel_fields).issubset(set(vlan_fields_and_verbose_name)): #判断excel_fields是否为vlan_fields_and_verbose_name的子集

#                                     return HttpResponse('导入失败！'+str(list(set(excel_fields) - (set(vlan_fields_and_verbose_name)))) + "---这些字段不存在")
#                             elif k > 0:
#                                 for key in range(len(excel_fields)):
#                                     sh_value = sh.row_values(k)[key]
#                                     if type(sh_value) is float:
#                                         sh_value = str(int(sh_value))
#                                     if excel_fields[key] in vlan_fields_and_verbose_name:
#                                         vlan_data[vlan_fields_and_verbose_name[excel_fields[key]]] = sh_value.strip()
#                                 if set(vlan_data.values()) != set(['']) and set(vlan_data.values()) != set(['',None]):
#                                     new_vlan_obj = None
#                                     vlan_obj = None
#                                     try:
#                                         #vlan批量导入逻辑：
#                                         #
#                                         # 当vlan_id存在时，判断是否地域相同。如果相同则覆盖并num+1，如果不相同则新增一条记录。
#                                         # 当vlan_id不存在时，直接新增一条记录。
#                                         Vlan(**vlan_data).full_clean(validate_unique=False)
#                                         vlan_obj = Vlan.objects.filter(vlan_id=vlan_data['vlan_id'])
#                                         flag = 0  #记录是否存在vlan_id相同且地域相同，如果存在就置为1
#                                         if vlan_obj:
#                                             for v in vlan_obj:
#                                                 area_no_import = vlan_data['area_no']
#                                                 area_no_db = v.area_no
#                                                 if area_no_import == area_no_db:
#                                                     v.vlan_name = vlan_data['vlan_name']
#                                                     v.ip_section = vlan_data['ip_section']
#                                                     v.ip_gateway = vlan_data['ip_gateway']
#                                                     v.ip_mask = vlan_data['ip_mask']
#                                                     v.department_name = vlan_data['department_name']
#                                                     v.area_name = vlan_data['area_name']
#                                                     v.area_no = vlan_data['area_no']
#                                                     v.note = vlan_data['note']
#                                                     v.operator = last_name
#                                                     v.save()
#                                                     num = num+1
#                                                     flag = 1
#                                                     break
#                                             if flag == 0:  #vlan_id存在但没有相同地域
#                                                 new_vlan_obj = Vlan()
#                                                 new_vlan_obj.vlan_id = vlan_data['vlan_id']
#                                                 new_vlan_obj.vlan_name = vlan_data['vlan_name']
#                                                 new_vlan_obj.ip_section = vlan_data['ip_section']
#                                                 new_vlan_obj.ip_gateway = vlan_data['ip_gateway']
#                                                 new_vlan_obj.ip_mask = vlan_data['ip_mask']
#                                                 new_vlan_obj.department_name = vlan_data['department_name']
#                                                 new_vlan_obj.area_name = vlan_data['area_name']
#                                                 new_vlan_obj.area_no = vlan_data['area_no']
#                                                 new_vlan_obj.note = vlan_data['note']
#                                                 new_vlan_obj.operator = last_name
#                                                 new_vlan_obj.save()
#                                         else:
#                                             new_vlan_obj = Vlan()
#                                             new_vlan_obj.vlan_id = vlan_data['vlan_id']
#                                             new_vlan_obj.vlan_name = vlan_data['vlan_name']
#                                             new_vlan_obj.ip_section = vlan_data['ip_section']
#                                             new_vlan_obj.ip_gateway = vlan_data['ip_gateway']
#                                             new_vlan_obj.ip_mask = vlan_data['ip_mask']
#                                             new_vlan_obj.department_name = vlan_data['department_name']
#                                             new_vlan_obj.area_name = vlan_data['area_name']
#                                             new_vlan_obj.area_no = vlan_data['area_no']
#                                             new_vlan_obj.note = vlan_data['note']
#                                             new_vlan_obj.operator = last_name
#                                             new_vlan_obj.save()
#                                     except Exception as e:
#                                         # print(e)
#                                         return HttpResponse(str(e))
#                         str_result = ''
#                         if num>0:
#                             num = str(num)
#                             str_result = '有%s条记录被覆盖！'%num
#                         return HttpResponse("导入成功！"+str_result)
#                     else:
#                         return HttpResponse("导入失败！请检查excel信息!")
#                 else:
#                     return HttpResponse('导入失败！请选择excel导入!')
#             else:
#                 return HttpResponse('导入失败！请选择要导入的文件!')
#     except Exception as e :
#         # print(e)
#         return  0

# @request_statistic
# @login_required
# #vlan下载
# def vlan_download(request):
#     if request.method == 'POST':
#         vlan_ids = request.POST.getlist('id[]')
#         # vlan_ids = json.loads(request.POST['datas'])
#         if vlan_ids:
#             vlans = Vlan.objects.filter(id__in=vlan_ids)
#         else:
#             vlans = Vlan.objects.all()
#         excel_header = ['vlan号','vlan名','ip地址段','网关','掩码','部门','地域','地域编号','备注','操作人','更新时间']
#         vlan_fields = ['vlan_id','vlan_name','ip_section','ip_gateway','ip_mask','department_name','area_name','area_no','note','operator','update_time']
#         row_list = []
#         for vlan in vlans:
#             vlan_row_list = []
#             for vlan_field in vlan_fields:
#                 if vlan_field == 'update_time':
#                     ut = getattr(vlan, vlan_field)   #getattr(x, 'y') is equivalent to x.y
#                     ut_str = ut.strftime("%Y-%m-%d %H:%M:%S")
#                     vlan_row_list.append(ut_str)
#                 else:
#                     vlan_row_list.append(getattr(vlan,vlan_field) if getattr(vlan,vlan_field) else '')
#             row_list.append(vlan_row_list)
#         return save_excel_to_response(excel_header=excel_header, row_list=row_list, sheet_name='vlan信息', filename='campus_vlan_list.xls')

# @request_statistic
# @login_required
# #ip列表显示
# def ip_list(request):
#     if request.method == 'GET':
#         return render(request,'campus_aiops/ip_list.html')
#     elif request.method == 'POST':
#         ip_objs_list = []
#         try:
#             vlanobj_id = request.POST['id']
#             if vlanobj_id:  #参数为某个vlan，传字段id，则显示该vlan下的ip obj
#                 # vlan_obj = Vlan.objects.filter(id = vlanobj_id)
#                 # if vlan_obj:
#                     # ip_section = vlan_obj[0].ip_section
#                     # ip_mask = vlan_obj[0].ip_mask
#                     # ips = get_ips_by_ipsection(ip_section,ip_mask)  #得到ip地址list

#                 ips = StaticIP.objects.filter(vlan = vlanobj_id)
#                 if ips:
#                     for ip in ips:
#                         try:
#                             ip_dict = obj_to_dict(ip)
#                             #补充一些显示字段（交换机名）
#                             device = ip.interface.device
#                             ip_dict['device_name'] = device.dev_name
#                             #ip_dict里interface只是interface记录的id，不是整个对象的所有字段。
#                             vlan_dict = obj_to_dict_same_field_name(ip.vlan,'vlan_')
#                             dictMerge = dict(ip_dict,**vlan_dict)
#                             int_dict = obj_to_dict_same_field_name(ip.interface, 'interface_')  #给从interface这个表里取过来的数据，键加上表名作为前缀，以防止键重名。
#                             dictMerge = dict(dictMerge,**int_dict)
#                             ead_info = get_ead_info(ip.interface.interface_ip,'ip')
#                             # ead_info = get_ead_info(aip.ip,'ip')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(dictMerge,**ead_info)
#                             else:
#                                 ead_info = get_ead_info(ip.interface.mac,'mac')
#                                 # ead_info = get_ead_info(aip.mac,'mac')
#                                 if len(ead_info)>0:
#                                     dictMerge = dict(dictMerge,**ead_info)
#                             ip_objs_list.append(dictMerge)
#                         except StaticIP.DoesNotExist:
#                             continue
#             else:  #没有传参数过来，则返回所有ip_obj
#                 all_ip_objs = StaticIP.objects.all()
#                 #需要注意的点：
#                 #1、vlan根据掩码和子网ip算不出来，则vlan信息不合并到dict中
#                 #2、都当成有序dict来算吧，好看点。。
#                 #3、ead也可能为空，空则不合并
#                 for all_ip_obj in all_ip_objs:
#                     all_ip_dict = obj_to_dict(all_ip_obj)
#                     #补充一些显示字段：交换机名
#                     device = all_ip_obj.interface.device
#                     all_ip_dict['device_name'] = device.dev_name

#                     all_vlan_dict = obj_to_dict_same_field_name(all_ip_obj.vlan,'vlan_')
#                     dictMerge = dict(all_ip_dict,**all_vlan_dict)

#                     all_int_dict = obj_to_dict_same_field_name(all_ip_obj.interface, 'interface_')
#                     dictMerge = dict(dictMerge,**all_int_dict)

#                     ead_info = get_ead_info(all_ip_obj.interface.interface_ip,'ip')
#                     if len(ead_info)>0:
#                         dictMerge = dict(dictMerge,**ead_info)
#                     else:
#                         ead_info = get_ead_info(all_ip_obj.interface.mac,'mac')
#                         # ead_info = get_ead_info(aip.mac,'mac')
#                         if len(ead_info)>0:
#                             dictMerge = dict(dictMerge,**ead_info)
#                     ip_objs_list.append(dictMerge)
#         except Exception as e:
#             # print(e)
#             return HttpResponse(str(e))
#         return HttpResponse(json.dumps(ip_objs_list, cls=CJsonEncoder))

# @request_statistic
# @login_required
# #ip分配
# def ip_create(request):
#     if request.method == 'POST':
#         last_name = request.user.last_name
#         ip_data = json.loads(request.POST['ip_data'])
#         try:
#             #校验ip在已分配ip中（未回收）是否有重复
#             ip  = ip_data['ip']
#             ip_same = StaticIP.objects.filter(ip = ip).filter(show_status = '0')
#             if ip_same:
#                 return HttpResponse('分配失败，该ip已分配！')
#             #校验mac在已分配ip记录中（未回收）是否有重复
#             mac = ip_data['mac']
#             if re.match('^([0-9a-fA-F]{4})((\.[0-9a-fA-F]{4}){2})$',mac):
#                 pass
#             else:
#                 return HttpResponse('分配失败，MAC地址无效或格式错误！')
#             mac_same = StaticIP.objects.filter(mac = mac).filter(show_status = '0')
#             if mac_same:
#                 return HttpResponse('分配失败，该mac已分配！')
#             switch_ip = ip_data['switch_ip']
#             switch_int = ip_data['switch_int']
#             #校验交换机ip和端口（同时）在已分配ip记录中（未回收）是否有重复
#             switch_int_info = Interface.objects.filter(ip=switch_ip).filter(name=switch_int)
#             if switch_int_info:
#                 switch_same = StaticIP.objects.filter(interface = switch_int_info[0]).filter(show_status = '0')
#                 if switch_same:
#                     return HttpResponse('分配失败，该交换机端口已被占用！')
#                 new_ip = StaticIP()
#                 new_ip.ip = ip_data['ip']
#                 new_ip.mac = ip_data['mac']
#                 new_ip.user = ip_data['user']
#                 new_ip.account = ip_data['account']
#                 new_ip.head_office = ip_data['head_office']
#                 new_ip.tel = ip_data['tel']
#                 new_ip.location = ip_data['location']
#                 new_ip.info_id = ip_data['info_id']
#                 new_ip.terminal_type = ip_data['terminal_type']
#                 new_ip.asset = ip_data['asset']
#                 new_ip.application = ip_data['application']
#                 new_ip.app_ip = ip_data['app_ip']
#                 new_ip.app_interface = ip_data['app_interface']
#                 new_ip.vlan = get_vlan_by_ip(ip_data['ip'])
#                 new_ip.interface = switch_int_info[0]
#                 new_ip.reason = ip_data['reason']
#                 new_ip.exist = ip_data['exist']
#                 new_ip.note = ip_data['note']
#                 new_ip.assign_time = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
#                 new_ip.assign_user = last_name
#                 new_ip.show_status = '0'
#                 new_ip.operator = last_name
#                 new_ip.save()
#             else:
#                 return HttpResponse('分配失败，没有找到对应的交换机和端口！')
#         except Exception as e:
#             return HttpResponse(str(e))
#         return HttpResponse('分配成功！')

# @request_statistic
# @login_required
# #回收ip
# def ip_delete(request):  #回收，不删除，只改状态。
#     if request.method == 'POST':
#         last_name = request.user.last_name
#         try:
#             ip_ids = request.POST.getlist('id[]')
#             delete_ips = StaticIP.objects.filter(id__in=ip_ids)
#             for delete_ip in delete_ips:
#                 delete_ip.show_status = '1'
#                 delete_ip.delete_time = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
#                 delete_ip.delete_user = last_name
#                 delete_ip.operator = last_name
#                 delete_ip.save()
#         except Exception as e:
#             return HttpResponse(str(e))
#         return HttpResponse('回收成功！')

# @request_statistic
# @login_required
# #ip查询
# def ip_search(request):
#     if request.method == 'POST':
#         ip_search_results = []
#         try:
#             addrs = request.POST.getlist('addr[]')
#             show_status = request.POST['show_status']#0：显示; 1：回收；2；全部
#             if len(addrs)>0:
#                 for addr in addrs:
#                     if re.match("^\d+(\.\d+){3}$", addr):  #每一个都尝试判断ip/mac格式。匹配ip格式。
#                         if int(show_status) >1:
#                             ip_objs = StaticIP.objects.filter(ip = addr)
#                         else:
#                             ip_objs = StaticIP.objects.filter(ip = addr).filter(show_status = show_status)
#                     elif re.match('^([0-9a-fA-F]{2})(([:-][0-9a-fA-F]{2}){5})$', addr): #匹配mac，只支持三种格式：6c0b.8445.0941，6c:0b:84:45:09:41和6c-0b-84-45-09-41（前台说明一下）
#                         mac = mac_convert(addr)#先进行格式转换，都转成6c0b.8445.0941格式。
#                         if int(show_status) >1:
#                             ip_objs = StaticIP.objects.filter(mac = mac)
#                         else:
#                             ip_objs = StaticIP.objects.filter(mac = mac).filter(show_status = show_status)
#                     elif re.match('^([0-9a-fA-F]{4})((\.[0-9a-fA-F]{4}){2})$', addr):  #数据库里存的都是这种格式6c0b.8445.0941
#                         if int(show_status) >1:
#                             ip_objs = StaticIP.objects.filter(mac = addr)
#                         else:
#                             ip_objs = StaticIP.objects.filter(mac = addr).filter(show_status = show_status)
#                     else:
#                         ip_objs = None
#                     if ip_objs:
#                         for ip_obj in ip_objs:
#                             ip_dict = obj_to_dict(ip_obj)
#                             device = ip_obj.interface.device
#                             ip_dict['device_name'] = device.dev_name
#                             vlan_dict = obj_to_dict_same_field_name(ip_obj.vlan,'vlan_')
#                             dictMerge = dict(ip_dict,**vlan_dict)
#                             int_dict = obj_to_dict_same_field_name(ip_obj.interface, 'interface_')
#                             dictMerge = dict(dictMerge,**int_dict)
#                             ead_info = get_ead_info(ip_obj.interface.interface_ip,'ip')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(dictMerge,**ead_info)
#                             else:
#                                 ead_info = get_ead_info(ip_obj.interface.mac,'mac')
#                                 # ead_info = get_ead_info(aip.mac,'mac')
#                                 if len(ead_info)>0:
#                                     dictMerge = dict(dictMerge,**ead_info)
#                             ip_search_results.append(dictMerge)
#                     else:
#                         continue
#             else:
#                 if int(show_status) >1:
#                     ip_objs = StaticIP.objects.all()
#                 else:
#                     ip_objs = StaticIP.objects.filter(show_status = show_status)
#                 if ip_objs:
#                     for ip_obj in ip_objs:
#                         ip_dict = obj_to_dict(ip_obj)
#                         device = ip_obj.interface.device
#                         ip_dict['device_name'] = device.dev_name
#                         vlan_dict = obj_to_dict_same_field_name(ip_obj.vlan,'vlan_')
#                         dictMerge = dict(ip_dict,**vlan_dict)
#                         int_dict = obj_to_dict_same_field_name(ip_obj.interface, 'interface_')
#                         dictMerge = dict(dictMerge,**int_dict)
#                         ead_info = get_ead_info(ip_obj.interface.interface_ip,'ip')
#                         if len(ead_info)>0:
#                             dictMerge = dict(dictMerge,**ead_info)
#                         else:
#                             ead_info = get_ead_info(ip_obj.interface.mac,'mac')
#                             # ead_info = get_ead_info(aip.mac,'mac')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(dictMerge,**ead_info)
#                         ip_search_results.append(dictMerge)
#         except Exception as e:
#             # print(e)
#             return HttpResponse(str(e))
#         return HttpResponse(json.dumps(ip_search_results, cls=CJsonEncoder))

# @request_statistic
# @login_required
# #ip导入逻辑：
# #1、显示状态下，ip如果重复，则覆盖。
# #2、显示状态下，如果ip不重复，mac重复，报错
# #3、显示状态下，如果ip不重复，但交换机ip和端口同时重复，报错。
# #4、批量导入的显示状态都默认为0，都算分配，各种覆盖之类的更改都不算回收。
# def import_ip(request):
#     try:
#         if request.method == 'POST':
#             last_name = request.user.last_name
#             datas = request.FILES['excel']
#             if datas:
#                 if re.match(r".*.xls.?", datas.name):
#                     tmp = datas.read()
#                     if tmp:
#                         excel = xlrd.open_workbook(filename=datas.name, file_contents=tmp)
#                         sh = excel.sheets()[0]
#                         nrows = sh.nrows
#                         ncols = sh.ncols
#                         if nrows <= 1:
#                             return HttpResponse('请检查excel文件中是否存在内容！(少于2行)')
#                         excel_fields = sh.row_values(0)
#                         ip_fields = StaticIP._meta.get_fields()  #获得models里的各字段名
#                         ip_fields_and_verbose_name = {}
#                         for field in ip_fields:
#                             if field.name == 'update_time'or field.name == 'id' or field.name == 'operator'or field.name == 'assign_time' or field.name == 'assign_user' or field.name == 'delete_time' or field.name == 'delete_user' or field.name == 'show_status' :
#                                 pass
#                             else:
#                                 ip_fields_and_verbose_name[field.verbose_name] = field.name  #field.verbose_name是models里的verbose_name，field.name是models里的变量名
#                                 ip_fields_and_verbose_name['交换机IP'] = ''
#                                 ip_fields_and_verbose_name['交换机端口'] = ''
#                         datas = []
#                         num = 0  #记录覆盖了多少条记录
#                         for k in range(nrows):
#                             ip_data = {}
#                             if k == 0:
#                                 if not set(excel_fields).issubset(set(ip_fields_and_verbose_name)): #测试excel_fields中的每一个元素都在ip_fields_and_verbose_name中
#                                     return HttpResponse(str(list(set(excel_fields) - (set(ip_fields_and_verbose_name)))) + "---这些字段不存在")
#                                 # 集合运算 c=t-s:求差集，在t中不在s中的元素。
#                             elif k > 0:
#                                 for key in range(len(excel_fields)):
#                                     sh_value = sh.row_values(k)[key]
#                                     if type(sh_value) is float:
#                                         sh_value = str(int(sh_value))
#                                     if excel_fields[key] in ip_fields_and_verbose_name:
#                                         if excel_fields[key] == 'MAC地址':
#                                             mac_str = sh_value.strip()
#                                             if re.match('^([0-9a-fA-F]{4})((\.[0-9a-fA-F]{4}){2})$',mac_str):
#                                                 ip_data['mac'] = sh_value.strip()
#                                             else:
#                                                 line = str(k+1)
#                                                 return HttpResponse("导入失败，第%s行记录MAC地址无效或格式错误！"%line)
#                                         elif excel_fields[key] == '交换机IP':
#                                             ip_data['switch_ip'] = sh_value.strip()
#                                         elif excel_fields[key] == '交换机端口':
#                                             ip_data['switch_int'] = sh_value.strip()
#                                         else:
#                                             ip_data[ip_fields_and_verbose_name[excel_fields[key]]] = sh_value.strip()
#                                 if set(ip_data.values()) != set(['']) and set(ip_data.values()) != set(['',None]):
#                                     try:
#                                         # StaticIP(**vlan_data).full_clean(validate_unique=False)
#                                         ip_objs = StaticIP.objects.filter(ip=ip_data['ip']).filter(show_status = '0')
#                                         if ip_objs: #如果显示状态存在重复ip就覆盖
#                                             for ip_obj in ip_objs:
#                                                 switch_ip = ip_data['switch_ip']
#                                                 switch_int = ip_data['switch_int']
#                                                 interface = None
#                                                 interfaces = Interface.objects.filter(ip=switch_ip).filter(name=switch_int)
#                                                 if interfaces:
#                                                     interface = interfaces[0]
#                                                 else:
#                                                     line = str(k+1)
#                                                     return HttpResponse("导入失败，第%s行记录交换机及端口不存在！"%line)
#                                                 ip_obj.mac =ip_data['mac']
#                                                 ip_obj.user =ip_data['user']
#                                                 ip_obj.account =ip_data['account']
#                                                 ip_obj.head_office =ip_data['head_office']
#                                                 ip_obj.tel =ip_data['tel']
#                                                 ip_obj.location =ip_data['location']
#                                                 ip_obj.info_id =ip_data['info_id']
#                                                 ip_obj.terminal_type =ip_data['terminal_type']
#                                                 ip_obj.asset =ip_data['asset']
#                                                 ip_obj.application =ip_data['application']
#                                                 ip_obj.app_ip =ip_data['app_ip']
#                                                 ip_obj.app_interface =ip_data['app_interface']
#                                                 ip_obj.vlan = get_vlan_by_ip(ip_data['ip'])
#                                                 ip_obj.interface = interface
#                                                 ip_obj.reason =ip_data['reason']
#                                                 ip_obj.exist =ip_data['exist']
#                                                 ip_obj.note =ip_data['note']
#                                                 ip_obj.assign_time = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
#                                                 ip_obj.assign_user = last_name
#                                                 ip_obj.show_status = '0'
#                                                 ip_obj.operator = last_name
#                                                 ip_obj.save()
#                                                 num = num+1
#                                         else: #如果显示状态无重复ip
#                                             ip_objs_by_mac = StaticIP.objects.filter(mac=ip_data['mac']).filter(show_status = '0')
#                                             if ip_objs_by_mac:
#                                                 line = str(k+1)
#                                                 return HttpResponse("导入失败，第%s行mac地址冲突！该mac已存在于不同的ip记录！"%line)
#                                             switch_ip = ip_data['switch_ip']
#                                             switch_int = ip_data['switch_int']
#                                             interface = None
#                                             interface_same = Interface.objects.filter(ip=switch_ip).filter(name=switch_int)
#                                             if interface_same:
#                                                 interface = interface_same[0]
#                                                 ip_objs_by_switch = StaticIP.objects.filter(interface = interface).filter(show_status = '0')
#                                                 if ip_objs_by_switch:
#                                                     line = str(k+1)
#                                                     return HttpResponse("导入失败，第%s行交换机冲突！该交换机ip和端口已被占用！"%line)
#                                             new_ip_obj = StaticIP()
#                                             new_ip_obj.ip =ip_data['ip']
#                                             new_ip_obj.mac =ip_data['mac']
#                                             new_ip_obj.user =ip_data['user']
#                                             new_ip_obj.account =ip_data['account']
#                                             new_ip_obj.head_office =ip_data['head_office']
#                                             new_ip_obj.tel =ip_data['tel']
#                                             new_ip_obj.location =ip_data['location']
#                                             new_ip_obj.info_id =ip_data['info_id']
#                                             new_ip_obj.terminal_type =ip_data['terminal_type']
#                                             new_ip_obj.asset =ip_data['asset']
#                                             new_ip_obj.application =ip_data['application']
#                                             new_ip_obj.app_ip =ip_data['app_ip']
#                                             new_ip_obj.app_interface =ip_data['app_interface']
#                                             new_ip_obj.vlan = get_vlan_by_ip(ip_data['ip'])
#                                             new_ip_obj.interface = interface
#                                             new_ip_obj.reason =ip_data['reason']
#                                             new_ip_obj.exist =ip_data['exist']
#                                             new_ip_obj.note =ip_data['note']
#                                             new_ip_obj.assign_time = str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
#                                             new_ip_obj.assign_user = last_name
#                                             new_ip_obj.show_status = '0'
#                                             new_ip_obj.operator = last_name
#                                             new_ip_obj.save()
#                                     except Exception as e:
#                                         # print(e)
#                                         return HttpResponse(str(e))
#                         str_result = ''
#                         if num>0:
#                             num = str(num)
#                             str_result = '有%s条记录被覆盖！'%num
#                         return HttpResponse("导入成功！"+str_result)
#                     else:
#                         return HttpResponse("导入失败！请检查excel信息!")
#                 else:
#                     return HttpResponse('导入失败！请选择excel导入!')
#             else:
#                 return HttpResponse('导入失败！请选择要导入的文件!')
#     except Exception as e :
#         # print(e)
#         return  0

# @request_statistic
# @login_required
# #ip白名单下载
# def ip_download(request):
#     if request.method == 'POST':
#         try:
#             ip_ids = request.POST.getlist('id[]')
#             if ip_ids:
#                 ip_objs = StaticIP.objects.filter(id__in=ip_ids)
#             else:
#                 ip_objs = StaticIP.objects.all()
#             if ip_objs:
#                 excel_header = ['IP地址','MAC地址','IP使用人','域账号','人员类别','联系电话','工位号','信息点号','终端类型','是否行内资产'
#                 ,'访问后台系统名称','后台系统IP','访问后台端口','未准入原因（白名单类别）','是否在白名单中','备注','分配日期','分配人','回收日期','回收人'
#                 ,'状态(0为使用中，1为已回收)','操作人','更新时间（白名单IP分配）',
#                                 'vlan（计算）','部门','地域','地域编号',
#                                 '交换机IP','交换机端口','admin状态','admin状态原因','show run配置','mac（采集）','历史mac','arp（采集）','历史arp'
#                     ,'vlan（采集）','认证模式','日志端口状态','日志时间','更新时间（采集）',
#                                 '交换机名',
#                                 'EAD_员工号','EAD_员工姓名','EAD_操作系统版本','EAD_终端品牌','EAD_终端类型','EAD_所属部门']
#                 ip_fields = ['ip','mac','user','account','head_office','tel','location','info_id','terminal_type','asset'
#                 ,'application','app_ip','app_interface','reason','exist','note','assign_time','assign_user','delete_time','delete_u1ser','show_status','operator','update_time']
#                 vlan_fields = ['vlan_id','department_name','area_name','area_no']
#                 int_fields = ['ip','name','status','status_reason','show_run','mac','mac_history','interface_ip','interface_ip_history','vlan','auth_type','log_status','log_time','update_time']
#                 ead_fields = ['user_name','full_name','os_version','terminal_vendor','terminal_type','service_template_name']
#                 row_list = []
#                 for ip_obj in ip_objs:
#                     ip_row_list = []  #每行一个ip_row_list，一个ip_obj
#                     for ip_field in ip_fields:
#                         # ip_row_list.append(getattr(ip_obj, ip_field) if getattr(ip_obj, ip_field) else '')
#                         if ip_field == 'update_time':
#                             ut = getattr(ip_obj, ip_field)   #getattr(x, 'y') is equivalent to x.y
#                             ut_str = ut.strftime("%Y-%m-%d %H:%M:%S")
#                             ip_row_list.append(ut_str)
#                         else:
#                             ip_row_list.append(getattr(ip_obj, ip_field) if getattr(ip_obj, ip_field) else '')

#                     vlan_obj = ip_obj.vlan
#                     if vlan_obj:
#                         for vlan_field in vlan_fields:
#                             ip_row_list.append(getattr(vlan_obj, vlan_field) if getattr(vlan_obj, vlan_field) else '')
#                     else:
#                         vlan_row_list = ['','','','']
#                         ip_row_list.extennd(vlan_row_list)

#                     int_obj = ip_obj.interface
#                     for int_field in int_fields:
#                         if int_field == 'update_time':
#                             ut = getattr(int_obj, int_field)   #getattr(x, 'y') is equivalent to x.y
#                             ut_str = ut.strftime("%Y-%m-%d %H:%M:%S")
#                             ip_row_list.append(ut_str)
#                         else:
#                             ip_row_list.append(getattr(int_obj, int_field) if getattr(int_obj, int_field) else '')

#                     device_name = int_obj.device.dev_name
#                     ip_row_list.append(device_name)  #交换机名

#                     ead_objs = EADInfo.objects.filter(ip = ip_obj.interface.interface_ip)
#                     if ead_objs:
#                         ead_obj = ead_objs[0]
#                         for ead_field in ead_fields:
#                             ip_row_list.append(getattr(ead_obj, ead_field) if getattr(ead_obj, ead_field) else '')
#                     else:
#                         ead_objs = EADInfo.objects.filter(mac = ip_obj.interface.mac)
#                         if ead_objs:
#                             ead_obj = ead_objs[0]
#                             for ead_field in ead_fields:
#                                 ip_row_list.append(getattr(ead_obj, ead_field) if getattr(ead_obj, ead_field) else '')
#                         else: #没有ead信息
#                             ead_row_list = ['','','','','','']
#                             ip_row_list.extennd(ead_row_list)
#             else:
#                 return HttpResponse('没有可导出的内容！')
#         except Exception as e :
#             # print(e)
#             return HttpResponse(e)
#         return save_excel_to_response(excel_header=excel_header, row_list=row_list, sheet_name='白名单信息', filename='oa_StaticIP_list.xls')

# @request_statistic
# @login_required
# #白名单与自动采集信息比对
# def ip_compare(request):
#     if request.method == 'POST':
#         try:
#             ip_compare_result_list = []
#             tag = request.POST['tag']
#             if tag == '0':  #相同1)应用ip 或 2)应用mac（并集），但交换机ip和端口名不同的记录
#                 manual_ip_objs = StaticIP.objects.all()
#                 for manual_ip_obj in manual_ip_objs:
#                     manual_ip = manual_ip_obj.ip
#                     manual_mac = manual_ip_obj.mac
#                     manual_switch = manual_ip_obj.interface.ip
#                     manual_int = manual_ip_obj.interface.name

#                     #(1)ip相同，但交换机ip和端口名不同的记录
#                     auto_ip_objs = Interface.objects.filter(interface_ip = manual_ip)
#                     if auto_ip_objs:
#                         for auto_ip_obj in auto_ip_objs:
#                             auto_ip = auto_ip_obj.interface_ip
#                             auto_mac = auto_ip_obj.mac
#                             auto_switch = auto_ip_obj.ip
#                             auto_int = auto_ip_obj.name
#                             if manual_switch != auto_switch or manual_int != auto_int:
#                                 ip_compare_result_dict = {}  #存放返回给前台的数据,手动录入的应用ip、mac、交换机ip和端口名;自动采集的应用ip、mac、交换机和端口名:manual_ip,manual_mac,manual_switch,manual_int,auto_ip,auto_mac,auto_switch,auto_int
#                                 ip_compare_result_dict['manual_ip'] = manual_ip
#                                 ip_compare_result_dict['manual_mac'] = manual_mac
#                                 ip_compare_result_dict['manual_switch'] = manual_switch
#                                 ip_compare_result_dict['manual_int'] = manual_int
#                                 ip_compare_result_dict['manual_device_id'] = manual_ip_obj.interface.device.id
#                                 ip_compare_result_dict['auto_ip'] = auto_ip
#                                 ip_compare_result_dict['auto_mac'] = auto_mac
#                                 ip_compare_result_dict['auto_switch'] = auto_switch
#                                 ip_compare_result_dict['auto_int'] = auto_int
#                                 ip_compare_result_dict['auto_device_id'] = auto_ip_obj.device.id
#                                 ip_compare_result_list.append(ip_compare_result_dict)
#                     #(2)mac相同，但交换机ip和端口名不同的记录（去掉与（1）重复的记录，即去掉mac相同且应用ip也相同的记录）
#                     auto_mac_objs = Interface.objects.filter(mac = manual_mac)
#                     if auto_mac_objs:
#                         for auto_mac_obj in auto_mac_objs:
#                             auto_ip = auto_mac_obj.interface_ip
#                             auto_mac = auto_mac_obj.mac
#                             auto_switch = auto_mac_obj.ip
#                             auto_int = auto_mac_obj.name
#                             if auto_ip != manual_ip and (manual_switch != auto_switch or manual_int != auto_int):
#                                 ip_compare_result_dict = {}
#                                 ip_compare_result_dict['manual_ip'] = manual_ip
#                                 ip_compare_result_dict['manual_mac'] = manual_mac
#                                 ip_compare_result_dict['manual_switch'] = manual_switch
#                                 ip_compare_result_dict['manual_int'] = manual_int
#                                 ip_compare_result_dict['manual_device_id'] = manual_ip_obj.interface.device.id
#                                 ip_compare_result_dict['auto_ip'] = auto_ip
#                                 ip_compare_result_dict['auto_mac'] = auto_mac
#                                 ip_compare_result_dict['auto_switch'] = auto_switch
#                                 ip_compare_result_dict['auto_int'] = auto_int
#                                 ip_compare_result_dict['auto_device_id'] = auto_ip_obj.device.id
#                                 ip_compare_result_list.append(ip_compare_result_dict)
#             else:  #tag =1,相同交换机ip和端口名，但1）应用ip 或 2）应用mac 不同（并集）的记录
#                 manual_ip_objs = StaticIP.objects.all()
#                 for manual_ip_obj in manual_ip_objs:
#                     manual_ip = manual_ip_obj.ip
#                     manual_mac = manual_ip_obj.mac
#                     manual_switch = manual_ip_obj.interface.ip
#                     manual_int = manual_ip_obj.interface.name
#                     auto_ip_objs = Interface.objects.filter(ip = manual_switch).filter(name = manual_int)
#                     for auto_ip_obj in auto_ip_objs:
#                         auto_ip = auto_ip_obj.interface_ip
#                         auto_mac = auto_ip_obj.mac
#                         auto_switch = auto_ip_obj.ip
#                         auto_int = auto_ip_obj.name
#                         if auto_ip != manual_ip or auto_mac != manual_mac:
#                             ip_compare_result_dict = {}
#                             ip_compare_result_dict['manual_ip'] = manual_ip
#                             ip_compare_result_dict['manual_mac'] = manual_mac
#                             ip_compare_result_dict['manual_switch'] = manual_switch
#                             ip_compare_result_dict['manual_int'] = manual_int
#                             ip_compare_result_dict['manual_device_id'] = manual_ip_obj.interface.device.id
#                             ip_compare_result_dict['auto_ip'] = auto_ip
#                             ip_compare_result_dict['auto_mac'] = auto_mac
#                             ip_compare_result_dict['auto_switch'] = auto_switch
#                             ip_compare_result_dict['auto_int'] = auto_int
#                             ip_compare_result_dict['auto_device_id'] = auto_ip_obj.device.id
#                             ip_compare_result_list.append(ip_compare_result_dict)
#         except Exception as e:
#             # print(e)
#             return HttpResponse(str(e))
#         return HttpResponse(json.dumps(ip_compare_result_list, cls=CJsonEncoder))

# @request_statistic
# @login_required
# # 【定时任务】 （顺序2，可与1同时进行）
# #ead信息获取，存入数据库表EADInfo中。每天定时+页面手工同步
# def ead_info_update(request):
#     try:
#         results = []
#         url_hh = 'http://22.122.51.80:8080/imcrs/uam/online?start=0&size=2000&orderBy=id&desc=false&total=false'
#         url_xd = 'http://22.1.84.80:8080/imcrs/uam/online?start=0&size=3000&orderBy=id&desc=false&total=false'
#         usernames='admin'
#         passwords='123password~~'
#         authhandler = urllib.request.HTTPDigestAuthHandler()
#         authhandler.add_password("iMC RESTful Web Services", url_hh, usernames, passwords)  #先获取黑山扈那台的信息
#         opener = urllib.request.build_opener(authhandler)
#         urllib.request.install_opener(opener)
#         pagehandle=urllib.request.Request(url_hh)
#         pagehandle.add_header('Accept', 'application/json')
#         response = urllib.request.urlopen(pagehandle)
#         res = response.read()
#         # print('res_hh:',res)
#         if len(res) >0:
#             # print('ok')
#             #有新数据就清空旧数据
#             ead_dels = EADInfo.objects.all()
#             for ead_del in ead_dels:
#                 ead_del.delete()
#             infos = json.loads(res.decode('utf8'))
#             results = infos['online']
#             for result in results:
#                 # print(result)
#                 # print('hh user:',result['fullName'])
#                 # print('ip:',result['framedIp'])
#                 ead = EADInfo()
#                 ead.ip = result['framedIp']
#                 macAddress = result['macAddress']
#                 macAddress = network_item_format.mac_format_for_ead(macAddress)
#                 ead.mac = macAddress
#                 ead.user_name = result['userName']
#                 ead.full_name = result['fullName']
#                 if 'osVersion' in result:
#                     ead.os_version = result['osVersion']
#                 else:
#                     ead.os_version = ''
#                 if 'terminalVendor' in result:
#                     ead.terminal_vendor = result['terminalVendor']
#                 else:
#                     ead.terminal_vendor = ''
#                 if 'terminalType' in result:
#                     ead.terminal_type = result['terminalType']
#                 else:
#                     ead.terminal_type = ''
#                 ead.service_template_name = result['serviceTemplateName']
#                 ead.save()
#         authhandler = urllib.request.HTTPDigestAuthHandler()
#         authhandler.add_password("iMC RESTful Web Services", url_xd, usernames, passwords)   #再获取黑山扈那台的信息
#         opener = urllib.request.build_opener(authhandler)
#         urllib.request.install_opener(opener)
#         pagehandle=urllib.request.Request(url_xd)
#         pagehandle.add_header('Accept', 'application/json')
#         response = urllib.request.urlopen(pagehandle)
#         res = response.read()
#         if len(res) >0:
#             infos = json.loads(res.decode('utf8'))
#             results = infos['online']
#             for result in results:
#                 ead = EADInfo()
#                 ead.ip = result['framedIp']
#                 macAddress = result['macAddress']
#                 macAddress = network_item_format.mac_format_for_ead(macAddress)
#                 ead.mac = macAddress
#                 ead.user_name = result['userName']
#                 # print('xd user:',result['fullName'])
#                 ead.full_name = result['fullName']
#                 # if 'osVersion' in result.keys():
#                 if 'osVersion' in result:
#                     ead.os_version = result['osVersion']
#                 else:
#                     ead.os_version = ''
#                 if 'terminalVendor' in result:
#                     ead.terminal_vendor = result['terminalVendor']
#                 else:
#                     ead.terminal_vendor = ''
#                 if 'terminalType' in result:
#                     ead.terminal_type = result['terminalType']
#                 else:
#                     ead.terminal_type = ''
#                 ead.service_template_name = result['serviceTemplateName']
#                 ead.save()
#         return HttpResponse('success', status=status.HTTP_200_OK)
#     except Exception as e:
#         # print(e)
#         return HttpResponse(str(e), status=status.HTTP_400_BAD_REQUEST)


# @request_statistic
# @login_required
# #【定时任务】定时把数据入到大表PortStatus中    （顺序3）
# #端口接入查询时：（1）使用大表提前做四表连接。
# # （2）地域字段（包括地域名和地域编号）不使用vlan表里的地域，而直接通过交换机去上传的园区设备信息里取地域标签。
# def port_status_update(request):
#     try:
#         update_datas = []
#         int_objs = Interface.objects.all()
#         if int_objs:
#             #多表拼接数据结构update_datas
#             for int_obj in int_objs:
#                 #interface表
#                 int_dict  = obj_to_dict_same_field_name(int_obj, 'interface_')
#                 #交换机名
#                 device = int_obj.device
#                 int_dict['device_name'] = device.dev_name
#                 area_info = get_area_by_device(int_obj.device)
#                 int_dict['area_name'] = area_info['area_name']
#                 int_dict['area_no'] = area_info['area_no']
#                 #白名单表
#                 ip_objs = StaticIP.objects.filter(interface = int_obj).filter(show_status = '0')
#                 if ip_objs:
#                     ip_obj = ip_objs[0]  #一个交换机ip和端口应该是唯一确定一个白名单的。所以取第一个就行了。
#                     ip_dict = obj_to_dict(ip_obj)
#                     dictMerge = dict(int_dict,**ip_dict)
#                     int_dict = dictMerge
#                     #vlan
#                     vlan_dict = obj_to_dict_same_field_name(ip_obj.vlan,'vlan_')
#                     dictMerge = dict(int_dict,**vlan_dict)
#                     int_dict = dictMerge
#                     #EAD
#                     # 获得ead信息的逻辑：
#                     #1、如果实时ip存在，则轮询实时ip获得ead信息
#                     #2、如果1未获得ead信息，则如果实时mac存在，轮询实时mac获得ead信息
#                     #3、如果2也未获得ead信息，则如果历史ip存在，轮询历史ip
#                     #4、如果3也没有获得，则如果历史mac存在，轮询历史mac
#                     #5、如果历史mac也为空，或者1-4都未获得ead信息，则ead信息置为空。
#                     ead_flag = 0  #0表示没有获得ead信息
#                     if int_obj.interface_ip!='':  #实时ip
#                         ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip)#轮询实时ip
#                         for ip in ip_list:
#                             ead_info = get_ead_info(ip,'ip')  #ead_info ：dict
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1 #1表示获得ead信息了
#                                 break
#                     if ead_flag == 0 and int_obj.mac != '': #实时mac
#                         mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac)#轮询实时mac
#                         for mac in mac_list:
#                             ead_info = get_ead_info(mac,'mac')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1
#                                 break
#                     if ead_flag == 0 and int_obj.interface_ip_history != '':  #历史ip
#                         ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip_history)#轮询历史ip
#                         for ip in ip_list:
#                             ead_info = get_ead_info(ip,'ip')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1
#                                 break
#                     if ead_flag == 0 and int_obj.mac_history != '':  #历史mac
#                         mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac_history)#轮询历史mac
#                         for mac in mac_list:
#                             ead_info = get_ead_info(mac,'mac')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1
#                                 break
#                     update_datas.append(int_dict)
#                 else:#如果没有白名单信息
#                     #vlan。按照自动采集获得的vlan号id去vlan表里匹配。能匹配到啥算啥。
#                     vlan_objs = Vlan.objects.filter(vlan_id = int_obj.vlan)
#                     if vlan_objs:
#                         vlan_obj = vlan_objs[0]
#                         vlan_dict = obj_to_dict_same_field_name(vlan_obj,'vlan_')
#                         dictMerge = dict(int_dict,**vlan_dict)
#                         int_dict = dictMerge
#                     #EAD
#                     # 获得ead信息的逻辑：同上
#                     ead_flag = 0  #0表示没有获得ead信息
#                     if int_obj.interface_ip!='':  #实时ip
#                         ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip)#轮询实时ip
#                         for ip in ip_list:
#                             ead_info = get_ead_info(ip,'ip')  #ead_info ：dict
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1 #1表示获得ead信息了
#                                 break
#                     if ead_flag == 0 and int_obj.mac != '': #实时mac
#                         mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac)#轮询实时mac
#                         for mac in mac_list:
#                             ead_info = get_ead_info(mac,'mac')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1
#                                 break
#                     if ead_flag == 0 and int_obj.interface_ip_history != '':  #历史ip
#                         ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip_history)#轮询历史ip
#                         for ip in ip_list:
#                             ead_info = get_ead_info(ip,'ip')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1
#                                 break
#                     if ead_flag == 0 and int_obj.mac_history != '':  #历史mac
#                         mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac_history)#轮询历史mac
#                         for mac in mac_list:
#                             ead_info = get_ead_info(mac,'mac')
#                             if len(ead_info)>0:
#                                 dictMerge = dict(int_dict,**ead_info)
#                                 int_dict = dictMerge
#                                 ead_flag = 1
#                                 break
#                     update_datas.append(int_dict)
#             #把update_datas存入数据库
#             if len(update_datas)>0:
#                 del_ps_objs = PortStatus.objects.all()
#                 for del_ps_obj in del_ps_objs:
#                     del_ps_obj.delete()  #先清空，再入库
#                 # print('开始入库：')
#                 for data in update_datas:
#                     # print('data:',data)
#                     ps_obj = PortStatus()
#                     for key in data:
#                         if key == 'update_time':
#                             ps_obj.staticip_update_time = data['update_time']
#                         else:
#                             setattr(ps_obj,key,data[key])
#                     ps_obj.save()
#                 return HttpResponse('同步成功！', status=status.HTTP_200_OK)
#             else:
#                 return HttpResponse('同步失败！无更新数据！', status=status.HTTP_204_NO_CONTENT)
#         else:
#             return HttpResponse('同步失败！无端口接入数据！', status=status.HTTP_204_NO_CONTENT)
#     except Exception as e:
#         # print(e)
#         return HttpResponse(str(e), status=status.HTTP_400_BAD_REQUEST)


# # def port_status_update(request):
# #     try:
# #         update_datas = []
# #         int_objs = Interface.objects.all()
# #         if int_objs:
# #             for int_obj in int_objs:
# #                 results = {}
# #                 results['Interface_ip'] = int_obj.ip
# #                 results['Interface_name'] = int_obj.name
# #                 results['Interface_status'] = int_obj.status
# #                 results['Interface_status_reason'] = int_obj.status_reason
# #                 results['Interface_show_run'] = int_obj.show_run
# #                 results['Interface_mac'] = int_obj.mac
# #                 results['Interface_mac_history'] = int_obj.mac_history
# #                 results['Interface_interface_ip'] = int_obj.interface_ip
# #                 results['Interface_interface_ip_history'] = int_obj.interface_ip_history
# #                 results['Interface_vlan'] = int_obj.vlan
# #                 results['Interface_auth_type'] = int_obj.auth_type
# #                 results['Interface_log_status'] = int_obj.log_status
# #                 results['Interface_log_time'] = int_obj.log_time
# #                 results['Interface_update_time'] = int_obj.update_time
# #                 # print('采集ip:',results['Interface_interface_ip'])
# #                 # print('采集mac:',results['Interface_mac'])
# #                 ip_objs = StaticIP.objects.filter(interface = int_obj).filter(show_status = '0')
# #                 if ip_objs:
# #                     for ip_obj in ip_objs:
# #                         results['ip'] = ip_obj.ip
# #                         results['mac'] = ip_obj.mac
# #                         results['user'] = ip_obj.user
# #                         results['account'] = ip_obj.account
# #                         results['head_office'] = ip_obj.head_office
# #                         results['tel'] = ip_obj.tel
# #                         results['location'] = ip_obj.location
# #                         results['info_id'] = ip_obj.info_id
# #                         results['terminal_type'] = ip_obj.terminal_type
# #                         results['asset'] = ip_obj.asset
# #                         results['application'] = ip_obj.application
# #                         results['app_ip'] = ip_obj.app_ip
# #                         results['app_interface'] = ip_obj.app_interface
# #                         results['reason'] = ip_obj.reason
# #                         results['exist'] = ip_obj.exist
# #                         results['note'] = ip_obj.note
# #                         results['assign_time'] = ip_obj.assign_time
# #                         results['assign_user'] = ip_obj.assign_user
# #                         # results['delete_time'] = ip_obj.delete_time
# #                         # results['delete_user'] = ip_obj.delete_user
# #                         # results['show_status'] = ip_obj.show_status
# #                         results['operator'] = ip_obj.operator
# #                         results['staticip_update_time'] = ip_obj.update_time
# #                         department_name = ip_obj.department.department_name
# #                         area = ip_obj.department.area
# #                         results['department_name'] = department_name
# #                         results['area'] = area
# #                         results['device_name'] = int_obj.device.dev_name
# #                         vlan_obj = get_vlan_by_ip(ip_obj.ip)
# #                         if vlan_obj:
# #                             results['Vlan_vlan_id'] = vlan_obj.vlan_id
# #                         else:
# #                             results['Vlan_vlan_id'] = ''
# #
# #                         #获得ead信息的逻辑：
# #                         #1、如果实时ip存在，则轮询实时ip获得ead信息
# #                         #2、如果1未获得ead信息，则如果实时mac存在，轮询实时mac获得ead信息
# #                         #3、如果2也未获得ead信息，则如果历史ip存在，轮询历史ip
# #                         #4、如果3也没有获得，则如果历史mac存在，轮询历史mac
# #                         #5、如果历史mac也为空，或者1-4都未获得ead信息，则ead信息置为空。
# #                         ead_flag = 0  #0表示没有获得ead信息
# #                         if int_obj.interface_ip!='':
# #                             ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip)#轮询实时ip
# #                             for ip in ip_list:
# #                                 ead_info = get_ead_info(ip,'ip')  #ead_info ：dict
# #                                 if len(ead_info)>0:
# #                                     results['EAD_userName'] = ead_info['EAD_userName']
# #                                     results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                     results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                     results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                     results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                     results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                     ead_flag = 1 #1表示获得ead信息了
# #                                     break
# #                         if ead_flag == 0 and int_obj.mac != '':
# #                             mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac)#轮询实时mac
# #                             for mac in mac_list:
# #                                 ead_info = get_ead_info(mac,'mac')
# #                                 if len(ead_info)>0:
# #                                     results['EAD_userName'] = ead_info['EAD_userName']
# #                                     results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                     results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                     results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                     results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                     results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0 and int_obj.interface_ip_history != '':
# #                             ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip_history)#轮询历史ip
# #                             for ip in ip_list:
# #                                 ead_info = get_ead_info(ip,'ip')
# #                                 if len(ead_info)>0:
# #                                     results['EAD_userName'] = ead_info['EAD_userName']
# #                                     results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                     results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                     results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                     results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                     results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0 and int_obj.mac_history != '':
# #                             mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac_history)#轮询历史mac
# #                             for mac in mac_list:
# #                                 ead_info = get_ead_info(mac,'mac')
# #                                 if len(ead_info)>0:
# #                                     results['EAD_userName'] = ead_info['EAD_userName']
# #                                     results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                     results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                     results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                     results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                     results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0:
# #                             results['EAD_userName'] = ''
# #                             results['EAD_fullName'] = ''
# #                             results['EAD_osVersion'] = ''
# #                             results['EAD_terminalVendor'] = ''
# #                             results['EAD_terminalType'] = ''
# #                             results['EAD_serviceTemplateName'] = ''
# #                         # print('result应用ip:',results['Interface_interface_ip'])
# #                         update_datas.append(results)
# #                 else:
# #                     results['ip'] = ''
# #                     results['mac'] = ''
# #                     results['user'] = ''
# #                     results['account'] = ''
# #                     results['head_office'] = ''
# #                     results['tel'] = ''
# #                     results['location'] = ''
# #                     results['info_id'] = ''
# #                     results['terminal_type'] = ''
# #                     results['asset'] = ''
# #                     results['application'] = ''
# #                     results['app_ip'] = ''
# #                     results['app_interface'] = ''
# #                     results['reason'] = ''
# #                     results['exist'] = ''
# #                     results['note'] = ''
# #                     results['assign_time'] = ''
# #                     results['assign_user'] = ''
# #                     # results['delete_time'] = ''
# #                     # results['delete_user'] = ''
# #                     # results['show_status'] = ''
# #                     results['operator'] = ''
# #                     results['staticip_update_time'] = ''
# #                     results['department_name'] = ''
# #                     results['area'] = ''
# #                     device_name = int_obj.device.dev_name
# #                     results['device_name'] = device_name
# #                     results['Vlan_vlan_id'] = ''
# #
# #                     #获得ead信息：
# #                     ead_flag = 0  #0表示没有获得ead信息
# #                     if int_obj.interface_ip!='':
# #                         ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip)#轮询实时ip
# #                         for ip in ip_list:
# #                             ead_info = get_ead_info(ip,'ip')  #ead_info ：dict
# #                             if len(ead_info)>0:
# #                                 results['EAD_userName'] = ead_info['EAD_userName']
# #                                 results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                 results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                 results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                 results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                 results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                 ead_flag = 1 #1表示获得ead信息了
# #                                 break
# #                     if ead_flag == 0 and int_obj.mac != '':
# #                         mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac)#轮询实时mac
# #                         for mac in mac_list:
# #                             ead_info = get_ead_info(mac,'mac')
# #                             if len(ead_info)>0:
# #                                 results['EAD_userName'] = ead_info['EAD_userName']
# #                                 results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                 results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                 results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                 results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                 results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                 ead_flag = 1
# #                                 break
# #                     if ead_flag == 0 and int_obj.interface_ip_history != '':
# #                         ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip_history)#轮询历史ip
# #                         for ip in ip_list:
# #                             ead_info = get_ead_info(ip,'ip')
# #                             if len(ead_info)>0:
# #                                 results['EAD_userName'] = ead_info['EAD_userName']
# #                                 results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                 results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                 results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                 results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                 results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                 ead_flag = 1
# #                                 break
# #                     if ead_flag == 0 and int_obj.mac_history != '':
# #                         mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac_history)#轮询历史mac
# #                         for mac in mac_list:
# #                             ead_info = get_ead_info(mac,'mac')
# #                             if len(ead_info)>0:
# #                                 results['EAD_userName'] = ead_info['EAD_userName']
# #                                 results['EAD_fullName'] = ead_info['EAD_fullName']
# #                                 results['EAD_osVersion'] = ead_info['EAD_osVersion']
# #                                 results['EAD_terminalVendor'] = ead_info['EAD_terminalVendor']
# #                                 results['EAD_terminalType'] = ead_info['EAD_terminalType']
# #                                 results['EAD_serviceTemplateName'] = ead_info['EAD_serviceTemplateName']
# #                                 ead_flag = 1
# #                                 break
# #                     if ead_flag == 0:
# #                         results['EAD_userName'] = ''
# #                         results['EAD_fullName'] = ''
# #                         results['EAD_osVersion'] = ''
# #                         results['EAD_terminalVendor'] = ''
# #                         results['EAD_terminalType'] = ''
# #                         results['EAD_serviceTemplateName'] = ''
# #                     # print('result应用ip:',results['Interface_interface_ip'])
# #                     update_datas.append(results)
# #             if len(update_datas)>0:
# #                 # print('开始入库：')
# #                 del_ps_objs = PortStatus.objects.all()
# #                 for del_ps_obj in del_ps_objs:
# #                     del_ps_obj.delete()  #先清空，再入库
# #                 for data in update_datas:
# #                     # print('data:',data)
# #                     ps_obj = PortStatus()
# #                     ps_obj.Interface_ip = data['Interface_ip']
# #                     ps_obj.Interface_name = data['Interface_name']
# #                     ps_obj.Interface_status = data['Interface_status']
# #                     ps_obj.Interface_status_reason = data['Interface_status_reason']
# #                     ps_obj.Interface_show_run = data['Interface_show_run']
# #                     ps_obj.Interface_mac = data['Interface_mac']
# #                     ps_obj.Interface_mac_history = data['Interface_mac_history']
# #                     ps_obj.Interface_interface_ip = data['Interface_interface_ip']
# #                     ps_obj.Interface_interface_ip_history = data['Interface_interface_ip_history']
# #                     ps_obj.Interface_vlan = data['Interface_vlan']
# #                     ps_obj.Interface_auth_type = data['Interface_auth_type']
# #                     ps_obj.Interface_log_status = data['Interface_log_status']
# #                     ps_obj.Interface_log_time = data['Interface_log_time']
# #                     ps_obj.Interface_update_time = data['Interface_update_time']
# #                         # .strftime("%Y-%m-%d %H:%M:%S")
# #                     ps_obj.device_name = data['device_name']
# #                     ps_obj.EAD_userName = data['EAD_userName']
# #                     ps_obj.EAD_fullName = data['EAD_fullName']
# #                     ps_obj.EAD_osVersion = data['EAD_osVersion']
# #                     ps_obj.EAD_terminalVendor = data['EAD_terminalVendor']
# #                     ps_obj.EAD_terminalType = data['EAD_terminalType']
# #                     ps_obj.EAD_serviceTemplateName = data['EAD_serviceTemplateName']
# #                     ps_obj.ip = data['ip']
# #                     ps_obj.mac = data['mac']
# #                     ps_obj.user = data['user']
# #                     ps_obj.account = data['account']
# #                     ps_obj.head_office = data['head_office']
# #                     ps_obj.tel = data['tel']
# #                     ps_obj.location = data['location']
# #                     ps_obj.info_id = data['info_id']
# #                     ps_obj.terminal_type = data['terminal_type']
# #                     ps_obj.asset = data['asset']
# #                     ps_obj.application = data['application']
# #                     ps_obj.app_ip = data['app_ip']
# #                     ps_obj.app_interface = data['app_interface']
# #                     ps_obj.reason = data['reason']
# #                     ps_obj.exist = data['exist']
# #                     ps_obj.note = data['note']
# #                     ps_obj.assign_time = data['assign_time']
# #                     ps_obj.assign_user = data['assign_user']
# #                     # ps_obj.delete_time = data['delete_time']
# #                     # ps_obj.delete_user = data['delete_user']
# #                     # ps_obj.show_status = data['show_status']
# #                     ps_obj.operator = data['operator']
# #                     ps_obj.staticip_update_time = data['staticip_update_time']
# #                     ps_obj.department_name = data['department_name']
# #                     ps_obj.area = data['area']
# #                     ps_obj.Vlan_vlan_id = data['Vlan_vlan_id']
# #                     ps_obj.save()
# #                     # print('应用ip:',ps_obj.Interface_interface_ip)
# #                 return HttpResponse('success', status=status.HTTP_200_OK)
# #             else:
# #                 return HttpResponse('no update data', status=status.HTTP_204_NO_CONTENT)
# #         else:
# #             return HttpResponse('no portconfiger_interface datas', status=status.HTTP_204_NO_CONTENT)
# #     except Exception as e:
# #         # print(e)
# #         return HttpResponse(str(e), status=status.HTTP_400_BAD_REQUEST)


# # @request_statistic
# # @login_required
# # def port_status_list(request):
# #     if request.method == 'GET':
# #         return render(request,'oa_vlan_assign/port_status_list.html')
# #     elif request.method == 'POST':
# #         ps_objs_list = []
# #         try:
# #             ps_objs = PortStatus.objects.all()
# #             # print('PortStatus长度:',len(ps_objs))
# #             ps_objs_list = obj_list_to_dict_list(ps_objs)
# #             # for ps_obj in ps_objs:
# #             #     ps_obj_dict = obj_to_dict(ps_obj)
# #             #     ps_objs_list.append(ps_obj_dict)
# #             # print('length of result:',len(ps_objs_list))
# #         except Exception as e:
# #             # print(e)
# #             return HttpResponse(str(e))
# #         return HttpResponse(json.dumps(ps_objs_list, cls=CJsonEncoder))

# # @request_statistic
# # @login_required
# # #端口接入信息列表显示（采用四表实时关联）
# # def port_status_list(request):
# #     if request.method == 'GET':
# #         return render(request,'campus_aiops/port_status_list.html')
# #     elif request.method == 'POST':
# #         datas = []
# #         ps_index_dict = {}
# #         ps_objs_list = []
# #         try:
# #             #获得地域列表
# #             area_list = []
# #             area_list = get_area1_by_tags()  #给下拉列表用，格式：地域|地域编号
# #             ps_index_dict['area_list'] = area_list
# #
# #             int_objs = Interface.objects.all()
# #             if int_objs:
# #                 for int_obj in int_objs:
# #                     #interface表
# #                     int_dict  = obj_to_dict_same_field_name(int_obj, 'interface_')
# #                     #交换机名
# #                     device = int_obj.device
# #                     int_dict['device_name'] = device.dev_name
# #                     #白名单表
# #                     ip_objs = StaticIP.objects.filter(interface = int_obj).filter(show_status = '0')
# #                     if ip_objs:
# #                         ip_obj = ip_objs[0]  #一个交换机ip和端口应该是唯一确定一个白名单的。所以取第一个就行了。
# #                         ip_dict = obj_to_dict(ip_obj)
# #                         dictMerge = dict(int_dict,**ip_dict)
# #
# #                         #vlan
# #                         vlan_dict = obj_to_dict_same_field_name(ip_obj.vlan,'vlan_')
# #                         dictMerge = dict(dictMerge,**vlan_dict)
# #
# #                         #EAD
# #                         # 获得ead信息的逻辑：
# #                         #1、如果实时ip存在，则轮询实时ip获得ead信息
# #                         #2、如果1未获得ead信息，则如果实时mac存在，轮询实时mac获得ead信息
# #                         #3、如果2也未获得ead信息，则如果历史ip存在，轮询历史ip
# #                         #4、如果3也没有获得，则如果历史mac存在，轮询历史mac
# #                         #5、如果历史mac也为空，或者1-4都未获得ead信息，则ead信息置为空。
# #                         ead_flag = 0  #0表示没有获得ead信息
# #                         if int_obj.interface_ip!='':  #实时ip
# #                             ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip)#轮询实时ip
# #                             for ip in ip_list:
# #                                 ead_info = get_ead_info(ip,'ip')  #ead_info ：dict
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(dictMerge,**ead_info)
# #                                     ead_flag = 1 #1表示获得ead信息了
# #                                     break
# #                         if ead_flag == 0 and int_obj.mac != '': #实时mac
# #                             mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac)#轮询实时mac
# #                             for mac in mac_list:
# #                                 ead_info = get_ead_info(mac,'mac')
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(dictMerge,**ead_info)
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0 and int_obj.interface_ip_history != '':  #历史ip
# #                             ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip_history)#轮询历史ip
# #                             for ip in ip_list:
# #                                 ead_info = get_ead_info(ip,'ip')
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(dictMerge,**ead_info)
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0 and int_obj.mac_history != '':  #历史mac
# #                             mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac_history)#轮询历史mac
# #                             for mac in mac_list:
# #                                 ead_info = get_ead_info(mac,'mac')
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(dictMerge,**ead_info)
# #                                     ead_flag = 1
# #                                     break
# #                         ps_objs_list.append(dictMerge)
# #
# #                     else:  #如果没有白名单信息
# #                         #vlan。按照自动采集获得的vlan号id去vlan表里匹配。能匹配到啥算啥。
# #                         vlan_objs = Vlan.objects.filter(vlan_id = int_obj.vlan)
# #                         if vlan_objs:
# #                             vlan_obj = vlan_objs[0]
# #                             vlan_dict = obj_to_dict_same_field_name(vlan_obj,'vlan_')
# #                             dictMerge = dict(int_dict,**vlan_dict)
# #                             int_dict = dictMerge
# #
# #                         #notes：如果找不到vlan信息，是否可以根据交换机找到地域信息?因为上传园区设备时有录入地域信息。确认下interface里的交换机是不是接入交换机。
# #
# #                         #EAD
# #                         # 获得ead信息的逻辑：同上
# #                         ead_flag = 0  #0表示没有获得ead信息
# #                         if int_obj.interface_ip!='':  #实时ip
# #                             ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip)#轮询实时ip
# #                             for ip in ip_list:
# #                                 ead_info = get_ead_info(ip,'ip')  #ead_info ：dict
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(int_dict,**ead_info)
# #                                     int_dict = dictMerge
# #                                     ead_flag = 1 #1表示获得ead信息了
# #                                     break
# #                         if ead_flag == 0 and int_obj.mac != '': #实时mac
# #                             mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac)#轮询实时mac
# #                             for mac in mac_list:
# #                                 ead_info = get_ead_info(mac,'mac')
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(int_dict,**ead_info)
# #                                     int_dict = dictMerge
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0 and int_obj.interface_ip_history != '':  #历史ip
# #                             ip_list = get_addrlist_from_portconfiger_interface(int_obj.interface_ip_history)#轮询历史ip
# #                             for ip in ip_list:
# #                                 ead_info = get_ead_info(ip,'ip')
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(int_dict,**ead_info)
# #                                     int_dict = dictMerge
# #                                     ead_flag = 1
# #                                     break
# #                         if ead_flag == 0 and int_obj.mac_history != '':  #历史mac
# #                             mac_list = get_addrlist_from_portconfiger_interface(int_obj.mac_history)#轮询历史mac
# #                             for mac in mac_list:
# #                                 ead_info = get_ead_info(mac,'mac')
# #                                 if len(ead_info)>0:
# #                                     dictMerge = dict(int_dict,**ead_info)
# #                                     int_dict = dictMerge
# #                                     ead_flag = 1
# #                                     break
# #                         ps_objs_list.append(int_dict)
# #             ps_index_dict['ps_objs_list'] = ps_objs_list
# #             datas.append(ps_index_dict)
# #         except Exception as e:
# #             # print(e)
# #             return HttpResponse(str(e))
# #         return HttpResponse(json.dumps(datas, cls=CJsonEncoder))


# @request_statistic
# @login_required
# #获得地域列表
# def area_list(request):
#     if request.method == 'POST':
#         area_list = []
#         area_list = get_area1_by_tags()  #给下拉列表用，格式：地域|地域编号
#         return HttpResponse(json.dumps(area_list, cls=CJsonEncoder))

# @request_statistic
# @login_required
# #端口接入查询
# def port_status_search(request):
#     if request.method == 'POST':
#         ps_search_results = []
#         try:
#             mode = request.POST['mode']
#             area = request.POST['area']  #前台传过来的格式是“地域|地域编号”，只取地域编号去库里查即可
#             area_no = str(area).split('|')[-1]
#             status= request.POST['status']  #up、down、administratively down
#             addrs = request.POST.getlist('addr[]')

#             searchCondition = {'interface_mode__icontains':mode,'area_no__icontains':area_no,'interface_status__icontains':status}
#             kwargs = getKwargs(searchCondition)

#             if len(addrs)>0:
#                 for addr in addrs:  #改成轮询每一个地址
#                     if re.match("^\d+(\.\d+){3}$", addr):
#                         ps_objs = PortStatus.objects.filter(Interface_interface_ip = addr).filter(**kwargs)
#                         if ps_objs:
#                             for ps_obj in ps_objs:
#                                 ps_obj_dict = obj_to_dict(ps_obj)
#                                 ps_search_results.append(ps_obj_dict)
#                     elif re.match('^([0-9a-fA-F]{2})(([:-][0-9a-fA-F]{2}){5})$', addr): #匹配mac，只支持三种格式：6c0b.8445.0941，6c:0b:84:45:09:41和6c-0b-84-45-09-41（前台说明一下）
#                         mac = mac_convert(addr)#先进行格式转换，都转成6c0b.8445.0941格式。
#                         ps_objs = PortStatus.objects.filter(Interface_mac = mac).filter(**kwargs)
#                         if ps_objs:
#                             for ps_obj in ps_objs:
#                                 ps_obj_dict = obj_to_dict(ps_obj)
#                                 ps_search_results.append(ps_obj_dict)
#                     elif re.match('^([0-9a-fA-F]{4})((\.[0-9a-fA-F]{4}){2})$', addr):  #数据库里存的都是这种格式6c0b.8445.0941
#                         ps_objs = PortStatus.objects.filter(Interface_mac = addr).filter(**kwargs)
#                         if ps_objs:
#                             for ps_obj in ps_objs:
#                                 ps_obj_dict = obj_to_dict(ps_obj)
#                                 ps_search_results.append(ps_obj_dict)
#                     else:
#                         continue
#                         # return HttpResponse('地址格式错误！')
#             else: #没有输入多个地址进行查询，则只对除地址外其他条件做且的查询即可。
#                 ps_objs = PortStatus.objects.filter(**kwargs)
#                 if ps_objs:
#                     for ps_obj in ps_objs:
#                         ps_obj_dict = obj_to_dict(ps_obj)
#                         ps_search_results.append(ps_obj_dict)
#         except Exception as e:
#             # print(e)
#             return HttpResponse(str(e))
#         return HttpResponse(json.dumps(ps_search_results, cls=CJsonEncoder))

# @request_statistic
# @login_required
# #端口接入信息下载（采用PortStatus大表）。只下载部分字段（按需求方的需求）
# def port_status_download(request):
#     #excel导出的话会因历史mac太长而报错。使用csv导出
#     if request.method == 'POST':
#         try:
#             ps_ids = request.POST.getlist('id[]')
#             if ps_ids:
#                 ps_objs = PortStatus.objects.filter(id__in=ps_ids)
#             else:
#                 ps_objs = PortStatus.objects.all()
#             if ps_objs:
#                 response = http.HttpResponse(content_type='text/csv')
#                 response['Content-Disposition'] = 'attachment;filename="all_port_status.csv"'
#                 response.write(codecs.BOM_UTF8)  #支持中文
#                 writer = csv.writer(response)
#                 writer.writerow(
#                         ['交换机IP','交换机端口','端口类型','admin状态','admin状态原因'
#                 ,'show run配置','mac（采集）','历史mac','arp（采集）','历史arp','vlan（采集）','认证模式','日志端口状态','日志时间','更新时间（采集）'
#                 ,'交换机名','地域','地域编号','员工号-EAD','员工姓名-EAD','操作系统-EAD','终端品牌-EAD','终端类型-EAD','所属部门-EAD','更新时间-EAD',
#                                 'IP地址','MAC地址','IP使用人','域账号','人员类别','联系电话','工位号','信息点号','终端类型','是否行内资产'
#                 ,'访问后台系统名称','后台系统IP','访问后台端口','未准入原因（白名单类别）','是否在白名单中','备注','分配日期','分配人',
#                                 '操作人','更新时间（白名单）',
#                                 'vlan（计算）','部门名','更新时间（vlan）','更新时间(同步)'])

#                 for ps_obj in ps_objs:
#                     writer.writerow([ps_obj.interface_ip,ps_obj.interface_name,ps_obj.interface_mode,ps_obj.interface_status,ps_obj.interface_status_reason,
#                                      ps_obj.interface_show_run,ps_obj.interface_mac,ps_obj.interface_mac_history,ps_obj.interface_interface_ip,ps_obj.interface_interface_ip_history,ps_obj.interface_vlan
#                 ,ps_obj.interface_auth_type,ps_obj.interface_log_status,ps_obj.interface_log_time,ps_obj.interface_update_time,
#                                      ps_obj.device_name,ps_obj.area_name,ps_obj.area_no,ps_obj.ead_user_name,ps_obj.ead_full_name,ps_obj.ead_os_version,ps_obj.ead_terminal_vendor
#                 ,ps_obj.ead_terminal_type,ps_obj.ead_service_template_name,ps_obj.ead_update_time,
#                                      ps_obj.ip,ps_obj.mac,ps_obj.user,ps_obj.account,ps_obj.head_office,ps_obj.tel,ps_obj.location
#                 ,ps_obj.info_id,ps_obj.terminal_type,ps_obj.asset,ps_obj.application,ps_obj.app_ip,ps_obj.app_interface,ps_obj.reason,ps_obj.exist,ps_obj.note
#                 ,ps_obj.assign_time,ps_obj.assign_user,ps_obj.operator,ps_obj.staticip_update_time,
#                                      ps_obj.area,ps_obj.vlan_vlan_id,ps_obj.vlan_department_name,ps_obj.vlan_update_time,ps_obj.update_time.strftime("%Y-%m-%d %H:%M:%S")])
#                 return response
#             else:
#                 return HttpResponse('导出失败！没有可导出的内容！')
#         except Exception as e:
#             return HttpResponse('导出失败！fail to download csv due to:'+str(e))

# # @request_statistic
# # @login_required
# #对大表PortStatus直接下载
# # def port_status_download(request):
# #     #excel导出，历史mac字段过长会报错。
# #     # if request.method == 'POST':
# #     #     try:
# #     #         ps_ids = json.loads(request.POST['datas'])
# #     #         if ps_ids:
# #     #             ps_objs = PortStatus.objects.filter(id__in=ps_ids)
# #     #         else:
# #     #             ps_objs = PortStatus.objects.all()
# #     #         if ps_objs:
# #     #
# #     #             excel_header = ['交换机IP','交换机端口','admin状态','admin状态原因'
# #     #             ,'show run配置','mac（采集）','历史mac','arp（采集）','历史arp','vlan（采集）','认证模式','日志端口状态','日志时间','更新时间（采集）'
# #     #             ,'交换机名','EAD_userName','EAD_fullName','EAD_osVersion','EAD_terminalVendor','EAD_terminalType','EAD_serviceTemplateName',
# #     #                             'IP地址','MAC地址','IP使用人','域账号','人员类别','联系电话','工位号','信息点号','终端类型','是否行内资产'
# #     #             ,'访问后台系统名称','后台系统IP','访问后台端口','未准入原因（白名单类别）','是否在白名单中','备注','分配日期','分配人',
# #     #                             '操作人','人工分配时间','部门名','地域','vlan（计算）','更新时间']
# #     #             ps_fields = ['Interface_ip','Interface_name','Interface_status','Interface_status_reason','Interface_show_run','Interface_mac','Interface_mac_history','Interface_interface_ip','Interface_interface_ip_history','Interface_vlan'
# #     #             ,'Interface_auth_type','Interface_log_status','Interface_log_time','Interface_update_time','device_name','EAD_userName','EAD_fullName','EAD_osVersion','EAD_terminalVendor'
# #     #             ,'EAD_terminalType','EAD_serviceTemplateName','ip','mac','user','account','head_office','tel','location'
# #     #             ,'info_id','terminal_type','asset','application','app_ip','app_interface','reason','exist','note'
# #     #             ,'assign_time','assign_user','operator','staticip_update_time','department_name','area','Vlan_vlan_id','update_time']
# #     #             row_list = []
# #     #             for ps_obj in ps_objs:
# #     #                 ps_row_list = []
# #     #                 for ps_field in ps_fields:
# #     #                     if ps_field == 'update_time':
# #     #                         ut = getattr(ps_obj, ps_field)
# #     #                         ut_str = ut.strftime("%Y-%m-%d %H:%M:%S")
# #     #                         ps_row_list.append(ut_str)
# #     #                     else:
# #     #                         ps_row_list.append(getattr(ps_obj,ps_field) if getattr(ps_obj,ps_field) else '')
# #     #                 row_list.append(ps_row_list)
# #     #         else:
# #     #             return HttpResponse('没有可导出的内容！')
# #     #     except Exception as e :
# #     #         # print(e)
# #     #         return HttpResponse(e)
# #     #     return save_excel_to_response(excel_header=excel_header, row_list=row_list, sheet_name='端口状态信息', filename='oa_port_status.xls')
# #
# #
# #     #csv导出
# #     if request.method == 'POST':
# #         try:
# #             ps_ids = request.POST.getlist('id[]')
# #             if ps_ids:
# #                 ps_objs = PortStatus.objects.filter(id__in=ps_ids)
# #             else:
# #                 ps_objs = PortStatus.objects.all()
# #             if ps_objs:
# #                 response = http.HttpResponse(content_type='text/csv')
# #                 response['Content-Disposition'] = 'attachment;filename="all_port_status.csv"'
# #                 response.write(codecs.BOM_UTF8)  #支持中文
# #                 writer = csv.writer(response)
# #                 writer.writerow(
# #                         ['交换机IP','交换机端口','admin状态','admin状态原因'
# #                 ,'show run配置','mac（采集）','历史mac','arp（采集）','历史arp','vlan（采集）','认证模式','日志端口状态','日志时间','更新时间（采集）'
# #                 ,'交换机名','员工号-EAD','员工姓名-EAD','操作系统-EAD','终端品牌-EAD','终端类型-EAD','所属部门-EAD',
# #                                 'IP地址','MAC地址','IP使用人','域账号','人员类别','联系电话','工位号','信息点号','终端类型','是否行内资产'
# #                 ,'访问后台系统名称','后台系统IP','访问后台端口','未准入原因（白名单类别）','是否在白名单中','备注','分配日期','分配人',
# #                                 '操作人','人工分配时间','部门名','地域','vlan（计算）','更新时间'])
# #
# #                 for ps_obj in ps_objs:
# #                     writer.writerow([ps_obj.Interface_ip,ps_obj.Interface_name,ps_obj.Interface_status,ps_obj.Interface_status_reason,ps_obj.Interface_show_run,ps_obj.Interface_mac,ps_obj.Interface_mac_history,ps_obj.Interface_interface_ip,ps_obj.Interface_interface_ip_history,ps_obj.Interface_vlan
# #                 ,ps_obj.Interface_auth_type,ps_obj.Interface_log_status,ps_obj.Interface_log_time,ps_obj.Interface_update_time,ps_obj.device_name,ps_obj.EAD_userName,ps_obj.EAD_fullName,ps_obj.EAD_osVersion,ps_obj.EAD_terminalVendor
# #                 ,ps_obj.EAD_terminalType,ps_obj.EAD_serviceTemplateName,ps_obj.ip,ps_obj.mac,ps_obj.user,ps_obj.account,ps_obj.head_office,ps_obj.tel,ps_obj.location
# #                 ,ps_obj.info_id,ps_obj.terminal_type,ps_obj.asset,ps_obj.application,ps_obj.app_ip,ps_obj.app_interface,ps_obj.reason,ps_obj.exist,ps_obj.note
# #                 ,ps_obj.assign_time,ps_obj.assign_user,ps_obj.operator,ps_obj.staticip_update_time,ps_obj.department_name,ps_obj.area,ps_obj.Vlan_vlan_id,ps_obj.update_time.strftime("%Y-%m-%d %H:%M:%S")])
# #                 return response
# #             else:
# #                 return HttpResponse('没有可导出的内容！')
# #         except Exception as e:
# #             return HttpResponse('fail to download csv due to:'+str(e))

# @request_statistic
# @login_required
# #园区设备列表
# def dev_list(request):
#     if request.method == 'GET':
#         return render(request,'campus_aiops/dev_list.html')
#     elif request.method == 'POST':
#         try:
#             datas = []
#             dev_index_dict = {}

#             #获得地域列表
#             area_list = []
#             area_list = get_area1_by_tags()  #给搜索条件用，格式：地域|地域编号
#             # print('area_list:',area_list)
#             dev_index_dict['area_list'] = area_list

#             #获得设备集合
#             group = 'campus'
#             devices = get_device_tag_by_group(group) #list
#             if len(devices)>0:
#                 dev_index_dict['device_list'] = devices

#             datas.append(dev_index_dict)
#             return HttpResponse(json.dumps(datas, cls=CJsonEncoder))
#         except Exception as e:
#             # print(e)
#             return HttpResponse(str(e))

# @request_statistic
# @login_required
# #园区设备查询（地域查询）
# def dev_search(request):
#     if request.method == 'POST':
#         try:
#             datas = []
#             area = request.POST['area']   #area格式为：地域|地域编号
#             group = 'campus'
#             datas = get_devices_by_area(area,group)
#             return HttpResponse(json.dumps(datas, cls=CJsonEncoder))
#         except Exception as e:
#             return HttpResponse(str(e))

# @request_statistic
# @login_required
# #参考文档与模板
def reference(request):
    return render(request,'campus_aiops/reference.html')

# #【定时任务】定时更新Interface表。 （顺序1）
# @api_view(['GET', 'POST'])
# def update_all_ports_info(request):
#     #
#     # 获取端口状态（show run，获取是否admindown，是否空，mac vlan ），通过restful api
#     #
#     try:
#         # ip_list = json.load(open('upload/portconfiger/config.json','r',encoding='utf8'))['update_all_ports_info_ip_list']
#         ip_list = get_campus_ip_list()
#         # ip_list = ['22.1.253.75']
#         all_ports_info = []
#         exception_msg = []
#         for ip in ip_list:
#             one_device_ports_info = get_device_ports_status(ip)
#             if one_device_ports_info:
#                 all_ports_info.extend(one_device_ports_info)
#         for port_status in all_ports_info:
#             try:
#                 ipaddr = port_status.ip
#                 slot = port_status.slot
#                 module = port_status.module
#                 index = port_status.index
#                 mode = port_status.mode
#                 name = port_status.name
#                 type = port_status.type
#                 shutdowmstatus = port_status.status
#                 show_run = port_status.show_run
#                 mac = port_status.mac
#                 vlan = port_status.vlan
#                 interface_ip = port_status.interface_ip
#                 status_reason = port_status.status_reason
#                 device = port_status.device
#                 interface_info, create = Interface.objects.get_or_create(ip=ipaddr, name=name)
#                 if create:
#                     mac_history = ''
#                     interface_ip_history = ''
#                     show_run_lasttime = ''
#                 else:
#                         interface_ip_history = '\n'.join(set(interface_ip.split('\n'))|set(interface_info.interface_ip_history.split('\n')))
#                         mac_history = '\n'.join(set(mac.split('\n'))|set(interface_info.mac_history.split('\n')))
#                         show_run_lasttime = interface_info.show_run
#                 interface_info.slot = slot
#                 interface_info.module = module
#                 interface_info.index = index
#                 interface_info.mode = mode
#                 interface_info.name = name
#                 interface_info.type = type
#                 interface_info.status = shutdowmstatus
#                 interface_info.show_run = show_run
#                 interface_info.mac = mac
#                 interface_info.vlan = vlan
#                 interface_info.mac_history = mac_history
#                 interface_info.show_run_lasttime = show_run_lasttime
#                 interface_info.status_reason = status_reason
#                 interface_info.interface_ip = interface_ip
#                 interface_info.interface_ip_history = interface_ip_history
#                 interface_info.device = device
#                 if interface_info.status =='up':
#                     interface_info.log_status = 'up'
#                 interface_info.auth_type = get_interface_auth_type(show_run)
#                 mode_in_config = get_interface_mode_by_config(show_run)
#                 if mode_in_config !=None:
#                     interface_info.mode = mode_in_config
#                 interface_info.save()
#                 save_interface_mac_arp_history(interface_info, mac, interface_ip)
#             except Exception as e:
#                 exception_msg.append(ip +' err :'+str(e))

#         return Response('update success'+'\n'.join(exception_msg), status=status.HTTP_200_OK)

#     except Exception as e:
#         return Response(str(e), status=status.HTTP_400_BAD_REQUEST)