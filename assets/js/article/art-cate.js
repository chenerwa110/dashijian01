$(function () {
  initArtCateList();

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }
  var layer = layui.layer;
  var indexAdd = null;
  $("#btnAdd").on('click', function () {
    indexAdd=layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $("#dialog-add").html(),
    })
  })
  $('body').on('submit', "#form-add", function (e) {
    e.preventDefault()
    $.ajax({
      method:'post',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        //重新渲染页面
        initArtCateList();
        layer.msg("添加成功！")
        //根据索引关闭弹出层
        layer.close(indexAdd)
      }
    })
  })
  var indexedit = null;
  var form = layui.form;
  $("tbody").on('click',".btn-edit", function () {
    indexedit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr('data-id')
   // 发起请求获取对应分类的数据
    $.ajax({
     method: 'GET',
      url: '/my/article/cates/' + id,
     success: function(res) {
      form.val('form-edit', res.data)
      }
    })
  })
  //修改-提交
  $('body').on('submit', "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        initArtCateList();
        layer.msg('恭喜更新成功');
        layer.close(indexedit)
      }
    })
  })
  //删除
  $("tbody").on('click', '.btn-delete', function () {
    var Id = $(this).attr('data-id');
     // 提示用户是否要删除
     layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + Id,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
});
