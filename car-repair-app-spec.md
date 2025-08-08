# 汽车修理厂报价APP产品规格书
## Product Requirements Document (PRD)

**版本：** 1.0  
**创建日期：** 2025年8月8日  
**产品负责人：** [待填写]  
**开发周期：** [待定]  

---

## 1. 产品概述

### 1.1 产品定位
为汽车修理厂提供一款专业、高效、透明的报价系统，帮助维修技师快速生成标准化报价单，提升客户服务体验和业务效率。

### 1.2 目标用户
- **主要用户：** 汽车修理厂前台接待人员、维修顾问
- **次要用户：** 维修技师、店长/管理人员
- **最终受益者：** 车主客户

### 1.3 核心价值主张
- 🚀 **快速报价：** 3分钟内完成专业报价单生成
- 📱 **多端适配：** PC/平板/手机全平台支持
- 💰 **价格透明：** 标准化服务定价，建立客户信任
- 🔄 **操作简便：** 零学习成本，即用即会
- 📄 **专业输出：** 标准化报价单，提升品牌形象

---

## 2. 技术架构要求

### 2.1 架构限制
- ✅ **纯前端实现：** 无后端API依赖
- ✅ **离线运行：** 所有数据存储在浏览器本地
- ✅ **数据持久化：** 使用IndexedDB存储用户配置
- ✅ **零部署成本：** 构建后可部署到任何静态服务器
- ❌ **不涉及：** 后端数据库、服务器、用户认证

### 2.2 技术选型
- **前端技术：** HTML5 + CSS3 + JavaScript (ES6+)
- **样式框架：** 原生CSS，响应式设计
- **数据存储：** JavaScript内存对象（非localStorage）
- **兼容性：** 现代浏览器（Chrome 70+, Firefox 65+, Safari 12+）

### 2.3 性能要求
- **首屏加载：** < 3秒
- **操作响应：** < 500ms
- **Bundle大小：** < 500KB (gzipped)
- **内存占用：** < 50MB
- **React渲染：** 避免不必要的重渲染

---

## 3. 功能需求规格

### 3.1 客户信息管理模块

#### 3.1.1 基础字段
| 字段名称 | 数据类型 | 验证规则 | 默认值 | 是否必填 |
|---------|---------|---------|--------|---------|
| 客户姓名 | String | 1-50字符 | - | 否 |
| 联系电话 | String | 支持手机号/固话格式 | - | 否 |
| 车辆型号 | String | 1-50字符 | - | 否 |
| 车辆年份 | Number | 1980-当前年份 | 当前年份 | 否 |
| 车牌号码 | String | 支持各种车牌格式 | - | 否 |

#### 3.1.2 自定义字段功能
- **字段添加：** 用户可添加自定义文本字段
- **字段命名：** 支持自定义字段名称（1-20字符）
- **字段类型：** 支持文本、数字、日期等输入类型
- **字段管理：** 支持编辑、删除、排序自定义字段
- **数据持久化：** 自定义字段配置保存到IndexedDB
- **字段显示：** 自定义字段在报价单中正常显示

#### 3.1.3 功能要求
- 支持实时输入验证（非强制）
- 信息自动同步至报价单
- 支持信息修改和重置
- 自定义字段配置管理

### 3.2 服务项目管理模块

#### 3.2.1 服务分类体系
```
维修服务分类架构：
├── 发动机维修 (engine)
│   ├── 更换机油
│   ├── 发动机大修
│   ├── 更换正时皮带
│   └── ...
├── 刹车系统 (brake)
├── 变速箱 (transmission)
├── 电气系统 (electrical)
├── 悬挂系统 (suspension)
├── 车身维修 (bodywork)
├── 常规保养 (maintenance)
├── 轮胎服务 (tires)
├── 空调系统 (air_conditioning)
└── 其他服务 (other)
```

#### 3.2.2 预设服务项目
每个分类包含3-6个常用服务项目，总计约40-50个标准服务项目。

#### 3.2.3 服务数据管理功能
- **预设服务展示：** 系统内置标准服务项目库
- **服务编辑功能：** 用户可修改预设服务的名称和价格
- **服务添加功能：** 用户可添加新的服务分类和项目
- **服务删除功能：** 用户可删除不需要的服务项目
- **数据持久化：** 所有修改自动保存到本地IndexedDB
- **数据导入导出：** 支持JSON格式的服务数据备份和恢复
- **重置功能：** 支持恢复到系统默认服务配置

#### 3.2.4 自定义服务功能
- 支持添加临时服务项目
- 自定义服务名称（1-50字符）
- 自定义价格（0.01-99999.99元）
- 与预设服务同等显示优先级

#### 3.2.5 服务操作功能
- ✅ 添加服务到报价单
- ✅ 从报价单删除服务
- ✅ 服务项目去重（同一服务不能重复添加）
- ✅ 批量清空所有服务

### 3.3 报价单生成模块

#### 3.3.1 报价单结构
```
报价单组成：
├── 页面头部
│   ├── 企业标识/LOGO区域
│   └── 报价单标题
├── 客户信息区块
│   ├── 基本信息展示
│   └── 车辆信息展示
├── 服务明细区块
│   ├── 服务项目列表
│   ├── 单项价格显示
│   └── 服务分类标识
├── 费用汇总区块
│   ├── 小计金额
│   ├── 总计金额（重点突出）
│   └── 价格有效期说明
└── 操作功能区
    ├── 打印报价单
    ├── 重新开始
    └── [预留扩展空间]
```

#### 3.3.2 价格计算规则
- **基础计算：** 所有服务项目价格简单相加
- **精度要求：** 保留2位小数
- **货币格式：** 中文人民币格式（¥xxx.xx）
- **实时更新：** 添加/删除服务时自动重算

### 3.4 打印输出模块

#### 3.4.1 打印格式要求
- **页面尺寸：** A4纸张适配
- **打印样式：** 简洁黑白版本
- **信息完整：** 包含所有客户信息和服务明细
- **页面分割：** 支持多页打印时的合理分页

#### 3.4.2 打印功能
- 使用浏览器原生打印功能
- 隐藏不必要的操作按钮
- 保持报价单专业格式

---

## 4. 用户界面设计规范

### 4.1 设计原则
- **简洁明了：** 减少认知负荷，突出核心功能
- **专业可信：** 体现汽修行业的专业性
- **操作友好：** 适合不同技术水平的用户
- **视觉统一：** 保持设计语言一致性

### 4.2 色彩规范
```css
主色调：
- 主品牌色：#667eea (科技蓝)
- 辅助色：#764ba2 (深紫)
- 成功色：#48bb78 (绿色)
- 警告色：#ed8936 (橙色)
- 危险色：#e53e3e (红色)

中性色：
- 深色文字：#2d3748
- 次要文字：#4a5568
- 辅助文字：#718096
- 边框颜色：#e2e8f0
- 背景颜色：#f7fafc
```

### 4.3 字体规范
- **主字体：** 系统默认中文字体栈
- **字号层级：**
  - H1 标题：2.5rem (40px)
  - H2 副标题：1.4rem (22px)
  - 正文：1rem (16px)
  - 辅助文字：0.9rem (14px)

### 4.4 间距规范
- **基础间距单位：** 4px
- **组件间距：** 20px
- **区块间距：** 30px
- **页面边距：** 20px

---

## 5. 响应式设计要求

### 5.1 断点设置
```css
断点规范：
- 手机端：< 480px
- 手机大屏：480px - 768px  
- 平板端：768px - 1024px
- PC端：> 1024px
```

### 5.2 布局适配规则

#### 5.2.1 PC端布局 (> 768px)
- 双栏布局：信息输入 | 报价展示
- 列宽比例：1:1
- 最大容器宽度：1200px

#### 5.2.2 移动端布局 (≤ 768px)
- 单栏布局：垂直堆叠
- 表单字段：单列排列
- 按钮：全宽显示
- 字号：适当增大提升可读性

### 5.3 交互适配
- **触摸目标：** 最小44px×44px
- **表单输入：** 移动端优化键盘类型
- **按钮状态：** 支持触摸反馈效果

---

## 6. Redux状态管理设计

### 6.1 Store结构设计
```javascript
const initialState = {
  customer: {
    // 基础字段
    name: '',
    phone: '',
    carModel: '',
    carYear: new Date().getFullYear(),
    licensePlate: '',
    // 自定义字段数据
    customFields: {}         // {fieldId: value}
  },
  customerConfig: {
    customFields: [],        // 自定义字段配置
    fieldOrder: []           // 字段显示顺序
  },
  services: {
    selectedServices: [],     // 已选择的服务列表
    serviceDatabase: {},      // 运行时服务数据库
    customServices: [],       // 用户自定义服务
    totalAmount: 0           // 总金额
  },
  serviceConfig: {
    isLoading: false,        // 数据加载状态
    lastModified: null,      // 最后修改时间
    version: '1.0'           // 数据版本号
  },
  ui: {
    isLoading: false,
    currentStep: 'input',    // 'input' | 'review' | 'print'
    showServiceManager: false, // 显示服务管理界面
    showCustomerFieldManager: false, // 显示客户字段管理界面
    errors: {}
  }
}
```

### 6.2 Actions设计
```javascript
// Customer Actions
- updateCustomerInfo(field, value)
- updateCustomField(fieldId, value)
- resetCustomerInfo()

// Customer Configuration Actions
- addCustomField(fieldConfig)        // 添加自定义字段
- updateCustomField(fieldId, config) // 更新字段配置
- removeCustomField(fieldId)         // 删除自定义字段
- reorderCustomFields(newOrder)      // 重新排序字段
- loadCustomerConfig()               // 加载客户字段配置
- saveCustomerConfig()               // 保存客户字段配置

// Services Actions  
- addService(service)
- removeService(serviceId)
- addCustomService(name, price)
- clearAllServices()
- calculateTotal()

// Service Configuration Actions
- loadServiceDatabase()           // 从IndexedDB加载服务配置
- saveServiceDatabase(data)       // 保存服务配置到IndexedDB
- updateServiceItem(categoryKey, itemKey, updates)  // 更新服务项目
- addServiceCategory(categoryData)  // 添加服务分类
- removeServiceCategory(categoryKey)  // 删除服务分类
- addServiceItem(categoryKey, itemData)  // 添加服务项目
- removeServiceItem(categoryKey, itemKey)  // 删除服务项目
- resetToDefault()               // 重置为默认配置
- exportServiceData()            // 导出服务数据
- importServiceData(jsonData)    // 导入服务数据

// UI Actions
- setLoading(isLoading)
- setCurrentStep(step)
- toggleServiceManager()         // 切换服务管理界面
- toggleCustomerFieldManager()   // 切换客户字段管理界面
- setError(field, message)
- clearErrors()
```

### 6.3 Reducers设计
```javascript
// customerReducer.js - 处理客户信息状态
// customerConfigReducer.js - 处理客户字段配置状态
// servicesReducer.js - 处理服务项目状态  
// serviceConfigReducer.js - 处理服务配置状态
// uiReducer.js - 处理界面状态
// rootReducer.js - 合并所有reducers
```

### 6.4 组件架构设计
```
App (根组件)
├── Header (页面标题)
│   ├── ServiceManagerToggle (服务管理入口)
│   └── CustomerFieldManagerToggle (客户字段管理入口)
├── ServiceManager (服务配置管理) [可选显示]
│   ├── ServiceCategoryManager
│   ├── ServiceItemManager  
│   ├── ImportExportTools
│   └── ResetControls
├── CustomerFieldManager (客户字段管理) [可选显示]
│   ├── CustomFieldList
│   ├── CustomFieldEditor
│   └── FieldOrderManager
├── CustomerInfoForm (客户信息表单)
│   ├── BasicFields (基础字段)
│   └── CustomFields (自定义字段)
├── ServiceSelection (服务选择)
│   ├── ServiceCategorySelect
│   ├── ServiceItemSelect
│   └── CustomServiceForm
├── QuoteDisplay (报价展示)
│   ├── ServiceList
│   ├── ServiceItem
│   └── TotalSummary
├── QuoteSummary (报价汇总)
│   ├── CustomerSummary
│   ├── CostBreakdown
│   └── ActionButtons
└── Footer (页脚信息)
```

---

## 7. 数据结构设计

### 7.1 客户信息数据结构
```javascript
const customerInfo = {
  // 基础字段
  name: String,            // 客户姓名
  phone: String,           // 联系电话  
  carModel: String,        // 车辆型号
  carYear: Number,         // 车辆年份
  licensePlate: String,    // 车牌号码
  // 自定义字段数据
  customFields: {
    [fieldId]: value       // 自定义字段值
  }
}

// 自定义字段配置结构
const customFieldConfig = {
  id: String,              // 字段唯一标识
  name: String,            // 字段显示名称
  type: String,            // 字段类型: 'text' | 'number' | 'date' | 'email' | 'tel'
  placeholder: String,     // 占位符文本
  required: Boolean,       // 是否必填 (默认false)
  order: Number,           // 显示顺序
  createdAt: Date,         // 创建时间
  updatedAt: Date          // 更新时间
}
```

### 7.2 服务项目数据结构
```javascript
const serviceItem = {
  id: String,          // 唯一标识
  name: String,        // 服务名称
  price: Number,       // 服务价格
  category: String,    // 服务分类
  isCustom: Boolean    // 是否自定义服务
}
```

### 7.3 服务数据库结构
```javascript
const serviceDatabase = {
  [categoryKey]: {
    id: String,            // 分类唯一标识
    name: String,          // 分类名称
    order: Number,         // 显示顺序
    isCustom: Boolean,     // 是否用户自定义
    createdAt: Date,       // 创建时间
    updatedAt: Date,       // 更新时间
    items: {
      [itemKey]: {
        id: String,        // 项目唯一标识
        name: String,      // 项目名称
        price: Number,     // 项目价格
        description: String, // 项目描述 (可选)
        isCustom: Boolean, // 是否用户自定义
        createdAt: Date,   // 创建时间
        updatedAt: Date    // 更新时间
      }
    }
  }
}
```

---

## 8. 数据持久化设计

### 8.1 IndexedDB存储方案
选择IndexedDB作为主要持久化存储技术，原因如下：
- **存储容量大：** 相比localStorage的5-10MB限制，IndexedDB理论上无容量限制
- **结构化存储：** 支持复杂数据结构，适合服务配置数据
- **异步操作：** 不阻塞UI线程，性能更好
- **事务支持：** 保证数据一致性
- **广泛兼容：** 现代浏览器支持良好

### 8.2 数据存储结构
```javascript
// IndexedDB数据库：CarRepairApp
// 版本：1

// 对象存储：serviceDatabase
{
  id: 'serviceDatabase',
  data: {
    categories: {...},      // 服务分类数据
    version: '1.0',
    createdAt: Date,
    updatedAt: Date
  }
}

// 对象存储：customerFieldConfig
{
  id: 'customerFieldConfig',
  data: {
    customFields: [...],    // 自定义字段配置
    fieldOrder: [...],      // 字段显示顺序
    version: '1.0',
    updatedAt: Date
  }
}

// 对象存储：userPreferences  
{
  id: 'userPreferences',
  data: {
    theme: 'default',
    defaultTax: 0,
    companyInfo: {...},
    updatedAt: Date
  }
}

// 对象存储：backupData
{
  id: String,             // 备份ID (timestamp)
  name: String,           // 备份名称
  data: {...},           // 完整配置数据
  createdAt: Date
}
```

### 8.3 数据同步策略
- **启动时加载：** 应用启动时从IndexedDB加载用户配置
- **实时保存：** 用户修改服务配置时立即保存到IndexedDB
- **版本管理：** 支持数据版本控制和升级迁移
- **备份机制：** 定期创建配置备份，支持一键恢复

### 8.4 数据操作API设计
```javascript
// utils/indexedDB.js
class ServiceDatabaseManager {
  async loadServiceDatabase()     // 加载服务配置
  async saveServiceDatabase(data) // 保存服务配置
  async loadCustomerFieldConfig() // 加载客户字段配置
  async saveCustomerFieldConfig(data) // 保存客户字段配置
  async createBackup(name)        // 创建备份
  async restoreBackup(backupId)   // 恢复备份
  async exportData()              // 导出JSON数据
  async importData(jsonData)      // 导入JSON数据
  async clearAllData()            // 清空所有数据
  async getStorageInfo()          // 获取存储使用情况
  async checkIndexedDBSupport()   // 检测IndexedDB支持
}
```

### 8.5 浏览器支持检测
当IndexedDB不可用时的处理策略：
1. **启动检测：** 应用启动时检测IndexedDB支持情况
2. **不支持提示：** 显示友好的错误提示信息
3. **功能禁用：** 禁用应用功能，提示用户升级浏览器
4. **兼容建议：** 推荐用户使用支持IndexedDB的现代浏览器

```javascript
// 检测代码示例
if (!window.indexedDB) {
  // 显示不支持提示，禁用应用
  showUnsupportedBrowserMessage();
  disableAppFunctions();
}
```

---

## 9. React组件开发规范

### 9.1 组件设计原则
- **单一职责：** 每个组件只负责一个功能
- **可复用性：** 通用组件支持props配置
- **性能优化：** 使用React.memo避免不必要渲染
- **类型安全：** 使用PropTypes进行类型检查

### 9.2 Hooks使用规范
```javascript
// 推荐使用的Hooks
- useSelector() - 获取Redux状态
- useDispatch() - 分发Redux Actions
- useState() - 组件本地状态
- useEffect() - 副作用处理
- useCallback() - 函数缓存优化
- useMemo() - 计算结果缓存
```

### 9.3 组件命名规范
- **组件文件：** PascalCase (CustomerInfoForm.jsx)
- **样式文件：** kebab-case (customer-info-form.module.css)
- **常量文件：** UPPER_CASE (SERVICE_TYPES.js)
- **工具函数：** camelCase (calculateTotal.js)

### 9.4 文件目录结构
```
src/
├── components/          # 通用组件
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   ├── ServiceManager/  # 服务管理组件
│   └── CustomerFieldManager/ # 客户字段管理组件
├── containers/          # 页面容器组件
│   ├── CustomerInfoForm/
│   ├── ServiceSelection/
│   └── QuoteDisplay/
├── store/              # Redux相关
│   ├── slices/         # Redux Toolkit slices
│   ├── actions/        # Action creators
│   └── index.js        # Store配置
├── utils/              # 工具函数
│   ├── indexedDB.js    # IndexedDB操作
│   ├── dataExport.js   # 数据导入导出
│   ├── validation.js   # 数据验证
│   └── browserSupport.js # 浏览器支持检测
├── constants/          # 常量定义
├── styles/             # 全局样式
└── data/               # 默认数据配置
    ├── defaultServices.js     # 预设服务数据
    └── defaultCustomerFields.js # 默认客户字段配置
```

---

## 10. 用户体验设计

### 10.1 操作流程设计
```
标准操作流程：
1. 进入页面
2. 填写客户基本信息 (可选先填或后填)
3. 选择服务类型
4. 选择具体服务项目
5. 添加到报价单
6. 重复步骤3-5直到完成所有服务
7. 查看报价汇总
8. 打印报价单 或 开始新的报价
```

### 10.2 客户字段管理操作流程
```
客户字段配置管理流程：
1. 点击页面头部"字段管理"按钮
2. 进入客户字段配置界面
3. 选择操作类型：
   - 添加新字段 (设置名称、类型、占位符等)
   - 编辑现有字段 (修改配置)
   - 删除自定义字段
   - 调整字段显示顺序
   - 设置字段必填状态
4. 确认修改并自动保存
5. 返回主界面，字段配置立即生效
```

### 10.3 服务管理操作流程
```
服务配置管理流程：
1. 点击页面头部"服务管理"按钮
2. 进入服务配置界面
3. 选择操作类型：
   - 编辑现有服务 (修改名称/价格)
   - 添加新服务分类
   - 添加新服务项目  
   - 删除服务项目/分类
   - 导入/导出配置
   - 恢复默认设置
4. 确认修改并自动保存
5. 返回主界面，修改立即生效
```

### 10.4 错误处理机制
- **输入验证：** 实时提示输入格式错误
- **操作确认：** 删除/清空操作需要确认
- **错误恢复：** 提供撤销或重新输入选项
- **友好提示：** 使用中文提示信息

### 10.5 反馈机制
- **操作反馈：** 按钮点击、悬停状态
- **状态指示：** 已选择服务的视觉区分
- **进度提示：** 报价单金额实时更新
- **成功确认：** 服务添加成功的视觉反馈

---

## 11. 性能与质量要求

### 11.1 性能指标
- **页面加载时间：** < 3秒 (3G网络)
- **交互响应时间：** < 500ms
- **内存使用：** < 50MB
- **兼容性：** 覆盖95%+主流浏览器

### 11.2 可用性要求
- **学习成本：** 新用户5分钟内掌握基本操作
- **操作效率：** 熟练用户3分钟内完成标准报价
- **错误率：** 用户操作错误率 < 5%
- **满意度：** 用户满意度 > 85%

### 11.3 可维护性要求
- **代码结构：** 模块化组件设计，便于维护
- **状态管理：** Redux统一状态管理，便于调试
- **配置分离：** 服务数据与业务逻辑分离
- **扩展性：** 支持服务项目和价格的简单修改
- **文档完整：** 组件和函数注释覆盖率 > 80%

---

## 12. 测试验收标准

### 12.1 功能测试检查项
- [ ] React组件渲染正常
- [ ] Redux状态管理正确
- [ ] IndexedDB浏览器支持检测
- [ ] IndexedDB数据持久化
- [ ] 客户字段配置管理功能
- [ ] 自定义字段添加、编辑、删除
- [ ] 字段显示顺序调整
- [ ] 服务配置管理功能
- [ ] 数据导入导出功能
- [ ] 客户信息录入（非必填验证）
- [ ] 服务项目添加和删除
- [ ] 自定义服务功能
- [ ] 价格计算准确性
- [ ] 报价单生成完整性
- [ ] 打印功能正常性
- [ ] 数据清空和重置

### 12.2 兼容性测试
- [ ] Chrome (Windows/Mac/Android)
- [ ] Safari (Mac/iOS)  
- [ ] Firefox (Windows/Mac)
- [ ] Edge (Windows)
- [ ] 各种屏幕分辨率测试

### 12.3 浏览器支持测试
- [ ] IndexedDB支持检测机制
- [ ] 不支持时的提示界面
- [ ] 应用功能禁用逻辑
- [ ] 兼容浏览器推荐提示

### 12.4 数据持久化测试
- [ ] IndexedDB存储和读取
- [ ] 客户字段配置持久化
- [ ] 数据版本升级兼容性
- [ ] 数据备份和恢复
- [ ] 导入导出功能
- [ ] 存储空间管理

### 12.5 用户体验测试
- [ ] 操作流程顺畅性
- [ ] 界面响应及时性
- [ ] 错误提示友好性
- [ ] 移动端操作便捷性

---

## 13. 项目交付物

### 13.1 开发交付物
- [ ] React应用源代码
- [ ] 构建后的生产版本
- [ ] 功能演示视频
- [ ] 用户操作手册
- [ ] 技术文档
- [ ] 组件文档

### 13.2 测试交付物
- [ ] 功能测试报告
- [ ] 兼容性测试报告
- [ ] 性能测试报告
- [ ] React组件测试报告

---

**文档状态：** ✅ 待确认  
**确认人：** [待签字]  
**确认时间：** [待填写]

---

*本文档为汽车修理厂报价APP的完整产品规格书，请仔细审阅并确认各项需求是否符合预期。如有任何修改建议，请及时反馈。*