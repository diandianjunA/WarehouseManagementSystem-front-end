# 仓库管理系统

## 项目效果图

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture5.png)

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture6.png)

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture7.png)

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture8.png)

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture9.png)

## 一、创建后端项目

### 创建数据库

sql文件如下(后端项目中也有)

```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
                        `id` int NOT NULL AUTO_INCREMENT COMMENT '物品id',
                        `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '物品名',
                        `storage_id` int NULL DEFAULT NULL COMMENT '所属仓库id',
                        `goods_type_id` int NULL DEFAULT NULL COMMENT '所属分类id',
                        `count` int NULL DEFAULT NULL COMMENT '数量',
                        `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
                        PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for goods_type
-- ----------------------------
DROP TABLE IF EXISTS `goods_type`;
CREATE TABLE `goods_type`  (
                             `id` int NOT NULL AUTO_INCREMENT COMMENT '物品分类id',
                             `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '物品分类名',
                             `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for record
-- ----------------------------
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record`  (
                         `id` int NOT NULL AUTO_INCREMENT COMMENT '记录id',
                         `goods_id` int NULL DEFAULT NULL COMMENT '物品id',
                         `user_id` int NULL DEFAULT NULL COMMENT '取货人/补货人id',
                         `admin_id` int NULL DEFAULT NULL COMMENT '操作人id',
                         `count` int NULL DEFAULT NULL COMMENT '数量',
                         `create_time` datetime NULL DEFAULT NULL COMMENT '操作时间',
                         `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
                         PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for storage
-- ----------------------------
DROP TABLE IF EXISTS `storage`;
CREATE TABLE `storage`  (
                          `id` int NOT NULL AUTO_INCREMENT COMMENT '仓库id',
                          `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '仓库名',
                          `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '备注',
                          PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 149770244 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
                       `id` int NOT NULL AUTO_INCREMENT COMMENT '用户的id',
                       `account` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '用户的账号',
                       `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '用户的名字',
                       `password` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '用户的密码',
                       `age` int NULL DEFAULT NULL COMMENT '用户的年龄',
                       `sex` int NULL DEFAULT NULL COMMENT '用户的性别',
                       `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '用户的电话号码',
                       `role_id` int NULL DEFAULT NULL COMMENT '角色 0超级管理员 1管理员 2普通账号',
                       `valid` int NULL DEFAULT NULL COMMENT '账号是否有效',
                       PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

```

### 实现增删改查

```java
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public List<User> list(){
        return userService.list();
    }

    @PostMapping("/save")
    public boolean save(@RequestBody User user){
        return userService.save(user);
    }

    @PostMapping("/mod")
    public boolean mod(@RequestBody User user){
        return userService.updateById(user);
    }

    @PostMapping("/saveOrMod")
    public boolean saveOrMod(@RequestBody User user){
        return userService.saveOrUpdate(user);
    }

    @GetMapping("/delete")
    public boolean delete(Integer id){
        return userService.removeById(id);
    }

    @PostMapping("/listP")
    public List<User> listP(@RequestBody User user){
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.like(User::getName,user.getName());
        return userService.list(userLambdaQueryWrapper);
    }
}
```

### 分页处理

- 添加分页拦截器

  创建一个新的类来额外获取分页信息
    ```java
    @EqualsAndHashCode(callSuper = true)
    @Data
    @ToString(callSuper = true)
    public class QueryPageParam extends User {
        //默认
        private static int PAGE_SIZE=20;
        private static int PAGE_NUM=1;
        private static int NAV_SIZE=5;
        
        private int pageSize=PAGE_SIZE;
        private int pageNum=PAGE_NUM;
        private int navSize=NAV_SIZE;
    }
    ```
- 分页查询方法

  ```java
  @PostMapping("/listPage")
  public PageInfo<User> listPage(@RequestBody QueryPageParam queryPageParam){
      PageHelper.startPage(queryPageParam.getPageNum(),queryPageParam.getPageSize());
      LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
      userLambdaQueryWrapper.like(User::getName,queryPageParam.getName());
      List<User> list = userService.list(userLambdaQueryWrapper);
      PageInfo<User> userPageInfo = new PageInfo<>(list, queryPageParam.getNavSize());
      return userPageInfo;
  }
  ```

## 封装返回数据

```java
@Data
public class Result<T> {
    private int code;//状态码
    private String msg;//信息
    private Long total;//总记录数
    T data;//要返回的数据

    public static <T> Result<T> success(T data){
        Result<T> result = new Result<>();
        result.code=200;
        result.msg="成功";
        result.data=data;
        return result;
    }

    public static <T> Result<T> fail(String msg){
        Result<T> result = new Result<>();
        result.code=400;
        result.msg=msg;
        return result;
    }
}
```

```java
@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public Result<List<User>> list(){
        try {
            List<User> list = userService.list();
            return Result.success(list);
        } catch (Exception e) {
            return Result.fail("获取失败");
        }
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody User user){
        if(userService.save(user)){
            return Result.success(0);
        }else{
            return Result.fail("添加失败");
        }
    }

    @PostMapping("/mod")
    public Result<Integer> mod(@RequestBody User user){
        if(userService.updateById(user)){
            return Result.success(0);
        }else{
            return Result.fail("修改失败");
        }
    }

    @PostMapping("/saveOrMod")
    public Result<Integer> saveOrMod(@RequestBody User user){
        if(userService.saveOrUpdate(user)){
            return Result.success(0);
        }else{
            return Result.fail("添加或修改失败");
        }
    }

    @GetMapping("/delete")
    public Result<Integer> delete(Integer id){
        if(userService.removeById(id)){
            return Result.success(0);
        }else{
            return Result.fail("删除失败");
        }
    }

    @PostMapping("/listP")
    public Result<List<User>> listP(@RequestBody User user){
        try {
            LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
            userLambdaQueryWrapper.like(User::getName,user.getName());
            List<User> list = userService.list(userLambdaQueryWrapper);
            return Result.success(list);
        } catch (Exception e) {
            return Result.fail("查找失败");
        }
    }

  @PostMapping("/listPage")
  public Result<PageInfo<User>> listPage(@RequestBody QueryPageParam queryPageParam){
    try {
      PageHelper.startPage(queryPageParam.getPageNum(),queryPageParam.getPageSize());
      LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
      if(queryPageParam.getName()!=null){
        userLambdaQueryWrapper.like(User::getName,queryPageParam.getName());
      }
      if(queryPageParam.getAge()!=null){
        userLambdaQueryWrapper.like(User::getAge,queryPageParam.getAge());
      }
      if(queryPageParam.getId()!=null){
        userLambdaQueryWrapper.like(User::getId,queryPageParam.getId());
      }
      if(queryPageParam.getAccount()!=null){
        userLambdaQueryWrapper.like(User::getAccount,queryPageParam.getAccount());
      }
      if(queryPageParam.getSex()!=null){
        userLambdaQueryWrapper.like(User::getSex,queryPageParam.getSex());
      }
      if(queryPageParam.getPhone()!=null){
        userLambdaQueryWrapper.like(User::getPhone,queryPageParam.getPhone());
      }
      if(queryPageParam.getRoleId()!=null){
        userLambdaQueryWrapper.like(User::getRoleId,queryPageParam.getRoleId());
      }
      if(queryPageParam.getValid()!=null){
        userLambdaQueryWrapper.like(User::getValid,queryPageParam.getValid());
      }
      List<User> list = userService.list(userLambdaQueryWrapper);
      PageInfo<User> userPageInfo = new PageInfo<>(list, queryPageParam.getNavSize());
      return Result.success(userPageInfo);
    } catch (Exception e) {
      return Result.fail("获取失败");
    }
  }
}
```

## 二、创建前端项目

### 实现侧面菜单收缩及动画

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture1.png)

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture2.png)

通过sidebarStore在组件中传递数据
```javascript
import {defineStore} from 'pinia'

export const siderbarStore=defineStore("siderbar",{
    state: ()=>{
        return {
            collapse: false
        };
    },
    actions:{
      change(){
          this.collapse=!this.collapse
      }
    }
})
```
在header组件中改变collapse的值，在aside组件中的侧边菜单绑定collapse的值即可实现通信
同时要改变aside的宽度，于是在组件外绑定类型，在collapse的时候改变宽度
```javascript
<div class="aside" 
    :class="{'asideCollapse':sidebarStore.collapse}" 
    :style="style"> 
        <Aside></Aside>
</div>

.aside{
  width: 200px;
  -webkit-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.asideCollapse{
  width: 65px;
}
```
添上动画视觉效果更佳

### axios封装
```javascript
import axios from 'axios'

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
```
获取到后端数据后填入表格，表格用ElementUI

### 分页查询

分页组件用ElementUI的分页组件，觉得丑也可自己写，后端传来的分页数据很好用

```javascript
const userData=ref(0)
    let currentPage=ref(1)
    const pageSize=10
    const navSize=5
    onMounted(async () => {
      const {data} = await post("http://localhost:8083/user/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
      })
      userData.value=data
      console.log(data.total)
    })
    watch(currentPage,async (value) => {
      const {data} = await post("http://localhost:8083/user/listPage", {
        pageSize: pageSize,
        pageNum: value,
        navSize: navSize,
      })
      userData.value = data
      console.log(data.total)
    })
```
```html
<el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="userData.total"
        :pager-count="navSize"
        class="mt-4"
        v-model:current-page="currentPage"
    />
```

### 表单校验规则设置

要对填写的每个数据进行规则校验，最终提交时必须满足条件才可以提交
效果如图
![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture3.png)

获取到form表单的ref，此处为vue3的获取方法
```javascript
const ruleFormRef = ref('')
```
```html
<el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
```
设置rules
```javascript
const rules = reactive({
      name: [{ required: true,message: "请输入姓名", trigger: 'blur' }],
      account: [{validator: checkAccount, trigger: 'blur' }],
      password: [{ required: true,message: "请输入密码", trigger: 'blur' }],
      age: [{validator: checkAge, trigger: 'blur' }],
      phone: [{validator: checkPhone, trigger: 'blur' }],
      sex: [{ required: true,message: "请选择性别", trigger: 'blur' }],
      roleId: [{ required: true,message: "请选择角色", trigger: 'blur' }],
      valid: [{ required: true,message: "请选择是否禁用", trigger: 'blur' }],
    })

let checkAccount=(rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入账户'))
  }
  setTimeout(async () => {
    const {data} = await get("http://localhost:8083/user/findByAccount",{account:value})
    if (data===0) {
      callback(new Error('已存在相同账户'))
    } else {
      callback()
    }
  }, 1000)
};
let checkAge=(rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入年龄'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('请输入数字'))
    } else {
      if (value > 150) {
        callback(new Error('年龄过大'))
      } else {
        callback()
      }
    }
  }, 1000)
};
let checkPhone=(rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入电话号码'))
  }
  setTimeout(() => {
    if (value.length > 18) {
      callback(new Error('电话号码过长'))
    } else {
      callback()
    }
  }, 1000)
};
```
提交时检验是否已经符合要求
```javascript
const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          const {code} = await post("http://localhost:8083/user/save", form)
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
          } else {
            ElMessage({
              message: '操作失败',
              type: 'error',
            })
          }
        } else {
          ElMessage({
            message: '操作失败',
            type: 'error',
          })
          return false
        }
      })
    }
```

新增时要检查是否有已经存在该账户

修改时不用，需要用一个check变量来区分

```javascript
let checkAccount=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账户'))
      }
      setTimeout(async () => {
        if(check.value===true){
          const {data} = await get("http://localhost:8083/user/findByAccount",{account:value})
          if (data===0) {
            callback(new Error('已存在相同账户'))
          } else {
            callback()
          }
        }else {
          callback()
        }
      }, 1000)
    };
```

由于需要同时支持新增和修改，故使用/saveOrMod接口

## 登录校验

前端需要做好路由，后端写好/login接口

```java
@PostMapping("/login")
    public Result<User> login(@RequestBody User user){
        LambdaQueryWrapper<User> userLambdaQueryWrapper = new LambdaQueryWrapper<>();
        userLambdaQueryWrapper.eq(User::getAccount,user.getAccount());
        userLambdaQueryWrapper.eq(User::getPassword,user.getPassword());
        List<User> list = userService.list(userLambdaQueryWrapper);
        if(list.isEmpty()){
            return Result.fail("账号或密码输入错误");
        }else {
            User user1 = list.get(0);
            if(user1.getValid()==0){
                return Result.fail("该用户已禁用");
            }else {
                if(user1.getRoleId()==2){
                    return Result.fail("该用户权限不够");
                }else {
                    return Result.success(user1);
                }
            }
        }
    }
```

```javascript
import { createRouter, createWebHashHistory } from "vue-router";
import login from "@/components/Index/Login";
import indexHome from "@/components/Index/IndexHome";
const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: login
    },
    {
        path: "/home",
        component: indexHome
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
```

## 仓库类

```java
/**
 * 
 * @TableName storage
 */
@TableName(value ="storage")
@Data
public class Storage implements Serializable {
    /**
     * 仓库id
     */
    @TableId
    private Integer id;

    /**
     * 仓库名
     */
    private String name;

    /**
     * 备注
     */
    private String remark;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        Storage other = (Storage) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getName() == null ? other.getName() == null : this.getName().equals(other.getName()))
            && (this.getRemark() == null ? other.getRemark() == null : this.getRemark().equals(other.getRemark()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getName() == null) ? 0 : getName().hashCode());
        result = prime * result + ((getRemark() == null) ? 0 : getRemark().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", name=").append(name);
        sb.append(", remark=").append(remark);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}
```

仓库类的controller

```java
@RestController
@RequestMapping("/storage")
@CrossOrigin
public class StorageController {
    @Autowired
    StorageService storageService;

    @GetMapping("/list")
    public Result<List<Storage>> list(){
        try {
            List<Storage> list = storageService.list();
            return Result.success(list);
        } catch (Exception e) {
            return Result.fail("获取失败");
        }
    }

    @PostMapping("/save")
    public Result<Integer> save(@RequestBody Storage storage){
        if(storageService.save(storage)){
            return Result.success(0);
        }else{
            return Result.fail("添加失败");
        }
    }

    @PostMapping("/mod")
    public Result<Integer> mod(@RequestBody Storage storage){
        if(storageService.updateById(storage)){
            return Result.success(0);
        }else{
            return Result.fail("修改失败");
        }
    }

    @PostMapping("/saveOrMod")
    public Result<Integer> saveOrMod(@RequestBody Storage storage){
        if(storageService.saveOrUpdate(storage)){
            return Result.success(0);
        }else{
            return Result.fail("添加或修改失败");
        }
    }

    @GetMapping("/delete")
    public Result<Integer> delete(Integer id){
        if(storageService.removeById(id)){
            return Result.success(0);
        }else{
            return Result.fail("删除失败");
        }
    }

    @PostMapping("/listPage")
    public Result<PageInfo<Storage>> listPage(@RequestBody QueryPageParamForStorage queryPageParam){
        try {
            PageHelper.startPage(queryPageParam.getPageNum(),queryPageParam.getPageSize());
            LambdaQueryWrapper<Storage> storageLambdaQueryWrapper = new LambdaQueryWrapper<>();
            if(queryPageParam.getId()!=null){
                storageLambdaQueryWrapper.like(Storage::getId,queryPageParam.getId());
            }
            if(queryPageParam.getName()!=null){
                storageLambdaQueryWrapper.like(Storage::getName,queryPageParam.getName());
            }
            if(queryPageParam.getRemark()!=null){
                storageLambdaQueryWrapper.like(Storage::getRemark,queryPageParam.getRemark());
            }
            List<Storage> list = storageService.list(storageLambdaQueryWrapper);
            PageInfo<Storage> storagePageInfo = new PageInfo<>(list, queryPageParam.getNavSize());
            return Result.success(storagePageInfo);
        } catch (Exception e) {
            return Result.fail("获取失败");
        }
    }
}

```
用UserController稍微修改一下

## 操作记录的多表联查

几乎需要用到之前的所有的表

```java
@RestController
@RequestMapping("/record")
@CrossOrigin
public class RecordController {
    @Autowired
    RecordService recordService;
    @Autowired
    GoodsService goodsService;
    @Autowired
    GoodsTypeService goodsTypeService;
    @Autowired
    StorageService storageService;
    @Autowired
    UserService userService;

    @PostMapping("/listPage")
    public Result<PageInfo<RecordDto>> listPage(@RequestBody QueryPageParamForRecord queryPageParam){
        try {
            PageHelper.startPage(queryPageParam.getPageNum(),queryPageParam.getPageSize());
            LambdaQueryWrapper<Record> recordLambdaQueryWrapper = new LambdaQueryWrapper<>();
            if(queryPageParam.getId()!=null){
                recordLambdaQueryWrapper.eq(Record::getId,queryPageParam.getId());
            }
            if(queryPageParam.getRemark()!=null){
                recordLambdaQueryWrapper.like(Record::getRemark,queryPageParam.getRemark());
            }
            if(queryPageParam.getStorageId()!=null){
                Storage storage = storageService.getById(queryPageParam.getStorageId());
                LambdaQueryWrapper<Goods> goodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
                goodsLambdaQueryWrapper.eq(Goods::getStorageId,storage.getId());
                List<Goods> list = goodsService.list(goodsLambdaQueryWrapper);
                if(list.isEmpty()){
                    return Result.success(new PageInfo<>(new ArrayList<>(),queryPageParam.getNavSize()));
                }else{
                    recordLambdaQueryWrapper.and(recordLambdaQueryWrapper1 -> {
                        for (Goods goods : list) {
                            recordLambdaQueryWrapper1.or().eq(Record::getGoodsId,goods.getId());
                        }
                    });
                }
            }
            if(queryPageParam.getGoodsTypeId()!=null){
                GoodsType goodsType = goodsTypeService.getById(queryPageParam.getGoodsTypeId());
                LambdaQueryWrapper<Goods> goodsLambdaQueryWrapper = new LambdaQueryWrapper<>();
                goodsLambdaQueryWrapper.eq(Goods::getGoodsTypeId,goodsType.getId());
                List<Goods> list = goodsService.list(goodsLambdaQueryWrapper);
                if(list.isEmpty()){
                    return Result.success(new PageInfo<>(new ArrayList<>(),queryPageParam.getNavSize()));
                }else{
                    recordLambdaQueryWrapper.and(recordLambdaQueryWrapper1 -> {
                        for (Goods goods : list) {
                            recordLambdaQueryWrapper1.or().eq(Record::getGoodsId,goods.getId());
                        }
                    });
                }
            }
            List<Record> list = recordService.list(recordLambdaQueryWrapper);
            ArrayList<RecordDto> resList = new ArrayList<>();
            for (Record record:list){
                RecordDto recordDto = new RecordDto();
                recordDto.setId(record.getId());
                recordDto.setGoodsId(record.getGoodsId());
                recordDto.setAdminId(record.getAdminId());
                recordDto.setUserId(record.getUserId());
                recordDto.setCount(record.getCount());
                recordDto.setCreateTime(record.getCreateTime());
                recordDto.setRemark(record.getRemark());
                Goods goods = goodsService.getById(record.getGoodsId());
                Storage storage = storageService.getById(goods.getStorageId());
                GoodsType goodsType = goodsTypeService.getById(goods.getGoodsTypeId());
                User user = userService.getById(record.getUserId());
                User admin = userService.getById(record.getAdminId());
                recordDto.setStorageName(storage.getName());
                recordDto.setGoodsTypeName(goodsType.getName());
                recordDto.setUserName(user.getName());
                recordDto.setAdminName(admin.getName());
                resList.add(recordDto);
            }
            PageInfo<RecordDto> goodsPageInfo = new PageInfo<>(resList, queryPageParam.getNavSize());
            return Result.success(goodsPageInfo);
        } catch (Exception e) {
            return Result.fail("获取失败");
        }
    }
}
```

用一个Dto类封装仓库名，分类名，操作人名和取货/补货人名

需要多表联查的原因是record这张表里只储存了物品的id，而该物品所属的仓库和分类都需要去别的表查

同时对于操作人和取货/补货人也是如此

与此同时，前端还需要能够根据仓库名和分类名来查出记录，这也加大了多表联查的难度

Dto类和查询封装类

```java
@Data
public class RecordDto extends Record {
    String storageName;
    String goodsTypeName;
    String userName;
    String adminName;
}

@EqualsAndHashCode(callSuper = true)
@Data
@ToString(callSuper = true)
public class QueryPageParamForRecord extends RecordDto {
  //默认
  private static int PAGE_SIZE=20;
  private static int PAGE_NUM=1;
  private static int NAV_SIZE=5;

  private int pageSize=PAGE_SIZE;
  private int pageNum=PAGE_NUM;
  private int navSize=NAV_SIZE;

  private String storageId;
  private String goodsTypeId;
}
```

## 入库与出库

在取货人处安排一个二级dialog，点击input框时再弹出这一二级dialog选择申请人

二级dialog中插入一个selectUser组件，该组件可以用首页组件稍微改一改拿来用

![](http://www.diandianjun.com.cn:8080/resource/blog/text/ProjectPractice/warehouseSystem/picture4.png)

将点击的用户数据通过pinia传送到物品管理组件，并在表单上显示出来

与选择入库项一样，通过elementUi的表格的

```html
highlight-current-row @current-change="handleCurrentChange"
```
来实现

出库时注意检验出库的数量是否超过库存量

## pinia 页面刷新 数据持久化存在

下载 pinia 持久化插件

```javascript
npm install pinia-plugin-persist// 持久化插件
```

在main.js 中设置全局引入

```javascript
import {createPinia} from "pinia";
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersist)
```

store文件中

```javascript
// 开启数据缓存 若 需要state 中的变量页面刷新数据缓存 需要调用 actions 中的方法
    actions:{
        construct(user){
            this.user=user
        }
    },
    persist: {
        enabled: true, // 开启数据缓存
    }
```

在储存数据时调用actions中的方法，这样就可防止数据丢失
