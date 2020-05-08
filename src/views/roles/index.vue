<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button style="margin-bottom: 15%;" type="primary" @click="handleCreate()">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.right" border>
              <el-table-column  label="一级目录">
                <template slot-scope="scope">
                  <el-tag>{{ scope.row.name }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="二级目录">
                <template slot-scope="sub">
                  <el-tag type="success" v-for="(item, i) in sub.row.children" :key="item.rightsId">{{ item.name }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="可执行操作">
                <template slot-scope="sub1">
                  <template v-for="(item1, i1) in sub1.row.children">
                    <el-tag  type="warning" v-for="(item2, i2) in item1.children" :key="item2.rightsId">
                      {{ item2.name }}
                    </el-tag>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roles" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column prop="rlevel" label="操作">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" size="mini" icon="el-icon-edit">分配</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getAllRoles} from '../../api/rights'

  export default {
    name: "roles",
    data() {
      return {
        rolesList: [

        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      async getAllRoles() {
        getAllRoles().then((response) => {
          console.log(response)
          if (response.code != 200) {
            return this.$message.error("获取角色列表失败")
          }
          this.rolesList = response.data
        })
        console.log(this.rolesList)
      }
    },
    created() {
      this.getAllRoles()
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

  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #F4F4F5;
  }

  .bdbottom {
    border-bottom: 1px solid #F4F4F5;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
