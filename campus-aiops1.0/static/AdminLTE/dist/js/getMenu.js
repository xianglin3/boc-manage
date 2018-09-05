/**
 * Created by nantian on 2016/10/27.
 */
$(document).ready(function(){

    //查询session缓存数据是否存在，如果存在使用缓存数据，如果不存在重新请求并保存到session中
    var sessionData = localStorage.getItem('_asideMenu');
    var login_user = $("#login_user").html();

   /* if(login_user == "AnonymousUser"){
        console.log('hello')
        *//*$.get('/menu/get_menu_tree/', function(data){
            doResponse(data);
            localStorage.setItem('_asideMenu','');
        },"json");*//*
        var data = {title:'新版',menList:[{
                "child": [],
                "icon": "fa fa-futbol-o",
                "type": "inner",
                "url": "/index/",
                "name": "首页"
            }]}
        $('#tabMenu').text(data.title)
        doResponse(data.menList);
        localStorage.setItem('_asideMenu',JSON.stringify(data));
    }else{
        console.log('world');*/
        if(sessionData){
            $('#tabMenu').text(filterMenu(JSON.parse(sessionData).title));
            doResponse(JSON.parse(sessionData).menList);
        }else{
            var data = {title:'新版',menList:[{
                    "child": [],
                    "icon": "fa fa-futbol-o",
                    "type": "inner",
                    "url": "/index/",
                    "name": "新版首页"
                }]}
            $('#tabMenu').text(filterMenu(data.title));
            doResponse(data.menList);
            localStorage.setItem('_asideMenu',JSON.stringify(data));
            //异步请求菜单数据
            /*$.get('/menu/get_menu_tree/', function(data){
                doResponse(data);
                localStorage.setItem('_asideMenu',JSON.stringify(data));
            },"json");*/
        }
//    }
    //处理请求数据函数
    function doResponse(data){
        var $ul=$('<ul class="sidebar-menu"><li class="header">让运维更得心应手</li></ul>');
        $.each(data,function(i,v){
            var $li=$('<li class="treeview"></li>');
            var target=(v.type=="inner")?"_self":"_blank";
            $li.html('<a href="'+ v.url+'" target="'+target+'">'
            +'<i class="'+ v.icon+'"></i>'
            +'<span>'+ v.name+'</span>'
            +'</a>');
            if(v.child.length){
                var $ul2=$('<ul class="treeview-menu"></ul>');
                $.each(v.child,function(i,v){
                    var target=(v.type=="inner")?"_self":"_blank";
                    if(v.child.length){
                        var $li2=$('<li></li>');
                        $li2.html('<a href="#">'
                        + v.name
                        +'<span class="pull-right-container">'
                        +'<i class="fa fa-angle-left pull-right"></i>'
                        +'</span>'
                        +'</a>');
                        var $ul3=$('<ul class="treeview-menu"></ul>')
                        $.each(v.child,function(i,v){
                            var target=(v.type=="inner")?"_self":"_blank";
                            if(v.child.length){
                                var $li3=$('<li>'
                                +'<a href="#">'
                                +'<i class="'+ v.icon+'"></i>'
                                + v.name
                                +'<span class="pull-right-container">'
                                +'<i class="fa fa-angle-left pull-right"></i>'
                                +'</span>'
                                +'</a>'
                                +'</li>');
                                var $ul4=$('<ul class="treeview-menu"></ul>');
                                $.each(v.child,function(i,v){
                                    var target=(v.type=="inner")?"_self":"_blank";
                                    var $li4=$('<li><a href="'+v.url+'" target="'+target+'">'+ v.name+'</a></li>');
                                    $li4.appendTo($ul4);
                                });
                                $ul4.appendTo($li3);
                            }else{
                                var $li3=$('<li>'
                                +'<a href="'+ v.url+'" target="'+target+'">'
                                +'<i class="'+ v.icon+'"></i>'
                                + v.name
                                +'</a>'
                                +'</li>');
                            }
                            $li3.appendTo($ul3);
                        });
                        $ul3.appendTo($li2)
                    }else{
                        var $li2=$('<li><a href="'+ v.url+'" target="'+target+'">'+ v.name+'</a></li>');
                    }
                    $li2.appendTo($ul2);
                });
                $ul2.appendTo($li);
            }
            $li.appendTo($ul);
        });
        $ul.appendTo($("#sidebar-menu"));
        //菜单激活状态保持
        $ul.find("li>a").click(function(){
            //var state=$(this).siblings("ul.treeview-menu").attr("class");
            $(this).parent("li").siblings("li").children("ul").slideUp("normal",function(){
                $(this).parent("li").removeClass("active");
            });
            var s=$(this).siblings().length;
            if(!s){
                $(this).parent("li").addClass("active").siblings("li").removeClass("active");
            }
        });
        var url = window.location;
        $('ul.treeview-menu a').filter(function () {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).parent("li").addClass('active').parent("ul").addClass('menu-open')
        .parent("li").addClass('active').parent("ul").addClass('menu-open')
        .parent("li").addClass('active').parent("ul").addClass('menu-open')
        .parent("li").addClass('active');
    }

    //切换菜单
    $('#tabMenu').on('click',function(){
        var strTitle = $(this).text();
        if(strTitle == '旧版'){
            var dataOld = {title:'旧版',menList:[{
                    "child": [],
                    "icon": "fa fa-futbol-o",
                    "type": "inner",
                    "url": "/tree/",
                    "name": "旧版首页"
                }]}
            localStorage.setItem('_asideMenu',JSON.stringify(dataOld));
            location.reload();
        }else{
            var dataOld = {title:'新版',menList:[{
                    "child": [],
                    "icon": "fa fa-futbol-o",
                    "type": "inner",
                    "url": "/manage/",
                    "name": "新版首页"
                }]}
            localStorage.setItem('_asideMenu',JSON.stringify(dataOld));
            location.reload();
        }
    })
    function filterMenu(data){
        if(data == '旧版'){
            return '新版';
        }
        if(data == '新版'){
            return '旧版';
        }
    }
});