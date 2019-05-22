#iview-admin兼容ie9版

> 删除功能如下

1、 删除国际化

2、 删除组织结构图

3、 删除树状表格

4、 删除Markdown编辑器

5、 删除富文本编辑器（wangedit bug还是很多的）

> 新增功能

1、 新增 `this.$isIe` 用来判断是否为ie

```
// ie9 xxx.vue
console.log(this.$isIe) // ie 9
```

2、 新增 `this.$cookies` 用来操作cookie, 查看[js-cookie](https://github.com/js-cookie/js-cookie)

```
// xxx.vue
this.$cookies.get('xxx')
```

3、 新增 `this.$env` 用来判断是否为生产环境
```
// xxx.vue development
console.log(this.$env) // true
```

4、 新增 `this.$indexOf` 用来输出data属性
```
// xxx.vue
console.log(this.$indexOf([])) // array
```

5、 新增 dom循环事件
```
document.getElementsByTagName('a').forEach(m => {
  console.log(m)
})
```

6、 增加config配置项
```
// mian.js
Vue.use(globalTool, {
  cookies: true, // 是否启用cookies功能
  indexOf: true, // 是否启用indexOf功能
  each: 'forEach', // dom元素循环名 及`document.getElementsByTagName('a').forEach`中的`forEach`
  prefix: '$' // 调用时的前缀名及`this.$cookies`中的`$`
})
```
