/**
 * POST请求
 * @param url
 * @param data
 * @param callback
 * @constructor
 */
var  hostUrl='https://192.168.0.104:9999';
//判断字符串为空
function isEmpty(str) {
    if(typeof str== null || str== "" || str== "undefined" || str==undefined) {
        return true;
    } else {
        return false;
    }
}
//判断token为空
function isNullToken(a_token) {
  if(isEmpty(a_token)){
      // alert_error('请求验证过期!');
      setTimeout(function () {
          location.href="/login/login.shtml";
      }, 2000);
      return false;
  }
  // return true;
}
//判断token为空
function isNullUser(gs_userInfo) {
    if(!gs_userInfo){
        // alert('用户过期!');
        setTimeout(function () {
            location.href="/login/login.shtml";
        }, 2000);
        return false;
    }
    // return true;
}
//判断token过期，暂未用
function isValidToken(a_token){
    $.ajax({
        url: hostUrl+'/public/getIsTokenOverAction',  type:'get', async: false,
        headers:{'Content-Type':'application/json'},  data: {token:a_token}
        ,
        success: function(res) {
console.log("isValidToken.res,a_token=",res,a_token); //return false;
            if(res.code=='200') {
                if(res.result==0) {
                    alert_error('请求验证过期!');
                    setTimeout(function () {
                        location.href = "/login/login.shtml";
                    }, 2000);
                    return false;
                }else {
                    return true;
                }
            }else{
                setTimeout(function () {
                    location.href = "/login/login.shtml";
                }, 2000);
                return false;
            }

        },
        error: function(res) {
            //alert_error('请求失败,请查看网络或联系管理员');
            alert_error('请求验证出现错误!');

            setTimeout(function () {
                    location.href="/login/login.shtml";
                }, 2000);
            return false;
        },
        complete: function() {
            return true;
        }
    });
    return true;
}
//通过code判断退出
function exitByCode(code){
    if(!code || code==-100) {
        alert_error('请求验证过期!');
        setTimeout(function () {
            location.href = "/login/login.shtml";
        }, 2000);
        return false;
    }
    return true;
}
function setJsonStorage(a_key,a_json) {
    // {provinceId:1,name:'as国家卫健委',roleCode:'1'}
    // var jsonData={'provinceId':1,'name':'ff国家卫健委','roleCode':'1'};
    var str_jsonData = JSON.stringify(a_json);
    localStorage.setItem(a_key,str_jsonData);
}
function getJsonStorage(a_key) {
    var ls_jsonData=localStorage.getItem(a_key);
    var json_userInfo = JSON.parse(ls_jsonData);
    return json_userInfo;
    // console.log("initData.gs_userInfo=",gs_userInfo);
}
function delJsonStorage(a_key){
    localStorage.removeItem(a_key);
    // console.log(localStorage.getItem('userinfo'));
}
function Post(url, data, callback=function(){}) {
    var v_token=getJsonStorage('g_token');
    if( !isValidToken(v_token) ) return false;
    var layer = layui.layer;
    var $ = layui.$;
    var index = layer.load(1, {
        shade: [0.6,'#000'] //0.1透明度的白色背景
    });
    //JSON.stringify(data)
    $.ajax({
        url: url,   type:'post',   headers:{'Content-Type':'application/json','token':v_token}, data: data,    dataType: 'json',
        success: function(res) {
            if(res.code==-100) {
                alert_error('请求验证过期!');
                setTimeout(function () {
                    location.href = "/login/login.shtml";
                }, 2000);
                return false;
            }
            callback(res);
        },
        error: function() {
            alert_error('请求失败,请查看网络或联系管理员');
        },
        complete: function() {
            layer.close(index);
        }
    });
}
/**
 * 成功弹窗
 * @param msg
 * @param callback
 */
function alert_success(msg, callback=function(){}) {
    var layer = layui.layer;
    layer.alert(msg, {icon: 6}, function (index) {
        layer.close(index);
        callback()
    });
}

/**
 * 失败弹窗
 * @param msg
 */
function alert_error(msg) {
    var layer = layui.layer;
    layer.alert(msg, {icon: 5}, function(index) {
        layer.close(index)
    });
}
/**
 * 回退到上一页
 */
function back_url() {
    if(window.is_back_url) return;
    if(document.referrer) {
        location.href = document.referrer;
    }else {
        history.go(-1);
    }
}

/**
 * 成功提示
 * @param msg
 * @param callback
 */
function tips_success(msg, callback=function(){}) {
    var layer = layui.layer;
    layer.msg(msg, {
        icon: 1,
        time: 1500
    }, function () {
        callback()
    });
}

/**
 * 失败提示
 * @param msg
 */
function tips_error(msg) {
    var layer = layui.layer;
    layer.msg(msg, {
        icon: 0,
        time: 500
    });
}


/**
 * 上传绑定事件
 * @param id
 * @param type [image-图片 video-视频]
 * @param remarks 备注
 * @param upload_url
 * @param upload_name
 */
 function uploadInit(id, type='image', remarks='', upload_url='', upload_name='file') {
    upload_url = upload_url == '' ? window.UPLOAD_URL : upload_url;
    var file_list = [];
    var $ = layui.$;
    var obj = $('#'+id);
    if(obj.data('lock')) return;
    obj.data('lock', 1);
    var default_img = '/upload/default.png';
    var preview_html = '', text_1 = '', remarks_html = '<div style="display: inline-block; margin: 0 0 0 40px; color: red;">{remarks}</div>';
    if(type == 'image') { // 单图上传
        preview_html = '<img class="upload_preview_'+id+'" src="'+default_img+'" id="i_'+id+'" title="点击预览" style="cursor: pointer; height: 150px; width: 150px; display: block;">';
        text_1 = '选择图片';
    }else if(type == 'images') { // 多图上传
        text_1 = '选择图片';
    }else if(type == 'video') {
        preview_html = '<video class="upload_preview_'+id+'" id="i_'+id+'" title="点击预览" style="cursor: pointer; height: 150px; width: 150px; display: none;">';
        text_1 = '选择视频';
    }else if(type == 'audio') {
        preview_html = '<audio class="upload_preview_'+id+'" id="i_'+id+'" controls style="display: none; outline: none;">';
        text_1 = '选择音频';
    }
    obj.parent().append('<div id="_'+id+'">'+
        '<button type="button" class="layui-btn layui-btn-normal" id="b_'+id+'"><i class="layui-icon"></i>'+text_1+'</button>'+
        remarks_html.replace('{remarks}', remarks) +
        '<blockquote class="layui-elem-quote layui-quote-nm layui-row" style="margin-top: 10px;">' +
        preview_html+
        '</blockquote>' +
        '</div>');
    if(obj.val() != '') {
        if(type == 'image' || type == 'video') {
            file_list = [obj.val()];
        }else if(type == 'audio'){
            file_list = [obj.val()];
        }else if(type == 'images') {
            file_list = eval(obj.val());
        }
        parse_html();
    }

    // 上传按钮点击事件
    $('#b_'+id).click(function() {
        var accept = '', enctype = '';
        if(type == 'image' || type == 'images') accept = 'image';
        if(type == 'video' || type == 'videos') accept = 'video';
        if(type == 'audio') accept = 'audio';
        if(type == 'images' || type == 'videos') enctype = 'multiple';
        obj.parent().append('<input type="file" id="f_'+id+'" accept="'+accept+'/*" '+enctype+' style="display: none;">');
        document.getElementById('f_'+id).click();
        // input选中文件事件
        $('#f_'+id).on('change', function() {
            var files = this.files;
            $(this).remove();
            // 单图上传
            if(type == 'image' || type == 'video' || type == 'audio') {
                var data = new FormData();
                data.append(upload_name, files[0]);
                Upload(upload_url, data, function(res) {
                    if(res.code == 0) {
                        file_list = [res.data.src];
                        // 渲染
                        parse_html();
                    }else {
                        alert_error(res.msg);
                    }
                });
            }else if(type == 'images') {
                var data = new FormData();
                for(var i =0; i<=files.length; i++) {
                    data.append(upload_name+'[]', files[i]);
                }
                Upload(upload_url, data, function(res) {
                    if(res.code == 0) {
                        for(var i=0; i<res.data.src.length; i++) {
                            file_list.push(res.data.src[i]);
                        }
                        // 渲染
                        parse_html();
                    }else {
                        alert_error(res.msg);
                    }
                });
            }else if(type == 'video') {

            }
        });
    });

    // 渲染html
    function parse_html() {
        var imgs_preview = '<div style="display: inline-block; position: relative; margin: 0 10px 5px 0;"><i title="删除图片" class="layui-icon layui-icon-close upload_colse_'+id+'" data-src="{d_src}" style="cursor: pointer; position: absolute; top: -25px; right: -20px; font-size: 30px; font-weight: bold;"></i><img src="{src}" class="upload_preview_'+id+'" title="点击预览" style="cursor: pointer; height: 150px; width: 150px;"></div>';
        var html = '';
        if(type == 'image') {
            $('#i_'+id).attr('src', file_list[0]);
            obj.val(file_list[0]);
        }else if(type == 'images') {
            for(var i=0; i<file_list.length; i++) {
                var temp = imgs_preview;
                temp = temp.replace('{src}', file_list[i]);
                temp = temp.replace('{d_src}', file_list[i]);
                html += temp;
            }
            obj.val(JSON.stringify(file_list));
            obj.parent().find('blockquote').html(html);
            $('.upload_colse_'+id).click(function() {
                file_list.splice(file_list.indexOf($(this).data('src')), 1);
                parse_html();
            });
        }else if(type == 'video') {
            $('#i_'+id).attr('src', file_list[0]);
            $('#i_'+id).css('display', 'block');
            obj.val(file_list[0]);
        }else if(type == 'audio') {
            $('#i_'+id).attr('src', file_list[0]);
            $('#i_'+id).css('display', 'block');
            obj.val(file_list[0]);
        }

        // 预览事件
        $('.upload_preview_'+id).unbind('click');
        $('.upload_preview_'+id).click(function() {
            var max_height = document.body.clientHeight;
            var max_width  = document.body.clientWidth;
            if(type == 'image' || type == 'images') {
                // 创建对象
                var img = new Image();
                img.src = $(this).attr('src');
                var height = img.height, width = img.width;
                while(width > max_width || height > max_height) {
                    height /= 2;
                    width /= 2;
                }
                layer.open({
                    type: 1,
                    shade: 0.6,
                    title: false,
                    area: [width+'px', height+ 'px'],
                    content: '<img style="width: '+width+'px; height: '+height+'px;" src="'+$(this).attr('src')+'"/>'
                });
            }else {
                var height = document.getElementById('i_'+id).videoHeight;
                var width = document.getElementById('i_'+id).videoWidth;
                while(width > max_width || height > max_height) {
                    height /= 2;
                    width /= 2;
                }
                layer.open({
                    type: 1,
                    shade: 0.6,
                    title: false,
                    area: [width+'px', height+ 'px'],
                    content: '<video autoplay controls style="width: 100%; height:100%;" src="'+$(this).attr('src')+'"/>'
                });
            }
        });
    }
}

/**
 * 上传方法
 * @param upload_url
 * @param data
 * @param callback
 * @constructor
 */
function Upload(upload_url, data, callback=function(){}) {
    var $ = layui.$;
    $.ajax({
        url: upload_url,
        type:'post',
        data: data,
        contentType: false,
        processData: false,
        dataType: 'json',
        xhr: function() {
            var xhr = new XMLHttpRequest();
            //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
            xhr.upload.addEventListener('progress', function (e) {
                //loaded代表上传了多少
                //total代表总数为多少
                var progressRate =  Math.round((e.loaded / e.total) * 100) + '%';
                //通过设置进度条的宽度达到效果
                layer.load(1, {
                    shade: [0.4, '#000'],
                    content: '正在上传......'+progressRate,
                    success: function (layero) {
                        layero.find('.layui-layer-content').css({
                            'padding-left': '45px',
                            'width': '200px',
                            'line-height': '36px',
                            'font-size': '16px',
                            'color': '#ddd'
                        });
                    }
                });
            });
            return xhr;
        },
        success: function(res) {
            layer.closeAll();
            callback(res);
        },
        error: function() {
            layer.closeAll();
            alert_error('上传失败');
        }
    });
}

/**
 * 展示图片
 */
function show_img(src) {
// 创建对象
    var img = new Image();
    img.src = src;
    var height = img.height, width = img.width;
    while(width > 800 || height > 600) {
        height /= 2;
        width /= 2;
    }
    layer.open({
        type: 1,
        shade: false,
        title: false,
        area: [width+'px', height+ 'px'],
        content: '<img style="width: '+width+'px; height: '+height+'px;" src="'+src+'"/>'
    });
}

layui.$(function(){
    layui.$(document).on('click', '.showImage', function(){
        var url = layui.$(this).attr('src')
        if (url) {
            console.log(url)
            show_img(url) 
        }
    })
})

