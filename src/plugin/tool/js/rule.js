import check from '@/libs/checkRules'

let extValid = {}
/**
 * 验证用户输入是否为空格
 */
extValid.validEmpty = function (rule, value, callback) {
  if (value.replace(/ /g, '').length === 0) {
    callback(new Error('输入不能为空'))
  }
  callback()
}

extValid.validateLen30 = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else {
    if (getRealLen(value) > 30) {
      callback(new Error('长度不能大于30个字符（或15个汉字）'))
    }
    callback()
  }
}
extValid.validateLen20 = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else {
    if (getRealLen(value) > 20) {
      callback(new Error('长度不能大于20个字符（或10个汉字）'))
    }
    callback()
  }
}
extValid.validateUserName = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    if (!checkLoginname(value)) {
      callback(new Error('用户名为6~20位字母、数字或下划线组成'))
    }
    callback()
  }
}
extValid.validateIP = function (rule, value, callback) {
  if (value !== '') {
    if (!validIP(value)) {
      callback(new Error('请输入正确格式的IP'))
    }
  }
  callback()
}
extValid.validatePwd = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (!checkLoginname(value)) {
      callback(new Error('密码为6~20位字母、数字或下划线组成'))
    }
    callback()
  }
}
extValid.validatePass = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (!validPassword(value)) {
      callback(new Error('密码为8~20大写字母、小写字母、数字、下划线的组合'))
    }
    callback()
  }
}
extValid.validateIdCardB = function (obj) {
  if (this.validateIdCard(obj) === 0) {
    return true
  } else {
    return false
  }
}
extValid.validateUnifiedCode = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入统一社会信用代码'))
  } else {
    if (!checkUnifiedCode(value) || value.length !== 18) {
      callback(new Error('统一社会信用代码为18位英文字母、数字组成'))
    }
    callback()
  }
}
/**
 * 功能：验证银行卡号
 */
extValid.validateBankAccount = function (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入对公账户账号'))
  } else {
    if (!check.validateBankCard(value)) {
      callback(new Error('请输入正确格式的对公账户账号'))
    }
    callback()
  }
}
extValid.validateIdCard = function (rule, value, callback) {
  console.log(rule, value, callback)
  if (value !== '') {
    if (!check.validateIdCard(value)) {
      callback(new Error('请输入正确的身份证号码'))
    }
    callback()
  }
  callback()
}
extValid.validateMAC = function (rule, value, callback) {
  if (value !== '') {
    if (!check.validateMAC(value)) {
      callback(new Error('请输入正确的MAC地址'))
    }
    callback()
  }
  callback()
}
extValid.validateContact = function (rule, value, callback) {
  if (value !== '') {
    callback(new Error('请输入联系方式'))
  } else {
    if (!(check.validateLandline(value) || check.validateMobile(value))) {
      callback(new Error('请输入正确格式的手机号或座机号'))
    }
    callback()
  }
}
extValid.validatePhone = function (rule, value, callback) {
  if (value !== '') {
    if (!(check.validateMobile(value))) {
      callback(new Error('请输入正确的手机号码'))
    }
    callback()
  }
  callback()
}

/**
 * 获取字符串实际长度（英文、汉字）
 */
function getRealLen (str) {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length // 先把中文替换成两个字节的英文，在计算长度
}

/**
 * 验证用户名格式 （6~20位字母、数字、下划线）
 */
function checkLoginname (str) {
  var reg = /^(\w){6,20}$/
  var flag = reg.test(str)
  return flag
}

/**
 * 验证密码（包括8~20大写字母、小写字母、数字、下划线组合） 特殊字符：
 */
function validPassword (str) {
  if (/^.*?[\d]+.*$/.test(str) && /^.*?[A-Z]/.test(str) &&
    /^.*?[a-z]/.test(str) && /^.*?[_].*$/.test(str) &&
    /^.{8,20}$/.test(str)) {
    return true
  } else {
    return false
  }
}

/**
 * 验证统一社会信用代码格式 （18位字母、数字）
 */
function checkUnifiedCode (str) {
  let reg = /^[A-Za-z0-9]+$/
  let flag = reg.test(str)
  return flag
}

function validIP (ip) {
  let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}

export default extValid
