/**
 * Created by Administrator on 2016-11-26.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    function eth_switch(option){//参数待定
        !option&&(option={});
        !option.defaultScale&&(option.defaultScale=0.5);
        !option.maxScale&&(option.maxScale=1.3);
        !option.minScale&&(option.minScale=0.3);
        var c=this[0];
        var ctx=c.getContext("2d");
        //创建图形父类
        function Img(){
            this.s=option.defaultScale;
        }
        //图形缩放函数
        Img.prototype.scale=function(s,origin){
            if(this.s>option.maxScale&&s>1){s=1}
            if(this.s<option.minScale&&s<1){s=1}
            this.x=origin[0]-(origin[0]-this.x)*s;
            this.y=origin[1]-(origin[1]-this.y)*s;
            this.width=this.width*s;
            this.height=this.height*s;
            this.s=this.s*s;
        }
        //图形的移动函数
        Img.prototype.move=function(x,y){
            this.x=x;
            this.y=y;
        }
        //以太网端口类
        function EthPort(img,port,x,y,name){
            this.image=img;
            this.x=x;
            this.y=y;
            this.name=name;
            this.index=0;
            this.width=0;
            this.height=0;
            this.port=port;
            Img.call(this);
        }
        //继承图形父类
        Object.setPrototypeOf(EthPort.prototype,Img.prototype);
        //以太网端口的绘制函数
        EthPort.prototype.draw=function(isAuto){
            var proto=Object.prototype.toString.call(this.image);
            if(proto=="[object Array]"){
                this.width=this.image[this.index].width*this.s;
                this.height=this.image[this.index].height*this.s;
                ctx.drawImage(this.image[this.index],this.x,this.y,this.width,this.height);
                if(isAuto){//黄灯无规律闪烁
                    this.index=parseInt(Math.random()*2)
                };
                //if(this.index==this.image.length){
                //    this.index=0;
                //}
            }else{
                this.width=this.image.width*this.s;
                this.height=this.image.height*this.s;
                ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
            }
            ctx.fillStyle="#fff";
            ctx.font=(this.s*14+'px helvetica');
            var w=ctx.measureText(this.port).width;
            ctx.fillText(this.port,(this.width-w)/2+this.x,this.height/2+this.y+7*this.s);
        }
        //创建单板类
        function Brd(name,x,y,width,height){
            this.x=x;this.y=y;this.name=name;
            Img.call(this);
            this.width=width*this.s;this.height=height*this.s;
        }
        //继承图形父类
        Object.setPrototypeOf(Brd.prototype,Img.prototype);
        //以太网板卡的绘制函数
        Brd.prototype.draw=function(){
            ctx.fillStyle="#5D5D75";
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.strokeStyle="#3D3E40"
            ctx.lineWidth=8*this.s;
            ctx.strokeRect(this.x,this.y,this.width,this.height);
            ctx.fillStyle="#e4393c";
            ctx.font=(this.s*18+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,this.x,this.y-8*this.s);
        }
        //创建机框类
        function Srn(name,x,y,width,height){
            this.x=x;this.y=y;this.name=name;
            Img.call(this);
            this.width=width*this.s;this.height=height*this.s;
        }
        //继承图形父类
        Object.setPrototypeOf(Srn.prototype,Img.prototype);
        //机框的绘制函数
        Srn.prototype.draw=function(){
            ctx.fillStyle="#C5C6CA";
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.strokeStyle="#676A73"
            ctx.lineWidth=20*this.s;
            ctx.strokeRect(this.x,this.y,this.width,this.height);
            ctx.fillStyle="#333";
            ctx.font=(this.s*22+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,this.x,this.y-19*this.s);
        }
        var images={
            img:[],
            col:2,//用来保存每排的端口组数
            nub_group:16,//用来保存每组的端口数量
            scale:option.defaultScale,
            timer:null,//用于保存定时器
            fun:null,
            init:function(){
                var self=this;
                //清空已有的定时器
                clearInterval(this.timer);
                c.onmousedown=function(e){
                    if(e.button==0){
                        var bX=e.offsetX,bY=e.offsetY;
                        var target=null;
                        var offsetX= 0,offsetY=0;
                        var timer1=setTimeout(function(){
                            $.each(self.img,function(i,v){
                                if(v.constructor==EthPort){
                                    if(bX> v.x&&bX<( v.x+ v.width)&&bY>v.y&&bY<(v.y+ v.height)){
                                        target=v;
                                    }
                                }
                            });
                            if(self.fun!==null){
                                self.fun(target);
                            }
                        },300)
                        c.onmousemove=function(e){
                            clearTimeout(timer1);
                            self.clear();
                            var mX= e.offsetX-bX,mY= e.offsetY-bY;
                            $.each(self.img,function(i,v){
                                var desX= v.x+mX,desY= v.y+mY;
                                v.move(desX, desY);
                            });
                            self.draw(false);
                            bX= e.offsetX,bY= e.offsetY;
                        }
                    }
                }
                document.onmouseup=function(){
                    c.onmousemove=null;
                }
                var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
                if(this.timer===null){
                    c.addEventListener(mousewheelevt, function(e){
                        self.clear();
                        if(e.wheelDelta>0){
                            var s=1.05;
                        }else{
                            var s=100/105;
                        }
                        $.each(self.img,function(i,v){
                            v.scale(s,[e.offsetX, e.offsetY]);
                        })
                        self.draw(false);
                    }, false);
                }
                //self.draw(true);
                this.timer=setInterval(function(){
                    self.clear();
                    self.draw(true);
                },120);
            },
            start:function(data,ethImgs){//注意渲染顺序
                var col=this.col;
                var nub_group=this.nub_group;
                var me=this;
                this.img={};
                this.ethImgs=ethImgs;
                var srnWidth=(nub_group/2*63+20)*col+100,
                    srnHeight=0;
                $.each(data.brd,function(i,v){
                    var isExist0 = Boolean(v.port["0"]);
                    var portNumber = v.port_number;
                    srnHeight += Math.ceil((Math.ceil(portNumber/nub_group)/col))*(57*2+20)+20+40;
                });
                srnHeight+=120;
                var x=(c.width-srnWidth*option.defaultScale)/2,
                    y=80*option.defaultScale;
                //调用添加机框函数
                this.addSrn(data.id,data.name,x,y,srnWidth,srnHeight);
                var deepY=y+60*option.defaultScale;
                $.each(data.brd,function(i,v){
                    var isExist0 = Boolean(v.port["0"]);
                    var portNumber = v.port_number;
                    var w = (nub_group/2*63+20)*col+20,
                        h = Math.ceil((Math.ceil(portNumber/nub_group)/col))*(57*2+20)+20;
                    var xBrd=x+40*option.defaultScale,
                        yBrd=deepY;
                    var brd_id="S"+data.id+ v.id;
                    //调用添加单板函数
                    me.addBrd(brd_id,i,xBrd,yBrd,w,h);
                    deepY+=(h+40)*option.defaultScale;
                    //判断该单板是否存在0端口
                    $.each(v.port,function(item,val){
                        var portName = item;
                        if(isExist0){
                            item++;
                        }
                        var group = Math.ceil(item/nub_group),
                            row_group = Math.ceil(group/col)-1,
                            col_group = (group>col?(group-1)%col:group-1),
                            port_position = (item-1)%nub_group;
                        //获取每组左上角的坐标
                        var groupX = xBrd + (20 + col_group*(nub_group/2*63 + 20))*option.defaultScale,
                            groupY = yBrd + (20 + row_group*(57*2 + 20))*option.defaultScale;
                        //获取和判断端口的位置
                        var isEven = Boolean(port_position%2===0);
                        var bt = isEven?"t_":"b_";
                        var offsetX = isEven?port_position/2*63*option.defaultScale
                            :(port_position-1)/2*63*option.defaultScale;
                        var offsetY = 0;
                        !isEven&&(offsetY = 57*option.defaultScale);
                        var imgArr = me.ethImgs[bt+val.status];
                        //调用生成端口函数
                        if(imgArr){
                            me.addEthPort(brd_id+"e"+item,imgArr,portName,groupX+offsetX,groupY+offsetY,val.name);
                        }
                    });
                });
            },
            refreshData:function(data){//刷新数据（配合定时器用于动态数据展示）
                var pro="S"+data.id;
                var me=this;
                $.each(data.brd,function(i,v){
                    var pro="S"+data.id+v.id;
                    $.each(v.port,function(item,val){
                        item=/([0-9]+)\/([0-9]+)/.exec(item)[2]-1;
                        var row=parseInt(item/me.col);
                        var bt=(row%2==0?"t_":"b_");
                        var imgArr=me.ethImgs[bt+val.status];
                        if(me.img[pro+item]&&imgArr){
                            me.img[pro+item].image=imgArr;
                        }
                    });
                });
            },
            addEthPort:function(id,img,port,x,y,name){//后进入数组的元素先渲染
                this.img[id]=new EthPort(img,port,x,y,name);
            },
            addBrd:function(id,name,x,y,width,height){
                this.img[id]=new Brd(name,x,y,width,height);
            },
            addSrn:function(id,name,x,y,width,height){
                this.img["S"+id]=new Srn(name,x,y,width,height);
            },
            draw:function(isAuto){
                $.each(this.img,function(i,v){
                    v.draw(isAuto);
                });
            },
            //定义清除画布函数
            clear:function(){
                ctx.clearRect(0,0, c.width, c.height);
            },
            click:function(f){
                var pro=Object.prototype.toString.call(f);
                if(pro=="[object Function]"){
                    this.fun=f;
                }
            }
        }
        return images;
    }
    $.fn.eth_switch=eth_switch;
    eth_switch=null;//释放内存
    //canvas加载图片过程
    function L(canvasId,obj,fn){
        var c=document.getElementById(canvasId);
        var ctx= c.getContext("2d");
        imgs={};
        var l={
            width: c.width,
            height: c.height,
            n:0,
            p:0,
            draw:function(){
                var p = parseInt(this.p);
                ctx.clearRect(0,0,this.width,this.height);
                ctx.font='50px helvetica';
                ctx.strokeStyle='#fff';
                var w=ctx.measureText(p+'%').width;
                ctx.lineWidth='4';
                var endd=3.60*p-90;
                ctx.beginPath();
                ctx.arc(this.width/2,this.height/2,80,-90*Math.PI/180,endd*Math.PI/180);
                ctx.stroke();
                ctx.fillStyle='#eee';
                ctx.strokeStyle='#111';
                ctx.lineWidth='1';
                ctx.fillText(p+'%',this.width/2-w/2,this.height/2+20);
                ctx.strokeText(p+'%',this.width/2-w/2,this.height/2+20);
                if(this.p>98){
                    ctx.clearRect(0,0,this.width,this.height);
                    fn(imgs);
                }
            }
        };
        for(var i in obj){
            l.n++;
        }
        for(var i in obj){
            var src=obj[i];
            imgs[i]=new Image();
            imgs[i].src=src;
            imgs[i].onload=function(){
                l.p+=(1/l.n)*100;
                l.draw();
            };
        }
    }
    $.L=L;
    L=null;
})()