<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search" @click="handleSelect(scope.$index, scope.row)"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleAdd()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table stripe border :data="admins" width="">
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
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.aid, scope.row.name)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getAllAdmin, setAdminStatus, delAdmin } from '../../api/admin'
  import moment from 'moment'

  export default {
    name: "admin",
    data() {
      return {
        admins: [],
      }
    },
    methods: {
      getAllAdmin() {
        getAllAdmin().then((response) => {
          this.admins = response.data
          console.log(this.admins)
        })
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, aid, name) {
        this.$confirm('此操作将永久删除管理员:' + name + ', 是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAdmin(aid).then((response) => {
            if (response.code == 200) {
              this.admins.splice(index, 1)
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
      handleAdd() {

      },
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
      dateForma(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return ''
        }
        return moment(date).format("YYYY-MM-DD")
      }
    },
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
  }

  .a{
    text-decoration: none;
  }
</style>
