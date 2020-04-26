<template>
  <el-container>

    <el-aside :width="isCollapse ? '66px' : '200px'">
      <a class="a" href="#" @click="setCollapse" v-if="!isCollapse">
        <div style="text-align: center">
          <span>YUE-COFFEE控制台</span>
          <img style="height: 45px; width: 125px" src="../../assets/img/logo.png">
        </div>
      </a>
      <a class="a" href="#" @click="setCollapse" v-if="isCollapse">
        <div style="text-align: center">
          <span>控制台</span>
        </div>
      </a>
      <el-menu
        router
        unique-opened
        background-color="#283443"
        text-color="white"
        active-text-color="#409EFF">
      </el-menu>
      <el-menu unique-opened router
               background-color="#283443"
               text-color="white" :collapse="isCollapse"
               :collapse-transition="false">
        <el-submenu :index=" '/' + item.path" v-for="item in this.menus" :key="item.menuId">
          <template slot="title">
            <i :class="item.iconPath"></i>
            <span>{{ item.content }}</span>
          </template>
          <el-menu-item-group v-for="sub in item.children" :key="sub.menuId">
<!--            <i :class="sub.iconPath"></i>-->
            <el-menu-item @click="select(editableTabsValue, sub.content)" :index="'/' + sub.path">{{ sub.content }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div>
        </div>
        <div>
          <el-dropdown trigger="click">
            <el-avatar shape="square" :src="this.admin.avatar"></el-avatar>
            <el-dropdown-menu placement="bottom-start" slot="dropdown">
              <a class="a" href="#"><el-dropdown-item>首页</el-dropdown-item></a>
              <a class="a" href="#" @click="logout"><el-dropdown-item>退出</el-dropdown-item></a>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <div style="background-color: #F4F4F5; height: 10px"></div>
      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <router-view>
          </router-view>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </el-container>

</template>

<script>
  import {getMenu} from '../../api/menu'

  export default {
    name: "home",
    components: {
    },
    data() {
      return {
        menus: {},
        admin: {},
        editableTabsValue: '',
        editableTabs: [

        ],
        tabIndex: 0,
        isCollapse: false
      }
    },
    methods: {
      logout: function() {
        sessionStorage.clear()
        this.$router.push({path: '/'})
      },
      select: function (editableTabsValue, title) {
        for (let i = 0; i < this.editableTabs.length; i++) {
          if (this.editableTabs[i].title == title) {
            this.removeTab(this.editableTabs[i].name)
          }
        }
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: title,
          name: newTabName,
        });
        this.editableTabsValue = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      async getMenu() {
        getMenu(this.admin.rid).then((response) => {
          if (response.code != 200) {
            this.$message.error(response.message)
          } else {
            this.menus = response.data
          }
        })
      },
      setCollapse() {
        this.isCollapse = !this.isCollapse
      },
    },
    created() {
      let admin = JSON.parse(sessionStorage.getItem('admin'))
      this.admin = admin
      this.getMenu()
    },
  }
</script>

<style lang="scss" scoped>
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  .el-container {
    height: 100%;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 50px;
    padding-top: 0.3%;
  }

  .el-aside {
    background-color: #283443;
    color: white;
    line-height: 60px;
    justify-content: space-between;
    .el-menu {
      border-right: none;
    }
    .a{
      text-decoration: none;
      color: #F4F4F5;
    }
  }

  .el-main {
    background-color: white;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .el-avatar {
    height: 50px;
    width: 50px;
    line-height: 400%;
    border: none;
  }
  .a{
    text-decoration: none;
  }
</style>
