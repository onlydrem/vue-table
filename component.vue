<!--
  签发审核
-->
<template>
  <div class="rejection-issue">
    <el-card shadow="never" class="form-top">
      <query-form ref="queryForm"
                  :ruleForm="ruleForm"
                  :fields="fields"
                  @submitForm="submitForm">
      </query-form>
    </el-card>

    <el-card shadow="never">
      <BaseTable ref="baseTable" :tableConfig="this.table_config"/>
    </el-card>
  </div>
</template>

<script>
import BaseTable from '../../../voucherComponent/base-table'
import {IssueReview} from '../../../voucherComponent/voucher-task/index'
import QueryForm from "@co/QueryForm";
import { claimTask } from "@a/cebc-voucher/voucher-task";
import { handleConfirm } from "@co/MyMessageBox";
export default {
  name: "IssueReview",
  components: {
    BaseTable,
    QueryForm
  },
  data () {
    return {
      listLoading: true,
      table_config: {
        thead: [
          {
            type: 'normal',
            prop: 'voucherNo',
            label: '凭证编号',
            width: '250px'
          },
          {
            type: 'amount',
            prop: 'voucherAmount',
            label: '凭证金额（元）',
            width: '200px'
          },{
            type: 'normal',
            prop: 'promisedPaymentDate',
            label: '承诺付款日期',
            width: '180px'
          },
          {
            type: 'name',
            prop: 'ownerOrgName',
            label: '收款方',
            width: '200px'
          },{
            type: 'normal',
            prop: 'curVoucherStatusCname',
            label: '凭证状态',
            width: '200px'
          },{
            type: 'normal',
            prop: 'createTime',
            label: '创建时间',
            width: '200px'
          },{
            type: 'operation',
            label: '操作',
            width: '150px',
            default: {
              deleteButton: true,
              editButton: true
            },
            buttonGroup: [
              { label: "认领", type: "text", event: "button", handlerClim: (data) => this.reviewClaimTask(data)  },
              { label: "审核", type: "text", event: "link", key: "id", value: "id", handler: (data) => this.reviewconfirm(data)},
            ]
          },
        ],
        url: 'queryAllTask',
        data: {
          processTypeList: ['cebc_zhuxin_issue_voucher'],
          receiptOrgName: '', // 收款方名称
          paymentOrgName: "", // 付款方名称
          taskKey: "check_issue",
          voucherNo: '', // 凭证编号名称
          username: '',
        },
      },
      ruleForm: {
        receiptOrgName: "", // 	收款方机构名称(模糊查询)
        voucherNo: "", // 	凭证编号
      },
      fields: [
        {
          id: 1,
          fieldName: "凭证编号",
          fieldCode: "voucherNo",
          fieldType: "INPUT",
        },
        {
          id: 2,
          fieldName: "收款方",
          fieldCode: "receiptOrgName",
          fieldType: "INPUT",
        }
      ],
      tableData: [],
    };
  },
  created () {

  },
  computed: {

  },
  mounted () {
  },
  methods: {
    reviewClaimTask ( rows) {
      const params = {
        taskId: rows.taskId, // 任务Id
        voucherId: rows.voucherId, // 凭证Id
      };
      handleConfirm("确认认领该任务吗")
        .then((data) => {
          claimTask(params)
            .then((data) => {
              this.$refs.baseTable.initConfig()
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitForm (value) {
      this.ruleForm = value;
      const params = {
        processTypeList: ['cebc_zhuxin_issue_voucher'],
        receiptOrgName: this.ruleForm.receiptOrgName, // 收款方名称
        paymentOrgName: "", // 付款方名称
        taskKey: "check_issue",
        voucherNo: this.ruleForm.voucherNo, // 凭证编号名称
        username: '',
      };
      this.$refs.baseTable.queryForm(params)
    },
    reviewconfirm ( rows) {
      this.$store.commit('voucher/getIssueType', rows.agencyFlag)
      this.$router.push(
        `/core/issue-review/review-detail/${rows.voucherId}/${rows.taskId}/${rows.voucherNo}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.form-top{
  margin-bottom: 12px;
}
</style>
