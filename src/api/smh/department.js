import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listDepartment(query) {
  return request({
    url: '/smh/department/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getDepartment(dpId) {
  return request({
    url: '/smh/department/' + dpId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addDepartment(data) {
  return request({
    url: '/smh/department',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateDepartment(data) {
  return request({
    url: '/smh/department',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delDepartment(dpId) {
  return request({
    url: '/smh/department/' + dpId,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportDepartment(query) {
  return request({
    url: '/smh/department/export',
    method: 'get',
    params: query
  })
}