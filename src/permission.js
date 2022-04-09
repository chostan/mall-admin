import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration
// 不需要token就可以访问
const whiteList = ["/login", "/404"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 显示加载进度条
  NProgress.start();

  // 动态指定页面标题
  document.title = getPageTitle(to.meta.title);

  // 从local中读取token
  const hasToken = getToken();
  // 如果token存在
  if (hasToken) {
    // 判断是否要去login
    if (to.path === "/login") {
      // 如果有token 目标路径是login 但是没有用户信息 强制跳转到首页 又进入前置守卫
      next({ path: "/" });
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // 如果不有 就去获取用户信息
          await store.dispatch("user/getInfo");
          //next()  //自身存在一个bug 就是直接放行会出现页面空白 所以要进行处理
          // 在获取完用户信息并动态注册好权限路由后
          next({ ...to }); // 只有登录成功了才能跳转到目标路由
          // 这个方法不会丢失路由参数 当只请求用户信息还没存储数据时,这里形成递归,所以想看到正常页面先用next() 写好后再用next({...to})
        } catch (error) {
          console.log("error", error);
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    // 如果没有token 判断路径有没有在白名单列表中
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
    }
  }
  NProgress.done(); // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
