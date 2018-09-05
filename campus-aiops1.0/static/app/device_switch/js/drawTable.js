/**
 * Created by nantian on 2016/11/21.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    var dataObj={};
    var s=null;
    function drawTable(data,showCol,colHead){//依次传入需要渲染的数据和需要显示的列、[表头对象]
        !colHead&&(colHead={});
        s=showCol;
        this.html("");//清空表格
        var thead=$("<thead></thead>");
        var hTr=$("<tr></tr>");
        var tbody=$('<tbody></tbody>');

        //获取表头数据
        var tableHead=null;
        $.each(data,function(i,v){
            tableHead=v;
            return false;
        });
        //用来判断传入的数据类型
        var proto=Object.prototype.toString.call(data);
        if(proto=="[object Array]"){
            $.each(tableHead,function(i,v){
                if(showCol[i]){
                    if(i!=="groupName"){
                        var title=(colHead[i]?colHead[i]:i);
                        var th=$('<th>'+title+'</th>');
                        hTr.append(th);
                    }
                }
            });
            $.each(data,function(i,v){
                var bTr=drawTableList(false,v,"list");
                tbody.append(bTr);
            });
        }else{
            $.each(tableHead,function(i,v){
                if(showCol[i]) {
                    var title=(colHead[i]?colHead[i]:i);
                    var th = $('<th>'+title+'</th>');
                    hTr.append(th);
                }
            });
            $.each(data,function(i,v){
                var bTr=drawTableGroup(v.level,"d"+v.level+i,v);
                tbody.append(bTr);
                dataObj["d"+v.level+i]= v.data;
            });
        }
        thead.append(hTr).appendTo(this);
        this.append(tbody);
        tbody.on("click","tr.group_header",function(){
            $(this).find(".list_group_name")
                .toggleClass("showChild");
            var tar=$(this).attr("data-tar");
            var thisTr=this;
            if($(this).find(".showChild").length>0){
                $.each(dataObj[tar],function(i,v){
                    var bTr=drawTableGroup(v.level,tar+i,v);
                    dataObj[tar+i]= v.data;
                    $(thisTr).after(bTr[0]);
                });
            }else{
                $(thisTr).siblings("tr[data-tar^="+tar+"]").remove();
            }
        });
    }
    function drawTableGroup(l,i,data){
        if(data.groupName){
            var bTr=$('<tr class="group_header" data-tar="'+i+'"></tr>');
            $.each(data,function(item,val){
                if(s[item]){
                    if(item!=="level"&&item!=="data"){
                        if(item=="groupName"){
                            var td=$('<td class="list_group_name space'+l+'">'+val+'</td>');
                        }else{
                            var td=$('<td>'+val+'</td>');
                        }
                        bTr.append(td);
                    }
                }
            });
        }else{
            var bTr=drawTableList(true,data,i)
        }
        return bTr;
    }
    function drawTableList(isGroup,data,i){
        var bTr=$('<tr data-tar="'+i+'"></tr>');
				if(isGroup){
				    bTr.append('<td></td>');
				}
        $.each(data,function(item,val){
            if(s[item]){
                var btn=(item=="dev_name"?' --<span title="点我查看设备面板！" class="glyphicon glyphicon-hdd" data-act="'+data.device_id+'"></span>':'')
                if(isGroup){
                    var td=$("<td>"+val+btn+"</td>");
                }else{
                    if(item!=="groupName"){
                        var td=$("<td>"+val+btn+"</td>");
                    }
                }
            }
            bTr.append(td);
        });
        return bTr
    }
    $.fn.drawTable=drawTable;
})()