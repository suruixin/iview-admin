<!--
  参数:
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
  dataCallBack: [Function] 数据请求，需要注意，需要在then中将 数据格式设置为 content 将总页数设置为 total

  方法:
  // 更新数据
  调用vuex中mutations的方法 setCount 便可以更新数据

  插槽:
  开放一个插槽 fun  位于表格上方 及表格title 所在位置，用来添加新增等方法
  例子:
    <customTable :columns="columns" :seek="seek" :params="params" ref="templates" :dataCallBack="dataCallBack">
      <a href="javascript:void(0)" @click="add()" slot="fun">
        <Icon type="add"></Icon>
        新增
      </a>
    </customTable>
-->
<template>
<div class="custom">
    <Card v-if="seek.length > 0">
        <p slot="title">
            查询
        </p>
        <a href="javascript:void(0)" slot="extra" @click="resetForm('重置')">
            <Icon type="ios-loop-strong"></Icon>
            重置
        </a>
        <Form ref="queryForm" :model="queryForm" :rules="ruleValidate" :label-width="90" label-position="right" v-if="seek">
            <Row>
                <Col v-for="(item,index) in seek" :span="(item.span||'5')" :key="index">
                    <FormItem :label="item.title" prop="caseNo">
                        <Input v-model.trim="queryForm[item.key]" v-if="item.type === 'input'" :placeholder="'请输入'+item.title" :clearable="true" />
                        <Select ref="form_select" v-model="queryForm[item.key]"  v-else-if="item.type === 'select'" :placeholder="'请选择'+item.title" clearable>
                            <Option v-for="(it,index) in item.data" :value="it.value" :key="index">{{it.name}}</Option>
                        </Select>
                        <Select ref="form_seek" v-model="queryForm[item.key]"  v-else-if="item.type === 'seek'" :placeholder="'请选择'+item.title" remote filterable :remote-method="item.remoteMethod" :loading="item.loading" :clearable="true" >
                            <Option v-for="(it,index) in item.data" :value="it.value" :key="index">{{it.name}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="4" style="text-align:right;">
                    <Button type="primary" @click="queryList()">查询</Button>
                </Col>
            </Row>
        </Form>
    </Card>
    <Card>
        <p slot="title">
            {{title}}
        </p>
        <slot name="fun" slot="extra"></slot>
        <!--<a @click="exportCsv" slot="extra">-->
            <!--<Icon type="ios-loop-strong"></Icon>-->
            <!--导出-->
        <!--</a>-->
        <a @click="resetForm('刷新')" slot="extra">
            <Icon type="ios-loop-strong"></Icon>
            刷新
        </a>
        <Table stripe :columns="columns" :data="tableData" :loading="loading" class="no-border" ref="table"/>
        <Page
                style="margin-top: 10px"
                :total="total"
                :page-size="pageSize"
                :current="currentPage"
                show-total show-elevator
                @on-change="pageChanged"
        />
        <div style="clear:both;"></div>
    </Card>
</div>
</template>
<script>
export default {
  data () {
    return {
      loading: false, // 表格加载状态
      caseProgress: [],
      queryForm: {}, // 搜索项
      searchCondition: [],
      ruleValidate: { // 搜索项正则
        userName: [
          { max: 20, message: '请输入20字以内用户名', trigger: 'blur' }
        ]
      },
      tableData: [], // 数据
      total: 0, // 数据总条数
      currentPage: 1, // 默认页码
      pageSize: 10,
      param: {}
    }
  },
  props: {
    columns: Array,
    seek: {
      type: Array,
      default: () => []
    },
    params: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '列表'
    },
    dataCallBack: {
      type: Function
    }
  },
  methods: {
    exportCsv () {
      this.$refs.table.exportCsv({
        filename: this.title
      })
    },
    pageChanged (page) { // 页码点击事件
      this.currentPage = page
      Object.assign(this.param, { page: this.currentPage - 1 })
      this.getData()
    },
    getData () {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.dataCallBack(Object.assign(this.param, this.params, this.queryForm, { page: this.currentPage - 1 })).then(res => {
          if (res.content && res.content.length === 0 && this.currentPage !== 1) { // 处理为最后一页仅一条数据时删除该数据页面数据无法加载的问题
            this.currentPage--
            return this.getData()
          } else {
            this.tableData = res.content
            this.total = res.total
            setTimeout(m => {
              this.loading = false
            }, 300)
            resolve(res)
          }
        }).catch(err => {
          this.$Message.error('获取信息失败！请稍后再试！')
          this.loading = false
          reject(err)
        })
      })
    },
    resetForm (test) { // 重置搜索项
      if (test === '重置') {
        this.currentPage = 1
        this.$refs['queryForm'].resetFields()
        if (this.$refs['form_select'] && this.$refs['form_select'].length > 0) {
          // 解决重置后，下拉列表显示不全的问题
          for (let item of this.$refs['form_select']) {
            item.clearSingleSelect()
          }
        }
        Object.keys(this.queryForm).map(m => {
          this.queryForm[m] = ''
        })
      }
      this.getData().then(res => {
        this.$Message.success(`${test}成功！`)
      })
    },
    queryList () { // 搜索事件
      this.currentPage = 1
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  watch: {
    '$store.state.count' () {
      if ((this.total - 1) % 10 === 0) {
        this.currentPage -= 1
        if (this.currentPage === 0) this.currentPage += 1 // 当前页面不可能为0
      }
      this.getData()
    }
  }
}
</script>
<style lang="less">
  .no-border{
    border-color: transparent;
    .ivu-table:before, .ivu-table:after {
      background-color: transparent;
    }
    .ivu-poptip-confirm .ivu-poptip-footer{
      text-align: left;
    }
  }
  .custom{
    .ivu-card{
      margin-bottom: 6px;
    }
    .ivu-form-item{
      margin-bottom: 1px;
    }
    .ivu-card-head{
      padding: 8px 16px;
    }
    .ivu-card-body{
      padding: 5px
    }
  }
</style>
