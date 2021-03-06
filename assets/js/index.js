$(function () {
  //用于获取信息
  getUserInfo();
  //退出功能
  var layer = layui.layer;
  $("#btnLogout").on("click", function () {
    //框架提供的询问框
    layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function (
      index
    ) {
      //do something
      // 1. 清空本地存储中的 token
      localStorage.removeItem("token");
      // 2. 重新跳转到登录页面
      location.href = "/login.html";
      //框架提供的 关闭 confirm 询问框
      layer.close(index);
    });
  });
});
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers 就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      // 调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data);
    },
    //无论成功或失败，都是触发complete方法
    // complete: function (res) {
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     localStorage.removeItem("token");
    //     location.href = "/login.html";
    //   }
    // },
  });
}
// 渲染用户的头像
function renderAvatar(user) {
  // 1. 获取用户的名称
  var name = user.nickname || user.username;
  // 2. 设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // 3. 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".user-avatar").hide();
  } else {
    // 3.2 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".user-avatar").html(first).show();
  }
}
