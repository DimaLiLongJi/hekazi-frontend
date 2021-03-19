import axios, { AxiosRequestConfig } from 'axios';
import { Toast } from 'antd-mobile';

export type TypeHttpRequest = <V = any>(config?: AxiosRequestConfig) => Promise<Typings.HeKaZiResponse<V>>;

// set interceptors of axios
axios.interceptors.request.use((config) => {
  Toast.loading("", 0);
  return config;
}, (err) => Promise.resolve(err));

axios.interceptors.response.use((res) => {
  Toast.hide();
  if (res.data.code !== 0) {
    Toast.fail(res.data.description);
  }
  return res;
}, (error) => {
  if (error.response.status) {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误(400)';
        break;
      case 401:
        error.message = '未授权，请重新登录(401)';
        break;
      case 403:
        error.message = '拒绝访问(403)';
        break;
      case 404:
        error.message = '请求出错(404)';
        break;
      case 408:
        error.message = '请求超时(408)';
        break;
    }
  } else {
    error.message = '连接服务器失败!';
  }
  // Toast({ message: error.message, position: 'bottom', duration: 1500 })
  Toast.fail(error.message);
  return Promise.reject(error);
});

/**
 * function getMethod for for http request of method get
 *
 * @export
 * @template V
 * @param {string} [url]
 * @param {AxiosRequestConfig} [config={}]
 * @returns {Promise<Typings.HeKaZiResponse<V>>}
 */
export async function getMethod<V = any>(url?: string, config: AxiosRequestConfig = {}): Promise<Typings.HeKaZiResponse<V>> {
  const res = await axios({
    url,
    ...config,
    method: 'get',
  });
  return res.data;
}

/**
 * function postMethod for for http request of method post
 *
 * @export
 * @template V
 * @param {string} [url]
 * @param {AxiosRequestConfig} [config={}]
 * @returns {Promise<Typings.HeKaZiResponse<V>>}
 */
export async function postMethod<V = any>(url?: string, config: AxiosRequestConfig = {}): Promise<Typings.HeKaZiResponse<V>> {
  const res = await axios({
    url,
    ...config,
    method: 'post',
  });
  return res.data;
}

/**
 * function putMethod for for http request of method put
 *
 * @export
 * @template V
 * @param {string} [url]
 * @param {AxiosRequestConfig} [config={}]
 * @returns {Promise<Typings.HeKaZiResponse<V>>}
 */
export async function putMethod<V = any>(url?: string, config: AxiosRequestConfig = {}): Promise<Typings.HeKaZiResponse<V>> {
  const res = await axios({
    url,
    ...config,
    method: 'put',
  });
  return res.data;
}

/**
 * function deleteMethod for for http request of method delete
 *
 * @export
 * @template V
 * @param {string} [url]
 * @param {AxiosRequestConfig} [config={}]
 * @returns {Promise<Typings.HeKaZiResponse<V>>}
 */
export async function deleteMethod<V = any>(url?: string, config: AxiosRequestConfig = {}): Promise<Typings.HeKaZiResponse<V>> {
  const res = await axios({
    url,
    ...config,
    method: 'delete',
  });
  return res.data;
}

export default axios;
