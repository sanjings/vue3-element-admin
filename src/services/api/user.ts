import { requestPost } from '../util';

export interface RequestLoginResponse {
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * token
   */
  token?: string;
  /**
   * 是否重置过密码
   */
  isResetPassword?: boolean | number;
}

export const requestLogin = async (params: { phone: string; password: string }) => {
  return {
    code: 200,
    data: {
      phone: params.phone,
      username: '三井寿',
      token: 'A432234432FDSFDSFSD4231321',
      isResetPassword: true
    },
    message: 'success'
  };
  // return requestPost<RequestLoginResponse>('/login', params);
};

export const requestLogout = async () => {
  return {
    code: 200,
    data: null,
    message: 'success'
  };
  // requestPost('/logout');
};

export const requestPasswordSet = (params: {
  phone: string;
  newPassword: string;
  /**
   * 短信验证码
   */
  smsCode: string;
}) => requestPost('/password/set', params);

export const requestPasswordSendSms = (params: { phone: string }) => requestPost('/password/sendSms', params);

export type RequestPermissionMenuResponse = {
  /**
   * 编号
   */
  id?: number;
  /**
   * 资源名称
   */
  name?: string;
  /**
   * 权限类型： 1-菜单 2-接口
   */
  type?: number;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 0：显示  1：隐藏
   */
  hideInMenu?: number;
  /**
   * 权限字符串
   */
  permission?: string;
  /**
   * 父编号
   */
  parentId?: number;
  /**
   * 配置
   */
  redirect?: string;
  /**
   * 高亮菜单路由，字符串
   */
  activeMenu?: string;
  /**
   * 是否缓存 1是 0否
   */
  keepAlive?: number;
  /**
   * 是否有次权限
   */
  checked?: boolean;
  children?: {
    /**
     * 编号
     */
    id?: number;
    /**
     * 资源名称
     */
    name?: string;
    /**
     * 权限类型： 1-菜单 2-接口
     */
    type?: number;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 0：显示  1：隐藏
     */
    hideInMenu?: number;
    /**
     * 权限字符串
     */
    permission?: string;
    /**
     * 父编号
     */
    parentId?: number;
    /**
     * 配置
     */
    redirect?: string;
    /**
     * 高亮菜单路由，字符串
     */
    activeMenu?: string;
    /**
     * 是否缓存 1是 0否
     */
    keepAlive?: number;
    /**
     * 是否有次权限
     */
    checked?: boolean;
    children?: {}[];
  }[];
}[];

export const requestPermissionMenu = async () => {
  return await {
    code: 200,
    data: [],
    message: 'success'
  };
};
