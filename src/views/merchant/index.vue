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
            <el-button type="primary" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table stripe border :data="merchants" width="">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="商户名称" prop="name"></el-table-column>
          <el-table-column label="商户介绍" prop="desc"></el-table-column>
          <el-table-column label="商户地址" prop="address"></el-table-column>
          <el-table-column label="联系方式" prop="phone"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="setAdminStatus(scope.row.status, scope.row.aid)" v-if="scope.row.status === 1">营业</el-button>
              <el-button type="danger"  plain @click="setAdminStatus(scope.row.status, scope.row.aid)" v-else-if="scope.row.status === 2">停业</el-button>
              <el-button type="warning" v-else>异常</el-button>
            </template>
          </el-table-column>
          <el-table-column :formatter="dateForma" prop="createTime" label="入驻时间"></el-table-column>
          <el-table-column align="right">
            <!--<template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>-->
            <template slot="header">操作</template>
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
<!--              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.aid, scope.row.name)">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes=pagesizes
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getMerchant } from "../../api/merchant";
  import moment from "moment";

  export default {
    name: "merchant",
    data() {
      return{
        merchants: [],
        pagesizes:[2, 5, 10],
        total: 0
      }
    },
    methods: {
      getMerchant() {
        getMerchant().then((response) => {
          if (response.code == 200) {
            this.merchants = response.data
            this.total = this.merchants.length
            console.log(this.merchants)
          }
        })
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
      this.getMerchant()
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

  .a{
    text-decoration: none;
  }
</style>
