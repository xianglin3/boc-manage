__author__ = '4562363'


from django.conf.urls import url

urlpatterns = [
    url(r'^$', 'oa_vlan_assign.views.vlan', name='vlan'),
    url(r'^vlan/$', 'oa_vlan_assign.views.vlan', name='vlan'),
    url(r'^vlan_create/', 'oa_vlan_assign.views.vlan_create', name='vlan_create'),
    url(r'^area_search_by_dep/', 'oa_vlan_assign.views.area_search_by_dep', name='area_search_by_dep'),
    url(r'^vlan_update/', 'oa_vlan_assign.views.vlan_update', name='vlan_update'),
    url(r'^vlan_delete/', 'oa_vlan_assign.views.vlan_delete', name='vlan_delete'),
    url(r'^vlan_search/', 'oa_vlan_assign.views.vlan_search', name='vlan_search'),
    url(r'^import_vlan_excel/', 'oa_vlan_assign.views.import_vlan_excel', name='import_vlan_excel'),
    url(r'^vlan_download/', 'oa_vlan_assign.views.vlan_download', name='vlan_download'),

    url(r'^ip/$', 'oa_vlan_assign.views.ip', name='ip'),
    url(r'^port_status/$','oa_vlan_assign.views.port_status',name='port_status'),

    url(r'^department/$', 'oa_vlan_assign.views.department', name='department'),
    url(r'^dep_create/', 'oa_vlan_assign.views.dep_create', name='dep_create'),
    url(r'^dep_delete/', 'oa_vlan_assign.views.dep_delete', name='dep_delete'),
    url(r'^dep_update/', 'oa_vlan_assign.views.dep_update', name='dep_update'),
    url(r'^dep_search/', 'oa_vlan_assign.views.dep_search', name='dep_search'),
    url(r'^import_dep_excel/', 'oa_vlan_assign.views.import_dep_excel', name='import_dep_excel'),
    url(r'^dep_download/', 'oa_vlan_assign.views.dep_download', name='dep_download'),
    url(r'^dep_init/', 'oa_vlan_assign.views.dep_init', name='dep_init'),


    url(r'^device/$', 'oa_vlan_assign.views.device', name='device'),
    url(r'^reference/$', 'oa_vlan_assign.views.reference', name='reference'),
]

