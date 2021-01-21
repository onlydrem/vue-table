/**
  功能：表格封装
  作者：程杰
  邮箱：chengjie@cebc.cn
  创建时间：2021/1/12 14:04
**/
<template>
  <div>
    <el-table :data="table_data"
              style="width:99.9%"
              v-loading="listLoading"
              max-height="702">
      <el-table-column type="index"
                       label="序号"
                       width="100"/>
      <template v-for="item in init_config.thead">
        <el-table-column v-if="item.type==='amount'" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <div>
              {{ price( scope.row.voucherAmount) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.type==='name'" :prop="item.prop" :label="item.label"
                         :width="item.width" show-overflow-tooltip/>
        <el-table-column v-else-if="item.type==='operation'" :prop="item.prop" :label="item.label" fixed="right"
                         :min-width="item.width">
          <template slot-scope="scope">
            <template v-if="item.buttonGroup && item.buttonGroup.length>0">
              <template v-for="(button, index) in item.buttonGroup">
                <el-button
                  v-if="button.event === 'button' && scope.row.userId === null"
                  :type="button.type"
                  :key="index"
                  @click="button.handlerClim && button.handlerClim(scope.row)" size="small">
                  {{ button.label }}
                </el-button>
                <el-button v-if="button.event === 'link' && scope.row.userId !== null" class="mr-10" :type="button.type"
                           @click="button.handler && button.handler(scope.row)" size="small">{{ button.label }}
                </el-button>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column v-else :prop="item.prop" :label="item.label"
                         :width="item.width"/>
      </template>
    </el-table>
    <div class="pagination">
      <pagination v-show="total > 0"
                  :total="total"
                  :page.sync="listQuery.page"
                  :limit.sync="listQuery.limit"
                  @pagination="initConfig"
      />
    </div>
  </div>
</template>

<script>
  import Pagination from "@co/Pagination";
  import {getVoucherTaskList} from '../common-api/index'
  export default {
    name: 'base-table',
    props: {
      tableConfig: {
        type: Object,
        default: () => ({})
      },
    },
    components: {
      Pagination
    },
    data() {
      return {
        total: 0,
        listLoading: false,
        table_data: [],
        init_config: {
          thead: [],
          url: '',
          data: {}
        },
        listQuery: {
          page: 1,
          limit: 10,
        },
      }
    },
    mounted() {},
    computed: {},
    methods: {
      initConfig() {
        for (let key in this.tableConfig) {
          if (Object.keys(this.init_config).includes(key)) {
            this.init_config[key] = this.tableConfig[key]
          }
        }
        const concatData = {
          pageNum: this.listQuery.page,
          pageSize: this.listQuery.limit,
        }
        const setparams = {
          url: this.init_config.url,
          data: Object.assign(this.init_config.data, concatData)
        }
        this.getTableData(setparams)
      },
      getTableData(requestParams) {
        this.listLoading = true
        getVoucherTaskList(requestParams).then(res => {
          this.listLoading = false
          this.table_data = res.records
          this.total = res.total
        }).catch(err => {
          this.listLoading = false
        })
      },
      queryForm(params) {
        let setparams
        if(params) {
          const concatData = {
            pageNum: this.listQuery.page,
            pageSize: this.listQuery.limit,
          }
          setparams = {
            url: this.init_config.url,
            data: Object.assign(params, concatData)
          }
        }
        this.getTableData(setparams)
      }
    },
    watch: {
      tableConfig: {
        handler(newVal) {
          this.initConfig()
        },
        immediate: true,
        deep: true
      },
      'listQuery.limit': {
        handler(newVal) {
          if(newVal) {
            this.listQuery.page = 1
          }
        }
      }
    },
    filters: {}
  }
</script>

<style scoped>
  .mr-10 {
    margin-right: 10px;
  }
</style>
