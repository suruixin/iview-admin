<!--
参数:
  modalParams: { // 弹出框数据
    show: false, // 弹窗开关
    okText: '', // 确认按钮文字
    width: 600, // 弹框宽度
    modalLoading: true, // 点击确定Loading状态
    type: 'add', // 弹出框类型。目前支持三种 add edit info
    title: '新增' // 弹出框头部
  }
  columns: [Array] 表格列的配置描述 参见 https://www.iviewui.com/components/table
  seek: [Array] 搜索项配置描述
    {
      span: [Number], // 元素宽度  参见24栅格
      title: [String], // 搜索项名字
      key: [String], // 搜索项对应数据请求字段
      type: [String], // 可选项 input(文本框) select(下拉框) seek(搜索框), 用来确定搜索类型
      data: [Array],
        { // 仅限 type === (select || seek) 所有，选项数据
          value: [String], // 发送请求对应项
          name: [String] // 展示给用户的项
        }
      remoteMethod: [Function], // 仅限type === seek所有，用来请求数据
      loading: [Boolean] // 仅限type === seek所有，等待数据请求返回结果时等待使用
    }
  params: [Object] 请求列表数据时，初始化参数
  title: [String] 表格最外侧框题目  默认为 列表
  addModule: [Boolean] 是否需要展示新增
  dataCallBack: [Function] 数据请求，需要注意，需要在then中将 数据格式设置为 content 将总页数设置为 total
  handleSubmit: [Function Promise] 弹框点击确认事件的回调，必须使用Promise

  方法:
  // 更新数据
  调用vuex中mutations的方法 setCount 便可以更新数据

  插槽:
  add
  edit
  info

-->
<template>
  <div>
    <Modal
      v-model="modalParams.show"
      :title="modalParams.title"
      :ok-text="modalParams.okText"
      :loading="modalParams.modalLoading"
      :width="modalParams.width"
      @on-ok="asyncOK">
      <slot name="add" v-if="modalParams.type === 'add'" :flag="modalParams.show"></slot>
      <slot name="edit" v-if="modalParams.type === 'edit'" :flag="modalParams.show"></slot>
      <slot name="info" v-if="modalParams.type === 'info'" :flag="modalParams.show" :type="'black'"></slot>
    </Modal>
    <tableTemplate :columns="columns" :seek="seek" :params="params" :dataCallBack="dataCallBack">
      <a href="javascript:void(0)" @click="add()" slot="fun" v-if="addModule">
        <Icon type="edit"></Icon>
        {{modalParams.title}}
      </a>
    </tableTemplate>
  </div>
</template>

<script>
export default {
  name: 'commonTable',
  components: {
    tableTemplate: require('./templates').default
  },
  props: {
    params: { // 数据请求初始化参数
      type: Object
    },
    addModule: { // 是否需要新增模块
      type: Boolean,
      default: true
    },
    columns: { // 表格参数
      type: Array,
      default: () => []
    },
    seek: { // 搜索数据
      type: Array,
      default: () => []
    },
    dataCallBack: { // 列表数据回调
      type: Function,
      required: true
    },
    modalParams: { // 弹框信息
      type: Object,
      default: () => {
        return {
          width: 600,
          show: false,
          modalLoading: true,
          type: 'add',
          title: '新增'
        }
      }
    },
    infoData: Object,
    handleSubmit: {
      type: Function,
      required: false
    }
  },
  methods: {
    add () { // 新增
      this.modalParams.show = true
      this.$emit('add')
    },
    asyncOK () { // 确定事件
      if (this.modalParams.type !== 'info') {
        if (this.handleSubmit) {
          this.handleSubmit().then(res => {
            this.modalParams.modalLoading = false
          }).catch(err => {
            this.$Message.error(err)
            this.modalParams.modalLoading = false
            setTimeout(m => {
              this.modalParams.modalLoading = true
            }, 100)
          })
        }
      } else {
        this.modalParams.modalLoading = false
        setTimeout(m => {
          this.modalParams.show = false
          this.modalParams.modalLoading = true
        }, 100)
      }
    }
  }
}
</script>

<style scoped>

</style>
