/*
 * SYSUI-SYSTABLEMODULE
 * 2019-06-05 version2.5
 * 799129700@qq.com SYSHUXL-化海天堂 by www.husysui.com
 * Reserved head available commercial use
 * Universal background system interface framework
 */
function extend(o, n, override) {
	for(var key in n) {
		if(n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
			o[key] = n[key];
		}
	}
	return o;
};
//处理
function addLoadListener(fn) {
	if(typeof window.addEventListener != 'undefined') {
		window.addEventListener('load', fn, false);
	} else if(typeof document.addEventListener != 'undefined') {
		document.addEventListener('load', fn, false);
	} else if(typeof window.attachEvent != 'undefined') {
		window.attachEvent('onload', fn);
	} else {
		var oldfn = window.onload;
		if(typeof window.onload != 'function') {
			window.onload = fn;
		} else {
			window.onload = function() {
				oldfn();
				fn();
			};
		}
	}
};
//简化document.getElementById方法
function TAB$(i) {
	return document.getElementById(i)
};
//简化document.createElement方法
function TABLAYER$(i) {
	return document.createElement(i)
};
//简化document.getElementsByName方法
function name$(i) {
	return document.getElementsByName(i)
}

function tagname$(i) {
	return document.getElementsByTagName(i)
}
// 插件构造函数 - 返回数组结构
function SYSTableSorter(options) {
	this._initial(options);
};
SYSTableSorter.prototype = {
	constructor: this,
	_initial: function(options) {
		var par = {
			TableName: '', //table表格名称
			btnArea: '', //执行table外的按钮操作区域
			paginName: '', //设置分页区域
			defaultimg: '/static/images/noimage.gif', //加载默认图
			edit: '', //编辑区
			curPage: 1, //默认显示当前页
			Sequence: [], //输入需要排序的位置排序
			SearchSave:false,//是否启用搜索后刷新界面依然保持搜索结果内容
			RightClick: false, //是否允许右键
			mobile: false, //是否启用移动模式
			scrollName: null, //滚动区域
			template: true, //是否启用内置模块编辑
			Tablefold:true,//是否折叠Table表单，只适用data-tree="tree"时使用 参数TreeStatus为true时使用该参数
			btnpageing: 5, //用于显示分页列表按钮数量
			mode: '', //html界面显示模table\ul
			setItem: '', //存储表名
			pagenumber:20,//设置页面数量，主要是防止分页数量过大导致分页失败，设置最大数量
			CustomName: '',
			treeCompose:true,//是否启用内置数据方法重构
			TreeStatus: false, //是否启用树状图结构
			treeArrowSite: 1, //树状图箭头位置
			treeSpacing:20,//树状风机间距
			treeclick:false,//启用树状下的点击方法，
			treeCustomicon:["&#xe60f;","&#xe67d;"],//树状图图标自定义
			CustomKey: '',
			FixedCote:null,//固定栏目的位置及其数量
			loading: '<div class="padding05">加载中请稍等......</div>', //加载样式设置
			ErrorMessage: '操作失败，请稍后再试！', //错误提示信息
			SuccessPrompt: '操作成功！', //成功提示信息
			timeFormat: '', //时间格式
			pageSize: [], //设置每页显示条数
			ViewState: [], //无需设置
			sessionArr: [], //无需设置
			submitName:['修改','保存'],
			mobBackdrop:'',//移动下拉背景样式设置
			SelectName: '', //下拉数据表键值名称，用于数组格式时使用，当有下拉时填写该值，用于获取名称，该值与你数据库中键值名相同
			Callback: function() {}, //回调table数据
			promptCallback:function(){},//提示回调的方法
			SpreadEvent: function() {}, //用户自定义扩展方法
			DeleteEvent: function() {}, //删除
			ModifyEvent: function() {}, //修改
			DetailedEvent: function() {}, //详细
			SelectEvent: function() {}, //下拉操作，只在于有下拉时进行编辑。
			SaveEvent: function() {}, //保存提交事件
			CheckboxDeleteEvent: function() {}, //批量删除事件
			SearchEvent: function() {}, //搜索事件
			ExceldData: function() {}, //导出表格
			BatchModifyEvent:function(){},//批量操作的方法
			OperationEventSet:function(){}//事件操作集合方法
		};
		this.par = extend(par, options, true);
		this.eve=function(eve){
			var evt = eve || window.event; //指向触发事件的元素
			var obj = evt.target || evt.srcElement || eve.srcElement; //指向触发事件的元素
			return obj;
		},
		this.$=function(className,topWindow) {
			var expression=/^\#|[\.]|\-\b$/;
			var v=expression.test(className);
			if(v==true){
				if(className.indexOf("#")!= -1){
					topWindow!=undefined?className=topWindow.getElementById(className.slice(1)):className= document.getElementById(className.slice(1));
				}else if(className.indexOf(".")!= -1){
					if(!document.getElementsByClassName){
						topWindow!=undefined?className= this.getElementsByClassName(topWindow,className.slice(1))[0]:className= this.getElementsByClassName(document,className.slice(1))[0];
					}else{
						topWindow!=undefined?className= topWindow.getElementsByClassName(className.slice(1))[0]:className= document.getElementsByClassName(className.slice(1))[0];
					}
				}
			}
			return className;
		};
		//判断是否存在class属性方法
		this.hasClass = function(elements, cName) {
			return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
		}
		//添加class属性方法
		this.addClass = function(elements, cName) {
			var reg =/^\s|\s$/;
			if(!this.hasClass(elements, cName)) {
				var n=elements.className;
				if(reg.test(n)){
				     elements.className=n.replace(/(^\s*)|(\s*$)/g,"");
				}
				elements.className += " " + cName;
				
			};
		};
		//删除class属性方法 elements当前结构  cName类名
		this.removeClass = function(elements, cName) {
			var reg =/\s$/g;
			if(this.hasClass(elements, cName)) {
				var classm=elements.className;
				if(reg.test(classm)){
					 elements.className=classm.replace(/\s*$/g,"");
				}
				elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
			};
		};
		//根据class类名条件筛选结构
		this.getByClass = function(oParent, sClass) { //根据class获取元素
			var oReasult = [];
			var oEle = oParent.getElementsByTagName("*");
			for(i = 0; i < oEle.length; i++) {
				if(oEle[i].className == sClass) {
					oReasult.push(oEle[i]);
				}
			};
			return oReasult;
		};
		this.eve=function(eve){
			var evt = eve || window.event; //指向触发事件的元素
			var obj = evt.target || evt.srcElement || eve.srcElement; //指向触发事件的元素
			return obj;
		},
		this.Attributes=function(parent,name,value){
			var Attributes = document.createAttribute(name);
			Attributes.nodeValue =value;
			return parent.setAttributeNode(Attributes);
		};
		//根据class类名条件筛选结构
		this.getElementsByClassName = function(parent, className) {
			//获取所有父节点下的tag元素　
			var aEls = parent.getElementsByTagName("*");　　
			var arr = [];
			//循环所有tag元素　
			for(var i = 0; i < aEls.length; i++) {
				//将tag元素所包含的className集合（这里指一个元素可能包含多个class）拆分成数组,赋值给aClassName	　　　　
				var aClassName = aEls[i].className.split(' ');　　　　 //遍历每个tag元素所包含的每个className
				for(var j = 0; j < aClassName.length; j++) {　　　　　　 //如果符合所选class，添加到arr数组				　　　　　
					if(aClassName[j] == className) {　　　　　　　　
						arr.push(aEls[i]);　　　　　　　　 //如果className里面包含'box' 则跳出循环						　　　　　　　　
						break; //防止一个元素出现多次相同的class被添加多次						　　　　　　
					}　　　　
				};　　
			};　　
			return arr;
		};
		//删除指定_element方法
		this.removeElement = function(_element) {
			var _parentElement = _element.parentNode;
			if(_parentElement) {
				_parentElement.removeChild(_element);
			};
		};
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		this.encode = function (input) {
			var isInteger=function(obj) {
			 return typeof obj === 'number' && obj%1 === 0
			}
	        var output = "";
	        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	        var i = 0;
	        if(isInteger(input)){
	        	input = this._utf8_encode(input.toString());
	        }else{
	        	input = this._utf8_encode(input);
	        }
	        while (i < input.length) {
	            chr1 = input.charCodeAt(i++);
	            chr2 = input.charCodeAt(i++);
	            chr3 = input.charCodeAt(i++);
	            enc1 = chr1 >> 2;
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	            enc4 = chr3 & 63;
	            if (isNaN(chr2)) {
	                enc3 = enc4 = 64;
	            } else if (isNaN(chr3)) {
	                enc4 = 64;
	            }
	            output = output +
	            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
	            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
	        }
	        return output;
        };
         // public method for decoding
	    this.decode = function (input) {
	        var output = "";
	        var chr1, chr2, chr3;
	        var enc1, enc2, enc3, enc4;
	        var i = 0;
	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	        while (i < input.length) {
	            enc1 = _keyStr.indexOf(input.charAt(i++));
	            enc2 = _keyStr.indexOf(input.charAt(i++));
	            enc3 = _keyStr.indexOf(input.charAt(i++));
	            enc4 = _keyStr.indexOf(input.charAt(i++));
	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;
	            output = output + String.fromCharCode(chr1);
	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }
	        }
	        output = this._utf8_decode(output);
	        return output;
	    };
	    // private method for UTF-8 encoding
	    this._utf8_encode = function (string) {
	        string = string.replace(/\r\n/g,"\n");
	        var utftext = "";
	        for (var n = 0; n < string.length; n++) {
	            var c = string.charCodeAt(n);
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            } else if((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            } else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	        }
	        return utftext;
	    };
	    // private method for UTF-8 decoding
	    this._utf8_decode = function (utftext) {
	        var string = "";
	        var i = 0;
	        var c =0, c1 =0, c2 = 0,c3=0;
	        while ( i < utftext.length ) {
	            c = utftext.charCodeAt(i);
	            if (c < 128) {
	                string += String.fromCharCode(c);
	                i++;
	            } else if((c > 191) && (c < 224)) {
	                c2 = utftext.charCodeAt(i+1);
	                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	                i += 2;
	            } else {
	                c2 = utftext.charCodeAt(i+1);
	                c3 = utftext.charCodeAt(i+2);
	                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	                i += 3;
	            }
	        }
	        return string;
	    };
		this.show(this.par);
	},
	//方法
	show: function(callback) {
		var _this = this;
		var Table = TAB$(callback.TableName);
		var other = TAB$(callback.btnArea); //声明执行对象
		var mode = callback.mode;
		var args = callback.Sequence;
		var tablew=0,tt=0;
		if(mode == "table") {
			    _this.addClass(Table,"sys-table");
			// 设置表头的状态位，排序时根据状态判断升降序
			for(var x = 0; x < Table.rows[0].cells.length; x++) {
				callback.ViewState[x] = false;
				var th = document.createAttribute("data-th");
				var thindex = document.createAttribute("sys-index");
				th.nodeValue = x;
				thindex.nodeValue = x;
				Table.rows[0].cells[x].setAttributeNode(th);
				Table.rows[0].cells[x].setAttributeNode(thindex);
				var cw=Table.rows[0].cells[x].width;
				if(cw==""){cw=100;}else{tt++}
				tablew+=parseInt(cw);
			};
			if(args != null){
				for(var s = 0; s < args.length; s++) {
					if(args.length > 1) {
						if(args.length > Table.rows[0].cells.length) {
							continue;
						} else {
							var tablespan = document.createElement("span");
							var Text=Table.rows[0].cells[args[s]].innerText;
							tablespan.innerHTML=Text;
							Table.rows[0].cells[args[s]].innerHTML=''
							Table.rows[0].cells[args[s]].appendChild(tablespan);
							var newDiv = TABLAYER$("em");
							_this.addClass(newDiv, 'NormalCss');
							_this.Attributes(Table.rows[0].cells[args[s]],"data-name","onSequence");
							Table.rows[0].cells[args[s]].appendChild(newDiv);
							Table.rows[0].cells[args[s]].onclick = function(e) {
								var sortname = e.target;
								var z = sortname.getAttribute("data-th");
								for(var m = 0; m < args.length; m++) {
									var id = args[m];
									if(id == z) {
										_this.onSequence(Table, id, sortname,0,callback.ViewState);
									}
								}
							};
							Table.rows[0].cells[args[s]].style.cursor = "pointer";
						}
					}
				}
			};
			//checkbox全选选择操作，表格列宽拖拽
			
			for(var x = 0; x < Table.rows[0].cells.length; x++) {
				var tTD;
				var checkbox = Table.rows[0].cells[x].getElementsByTagName('input')[x];
				checkbox ? Table.rows[0].cells[x].onclick = function(e) {
					for(var m = 0; m < Table.rows[0].cells.length; m++) {
						_this.oncheckbox(Table, m);
					}
				} : '';
				//表格拖拽
				Table.rows[0].cells[x].onmousedown = function(e) {
					tTD = this; 
					_this.Dragdrop(e, Table, tTD, this,_this);
					var eve=_this.eve(e);
					eve.onmousemove = function(e) {
						_this.onmousemoveDrop(e, Table, tTD, this,_this);
					}
				}
				Table.rows[0].cells[x].onmouseup = function(e) {
					if (tTD == undefined) tTD = this;
					_this.onmouseupDrop(e, Table, tTD, this,_this);
				}
				Table.rows[0].cells[x].onmousemove = function(e) {
					var col = this.cellIndex;
					//更改鼠标样式
					if(e.offsetX > Table.rows[0].cells[col].offsetWidth - 4) {
						Table.rows[0].cells[col].style.cursor = 'col-resize';
					} else {
						Table.rows[0].cells[col].style.cursor = 'default';
					}
				}
			};
			var tablediv = document.createElement("div");
			_this.addClass(tablediv,'sys-table-content');
			Table.parentElement.appendChild(tablediv);
			tablediv.appendChild(Table);
			var winw=_this.width();//浏览器宽度
			var tw=Table.clientWidth//表格宽度
			if(tt==Table.rows[0].cells.length){
				Table.style.width=tablew+'px';
				tablediv.style.overflow="scroll"
			}else if(tablew<winw){
				Table.style.width="100%";
			}else{
				Table.style.width=tablew+'px';
				tablediv.style.overflow="scroll"
			}
		}
		if(callback.RightClick == true) {
			document.oncontextmenu = function(e) {
				e.preventDefault();
				e.stopPropagation();
			}
		}; //禁用右键功能
		_this.sessionArrhtml(Table);
		 var obj=null;
		_this.par.SpreadEvent(_this,Table,obj);
		_this.DoubleclickModule(_this,Table);
		_this.callbackf(Table, _this, other);
	},
	width: function() {
		return self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	},
	height: function() {
		return self.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	},
	//判断是手机还是pc
	isMobile: function(mobile_flag) {
		var userAgentInfo = navigator.userAgent;
		var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
		var mobile_flag = false;
		//根据userAgent判断是否是手机
		for(var v = 0; v < mobileAgents.length; v++) {
			if(userAgentInfo.indexOf(mobileAgents[v]) > 0) {
				mobile_flag = true;
				break;
			}
		}
		var screen_width = window.screen.width;
		var screen_height = window.screen.height;
		//根据屏幕分辨率判断是否是手机
		if(screen_width < 500 && screen_height < 800) {
			mobile_flag = true;
		}
		return mobile_flag;
	},
	getScrollHeight: function() {
		var fileh = TAB$(_this.par.scrollName);
		var scrollHeight = 0,
			bodyScrollHeight = 0,
			documentScrollHeight = 0;　　
		if(fileh!=null) {　　　　
			bodyScrollHeight = fileh.scrollHeight;　
			if(document.documentElement) {　　　　
			    documentScrollHeight = fileh.scrollHeight;　　
		    }　
		}　　　　
		scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;　　
		return scrollHeight;
	},
	//处理移动端还是PC端的事件
	mobileflag: function(Table, curPage, pageTotal, pageSize, total,boxname) {   //curPage当前页数,pageTotal总页数,pageSize每页显示数量
		var _this = this;
		var mobile_flag = _this.isMobile(mobile_flag);
		//当为移动端时处理事件
		var GetSlideDirection=function(startX, startY, endX, endY) {
	      var dy = startY - endY;
	      var result = 0;
	      if(dy>0) {//向上滑动
	        result=1;
	      }else if(dy<0){//向下滑动
	        result=2;
	      }
	      else
	      {
	        result=0;
	      }
	      return result;
        }
		if(mobile_flag) {
			var startY = 0,startPos,startPX, startPY; ;
			const maxMove = 400;//效果
			var scroll = TAB$(_this.par.scrollName);
			var windowHeight = 0;
			var header = document.getElementsByTagName('header')[0].clientHeight;
			if(document.compatMode == "CSS1Compat") {　　　　
				windowHeight = document.documentElement.clientHeight - header;　　
			} else {　　　　
				windowHeight = document.body.clientHeight - header;　　
			}
				var backdrop = TABLAYER$('div');
			    backdrop.innerHTML = _this.par.mobBackdrop;
			    backdrop.className = 'backdrop';
			    Table.parentNode.appendChild(backdrop);
			scroll.addEventListener('touchstart', function(event) {
				var i=0;
				startY = event.changedTouches[0].clientY;
				var touch = event.targetTouches[0];
				startPX = event.touches[0].pageX;
                startPY = event.touches[0].pageY;
				startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
				startcli=i++;
				//初始加载样式
			});
			 scroll.addEventListener('touchmove', function(e) {
			  	const y = e.changedTouches[0].clientY - startY <= maxMove ? e.changedTouches[0].clientY - startY : maxMove;
				Table.style.transition = "none";
                Table.style.transform = 'translateY('+0.3*y+'px)';  // 阻尼系数0.3
                var backdrop = document.body.querySelector(".backdrop");
                 if(backdrop!=null){
                 	backdrop.style.transition = "none";
	                backdrop.style.display="block";
	                backdrop.style.transform = 'translateY('+0.1*y+'px)';  // 阻尼系数0.1
                 }
               startcli;
			});
			scroll.addEventListener('touchend', function(event) {
				startcli;
			    Table.style.transition = 'transform .6s';
                Table.style.transform = 'translateY('+0+'px)';
                var transform = Table.style.transform || '';
                var transformY = transform.match(/translateY\(\s*(\d+)px\)/)[1];
                var duration = +new Date - startPos.time;    //滑动的持续时间
                var endX, endY;
			    endX = event.changedTouches[0].pageX;
			    endY = event.changedTouches[0].pageY;
			    var direction = GetSlideDirection(startPX, startPY, endX, endY);
                if(Number(duration) > 300){
                   if(startcli==0){
		                if(transformY==0){
		                	  switch(direction) {
							        case 0:
							          break;
							        case 1:
							          // 向上
							          _this.scrollchange(Table,scroll, windowHeight, pageSize,pageTotal, event,curPage);
							          break;
							        case 2:
							          // 向下
							          _this.scrollchange(Table,scroll, windowHeight, pageSize,pageTotal, null,curPage);
							          break;
							        default:
							      }
		                   startcli++;
		                }
	                 }
                }
                var backdrop = document.body.querySelector(".backdrop");
                if(backdrop!=null){
                	backdrop.style.transition = 'transform .6s';
                    backdrop.style.transform = 'translateY('+0+'px)';
                	_this.removeElement(backdrop);
                }
			});
		} else {
            return false;
		}
	},
	scrollchange: function(Table,scroll, windowHeight, pageSize,pageTotal, obj,curPage) {
		var nameedit,
			edit = TAB$(_this.par.edit);
		edit ? nameedit = TAB$(_this.par.edit) : nameedit = Table.getElementsByTagName('tbody')[0];
		var getScrollTop =Math.ceil(scroll.scrollTop);
		var getScrollHeight = _this.getScrollHeight(getScrollHeight);
		if(getScrollTop + windowHeight == getScrollHeight) {
			var boxname = _this.par.CustomName;
			var edit = _this.getElementsByClassName(nameedit.parentNode, boxname);
			var sm = Math.ceil(edit.length / pageSize);
			    sm++;
			if(sm<=pageTotal){
				var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
				_this.par.Callback(Table, _this, sm, pageSize, obj);
			}
		}else if(getScrollTop==0){
			//var curPage=_this.par.curPage;
            _this.par.Callback(Table, _this, curPage, pageSize, obj);//执行回调的方法
            var pro = document.body.querySelector(".mobile_prompt");
            pro!=null?_this.removeElement(pro):'';
		}
	},
	//回调table数据的方法
	callbackf: function(Table, obj, other) {
		var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
		var name;
		var size = obj.par.pageSize;
		var pageSize = size[0];
		var curPage = obj.par.curPage;
		if(condition != null) {
			var value = condition[0].sname;
			var type = condition[0].status;
			obj.par.SearchEvent(obj, value, curPage, pageSize, null, type);
		} else {
			obj.par.Callback(Table, obj, curPage, pageSize, name);//执行回调的方法
		}
		obj.ajaxObject(obj);
		obj.Selectedbtnmethod(other, Table, obj, curPage, pageSize);
	},
	//设置一个提示框，编辑提示框，texts为提示文本 ，time为显示时间秒单位
	PromptBox: function(texts, time, status) {
		var _this = this;
		var b = document.body.querySelector(".box_Bullet");
		if(!b) {
			var box = document.createElement("div");
			document.body.appendChild(box).className = "box_Bullet";
			var boxcss = document.querySelector(".box_Bullet");
			var winWidth = window.innerWidth;
			document.body.appendChild(box).innerHTML = texts;
			var wblank = winWidth - boxcss.offsetWidth;
			box.style.cssText = "width:" + boxcss.offsetWidth + "px" + "; left:" + (wblank / 2) + "px" + ";" +
				"margin-top:" + (-boxcss.offsetHeight / 2) + "px";

			var int = setInterval(function() {
				time--;
				_this.endclearInterval(time, box, int);
			}, 1000);

		} else if(status == true) {
			document.body.removeChild(b);
			return;
		}
	},
	//手动关闭遮罩层
	 hideLoading:function(){
		var box = document.body.querySelector(".box_Bullet");
		var masklayer = document.body.querySelector(".masklayer");
		if (box) {
			document.body.removeChild(box);
			if(masklayer){
				document.body.removeChild(masklayer);
			}
		}
	},
	endclearInterval: function(time, box, int) {
		time > 0 ? time-- : clearInterval(int);
		if(time == 0) {
			clearInterval(int);
			document.body.removeChild(box);
			return;
		}
	},
	ajax:function(options) {
	    options = options || {};
	    options.type = (options.type || "GET").toUpperCase();
	    options.dataType = options.dataType || 'json';
	    options.async = options.async || true;
	    options.timeout=options.timeout||8000;//超时处理，默认8s
	    var params = getParams(options.data);
	    var timeoutFlag=null;
	    var xhr;
	    var that=this;
	    try {
			// Firefox, Opera 8.0+, Safari
			xhr = new XMLHttpRequest();
		}catch(e) {
			// Internet Explorer
			try{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					that.PromptBox('您的浏览器不支持AJAX', 2, false);
					return false;
				}
			}
		}
	    xhr.onreadystatechange = function() {
	        if(options.dataType === 'json'){
	            if (xhr.readyState == 4) {
	                window.clearTimeout(that.timeoutFlag);
	                var status = xhr.status;
	                if (status >= 200 && status < 300) {
	                    // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
	                    options.success && options.success(xhr.responseText, xhr.responseXML);
	                } else {
	                    options.fail && options.fail(status);
	                }
	            }
	        } else {
	            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	                window.clearTimeout(that.timeoutFlag);
	                var oScript = document.createElement('script');
	                document.body.appendChild(oScript);
	                var callbackname = 'ajaxCallBack'
	                oScript.src = options.url + "?" +  params+'&callback='+callbackname;
	
	                window['ajaxCallBack'] = function(data) {
	                    options.success(data);
	                    document.body.removeChild(oScript);
	                };
	            }
	        }
	    };
	    if (options.type == 'GET') {
	        xhr.open("GET", options.url + '?' + params, options.async);
	        xhr.send(null)
	    } else if (options.type == 'POST') {
	        xhr.open('POST', options.url, options.async);
	        if(options.contentType=="undefined"||options.contentType==null){
	            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	            xhr.send(params);
	        }else{
	            xhr.setRequestHeader('Content-Type', options.contentType);
	            xhr.send(JSON.stringify(options.data));
	        }
	    }
	    this.timeoutFlag=window.setTimeout(function(){//计时器，超时后处理
	        window.clearTimeout(that.timeoutFlag);
	        //options.fail("timeout");
	        xhr.abort();
	    }.bind(this),options.timeout);
	},
	getParams:function(data) {
	    var arr = [];
	    for (var param in data) {
	        arr.push(encodeURIComponent(param) + '=' + encodeURIComponent(data[param]));
	    }
	    return arr.join('&');
	},
	//声明ajax方法.，用于判断浏览器是否支持ajax
	ajaxObject: function(obj) {
		var xmlHttp;
		try {
			// Firefox, Opera 8.0+, Safari
			xmlHttp = new XMLHttpRequest();
		} catch(e) {
			// Internet Explorer
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					obj.PromptBox('您的浏览器不支持AJAX', 2, false);
					return false;
				}
			}
		}
		return xmlHttp;
	},
	//Get请求
	ajaxGet: function(url, success, curPage, pageSize, obj, name,customizes) {
		var _this = this;
		var template = _this.par.template;
		var start = 0,
			end = 0;
		var Table = TAB$(_this.par.TableName);
		var ajax = _this.ajaxObject();
		ajax.open("get", url, true);
		if(ajax) {
			_this.PromptBox(_this.par.loading, 0, true);
		}
		ajax.onreadystatechange = function() {
			if(ajax.readyState == 4) {
				if(ajax.status == 200) {
					var json = ajax.responseText; //获取到json字符串，还需解析
					if(json == "202") {
						_this.PromptBox(_this.par.SuccessPrompt, 2, false);
						var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
						if(condition != null) {
							var value = condition[0].sname;
							var type = condition[0].status;
							_this.par.SearchEvent(Table, value, curPage, pageSize, null, type);
						} else {
							_this.par.Callback(Table, _this, curPage, pageSize, name);//执行回调的方法
						}
						_this.PromptBox(_this.par.SuccessPrompt, 0, true);
						return;
					} else if(json == "101") {
						_this.PromptBox(_this.par.ErrorMessage, 2, false);
						_this.hideLoading();
						return;
					} else {
						var JsonStr = JSON.parse(json); //将字符串转换为json数组
						if(template == true) {
							if(success == "select") {
								_this.SelectMethod(Table, JsonStr, _this, curPage);
								_this.hideLoading();
							}else if(name == 'Excel') {
								_this.Excelentire(Table, _this, JsonStr, obj,name); //用于执行Excel导出功能
								_this.hideLoading();
							}else if(JsonStr.type==0){
								_this.hideLoading();
								_this.par.promptCallback(_this,Table,JsonStr,obj);
							}else{
								if(customizes==true){
									_this.par.SpreadEvent(_this,JsonStr,Table,obj,customizes,curPage, pageSize,name);
									_this.hideLoading();
								}else{
									_this.contenthtml(Table, JsonStr, _this, curPage, pageSize, obj, name);
								    _this.hideLoading();
								}

							}
						}
						
						return;
					}
				} else {
					_this.PromptBox("HTTP请求错误！错误码：" + ajax.status, 2, false);
				}
				return
			}
		};
		ajax.send();
	},
	//Post请求
	ajaxPost: function(url, data, evnet, layer) {
		var _this = this;
		var ajax = _this.ajaxObject();
		ajax.open("post", url, true);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		ajax.onreadystatechange = function() {
			if(ajax.readyState == 4) {
				if(ajax.status == 200) {
					_this.statusname(ajax.responseText, _this, evnet, layer);//状态类型判断
				} else {
					_this.PromptBox("HTTP请求错误！错误码：" + ajax.status, 2, false);
					return;
				}
			} else {
				return
			}
		}
		typeof(data) != "undefined" ? ajax.send(data): '';
	},
	//状态类型判断
	statusname: function(status, set, evnet, layer) {
		//判断是的保存按钮操作
		var lw=0;
		if(evnet.name == "SaveEvent") {
			if(status == "101") {
				set.PromptBox(set.par.ErrorMessage, 2, false);
			} else if(status == "202") {
				//保存信息返回修改后的信息，不刷新界面，需用户主动刷新，减少服务器请求，查看修改后的信息
				set.PromptBox(set.par.SuccessPrompt, 2);
				var edit = set.getByClass(layer.parentNode, 'table-edit');
				for(var i = 0; i < edit.length; i++) {
					var selected = edit[i].getElementsByTagName("select")[0]; // 选中索引
					if(selected) {
						var index = selected.selectedIndex; // 选中索引
						var text = selected.options[index].innerHTML;
					} else {
						var text = edit[i].getElementsByTagName("input")[0].value;
					}
					var muster = _this.getElementsByClassName(edit[i], 'radio');
					if(muster != 0) {
						for(var c = 0; c < muster.length; c++) {
							var n = muster[c].getElementsByTagName("input")[0].getAttribute("data-name");
							if(muster[c].getElementsByTagName("input")[0].checked == true) {
								var text = n;
							}
						}
					}
					edit[i].innerHTML = text;
					
					
				}
				evnet.innerHTML =set.par.submitName[1];
				evnet.name = 'modifyEvent';
			}
		} else {
			if(status == "101") {
				set.PromptBox(set.par.ErrorMessage, 2, false);
			} else if(status == "202") {
				set.PromptBox(set.par.SuccessPrompt, 2, false);
			}
		}
	},
	//保存后改变当前栏目的样式方法
	ChangeModule:function(set,layer,evnet){
		var Table = TAB$(set.par.TableName);
		var lw=0;
		//保存信息返回修改后的信息，不刷新界面，需用户主动刷新，减少服务器请求，查看修改后的信息
		var tr=layer.parentNode.parentNode;
		var edit = set.getElementsByClassName(tr, 'table-edit');
		for(var i = 0; i < edit.length; i++) {
			lw=0;
			var selected = edit[i].getElementsByTagName("select")[0]; // 选中索引
			if(selected) {
				var index = selected.selectedIndex; // 选中索引
				var text = selected.options[index].innerHTML;
			} else {
				var text = edit[i].getElementsByTagName("input")[0].value;
			}
			var muster = _this.getElementsByClassName(edit[i], 'radio');
			if(muster != 0) {
				for(var c = 0; c < muster.length; c++) {
					lw+=muster[c].offsetWidth;
					var n = muster[c].getElementsByTagName("input")[0].getAttribute("data-name");
					if(muster[c].getElementsByTagName("input")[0].checked == true) {
						var text = n;
					}
				}
			}
			edit[i].style.width="";
			edit[i].innerHTML = text;
			var tw=Table.offsetWidth;
			Table.style.width=tw-lw+'px';
		}
		evnet.innerHTML = set.par.submitName[0];
		evnet.name = 'modifyEvent';
		set.removeClass(evnet,"btn-save");
		layer.innerHTML = set.par.submitName[0];
		layer.name = 'modifyEvent';
		set.removeClass(layer,"btn-save");
	},
	//session存储html
	sessionArrhtml: function(Table) {
		_this = this;
		var list,
			edit = TAB$(_this.par.edit);
		edit ? list = TAB$(_this.par.edit) : list = Table.getElementsByTagName('tbody')[0];
		var rota = _this.par.setItem;
		var menu = JSON.parse(window.sessionStorage.getItem(rota));
		if(menu==null){
			var sessionArr = _this.par.sessionArr; //声明新的数组
			var obj = {
				html: list.innerHTML
			};
			sessionArr.push(obj);
			var html = JSON.stringify(sessionArr);
			window.sessionStorage.setItem(rota, html); //保存存储名为menu
		}
		//新建保存当前table
		var menu = 'Excel';
		var EsessionArr = _this.par.sessionArr; //声明新的数组
		var Excelhtml = {
			html: Table.innerHTML
		};
		EsessionArr.push(Excelhtml);
		var Ehtml = JSON.stringify(EsessionArr);
		window.sessionStorage.setItem(menu, Ehtml); //保存存储名为menu
	},
	//合并数
	twoJsonMerge:function(json1,json2){
		var length1 = 0,length2 = 0,jsonStr,str;
		for(var ever in json1) length1++;
		for(var ever in json2) length2++; 
		if(length1 && length2)str = ',';
		else str = '';
		jsonStr = ((JSON.stringify(json1)).replace(/,}/,'}') + (JSON.stringify(json2)).replace(/,}/,'}')).replace(/}{/,str);
		return JSON.parse(jsonStr);
	},
	PrintModule:function(_this,table,e){
		var eve=_this.eve(e);
		var title=eve.getAttribute("data-name");
		var prints=eve.getAttribute("data-print");
		var copyhtml=function(html){
			var list = table;
			var newtable;
			newtable = TABLAYER$('table');
			newtable.id = 'Newtable';
			document.body.appendChild(newtable);
			newtable.style.cssText = "display:none;";
			var copy = list.innerHTML;
			newtable.style.width="100%";
			newtable.innerHTML = copy; //拷贝样式内容到新的table中
			for(var x = 1; x < newtable.rows.length; x++) {
				var z = newtable.rows[x].cells.length;
				if(prints!=null){
					var result = prints.split(",");
					for(var i=0;i<result.length;i++){
						var S=parseInt(result[i]);
						for(var c = newtable.rows.length - 1; c >= 0; c--) {
							var Child = newtable.rows[c].cells[S];
							Child.style.display="none"
						}
					}
				}
			}
			var html = newtable.innerHTML;
			return html; //对新拷贝的表格进行处理获取内容
		}()
		var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
		if (userAgent.indexOf("trident") > -1) {
			_this.PromptBox("请使用google或者360浏览器打印", 2, false);
			return false;
		} else if (userAgent.indexOf('msie') > -1) {
			var onlyChoseAlert = simpleAlert({
				"content" : "请使用Google或者360浏览器打印",
				"buttons" : {
					"确定" : function() {
						onlyChoseAlert.close();
					}
				}
			})
			_this.PromptBox("请使用google或者360浏览器打印", 2, false);
			return false;
		} else {//其它浏览器使用lodop
			var oldstr = document.body.innerHTML;
			var headstr = "<html><head><title></title></head><style type='text/css'>table td{border: 1px solid #333333;padding:5px}table th{border: 1px solid #333333;background: #F2F2F2;}</style><body>";
			var footstr = "</body></html>";
			//执行隐藏打印区域不需要打印的内容
			var printData ="<table style='border: 1px solid #333333;border-collapse: collapse;width:100%'>"+copyhtml+"</table>"; //获得 div 里的所有 html 数据
			var wind = window.open("", "newwin","toolbar=no,scrollbars=yes,menubar=no");
			wind.document.body.innerHTML = headstr + printData + footstr;
			wind.print();
			wind.close();
		}
	},
	//双击选中当前栏目
	DoubleclickModule:function(_this,treelist){
		var actives=function(obj,status){
			var Fixedtable=_this.getElementsByClassName(treelist.parentNode.parentElement,"sys-Fixed-table");
			var dindex=obj.getAttribute("sys-index");
			if(dindex!=null){
				for(var i = 0; i < Fixedtable.length; i++) {
					var F=_this.getElementsByClassName(Fixedtable[i],"table")[0];
					for(var t = 1; t < F.rows.length; t++) {
						var fi=F.rows[t].getAttribute("sys-index");
						 var pick= _this.getElementsByClassName(F.rows[t].cells[0],"sys-checkbox")[0];
						if(fi==dindex){
							if(status==true){
								pick?pick.checked=true:'';
								_this.addClass(F.rows[t], 'sys-table-selected');
							}else{
								pick?pick.checked=false:'';
								_this.removeClass(F.rows[t], 'sys-table-selected');
							}
						}
					}
				}
				for(var i = 0; i < treelist.rows.length; i++) {
					var fi=treelist.rows[i].getAttribute("sys-index");
						if(fi==dindex){
							if(status==true){
								_this.addClass(treelist.rows[i], 'sys-table-selected');
							}else{
								_this.removeClass(treelist.rows[i], 'sys-table-selected');
							}
						}
				}
				if(status==true){
					_this.addClass(obj, 'sys-table-selected');
				}else{
					_this.removeClass(obj, 'sys-table-selected')
				}
			}
		}
		treelist.ondblclick=function(e){
			var obj=_this.eve(event);
			if(_this.par.mode="table"){
				var FixedCote=_this.par.FixedCote;
				var cells=obj.parentNode.cells;
				var formatname = obj.getAttribute("data-format"); //格式
				var keyvalue = obj.getAttribute("data-value");
				if(cells!=undefined){
				    if(formatname == "calculate"){
				    	var pricelist= _this.getElementsByClassName(obj.parentNode,"price-edit");
				    	var decimal=obj.getAttribute("data-decimal");
				    	var calculate=obj.getAttribute("data-calculate");
				    	decimal==null?decimal=0:decimal=decimal
				   	   	var text=obj.innerText;
				   	   	obj.innerHTML = "<input type='text' class='edit-text sys-calculate' data-decimal='"+decimal+"' data-calculate='"+calculate+"'  style='width:80px' value='" + text + "' name='" + keyvalue + "' sys-key='"+keyvalue+"' />";
				   	   	_this.MoveAndOutModule(_this,obj,calculate,pricelist);
				   	 }else{
				   		for(var c=0;c<cells.length;c++){
				   	   	var checkboxs= _this.getElementsByClassName(cells[c],"sys-checkbox")[0];
			   	        if(checkboxs!=undefined){
			   	           	    if(FixedCote!=null){
			   	           	    	if(checkboxs.checked==false){
			   	           	    		checkboxs.checked=true;
			   	           	    		actives(obj.parentNode,true);
					   	          		_this.addClass(obj.parentNode,"sys-table-selected");
			   	           	    	 }else{
			   	           	    	 	checkboxs.checked=false;
			   	           	    	 	actives(obj.parentNode,false);
					   	          		_this.removeClass(obj.parentNode,"sys-table-selected");
			   	           	    	 }
			   	           	    }else{
			   	           	    	if(checkboxs.checked==true){
				   	          			checkboxs.checked=false;
					   	          		_this.removeClass(obj.parentNode,"sys-table-selected");
					   	          	}else{
					   	          		checkboxs.checked=true;
					   	          		_this.addClass(obj.parentNode,"sys-table-selected");
					   	          	}
			   	           	    }
			   	            } 
				   	    } 
		   	        }
				}
			}
		}
	},
	//鼠标移入移出文本框操作方法
	MoveAndOutModule:function(_this,obj,calculate,pricelist){
			var inputs= _this.getElementsByClassName(obj,"sys-calculate")[0];
			if(calculate=="amount"){
				var Integer=/[^\d]/g;
			}else{
				var Integer=/[^\d^\.]+/g;
			}
			var points=function(h){
				var s='';
				for(var c = h-1; c >= 0; c--) {
			  		s+=0;
				}
				return s;
			};
			var Solution=function(a, b,h) {
				var  m = 0;  //精度
				
				if(a===0 || b===0) return 0+"."+points(h); 
				let s1 = a.toString();
				let s2 = b.toString();
				var regu = "^([0-9]*[.0-9])$"; // 小数
	 			var dd = new RegExp(regu);
				if(s1.indexOf('.')==-1 && s2.indexOf('.')==-1){
				  	var total=a*b;
				  	var tests=dd.test(total);
				  	if(tests){
				    	  return total+"."+points(h);;
				    }else{
				    	var xs=total.toString().split(".")[1].length;
				    	if(xs==h){
				    		return total;
				    	}else{
				    		h=(h-xs);
				    		return total+points(h);
				    	}
				    	 
				    }
				  }else{
				    //计算s1小数点后的位数
				    m = m + ((s1.indexOf('.') >=0 ) ? s1.split('.')[1].length : 0);
				    //计算s2小数点后的位数
				    m = m + ((s2.indexOf('.') >=0 ) ? s2.split('.')[1].length : 0);
				    //除小数点后的所有位数相乘/精度
				    var total=Number(s1.replace('.','')) * Number(s2.replace('.','')) / Math.pow(10,m);
				    var tests=dd.test(total);
				    if(tests){
				    	  return total+"."+points(h);;
				    }else{
				    	var xs=total.toString().split(".")[1].length;
				    	if(xs==h){
				    		return total;
				    	}else{
				    		h=(h-xs);
				    		return total+points(h);
				    	}
				    }
				} 
			}
			var oninput=function(event){
				var eve=_this.eve(event);var num=0,ZJ=0; 
				var decimal=eve.getAttribute("data-decimal");
				decimal==null?decimal=0:decimal=parseInt(decimal);
				var split=eve.value.split(".").length;
				if(Integer.test(eve.value)){
					_this.PromptBox("文本内容只能是数字", 2);
					eve.value=0;
					return false;
				}else if(split>2){
					_this.PromptBox("只能为一个小数点", 2);
					eve.value=0;
					return false;
				}else if(eve.value==0){
					if(calculate=="amount"){
						eve.value=0;
					}else{
						eve.value=0+"."+points(decimal);
					}
				}else{
					obj.innerHTML=eve.value;
					num=eve.value;
					var re=new RegExp("/([0-9]+.[0-9]{"+decimal+"})[0-9]*/", "g"); 
					num = num.replace(re,"$1");
					for(var s = pricelist.length - 1; s >= 0; s--) {
						var M,P,L,T,ST,CT,LT;
						var price=pricelist[s].innerText;
						var calculates=pricelist[s].getAttribute("data-calculate");
					    if(calculates=="stocktotal"){
					       ST= parseFloat(price);
					      	CT=pricelist[s];
					    }else if(calculates=="total"){
					    	T= parseFloat(price);
					    	LT=pricelist[s];
					    }else if(calculates=="stock"){
					    	P= parseFloat(price);
					    }else if(calculates=="amount"){
					    	M= parseFloat(price);
					    }else if(calculates=="price"){
					    	L= parseFloat(price);
					    }
					}
				}
				if(calculate=="stock" || calculate=="amount"){
					if(CT!=undefined){
						var SL= CT.getAttribute("data-decimal");
						SL==null?SL=0:SL=parseInt(SL);
						ZJ=Solution(M,P,SL);
						CT.innerHTML=ZJ
					}else{
						obj.innerHTML=eve.value;
					}
				}else if(calculate=="price" || calculate=="amount"){
					if(LT!=undefined){
						var SL= LT.getAttribute("data-decimal");
						SL==null?SL=0:SL=parseInt(SL);
						ZJ=Solution(M,L,SL);
						LT.innerHTML=ZJ
					}else{
						obj.innerHTML=eve.value;
					}
				}
			}
			//当用户离开input输入框时执行
			inputs.onblur = function(event) {
				oninput(event)
			}
			//元素获取焦点时触发
			inputs.onfocus = function(event) {
				var eve=_this.eve(event);
			};
			//当用户释放键盘按钮时执行
			inputs.onkeyup = function(event) {
				var eve=_this.eve(event);
				if(Integer.test(eve.value)){
					_this.PromptBox("文本内容只能是数字", 2);
					eve.value=0;
					return false;
				}
			}
	},
	//树状图数据结构重组方法
	treedata: function(oldArr, pid, nameedit,NU) {
		var sequence=NU;
		var grade=nameedit.getAttribute("sys-parameter");
		var Level = nameedit.getAttribute("sys-level");//等级状态
		var _this = this,pkey,lkey,vkey,ckey,keyvalue;
		var newArr = [];
		var size = oldArr.length;
		if(grade!=""){
			var gradelist = grade.split(",");
			pkey=gradelist[0];
			lkey=gradelist[1];
            ckey=gradelist[2];
		}
		var newArr = [];
		var size = oldArr.length;
		oldArr.myMap(function(item,i) {
			var cpid=item[lkey];
			if(cpid == pid) {
				NU++;
				var newgroup = {};
				for(var i = 0; i < size; i++) {
					var rows = nameedit.children;
					var cells = nameedit.rows[0].children;
					var tds = nameedit.rows[0].cells.length;
					for(var x = 0; x < tds; x++) {
						var KV = rows[0].getAttribute("data-value");
						KV=KV.split(",");
						var keyvalue = rows[0].cells[x].getAttribute("data-value");
						keyvalue=keyvalue.split(",")[0];
						newgroup[keyvalue] = '';
						KV.myMap(function(res,i){
							if(res!=keyvalue){
								newgroup[res]='';
								var value = item[res];
								newgroup[res] += value;
							}
						})
						var value = item[keyvalue];
						newgroup[keyvalue] += value;
						newgroup[lkey] = cpid;
					}
				}
				newgroup=_this.twoJsonMerge(newgroup,{sequence:NU});
				var cid=item[pkey];
				var child = _this.treedata(oldArr, cid, nameedit,NU);
				if(child.length > 0) {
					newgroup.child = child;
				}
				newArr.push(newgroup);
			}
		});
		return  newArr;
	},
	//循环多级方式获取
	treelevel: function(treelist, sys, nameedit, JsonStr, BrowserInfo, rows,m) {
		var Site = sys.par.treeArrowSite;
		var I,P,L,list,a=0,m,str,count=[],d=0;
		var len=JsonStr.length;
		var parameter=nameedit.getAttribute("sys-parameter");
		if(parameter!="" || parameter!=null){
			var gradelist = parameter.split(",");
			I=gradelist[0];
			P=gradelist[1];
			L=gradelist[2];
		}
		var treehtml=function(data,m,str,i,f,d){	
			var clonedNode = rows[m].cloneNode(true); // 克隆节点
			nameedit.appendChild(clonedNode); //添加克隆的节点
			var tree = rows[m].getAttribute("data-tree"); //获取设置树状图参数
			if(sys.par.treeCompose==true){
				var child = data.child;
			}else{
				var child=data[tree]
			}
			if(sys.par.mode=="table"){
				var cells = nameedit.rows[m].children;
			}else{
				var K = _this.par.CustomKey;
				var cells = sys.getElementsByClassName(rows[m], K);
			}
			var sequence=data.sequence;
			var grade=parseInt(data[L]);
			var id=parseInt(data[I]);
			var pid=parseInt(data[P]);
			var M='';
			if(m!=0){
				var Z;
				var onfather=rows[m-1].getAttribute("data-father");
				var O= onfather.split("-");
					for(var t=0;t<grade;t++){
						if(grade>2){
							Z= onfather.split("-")[t-1];
						}else{
							Z= onfather.split("-")[t];
						}
						
					}
				    var E=onfather.split("-")
			}
			if(grade==0){
				sys.addClass(rows[m], 'father' + i +' sys-tree sys-tree-grade');
				sys.Attributes(rows[m],"data-father",i);
				d=0;
			}else{
				if(f!=0){
					if(d==f){
					  d=f;
					}else{
						if(str==true){
							d=f;
						}
					}
				}
				var M='';
				sys.addClass(rows[m], 'father'+i+' child' + grade +' sys-tree');
				for(var g=0;g<grade;g++){
                      if(g==grade-1){
                      	M+=f
                      }else{
                      	if(grade>=3){
                      		if(str==true){
                      			if(g==1){
	                      	   	    M+=f+'-'
	                      	   	}else{
	                      	   		M+=d+'-'
	                      	   	}
                      		}else{
                      		    if(g==1){
	                      	   	    M+=0+'-'
	                      	   	}else{
	                      	   		M+=d+'-'
	                      	   	}
                      		}
                        }else{
                      	   	M+=d+'-'
                      	}
                      }						
				}
				sys.Attributes(rows[m],"data-father",i+"-"+M);
			}
			sys.Attributes(rows[m],"data-level",grade);
			sys.Attributes(rows[m],"sys-index",count[a-1]);
			var tds = cells.length;
			for(var x = 0; x < tds; x++) {
				var Child = cells[x];
				sys.stencil(nameedit, rows[m], JsonStr, tds, data,count[a-1], Child, x, BrowserInfo,null,grade,i);
			}
			if(str==true){
				var Slidebox = document.createElement("span");
				sys.addClass(Slidebox,"sys-child icon-arrow plus");
				sys.Attributes(Slidebox,"data-sequence",i+"-"+M);
				Slidebox.style.left=(grade+1)*sys.par.treeSpacing+'px'
				sys.Attributes(Slidebox,"data-level",grade);
				sys.Attributes(Slidebox,"name","plusclick");
				sys.Attributes(Slidebox,"data-fid",i);
				cells[Site].appendChild(Slidebox);
				Slidebox.onclick=function(){
					var name = Slidebox.getAttribute('name');
					sys.btnclick(nameedit, data, sys, name, Slidebox, sys.par.curPage, sys.par.pageSize[0],nameedit);
				}
			}
			if(child!=undefined){
				if(child.length>0){	
					for(var f=0;f<child.length;f++){
						if(sys.par.treeCompose==true){
							var childlist = child[f].child;
						}else{
							var CD=child[f];
							var childlist=CD[tree]
						}
						if(childlist!=undefined && childlist.length > 0){
							str=true				
						}else{
							str=false	
						}
						m++;
						count.push(a++);
						treehtml(child[f], count[a-1], str,i,f,d);
					}
				}
			}
		}
		treelist.myMap(function(item,i){
			m=rows.length-1;
			var tree = rows[m].getAttribute("data-tree"); //获取设置树状图参数
			if(sys.par.treeCompose==true){
				var child = item.child;
			}else{
				var child=item[tree]
			}
			if(child!=undefined && child.length > 0){
				str=true				
			}else{
				str=false	
			}
			count.push(a++)
			treehtml(item,m,str,i,0,d);
		})
		if(sys.par.mode=="table"){
			if(len != (nameedit.rows.length)) {
				var ms = nameedit.rows.length;
				for(var a = ms - 1; a >= len; a--) {
					sys.removeElement(nameedit.rows[a]);
				}
			}
		}else{
			var K = _this.par.CustomKey;
			var cells = sys.getElementsByClassName(rows[m], K);
			if(len != (rows.length)) {
				sys.removeElement( rows[rows.length-1]);
				
			}	
		}
	},
	//模版
	contenthtml: function(Table, Callbackdata, _this, curPage, pageSize, obj, name,customize,totalElements,totalPages,addType) {
		var nameedit,
			edit = TAB$(_this.par.edit);
		edit ? nameedit = TAB$(_this.par.edit) : nameedit = Table.getElementsByTagName('tbody')[0];
		var total=null,Array,amount=0;
		if(customize==true){
			var JsonStr=Callbackdata;
			totalElements!=null?total=totalElements:total =parseInt(JsonStr.length);
		}else{
			var JsonStr=Callbackdata.data.data;
			 total = parseInt(JsonStr.total);
		}
		if(pageSize==null){
			var pageTotal = total
		}else{
			var pageTotal = Math.ceil(total / pageSize);
		}
		var rota = _this.par.setItem;
		var mode = _this.par.mode;
		var menu = JSON.parse(window.sessionStorage.getItem(rota));
		var tbody = document.createElement('tbody');
		var boxname = _this.par.CustomName;
		var prompt = "没有找到相关内容";
		modleprompt = "没有更多了";
		if(menu == null) {
			var time = 4;
			var int = setInterval(function() {
				_this.PromptBox("抱歉,浏览记录丢失,将从新刷新页面!", 2);
				time--;
				time > 0 ? time-- : clearInterval(int);
				if(time == 0) {
					clearInterval(int);
					window.location.reload();
					return;
				}
			}, 1000);
		} else {
			if(customize==true){
			var number = JsonStr.length;
			var oldArr = JsonStr;
			}else{
			var number = JsonStr.list.length;
			var oldArr = JsonStr.list;
			}
			if(number != null && number!=0) {
				var s = navigator.userAgent.toLowerCase();
				var BrowserInfo = {
					IsIE: /*@cc_on!@*/ false,
					IsIE9Under: /*@cc_on!@*/ false && (parseInt(s.match(/msie (\d+)/)[1], 10) <= 9),
				};
				if(BrowserInfo.IsIE9Under) {
					edit ? nameedit.innerHTML = menu[0].html : nameedit.appendChild = menu[0].html; //获取session存储的内容导入table表格中

				} else {
					if(obj) {
						if(obj.type != "touchend" && obj.type != "touchmove") {
							nameedit.innerHTML = menu[0].html; //获取session存储的内容导入表格中
							if(obj.name == "RefreshEvent") {
								var get = nameedit.parentNode.getElementsByTagName("span")[0];
								get ? get.remove() : '';
							}
						} else {
							nameedit.innerHTML += menu[0].html; //获取session存储的内容导入表格中
						}
					} else {
						nameedit.innerHTML = menu[0].html; //获取session存储的内容导入表格中
					}
				}
				var status = _this.par.TreeStatus;
				if(status == true) {
					var pid = 0; //默认值
					var rows = nameedit.children;
					if(_this.par.treeCompose==true){
						var treelist =_this.treedata(oldArr, pid, nameedit,0);
					}else{
						var treelist=oldArr
					}
					_this.treelevel(treelist, _this, nameedit, JsonStr, BrowserInfo, rows,0);
					
					if(_this.par.Tablefold==true){	
						var father=_this.getElementsByClassName(Table,"father");
						var treeArrowSite=_this.par.treeArrowSite;//折叠按钮位置
						father.myMap(function(item,i){
							  var TagName=item.cells[treeArrowSite].getElementsByTagName("span")[0];
							  if(TagName){
							  	var gradeid=TagName.getAttribute("data-id");
							  	var fid = TagName.getAttribute('data-fid');
							  	if(fid) {
									var child = "child" + fid + "";
								} else {
									var child = "child" + gradeid + "";
								}
							  	var sl = _this.getElementsByClassName(Table, child);
								var len = sl.length;
								var plusminu = function(i) {
									sl[i].style.display = "none";
									TagName.setAttribute('name', 'minusclick');
									_this.removeClass(TagName, 'plus');
									_this.addClass(TagName, 'minus');
								};
								for(var i = 0; i < len; i++) {
									if(fid) {
										var pid = sl[i].cells[0].getAttribute("data-pid");
										pid ? plusminu(i) : '';
									} else {
										plusminu(i);
									}
								}
							}	  
						})
					}
				} else if(status == false) {
					for(var i = 0; i < pageSize; i++) {
						var num;
						var li;
						number <= pageSize ? num = i : num = (curPage - 1) * pageSize + i;
						if(customize==true){
						    Array = JsonStr[num];
						}else{
						    Array = JsonStr.list[num];
						}
						_this.par.mobile == true ? li = (curPage - 1) * pageSize + i : li = i;
						if(Array) {
							if(mode == "ul") {
								var rows = nameedit.getElementsByTagName("ul");
								var clonedNode = nameedit.children[li].cloneNode(true); // 克隆节点
								nameedit.appendChild(clonedNode); // 在父节点插入克隆的节点
								var tds = rows[li].getElementsByTagName("li");
								for(var x = 0; x < tds.length; x++) {
									var Child = tds[x];
									_this.stencil(nameedit, rows[i], JsonStr, tds.length, Array, i, Child, x, BrowserInfo,addType);
								}
							} else if(mode == "table") {
								var rows = nameedit.children;
								if(BrowserInfo.IsIE9Under) {
									var clonedNode = rows[0].cloneNode(true); // 克隆节点
									nameedit.appendChild(clonedNode);
									var cells = nameedit.rows[0].children;
									_this.Attributes( nameedit.rows[0],"sys-index",i);
									if(i % 2 == 0){
										_this.addClass(nameedit.rows[i],"sysbg-even")
									}else{
										_this.addClass(nameedit.rows[i],"sysbg-odd")
									}
									var tds = cells.length;
									for(var x = 0; x < tds; x++) {
										var Child = cells[x];
										_this.stencil(nameedit, rows[i], JsonStr, tds, Array, i, Child, x, BrowserInfo,addType);
									}
								} else {
									var clonedNode = nameedit.rows[i].cloneNode(true); // 克隆节点
									nameedit.appendChild(clonedNode); // 在父节点插入克隆的节点
									var tds = nameedit.rows[i].cells.length;
									_this.Attributes(nameedit.rows[i],"sys-index",i);
									if(i % 2 == 0){
										_this.addClass(nameedit.rows[i],"sysbg-even")
									}else{
										_this.addClass(nameedit.rows[i],"sysbg-odd")
									}
									for(var x = 0; x < tds; x++) {
										var Child = nameedit.rows[i].cells[x];
										_this.stencil(nameedit, rows[i], JsonStr, tds, Array, i, Child, x, BrowserInfo,addType);
									}
								}
								
							} else if(mode == "templet") {
								var edit = _this.getElementsByClassName(nameedit.parentNode, boxname);
								var clonedNode = nameedit.children[li].cloneNode(true); // 克隆节点
								nameedit.appendChild(clonedNode); // 在父节点插入克隆的节点
								var K = _this.par.CustomKey;
								var Child = _this.getElementsByClassName(edit[li], K);
								for(var x = 0; x < Child.length; x++) {
									_this.stencil(nameedit, rows, JsonStr, Child.length, Array, i, Child[x], x, BrowserInfo,addType);
								}
							}
							var a = 1; //起始条数
							amount = a + li; //每循环一次加1，直到数据为空为止结束
						}
					}
				};
				if(mode == "ul") {
					if(amount!=0){
						if(amount !=nameedit.children.length) {
							var ms = nameedit.children.length;
							for(var a = ms - 1; a >= amount; a--) {
								_this.removeElement(nameedit.children[a]);
							}
						}
					}
					if(_this.par.mobile == true) {
						if(number <= pageSize) {
							_this.prompt(nameedit, modleprompt, oldArr, obj);
						}else if(number*curPage==totalElements){
							_this.prompt(nameedit, modleprompt, oldArr, obj);
						}
					}
				} else if(mode == "table") {
					var rows = nameedit.getElementsByTagName("tr");
					var Child = nameedit.rows[amount]; //设置最后一条数据
					if(amount!=0){
						if(amount != nameedit.rows.length) {
							var ms = nameedit.rows.length;
							for(var a = ms - 1; a >= amount; a--) {
								_this.removeElement(nameedit.rows[a]);
							}
						}
					}
					var Fixedclass=_this.getElementsByClassName(nameedit.parentElement.parentElement,"sys-Fixed-table");
					if(Fixedclass!=0){
						 for(var f=0;f<Fixedclass.length;f++){
						 	_this.removeElement(Fixedclass[f]);
						 }
					}
					_this.FixedCoteModule(_this,nameedit,_this.par);//栏目定位方法
					_this.BtnoperationMethod(Table, _this, curPage, pageSize, obj);
				} else if(mode == "templet"){
					if(amount!=0){
						if(amount != nameedit.children.length) {
							var edit = _this.getElementsByClassName(nameedit.parentNode, boxname);
							var Child = edit[amount]; //设置最后一条数据
							_this.removeElement(Child);
						}
					}
					if(_this.par.mobile == true) {
						if(number < pageSize) {
							_this.prompt(nameedit, modleprompt, oldArr, obj);
						}else if(pageSize*curPage==totalElements){
							_this.prompt(nameedit, modleprompt, oldArr, obj);
						}
					}
				}
				if(_this.par.mobile == true) {
				    _this.mobileflag(Table, curPage, pageTotal, pageSize, total,boxname);
			   }else{
				    _this.pageTableMethod(null, curPage, pageTotal, pageSize, total, name);
			    }
			} else {
				if(mode == "ul") {
					if(_this.par.mobile == true) {
						_this.prompt(nameedit, modleprompt, oldArr, obj);
					} else {
						nameedit.innerHTML = '<span class="prompt mobile_prompt">' + prompt + '</span>';
					}
				} else if(mode == "table") {
					var tds = Table.rows[0].cells.length;
					var Fixedclass=_this.getElementsByClassName(nameedit.parentElement.parentElement,"sys-Fixed-table");
					if(Fixedclass!=0){
						 for(var f=0;f<Fixedclass.length;f++){
						 	_this.removeElement(Fixedclass[f]);
						 }
					}
					if(_this.par.mobile == true) {
				    _this.mobileflag(Table, curPage, pageTotal, pageSize, total,boxname);
				  }else{
					    _this.pageTableMethod(null, curPage, pageTotal, pageSize, total, name);
				    }
					nameedit.innerHTML = '<td colspan="' + tds + '" class="mode_prompt">' + prompt + '</td>';
					
				}else if(mode == "templet") {
					nameedit.innerHTML = '<span class="prompt mobile_prompt">' + prompt + '</span>';
				}
			}	
		}
	},
	prompt: function(nameedit, modleprompt, data, obj) {
		var _this = this;
		var get =_this.hasClass(nameedit.parentNode,'prompt');
		get ? _this.removeElement(get) : '';
		if(data != null) {
			nameedit.parentNode.innerHTML += '<span class="prompt mobile_prompt">' + modleprompt + '</span>';
		} else {
			if(obj.name == "searchEvent") {
				nameedit.innerHTML = ""; //为空时清除已有列表内容
				nameedit.parentNode.innerHTML += '<span class="prompt mobile_prompt">' + modleprompt + '</span>'; //返回提示信息
			} else {
				nameedit.parentNode.innerHTML += '<span class="prompt mobile_prompt">' + modleprompt + '</span>';
			}
		}
	},
	//获取内容模版方法
	stencil: function(nameedit, rows, JsonStr, tds, Array, i, Child, x, BrowserInfo,addType,grade,pid) {
		var _this = this,value="",dates;
		var site = _this.par.treeArrowSite;
		var keyvalue = Child.getAttribute("data-value");
		var formatname = Child.getAttribute("data-format"); //格式
		var defaults = Child.getAttribute("data-default"); //格式
		var btn = Child.getAttribute("data-button"); //设置起始按钮
		var url = Child.getAttribute("data-url"); //地址	
		var tif = Child.getAttribute("data-if"); //判断	
		var separator = Child.getAttribute("data-separator"); //分隔符	
		_this.Attributes( Child,"sys-index",i+"-"+x);
		var treestatus = _this.par.TreeStatus;
		var deployurl="";
		if(keyvalue!=null){
			var valuelist = keyvalue.split(",");
		}else{
			var valuelist="";
		}
		var Arraymethod=function(ArrayString){
			var result = ArrayString.split(",");
			var newarr = []; //声明一个数组
			for(var n = 0; n < result.length; n++) {
				var newgroup = {
					id: n,
					cname: result[n]
				};
				newarr.push(newgroup); //从新整合数组
			} //对数组进行判断
		    return newarr
		}
		var editmethod=function(dates,formatname,btn,valuelist){
			if(formatname == 'time') {
				var format = _this.par.timeFormat;
			    value = _this.formatDate(format, dates);
			}else if(formatname == 'Transformtime'){
				value = _this.TransformDate(dates);
			} else if(formatname == 'checkbox') {
				var ArrayString = Child.getAttribute("data-Array");
				_this.Attributes(Child,"data-digital",dates);
				if(ArrayString) {
					var newarrlist= Arraymethod(ArrayString);
						 //对数组进行判断
						if(dates== newarrlist[dates].id) {
							 value = newarrlist[dates].cname;
						}
				} else {
					 var checkboxAtrry=[];
						var newgroup = {};
						for(var k=0;k<valuelist.length;k++){
							var key=valuelist[k];
							newgroup[key]='';
							newgroup[key]+=Array[key];
						}
						checkboxAtrry.push(newgroup);

					 value = "<label class='checkbox radio'><input name='checkbox'  data-name='checkbox'  type='checkbox' value='" + JSON.stringify(newgroup)  + "' class='sys-checkbox ace'><span class='lbl'></span></label>"
				}
			} else if(formatname == "img") {
				var formaturl = Child.getAttribute("data-Array"); //参数
				if(formaturl==null){
					 value = '<img src="' + Array[keyvalue] + '" class="imgset" onerror="this.src=' + "'" + _this.par.defaultimg + "'" + ',this.onerror=null "/>';
				}else{
					 value = '<img src="' + formaturl + Array[keyvalue] + '" class="imgset" onerror="this.src=' + "'" + formaturl + _this.par.defaultimg + "'" + ',this.onerror=null "/>';
				}
	
			} else if(formatname == "select") {
				var value = "";
				var name = _this.par.SelectName; //键值名称
				var selectdata = Array[keyvalue]; //根据当前键值名称获取指定下拉值名称
				_this.Attributes(Child,"data-digital",selectdata.id);
				if(selectdata[name] != null) {
					value = selectdata[name];
					//var svalue = Array[keyvalue];
					//for(var s= 0; s < selectdata.length; s++){
					//	  var selname=selectdata[s];
					//	  var ov=selname[keyvalue];
					//	  if(svalue==ov){
					//		 value = selname.name;
					//	  }
					//}
				} else {
					value = "无";
				}
			}else if(formatname == "calculate"){	 
				
				
			}else if(formatname=="path"){
				_this.Attributes(Child,"href",dates);
			}else {
				value =dates;
			}
			if(btn == "btn") {
                 dates=dates.toString();
				var dateslist = dates.split(",");
				if(x == (tds - 1)) {
					var mode = _this.par.mode;
					if(mode == "table") {
						if(BrowserInfo.IsIE9Under) {
							var s = nameedit.rows[0].children[tds - 1];
						} else {
							var s = nameedit.rows[i].cells[tds - 1];
						}
						var btn=_this.getElementsByClassName(s,"sys-edit-button");//获取操作按钮
						//var btn = s.getElementsByTagName("button") || s.getElementsByTagName("a") || s.getElementsByTagName("select"); 
						for(var b = 0; b < btn.length; b++) {
							var ArrayString = btn[b].getAttribute("data-Array");
							var btnvalue = btn[b].getAttribute("data-value");
							var tagName=btn[b].tagName;
							for(var d = 0; d < dateslist.length; d++) {
								var info=dateslist[d];
								_this.Attributes(btn[b],"data-"+valuelist[d]+"",info);
							}
							if(tagName=="BUTTON"){	
								if(ArrayString) {
									var bute = parseInt(btn[b].getAttribute("data-"+btnvalue)) ;
									var newarrlist= Arraymethod(ArrayString);
									if(bute==0) {
										btn[b].innerHTML=newarrlist[1].cname;
									}else if(bute==1){
										btn[b].innerHTML=newarrlist[0].cname;
									}
								}								
							}else if(tagName=="SELECT"){
								var optionlist =btn[b].options;
								for(var d = 0; d < optionlist.length; d++) {
									var vs = parseInt(btn[b].getAttribute("data-"+btnvalue));
									var opv=optionlist[d].value;
									if(vs==opv){
										optionlist[d].selected = true
									}
								}
							}
						}
					} else if(mode == "ul") {
	                    return false;
					}
					for(var d = 0; d < dateslist.length; d++) {
						 var info=dateslist[d];
						_this.Attributes(Child,"data-"+valuelist[d]+"",info);
						_this.par.SpreadEvent(_this,nameedit,Child);
					}
				}
			} else if(url == "address") {
				if(Child.getAttribute('data-href') != null) {
					var herf = Child.getAttribute('data-href');
					if(addType!=undefined || addType!="" || addType!=null){
						Child.href = herf +value;
					}else{
						Child.href = herf +value+addType;
					}
					Child.removeAttribute("data-href");
				} else if(Child.getAttribute('data-click') != null) {
					var herf = Child.getAttribute('data-click');
					var clickname;
					for(var k=0;k<value.length;k++){
						if(k==0){
							clickname = herf.replace(")", ",'" +value[k]+"')");
						}else{
							clickname = clickname.replace(")", ",'" +value[k]+"')");
						}
					}
					Child.setAttribute('onclick', clickname);
					Child.removeAttribute("data-click");
				}
			} else {
				if(keyvalue) {
					if(dates!="" && dates!=null){
						if(treestatus==true){
							if(x==site){
								var treeicon=_this.par.treeCustomicon;
								if(grade==0){
									var wleft=(grade+1)*(_this.par.treeSpacing+20);
									var iconimg=treeicon[0];
								}else{
									var wleft=(grade+1)*(_this.par.treeSpacing+10);
									var arrty=Array.child;
									if(arrty!=undefined && arrty.length > 0){
										var iconimg=treeicon[0];
									}else{
										var iconimg=treeicon[1];
									}
								}
								if(_this.par.treeclick==true){
										Child.innerHTML ="<label class='childlabel treeClick' style='left:"+wleft+"px'><i>"+iconimg+"<i>"+value+"</label>";
										var treeClick= _this.getElementsByClassName(Child,"treeClick")[0];
										treeClick.onclick=function(){
											_this.par.OperationEventSet(nameedit,_this,treeClick,Array)
										}
								}else{
									Child.innerHTML ="<label class='childlabel' style='left:"+wleft+"px'><i>"+iconimg+"<i>"+value+"</label>"
								}
							}else{
								Child.innerHTML = value
							}
						}else{
							if(formatname!=="path"){
								Child.innerHTML = value
							}
						}
					}else if(formatname == "calculate"){
						var mu=0,de="";
						var calculate= Child.getAttribute("data-calculate");
						var decimal=Child.getAttribute("data-decimal");
						if(decimal!=null){
							var nteger=parseInt(decimal);
							for(var v = 0; v < nteger; v++) {
							   de+=0;
							} 
							mu=mu+"."+de;
						}
						if(calculate=="amount"){
							Child.innerHTML = mu
						}else if(calculate=="stock"){
							Child.innerHTML =mu
						}else if(calculate=="stocktotal"){
							Child.innerHTML = mu
						}else if(calculate=="price"){
							Child.innerHTML = mu
						}else if(calculate=="total"){
							Child.innerHTML = mu
						}
						
					}else{
						Child.innerHTML = "无"
					}
					//Child.removeAttribute("data-Array");
				}
			}
		}
		if(valuelist.length>1){
			var splice='',arrys=[];
			for(var v = 0; v < valuelist.length; v++) {
				var parameter=valuelist[v];
			    var info = Array[parameter];
				if(url == "address"){
					if(Child.getAttribute('data-href') != null) {
						splice+=parameter+"="+_this.encode(info)+"&";
					}else if(Child.getAttribute('data-click') != null) {
						arrys.push(info);
						splice=arrys;
					}
					
				}else{
					if(v == valuelist.length - 1) {
						splice+=info
					} else {
						splice+=info+separator
					}
				}
			}
			editmethod(splice,formatname,btn,valuelist);
		}else{
			 dates = Array[keyvalue];
			 editmethod(dates,formatname,btn,valuelist);
		}
	},
	//栏目定位当前位置
	FixedCoteModule:function(_this,tbody,par){
		var FixedCote=par.FixedCote;
		var parent=tbody.parentNode;
		var tableparent=parent.parentElement;
		var cloneNodeModule=function(Fixedclass,cloneNode,x,i,c,tdh,Class){
			var Fixeddiv = document.createElement("div");
			var Fixedtable= document.createElement("table");
			var theads=document.createElement("thead");
			var tbodys=document.createElement("tbody");
			var Fixedtr= document.createElement("tr");
			if(x % 2 == 0){
				_this.addClass(Fixedtr,"sysbg-even")
			}else{
				_this.addClass(Fixedtr,"sysbg-odd")
			}
			_this.Attributes(Fixedtr,"sys-index",x);
			_this.addClass(Fixedtable,'table table_list table_striped table-bordered border');
			_this.addClass(Fixeddiv,'sys-Fixed-table');
			if(c=="th"){
				var theadth=undefined;
				if(Fixedclass.length!=0){
					var Fixedtables=_this.getElementsByClassName(Fixedclass[0],"table")[0];
					theadth=Fixedtables.getElementsByTagName('thead')[0];
				}
				if(theadth==undefined){
				Fixedtable.appendChild(theads);
				theads.appendChild(Fixedtr);
				var mod=theads;
				}else{
					var mod=theadth;
				}
			}else if(c=="td"){
				var Fixedtables=_this.getElementsByClassName(Fixedclass[0],"table")[0];
				var tbodytd=Fixedtables.getElementsByTagName('tbody')[0];
				if(tbodytd==undefined){
					Fixedtables.appendChild(tbodys);
					tbodys.appendChild(Fixedtr);
					var mod=tbodys;
				}else{
					var mod=tbodytd;
				}
			}else if(c=="thead"){
				var theadth=undefined;
				if(Fixedclass.length!=0){
					var Fixedtables=_this.getElementsByClassName(Fixedclass[0],"table")[0];
					theadth=Fixedtables.getElementsByTagName('thead')[0];
				}
				if(theadth==undefined){
				Fixedtable.appendChild(theads);
				theads.appendChild(cloneNode);
				var mod=theads;
				}else{
					var mod=theadth;
				}
				
			}
		if(Fixedclass.length==0){	
			if(c!="thead"){
				Fixedtr.appendChild(cloneNode);
			}else{
				theads.appendChild(cloneNode);
			}
			Fixeddiv.appendChild(Fixedtable);
			_this.addClass(Fixeddiv,Class);
			tableparent.appendChild(Fixeddiv);
		}else{
			var Fixedtables=_this.getElementsByClassName(Fixedclass[0],"table")[0];
			var  Fixedindex = Fixedtables.rows[x];
			if(Fixedtables.rows.length==parent.rows.length){
				var X=Fixedindex.getAttribute("sys-index");
				mod.rows[x].appendChild(cloneNode);
			}else{
				if(Fixedindex!=undefined){
					if(c!="thead"){
						Fixedtr.appendChild(cloneNode);
						mod.appendChild(Fixedtr);
					}else{
						mod.appendChild(cloneNode);
					}
					
				}else{
					if(c!="thead"){
						Fixedtr.appendChild(cloneNode);
						mod.appendChild(Fixedtr);
					}else{
						mod.appendChild(cloneNode);
					}
				}
			}
			
		}	
	}	
	var Fixedhtml=function(locations,cloneNode,x,i,c,tdh){
		if(locations=="left"){
			var Fixedclass=_this.getElementsByClassName(tableparent,"sys-Fixed-left");
			cloneNodeModule(Fixedclass,cloneNode,x,i,c,tdh," sys-Fixed-left")
		}else if(locations=="right"){
			var Fixedclass=_this.getElementsByClassName(tableparent,"sys-Fixed-right");
			cloneNodeModule(Fixedclass,cloneNode,x,i,c,tdh," sys-Fixed-right");
		}else if(locations=="top"){
			var Fixedclass=_this.getElementsByClassName(tableparent,"sys-Fixed-top");
			cloneNodeModule(Fixedclass,cloneNode,x,i,c,tdh," sys-Fixed-top");
		}
	}
		if(FixedCote!=null){
			var Obtaintable=function(i,locations,sort){
				if(sort==0){
					for(var x = 0; x < parent.rows.length; x++) {
						var rows=parent.rows[x];
						
							if(rows.cells[i].tagName=="TH"){
								var cellshtml=rows.cells[i];
								var tdh=cellshtml.offsetHeight;
								var tdw=cellshtml.offsetWidth;
								var clonedNode = cellshtml.cloneNode(true); // 克隆节点
								clonedNode.style.height=tdh+'px';
								clonedNode.style.width=tdw+'px';
								Fixedhtml(locations,clonedNode,x,i,"th",tdh);	
							}else if(rows.cells[i].tagName=="TD"){
								var cellshtml=rows.cells[i];
								var tdh=cellshtml.offsetHeight;
								var tdw=cellshtml.offsetWidth;
								var clonedNode = cellshtml.cloneNode(true); // 克隆节点
								clonedNode.style.height=tdh+'px';
								clonedNode.style.width=tdw+'px';
								Fixedhtml(locations,clonedNode,x-1,i,"td",tdh);
							}
											
					}
				}else{
					var rows=parent.rows[0];
					var cells=rows.cells.length;
					var tdh=rows.offsetHeight;
					var tdw=rows.offsetWidth;
					var clonedNode = rows.cloneNode(true); // 克隆节点
					for(var x = 0; x < rows.cells.length; x++) {
						var tcdh=rows.cells[x].offsetHeight;
						var tcdw=rows.cells[x].offsetWidth;
						clonedNode.cells[x].style.height=tcdh+'px';
						clonedNode.cells[x].style.width=tcdw+'px';
					}
					clonedNode.style.height=tdh+'px';
					clonedNode.style.width=tdw+'px';
					Fixedhtml(locations,clonedNode,0,0,"thead",tdh);
				}	
			}
			var al=FixedCote.left;
			var ar=FixedCote.right;
			var at=FixedCote.top;
			if(al!=undefined){
				var resultl = al.split(",");
				for(var f=0;f<resultl.length;f++){
					var Z=parseInt(resultl[f]);
					Obtaintable(Z,"left",0);
				}
			}
			if(ar!=undefined){
				var resultr = ar.split(",");
				for(var f=0;f<resultr.length;f++){
					var Z=parseInt(resultr[f]);
					Obtaintable(Z,"right",0);
				}
			}
			if(at=="thead"){	
				Obtaintable(0,"top",1);
			}
			
			
		}	
	},
	//时间戳转换
	formatDate: function(format, date) {
		var normdate;
		if(typeof date === "string") {
			var mts = date.match(/(\/Date(\d+)\/)/);
			if(mts && mts.length >= 3) {
				date = parseInt(mts[2]);
			}
		}
		normdate = new Date(parseInt(date * 1000));
		if(!normdate || normdate.toUTCString() == "Invalid Date") {
			var json_date = new Date(date).toJSON();
			normdate=new Date(new Date(json_date) - 8 * 3600 * 1000);	
		}
		var map = {
			"M": normdate.getMonth() + 1, //月份
			"d": normdate.getDate(), //日
			"h": normdate.getHours(), //小时
			"m": normdate.getMinutes(), //分
			"s": normdate.getSeconds(), //秒
			"q": Math.floor((normdate.getMonth() + 3) / 3), //季度
			"S": normdate.getMilliseconds() //毫秒
		};
		format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
			var v = map[t];
			if(v !== undefined) {
				if(all.length > 1) {
					v = '0' + v;
					v = v.substr(v.length - 2);
				}
				return v;
			} else if(t === 'y') {
				return(normdate.getFullYear() + '').substr(4 - all.length);
			}
			return all;
		});
		return format;
	},
	TransformDate:function(date){
		var json_date = new Date(date).toJSON();
    	return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
	},
	// table以外层按钮操作方法
	Selectedbtnmethod: function(other, Table, obj, curPage, pageSize) {
		if(other) {
			var btn = other.getElementsByTagName("a") || other.getElementsByTagName("button");
			for(var i = 0; i < btn.length; i++) {
				btn[i].onclick = function(e) {
					var Table = TAB$(obj.par.TableName);
					if(obj.par.mode=="table"){
						var trm=Table.rows.length,batchDelete='';
					}
					var Checkboxlist=function(){
						//判断是否存在checkbox选中栏目，
						var checkbox = name$('checkbox');
						for(var x = Table.rows.length - 1; x >= 1; x--) {
							if(checkbox[x].checked == true) {
								var id = checkbox[x].value;
								var keyname = checkbox[x].getAttribute("data-name");
								batchDelete += id + ",";
								var remove = checkbox[x].parentNode.parentNode.parentNode;
								trm = Table.rows.length - 1;
							}
						};
					};
					if(this.name == "DeleteCheckbox") {//删除选择框的方法
							Checkboxlist();
						if(Table.rows.length == trm) {
							obj.PromptBox("请选择你操作的信息！", 2, false);
						} else {
							var batchDeletes = batchDelete.substring(0, batchDelete.lastIndexOf(','));
							obj.par.CheckboxDeleteEvent(Table,obj, batchDeletes, curPage, pageSize);
						}
					}else if(this.name == "CheckboxEvent"){
						//选择框操作方法
						Checkboxlist();
						var batchDeletes = batchDelete.substring(0, batchDelete.lastIndexOf(','));
						obj.par.CheckboxEvent(Table,obj, batchDeletes, curPage, pageSize);
					} else if(this.name == "searchEvent") {
						    var formData = "", objdata={};
							window.sessionStorage.removeItem("searchname");
                            var term=name$("searchText");
                            var newgroup = {};//声明一个对象集合
                            var newarr=[],RV="",dataprompt="",mu=0,returns=true;
                            var searchnamefm=function(){
                        		obj.par.SearchEvent(obj, formData, curPage, pageSize, this, newarr,objdata);
								var SearchSave=obj.par.SearchSave;
								if(SearchSave==true){
									//编辑保存查询结果到session中,用于执行刷新界面时的数据查询
									var rota = "searchname";
									var objs = {
										sname: formData,
										status: "searchText"
									};
									newarr.push(objs); //从新整合数组
									var html = JSON.stringify(newarr);
									window.sessionStorage.setItem(rota, html); //保存存储名为searchname的session
								}else{
	                               newarr=null;
								}
                            }
                            var searchp=function(v,s,prompt){
                            	if(v) {
                            		if(s==term.length-1){
                            			searchnamefm();
                            		}
                            		returns=true;
								}else if(prompt==null){
									if(s==term.length-1){
                            			searchnamefm();
                            		}
								} else {
									obj.PromptBox(prompt+"不能为空！", 2, false);
									returns=false;
								}
                            }
                            for(var s = 0; s < term.length; s++){
                             	var keyvalue = term[s].getAttribute("data-term");
                             	Requiredvalue = term[s].getAttribute("data-Required");
                             	dataprompt=term[s].getAttribute("data-prompt");
                             	var v = term[s].value;
                             	if(v!=""){
                             		newgroup[keyvalue]="";
                             		objdata[keyvalue]="";
	                             	formData += keyvalue + "=" + v + "&";
	                             	newgroup[keyvalue] += v;
	                             	objdata[keyvalue]+=v
	                             	mu++
                             	}
                             	if(Requiredvalue=="true"){
                             		searchp(v,s,dataprompt);
                             		 if(returns==false){return returns};
                             	}else{
                             		searchp(v,s,dataprompt)
                             	}
                           }
						//删除我提示文本内容
						var pro = document.body.querySelector(".mobile_prompt");
                        pro!=null?obj.removeElement(pro):'';

					} else if(this.name == "RefreshEvent") {
						var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
						//执行刷新当前table数据请求
						if(condition != null) {
							var value = condition[0].sname;
							var type = condition[0].status;
							obj.par.SearchEvent(obj, value, curPage, pageSize, null, type);
						} else {
							var Fixedtable=obj.getElementsByClassName(Table.parentElement.parentElement,"sys-Fixed-table");
							 for(var f = 0; f < Fixedtable.length;f++){
							 	obj.removeElement(Fixedtable[f]);
							 }
							obj.par.Callback(Table, obj, curPage, pageSize, this);
						}
					}else if(this.name=="EntireEvent"){
						//刷新全部
						var Fixedtable=obj.getElementsByClassName(Table.parentElement.parentElement,"sys-Fixed-table");
						 for(var f = 0; f < Fixedtable.length;f++){
						 	obj.removeElement(Fixedtable[f]);
						 }
						sessionStorage.removeItem("searchname");//删除指定session数组
						obj.par.Callback(Table, obj, curPage, pageSize, this);

					}else if(this.name == "ExcelEvent") {
						var name = this.getAttribute("data-name"); //获表格名称
						var Table = obj.par.TableName; //指定导出区域
						this.download=name;
						//Excel导出功能
						var idTmr;
						var explorer = obj.BrowserSpot(explorer);
						if(explorer == "ie") {
							var oXL = new ActiveXObject("Excel.Application");
							var oWB = oXL.Workbooks.Add();
							var xlsheet = oWB.Worksheets(1);
							var sel = document.body.createTextRange();
							sel.moveToElementText(Table);
							sel.select();
							sel.execCommand("Copy");
							xlsheet.Paste();
							oXL.Visible = true;
							try {
								var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
							} catch(e) {
								print("Nested catch caught " + e);
							} finally {
								oWB.SaveAs(fname);
								oWB.Close(savechanges = false);
								oXL.Quit();
								oXL = null;
								idTmr = window.setInterval(obj.Cleanup(), 1);
							}
						} else {
							obj.tableToExcel(Table, name, obj,this);
						}
					}else if(this.name == "ExcelEntire") {
						var mode = 'Excel';
						obj.par.ExceldData(obj, Table, mode,this);

					}else if(this.name == "BatchModifyEvent"){
						//批量修改的方法调用
						Checkboxlist();
						if(Table.rows.length == trm) {
							obj.PromptBox("请选择修改的内容！", 2, false);
						} else {
							var batchDeletes = batchDelete.substring(0, batchDelete.lastIndexOf(','));
							obj.BatchModifyModule(obj, batchDeletes, curPage, pageSize,Table);
						}	
					}else if(this.name == "PrintEvent"){
						var Table =TAB$(obj.par.TableName); //指定导出区域
						obj.PrintModule(obj,Table,e);
					}
				};
			};
		}
	},
	//批量操作的方法
	BatchModifyModule:function(_this, batchDeletes, curPage, pageSize,Table){
		var DataArray=[],keyvalue,digital,formData;
		var SL=_this.getElementsByClassName(Table,"sys-table-selected");
		for(var s = SL.length - 1; s >= 0; s--) {
			  var ObjData={};
			  var AllData={};
			  var TD=SL[s].cells;
			  for(var t = TD.length - 1; t >= 0; t--) {
			  	var ClassName = _this.hasClass(TD[t],"table-edit");
			  	keyvalue = TD[t].getAttribute("data-value");
			  	var dateslist = keyvalue.split(",");
			     digital = TD[t].getAttribute("data-"+dateslist[0]) || TD[t].getAttribute("data-digital");
			     keyvalue=dateslist[0];
			     ObjData[keyvalue]="";
			     if(digital!=null){
			     	ObjData[keyvalue]+=digital;
			     }
			  	if(ClassName){
			  		digital = TD[t].getAttribute("data-digital");
			  		var tagname = TD[t].getElementsByTagName("input")[0] || TD[t].getElementsByTagName("select")[0];
			  		if(tagname!=undefined){
			  			var keyname = tagname.getAttribute("sys-key");
						var muster = _this.getElementsByClassName(TD[t], 'radio');
						ObjData[keyname] = '';
						if(muster != 0){
							for(var c = 0; c < muster.length; c++) {
								var checkedname =_this.getElementsByClassName(muster[c],"sys-pick")[0];
								if(checkedname.checked == true) {
									var text = checkedname.value;
									keyname = keyvalue;
								}
							}
						} else {
							var tablevalue = TD[t].getElementsByTagName("input")[0] || TD[t].getElementsByTagName("select")[0];
							var text = tablevalue.value;
						}
						formData += keyname + "=" + text + "&";
						ObjData[keyname]+=text;
						if(text == "") {
							_this.PromptBox("请选择批量操作的内容!", 2, false);
							return false;
						}
			  		}else{
				  		if(digital!=undefined){
				  			var V=ObjData[keyvalue];
				  			if(digital!=V){
				  				ObjData[keyvalue]+=digital;
				  			}
				  		}else{
				  			ObjData[keyvalue]+=TD[t].innerText;
				  		}
			  		}
			  	}else{
			  		var text=TD[t].innerText;
					var result = keyvalue.split(",");
					if(result.length==1){
						AllData[keyvalue]="";
						AllData[keyvalue]+=text;	
					}					
			  	}
			}
			for(var key in ObjData){
				if(ObjData.hasOwnProperty(key)===true){
					if(ObjData[key]!=""){
						AllData[key]=ObjData[key];
					}
				}
			}
			DataArray.push(AllData);
		}
		_this.par.BatchModifyEvent(_this,DataArray, curPage, pageSize,SL);
	},
	tableToExcelhtml:function(excel, fileName) {  
		var base64 = function(s) {return window.btoa(unescape(encodeURIComponent(s)))}
		var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";  
		excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';  
		excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';  
		excelFile += '; charset=UTF-8">';  
		excelFile += "<head>";  
		excelFile += "<!--[if gte mso 9]>";  
		excelFile += "<xml>";  
		excelFile += "<x:ExcelWorkbook>";  
		excelFile += "<x:ExcelWorksheets>";  
		excelFile += "<x:ExcelWorksheet>";  
		excelFile += "<x:Name>";  
		excelFile += fileName;  
		excelFile += "</x:Name>";  
		excelFile += "<x:WorksheetOptions>";  
		excelFile += "<x:DisplayGridlines/>";  
		excelFile += "</x:WorksheetOptions>";  
		excelFile += "</x:ExcelWorksheet>";  
		excelFile += "</x:ExcelWorksheets>";  
		excelFile += "</x:ExcelWorkbook>";  
		excelFile += "</xml>";  
		excelFile += "<![endif]-->";  
		excelFile += "</head>"  	 
		excelFile +=' <style type="text/css">';                  
		excelFile +='.table{' ;                  
		excelFile +=' border-collapse:collapse;';                   
		excelFile +=' border:thin solid #999; }' ;                                   
		excelFile +='.table_striped thead th{';                  
		excelFile +='color: #707070;' ;
		excelFile +=' background: #f2f2f2;' ;
		excelFile +='background-image: -webkit-gradient(linear,left 0,left 100%,from(#f8f8f8),to(#ececec));' ;
		excelFile +='background-image: -webkit-linear-gradient(top,#f8f8f8,0%,#ececec,100%);' ;
		excelFile +='background-image: -moz-linear-gradient(top,#f8f8f8 0,#ececec 100%);' ;
		excelFile +='background-image: linear-gradient(to bottom,#f8f8f8 0,#ececec 100%);' ;
		excelFile +='background-repeat: repeat-x;';
		excelFile +='filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#fff8f8f8",endColorstr="#ffececec",GradientType=0);}' ;                                     
		excelFile +='.table td{';                 
		excelFile +='border:thin solid #999;';                  
		excelFile +='padding:2px 5px;';                  
		excelFile +='}</style>' ;
		excelFile += "<body><table class='gallery table table_list table_striped table-bordered border'>";   
		excelFile += excel; 
		excelFile += "</table></body>"; 
		excelFile += "</html>";  
		var uri = 'data:application/vnd.ms-excel;base64,' + base64(excelFile);  
		var link = document.createElement("a");      
		link.href = uri;  
		link.style = "visibility:hidden";  
		link.download = fileName + ".xls";  
		document.body.appendChild(link);  
		link.click();  
		document.body.removeChild(link);  
	}, 
	/*****************设置导出全部数据*************************/
	Excelentire: function(Table, obj, JsonStr, mode,label) {
		var title=mode.getAttribute("data-name");
		var rota = label,rows;
		var menu = JSON.parse(window.sessionStorage.getItem(rota)); //获取session存储名
		var BrowserInfo = {
			IsIE: /*@cc_on!@*/ false,
			IsIE9Under: /*@cc_on!@*/ false && (parseInt(s.match(/msie (\d+)/)[1], 10) <= 9),
		};
		var newtable;
		newtable = TABLAYER$('table');
		newtable.id = 'Exceltable';
		document.body.appendChild(newtable);
		//newtable.style.cssText = "display:none;";
		if(BrowserInfo.IsIE9Under) {
			edit ? TAB$('Exceltable').innerHTML = menu[1].html : TAB$('Exceltable').appendChild = menu[1].html; //获取session存储的内容导入table表格中
		} else {
			TAB$('Exceltable').innerHTML = menu[1].html; //获取session存储的内容导入表格中
		}
		var nameedit = TAB$('Exceltable').getElementsByTagName('tbody')[0];
		var amount = parseInt(JsonStr.length); //获取数据数量
		if(JsonStr != null) {
			var newarr = []; //声明新的数组
			for(var i = 0; i < amount; i++) {
				 rows = nameedit.children;
				var li;
				if(BrowserInfo.IsIE9Under) {
					var clonedNode = rows[0].cloneNode(true); // 克隆节点
					nameedit.appendChild(clonedNode);
					var cells = nameedit.rows[i].children;
					var tds = cells.length;
					for(var x = 0; x < tds; x++) {
						var Child = cells[x];
						obj.stencil(nameedit, rows[i], JsonStr, tds, JsonStr[i], i, Child, x, BrowserInfo);
					}
				} else {
					var clonedNode = nameedit.rows[0].cloneNode(true); // 克隆节点
					nameedit.appendChild(clonedNode); // 在父节点插入克隆的节点
					var tds = nameedit.rows[i].cells.length;
					for(var x = 0; x < tds; x++) {
						var Child = nameedit.rows[i].cells[x];
						obj.stencil(nameedit, rows[i], JsonStr, tds, JsonStr[i], i, Child, x, BrowserInfo);
					}
				}
				var a = 1; //起始条数
				var total = a + i; //每循环一次加1，直到数据为空为止结束
			}
			/*************删除不必要的内容************/
			for(var x = 0; x < nameedit.rows.length; x++) {
				var z = nameedit.rows[x].cells.length;
				obj.removeElement(nameedit.rows[x].cells[z - 1]);
				obj.removeElement(nameedit.rows[x].cells[0]);
			}
			var z = newtable.rows[0].cells.length;
			obj.removeElement(newtable.rows[0].cells[z - 1]);
			obj.removeElement(newtable.rows[0].cells[0]);
			var arry = {
				htmls: newtable.innerHTML
			};
			newarr.push(arry); //从新整合数组
			var htmlz = JSON.stringify(newarr);
			window.sessionStorage.setItem(rota, htmlz); //保存存储名为menu
			obj.removeElement(newtable);
			var li = JSON.parse(window.sessionStorage.getItem(rota)); //获取session存储名
			//Excel导出功能
			var idTmr;
			var explorer = obj.BrowserSpot(explorer);
			if(explorer == "ie") {
				var oXL = new ActiveXObject("Excel.Application");
				var oWB = oXL.Workbooks.Add();
				var xlsheet = oWB.Worksheets(1);
				var sel = document.body.createTextRange();
				sel.moveToElementText(newtable);
				sel.select();
				sel.execCommand("Copy");
				xlsheet.Paste();
				oXL.Visible = true;
				try {
					var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
				} catch(e) {
					print("Nested catch caught " + e);
				} finally {
					oWB.SaveAs(fname);
					oWB.Close(savechanges = false);
					oXL.Quit();
					oXL = null;
					idTmr = window.setInterval(obj.Cleanup(), 1);
				}
			} else {
				var html = li[0].htmls;
				if(!newtable.nodeType) newtable = newtable
				obj.tableToExcelhtml(html,title);
			}
		}
	},
	/**
	 * 设置拷贝需要下载的table表格，对拷贝的表格进行操作，然后下载修改的table表格
	 * 主要删除操作的内容区，只保留数据显示的区域，以使表格整洁，表格导出后样式不在显示
	 */
	ExcelHTML: function(html) {
		var _table = this;
		var list = TAB$(_table.par.TableName);
		var newtable;
		newtable = TABLAYER$('table');
		newtable.id = 'Newtable';
		document.body.appendChild(newtable);
		newtable.style.cssText = "display:none;";
		var copy = list.innerHTML;
		newtable.innerHTML = copy; //拷贝样式内容到新的table中
		for(var x = 1; x < newtable.rows.length; x++) {
			var z = newtable.rows[x].cells.length;
			_table.removeElement(newtable.rows[x].cells[z - 1]);
			_table.removeElement(newtable.rows[x].cells[0]);
			//newtable.rows[x].cells[z - 1].remove();
			//newtable.rows[x].cells[0].remove();
		}
		var z = newtable.rows[0].cells.length;
		_table.removeElement(newtable.rows[0].cells[z - 1]);
		_table.removeElement(newtable.rows[0].cells[0]);
		//newtable.rows[0].cells[z - 1].remove();
		//newtable.rows[0].cells[0].remove();
		var html = newtable.innerHTML;
		return html; //对新拷贝的表格进行处理获取内容
	},
	tableToExcel: function(table, name, obj,eve) {
		var html = obj.ExcelHTML(html);
		if(!table.nodeType) table = document.getElementById(table);
		obj.tableToExcelhtml(html,name);
		var BrowserInfo = {
			IsIE: /*@cc_on!@*/ false,
			IsIE9Under: /*@cc_on!@*/ false && (parseInt(s.match(/msie (\d+)/)[1], 10) <= 9),
		};
		BrowserInfo.IsIE9Under ? TAB$("Newtable").removeNode() : TAB$("Newtable").remove();
	},
	Cleanup: function() {
		window.clearInterval(idTmr);
		CollectGarbage();
	},
	BrowserSpot: function(explorer) {
		var explorer = window.navigator.userAgent;
		//ie
		if(explorer.indexOf("MSIE") >= 0) {
			return 'ie';
		}
		//firefox
		else if(explorer.indexOf("Firefox") >= 0) {
			return 'Firefox';
		}
		//Chrome
		else if(explorer.indexOf("Chrome") >= 0) {
			return 'Chrome';
		}
		//Opera
		else if(explorer.indexOf("Opera") >= 0) {
			return 'Opera';
		}
		//Safari
		else if(explorer.indexOf("Safari") >= 0) {
			return 'Safari';
		}
		return explorer;
	},
	//按钮操作事件方法
	BtnoperationMethod: function(Table, obj, curPage, pageSize) {
		var _this=this;
		var FixedCote=_this.par.FixedCote;
		var Fixedtable=_this.getElementsByClassName(Table.parentElement.parentElement,"sys-Fixed-table");
		var onclicks=function(x,c,eve,tar){
			var on = tar.tagName.toLowerCase(),Fieldvalue={};
			if(on == "button" || on == "span" || on=="select"){ 
				var Panner=tar.parentNode,parameter;
				var dates = Panner.getAttribute("data-value");
				var valuelist = dates.split(",");
				for(var v = 0; v < valuelist.length; v++) {
					var parameter=valuelist[v];
					var dataname = tar.getAttribute("data-"+parameter+"");
					Fieldvalue[parameter]=""
					Fieldvalue[parameter]+=dataname;
				}
				var name = tar.getAttribute('name');
				addLoadListener(obj.btnclick);
				obj.btnclick(Table, Fieldvalue, _this, name, tar, curPage, pageSize,tar.parentNode);
			}
		}
		var onclickevent=function(){
			for(var x = 1; x < Table.rows.length; x++) {
				for(var c = 0; c < Table.rows[x].cells.length; c++) {
					var btn = Table.rows[x].cells[c].getElementsByTagName("button") || Table.rows[x].cells[c].getElementsByTagName("a"); //获取按钮
					Table.rows[x].cells[c].onclick = function(e) {
						var eve=_this.eve(e);
						onclicks(x,c,Table.rows[x],eve);
					}
					Table.rows[x].cells[c].onchange = function(e) {
						var eve=_this.eve(e);
						onclicks(x,c,Table.rows[x],eve);
						
					}
				}
			}
		}
		var actives=function(obj,status,S,mode){
			var dindex=obj.getAttribute("sys-index");
			if(dindex!=null){
				var ce=obj.cells[0];
				if(ce.tagName=="TD"){
					for(var i = 0; i < Fixedtable.length; i++) {
						var F=_this.getElementsByClassName(Fixedtable[i],"table")[0];
						for(var t = 1; t < F.rows.length; t++) {
							var fi=F.rows[t].getAttribute("sys-index");
							if(fi==dindex){
								var I=parseInt(dindex);
								if(S==1){
									var checkboxs =  F.rows[I+1].getElementsByTagName('input')[0];
									if(checkboxs!=undefined){
										if(checkboxs.checked==true){
											_this.addClass(Table.rows[I+1], 'sys-table-selected');
										}else{
											_this.removeClass(Table.rows[I+1], 'sys-table-selected');
										}
									}
								}
								if(status==true){
									_this.addClass(F.rows[t], 'sys-table-hover');
								
								}else{
									_this.removeClass(F.rows[t], 'sys-table-hover');
								}
							}
						}
					}
					for(var i = 0; i < Table.rows.length; i++) {
						var fi=Table.rows[i].getAttribute("sys-index");
							if(fi==dindex){
								if(S==1){
									if(status==true){
										_this.addClass(Table.rows[i], 'sys-table-hover');
									}else{
										_this.removeClass(Table.rows[i], 'sys-table-hover');
									}
								}else{
									if(status==true){
										_this.addClass(Table.rows[i], 'sys-table-selected');
									}else{
										_this.removeClass(Table.rows[i], 'sys-table-selected');
									}
									
								}
							}
					}
					if(status==true){
						_this.addClass(obj, 'sys-table-hover');
					}else{
						_this.removeClass(obj, 'sys-table-hover')
					}
				}
			}
		}
		if(FixedCote!=null){
			for(var i = 0; i < Fixedtable.length; i++) {
				var table=_this.getElementsByClassName(Fixedtable[i],"table")[0];
				for(var x = 0; x < table.rows.length; x++) {
					for(var c = table.rows[x].cells.length - 1; c >= 0; c--) {
						table.rows[x].cells[c].onclick = function(e) {
							var eve=_this.eve(e),bm;
							var cellsclick=eve.parentNode;
							var dataname = eve.getAttribute('data-name');
							var btn=function(){
								return eve.tagName=="BUTTON" || eve.tagName=="A" || eve.tagName=="INPUT"
							}();
							if(btn==true){
								var name = eve.getAttribute('name');
								var activeclass=function(checked,row,sta){
										for(var i = 0; i < Fixedtable.length; i++) {
											if(sta==1){
												var table=_this.getElementsByClassName(Fixedtable[i],"table")[0];
												if(checked==true){
													_this.addClass(table.rows[row],"sys-table-selected");	
												}else{
													_this.removeClass(table.rows[row],"sys-table-selected");
												}
											}else{
												
											}
										}
									}
								if(dataname=="button"){
									var index=eve.parentNode.getAttribute("sys-index");
									var indexsite = index.split("-");
									var row=parseInt(indexsite[0])+1,up=parseInt(indexsite[1]);
									var obj=Table.rows[row].cells[up];
									var btn = obj.getElementsByTagName("button") || obj.getElementsByTagName("a"); //获取按钮
									for(var b = btn.length - 1; b >= 0; b--) {
										var bm = btn[b].getAttribute('name');
										if(name==bm){
											onclicks(x,c,btn[b],eve);
										}
									}
								}else if(dataname=="checkbox"){
									var index=eve.parentNode.parentNode.getAttribute("sys-index");
									var indexsite = index.split("-");
									var row=parseInt(indexsite[0])+1,up=parseInt(indexsite[1]);
									    var obj=Table.rows[row].cells[up];
									    var checkboxs = obj.getElementsByTagName("input");
									for(var b = checkboxs.length - 1; b >= 0; b--) {
										var bm = checkboxs[b].getAttribute('data-name');
										if(dataname==bm){
										var paren=eve.parentNode.parentNode.parentNode;
											if(checkboxs[b].checked==true){
												checkboxs[b].checked=false;
												activeclass(false,row,1);
												actives(paren,false,0);
												_this.Attributes(checkboxs[b],"checked",false);
											}else{
												checkboxs[b].checked=true;
												activeclass(true,row,1);
												actives(paren,true,0);
												_this.Attributes(checkboxs[b],"checked",true);
											}
											for(var m = 1; m < Table.rows.length; m++) {
												_this.onlikecheck(Table, m, curPage, pageSize, checkboxs[b])
											}
										}										
									}
								}else if(dataname=="selectall"){
									var ZT=1,am=0;
									var checkboxs = eve.checked;
									var checkboxtable=eve.parentNode.parentNode.parentNode.parentNode.parentNode;
									var SL=_this.getElementsByClassName(checkboxtable,"sys-checkbox");
									if(SL.length==0){
										
									}else{
										if((ZT-1)==SL.length || ZT==1){	
											ZT=1;
										}else{
										    ZT=(ZT-1);
										}
										var Y=0;
										for(var x = ZT; x <Table.rows.length; x++) {
											var current=checkboxtable.rows[x].cells[0].getElementsByTagName('input')[0];
											if(current.checked!=checkboxs){
												Y++
											}
										}
										if(Y==SL.length){
											for(var w = SL.length - 1; w >= 0; w--) {
												SL[w].checked=checkboxs;
												_this.Attributes(SL[w],"checked",checkboxs)	
												
											}
										}else{
											for(var w = SL.length - 1; w >= 0; w--) {
												SL[w].checked=checkboxs;
												_this.Attributes(SL[w],"checked",checkboxs)	
												
											}
										}
									} 
									for(var x = ZT; x <Table.rows.length; x++) {
										if(checkboxtable.rows.length==1){
											var sta=0
										}else{
											var sta=1;
										}
										var checkboxs = SL[x-1];
										var cellslist=Table.rows[x].cells;
										var TCK = cellslist[0].getElementsByTagName('input')[0];
										if(checkboxs) {
											if(checkboxs.checked == false) {
												TCK.checked=false;
												_this.Attributes(TCK,"checked",false);
												activeclass(false,x,sta);
												_this.removeClass(Table.rows[x], 'sys-table-selected');
											} else {
												TCK.checked=true;
												_this.Attributes(TCK,"checked",true)
												activeclass(true,x,sta);
												_this.addClass(Table.rows[x], 'sys-table-selected');
											}
										}else{
											if(TCK.checked == false) {
												TCK.checked=true;
												_this.Attributes(TCK,"checked",true)
												activeclass(true,x,sta);
												_this.addClass(Table.rows[x], 'sys-table-selected');
												
											}else if(TCK.checked == true) {
												TCK.checked=false;
												_this.Attributes(TCK,"checked",false);
												activeclass(false,x,sta);
												_this.removeClass(Table.rows[x], 'sys-table-selected');
												
											}
										}
									}
								}
							}else{
								if(dataname=="onSequence"){
									var args = _this.par.Sequence;
									if(args != null){
										var ViewState=_this.par.ViewState;
											if(args.length > 1) {				
												var z = eve.getAttribute("data-th");
												_this.onSequence(Table, z, eve,1,ViewState);
											    
									       }
								    }
							    }
							}
						}
						table.rows[x].cells[c].onchange = function(e) {
							var eve=_this.eve(e),bm;
							onclicks(x,c,table.rows[x],eve);
						}
					}
				}
			}
			onclickevent()
		}else{
			onclickevent()
			_this.currentcheckbox(Table, _this, curPage, pageSize);
		}
		var trlist=Table.parentNode.getElementsByTagName("tr");
		for(var b = trlist.length - 1; b >= 0; b--) {		
			var index=trlist[b].getAttribute("sys-index");
			$$(trlist[b]).over(function(eve){	
				var obj=eve.obj;
				actives(obj,true,1,0);
			}).out(function(eve){
				var obj=eve.obj;
				actives(obj,false,1,0);
			});
		}
	},
	//下拉选择操作
	SelectMethod: function(Table, data, _this, obj) {
		var keyvalue = obj.getAttribute("data-value");
		var optionid = obj.getAttribute("data-option");
		var valuelist = keyvalue.split(",");
		var value='',id='';
		var option = "";
		for(var i = 0; i < data.length; i++) {
			var vv=data[i];
			value = vv[keyvalue];
			id=vv[optionid];
			option += "<option value=" +id + ">" + value + "</option>";
		}
		obj.innerHTML = "<select class='select' name=" + keyvalue + " title="+value+" sys-key='"+keyvalue+"' >" + option + "</select>";
	},
	//执行事件方法
	btnclick: function(Table, id, _this, name, obj, curPage, pageSize,eve) {
		if(name == 'deleteEvent') {
			_this.par.DeleteEvent(Table,obj,_this,id,curPage,pageSize); //删除操作
			return;
		} else if(name == 'modifyEvent') {
			_this.ModifyMethod(Table,id,obj,name,eve);
			_this.par.ModifyEvent(Table,obj,_this,id); //修改操作
			return;
		} else if(name == 'detailedEvent') {
			_this.par.DetailedEvent(Table,obj,_this,id,eve,pageSize); //详细操作
			return;
		}else if(name=="selectBtnEvent"){
			_this.par.SelectBtnEvent(Table,obj,_this,id);
		} else if(name == 'SaveEvent') {
			_this.SaveMethod(Table,obj,_this,id,eve,pageSize);
		} else if(name == 'plusclick') {
			var list = eve.parentNode.parentNode;
			var fid = obj.getAttribute('data-fid');
			var level=obj.getAttribute("data-level");
			var sequence=obj.getAttribute("data-sequence")
			var ST=sequence.split("-"),MM=0;
			if(level==0) {
				var child = "father" + fid;
				var initial=1
			} else {
				var initial=0
				var child ="child"+(parseInt(level)+1);
			}
			var mode=_this.par.mode;
			if(mode=="table"){
				MM=Table.rows;
			}else{
				MM=_this.getElementsByClassName(Table, 'sys-tree');
			}
			for(var x = 1; x < MM.length; x++) {
				var father=MM[x].getAttribute("data-father");
				var grade= father.split("-");
				if(grade.length>ST.length){
					var um=0
					for(var s = 0; s < ST.length; s++) {
							if(grade[s]==ST[s]){
							    um++
							}
					}
					if(um==ST.length){
						MM[x].style.display = "none";	
					}
				}
			}
			var sl = _this.getElementsByClassName(list, child);
			var len = sl.length;
			var plusminu = function(i,initial) {
				var father=sl[i].getAttribute("data-father");
				var grade= father.split("-");
				if(initial==1){
					sl[i].style.display = "none";
				}else{
					if(grade[1]==sequence){
						sl[i].style.display = "none";
					}
				}
				obj.setAttribute('name', 'minusclick');
				_this.removeClass(obj, 'plus');
				_this.addClass(obj, 'minus');
			};
			for(var i = initial; i < len; i++) {
				if(_this.hasClass(sl[i],"father" + fid)){
					plusminu(i,initial);
				}
			}
			//隐藏
		} else if(name == 'minusclick') {
			var site = _this.par.treeArrowSite;
			var list = eve.parentNode.parentNode;
			var fid = obj.getAttribute('data-fid');
			var level=obj.getAttribute("data-level");
			var sequence=obj.getAttribute("data-sequence")
			var ST=sequence.split("-"),MM=0,display="";
			if(level==0) {
				var initial=1
				var child = "father" + fid;
			} else {
				var initial=0;
				var child ="child"+ (parseInt(level)+1);
			}
			var mode=_this.par.mode;
			if(mode=="table"){
				MM=Table.rows;
				display="table-row"
			}else{
				MM=_this.getElementsByClassName(Table, 'sys-tree');
				display=""
			}
			for(var x = 1; x < MM.length; x++) {
				var father=MM[x].getAttribute("data-father");
				var grade= father.split("-");
				if(grade.length>ST.length){
					var um=0
					for(var s = 0; s < ST.length; s++) {
							if(grade[s]==ST[s]){
							    um++
							}
					}
					if(um==ST.length){
						MM[x].style.display = display;	
					}
				}
				
			}
			var sl = _this.getElementsByClassName(list, child);
			var len = sl.length;
			
			var plusminu = function(i,obj,initial) {
				var father=sl[i].getAttribute("data-father");
				var grade= father.split("-");
				if(mode=="table"){
					var spanrow=sl[i].cells[site].getElementsByTagName("span");
				}else{
					var LL=sl[i].children[0];
					var spanrow=LL.getElementsByTagName("span");
				}
				if(initial==1){
					sl[i].style.display =display;
				}else{
					if(grade[1]==sequence){
						sl[i].style.display =display;
					}
				}
				if(spanrow.length!=0){
					spanrow[0].setAttribute('name', 'plusclick');
					_this.removeClass(spanrow[0], 'minus');
					_this.addClass(spanrow[0], 'plus');
				}
				
				obj.setAttribute('name', 'plusclick');
				_this.removeClass(obj, 'minus');
				_this.addClass(obj, 'plus');
			};
			for(var i = initial; i < len; i++) {
				if(fid) {
					if(_this.hasClass(sl[i],"father" + fid)){
						plusminu(i,obj,initial);
					}
				} else {
					var father=_this.hasClass(sl[i],"father");
					if(father){
						var treeArrowSite=_this.par.treeArrowSite;
						 var TagName=sl[i].cells[treeArrowSite].getElementsByTagName("span")[0];
						plusminu(i,TagName,initial);
					}else{
						plusminu(i,obj,initial);
					}
					
				}
			}
			//显示
		} else if(name == 'tree') {
			//父级全选操作 只用于tree树状图状态下使用
			var list = obj.parentNode; //父级
			var child = "child" + id + "";
			var sl = _this.getElementsByClassName(list, child);
			if(sl != 0) {
				for(var i = 0; i < sl.length; i++) {
					var checkbox = sl[i].cells[0].getElementsByTagName('input')[0];
					if(obj) {
						if(obj.checked == false) {
							checkbox ? checkbox.checked = false : '';
							_this.removeClass(sl[i], 'sys-table-selected');
							_this.removeClass(obj, 'sys-table-selected');
						} else {
							checkbox.checked = true;
							_this.addClass(obj, 'sys-table-selected');
							_this.addClass(sl[i], 'sys-table-selected');
						}
					}
				}
			} else {
				if(obj.checked == false) {
					obj.checked = true;
					_this.addClass(obj, 'sys-table-selected');
				} else {
					obj.checked = false;
					_this.removeClass(obj, 'sys-table-selected');
				}
			}
		}else{
			_this.par.OperationEventSet(Table,_this,name,id)
		}
	},
	//点击选择框事件
	currentcheckbox: function(Table, index, curPage, pageSize) {
		for(var x = 1; x < Table.rows.length; x++) {
			var cells=Table.rows[x].cells[0];
			var checkbox =cells.getElementsByTagName('input')[0];
			checkbox ? Table.rows[x].cells[0].onclick = function(e) {
				var eve=_this.eve(e);
				for(var m = 1; m < Table.rows.length; m++) {
					if(eve.tagName=="TD"){
						var CK =eve.getElementsByTagName('input')[0];
						index.onlikecheck(Table, m, curPage, pageSize, CK)
					}else{
						index.onlikecheck(Table, m, curPage, pageSize, eve)
					}
				}
			} : ''; //单选事件
		};
	},
	//执行修改信息操作方法
	ModifyMethod: function(Table, id, obj, name,eve) {
		var _this = this; //声明调用数组集合
		var edit = _this.getElementsByClassName(obj.parentNode.parentNode, 'table-edit');
		if(edit != 0) {
			for(var i = 0; i < edit.length; i++) {
				var keyvalue = edit[i].getAttribute("data-value");
				var keyname = edit[i].getAttribute("data-name");
				var ArrayString = edit[i].getAttribute("data-Array");
				var text = edit[i].innerText;
				var Z=edit[i].getAttribute("sys-index");
				if(keyname == "checkbox") {
					edit[i].innerHTML = ""; //清除内容
					var result = ArrayString.split(",");
					var newarr = []; //声明一个数组
					for(var n = 0; n < result.length; n++) {
						var newgroup = {
							id: n,
							name: result[n]
						};
						newarr.push(newgroup); //从新整合数组
					} //对数组进行判断
					for(var c = 0; c < newarr.length; c++) {
						if(text == newarr[c].name) {
							edit[i].innerHTML += "<label class='radio sys-select'><input sys-key='"+keyvalue+"'  name='" + keyvalue + Z +
								"' type='radio' checked='checked' data-name='" + newarr[c].name + "' value='" + c + "' class='sys-pick ace'><span class='lbl'>" + newarr[c].name +
								"</span></label>"
						} else {
							edit[i].innerHTML += "<label class='radio sys-select'><input sys-key='"+keyvalue+"'  name='" + keyvalue + Z + "' data-name='" + newarr[c].name + "'  type='radio' value='" + c +
								"' class='sys-pick ace'><span class='lbl'>" + newarr[c].name + "</span></label>"
						}
					}
					var selectlist = _this.getElementsByClassName(edit[i], 'sys-select');
					var SW=0;
					if(selectlist!=0){
						for(var s = 0; s < selectlist.length; s++) {
							SW+=selectlist[s].offsetWidth+10;
							
						}
						edit[i].style.width=SW+'px';
						var Tb=Table.offsetWidth;
						Table.style.width=(Tb+SW)+'px'
					}
					//edit[i].removeAttribute("data-Array");
				} else if(keyname == "select") {
					edit[i].innerHTML = ""; //清除内容
					var aobj = edit[i];
					_this.par.SelectEvent(_this, aobj);
				} else {
					var addclass;
					var decimal=edit[i].getAttribute("data-decimal");
				    var calculate=edit[i].getAttribute("data-calculate");
				    calculate!=null? addclass="sys-calculate":addclass="";
				    decimal==null?decimal=0:decimal=decimal
					edit[i].innerHTML = "<input type='text' class='edit-text "+addclass+"'  data-decimal='"+decimal+"' data-calculate='"+calculate+"' value='" + text + "' name='" + keyvalue + "' sys-key='"+keyvalue+"' />";
					var inputlist = _this.getElementsByClassName(edit[i], 'edit-text');
					if(inputlist!=0){
						var iw=inputlist[0].offsetWidth;
						edit[i].style.width=iw+'px';
					}
				}
			}
			obj.innerHTML = _this.par.submitName[1];
			obj.name = 'SaveEvent';
			_this.addClass(obj,"btn-save")
		} else {
			//_this.PromptBox("抱歉，不支持直接修改信息，请点击详细进行操作", 2, false);
		}
	},
	//执行保存的事件方法
	SaveMethod: function(Table, events,_this, obj,eve,pageSize) {
		var jsonarry=[],newgroup={},newother={},newmerge={};
		var formData = "";
		var m = events.parentNode.parentNode.getElementsByTagName('td');
		for(var i = 0; i < m.length; i++) {
			var edit = _this.hasClass(m[i], 'table-edit');
			var keyvalue = m[i].getAttribute("data-value");
			if(edit) {
				var tagname = m[i].getElementsByTagName("input")[0] || m[i].getElementsByTagName("select")[0];
				var keyname = tagname.getAttribute("sys-key");
				var muster = _this.getByClass(m[i], 'radio');
				newgroup[keyname] = "";
				if(muster != 0) {
					for(var c = 0; c < muster.length; c++) {
						var checkedname = name$(keyvalue + i)[c];
						if(checkedname.checked == true) {
							var text = name$(keyvalue + i)[c].value;
							keyname = keyvalue;
						}
					}
				} else {
					var tablevalue = m[i].getElementsByTagName("input")[0] || m[i].getElementsByTagName("select")[0];
					var text = tablevalue.value;
				}
				formData += keyname + "=" + text + "&";
				newgroup[keyname]+=text;
				if(text == "") {
					_this.PromptBox("修改信息内容不能为空", 2, false);
					return false;
				}
			}else{
				var text=m[i].innerText;
				var result = keyvalue.split(",");
				if(result.length==1){
					newother[keyvalue]="";
					newother[keyvalue]+=text;	
				}					
			}
		}
		for(var key in newgroup){
			if(newgroup.hasOwnProperty(key)===true){
				 newother[key]=newgroup[key];
			}
		}
		_this.par.SaveEvent(Table,events,_this,newgroup,eve,obj,formData,pageSize); //保存操作
	},
	//分页方法
	pageTableMethod: function(html, curPage, pageTotal, pageSize, total, name) {
		var that = this;
		var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
		var Table = TAB$(that.par.TableName);
		var amount = that.par.btnpageing;
		var pl=that.par.paginName;
		pageTotal == 0 ? pageTotal = 1 : ''; //默认数据为0时执行该方法
		var pageedit=function(eve){
			if(eve){
				 var number=that.getElementsByClassName(eve,"page-number")[0];
				//分页
				if(number) {
					var ul = number.parentNode;
					var pag = [];
					var modern = [];
					var pagset = [];
					var number=that.getElementsByClassName(eve,"page-number");
					var sets = that.par.pageSize;
					for(var i = 0; i < number.length; i++) {
						var pages = parseInt(number[i].getAttribute("data-pages"));
						modern.push(pages);
						//curPage=pages;
					}
					if(curPage < amount) {
						var ellipsis = number[0].parentNode.getElementsByTagName('span')[0];
						var jh = Math.min(amount, pageTotal);
						while(jh) {
							pag.unshift(jh--);
						}
						for(var s = 0; s < sets.length; s++) {
							var current;
							total == 0 ? current = 1 : current = 0;
							set = Math.ceil((total + current) / sets[s]);
							 if(name!=null){
							 	 var statr= that.hasClass(name.parentNode,'select-page');
							 }
							if(statr) {
								if(pageTotal == set) {
									for(var i = number.length - 1; i >= 0; i--) {
										pag[i] != modern[i] ? that.removeElement(number[i]) : '';
										ellipsis ? that.removeElement(ellipsis) : '';
									}
									var next =that.getElementsByClassName(eve,'Next-page')[0];
									var last =that.getElementsByClassName(eve,'Pre-page')[0];
									that.lastPage(ul, curPage, html, last,eve, condition); //上一页
									that.nextPage(ul, curPage, pageTotal,eve, html, next, condition,null);
								}
							}
							that.finalPage(ul, curPage, pageTotal, pageSize, html,eve);
						}
						for(var i = 0; i < pag.length; i++) {
							if(number.length <= amount) {
								if(pag[i] == modern[i]) {
									number[i].setAttribute("data-pages", pag[i]);
									number[i].innerHTML = pag[i];
									var ys = parseInt(number[i].innerHTML);
									if(ys == curPage) {
										that.addClass(number[i], 'active');
									} else {
										that.removeClass(number[i], 'active');
									}
								} else {

									var li = TABLAYER$('li');
									var atr = document.createAttribute("name");
									atr.nodeValue = "page-number";
									li.setAttributeNode(atr);
									var pages = document.createAttribute("data-pages");
									pages.nodeValue = pag[i];
									li.setAttributeNode(pages);
									li.innerHTML = pag[i];
									number[0].parentNode.appendChild(li);
								}
							} else {
								number[i].setAttribute("data-pages", pag[i]);
								number[i].innerHTML = pag[i];
								var ys = parseInt(number[i].innerHTML);
								if(ys == curPage) {
									that.addClass(number[i], 'active');
								} else {
									that.removeClass(number[i], 'active');
								}
							}
						}
						if(pageTotal > amount) {
							if(!ellipsis) {
								var span = TABLAYER$('span');
								that.addClass(span, 'ellipsis');
								span.innerHTML = '...';
								number[0].parentNode.appendChild(span);
								var next = TABLAYER$('li');
								var atr = document.createAttribute("name");
								atr.nodeValue = "page-number";
								that.addClass(next,"page-number");
								next.setAttributeNode(atr);
								var pages = document.createAttribute("data-pages");
								pages.nodeValue = pageTotal;
								next.setAttributeNode(pages);
								next.innerHTML = pageTotal;
								that.removeClass(next, 'pages');
								that.addClass(next, 'mantissa');
								number[0].parentNode.appendChild(next);
							}
						}
						if(pageTotal - curPage > 2) {
							ellipsis ?ellipsis.style.display = "inline":''; //显示更多
						}
						//对相同页面进行比，并删除其中一个相同值样式
						for(var i = 0; i < number.length - 1; i++) {
							var size = number[i].getAttribute('data-pages');
							for(var j = i + 1; j < number.length; j++) {
								var contrast = number[j].getAttribute('data-pages');
								if(size == contrast) {
									that.removeElement(number[i]);
									//number[i].remove();
								}
							}
						}
					} else {
						if(curPage > amount - 1) {
							var middle = (curPage - 1) - Math.floor(amount / 2),
								//从哪里开始
								i = amount;
	//						if(middle > pageTotal - curPage) {
	//							middle = pageTotal - curPage + 1;
	//						}
							while(i--) {
								pag.push(middle++);
							}
							//var classname = that.hasClass(number[amount], 'mantissa');
							//var last;
							// classname?last=parseInt(number[amount].getAttribute("data-pages")):'';
							for(var i = 0; i < number.length - 1; i++) {
								var current = parseInt(number[i].getAttribute("data-pages"));
								var ellipsis = number[i].parentNode.getElementsByTagName('span')[0];
								for(var S = 0; S < number.length; S++) {
									var index;
									var active = _this.hasClass(number[S], 'active');
									active ? index = parseInt(number[S].getAttribute("data-pages")) : '';
								}
								if(pageTotal - curPage > 2) {
									ellipsis.style.display = "inline"; //显示更多
									var pages = parseInt(number[i].getAttribute("data-pages"));
									number[i].setAttribute("data-pages", pag[i]);
									number[i].innerHTML = pag[i];
								}else if(pageTotal - curPage == 2){
									ellipsis.style.display = "none"; //隐藏更多
									var pages = parseInt(number[i].getAttribute("data-pages"));
									number[i].setAttribute("data-pages", pag[i]);
									number[i].innerHTML = pag[i];
								}
								var ys = parseInt(number[i].innerHTML);
								ys == curPage ? that.addClass(number[i], 'active') : that.removeClass(number[i], 'active');
							}
						} else {
							return;
						}
					}
				} else {
					that.firstPage(ul, curPage, html, pageTotal, eve, pageSize); //首页
					that.lastPage(ul, curPage, html, null,eve, pageSize, condition); //上一页
					var ul = eve.appendChild(TABLAYER$('ul'));
					that.addClass(ul, 'Page-library');
					 var pagenumber=null;
					 if(that.par.pagenumber!=null){
						 pagenumber=parseInt(that.par.pagenumber);
					 }else{
						 pagenumber=pageTotal;
					 }
					for(var p = 0; p < pageTotal; p++) {
						if(p<=pagenumber ||p==pageTotal){
						var li = TABLAYER$('li');
						var atr = document.createAttribute("name");
						atr.nodeValue = "page-number";
						that.addClass(li,"page-number");
						li.setAttributeNode(atr);
						if(p == curPage - 1) {
							li.className += ' active';
						} else {
							that.addClass(li, 'pages');
							that.getPage(curPage);
						}
						li.innerHTML = p + 1;
						var pages = document.createAttribute("data-pages");
						pages.nodeValue = p + 1;
						li.setAttributeNode(pages);
						ul.appendChild(li);
						}else{

						}
					}
					var number=that.getElementsByClassName(eve,"page-number");
					for(var i = 0; i < number.length; i++) {
						if(pageTotal > amount + 1) {
							if(number.length == pagenumber+1) {
								var ellipsis=that.getElementsByClassName(eve,"ellipsis");
								if(ellipsis.length==0){
									var span = TABLAYER$('span');
									that.addClass(span, 'ellipsis');
									span.innerHTML = '...';
									ul.appendChild(span);
								}								
							}
						}
						for(var e = amount; e < number.length; e++) {
							_this.removeElement(number[e]);
						}
						li.innerHTML = pageTotal;
						var pages = document.createAttribute("data-pages");
						pages.nodeValue=pageTotal;
						li.setAttributeNode(pages);
						that.removeClass(li, 'pages');
						that.addClass(li, 'mantissa');
						ul.appendChild(li);
					};
					var next =that.getElementsByClassName(eve,'Next-page')[0];
					next==undefined?next=null:'';

					//调用下一页
					that.nextPage(ul, curPage, pageTotal,eve, html, next,condition,null);
					//调用尾页
					that.finalPage(ul, curPage, pageTotal, pageSize, html,eve);
				}
				//是否显示总页数,每页个数,数据
				that.showPageTotal(ul, curPage, pageTotal, total, Table);
				//根据点击的页数分页
				for(var i = 0; i < number.length; i++) {
					if(number) {
						number[i].index = i;
						addLoadListener(that.pageonclick(number[i], number, number.parentNode, eve, curPage, pageTotal, pageSize, that, html, Table));
					}
				}
			}
		}
		for(var i=0;i<pl.length;i++){
			var  pagination=that.$(pl[i]);
			if(curPage==1){
				pagination.innerHTML=""
			}
			pageedit(pagination);
		}
	},
	//分页点击
	pageonclick: function(event, number, ul, eve, curPage, pageTotal, pageSize, obj, html, Table) {
		var next =obj.getElementsByClassName(eve,'Next-page')[0];
		var Pre =obj.getElementsByClassName(eve,'Pre-page')[0];
		var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
		//点击页数操作
		event.onclick = function(e) {
			 e=obj.eve(e);
			obj.Paginations(ul, eve, number, pageTotal, obj, e, curPage, pageSize, Table, html, Pre, next, condition);
		}
		//点击上一页操作
		Pre.onclick = function(e) {
			e=obj.eve(e);
			var disabled = obj.hasClass(e, 'disabled');
			if(!disabled) {
				obj.Paginations(ul, eve, number, pageTotal, obj, e, curPage, pageSize, Table, html, Pre, next, condition);
			} else {
				obj.PromptBox("没有更多了!", 2);
			}
		}
		//点击下一页操作
		next.onclick = function(e) {
			e=obj.eve(e);
			var disabled = obj.hasClass(e, 'disabled');
			if(!disabled) {
				obj.Paginations(ul, eve, number, pageTotal, obj, e, curPage, pageSize, Table, html, Pre, next, condition);
			} else {
				obj.PromptBox("没有更多了!", 2);
			}
		}
	},
	//根据点击事件操作
	Paginations: function(ul, eve, number, pageTotal, obj, e, curPage, pageSize, Table, html, Pre, next, condition) {
		var Fixedclass=obj.getElementsByClassName(Table.parentElement.parentElement,"sys-Fixed-table");
		if(Fixedclass!=0){
			 for(var f=0;f<Fixedclass.length;f++){
			 	obj.removeElement(Fixedclass[f]);
			 }
		}
		var amount = obj.par.btnpageing;
		var quantity = number.length;
		for(var S = 0; S < number.length; S++) {
			var index;
			var active = obj.hasClass(number[S], 'active');
			active ? index = S : '';
		}
		if(e == next) {
			index++;
		} else if(e == Pre) {
			index--;

		} else {
			index = e.index;
		}
		for(var n = 0; n < number.length; n++) {
			var classname = obj.hasClass(e, 'mantissa');
			if(classname) {
				var u = parseInt(e.getAttribute("data-pages"));
			}
			var curPage = parseInt(number[index].getAttribute("data-pages"));
			var ym = parseInt(number[n].getAttribute("data-pages"));
			if(ym == curPage) {
				obj.removeClass(number[n], 'pages');
				obj.addClass(number[n], 'active');
			} else {
				obj.removeClass(number[n], 'active');
			}
			if(u - curPage > 1) {
				obj.getPages(ul, curPage, pageTotal, pageSize, condition);
			}

		}
		//方法名称
      	if(condition != null) {
				var value = condition[0].sname;
				var type = condition[0].status;
				obj.par.SearchEvent(obj, value, curPage, pageSize, null, type);
			} else {
				obj.par.Callback(Table, obj, curPage, pageSize,e); //执行回调的方法
		}
		obj.lastPage(ul, curPage, html, Pre, eve,condition); //上一页
		obj.nextPage(ul, curPage, pageTotal,eve, html, next, condition,e); //下一页

	},
	//当前页码数的方法
	getPage: function(page) {
		//暂无
	},
	//首页的方法
	firstPage: function(ul, curPage, html, pageTotal, pagination, pageSize) {
		
		var that = this;
		var Table = TAB$(that.par.TableName);
		var span = TABLAYER$('span');
		var size = that.par.pageSize;
		var pageSize = size[0];
		span.innerHTML = '首页';
		pagination.appendChild(span);
		span.onclick = function() {
			var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
			var val = parseInt(1);
			curPage = val;
			that.getPage(that.curPage);
			if(condition != null) {
				var value = condition[0].sname;
				var type = condition[0].status;
				that.par.SearchEvent(that, value, curPage, pageSize, null, type);
			} else {
				that.par.Callback(Table, that, curPage, pageSize,span);

			}
			var next =that.getElementsByClassName(pagination,'Next-page')[0];
			var last =that.getElementsByClassName(pagination,'last-page')[0];
			var Pre =that.getElementsByClassName(pagination,'Pre-page')[0];
			that.addClass(span, 'active');
			that.removeClass(last, 'active');
			that.lastPage(ul, curPage, html,Pre,pagination); //上一页
			that.nextPage(ul, curPage, pageTotal,pagination, html, next,condition,null); //下一页
			var Fixedclass=that.getElementsByClassName(Table.parentElement.parentElement,"sys-Fixed-table");
			if(Fixedclass!=0){
				 for(var f=0;f<Fixedclass.length;f++){
				 	that.removeElement(Fixedclass[f]);
				 }
			}
		};
		var atr = document.createAttribute("name");
		atr.nodeValue = "home-page";
		pagination.setAttributeNode(atr);
	},
	//上一页的方法+
	lastPage: function(ul, curPage, html, last, pagination, condition) {
		var that = this;
		var size = that.par.pageSize;
		var pageSize = size[0];
		var Table = TAB$(that.par.TableName);
		var number =that.getElementsByClassName(pagination,'page-number');
		var span = TABLAYER$('span');
		if(!last) {
			span.innerHTML = '<';
			if(parseInt(curPage) == 1) {
				span.className = 'disabled';
			}
			var atr = document.createAttribute("name");
			atr.nodeValue = "Pre-page";
			span.setAttributeNode(atr);
			that.addClass(span,'Pre-page');
			pagination.appendChild(span);
		} else {
			if(parseInt(curPage) > 1) {
				last.onclick = function() {
					curPage = parseInt(curPage - 1);
					if(curPage > 0) {
						that.par.Callback(Table, that, curPage, pageSize,span);
						that.getPage(that.curPage);
					}
					if(curPage == 1) {
						that.addClass(last, 'disabled');
					}
				}
				that.removeClass(last, 'disabled');
			} else {
				for(var i = 0; i < number.length; i++) {
					var lastm = parseInt(number[i].getAttribute("data-pages"));
					if(curPage != lastm) {
						that.removeClass(number[i], 'active');
					}
				}
				that.addClass(last, 'disabled');
			}
		}
	},
	//分页判断方法
	getPages: function(ul, curPage, pageTotal, pageSize, condition) {
		var pag = [];
		var that = this;
		if(curPage <= pageTotal) {
			if(curPage < pageSize) {
				//当前页数小于显示条数
				var i = Math.min(pageSize, pageTotal);
				while(i) {
					pag.unshift(i--);
				}
			} else {
				//当前页数大于显示条数
				var middle = curPage - Math.floor(pageSize / 2),
					//从哪里开始
					i = pageSize;
				if(middle > pageTotal - pageSize) {
					middle = pageTotal - pageSize + 1;
				}
				while(i--) {
					pag.push(middle++);
				}
			}
		} else {
			that.PromptBox("当前页数不能大于总页数", 2);
		}
		if(!pageSize) {
			that.PromptBox("显示页数不能为空或者0", 2);
		}
		return pag;
	},
	//下一页方法
	nextPage: function(ul, curPage, pageTotal,pagination, html, obj, condition,events) {
		if(events!=null){
			pageTotal=parseInt(events.getAttribute("data-pages"));
		}
		var that = this;
		var Table = TAB$(that.par.TableName);
		var span = TABLAYER$('span');
		var number =that.getElementsByClassName(pagination,'page-number');
		var size = that.par.pageSize;
		var pageSize = size[0];
		if(!obj) {
			span.innerHTML = '>';
			curPage = parseInt(curPage);
			if(parseInt(curPage) < parseInt(pageTotal)) {
				span.onclick = function() {
					for(var i = 0; i < number.length-1; i++) {
						var active = that.hasClass(number[i], 'active');
						if(active) {
							var curPage = parseInt(number[i].getAttribute("data-pages"));
						}
					}
					if(curPage >= pageTotal - 1) {
						span.className = 'disabled';
					} else {
						if(condition != null) {
							var value = condition[0].sname;
							var type = condition[0].status;
							that.par.SearchEvent(that, value, curPage, pageSize, null, type);
						} else {
							that.par.Callback(Table, that, curPage, pageSize,span);

						}
						that.getPage(that.curPage);
						var Pre = name$('Pre-page')[0];
						that.removeClass(Pre, 'disabled');
					}
				};
			} else {
				span.className = 'disabled';
			}
			var atr = document.createAttribute("name");
			atr.nodeValue = "Next-page";
			span.setAttributeNode(atr);
			that.addClass(span,'Next-page');
			ul ? ul.parentNode.appendChild(span) : '';
		} else {
			if(parseInt(curPage + 1) <= parseInt(pageTotal)) {
				if(obj.type != "touchend" && obj.type != "touchmove") {
					that.removeClass(obj, 'disabled');
				} else {
					if(condition != null) {
						var value = condition[0].sname;
						var type = condition[0].status;
						that.par.SearchEvent(that, value, curPage, pageSize, obj, type);
					} else {
						that.par.Callback(Table, that, curPage, pageSize, obj);
					}
				}
			} else {
				if(obj.type != "touchend" && obj.type != "touchmove") {
					for(var i = 0; i < number.length; i++) {
						var lastm = parseInt(number[i].getAttribute("data-pages"));
						if(curPage == lastm) {
							that.addClass(number[i], 'active');
						}
					}
					if(pageTotal==number.length){
						that.addClass(obj, 'disabled');
					}
				} else {
					if(condition != null) {
						var value = condition[0].sname;
						var type = condition[0].status;
						that.par.SearchEvent(that, value, curPage, pageSize, obj, type);
					} else {
						that.par.Callback(Table, that, curPage, pageSize, obj);
					}
				}
			}
		}
	},
	//是否显示总页数,每页个数,数据
	showPageTotal: function(ul, curPage, pageTotal, total, Table) {
		var that = this;
		var totalPage = that.getByClass(ul.parentNode, 'totalPage');
		if(totalPage == 0) {
			var span1 = TABLAYER$('span');
			span1.innerHTML = '每页：<select class="select-page" name="SelectPage"></select> 条';
			span1.className = 'select-page';
			ul.parentNode.appendChild(span1);
			var span2 = TABLAYER$('span');
			span2.innerHTML = '共&nbsp' + pageTotal + '&nbsp页';
			span2.className = 'totalPage';
			var pages = document.createAttribute("name");
			pages.nodeValue = 'pageTotal';
			span2.setAttributeNode(pages);
			ul.parentNode.appendChild(span2);
			var span3 = TABLAYER$('span');
			span3.innerHTML = '合计&nbsp' + total + '&nbsp条';
			span3.className = 'totalPage';
			var pages1 = document.createAttribute("name");
			pages1.nodeValue = 'total';
			span3.setAttributeNode(pages1);
			ul.parentNode.appendChild(span3);
			that.selectPage(curPage, pageTotal, total, Table,span1);
		} else {
			for(var i = 0; i < totalPage.length; i++) {
				var num = totalPage[i].getAttribute('name');
				//var num =parseInt(totalPage[i].innerText.replace(/[^0-9]/ig,""));
				if(num == 'pageTotal') {
					totalPage[i].innerHTML = '共&nbsp' + pageTotal + '&nbsp页';
				}
				if(num == 'total') {
					totalPage[i].innerHTML = '合计&nbsp' + total + '&nbsp条';
				}
			}
		}
	},
	//下拉选择数据显示条数
	selectPage: function(curPage, pageTotal, total, Table,pagenumber){
		var that = this;
		var name =that.getElementsByClassName(pagenumber,'select-page')[0];
		var size = that.par.pageSize;
		for(var i = 0; i < size.length; i++) {
			name.innerHTML += "<option value=" + size[i] + ">" + size[i] + "</option>";
		}
		var pageSize = size[0];
		name.onchange = function(){
			var pageSize = parseInt(name.options[name.selectedIndex].value);
			that.par.Callback(Table, that, curPage, pageSize, name,'select');
		};
	},
	//尾页方法
	finalPage: function(ul, curPage, pageTotal, pageSize, html,pagination) {
		var that = this;
		var Table = TAB$(that.par.TableName);
		var amount = that.par.btnpageing;
		var P =that.getElementsByClassName(pagination,'last-page')[0];
		var span = TABLAYER$('span');
		var number =that.getElementsByClassName(pagination,'page-number');
		span.innerHTML = '尾页';
		if(!P) {
			ul.parentNode.appendChild(span);
		} else {
			ul.parentNode.replaceChild(span, P);
		}
		var next =that.getElementsByClassName(pagination,'Next-page')[0];
		var pl =that.par.paginName;
		for(var i=0;i<pl.length;i++){
			var pagination=that.$(pl[i]);
		}
		span.onclick = function() {
			var condition = JSON.parse(window.sessionStorage.getItem("searchname")); //获取session存储名
			curPage = parseInt(pageTotal);
			that.getPage(curPage);
			if(condition!=null){
				var value=condition[0].sname;
		      	var type=condition[0].status;
		      	that.par.SearchEvent(that, value, curPage, pageSize, null, type);
		    }else{
		    	that.par.Callback(Table, that, curPage, pageSize,span);
		    }
			that.addClass(span, 'active');
			for(var i = 0; i < number.length; i++) {
				that.removeClass(number[i], 'active');
			}
			var Pre =that.getElementsByClassName(pagination,'Pre-page')[0];
			that.lastPage(ul, curPage, html, Pre,pagination); //上一页
			that.nextPage(ul, curPage, pageTotal,pagination, html, next,condition,null); //下一页
			var Fixedclass=that.getElementsByClassName(Table.parentElement.parentElement,"sys-Fixed-table");
			if(Fixedclass!=0){
				 for(var f=0;f<Fixedclass.length;f++){
				 	that.removeElement(Fixedclass[f]);
				 }
			}
		};
		var atr = document.createAttribute("name");
		atr.nodeValue = "last-page";
		that.addClass(span,'last-page');
		span.setAttributeNode(atr);
	},
	onSequence: function(Table, col, e,stu,ViewState) {
		var _this = this;
		// 定义判断排序字段的一个标志位，数字排序(自己写)和字符排序(JavaScript内置函数)
		var SortAsNumber = true;
		// 定义放置需要排序的行数组
		var Sorter = [];
		for(var x = 1; x < Table.rows.length; x++) {
			Sorter[x - 1] = [Table.rows[x].cells[col].innerHTML, x];
			// 判断需要排序字段的类型，分为数字型和非数字型
			SortAsNumber = SortAsNumber && _this.IsNumeric(Sorter[x - 1][0]);
		}
		// 如果是数字型采用下面的方法排序
		if(SortAsNumber) {
			for(var x = 0; x < Sorter.length; x++) {
				for(var y = x + 1; y < Sorter.length; y++) {
					if(parseFloat(Sorter[y][0]) < parseFloat(Sorter[x][0])) {
						var tmp = Sorter[x];
						Sorter[x] = Sorter[y];
						Sorter[y] = tmp;
					}
				}
			}
		}
		// 如果是非数字型的可以采用内置方法sort()排序
		else {
			Sorter.sort();
		}
		if(ViewState[col]) {
			// JavaScript内置函数，用于颠倒数组中元素的顺序。
			Sorter.reverse();
			ViewState[col] = false;
			_this.addClass(Table.rows[0].cells[col].lastChild, 'SortAscCss');
			_this.removeClass(Table.rows[0].cells[col].lastChild, 'SortDescCss');
			if(stu==1){		
				_this.addClass(e.lastChild, 'SortAscCss');
				_this.removeClass(e.lastChild, 'SortDescCss');
			}
		} else {
			ViewState[col] = true;
			_this.addClass(Table.rows[0].cells[col].lastChild, 'SortDescCss');
			_this.removeClass(Table.rows[0].cells[col].lastChild, 'SortAscCss');
			_this.removeClass(Table.rows[0].cells[col].lastChild, 'NormalCss');
			if(stu==1){		
				_this.addClass(e.lastChild, 'SortDescCss');
				_this.removeClass(e.lastChild, 'SortAscCss');
				_this.removeClass(e.lastChild, 'NormalCss');
			}
		}
		var Rank = [];
		for(var x = 0; x < Sorter.length; x++) {
			Rank[x] = _this.GetRowHtml(Table.rows[Sorter[x][1]]);
		}
		for(var x = 1; x < Table.rows.length; x++) {
			for(var y = 0; y < Table.rows[x].cells.length; y++) {
				Table.rows[x].cells[y].innerHTML = Rank[x - 1][y];
			}
		}
		_this.OnSorted(Table.rows[0].cells[col],ViewState[col]);
	},
	//选择事件处理方法
	onlikecheck: function(Table, col, curPage, pageSize, tar) {
		var _this = this;
		var status = _this.par.TreeStatus;
		if(status == true) {
			var setArry=[];
			//var father=tar.getAttribute("data-father");
			//var grade= father.split("-");
			var cbox = tar.parentNode.getElementsByTagName('input')[0];
			var obj = tar.parentNode.parentNode.parentNode;
			var id = cbox.value; //获取checkbox值
			var tree = Table.rows[col].getAttribute("data-tree"); //获取设置树状图参数
			var valuelist= Table.rows[col].getAttribute("data-value"); //设置参数
			addLoadListener(_this.btnclick);
			this.btnclick(Table, id, obj, tree, cbox, curPage, pageSize,cbox.parentNode);
			var n = Table.querySelectorAll(".sys-table-selected").length;
			var t = Table.rows.length - 1;
			var checkbox = Table.rows[0].cells[0].getElementsByTagName('input')[0];
			if(n == t) {
				checkbox.checked = true;
			} else if((t - n) <= n) {
				checkbox.checked = false;
			}
			var fid = obj.getAttribute('data-fid');
			var level=obj.getAttribute("data-level");
			if(level==0) {
				var child = "father" + fid;
				var initial=0
			} else {
				var initial=level
				var child ="child"+(parseInt(level)+1);
			}
			var sequence=obj.getAttribute("data-father")
			var ST=sequence.split("-");
			var SK=ST.length;
			for(var x = 1; x < Table.rows.length; x++) {
				var father=Table.rows[x].getAttribute("data-father");
				var grade= father.split("-");	
					if(grade.length>=ST.length){
						var TT="";
						for(var s = 0; s < ST.length; s++) {
							if(grade[s]==ST[s]){
								TT+=grade[s]+"-"
							}
							var batchDeletes = TT.substring(0, TT.lastIndexOf('-'));
						}
						if(batchDeletes==sequence){	
							if(cbox.checked==true){
								var zcbox = Table.rows[x].cells[0].getElementsByTagName('input')[0];
								zcbox.checked = true;
								_this.Attributes(zcbox,"checked",true);
								_this.addClass(Table.rows[x], 'sys-table-selected');
							}else{
								var zcbox = Table.rows[x].cells[0].getElementsByTagName('input')[0];
								zcbox.checked = false;
								_this.Attributes(zcbox,"checked",false);
								_this.removeClass(Table.rows[x], 'sys-table-selected');
							}
						}
					}
							
			}	
		} else {
			for(var x = 0; x < Table.rows[0].cells.length; x++) {
				var checkbox = Table.rows[0].cells[x].getElementsByTagName('input')[x];
				if(checkbox) {
					if(checkbox.checked == true) {
						checkbox ? checkbox.checked = false : '';
					}
				}
				var zcheckbox = Table.rows[col].cells[0].getElementsByTagName('input')[x];
				if(zcheckbox) {
					if(zcheckbox.checked == true) {
						_this.addClass(Table.rows[col], 'sys-table-selected');
					} else if(zcheckbox.checked == false) {
						_this.removeClass(Table.rows[col], 'sys-table-selected');
					}
					for(var x = 1; x < Table.rows.length; x++) {
						var n = Table.querySelectorAll(".sys-table-selected").length;
						var t = Table.rows.length - 1;
						if(n == t) {
							checkbox ? checkbox.checked = true : '';
						}
					}
				}
			}
		}
	},
	//全选处理方法
	oncheckbox: function(Table, col) {
		var _this = this;
		for(var x = 1; x < Table.rows.length; x++) {
			var checkbox = Table.rows[x].cells[col].getElementsByTagName('input')[col];
			if(checkbox) {
				for(var y = 0; y < Table.rows[0].cells.length; y++) {
					var checkboxs = Table.rows[0].cells[y].getElementsByTagName('input')[y];
					if(checkboxs) {
						if(checkboxs.checked == false) {
							checkbox ? checkbox.checked = false : '';
							_this.removeClass(Table.rows[x], 'sys-table-selected');
						} else {
							checkbox.checked = true;
							_this.addClass(Table.rows[x], 'sys-table-selected');
						}
					}
				}
			}
		}
	},
	//表格拖拽鼠标指针点击时发生
	Dragdrop: function(e, Table, tTD, obj,_this) {
		var col = obj.cellIndex;
		if(tTD == undefined)  tTD = obj;
		if(e.offsetX > tTD.offsetWidth - 10) {
			tTD.mouseDown = true;
			tTD.oldX = e.x;
			tTD.oldWidth = tTD.offsetWidth;
		}
		tTD.onmouseup = function(e) {
			_this.onmouseupDrop(e, Table, tTD, this,_this);
		}
	},
	//表格拖拽鼠标按键被松开时发生
	onmouseupDrop: function(e, Table, tTD, obj) {
		var col = obj.cellIndex;
		if(tTD == undefined) tTD = obj;
		tTD.mouseDown = false;
		tTD.style.cursor = 'default';
	},
	//表格拖拽鼠标指针移动时发生
	onmousemoveDrop: function(e, Table, tTD, obj,_this) {
		var col = obj.cellIndex;
		var TW=Table.offsetWidth;
		//更改鼠标样式
		if(e.offsetX > Table.rows[0].cells[col].offsetWidth - 5) {
			Table.rows[0].cells[col].style.cursor = 'col-resize';
		} else {
			Table.rows[0].cells[col].style.cursor = 'default';
		}
		//取出暂存的Table Cell
		if(tTD == undefined) tTD = obj;
		//调整宽度
		var ZT=function(W){
			while(Table.tagName != 'TABLE') Table = Table.parentElement;
			for(j = 0; j < Table.rows.length; j++) {
				Table.rows[j].cells[tTD.cellIndex].width =W;
			}	
		}
		if(tTD.mouseDown != null && tTD.mouseDown == true) {
			var TX=tTD.oldX-tTD.offsetWidth;
			tTD.width=tTD.offsetWidth
			tTD.style.cursor = 'default';
			if(tTD.width<=80){
				tTD.width =80;
				ZT(tTD.width)
			}else{
				if(tTD.oldWidth + (e.x - tTD.oldX) > 0)
			  	tTD.width = tTD.oldWidth + (e.x - tTD.oldX);
				//调整列宽
				//tTD.style.width = tTD.width;
				tTD.style.cursor = 'col-resize';
				//调整该列中的每个Cell
				table = tTD;
				ZT(tTD.width)
			}
		}
		tTD.onmouseup = function(e) {
			_this.onmouseupDrop(e, Table, tTD, this,_this);
		}
	},
	// 取得指定行的内容.
	GetRowHtml: function(row) {
		var result = [];
		for(var x = 0; x < row.cells.length; x++) {
			result[x] = row.cells[x].innerHTML;
		}
		return result;
	},
	OnSorted: function(cell, IsAsc) {
		return;
	},
	IsNumeric: function(num) {
		return /^\d+(\.\d+)?$/.test(num);
	}
};
(function(w) {
	/**
	 * map遍历数组
	 * @param fn [function] 回调函数；
	 * @param context [object] 上下文；
	 */
	Array.prototype.myMap = function(fn, context) {
		context = context || window;
		var ary = [];
		if(Array.prototype.map) {
			ary = this.map(fn, context);
		} else {
			for(var i = 0; i < this.length; i++) {
				ary[i] = fn.apply(context, [this[i], i, this]);
			}
		}
		return ary;
	};
	Array.prototype.indexValue = function (arr) {
	  	for (var i = 0; i < this.length; i++) {
		    if (this[i] == arr) {
		      return i;
		    }
	  	}
	}
	if(!Array.prototype.some) {
	    Array.prototype.some = function(callback) {
		    // 获取数组长度
		    var len = this.length;
		    if(typeof callback != "function") {
		        throw new TypeError();
		    }
		    // thisArg为callback 函数的执行上下文环境
		    var thisArg = arguments[1];
		    for(var i = 0; i < len; i++) {
		        if(i in this && callback.call(thisArg, this[i], i, this)) {
		            return true;
		        }
		    }
		    return false;
	    }
	}
   if(!Array.prototype.lastIndexOf){
	    Array.prototype.lastIndexOf = function(el,star){
	    for (var i=(star||0),n=this.length; i<n; i++){
	        if (this[i] === el){
	            return i;
	        }
	    }
	    return -1;
	     }  
	}
	/*
	 * 鼠标移入移除方法
	 */
	var dqMouse = function(obj) {
		// 函数体
		return new dqMouse.fn.init(obj);
	}
	dqMouse.fn = dqMouse.prototype = {
		// 扩展原型对象
		obj: null,
		dqMouse: "1.0.0",
		init: function(obj){
			this.obj = obj;
			return this;
		},
		contains: function(a, b) {
			return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
		},
		getRelated: function(e) {
			var related;
			var type = e.type.toLowerCase(); //这里获取事件名字
			if(type == 'mouseover') {
				related = e.relatedTarget || e.fromElement
			} else if(type = 'mouseout') {
				related = e.relatedTarget || e.toElement
			}
			return related;
		},
		over: function(fn) {
			var obj = this.obj;
			var _self = this;
			obj.onmouseover = function(e) {
				var related = _self.getRelated(e);
				if(this != related && !_self.contains(this, related)) {
					fn(_self);
				}
			}
			return _self;
		},
		out: function(fn) {
			var obj = this.obj;
			var _self = this;
			obj.onmouseout = function(e) {
				var related = _self.getRelated(e);
				if(obj != related && !_self.contains(obj, related)) {
					fn(_self);
				}
			}
			return _self;
		}
	}
	dqMouse.fn.init.prototype = dqMouse.fn;
	window.dqMouse = window.$$ = dqMouse;    
})(window);
