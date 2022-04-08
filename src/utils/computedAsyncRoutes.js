export default function computedAsyncRoutes(asyncRoutes, routes) {
  // 过滤出当前用户需要展示的路由
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) != -1) {
      // 递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
}
