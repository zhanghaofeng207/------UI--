<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="房间名称" prop="roomName">
        <el-input
          v-model="queryParams.roomName"
          placeholder="请输入房间名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间位置" prop="roomPlace">
        <el-input
          v-model="queryParams.roomPlace"
          placeholder="请输入房间位置"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科室名称" prop="dpName">
        <el-input
          v-model="queryParams.dpName"
          placeholder="请输入科室名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['smh:room:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['smh:room:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['smh:room:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['smh:room:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="房间id" align="center" prop="roomId" />
      <el-table-column label="房间名称" align="center" prop="roomName" />
      <el-table-column label="房间位置" align="center" prop="roomPlace" />
      <el-table-column label="科室名称" align="center" prop="dpName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['smh:room:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['smh:room:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改房间管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="form.roomName" placeholder="请输入房间名称" />
        </el-form-item>
        <el-form-item label="房间位置" prop="roomPlace">
          <el-input v-model="form.roomPlace" placeholder="请输入房间位置" />
        </el-form-item>
        <el-form-item label="科室名称" prop="dpName">
          <el-select v-model="form.dpName" placeholder="请选择科室名称">
    <el-option
      v-for="department in departments"
      :key="department.dpId"
      :label="department.dpName"
      :value="department.dpName"
    />
  </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRoom, getRoom, delRoom, addRoom, updateRoom, exportRoom } from "@/api/smh/room";
import { listDepartment } from '@/api/smh/department'; // 确保路径 

export default {
  name: "Room",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 房间管理表格数据
      roomList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,


      departments: [], // 新增：用于存储科室数据  

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roomName: null,
        roomPlace: null,
        dpName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDepartments(); // 新增：获取科室数据 
  },
  methods: {
    /** 查询房间管理列表 */
    getList() {
      this.loading = true;
      listRoom(this.queryParams).then(response => {
        this.roomList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        roomId: null,
        roomName: null,
        roomPlace: null,
        dpName: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roomId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加房间管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roomId = row.roomId || this.ids
      getRoom(roomId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改房间管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roomId != null) {
            updateRoom(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRoom(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roomIds = row.roomId || this.ids;
      this.$confirm('是否确认删除房间管理编号为"' + roomIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRoom(roomIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有房间管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRoom(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
        getDepartments(){
      this.loading = true;
      listDepartment(this.queryParams).then(response => {
        this.departments = response.rows;
        console.log(this.departments);
        this.loading = false;
      });
    },
  }
};
</script>
