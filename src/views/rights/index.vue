<template>
  <div>
    <el-card class="box-card">
      <el-table :data="rightsList" stripe border >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.level === 1">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === 2">二级</el-tag>
            <el-tag v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getRights} from '../../api/rights'

  export default {
    name: "rights",
    data() {
      return {
        rightsList: []
      }
    },
    methods: {
      async getRights() {
        getRights().then((response) => {
          console.log(response)
          if (response.code != 200) {
            return this.$message.error("获取权限列表失败")
          }

          this.rightsList = response.data
        })
      }
    },
    created() {
      this.getRights()
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
</style>
