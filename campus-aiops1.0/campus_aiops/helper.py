__author__ = '4562363'

import ipaddress
from common_service import network_item_format
from common_service.model_helper import *
import sys
import urllib.request
import json
import re
from .models import *
from deviceassets.models import DeviceAsset, DeviceList
from device_switch.models import InterfaceConfig,Mac,Arp
from tagging.models import Tag, TaggedItem
import collections
from django.utils import timezone
from deviceassets.helper import get_ds_list
from django.db.models import Q

#给定ip地址段（格式x.x.x.0）和掩码(255.255.x.0),获取ip列表
def get_ips_by_ipsection(ip_section,ip_mask):
    # 测试例子
    # ip_section = '192.168.10.0'
    # ip_mask1 = '255.255.255.128'
    # ip_mask2 = '/25'
    # ip1 = ip_section+'/'+ip_mask1
    # ip2 = ip_section+ip_mask2
    # for ip in ip_network(ip1).hosts():
    #     print('ip:',ip)
    if re.match('^/\d+$',ip_mask):
        ip = ip_section+ip_mask
    else:
        ip = ip_section+'/'+ip_mask

    ips = list(ipaddress.ip_network(ip).hosts())
    # print(ips)
    # print('第一个ip:',ips[0])
    return ips

#给定具体ip，获得所在vlan(obj)
def get_vlan_by_ip(ip):
    vlans = Vlan.objects.all()
    for v in vlans:
        try:
            ip_section = v.ip_section #ip段
            ip_mask = v.ip_mask #ip掩码
            if re.match('^/\d+$',ip_mask):
                ips = ip_section+ip_mask
            else:
                ips = ip_section+'/'+ip_mask
            if ipaddress.ip_address(ip) in ipaddress.ip_network(ips):
                return v
        except Exception as e:
            continue
    return None

#根据ip/mac获取ead数据。flag为ip时按ip处理，为mac时按mac处理。（减少正则匹配的消耗）
#注意，mac只支持两种格式：5c:f9:dd:e6:d1:c1或5c-f9-dd-e6-d1-c1，不支持5cf9.dde6.d1c1。但目前自开发工具采集、存储的格式基本都是5cf9.dde6.d1c1，需要做格式转换（函数在common-service里）。
def get_ead_info_original(address,flag):  #旧的，暂时不用。下面有新的。
    # print('get_ead_info')
    # print('address:',address)
    # result = {}
    result = collections.OrderedDict()
    if address == '' or address == None:
        # print('无地址！')
        return result
    api_url = ''
    if flag == 'ip':
        if re.match('^\d+(\.\d+){3}$',address):
            api_url='imcrs/uam/online/detail?framedIp=%s&showDeployUserGroup=false'%address
        else:
            return {}
    if flag == 'mac':
        if re.match('^([0-9a-fA-F]{2})(([:-][0-9a-fA-F]{2}){5})$',address) or re.match('^([0-9a-fA-F]{4})((\.[0-9a-fA-F]{4}){2})$',address):
            address = network_item_format.mac_format_for_ead(address)
            api_url='imcrs/uam/online/detail?macAddress=%s&showDeployUserGroup=false'%address
        else:
            return {}
    imc_url_hh = '22.122.51.80:8080/'
    imc_url_xd = '22.1.84.80:8080/'
    if api_url != '':
        #先试hh的ead
        # print('hh')
        result = int_ead(imc_url_hh,api_url)
        if len(result)<=0:
            #没有结果就去西单ead查询
            # print('xd')
            result = int_ead(imc_url_xd,api_url)
    return result


#辅助函数
def int_ead(imc_url,api_url):
    # print('int_ead')
    # result1 = {}
    # result2 = {}
    result1 = collections.OrderedDict()
    result2 = collections.OrderedDict()
    http_url='http://'
    usernames='admin'
    passwords='123password~~'
    authhandler = urllib.request.HTTPDigestAuthHandler()
    authhandler.add_password("iMC RESTful Web Services", http_url+imc_url, usernames, passwords)
    opener = urllib.request.build_opener(authhandler)
    urllib.request.install_opener(opener)
    # print('url:',http_url+imc_url+api_url)
    pagehandle=urllib.request.Request(http_url+imc_url+api_url)
    pagehandle.add_header('Accept', 'application/json')
    response = urllib.request.urlopen(pagehandle)
    res = response.read()
    # print('res:',res)
    # print('length of res:',len(res))
    if len(res) > 0:
        # print('存在')
        result1 = json.loads(res.decode('utf8'))
        for key,value in result1.items():
            key_new = 'EAD_'+key
            result2[key_new] = value
        # print(result2['EAD_fullName'])
        # print(result2['EAD_osVersion'])
        # print('int_ead result:',result2)
    return result2

#非实时获取ead信息，而是从数据库里读
def get_ead_info(address,flag):
    # print('address:',address)
    result = {}
    if flag == 'ip':
        if re.match('^\d+(\.\d+){3}$',address):
            ead_infos = EADInfo.objects.filter(ip = address)
            if ead_infos:
                ead_info = ead_infos[0]
                result['ead_user_name'] = ead_info.user_name
                result['ead_full_name'] = ead_info.full_name
                result['ead_os_version'] = ead_info.os_version
                result['ead_terminal_vendor'] = ead_info.terminal_vendor
                result['ead_terminal_type'] = ead_info.terminal_type
                result['ead_service_template_name'] = ead_info.service_template_name
        else:
            return {}
    if flag == 'mac':
        if re.match('^([0-9a-fA-F]{2})(([:-][0-9a-fA-F]{2}){5})$',address) or re.match('^([0-9a-fA-F]{4})((\.[0-9a-fA-F]{4}){2})$',address):
            address = network_item_format.mac_format_for_ead(address)  #转成:格式
            ead_infos = EADInfo.objects.filter(mac = address)
            if ead_infos:
                ead_info = ead_infos[0]
                result['ead_user_name'] = ead_info.user_name
                result['ead_full_name'] = ead_info.full_name
                result['ead_os_version'] = ead_info.os_version
                result['ead_terminal_vendor'] = ead_info.terminal_vendor
                result['ead_terminal_type'] = ead_info.terminal_type
                result['ead_service_template_name'] = ead_info.service_template_name
        else:
            return {}
    return result


# #检查同一地域下，vlan号和vlan名是否重复。不重复返回ok,重复返回原因。
# # 1、判断vlan_id/vlan_name在数据库表中是否存在(优先判断vlan_id，再判断vlan_name)，如果不存在，ok；如果存在，进行2.
# # 2、进行地域是否相同的判断。
# def check_vlan(vlan_id,vlan_name,area):
#     vlan_id_same = Vlan.objects.filter(vlan_id = vlan_id)
#     if vlan_id_same:
#         for v in vlan_id_same:
#             area_same = v.department.area
#             if area_same == area:
#                 return '修改失败，vlan号在当前地域下已存在！'
#     vlan_name_same = Vlan.objects.filter(vlan_name = vlan_name)
#     if vlan_name_same:
#         for v in vlan_name_same:
#             area_same = v.department.area
#             if area_same == area:
#                 return '修改失败，vlan名在当前地域下已存在！'
#     return 'ok'

# #示例：返回地域标签去重后的内容（地域字典）
# def get_tags():
#     tags_list =[]
#     tags = Tag.objects.filter(name__icontains='地域:') #“地域”是上传excel里三个字段之外字段名
#     for tag in tags:
#         tags_list.append(tag.name.split(':')[-1])
#     return tags_list

#（1）返回地域标签去重后的内容（格式：地域|地域编号）
def get_area1_by_tags():
    tags_list =[]
    tags1 = Tag.objects.filter(name__icontains='地域(campus_aiops):').order_by('id')
    tags2 = Tag.objects.filter(name__icontains='地域编号(campus_aiops):').order_by('id')
    for tag1,tag2 in zip(tags1,tags2):
        area_name = tag1.name.split(':')[-1]
        area_no = tag2.name.split(':')[-1]
        area = area_name+"|"+area_no
        tags_list.append(area)
    return tags_list

#（2）返回地域标签去重后的内容（地域）
def get_area2_by_tags():
    tags_list =[]
    tags = Tag.objects.filter(name__icontains='地域(campus_aiops):').order_by('id')
    for tag in zip(tags):
        area_name = tag.name.split(':')[-1]
        tags_list.append(area_name)
    return tags_list

#（3）返回地域标签去重后的内容（地域编号）
def get_area3_by_tags():
    tags_list =[]
    tags = Tag.objects.filter(name__icontains='地域编号(campus_aiops):').order_by('id')
    for tag in zip(tags):
        area_no = tag.name.split(':')[-1]
        tags_list.append(area_no)
    return tags_list

# #（示例版）根据tag查找设备，具体可以搜Django tagging ：
# #tag就是在上传的excel里三个原有字段之外，增加的字段，都可视为tag
# def get_devices_by_tags():
#     devs = TaggedItem.objects.get_by_model(DeviceAsset, '地域:黑山扈')
#     devs = TaggedItem.objects.get_by_model(DeviceAsset, '地域:黑山扈综合楼_地域编号:B-HH-CAM-1') #符合地域和地域编号这两个标签的设备列表
#     return devs

#根据地域查找园区设备,返回QuerySet（obj集合）
def get_devices_by_area(area,app):
    devices = []
    group = app
    try:
        devicelists = DeviceList.objects.filter(group=group)
        if devicelists:
            for devicelist in devicelists:
                devs = devicelist.device.all()  #devs对应的DeviceAsset表记录：device = models.ManyToManyField(DeviceAsset)
                for dev in devs:
                    #获取地域标签
                    tags = Tag.objects.get_for_object(dev)
                    area_name = ''
                    area_no = ''
                    for tag in tags:
                        if re.match('地域\(campus\):',str(tag)):
                            area_name = str(tag).split(':')[-1]
                        elif re.match('地域编号\(campus\):',str(tag)):
                            area_no = str(tag).split(':')[-1]
                    dev_area = area_name+"|"+area_no
                    if area == '' or (area != '' and dev_area == area):
                        dev_dict = obj_to_dict(dev)
                        dev_dict['group'] = group
                        dev_dict['list_name'] = devicelist.name
                        dev_dict['role'] = devicelist.role
                        dev_dict['area_name'] = area_name
                        dev_dict['area_no'] = area_no
                        devices.append(dev_dict)
    except Exception as e:
        # print(e)
        return []
    return devices

#根据园区设备查询其地域信息
def get_area_by_device(device):  #device是DeviceAsset对象
    area = {}
    area['area_name'] = ''
    area['area_no'] = ''
    tags = Tag.objects.get_for_object(device)
    area_name = ''
    area_no = ''
    for tag in tags:
        if re.match('地域\(campus\):',str(tag)):
            area_name = str(tag).split(':')[-1]
        elif re.match('地域编号\(campus\):',str(tag)):
            area_no = str(tag).split(':')[-1]
    area['area_name'] = area_name
    area['area_no'] = area_no
    return area

    # devs = TaggedItem.objects.get_by_model(DeviceAsset, '地域:%s_地域编号:%s'%area%xx)

#在obj_to_dict函数的基础上进行了修改，把键在原字段名（field name）的基础上，加了前缀(前缀值通过pre_str来设置)。
#这样在做多个表的dict合并时，能够防止因各个表里字段名有重复而导致dict的键重复的异常错误。
#输入：一个obj实例
#输出：一个dict，键是字段名，值是字段值
def obj_to_dict_same_field_name(instance,pre_str,fields=None, exclude=None):
    opts = instance._meta
    # data = {}
    data = collections.OrderedDict()  #改成有序的，方便导出
    for f in opts.concrete_fields:
        if fields and f.name not in fields:
            continue
        if exclude and f.name in exclude:
            continue
        key = pre_str+f.name
        data[key] = f.value_from_object(instance)
    return data

#把6c:0b:84:45:09:41和6c-0b-84-45-09-41格式的mac转成6c0b.8445.0941格式：
def mac_convert(mac_str):
    if re.match('^([0-9a-fA-F]{2})((:[0-9a-fA-F]{2}){5})$',mac_str):
        mac_str = mac_str.replace(':','')
    elif re.match('^([0-9a-fA-F]{2})((-[0-9a-fA-F]{2}){5})$',mac_str):
        mac_str = mac_str.replace('-','')
    else:
        return None
    return '{d0}{d1}{d2}{d3}.{d4}{d5}{d6}{d7}.{d8}{d9}{d10}{d11}'.format(
                    d0=mac_str[0],d1=mac_str[1],d2=mac_str[2],d3=mac_str[3],
                    d4=mac_str[4],d5=mac_str[5],d6=mac_str[6],d7=mac_str[7],
                    d8=mac_str[8],d9=mac_str[9],d10=mac_str[10],d11=mac_str[11]
                )

#obj转成有序的dict：
def obj_to_dict_by_order(instance, fields=None, exclude=None):
    opts = instance._meta
    data = collections.OrderedDict()
    for f in opts.concrete_fields:
        if fields and f.name not in fields:
            continue
        if exclude and f.name in exclude:
            continue
        data[f.name] = f.value_from_object(instance)
    return data


#从DeviceList里获取某组下的设备信息
def get_device_tag_by_group(group):
    devices = []
    try:
        devicelists = DeviceList.objects.filter(group=group)
        if devicelists:
            for devicelist in devicelists:
                devs = devicelist.device.all()
                for dev in devs:
                    dev_dict = obj_to_dict(dev)
                    dev_dict['group'] = group
                    dev_dict['list_name'] = devicelist.name
                    dev_dict['role'] = devicelist.role
                    #获取地域标签
                    tags = Tag.objects.get_for_object(dev)
                    area_name = ''
                    area_no = ''
                    for tag in tags:
                        if re.match("地域\(campus\):",str(tag)):
                            area_name = str(tag).split(':')[-1]
                        elif re.match("地域编号\(campus\):",str(tag)):
                            area_no = str(tag).split(':')[-1]
                    # area = area_name+"|"+area_no
                    # dev_dict['area'] = area
                    dev_dict['area_name'] = area_name
                    dev_dict['area_no'] = area_no
                    devices.append(dev_dict)
    except Exception as e:
        # print(e)
        return []
    return devices

#interface表里的mac和arp及历史mac，arp可能一个单元格多个值，需要轮询其对应的ead信息，因为其中最多有一个有ead信息。
def get_addrlist_from_portconfiger_interface(add_str):
    addr_list= []
    if add_str != '' or add_str != None:
        # print('addr_str:',add_str)
        addr_split=re.split("\n",add_str)
        # print('addr_split',addr_split)
        for addr in addr_split:
            if addr != '':
                addr_list.append(addr)
    # print('addr_list:',addr_list)
    return addr_list


#多条件同时查询时，动态过滤调价
def getKwargs(data={}):
    kwargs = {}
    for(k,v) in data.items():
        if v is not None and v!=u'':
            kwargs[k] = v
        return kwargs
#使用：
# searchCondition = {'name__icontains':name,……}
# # kwargs = utils.getKwargs(searchCondition)
# kwargs = getKwargs(searchCondition)
# try:
#     data = Model.objects.filter(**kwargs)
# exceptModel.DoesNotExist:
#     print("DoesNotExist")

#Interface表更新辅助类1
class PortInfo():
    # 无设备名称、无设备管理IP、槽位（无的默认是1）、端口号（2/1中的1）、名称（形如GE3/2）、端口类型、
    def __init__(self, ip=None, slot='', module='', index='', mode='', name='', type='', status='up',
                 status_reason='', show_run='', mac='', vlan='', interface_ip='',device=None):
        self.ip = ip
        self.slot = slot
        self.module = module
        self.index = index
        self.mode = mode
        self.name = name
        self.type = type
        self.status = status
        self.status_reason = status_reason
        self.show_run = show_run
        self.mac = mac
        self.vlan = vlan
        self.interface_ip = interface_ip
        self.device=device

    def __str__(self):
        return "ip:" % (self.ip, self.name)
#Interface表更新辅助函数1
def get_campus_ip_list(group='campus'):
    ip_list = []
    devicelists = DeviceList.objects.filter(group=group)
    for devicelist in devicelists:
        ip_list.extend([device.node for device in devicelist.device.all()])
    if ip_list:
        return ip_list
    else:
        raise Exception('园区网设备列表未上传,请确认上传以campus为前缀的的Excel文件,内容为设备列表')
#Interface表更新辅助函数2
def get_device_ports_status(ip):
    now = timezone.now()
    start_time = now-datetime.timedelta(hours=24)
    port_info_list = []
    try:
        device = DeviceAsset.objects.filter(node=ip)[0]
        interfaces = device.interfaceconfig_set.filter(~Q(interface_name__icontains='port')&~Q(interface_name__icontains='vlan')&~Q(interface_rate_mode__icontains='trunk'))
        for interface in interfaces:
            interface_macs = Mac.objects.filter(device=device,interface_name=interface.interface_name, update_time__gt=start_time)
            macs = [interface_mac.mac_addr for interface_mac in interface_macs]
            arps = []
            for interface_mac in interface_macs:
                    # mac历史暂时不记录
                    # try:
                    #     mac_history_item = MacHistory.objects.get(interface=interface,mac=interface_mac)
                    #     mac_history_item.save()
                    # except:
                    #     try:
                    #         MacHistory(interface=interface, mac=interface_mac).save()
                    #     except:
                    #         pass
                    # 在某区域中用mac arp表连接，防止过多的连接不需要的设备的mac表
                ds_list = get_ds_list('campus', device)
                interface_arps = Arp.objects.filter(device__in=ds_list,mac_addr=interface_mac.mac_addr,interface_name='Vlan'+interface_mac.vlan, update_time__gt=start_time)
                arps = [interface_arp.ip_addr for interface_arp in interface_arps ]
            macs_str = '\n'.join(set(macs))
            arps_str = '\n'.join(set(arps))

            if interface.interface_line_protocol_state == 'up':
                status = 'up'
            elif interface.interface_admin_state == 'down':
                status = 'administratively down'
            else:
                status = 'down'
            port_info = PortInfo(
                ip=ip, slot=interface.module, module='', index='', mode=interface.interface_rate_mode,
                name=interface.interface_name, type='', status=status,
                status_reason=interface.interface_state_rsn_desc, show_run=interface.interface_config,
                mac=macs_str, vlan=interface.interface_allow_vlan, interface_ip=arps_str, device=device
            )

            port_info_list.append(port_info)
    except Exception as e:
        return []
    return port_info_list
#Interface表更新辅助函数3
def get_interface_auth_type(show_run):
    if not show_run:
        return 'no'
    if show_run.find('port-control auto') >= 0:
        if show_run.find('mab') >= 0 or show_run.find('dot1x mac-auth-bypass') >= 0:
            return 'mac'
        else:
            return 'iNode'
    elif show_run.find('port link-type trunk') < 0:
        if 'mac-authentication' in show_run:
            return 'mac'
        elif 'dot1x\n' in show_run:
            return 'iNode'
        else:
            return 'no'
    else:
        return 'no'
#Interface表更新辅助函数4
def get_interface_mode_by_config(show_run):
    try:
        if not show_run:
            return None
        ##过滤h3c设备
        if ('stp edged-port' in show_run) or ('port link-mode' in show_run):
            return None
        if 'switchport mode access' in show_run:
            mode = 'access'
        elif 'switchport mode turnk' in show_run:
            mode = 'trunk'
        else:
            mode = ''
        return mode
    except Exception as e:
        return ''
#Interface表更新辅助函数5
def save_interface_mac_arp_history(interface, mac_addrs, ip_addrs):
    try:
        if mac_addrs:
            for mac_addr in mac_addrs.split():
                MacHistory.objects.update_or_create(interface=interface,mac_addr=mac_addr)
        if ip_addrs:
            for ip_addr in ip_addrs.split():
                ArpHistory.objects.update_or_create(interface=interface,ip_addr=ip_addr)
    except Exception as e:
        print(str(e),mac_addr,ip_addr)




# get_ips_by_ipsection('192.168.10.0','/25')
# get_ips_by_ipsection('192.168.10.0','255.255.255.128')
# get_ead_info('22.127.135.214','ip')
# get_ead_info('21.2.82.117','ip')
# get_ead_info('6c0b.8445.0941','mac') #西单的
# get_ead_info('6c:0b:84:45:09:41','mac')
# get_ead_info('6c-0b-84-45-09-41','mac')
# get_ead_info('4439.C433.8507','mac') #hh的
# get_ead_info('44:39:C4:33:85:07','mac')
# get_ead_info('44-39-C4-33-85-07','mac')
get_ead_info('22.127.140.206','ip')
