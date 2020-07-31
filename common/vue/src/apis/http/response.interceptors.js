/*
 * @Author: benaozhi
 * @Date: 2020-07-19 19:25:44
 * @LastEditTime: 2020-09-04 17:07:13
 * @Description:
 */
import config from '@/config'
import router from '@/router'
import { Prompt } from '@/util'

export const responseInterceptors = Axios => {
  // 这里注册你设置的返回方法
  Axios.interceptors.response.use(normal)
}

function normal(response) {
  const res = response.data
  const code = res[config.RESPONSE_CODE_FILED]
  if (code === config.RESPONSE_CODE.OK) {
    // 成功，直接返回数据
    return res
  } else if (code === config.RESPONSE_CODE.UNAUTHORIZED) {
    // token 过期或未登录
    // 当 config.UNAUTHORIZED_REDIRECT_PATH 有设置时进行自动跳转到登录页
    if (config.UNAUTHORIZED_REDIRECT_PATH) {
      router.replace({ path: config.UNAUTHORIZED_REDIRECT_PATH })
    }
    Prompt.error(res[config.RESPONSE_MESSAGE_FILED])
    // 抛出异常中断外部后续逻辑
    throw new Error(res[config.RESPONSE_MESSAGE_FILED])
  } else {
    // 方式一，其他code，直接放行
    return res
    // 方式二，其它 code，抛出异常
    // Prompt.error(res[config.RESPONSE_MESSAGE_FILED])
    // throw new Error(res[config.RESPONSE_MESSAGE_FILED])
  }
}