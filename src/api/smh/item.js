import request from '@/utils/request'

// 查询项目管理列表
export function listItem(query) {
  return request({
    url: '/smh/item/list',
    method: 'get',
    params: query
  })
}

// 查询项目管理详细
export function getItem(itemId) {
  return request({
    url: '/smh/item/' + itemId,
    method: 'get'
  })
}

// 新增项目管理
export function addItem(data) {
  return request({
    url: '/smh/item',
    method: 'post',
    data: data
  })
}

// 修改项目管理
export function updateItem(data) {
  return request({
    url: '/smh/item',
    method: 'put',
    data: data
  })
}

// 删除项目管理
export function delItem(itemId) {
  return request({
    url: '/smh/item/' + itemId,
    method: 'delete'
  })
}

// 导出项目管理
export function exportItem(query) {
  return request({
    url: '/smh/item/export',
    method: 'get',
    params: query
  })
}

// 查询科室列表
export function listDepartments() {
  return request({
    url: '/smh/health_department/list', // 假设这是获取科室列表的正确API路径
    method: 'get'
  });
}
