from django.db import models
from deviceassets.models import Device, DeviceAsset


class Vlan(models.Model):
    vlan_id = models.CharField(max_length=255, null=True, blank=True, verbose_name='vlan号', db_index=True)
    vlan_name = models.CharField(max_length=255, null=True, blank=True, verbose_name='vlan名')
    ip_section = models.CharField(max_length=255, null=True, blank=True, verbose_name='ip地址段') #格式固定为x.x.x.0
    ip_gateway = models.CharField(max_length=255, null=True, blank=True, verbose_name='网关')
    ip_mask = models.CharField(max_length=255, null=True, blank=True, verbose_name='掩码')  #格式固定为255.255.x.0
    department_name = models.CharField(max_length=255, null=True, blank=True, verbose_name='部门', db_index=True)
    area_name = models.CharField(max_length=255, null=True, blank=True, verbose_name='地域', db_index=True)
    area_no = models.CharField(max_length=255, null=True, blank=True, verbose_name='地域编号', db_index=True)
    note = models.TextField(verbose_name='备注', null=True, db_index=True,blank=True)
    operator = models.CharField(max_length=255, null=True,   blank=True, verbose_name='操作人')
    update_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    class Meta:
        unique_together = ('vlan_id','area')

class Interface(models.Model):
    # 无设备名称、无设备管理IP、槽位（无的默认是1）、端口号（2/1中的1）、名称（形如GE3/2）、端口类型、
    # def __init__(self, ip=None, slot=None, module=None, index=None, mode=None, name=None, type=None, status='up',
    #              show_run='', mac='', vlan=''):
    ip = models.CharField(verbose_name='交换机IP', max_length=65, db_index=True)
    slot = models.CharField(verbose_name='槽位', max_length=65, default=' ', null=True, blank=True)
    module = models.CharField(verbose_name='module', default='', max_length=65, null=True, blank=True)
    index = models.CharField(verbose_name='index', max_length=65, default=' ', null=True, blank=True)
    mode = models.CharField(verbose_name='类型', max_length=65, default='', null=True, blank=True)
    name = models.CharField(verbose_name='端口', max_length=65, default=' ', null=True, blank=True, db_index=True)
    type = models.CharField(verbose_name='G/T/E', max_length=65, default=' ', null=True, blank=True)
    status = models.CharField(verbose_name='admin状态', max_length=65, default=' ', null=True, blank=True)
    status_reason = models.CharField(verbose_name='admin状态原因', max_length=100, null=True, blank=True, default=' ')
    show_run = models.TextField(verbose_name='show run配置', default=' ', null=True, blank=True)
    show_run_lasttime = models.TextField(verbose_name='之前配置', default=' ', null=True, blank=True)
    mac = models.TextField(verbose_name='mac', default=' ', null=True, blank=True)
    mac_history = models.TextField(verbose_name='历史mac', default=' ', null=True, blank=True)
    interface_ip = models.TextField(verbose_name='arp', default=' ', null=True, blank=True)
    interface_ip_history = models.TextField(verbose_name='历史arp', default=' ', null=True, blank=True)
    vlan = models.CharField(verbose_name='vlan', default=' ', max_length=100, null=True, blank=True)
    auth_type = models.CharField(verbose_name='认证模式', default='no', max_length=100, null=True, blank=True)
    log_status = models.CharField(verbose_name='日志端口状态', null=True, blank=True, max_length=65)
    log_time = models.DateTimeField(verbose_name='日志时间', null=True, blank=True, )
    update_time = models.DateTimeField(verbose_name='更新', auto_now=True)
    device = models.ForeignKey(DeviceAsset, verbose_name='关联设备', null=True, blank=True)
    class Meta:
        unique_together = ('ip', 'name')
    def __str__(self):
        return "ip:%s interface:%s" % (self.ip, self.name)

class StaticIP(models.Model):
    ip = models.CharField(max_length=255, null=True, blank=True, verbose_name='IP地址', db_index=True)
    mac = models.CharField(max_length=255, null=True, blank=True, verbose_name='MAC地址', db_index=True)
    user = models.CharField(max_length=255, null=True, blank=True, verbose_name='IP使用人')
    account = models.CharField(max_length=255, null=True, blank=True, verbose_name='域账号')
    head_office = models.CharField(max_length=255, null=True, blank=True, verbose_name='人员类别')
    tel = models.CharField(max_length=255, null=True, blank=True, verbose_name='联系电话')
    location = models.CharField(max_length=255, null=True, blank=True, verbose_name='工位号')
    info_id = models.CharField(max_length=255, null=True, blank=True, verbose_name='信息点号')
    terminal_type = models.CharField(max_length=255, null=True, blank=True, verbose_name='终端类型')
    asset = models.CharField(max_length=255, null=True, blank=True, verbose_name='是否行内资产')
    application = models.CharField(max_length=255, null=True, blank=True, verbose_name='访问后台系统名称')
    app_ip = models.CharField(max_length=255, null=True, blank=True, verbose_name='后台系统IP')
    app_interface = models.CharField(max_length=255, null=True, blank=True, verbose_name='访问后台端口')
    vlan = models.ForeignKey(Vlan,verbose_name='所属vlan',blank=True,null=True,on_delete=models.SET_NULL)   #前台不输入，保存时靠计算获得。
    interface = models.ForeignKey(Interface,verbose_name='接口与设备',blank=True,null=True,on_delete=models.SET_NULL, db_index=True)
    reason = models.CharField(max_length=255, null=True, blank=True, verbose_name='未准入原因（白名单类别）')
    exist = models.CharField(max_length=255, null=True, blank=True, verbose_name='是否在白名单中')
    note = models.TextField(verbose_name='备注', null=True, db_index=True,blank=True)
    assign_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='分配日期')
    assign_user = models.CharField(max_length=255, null=True, blank=True, verbose_name='分配人')
    delete_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='回收日期')
    delete_user = models.CharField(max_length=255, null=True, blank=True, verbose_name='回收人')
    show_status = models.CharField(max_length=255, null=True, blank=True, verbose_name='显示状态') #0：显示; 1：回收
    operator = models.CharField(max_length=255, null=True, blank=True, verbose_name='操作人')
    update_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    class Meta:
        unique_together = ('ip','assign_time','show_status')

class EADInfo(models.Model):
    ip = models.CharField(max_length=255, null=True, blank=True, verbose_name='应用IP',db_index=True)
    mac = models.CharField(max_length=255, null=True, blank=True, verbose_name='应用MAC',db_index=True)
    user_name = models.CharField(verbose_name='员工号', blank=True, null=True, max_length=64)
    full_name = models.CharField(verbose_name='员工姓名', blank=True, null=True, max_length=64)
    os_version = models.CharField(verbose_name='操作系统版本', blank=True, null=True, max_length=64)
    terminal_vendor = models.CharField(verbose_name='终端品牌', blank=True, null=True, max_length=64)
    terminal_type = models.CharField(verbose_name='终端类型', blank=True, null=True, max_length=64)
    service_template_name = models.CharField(verbose_name='所属部门', blank=True, null=True, max_length=64)
    update_time = models.DateTimeField(auto_now=True,null=True,verbose_name='更新时间')


class PortStatus(models.Model):
    interface_ip = models.CharField(verbose_name='交换机IP', max_length=65, db_index=True)
    interface_name = models.CharField(verbose_name='交换机端口', max_length=65, default=' ', null=True, blank=True, db_index=True)
    interface_mode = models.CharField(verbose_name='端口类型', max_length=65, default='', null=True, blank=True)
    interface_status = models.CharField(verbose_name='admin状态', max_length=65, default=' ', null=True, blank=True)
    interface_status_reason = models.CharField(verbose_name='admin状态原因', max_length=100, null=True, blank=True, default=' ')
    interface_show_run = models.TextField(verbose_name='show run配置', default=' ', null=True, blank=True)
    interface_mac = models.TextField(verbose_name='mac（采集）', default=' ', null=True, blank=True)
    interface_mac_history = models.TextField(verbose_name='历史mac', default=' ', null=True, blank=True)
    interface_interface_ip = models.TextField(verbose_name='arp（采集）', default=' ', null=True, blank=True)
    interface_interface_ip_history = models.TextField(verbose_name='历史arp', default=' ', null=True, blank=True)
    interface_vlan = models.CharField(verbose_name='vlan（采集）', default=' ', max_length=100, null=True, blank=True)
    interface_auth_type = models.CharField(verbose_name='认证模式', default='no', max_length=100, null=True, blank=True)
    interface_log_status = models.CharField(verbose_name='日志端口状态', null=True, blank=True, max_length=65)
    interface_log_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='日志时间')
    interface_update_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='更新时间（自动采集）')
    device_name = models.CharField(verbose_name='交换机名', blank=True, null=True, max_length=64)
    area_name = models.CharField(max_length=255, null=True, blank=True, verbose_name='地域')
    area_no = models.CharField(max_length=255, null=True, blank=True, verbose_name='地域编号')
    ead_user_name = models.CharField(verbose_name='员工号', blank=True, null=True, max_length=64)
    ead_full_name = models.CharField(verbose_name='员工姓名', blank=True, null=True, max_length=64)
    ead_os_version = models.CharField(verbose_name='操作系统版本', blank=True, null=True, max_length=64)
    ead_terminal_vendor = models.CharField(verbose_name='终端品牌', blank=True, null=True, max_length=64)
    ead_terminal_type = models.CharField(verbose_name='终端类型', blank=True, null=True, max_length=64)
    ead_service_template_name = models.CharField(verbose_name='所属部门', blank=True, null=True, max_length=64)
    ead_update_time =  models.CharField(max_length=255, null=True, blank=True, verbose_name='更新时间（ead）')
    ip = models.CharField(max_length=255, null=True, blank=True, verbose_name='IP地址')
    mac = models.CharField(max_length=255, null=True, blank=True, verbose_name='MAC地址')
    user = models.CharField(max_length=255, null=True, blank=True, verbose_name='IP使用人')
    account = models.CharField(max_length=255, null=True, blank=True, verbose_name='域账号')
    head_office = models.CharField(max_length=255, null=True, blank=True, verbose_name='人员类别')
    tel = models.CharField(max_length=255, null=True, blank=True, verbose_name='联系电话')
    location = models.CharField(max_length=255, null=True, blank=True, verbose_name='工位号')
    info_id = models.CharField(max_length=255, null=True, blank=True, verbose_name='信息点号')
    terminal_type = models.CharField(max_length=255, null=True, blank=True, verbose_name='终端类型')
    asset = models.CharField(max_length=255, null=True, blank=True, verbose_name='是否行内资产')
    application = models.CharField(max_length=255, null=True, blank=True, verbose_name='访问后台系统名称')
    app_ip = models.CharField(max_length=255, null=True, blank=True, verbose_name='后台系统IP')
    app_interface = models.CharField(max_length=255, null=True, blank=True, verbose_name='访问后台端口')
    reason = models.CharField(max_length=255, null=True, blank=True, verbose_name='未准入原因（白名单类别）')
    exist = models.CharField(max_length=255, null=True, blank=True, verbose_name='是否在白名单中')
    note = models.TextField(verbose_name='备注', null=True, blank=True)
    assign_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='分配日期')
    assign_user = models.CharField(max_length=255, null=True, blank=True, verbose_name='分配人')
    operator = models.CharField(max_length=255, null=True, blank=True, verbose_name='操作人')
    staticip_update_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='更新时间（白名单）')
    vlan_vlan_id = models.CharField(max_length=255, null=True, blank=True, verbose_name='vlan（人工录入）')
    vlan_department_name = models.CharField(max_length=255, null=True, blank=True, verbose_name='部门')
    vlan_update_time = models.CharField(max_length=255, null=True, blank=True, verbose_name='更新时间（vlan）')
    update_time = models.DateTimeField(auto_now=True, verbose_name='更新时间(同步)')
    class Meta:
        unique_together = ('interface_ip','interface_name')


class MacHistory(models.Model):
    interface = models.ForeignKey(Interface, verbose_name='端口')
    mac_addr = models.CharField(verbose_name='mac地址', max_length=100, default=' ', null=True, blank=True)
    update_time = models.DateTimeField(verbose_name='更新', auto_now=True)

    class Meta:
        unique_together = ('interface', 'mac_addr')

class ArpHistory(models.Model):
    interface = models.ForeignKey(Interface, verbose_name='端口')
    ip_addr = models.CharField(verbose_name='IP地址', null=True, blank=True, db_index=True, max_length=100)
    update_time = models.DateTimeField(verbose_name='更新', auto_now=True)

    class Meta:
        unique_together = ('interface', 'ip_addr')