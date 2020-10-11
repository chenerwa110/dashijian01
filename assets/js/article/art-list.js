$(function () {
  //时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    var dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm=padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y+"-"+m+"-"+d+" "+hh+":"+mm+":"+ss
  }
  function padZero(n) {
    return n>9?n:"0"+n
  }
  //定义查询参数
  var q = {
    pagenum: 1,//页码值
    pagesize: 2,//每页显示数据
    cate_id: "",//文章分类id
    state:"",//文章发布状态
  }
  //初始化文章列表
  var layer = layui.layer;
  initTable();
  function initTable() {
    $.ajax({
      method: "get",
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        var str = template("tpl-table", res)
        $("tbody").html(str)
        //分页
        rederPage(res.total)
      }
    })
  }
  //初始化分类
  var form = layui.form;
  initCate();
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render();
      }
    })
  }
  //筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    //获取
    var state = $('[name=state]').val();
    var cate_id = $('[name=cate_id]').val();
    q.state = state;
    q.cate_id = cate_id;
    //初始化文章列表
    initTable();
  })
  //分页
  var laypage = layui.laypage;
  function rederPage(total) {
    //执行一个laypage实例
  laypage.render({
    elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
    count: total ,//数据总数，从服务端得到
    limit: q.pagesize,//每页几条
    curr: q.pagenum,//默认第几页
    //分页模块设置，显示那些子模块
    layout: ["count", "limit", "prev", "page", "next", "skip"],
    limits: [2, 3, 5, 10],//每页显示多少数据的选择器
    //触发jump：分页初始化的时候，页码改变的时候
    jump: function (obj, first) {
      //obj:所有参数所在的对象；first：是否是第一次初始化页
      //赋值页面
      q.pagenum = obj.curr;
      q.pagesize = obj.limit;
     //判断，不是第一次初始化分页，才能重新调用初始化文章列表
      if (!first) {
        //初始化文章列表
        initTable();
     } 
    }
  });
  }
  //删除
  $('tbody').on('click', ".btn-delete", function () {
    var len = $('.btn-delete').length;
    var Id = $(this).attr("data-id");
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + Id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！');
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum-1;
          }

          initTable()
        }
      })
      layer.close(index)
    })
  })
})
