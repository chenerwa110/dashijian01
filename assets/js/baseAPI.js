//开发环境服务器地址
var baseURl = "http://ajax.frontend.itheima.net";
$.ajaxPrefilter(function (params) {
  params.url = baseURl + params.url;
});
