from django.shortcuts import render

# Create your views here.
def index(request):
    if request.method == 'GET':
        return render(request, 'oa_vlan_assign/vlan.html')
def department(request):
	return render(request,'oa_vlan_assign/department.html')
def device(request):
	return render(request,'oa_vlan_assign/device.html')
def vlan(request):
	return render(request,'oa_vlan_assign/vlan.html')
def reference(request):
	return render(request,'oa_vlan_assign/reference.html')
def ip(request):
	return render(request,'oa_vlan_assign/ip.html')
def port_status(request):
	return render(request,'oa_vlan_assign/port_status.html')