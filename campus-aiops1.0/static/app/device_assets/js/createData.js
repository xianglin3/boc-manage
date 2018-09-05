/**
 * Created by nantian on 2016/12/23.
 */
$(document).ready(function(){
    var cascade_datas=JSON.parse($("#cascade_datas").html());
    //var name=$("div.box-body form").attr("action");
    var emptySel='<option value="" selected="selected">---------</option>';
    var o={};
    var ele={
        "#id_area":["buildings",cascade_datas,["#id_building","#id_room","#id_cabinet","#id_position_u"]],
        "#id_building":["rooms","buildings",["#id_room","#id_cabinet","#id_position_u"]],
        "#id_room":["cabinets","rooms",["#id_cabinet","#id_position_u"]],
        "#id_cabinet":["position_us","cabinets",["#id_position_u"]],
        "#id_position_u":[]
    };
    $.each(ele,function(i){
        if(i=="#id_area"){
            $(i).val("");
        }else{
            $(i).html(emptySel);
        }
    })
    $.each(ele,function(item,val){
        if(item!=="#id_position_u"){
            $(item).change(function(){
                var v=$(this).val();
                var option=emptySel;
                if(item=="#id_area"){
                    o[val[0]]=val[1][v];
                }else{
                    o[val[0]]=o[val[1]][val[1]][v];
                }
                if(o[val[0]]){
                    $.each(o[val[0]][val[0]],function(i,v){
                        option+='<option value="'+ v.id+'">'+ v.name+'</option>';
                    });
                }
                $.each(val[2],function(i1,v1){
                    var html=(i1==0?option:emptySel);
                    $(v1).html(html);
                });
            });
        }
    })
});