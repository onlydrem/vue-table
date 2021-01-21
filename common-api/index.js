/**
 功能：凭证通用api
 作者：程杰
 邮箱：chengjie@cebc.cn
 创建时间：2021/1/13 10:15
 **/
import { post, get } from '@u/global/fetch'
import baseUrl from './baseUrl'
import { VOUCHER } from '@a/base'

export function getVoucherTaskList (params={}) {
  return post(VOUCHER + baseUrl[params.url], params.data)
}
