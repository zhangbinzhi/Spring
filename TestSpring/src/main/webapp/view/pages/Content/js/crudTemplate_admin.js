$.fn.crudTemplate = function (templateOptions) {
    return this.each(function () {
        var p = $.extend(true, {
            colModel: [],
            postTable:"",
            pColumnsWidth: 100,
            tColumns: [],
            pType: $("#search-type-" + this.id),
            pColumns: $("#search-columns-" + this.id),
            pOperators: $("#search-operators-" + this.id),
            pData: $("#search-data-" + this.id),
            SearchArea: "",
            searchToolbar: "",
            SimpleTable: "",
            callBackPager: "",
            uploadForm: "",
            uploadInput: "",
            timeKey: "",
            showChart:false,
            showToggle: true,
            isQuery: true,
            myTool: ".columns-right",
            layDate: {
                elem: '#search-data-' + this.id,
                format: 'YYYY/MM/DD',
                istime: false,
                istoday: true,
            },

            pageRows: 5,//每页行数
            keyValue: "",//主键列 主键名
            keyType: "",//主键类型 [string/number/time]

            postUrl: "",//请求数据地址
            delUrl: "",//删除地址
            exportUrl: "",//导出地址
            importUrl: "",//导入地址
            exportTempUrl: "",//导出模版地址
            addUrl: "",//新增地址
            editUrl: "",//编辑地址
            displayRedio:false,

            //构建插件
            BuildTable: function (m) {
                var mt = "#" + m;
                //查询条件呈现区域
                p.SearchArea = mt + "-SearchArea";
                $(mt).append("<ul id=\"" + m + "-SearchArea" + "\" class=\"tag-list\" style=\"padding: 0; display: table-cell;\"></ul>");
                //左侧查询工具条
                p.searchToolbar = mt + "-searchToolbar";
                $(mt).append("<div class=\"hidden-xs\" role=\"group\"><span id=\"" + m + "-searchToolbar\" ></span></div>");
                p.SimpleTable = mt + "-SimpleTable";
                $(mt).append("<table class=\"table-striped\" id=\"" + m + "-SimpleTable\" data-height=\"100\" data-mobile-responsive=\"true\"></table>");
                p.callBackPager = mt + "-callBackPager";
                $(mt).append("<div class=\"fixed-table-pagination\">" +
                    "<div class=\"pull-left pagination-detail\"><span class=\"pagination-info\"></span></div>" +
                    "<div id=\"" + m + "-callBackPager\" class=\"pull-right pagination\"></div>" +
                    "</div>");
                p.uploadForm = mt + "-UploadForm";
                p.uploadInput = m + "-UploadInput";
                $(mt).append("<form id=\"" + m + "-UploadForm\" action=\"\" method=\"post\" enctype=\"multipart/form-data\">" +
                    "<input name=\"file\" type=\"file\" multiple=\"\" id=\"" + m + "-UploadInput\" style=\"display: none\" /></form>");
                $(p.uploadForm).submit(function () {
                    var options = {
                        url: p.importUrl,
                        type: "post",
                        success: function (data) {
                            if (data.status === "success") {
                                swal({
                                    title: "导入成功!",
                                    type: "success"
                                });
                            } else {
                                swal("导入出现错误!", data.msg, "error");
                            }
                        }
                    };
                    $(this).ajaxSubmit(options);
                    return false;
                });
            },
            //验证新增编辑表单
            VerifyInput: function (value, type, op) {
                if (value === "" && op !== "nu" && op !== "nn") {
                    alert("不能输入空值");
                    return false;
                } else if (type === "number" && op !== "in" && op !== "ni" && isNaN(value)) {
                    alert("必须是数字类型");
                    return false;
                }
                return true;
            },
            //**
            //* 构建SQL 不在前台实现 此为示例
            //* @param {} col 列名
            //* @param {} op 等式符号 = > < != 等
            //* @param {} val 值
            //* @param {} ctype 值类型 [string/number/time] 字符串或者数字 string or number or time
            //* @param {} dtype 表达式类型 [And/Or]
            //* @returns {} 
            //*/
            FormulaToSql: function (col, op, val, ctype, dtype) {
                var v = ctype === "number" ? val : "'" + val + "'";
                switch (op) {
                    case "eq": return " " + dtype + " " + col + " = " + v;//等于
                    case "ne": return " " + dtype + " " + col + " != " + v;//不等于
                    case "lt": return " " + dtype + " " + col + " < " + v;//小于
                    case "le": return " " + dtype + " " + col + " <= " + v;//小于等于
                    case "gt": return " " + dtype + " " + col + " > " + v;//大于
                    case "ge": return " " + dtype + " " + col + " >= " + v;//大于等于
                    case "bw": return " " + dtype + " " + col + " like '" + val + "%' ";//开始于
                    case "bn": return " " + dtype + " " + col + " not like '" + val + "%' "; //不开始于
                    case "in": //属于
                        v = "";
                        if (ctype !== "number") {
                            var arr = val.split(',');
                            $(arr).each(function (index, item) {
                                v += "'" + item + "'";
                                if (index !== arr.length - 1) {
                                    v += ",";
                                }
                            });
                        } else {
                            v = val;
                        }
                        return " " + dtype + " " + col + " in (" + v + ") ";
                       
                    case "ni": //不属于 "NOT IN";
                        v = "";
                        if (ctype !== "number") {
                            var arr = val.split(',');
                            $(arr).each(function (index, item) {
                                v += "'" + item + "'";
                                if (index !== arr.length - 1) {
                                    v += ",";
                                }
                            });
                        } else {
                            v = val;
                        }
                        return " " + dtype + " " + col + " not in (" + v + ") ";//不属于 "NOT IN";
                    case "ew": return " " + dtype + " " + col + " like '%" + val + "' ";//结束于
                    case "en": return " " + dtype + " " + col + " not like '%" + val + "' ";//不结束 "NOT EndsWith";
                    case "cn": return " " + dtype + " " + col + " like '%" + val + "%' "; //包含 "Contains";
                    case "nc": return " " + dtype + " " + col + " not like '%" + val + "%' "; //不包含 DoesNotContain
                    case "nu": return " " + dtype + " " + col + " is null "; //不存在 "NULL";
                    case "nn": return " " + dtype + " " + col + " is not null "; //存在 "NOT NULL";
                }
            },
            //构建条件表达式
            OutPutSql: function () {
                var sql = " 1=1";
                $("li[data-item=\"search-li\"]").each(function () {
                    var col = $(this).attr("data-column");
                    var op = $(this).attr("data-operators");
                    var val = $(this).attr("data-val");
                    var ctype = $(this).attr("data-ctype");
                    var dtype = $(this).attr("data-type");
                    sql += p.FormulaToSql(col, op, val, ctype, dtype);
                });
                
                if(p.isQuery) {
                if ($("#start").val() !== "" && $("#start").val() !== undefined) {
                    sql += " and " + p.timeKey + " >= '" + $("#start").val() + "'";
                }
                if ($("#end").val() !== "" && $("#end").val() !== undefined) {
                    sql += " and " + p.timeKey + " <= '" + $("#end").val() + "'";
                }}
                return sql;
            },
            //清除条件区域
            ClearHandler: function () {
                $(p.SearchArea).html("");
            },
            //提交查询
            PostHandler: function () {
                p.SendPost(p.OutPutSql(), 1);
            },
            //克隆增加
            CloneInsertHandler: function (row) {
                for (var x in row) {                	
                    $(".fixed-table-form input[name='" + x + "']").val(row[x]);
                }
                $(".fixed-table-form").show();
                $(".crud-template-wrap").hide();
            },
            //编辑
            EditHandler: function (row) {
                for (var x in row) {    
                	if(x == "USERNAME"){
                		$(".fixed-table-form input[name='" + x + "']").attr("readonly",""); 
                	}                	
                    $(".fixed-table-form input[name='" + x + "']").val(row[x]);
                }
                $(".fixed-table-form").show();
                $(".crud-template-wrap").hide();
            },
            //批量删除
            DeleteAllHandler: function () {
                var where = p.OutPutSql();
                var url = this.delUrl;
                swal({
                    title: "提示",
                    text: "是否清空数据!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "是的,确定清空!",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                }, function () {
                    $.ajax({
                        url: url,
                        type: "post",
                        dataType: 'json',//here
                        headers: {                           
                            "Authorization":token
                        },
                        data: { table: p.postTable, where: "" },
                        success: function (data) {
                            if (data.status === "success") {
                                swal({ title: "删除成功!", type: "success", showConfirmButton: true, timer: 500 }, function () {
//                                    location.reload();
                                	showUsers();
                                });
                            } else {
                                swal("删除出现错误!", "请检查数据", "error");
                            }
                        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        	if("Unauthorized" == errorThrown){
                        		swal("删除出现错误!", textStatus, "登录信息已过期，请重新登录");
                        	}else{
                        		swal("删除出现错误!", textStatus, "error");
                        	}       
                        }
                    });
                });
            },
            DeleteHandler: function (where) {
                var url = this.delUrl;
                //var keys = row[this.keyValue];
                swal({
                        title: "提示",
                        text: "是否删除所选数据!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "是的,确定删除!",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                    }, function() {
                        $.ajax({
                            url: url,
                            type: "post",
                            dataType: 'json',//here
                            data: { table: p.postTable, where: where },
                            headers: {                           
                                "Authorization":token
                            },
                            success: function(data) {
                                if (data.status === "success") {
                                    swal({ title: "删除成功!", type: "success", showConfirmButton: true, timer: 500 }, function () {
//                                      location.reload();
                                  	showUsers();
                                  });
                                } else {
                                    swal("删除出现错误!", "请检查数据", "error");
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                            	if("Unauthorized" == errorThrown){
                            		swal("删除出现错误!", textStatus, "登录信息已过期，请重新登录");
                            	}else{
                            		swal("删除出现错误!", textStatus, "error");
                            	}                                
                            }
                        });
                    });
            },
            Import: function () {
                var inputElement = document.getElementById(p.uploadInput);
                inputElement.click();
            },
            UploadStart: function () {
                swal({
                    title: "操作提示",
                    text: "确定导入数据？",
                    type: "info",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                }, function () {
                    $(p.uploadForm).submit();
                });
            },
            SendPost: function (where, pageIndex) {                        	
                $(".fixed-table-loading").html("正在努力地加载数据中，请稍候……");
                $(p.SimpleTable).bootstrapTable('showLoading');
                var date1 = new Date();  //开始时间
                $.ajax({
                    url: p.postUrl,
                    type: "post",
                    dataType: 'json',//here
                    data: { table: p.postTable, "where": where, "pageIndex": pageIndex, "pageRows": p.pageRows },
                    headers: {                           
                        "Authorization":token
                    },
                    success: function (data) {
                        if (pageIndex === 1) {
                            $(p.callBackPager).extendPagination({
                                totalCount: data.totalRows,
                                showCount: 2,
                                limit: data.pageRows,
                                callback: function (curr, limit, totalCount) {
                                    p.SendPost(p.OutPutSql(), curr);
                                }
                            });
                        }
                        if (data.status === "fail") {
                            $(".fixed-table-loading").html("加载数据出现异常:" + data.msg);
                            $("span.pagination-info").html("未查询到数据");
                        } else {                        
                            $(p.SimpleTable).bootstrapTable('load', data.items);
                            var date2 = new Date();     //结束时间
                            var date3 = date2.getTime() - date1.getTime();   //时间差的毫秒数
                            if (data.items.length > 0) {
                                $("span.pagination-info").html("当前第" + data.pageIndex + "/" + data.totalPages + "页, 总共" + data.totalRows + "条记录, 每页显示" + p.pageRows + "条记录, 响应时间: " + date3 + "毫秒");
                            } else {
                                $("span.pagination-info").html("未查询到数据");
                            }
                            $(p.SimpleTable).bootstrapTable('hideLoading');
                        }

                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    	if("Unauthorized" == errorThrown){                    
                    		$(".fixed-table-loading").html("加载数据出现异常:" + textStatus+"登录信息已过期，请重新登录");
                    	}else{
                    		$(".fixed-table-loading").html("加载数据出现异常:" + textStatus+errorThrown);
                    	}       
                        
                    }
                });
            },
            //增加查询条件
            AddHandler: function () {
                if (p.SearchArea != null) {
                    var pData = $.trim($(p.pData.selector).val());
                    var pColumns_text = $.trim($(p.pColumns.selector).find("option:selected").text());
                    var pColumns_value = $.trim($(p.pColumns.selector).find("option:selected").val());
                    var pColumns_type = $.trim($(p.pColumns.selector).find("option:selected").attr("data-type"));
                    var pOperators_text = $.trim($(p.pOperators.selector).find("option:selected").text());
                    var pOperators_value = $.trim($(p.pOperators.selector).find("option:selected").val());
                    if (!p.VerifyInput(pData, pColumns_type, pOperators_value)) {
                        return false;
                    }
                    var ptype_text = $.trim($(p.pType.selector).find("option:selected").text());
                    var ptype_value = $.trim($(p.pType.selector).find("option:selected").val());

                    var li = $("<li data-item=\"search-li\" " +
                        "data-type=\"" + ptype_value + "\" " +
                        "data-column=\"" + pColumns_value + "\" " +
                        "data-operators=\"" + pOperators_value + "\" " +
                        "data-val=\"" + pData + "\" " +
                        "data-ctype=\"" + pColumns_type + "\" " +
                        "><span class=\"left\">" + ptype_text + "</span></li>");
                    var lir = $("<span class=\"right\"></span>");
                    li.append(lir);
                    var spt = "「" + pData + "」";
                    if (pOperators_value === "nu" || pOperators_value === "nn") {
                        spt = "";
                    }

                    var lit = $("<span>「" + pColumns_text + "」" + pOperators_text + spt + "</span>");
                    var lii = $("<i class=\"fa fa-close\"></i>");
                    $(lii, this).bind('click', function () {
                        $($(this).parent().parent()).remove();
                    });
                    lir.append(lit);
                    lir.append(lii);
                    $(p.SearchArea).append(li);
                    $(p.pData.selector).val("");
                }
            },
        }, templateOptions);
        //Build Table 
        //---------------------
        p.BuildTable(this.id);
       //增加表单之前判断表单是否已经存在，若已经存在则不再增加
        if($("#fixedTable").length <= 0 ){
        	  var fixedTable = "<div id = \"fixedTable\" class=\"form-horizontal\">" +
              "<form class=\"fixed-table-form\" target=\"_self\"></form>" +
              "</div>";
        	 $(this).parent().parent().append(fixedTable);
        }       
        var inputElement = document.getElementById(p.uploadInput);
        inputElement.addEventListener("change", function () {
            p.UploadStart();
        }, false);

        // add data to search-type
        // ---------------------------------
        var st = $(" <select id=\"search-type-" + this.id + "\" class=\"form-control m-r\" style=\"float: left; width: 60px;\">" +
            "<option value=\"and\" selected=\"selected\">且</option>" +
            "<option value=\"or\">或</option>" +
            "</select>");
        // add data to search-columns
        // ---------------------------------
      
        var sc = $(" <select id=\"search-columns-" + this.id + "\" class=\"form-control m-r\" style=\"float: left; width: " + p.pColumnsWidth + "px;\"></select>");
 
        $(sc).change(function () {
            LoadOpItems($(this).children('option:selected').attr("data-type"), opid);
        });
        if(p.displayRedio) {
            p.tColumns.push({
                field: 'state',
                radio: true
            });
        }
        if(!p.isQuery) { // 查询时不要加
        p.tColumns.push({
            field: 'state',
            checkbox: true
        });
        }
        p.tColumns.push({
            field: 'Number',
            title: '行号',
            align: 'center',
            formatter: function (value, row, index) {
                //return index + 1;
                var pageIndx = $(".pagination li.active a").html() === undefined ? 1 : Number($(".pagination li.active a").html());
                return p.pageRows * (pageIndx - 1) + index + 1;
            }
        });
        $(".fixed-table-form").html("");
        $(p.colModel).each(function (index, item) {
            var selected = index === 0 ? "selected=\"selected\"" : "";
            if (item.searchable == undefined || item.searchable === true) {
            $(sc).append("<option value=\"" + item.name + "\" data-type=\"" + item.type + "\"" + selected + ">" + item.text + "</option>");
            }
            p.tColumns.push({
                field: item.name,
                title: item.text,
                width: item.width
            });
            // add row to table
            var _key = "";
            if (item.keyValue != undefined && item.keyValue === true) {
                _key = "data-key=\"true\""; 
                
//                if(!p.isQuery) {
//                    _key+= "readonly=\"\""; // 查询时不要加;
//                }
            }
            var _required = "";
            if (item.required != undefined && item.required === true) {
                _required = "required=\"\"";
            }
            var row = "<div class=\"form-group\">" +
                "       <label class=\"col-sm-3 control-label\">" + item.text + "：</label>" +
                "       <div class=\"col-sm-6\">" +
                "           <input type=\"text\" " + _required + " " + _key + " class=\"form-control\" data-type=\"" + item.type + "\" name=\"" + item.name + "\" placeholder=\"请输入" + item.text + "...\">" +
                "       </div>" +
                "      </div>";
//            console.log( "<input type=\"text\" " + _required + " " + _key + " class=\"form-control\" data-type=\"" + item.type + "\" name=\"" + item.name + "\" placeholder=\"请输入" + item.text + "...\">" );
            $(".fixed-table-form").append(row);

        });
        $(".fixed-table-form").append("<div class=\"hr-line-dashed\"></div>");
        $(".fixed-table-form").append("<input type=\"hidden\" id=\"EditType\">");

        $(".fixed-table-form").validate({
            submitHandler: function (form) {
                swal({
                    title: "提示",
                    text: "是否确认提交!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "是的,确定提交!",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                }, function () {
                    var tp = $("#EditType").val();
                    var addItems = [];
                    var addCol = "";
                    var addVal = "";
                    var setVal = "";
                    var datas = {};
                    datas['table'] = p.postTable;
                    $(".fixed-table-form input[id!='EditType']").each(function() {

                        if ($(this).val() !== "") {
                            addCol += $(this).attr("name") + ",";
                            if ($(this).attr("data-type") !== "number") {
                                addVal += "'" + $(this).val() + "',";
                            } else
                                addVal += $(this).val() + ",";
                            datas[$(this).attr("name")] =$(this).val(); 
                        }

                        if ($(this).attr("data-type") !== "number") {
                            setVal += " " + $(this).attr("name") + "=" + "'" + $(this).val() + "',";
                        } else
                            setVal += " " + $(this).attr("name") + "=" + $(this).val() + ",";
                    });
                    addCol = addCol.substring(0, addCol.length - 1);
                    addVal = addVal.substring(0, addVal.length - 1);
                    setVal = setVal.substring(0, setVal.length - 1);
                    if (tp === "增加") {
                        var addWhere = " (" + addCol + ") values(" + addVal + ")";
                        $.ajax({
                            url: p.addUrl,
                            type: "post",
                            dataType: 'json',//here
                            data: datas,
                            headers: {                           
                                "Authorization":token
                            },
                            success: function (data) {
                                if (data.status === "success") {
                                    swal({ title: "保存成功!", type: "success", showConfirmButton: true, timer: 500 }, function () {
//                                        location.reload();
//                                    	$(".fixed-table-form").html("");
                                    	showUsers();
                                    });
                                } else {
                                    swal("保存出现错误!", "请检查数据", "error");
                                }
                            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                            	if("Unauthorized" == errorThrown){
                            		swal("删除出现错误!", textStatus, "登录信息已过期，请重新登录");
                            	}else{
                            		swal("删除出现错误!", textStatus, "error");
                            	}       
                            }
                        });
                    } else if (tp === "修改") {
                        var column = $(".fixed-table-form input[data-key='true']").attr("name");
                        var value = $(".fixed-table-form input[data-key='true']").val();
                        var type = $(".fixed-table-form input[data-key='true']").attr("data-type");
                        var where = "";
                        if (type !== "number") {
                            where = " " + column + "=" + "'" + value + "'";
                        } else
                            where = " " + column + "=" + value;
                        datas['where'] = where;
                        $.ajax({
                            url: p.editUrl,
                            type: "post",
                            dataType: 'json',
                            data:datas,
                            headers: {                           
                                "Authorization":token
                            },
                            success: function (data) {
                                if (data.status === "success") {
                                    swal({ title: "保存成功!", type: "success", showConfirmButton: true, timer: 500 }, function () {
//                                        location.reload();
                                    	showUsers();
                                    });
                                } else {
                                	swal({ title: "保存失败!", type: "error",text: "登录信息已过期，请重新登录", showConfirmButton: true, timer: 500 }, function () {
                                      location.reload();
                                  });
                                }
                            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                            	if("Unauthorized" == errorThrown){
                            		swal("删除出现错误!", textStatus, "登录信息已过期，请重新登录");
                            	}else{
                            		swal("删除出现错误!", textStatus, "error");
                            	}       
                            }
                        });
                    }
                });
            }
        });

        var fg = $("<div class=\"form-group\"></div>");
        var fgb = $("<div class=\"col-sm-10 col-sm-offset-3\"></div>");
        $(fg).append(fgb);
        var fgbs = $("<button class=\"btn btn-primary m-r\" type=\"submit\">保存内容</button>");
        var fgbc = $("<span class=\"btn btn-primary\">取消</span>");
        $(fgb).append(fgbs);
        $(fgb).append(fgbc);
        $(fgbc, this).bind('click', function () {
            $(".fixed-table-form").hide();
            $(".crud-template-wrap").show();
        });
        $(".fixed-table-form").append(fg);

        $(p.SimpleTable).bootstrapTable({
            columns: p.tColumns,
            iconSize: 'outline',
            cache: false,
            showToggle: p.showToggle,
            singleSelect: false,
            showColumns: true,
            height: "100%",
            toolbar: p.searchToolbar,
            icons: {
                refresh: 'glyphicon-repeat',
                toggle: 'glyphicon-list-alt',
                columns: 'glyphicon-list'
            }
        });
        $(p.colModel).each(function (index, item) {
            if(item.hideColumn) {
                $(p.SimpleTable).bootstrapTable('hideColumn', item.name);
            }
        });
        // add data to search-operators
        // ---------------------------------
        var so = $(" <select id=\"search-operators-" + this.id + "\" class=\"form-control m-r\" style=\"float: left; width: 75px;\">" +
            "<option value=\"eq\">等于　　</option>" +
            "<option value=\"ne\">不等　　</option>" +
            "<option value=\"lt\">小于　　</option>" +
            "<option value=\"le\">小于等于</option>" +
            "<option value=\"gt\">大于　　</option>" +
            "<option value=\"ge\">大于等于</option>" +
            "<option value=\"bw\">开始于</option>" +
            "<option value=\"bn\">不开始于</option>" +
            "<option value=\"ew\">结束于</option>" +
            "<option value=\"en\">不结束于</option>" +
            "<option value=\"in\">存在于</option>" +
            "<option value=\"ni\">不存在于</option>" +
            "<option value=\"cn\" selected=\"selected\">包含　　</option>" +
            "<option value=\"nc\">不包含</option>" +
            "<option value=\"nu\">等于空值</option>" +
            "<option value=\"nn\">非空值</option>" +
            "</select>");
        // add data to search-data
        // ---------------------------------

        var table = null;
        var time = null;
        if( p.isQuery) { //查询时才有时间
            time = " <span class=\"input-daterange input-group m-r\" style=\"width: 250px; float: left;\">" +
                "<input type=\"text\" class=\"form-control\" id=\"start\" placeholder=\"开始时间\" />" +
                "<span class=\"input-group-addon\">到</span>" +
                "<input type=\"text\" class=\"form-control\" id=\"end\" placeholder=\"结束时间\" />" +
                "</span>";
        }
        var sd = $("<input id=\"search-data-" + this.id + "\" type=\"text\" class=\"form-control layer-date m-r\" style=\"float: left; width: 150px;\" placeholder=\"请输入表达式值\">");

        var opid = "#search-operators-" + this.id;
        var columnsid = "#search-columns-" + this.id;
        $(sd, this).bind('click', function () {
            if ($(columnsid).children('option:selected').attr("data-type") === "time") {
                laydate(p.layDate);
            }
            //start.elem = this;
        });
        // add data to search-button
        // ---------------------------------
        var btngroup = $("<span class=\"btn-group\"></span>");
        var btnSa = $("<button  id=\"search-add-" + this.id + "\" type=\"button\" class=\"btn btn-outline btn-default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"\" data-original-title=\"增加查询条件\"><i class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></i></button>");
        //var btnSt = $("<button  id=\"search-temp-" + this.id + "\" type=\"button\" class=\"btn btn-outline btn-default\"><i class=\"glyphicon glyphicon-heart\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"增加查询条件\"></i></button>");
        var btnSr = $("<button  id=\"search-remove-" + this.id + "\" type=\"button\" class=\"btn btn-outline btn-default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"\" data-original-title=\"清空查询条件\"><i class=\"fa fa-eraser\" aria-hidden=\"true\"></i></button>");
        var btnPost = $("<button  id=\"search-post-" + this.id + "\" type=\"button\" class=\"btn btn-outline btn-default\"><i class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></i> &nbsp;查询 </button>");
        $(btngroup).append(btnSa);
        //$(btngroup).append(btnSt);
        $(btngroup).append(btnSr);
        $(btngroup).append(btnPost);

        $(btnSa, this).bind('click', function () {
            p.AddHandler();
        });
        $(btnSr, this).bind('click', function () {
            p.ClearHandler();
        });
        $(btnPost, this).bind('click', function () {
            if ($("li[data-item=\"search-li\"]").length === 0 && $.trim($(p.pData.selector).val()) !== "") {
                p.AddHandler();
            }
            p.PostHandler();
        });

        if (p.isQuery) {
            $(p.searchToolbar).append(time);
        }    

        $(p.searchToolbar).append(st);
        $(p.searchToolbar).append(sc);
        $(p.searchToolbar).append(so);
        $(p.searchToolbar).append(sd);
        $(p.searchToolbar).append(btngroup);

        if( p.isQuery) {
            //日期范围限制
            var start = {
                elem: '#start',
                format: 'YYYY-MM-DD',
                istime: false,
                istoday: false,
            };
            var end = {
                elem: '#end',
                format: 'YYYY-MM-DD',
                istime: false,
                istoday: false,
            };
            laydate(start);
            laydate(end);
        }
        var btnshow = $("<button id=\"" + this.id + "_showchart\" class=\"btn btn-default   btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"图表显示\"><i class=\"fa fa-bar-chart\"></i> 图表</button>");
        $(btnshow, this).bind('click', function () {
            var rows = $(p.SimpleTable).bootstrapTable('getSelections');
            if (rows.length === 0) {
                alert("请选择一行数据");
                return false;
            } else if (rows.length > 1) {
                alert("最多选择一行数据");
                return false;
            }
            showChart(rows);
        });

        var btn1 = $("<button id=\"" + this.id + "_addRow\" class=\"btn btn-default   btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"增加\"><i class=\"fa fa-file-o\"></i></button>");
        var btn2 = $("<button id=\"" + this.id + "_cloneRow\" class=\"btn btn-default   btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"克隆增加\"><i class=\"fa fa-copy\"></i></button>");
        var btn3 = $("<button id=\"" + this.id + "_edit\"  class=\"btn btn-default   btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"修改\"><i class=\"fa fa-pencil-square-o\"></i></button>");
        var btn4 = $("<button class=\"btn btn-default btn-outline  \" type=\"button\"  data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"删除\"><i class=\"fa fa-trash-o\"></i></button>");
        var btn8 = $("<button class=\"btn btn-default btn-outline  \" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"清表\"><i class=\"fa fa-trash\"></i></button>");
        var btn5 = $("<a id=\"" + this.id + "_export\" href=\"" + p.exportUrl + "\" class=\" btn btn-default btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"导出\"><i class=\"fa fa-cloud-download\"></i></a>");
        var btn6 = $("<button class=\"btn btn-default   btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"导入\"><i class=\"fa fa-cloud-upload\"></i></button>");
        var btn7 = $("<a href=\"" + p.exportTempUrl + "\" class=\"btn btn-default   btn-outline\" type=\"button\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"模板\"><i class=\"fa fa-file-excel-o\"></i></a>");
//        var btn9 = $("<button  id=\"export-post-" + this.id + "\" type=\"button\" class=\"btn btn-outline btn-default\"><i class=\"fa fa-cloud-download\" aria-hidden=\"true\"  data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"导出\"></i></button>");
        
        $(btn6, this).bind('click', function () {
            p.Import();
        });
        //--增加一行
        $(btn1, this).bind('click', function () {
            $("#EditType").val("增加");
            $(".fixed-table-form input[name='USERNAME']").removeAttr("readonly");
            $(".fixed-table-form").show();
            $(".crud-template-wrap").hide();
        });
        $(btn2, this).bind('click', function () {
            $("#EditType").val("增加");
            var rows = $(p.SimpleTable).bootstrapTable('getSelections');
            if (rows.length === 0) {
                alert("请选择一行数据");
                return false;
            } else if (rows.length > 1) {
                alert("最多选择一行数据");
                return false;
            }
            $(".crud-template-wrap").hide();
            p.CloneInsertHandler(rows[0]);
        });
        $(btn3, this).bind('click', function () {
            $("#EditType").val("修改");
            var rows = $(p.SimpleTable).bootstrapTable('getSelections');
            if (rows.length === 0) {
                alert("请选择一行数据");
                return false;
            } else if (rows.length > 1) {
                alert("最多选择一行数据");
                return false;
            }
            $(".crud-template-wrap").hide();
            p.EditHandler(rows[0]);
        });
        $(btn4, this).bind('click', function () {
            var rows = $(p.SimpleTable).bootstrapTable('getSelections');
            if (rows.length === 0) {
                alert("请选择至少一行数据");
                return false;
            }
            var keys = "";
            $(rows).each(function(index, item) {
                if (p.keyType != "number") {
                    keys += "'" + $(this)[0][p.keyValue] + "',";
                } else
                    keys += $(this)[0][p.keyValue] + ",";
            });
            keys = keys.substring(0, keys.length - 1);
            //[{"col":"CELLID","op":"in","val":"1,2,3,4","ctype":"string","dtype":"and"}]
            var str = " " + p.keyValue + " in (" + keys + ")";
            
            p.DeleteHandler(str);
        });
        $(btn8, this).bind('click', function () {
            p.DeleteHandler();
        });

        if (p.exportTempUrl !== "") {
            $(p.myTool).prepend(btn7);
        }
        if (p.showChart) {
            $(p.myTool).prepend(btnshow);
        }
        
//        $(p.myTool).prepend(btn5);//导出按钮始终都要显示                  
        if(p.isQuery){	//只有查询页面需要按照条件进行导出
        	btn5.click(function(){
        		var where = p.OutPutSql();
        		 var href =  Public.Host+"/webService/exportData?type=tableData&where="+where+"&table="+p.postTable;
        		 var finalURL = encodeURI(href)
         	      btn5.attr('href',finalURL);            	   
        	});  	       
      }
        
        if (!p.isQuery) { // 查询时不使用下面这些
//            $(p.myTool).prepend(btn6);
//            $(p.myTool).prepend(btn5);//导出按钮始终都要显示
//            $(p.myTool).prepend(btn8);
            $(p.myTool).prepend(btn4);
            $(p.myTool).prepend(btn3);
            $(p.myTool).prepend(btn2);
            $(p.myTool).prepend(btn1);
        }
        // $(".columns-right").insertBefore("<a>123</>");

        p.SendPost("", 1);
        LoadOpItems($(columnsid).children('option:selected').attr("data-type"), opid);
    });
};

//初始化表达式下拉框 
var LoadOpItems = function (dtype, id) {
    var arr = ["bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];
    if (dtype === "number") {
        $.each(arr, function (idx, value) {
            var op = id + " option[value='" + value + "']";
            $(op).hide();
        });
    } else {
        $.each(arr, function (idx, value) {
            var op = id + " option[value='" + value + "']";
            $(op).show();
        }); 
    }
}

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block m-b-none",
    validClass: "help-block m-b-none"
});

$(function () {
    // tooltips
    $('body').tooltip({
        selector: "[data-toggle=tooltip]",
        container: "body"
    });
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
});

/**
 * Created by Hope on 2014/12/28.
 */
(function ($) {
    $.fn.extendPagination = function (options) {
        var defaults = {
            //pageId:'',
            totalCount: '',
            showPage: '10',
            limit: '5',
            callback: function () {
                return false;
            }
        };
        $.extend(defaults, options || {});
        if (defaults.totalCount == '') {
            //alert('总数不能为空!');
            $(this).empty();
            return false;
        } else if (Number(defaults.totalCount) <= 0) {
            //alert('总数要大于0!');
            $(this).empty();
            return false;
        }
        if (defaults.showPage == '') {
            defaults.showPage = '10';
        } else if (Number(defaults.showPage) <= 0)defaults.showPage = '10';
        if (defaults.limit == '') {
            defaults.limit = '5';
        } else if (Number(defaults.limit) <= 0)defaults.limit = '5';
        var totalCount = Number(defaults.totalCount), showPage = Number(defaults.showPage),
            limit = Number(defaults.limit), totalPage = Math.ceil(totalCount / limit);
        if (totalPage > 0) {
            var html = [];
            html.push(' <ul class="pagination">');
            html.push(' <li class="previous"><a href="#">&laquo;</a></li>');
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');
            if (totalPage <= showPage) {
                for (var i = 1; i <= totalPage; i++) {
                    if (i == 1) html.push(' <li class="active"><a href="#">' + i + '</a></li>');
                    else html.push(' <li><a href="#">' + i + '</a></li>');
                }
            } else {
                for (var j = 1; j <= showPage; j++) {
                    if (j == 1) html.push(' <li class="active"><a href="#">' + j + '</a></li>');
                    else html.push(' <li><a href="#">' + j + '</a></li>');
                }
            }
            html.push('<li class="disabled hidden"><a href="#">...</a></li>');
            html.push('<li class="next"><a href="#">&raquo;</a></li></ul>');
            $(this).html(html.join(''));
            if (totalPage > showPage) $(this).find('ul.pagination li.next').prev().removeClass('hidden');

            var pageObj = $(this).find('ul.pagination'), preObj = pageObj.find('li.previous'),
                currentObj = pageObj.find('li').not('.previous,.disabled,.next'),
                nextObj = pageObj.find('li.next');

            function loopPageElement(minPage, maxPage) {
                var tempObj = preObj.next();
                for (var i = minPage; i <= maxPage; i++) {
                    if (minPage == 1 && (preObj.next().attr('class').indexOf('hidden')) < 0)
                        preObj.next().addClass('hidden');
                    else if (minPage > 1 && (preObj.next().attr('class').indexOf('hidden')) > 0)
                        preObj.next().removeClass('hidden');
                    if (maxPage == totalPage && (nextObj.prev().attr('class').indexOf('hidden')) < 0)
                        nextObj.prev().addClass('hidden');
                    else if (maxPage < totalPage && (nextObj.prev().attr('class').indexOf('hidden')) > 0)
                        nextObj.prev().removeClass('hidden');
                    var obj = tempObj.next().find('a');
                    if (!isNaN(obj.html()))obj.html(i);
                    tempObj = tempObj.next();
                }
            }

            function callBack(curr) {
                defaults.callback(curr, defaults.limit, totalCount);
            }
            currentObj.click(function (event) {
                event.preventDefault();
                var currPage = Number($(this).find('a').html()), activeObj = pageObj.find('li[class="active"]'),
                    activePage = Number(activeObj.find('a').html());
                if (currPage === activePage) return false;
                if (totalPage > showPage && currPage > 1) {
                    var maxPage = currPage, minPage = 1;
                    if (($(this).prev().attr('class'))
                        && ($(this).prev().attr('class').indexOf('disabled')) >= 0) {
                        minPage = currPage - 1;
                        maxPage = minPage + showPage - 1;
                        loopPageElement(minPage, maxPage);
                    } else if (($(this).next().attr('class'))
                        && ($(this).next().attr('class').indexOf('disabled')) >= 0) {
                        if (totalPage - currPage >= 1) maxPage = currPage + 1;
                        else  maxPage = totalPage;
                        if (maxPage - showPage > 0) minPage = (maxPage - showPage) + 1;
                        loopPageElement(minPage, maxPage)
                    }                  
                }
                activeObj.removeClass('active');
                $.each(currentObj, function (index, thiz) {
                    if ($(thiz).find('a').html() == currPage) {
                        $(thiz).addClass('active');
                        callBack(currPage);
                    }
                });
            });
            preObj.click(function (event) {
                event.preventDefault();
                var activeObj = pageObj.find('li[class="active"]'), activePage = Number(activeObj.find('a').html());
                if (activePage <= 1) return false;
                if (totalPage > showPage) {
                    var maxPage = activePage, minPage = 1;                  
                    if ((activeObj.prev().prev().attr('class'))
                        && (activeObj.prev().prev().attr('class').indexOf('disabled')) >= 0) {
                        minPage = activePage - 1;
                        if (minPage > 1) minPage = minPage - 1;
                        maxPage = minPage + showPage - 1;
                        loopPageElement(minPage, maxPage);
                    }
                }
                $.each(currentObj, function (index, thiz) {
                    if ($(thiz).find('a').html() == (activePage - 1)) {
                        activeObj.removeClass('active');
                        $(thiz).addClass('active');
                        callBack(activePage - 1);
                    }
                });
            });
            nextObj.click(function (event) {
                event.preventDefault();
                var activeObj = pageObj.find('li[class="active"]'), activePage = Number(activeObj.find('a').html());
                if (activePage >= totalPage) return false;
                if (totalPage > showPage) {
                    var maxPage = activePage, minPage = 1;                  
                    if ((activeObj.next().next().attr('class'))
                        && (activeObj.next().next().attr('class').indexOf('disabled')) >= 0) {
                        maxPage = activePage + 2;
                        if (maxPage > totalPage) maxPage = totalPage;
                        minPage = maxPage - showPage + 1;
                        loopPageElement(minPage, maxPage);
                    }
                }
                $.each(currentObj, function (index, thiz) {
                    if ($(thiz).find('a').html() == (activePage + 1)) {
                        activeObj.removeClass('active');
                        $(thiz).addClass('active');
                        callBack(activePage + 1);
                    }
                });
            });
        }
    };
})(jQuery);
