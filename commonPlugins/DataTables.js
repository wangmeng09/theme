/**
 * JavaScript Document
 * @author zjfh-chenhz
 * @date 2017-3-20
 */

//默认配置
var tableConfig = {
    paging:false,//分页
    processing:true,//处理数据显示
    searching:false,//搜索框
    ordering:true,//排序
    autoWidth:true,//宽度自适应
//  		scrollCollapse:true,//高度自适应
    info:false,//是否显示页脚
    scrollX:true,//水平滚动
    scrollY:true,//垂直滚动
    order:[],//默认排序列，如果第一列为checkbox必须将此项置为空或指定其他列，否则第一列会出现排序图标
//  		scrollXInner:false,
//  		columnDefs:false
    oLanguage:{
        "sEmptyTable":"没有相关数据！",
        "sZeroRecords":"对不起，查询不到任何相关数据",
        "sProcessing":"数据努力加载中。。",
        "sLengthMenu":"每页显示  _MENU_ 条记录",
        "sInfo":"从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
        "oPaginate":{
            "sFirst":"首页",
            "sPrevious":"前一页",
            "sNext":"后一页",
            "sLast":"尾页"
        }
    }
}
//默认表格
var defualtTableForIE = '<table id="datatable" class="hover row-border nowrap" cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout:fixed"></table>';
var defualtTable = '<table id="datatable" class="hover row-border nowrap" cellpadding="0" cellspacing="0" border="0" width="100%" ></table>';


/**
 * @param colArray 存放用户配置列的数组
 * @param colObject 存放模板列的对象
 * @param dataList 数据集
 * @param config自定义配置对象
 */
jQuery.fn.renderDatatables = function(colArray,colObject,dataList,config,tableAttr) {
    //忽略错误警告提示
    $.fn.dataTable.ext.errMode = "none";


    var columns = new Array();
    for(var i=0;i<colArray.length;i++){
        var col = colObject[colArray[i][1]];
        if(col){
            //自定义字段
            if(colArray[i][0] && colArray[i][0] != ""){
                if(!col.title){
                    col.title = colArray[i][0];
                }
            }
            //时间字段设置默认长度
            if(colArray[i][1].toString().indexOf("Time") > 0 || colArray[i][1].toString().indexOf("Date") > 0){
                col.width = "150px";
            }
            if(colArray[i][2] && colArray[i][2] != ""){
                col.width = colArray[i][2] + "px";
            }
            columns.push(col);
        }else{
            columns.push({
                "class":"center",
                title: colArray[i][0],
                data:colArray[i][1]
            })
        }
    }

    var tableConfig1 = {
        paging:false,//分页
        processing:true,//处理数据显示
        searching:false,//搜索框
        ordering:true,//排序
        autoWidth:true,//宽度自适应
//	  		scrollCollapse:true,//高度自适应
        info:false,//是否显示页脚
        scrollX:true,//水平滚动
        scrollY:true,//垂直滚动
        order:[],//默认排序列，如果第一列为checkbox必须将此项置为空或指定其他列，否则第一列会出现排序图标
//	  		scrollXInner:false,
//	  		columnDefs:false
        oLanguage:{
            "sEmptyTable":"没有相关数据！",
            "sZeroRecords":"对不起，查询不到任何相关数据",
            "sProcessing":"数据努力加载中。。",
            "sLengthMenu":"每页显示  _MENU_ 条记录",
            "sInfo":"从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "oPaginate":{
                "sFirst":"首页",
                "sPrevious":"前一页",
                "sNext":"后一页",
                "sLast":"尾页"
            }
        }
    }
    //配置
    config = $.extend({},tableConfig1,config);
    config.data= dataList;
    config.columns = columns;
    config.rowCallback = rowCallbackFunction;
    config.drawCallback = drawCallbackFunction;
    config.headerCallback = headerCallbackFunction;


    var table = getTable(tableAttr);
    var id = '';
    $(this).html('');
    $(this).append(table);
    if((typeof table == 'string') && table.constructor == String){
        id = $(table).attr("id");
    }else{
        id = table.id;
    }
    var otable = $("#"+id).DataTable(config);
    //超链接样式
    $("#"+id+" tbody a").each(function(){
        if($(this).hasClass("f4") || $(this).hasClass("f1")){
            var thisColor = $(this).css("color");
            $(this).hover(function(){$(this).css({color:"#edc173",textDecoration:"underline"}) },function(){$(this).css({color:thisColor,textDecoration:"none"})});
        }
    });
    return otable;

}
//行回调
var rowCallbackFunction = function(row,data){
}
//绘制完毕回调
var drawCallbackFunction = function(settings){
}
//TH回调
var headerCallbackFunction = function(thead,data,start,end,display){
    $(thead).addClass("DTth");
}

/**
 * 提供自定义表格方法
 * 示例：      var tableAttr = [
 *	                 ["id","datatable"],
 *	                 ["class","hover row-border nowrap"],
 *	                 ["cellpadding","0"],
 *                   ["cellspacing","0"],
 *                   ["border","0"],
 *	                 ["width","100%"],
 *	                 ["style","table-layout:fixed"]
 *	                ];
 *
 */
function getTable(tableAttr){
    var html;
    if(tableAttr){
        var $tmp = $("<table></table>");
        for(var i=0;i<tableAttr.length;i++){
            $tmp.attr(tableAttr[i][0],tableAttr[i][1]);
        }
        if(isIE()){
            $tmp.css("table-layout","fixed");
        }
        html = $tmp.get(0);
    }else if(isIE()){
        html = defualtTableForIE;
    }else{
        html = defualtTable;
    }
    return html;
}

/**
 * 获取select html方法（暂不支持动态绑定方法）
 * @param selectConfig 下拉框配置信息
 * @param selectConfig.name 下拉框名称
 * @param selectConfig.ocfnText 下拉框onchange事件（仅作string拼接）
 * @param selectConfig.id 下拉框id
 * @param selectConfig.otherAttr 下拉框其他自定义属性
 * @param selectConfig.defName option默认展示信息
 * @param selectConfig.display option展示信息数组
 */
function getSelectHtml(selectConfig){
    var selectHtml;
    selectHtml='<select name="'+selectConfig.name
        +'" onchange="'+selectConfig.ocfnText
        +'" id="'+selectConfig.id+'"';
    if(selectConfig.otherAttr){
        for(var i in selectConfig.otherAttr){
            selectHtml += selectConfig.otherAttr[i][0] + "=" + selectConfig.otherAttr[i][1];
        }
        selectHtml += '>';
    }else{
        selectHtml += '>';
    }

    selectHtml += '<option value="">'+selectConfig.defName+'</option>';

    if($.isArray(selectConfig.display))
    {
        for(var j in selectConfig.display){
            if((typeof selectConfig.display[j] == 'object')  ){
                var text=selectConfig.display[j].text ;
                var value=selectConfig.display[j].value;
                if(text!=undefined && value !=undefined )
                {
                    selectHtml += '<option value='+value+'>'+text+'</option>';
                }

            }
        }
    }
    else
    {
        for(var j in selectConfig.display){
            if((typeof selectConfig.display[j] == 'string') && selectConfig.display[j].constructor == String){
                selectHtml += '<option value='+j+'>'+selectConfig.display[j]+'</option>';

            }
        }
    }

    selectHtml += '</select>';

    return selectHtml;
}


//return boolean:判断当前浏览器是否为IE
function isIE(){
    return(!!window.ActiveXObject||"ActiveXObject" in window)?true:false;
}
