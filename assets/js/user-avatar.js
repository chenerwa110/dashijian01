$(function () {
  var layer = layui.layer;
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);
  //选择文件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });
  //修改图片
  $("#file").on("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return layer.msg("请选择文件");
    }
    //获取用户选择文件
    var file = e.target.files[0];
    //创建url地址
    var newImgURL = URL.createObjectURL(file);
    //先销毁旧的，在设置新的图片路径
    $image.cropper("destroy").attr("src", newImgURL).cropper(options);
  });
  //上传头像
  //获取裁剪后的头像
  $("#btnUpload").on("click", function () {
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    //调用接口，把头像上传到服务器
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更换头像失败！");
        }
        layer.msg("更换头像成功！");
        window.parent.getUserInfo();
      },
    });
  });
});
