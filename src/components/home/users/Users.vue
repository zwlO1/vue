<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <!-- <BreadCrumb :firstNav="menuList[0].authName" :secondNav="menuList[0].children[0].authName" /> -->
    <BreadCrumb firstNav="用户管理" secondNav="用户列表" />
    <!-- 数据视图 -->
    <el-card>
      <!-- el-row el-col  一行两列   gutter行内元素间距  span-->
      <!-- 搜索与添加-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">用户添加</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息 -->
      <!-- data 数据源  prop数据属性字段   stripe border 边框样式-->
      <el-table :data="userData.userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 状态按钮 -->
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
          <!-- 操作按钮 -->
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRolesDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        @current-change="pagechange"
        :page-size="queryInfo.pagesize"
        @size-change="sizeChange"
        :page-sizes="[5, 9, 13, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="resetAddFrom">
      <!-- 内容表单 -->
      <el-form label-width="70px" ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息 对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisble" @close="getUserList" width="50%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisble=false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      @close="selectRoleId=''"
      width="50%"
    >
      <div>
        <p>当前的用户 : {{ userInfo.username }}</p>
        <p>当前的角色 : {{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from '@/components/home/BreadCrumb'
import { userAddFormRulesMixin } from '@/common/mixin.js'

export default {
  name: 'Users',
  props: { menuList: Array },
  mixins: [userAddFormRulesMixin],
  components: { BreadCrumb },
  data() {
    return {
      //用于请求的参数对象  get
      queryInfo: {
        //搜索关键字
        query: '',
        // 当前页
        pagenum: 1,
        //页面展示数据条数
        pagesize: 5
      },
      //用户数据 本地渲染
      userData: {
        userList: [],
        total: 0
      },
      //添加用户对话框的显示/隐藏控制
      addDialogVisible: false,
      //修改对话框的显示/隐藏控制
      editDialogVisble: false,
      //设置角色对话框
      setRolesDialogVisible: false,
      // 添加用户信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //编辑用户信息
      editForm: {},
      //角色信息
      rolesList: [],
      //当前用户信息
      userInfo: {},
      //选中的角色id
      selectRoleId: ''
    }
  },
  methods: {
    //获取接口数据 存于userData
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res, 'getUserListRes');
      if (res.meta.status !== 200) this.$message.error('获取用户列表失败')
      this.$message.success('获取用户列表成功')
      this.userData.userList = res.data.users
      this.userData.total = res.data.total
      console.log(this.userData, 'userData');
    },
    //pagesize 改变
    sizeChange(newSize) {
      console.log(newSize, 'newSize');
      this.queryInfo.pagesize = newSize
      this.getUserList()//展示条数改变 重新请求数据 加载
    },
    //pagenum 改变
    pagechange(newPage) {
      console.log(newPage, 'newPage');
      this.queryInfo.pagenum = newPage
      this.getUserList()//跳转页数 重新请求数据 加载
    },
    //state 改变
    async stateChanged(userInfo) {
      console.log(userInfo, "scope.row");
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state//scope.row 
        console.log(userInfo, "scope.row");
        return this.$message.error('更新用户信息失败')
      }
      return this.$message.success('更新用户信息成功')
    },
    //点击确定 添加用户
    //后台验证用户是否存在
    addUser() {
      //表单规则验证      
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          // console.log(res, 'addUserRes');
          return this.$message.error(res.meta.msg)
        }
        //添加成功  关闭对话框  重新获取数据
        this.addDialogVisible = false
        this.getUserList()
        return this.$message.success('用户添加成功')
      })
    },
    //关闭添加用户表单 重置信息
    resetAddFrom() {
      this.$refs.addFormRef.resetFields()
    },
    //点击编辑 获取当前数据 存储editForm临时使用 显示编辑对话框
    showEditDialog(editData) {
      console.log(editData, 'scope.row');
      //  await this.$http.get('users/'+editData.id) //用户是否存在
      this.editForm = editData
      this.editDialogVisble = true
    },
    // 点击确定 修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败')
        //修改成功  关闭编辑对话框  重新获取数据 加载
        this.editDialogVisble = false
        this.getUserList()
        // this.editForm=[]
        return this.$message.success('更新用户信息失败')
      })
    },
    //点击删除用户
    async deleteUser(id) {
      //确认删除   tips title options选项
      const confirmRusult = await this.$confirm('确认删除此用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => console.log(res))
      // 点击确定 then正常返回confirm   点击取消 抛出异常 catch 捕获cancel 
      console.log(confirmRusult, 'deleteUserConfirmed');
      if (confirmRusult !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        console.log(res, 'res');
        return this.$message.error('删除失败')
      }
      this.getUserList()//重新获取数据 加载
      return this.$message.success(res.meta.msg)
    },
    //展示用户角色设置对话框
    async showSetRolesDialog(userInfo) {
      //存储当前scope.row 渲染对话框
      this.userInfo = userInfo
      // 获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      console.log(res, 'rolesRes')
      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
    //点击确定 设置用户角色
    async saveSetRoles() {
      //判断是否有选择角色
      if (!this.selectRoleId) return this.$message.error('未选择要分配的角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')
      this.setRolesDialogVisible = false
      this.getUserList()
      return this.$message.success('角色已更新')
    }
  },
  created() {
    // console.log(this.menuList);
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
