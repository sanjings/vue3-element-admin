import type { FormItemRule } from 'element-plus';

/**
 * 手机号正则
 */
export const phoneReg = /^1[3-9]\d{9}$/;
/**
 * 手机号校验
 */
export const validatePhone: FormItemRule['validator'] = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号'));
  }
  callback();
};

/**
 * 身份证正则
 */
export const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
/**
 * 身份证校验
 */
export const validateIdCard: FormItemRule['validator'] = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入身份证号'));
  } else if (!idCardReg.test(value)) {
    callback(new Error('请输入正确的身份证号'));
  }
  callback();
};

/**
 * 邮箱正则
 */
export const emailReg = /^\w+@[\da-z\.-]+\.([a-z]{2,6}|[\u2E80-\u9FFF]{2,3})$/;
/**
 * 电子邮箱校验
 */
export const validateEmail: FormItemRule['validator'] = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入邮箱'));
  } else if (!emailReg.test(value)) {
    callback(new Error('请输入正确的邮箱'));
  }
  callback();
};

/**
 * 网址链接正则
 */
export const websiteReg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
/**
 * 网址链接校验
 */
export const validateWebsite: FormItemRule['validator'] = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入链接'));
  } else if (!websiteReg.test(value)) {
    callback(new Error('请输入包含http://或者https://的正确链接'));
  }
  callback();
};

/**
 * 密码正则
 */
export const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_\w]).{8,16}$/;
/**
 * 汉字、英文校验
 */
export const validatePassword: FormItemRule['validator'] = (_rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (!passwordReg.test(value)) {
    callback(new Error('长度8-16位，至少包含大写字母、小写字母和数字'));
  }
  callback();
};
