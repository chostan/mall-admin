// sku模块
import request from "@/utils/request";

//sku列表的接口
///admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });
};

//上架
///admin/product/onSale/{skuId}
export const reqSale = (skuId) => {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: "get",
  });
};

//下架
///admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: "get",
  });
};

//获取SKU详情的接口
///admin/product/getSkuById/{skuId}  get
export const reqSkuById = (skuId) => {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: "get",
  });
};

//删除SKU的接口
export const reqDeleteSkuById = (skuId) => {
  return request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: "delete",
  });
};
