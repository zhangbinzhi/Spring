var ajax = function (sql) {
    return $.ajax({ url: Public.getRelationData, type: "post", dataType: 'json', data: { sql: sql } });
};
var ajaxRun = function (body) {
    return $.ajax({ url: Public.DoExecute, type: "post", dataType: 'json', data: body });
};
var ajaxFile = function (data) {
    return $.ajax({
        url: Public.exportJsonData2,
        type: "post",
        dataType: 'json',
        data: { jData : JSON.stringify(data)},
        success: function (data) {
            //alert("success!" + data.File);
            //window.open(data.File, "_blank");
			document.getElementById("dlink").href = data.File;
            document.getElementById("dlink").click();
        },
        error: function (data) {
            alert("fail!");
        }
    });
};
jQuery.fn.bootstrapTable.columnDefaults.valign = "middle";
jQuery.fn.bootstrapTable.columnDefaults.align = "center";
jQuery.fn.bootstrapTable.columnDefaults.rowspan = 1;
jQuery.fn.bootstrapTable.columnDefaults.colspan = 1;

var u = {
    renameKey: function(obj, prefix) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[prefix + key] = obj[key];
                delete obj[key];
            }
        }
        return obj;
    },
    parseNum: function(num, defaults) {
        if (isNaN(num)) {
            return defaults;
        }
        return num;
    },
    numberToUndefined: function(items) {
        _.each(items, function(item) {
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    if (typeof item[key] == 'number' && isNaN(item[key])) {
                        item[key] = undefined;
                    }
                }
            }
        });
        return items;
    },
    numberToF2: function(items) {
        _.each(items, function(item) {
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    if (typeof item[key] == 'number') {
                        if (isNaN(item[key])) {
                            item[key] = undefined;
                        } else {
                            item[key] = item[key].toFixed(4).replace(/(\.[0-9]*?)0+$/, "$1").replace(/\.$/, "")
                        }
                    }
                }
            }
        });
        return items;
    },
    periodToTime: function(period) {
        if (period === undefined) {
            return undefined;
        }
        return period.substr(0, 2) + ":00";
    },
    isHourSelected: function() {
        return $("#data_type").children('option:selected').val() == 1;
    },
    maxBy: function(items, key) {
        var max = _.maxBy(items, key);
        return max == undefined ? {} : max;
    },
    setMax: function(items, compareKey, newKey, maxItemKey) {
        var maxItem = this.maxBy(items, compareKey);
        if (maxItemKey === undefined) {
            maxItemKey = compareKey;
        }
        _.each(items, function(item) {
            item[newKey] = maxItem[maxItemKey]
        });
    },
    calcIncrease: function(current, past, sourceKey, targetKey) {
        if (current === undefined || past == undefined) {
            return;
        }
        past[targetKey] = current[sourceKey] / past[sourceKey] - 1;
    },
    validateDate: function() {
        var dataType = $("#data_type").children('option:selected').val();
        var message = undefined;
        if (dataType == 1) {
            var start = new Date($("#HOUR_BQ").val());
            var tq = new Date($("#HOUR_TQ").val());
            var sq = new Date($("#HOUR_SQ").val());
            if (start.toString() == 'Invalid Date') {
                message = "请选择时间";
            } else if ($("#HOUR_TQ").attr("id") != undefined && tq.toString() == 'Invalid Date') {
                message = "请选择同期时间";
            } else if ($("#HOUR_SQ").attr("id") != undefined && sq.toString() == 'Invalid Date') {
                message = "请选择上期时间";
            }
        } else if (dataType == 2) {
            var start = new Date($("#DAY_BQ_START").val());
            var end = new Date($("#DAY_BQ_END").val());
            var tqs = new Date($("#DAY_TQ_START").val());
            var sqs = new Date($("#DAY_SQ_START").val());

            if (start.toString() == 'Invalid Date') {
                message = "请选择时间";
            } else if ($("#DAY_BQ_END").attr("id") != undefined && end.toString() == 'Invalid Date') {
                message = "请选择结束时间";
            } else if ($("#DAY_TQ_START").attr("id") != undefined && tqs.toString() == 'Invalid Date') {
                message = "请选择同期时间";
            } else if ($("#DAY_SQ_START").attr("id") != undefined && sqs.toString() == 'Invalid Date') {
                message = "请选择上期时间";
            }
        }
        if (message !== undefined) {
            //window.alert(message);
            sweetAlert("出现错误", message, "error");
            return false;
        }
        return true;
    },
    validateHandWorkDate: function() {
        var message = undefined;
        var start = new Date($("#HOUR_BQ").val());
        if (start.toString() == 'Invalid Date') {
            message = "请选择时间";
        }

        if (message !== undefined) {
            //window.alert(message);
            sweetAlert("出现错误", message, "error");
            return false;
        }
        return true;
    },
    validateLTERBDate: function() {
        var message = undefined;
        var start = new Date($("#DATE_SELECTED").val());
        if (start.toString() == 'Invalid Date') {
            message = "请选择时间";
        }

        if (message !== undefined) {
            //window.alert(message);
            sweetAlert("出现错误", message, "error");
            return false;
        }
        return true;
    },
    validateGsmRBDate: function() {
        var message = undefined;
        var dateSelected = new Date($("#DATE_SELECTED").val());
        var startDateSelected = new Date($("#START_DATE_SELECTED").val());

        if($("#data_kpi").children('option:selected').val() === 'CELL'){
            if (dateSelected.toString() == 'Invalid Date') {
                message = "请选择日期";
            }
        }
        if ($("#data_kpi").children('option:selected').val() !== 'CELL' && $("#time_type").children('option:selected').val() == 2) { //天
            if (startDateSelected.toString() == 'Invalid Date') {
                message = "请选择开始日期";
            }
        }
        if ($("#data_kpi").children('option:selected').val() !== 'CELL' && $("#time_type").children('option:selected').val() == 1) { //天
            if (dateSelected.toString() == 'Invalid Date') {
                message = "请选择日期";
            }
        }

        if (message !== undefined) {
            //window.alert(message);
            sweetAlert("出现错误", message, "error");
            return false;
        }
        return true;
    }

}