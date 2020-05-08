<template>
  <div>
    <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="query" placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search" @click="handleSelect()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleCreate()">添加</el-button>
          </el-col>
        </el-row>
        <el-table stripe border :data="admins">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="手机号" prop="phone"></el-table-column>
          <el-table-column label="管理员角色" prop="roles"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="setAdminStatus(scope.row.status, scope.row.aid)" v-if="scope.row.status === 1">正常</el-button>
              <el-button type="danger"  plain @click="setAdminStatus(scope.row.status, scope.row.aid)" v-else-if="scope.row.status === 2">禁用</el-button>
              <el-button type="warning" v-else>异常</el-button>
            </template>
          </el-table-column>
          <el-table-column :formatter="dateForma" prop="createTime" label="添加时间"></el-table-column>
          <el-table-column align="right">
            <!--<template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>-->
            <template slot="header">操作</template>
            <template slot-scope="scope">
              <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.aid, scope.row.name)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          :page-sizes="pagesizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="添加管理员" @close="resetForm" :visible.sync="dialogFormVisible">
      <el-form :model="adminForm" :rules="adminRules" ref="adminFormRef">
        <el-form-item label="姓名" :label-width="formLabelWidth" ref="name" prop="name">
          <el-input v-model="adminForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" ref="phone" prop="phone">
          <el-input v-model="adminForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" ref="password" prop="password">
          <el-input v-model="adminForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="adminForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" ref="roles" prop="roles">
          <el-select v-model="adminForm.roles" placeholder="管理员角色">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="普通管理员" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? handleAdd() : handleEdit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getAllAdminByNameOrPhone, setAdminStatus, delAdmin, addAdmin, updateAdmin } from '../../api/admin'
  import moment from 'moment'

  export default {
    name: "admin",
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value == null || value == '') {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        if (value == null || value == '') {
          callback(new Error('手机号不能为空'))
        } else if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
          callback()
        } else {
          callback(new Error('手机号格式不正确'))
        }
      }
      return {
        admins: [],
        dialogStatus: '',
        adminForm: {
          aid: -1,
          name: '',
          phone: '',
          password: '',
          introduction: '',
          roles: ''
        },
        page: {
          pageNo: 1,
          pageSize: 5,
          total: 0
        },
        pagesizes:[2, 5, 10],
        query: '',
        dialogFormVisible: false,
        formLabelWidth: '230px',
        adminRules: {
          name: [{required: true, trigger: 'blur', validator: validateUsername}],
          phone: [{required: true, trigger: 'blur', validator: validatePhone}],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          roles: [{required: true, trigger: 'change', message: '必须选择管理员角色'}]
        }
      }
    },
    methods: {
      /**
       * 查询所有管理员
       */
     async getAllAdmin() {
        getAllAdminByNameOrPhone().then((response) => {
          this.admins = response.data.data
          this.page.total = response.data.total
          this.page.pageNo  = response.data.pageNo
          this.page.pageSize  = response.data.pageSize
        })
      },
      /**
       * 编辑管理员信息
       * @param index
       * @param row
       */
      handleEdit() {
        this.$refs.adminFormRef.validate(valid => {
          if (valid) {
            const params = new URLSearchParams()
            params.append("aid", this.adminForm.aid)
            params.append("name", this.adminForm.name)
            params.append("phone", this.adminForm.phone)
            params.append("password", this.adminForm.password)
            params.append("introduction", this.adminForm.introduction)
            params.append("rid", this.adminForm.roles)
            updateAdmin(params).then((response => {
              console.log(response)
              if (response.code == 200) {
                this.$message({
                  message: response.message,
                  type: 'success'
                });
                this.getAllAdmin()
              } else {
                this.$message({
                  message: response.message,
                  type: 'error'
                });
              }
            })).catch(response => {
              this.$message({
                message: response.message,
                type: 'error'
              });
            })
          } else {
            return;
          }
          this.dialogFormVisible = false
        })
      },
      /**
       * 点击编辑按钮时的部分数据处理
       */
      handleUpdate(index, row) {
        this.adminForm.aid = row.aid
        this.adminForm.name = row.name
        this.adminForm.phone = row.phone
        this.adminForm.password = row.password
        this.adminForm.introduction = row.introduction
        this.adminForm.roles = row.roles
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      /**
       * 删除管理员
       * @param index 表格中的序号（#）
       * @param aid   管理员id
       * @param name  管理员兴民
       */
      handleDelete(index, aid, name) {
        this.$confirm('此操作将永久删除管理员:' + name + ', 是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAdmin(aid).then((response) => {
            if (response.code == 200) {
              this.admins.splice(index, 1)
              this.getAllAdmin()
              this.$message({
                type: 'success',
                message: response.message
              });
            } else {
              this.$message({
                type: 'error',
                message: response.message
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      },
      /**
       * 点击添加按钮时的部分数据处理
       */
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      /**
       * 添加管理员
       */
      handleAdd() {
        this.$refs.adminFormRef.validate(valid => {
          if (valid) {
            const params = new URLSearchParams()
            params.append("name", this.adminForm.name)
            params.append("phone", this.adminForm.phone)
            params.append("password", this.adminForm.password)
            params.append("introduction", this.adminForm.introduction)
            params.append("rid", this.adminForm.roles)
            addAdmin(params).then((response => {
              console.log(response)
              if (response.code == 200) {
                this.$message({
                  message: response.message,
                  type: 'success'
                });
                this.getAllAdmin()
              } else {
                this.$message({
                  message: response.message,
                  type: 'error'
                });
              }
            })).catch(response => {
              this.$message({
                message: response.message,
                type: 'error'
              });
            })
          } else {
            return;
          }
          this.dialogFormVisible = false
        })
      },
      /**
       * 切换每页记录数
       * @param val 每页记录数
       */
      handleSizeChange(val) {
        this.page.pageSize = val
        let params = new URLSearchParams()
        params.append("pageSize", this.page.pageSize)
        params.append("query", this.query)
        getAllAdminByNameOrPhone(params).then((response) => {
          this.admins = response.data.data
          this.page.total = response.data.total
        })
      },
      /**
       * 上一页下一页
       * @param val 页码
       */
      handleCurrentChange(val) {
        this.page.pageNo = val
        let params = new URLSearchParams()
        params.append("pageSize", this.page.pageSize)
        params.append("pageNo", this.page.pageNo)
        params.append("query", this.query)
        getAllAdminByNameOrPhone(params).then((response) => {
          this.admins = response.data.data
          this.page.total = response.data.total
        })
      },
      /**
       * 查询
       */
      handleSelect() {
        let params = new URLSearchParams()
        params.append("pageSize", this.page.pageSize)
        params.append("pageNo", this.page.pageNo)
        params.append("query", this.query)
        getAllAdminByNameOrPhone(params).then((response) => {
          this.admins = response.data.data
          this.page.total = response.data.total
        })
      },
      /**
       * 表单重置
       */
      resetForm() {
        this.$refs.adminFormRef.resetFields()
      },
      /**
       * 设置管理员状态
       * @param status
       * @param adminId
       */
      setAdminStatus(status, adminId) {
        let message = ''
        if (status == 1) {
          message = '此操作将禁用此管理员, 是否继续?'
          status = 2
        } else if (status == 2) {
          message = '此操作将恢复此管理员对系统的管理, 是否继续?'
          status = 1
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = new URLSearchParams()
          params.append('aid', adminId)
          params.append('status', status)
          setAdminStatus(params).then((response) => {
            if (response.code == 200) {
              for (let i = 0; i < this.admins.length; i++) {
                if (this.admins[i].aid == adminId) {
                  this.admins[i].status = status
                  break
                }
              }
              this.$message({
                type: 'success',
                message: response.message
              });
            } else {
              this.$message({
                type: 'error',
                message: response.message
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          });
        });
      },
      /**
       * 时间格式化（加入moment.js）
       * @param row
       * @param column
       * @returns {string}
       */
      dateForma(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return ''
        }
        return moment(date).format("YYYY-MM-DD")
      }
    },
    /**
     * 钩子函数在此组件创建之前调用获取所有管理员方法
     */
    created() {
      this.getAllAdmin()
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-table th > .cell {
    text-align: center;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }

  .box-card {
    width: 100%;
    height: 100%;
    /*margin-left: 3%;*/
    /*margin-right: 3%;*/
    .block{
      margin-top: 2%;
      margin-bottom: 1%;
      float: right;
    }
  }

  .el-dialog{
    .el-input{
      margin-right: 17.5%;
      margin-leftl: 17.5%;
      width: 65%;
    }
    .el-select{
      margin-right: 17.5%;
      margin-leftl: 17.5%;
      width: 65%;
    }
  }

  .a{
    text-decoration: none;
  }
</style>
