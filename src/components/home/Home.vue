<template>
  <el-container class="home_container">
    <!-- 顶部  上-->
    <el-header>
      <div>
        <img src="@/assets/img/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quitLogin">退出</el-button>
    </el-header>
    <!-- 下 -->
    <el-container>
      <!-- 侧边栏 左-->
      <el-aside :width="isCollapse ? '61px' : '200px'">
        <!-- 导航按钮 -->
        <div class="toggle_button" @click="toggleCollpase">|||</div>
        <!-- 导航菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级导航 -->
          <!-- index只支持字符串  el-menu router属性针对el-menu-item生效 -->
          <el-submenu v-for="item in menuList" :index="item.id + ''" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <!-- 路由跳转 el-menu-item index绑定url - -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveActivePath('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 标题 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 右-->
      <el-main>
        <router-view :menuList="menuList"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      activePath: '',
      isCollapse: false,
      icons: {
        // 一级菜单的icon图标
        147: 'el-icon-magic-stick',
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
    }
  },
  methods: {
    quitLogin() {
      //   window.sessionStorage.removeItem('')
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.err(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList, 'menus', res, 'getMenuListRes')
    },
    saveActivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    toggleCollpase() {//切换 合并 展开
      this.isCollapse = !this.isCollapse
    },
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  min-width: 1366px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  //整体侧边栏背景
  background-color: #333744;
  .toggle_button {
    background: #4a5064;
    cursor: pointer;
    color: #fff;
    letter-spacing: 0.2em;
    font-size: 10px;
    text-align: center;
    line-height: 24px;
  }
  .el-menu {
    border-right: none;
  }
  .iconfont {
    padding-right: 10px;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>