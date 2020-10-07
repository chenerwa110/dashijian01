$(function () {
  // 点击去注册账号，隐藏登录区域，显示去注册区域
  $("#link-reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  //点击去登录，隐藏去注册区域，显示登录区域
  $("#link-login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });
  // 自定义校验规则
  // 从layui中获取form对象
  var form = layui.form;
  form.verify({
    //密码规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //确定密码规则
    repwd: function (value) {
      //获取name为password的标签
      var pwd = $(".reg-box [name=password]").val();
      //比较俩次输入密码是否一致
      if (value !== pwd) {
        return "俩次密码输入不一致！";
      }
    },
  });
  //注册功能
  var layer = layui.layer;
  $("#form-reg").on("submit", function (e) {
    //阻止表单提交
    e.preventDefault();
    //发送ajax
    $.ajax({
      method: "POST",
      url: "/api/reguser",
      data: {
        username: $(".reg-box [name=username]").val(),
        password: $(".reg-box [name=password]").val(),
      },
      success: function (res) {
        //返回状态判断
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        //提交成功后处理代码
        layer.msg("注册成功，请登录");
        //手动切换到登录表单
        $("#link-login").click();
        //重置form表单
        $("#form-reg")[0].reset();
      },
    });
  });
  //登录功能
  $("#form-login").on("submit", function (e) {
    //阻止表单提交
    e.preventDefault();
    //发送ajax
    $.ajax({
      method: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        //校验返回状态
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        //提示信息，保存token，跳转页面
        layer.msg("登录成功");
        //保存token，未来的的接口要使用token
        localStorage.setItem("token", res.token);
        //跳转
        location.href = "/index.html";
      },
    });
  });
});
