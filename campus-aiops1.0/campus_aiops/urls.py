__author__ = '4562363'

from django.conf.urls import url
from . import views

urlpatterns = [
    # url(r'^$',campus_interfaces_usage_info),
    url(r'^index/detail/$','campus_aiops.views.detail',name='detail'),
    url(r'^$', 'campus_aiops.views.index', name='index'),
    url(r'^data_refresh/$','campus_aiops.views.data_refresh',name="data_refresh"),
    url(r'^links/$','campus_aiops.views.links',name='links'),
    url(r'^excel_push/$','campus_aiops.views.excel_push',name='excel_push'),
    url(r'^cli_realtime/$','campus_aiops.views.cli_realtime',name='cli_realtime'),
    url(r'^portconfiger/$','campus_aiops.views.portconfiger',name='portconfiger'),
    url(r'^admin_type/$','campus_aiops.views.admin_type',name='admin_type'),
    url(r'^python_test/$','campus_aiops.views.python_test',name='python_test'),


    # url(r'^dev/$', 'campus_aiops.views.dev_list',name='dev'),
    url(r'^inspection/$', 'campus_aiops.views.inspection',name='inspection'),
    url(r'^device_data/$','campus_aiops.views.device_data',name="device_data"),
    # url(r'^campus_interfaces_usage_info/$', 'campus_aiops.views.campus_interfaces_usage_info',name='campus_interfaces_usage_info'),
   

    url(r'^campus_interfaces_usage_info/$', 'portconfiger.views.campus_interfaces_usage_info', name='campus_interfaces_usage_info'),

    url(r'^vlan_list/$', 'campus_aiops.views.vlan_list', name='vlan'),
    url(r'^manage/$', 'campus_aiops.views.manage', name='manage'),
    url(r'^equipment/$', 'campus_aiops.views.equipment', name='equipment'),
    url(r'^backbone/$', 'campus_aiops.views.backbone', name='backbone'),
    url(r'^log/$', 'campus_aiops.views.log', name='log'),
    url(r'^tree/$', 'campus_aiops.views.tree', name='tree'),
    url(r'^detail/$', 'campus_aiops.views.detail', name='detail'),
    # url(r'^vlan_create/', 'campus_aiops.views.vlan_create', name='vlan_create'),
    # url(r'^vlan_update/', 'campus_aiops.views.vlan_update', name='vlan_update'),
    # url(r'^vlan_delete/', 'campus_aiops.views.vlan_delete', name='vlan_delete'),
    # url(r'^import_vlan/', 'campus_aiops.views.import_vlan', name='import_vlan'),
    # url(r'^vlan_download/', 'campus_aiops.views.vlan_download', name='vlan_download'),

    url(r'^ip_list/$', 'campus_aiops.views.ip_list', name='ip_list'),
    # url(r'^ip_delete/$', 'campus_aiops.views.ip_delete', name='ip_delete'),
    # url(r'^ip_create/$', 'campus_aiops.views.ip_create', name='ip_create'),
    # url(r'^ip_search/$', 'campus_aiops.views.ip_search', name='ip_search'),
    # url(r'^import_ip/$', 'campus_aiops.views.import_ip', name='import_ip'),
    url(r'^ip_download/$', 'campus_aiops.views.ip_download', name='ip_download'),
    url(r'^ip_compare_download/$', 'campus_aiops.views.ip_compare_download', name='ip_compare_download'),
    # url(r'^ip_compare/$', 'campus_aiops.views.ip_compare', name='ip_compare'),

    # url(r'^area_list/$', 'campus_aiops.views.area_list', name='area_list'),
    # url(r'^port_status_update/$', 'campus_aiops.views.port_status_update', name='port_status_update'),
    url(r'^port_status_list/$', 'campus_aiops.views.port_status_list', name='port_status_list'),
    # url(r'^port_status_search/$', 'campus_aiops.views.port_status_search', name='port_status_search'),
    # url(r'^port_status_download/$', 'campus_aiops.views.port_status_download', name='port_status_download'),

    # url(r'^ead_info_update/$', 'campus_aiops.views.ead_info_update', name='ead_info_update'),

    # url(r'^update_all_ports_info/$', 'campus_aiops.views.update_all_ports_info', name='update_all_ports_info'),

    url(r'^dev_list/$', 'campus_aiops.views.dev_list', name='dev_list'),
    # url(r'^dev_search/$', 'campus_aiops.views.dev_search', name='dev_search'),

    url(r'^reference/$', 'campus_aiops.views.reference', name='reference'),
    url(r'^auth_type_history/$', 'campus_aiops.views.auth_type_history', name='auth_type_history'),
    url(r'^auth_type_history_search/$', 'campus_aiops.views.auth_type_history_search', name='auth_type_history_search'),
]