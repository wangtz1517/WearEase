# 新增衣物 AI 标准化技术方案

## 1. 目标重定义

目标不再是“识别一张衣服照片”，而是：

`实拍图 -> AI 标准化正面图 -> 人工校正 -> 入库`

用户期望的结果是一张接近衣服定妆照的标准图：

- 衣服正面朝上
- 袖子或裤腿自然展开
- 领口整理到位
- 背景透明或纯净
- 方便放入衣柜列表统一展示

这类结果不能只靠前端模板拉伸完成，必须引入 AI。

## 2. 为什么要切到 AI 路线

当前前端原型只能做三件事：

- 把衣服从背景中粗略抠出
- 按品类套一个标准轮廓
- 生成“近似平铺”的归档图

它做不到下面这些关键能力：

- 理解折叠、遮挡、褶皱后的真实衣物结构
- 推断被遮住的袖子、裤腿、衣摆
- 自动整理领口、门襟、下摆这些局部细节
- 稳定地生成“像商品定妆照”的结果

所以生产方案必须换成：

- 前端负责上传、预览、校正、确认
- 后端 AI 服务负责分割、理解、标准化、补全、出图

## 3. 目标架构

### 3.1 总体结构

```text
前端 intake-studio
  -> 本地 AI Intake Service
  -> AI Provider
  -> 标准图 / 中间产物 / 元数据
  -> 前端审核确认
  -> 写入衣柜
```

### 3.2 模块拆分

前端：

- 上传照片
- 显示原图
- 轮询任务状态
- 预览抠图、标准图、问题提示
- 允许人工修正分类和归档信息
- 确认入库

本地 AI Intake Service：

- 接收上传请求
- 保存源图和任务记录
- 调用 AI Provider
- 汇总中间步骤状态
- 输出统一的任务结果结构

AI Provider：

- 抠图
- 服饰理解
- 标准形态归一化
- 图像补全或编辑
- 质量评估

## 4. AI 处理流水线

### 4.1 Step 1: 上传与预检查

输入：

- 用户上传的照片
- 可选品类提示
- 可选衣物名称

处理：

- 校验文件格式
- 压缩到服务端安全尺寸
- 检测是否为单件衣物
- 判断是否光照过暗、遮挡过重、背景过乱

输出：

- 预检查结果
- 是否允许继续

### 4.2 Step 2: 衣物分割

目标：

- 将衣服主体从复杂背景中提取出来
- 输出透明背景的抠图结果

输出：

- `mask`
- `cutout_png`

### 4.3 Step 3: 服饰结构理解

目标：

- 判断品类和子类
- 找出关键结构点

要识别的点包括：

- 领口
- 肩线
- 袖口
- 腰线
- 下摆
- 裤腰
- 裤脚

输出：

- `category`
- `subCategory`
- `keypoints`
- `garmentPoseScore`

### 4.4 Step 4: 标准形态归一化

目标：

- 把任意姿态的衣服映射到标准平铺姿态

例如：

- 上衣映射到“肩线水平、袖子自然下垂并展开”的模板
- 裤装映射到“裤腰平直、裤腿展开”的模板
- 外套映射到“前门襟居中、袖子平顺”的模板

输出：

- `canonical_mask`
- `canonical_layout`

### 4.5 Step 5: AI 生成补全

这是最核心的一步。

目标：

- 把折叠、遮挡、扭曲的衣服补全成完整正面图

它不是简单拉伸，而是生成式还原：

- 补出被折进去的袖子
- 补出被压住的裤腿
- 整理领口和衣摆
- 修复不完整的边缘

输出：

- `standard_png`

### 4.6 Step 6: 质量评估

目标：

- 判断结果能否直接入库
- 还是必须人工校正

评估项：

- 轮廓完整度
- 前视图可信度
- 衣物对称性
- 局部失真风险
- 生成痕迹是否明显

输出：

- `qualityScore`
- `requiresHumanReview`
- `reviewReasons`

## 5. 推荐技术路线

## 5.1 MVP 路线

先做外部 AI Provider 版本，不自己训练模型。

原因：

- 上线快
- 可以先验证真实效果
- 不需要先搭训练集和训练流程

MVP 目标：

- 单张图上传
- 返回抠图
- 返回标准图
- 支持人工确认

## 5.2 后续升级路线

等 MVP 验证通过后，再考虑：

- 自建细分模型
- 自定义风格模板
- 自己训练服装标准化模型

## 6. 任务接口设计

### 6.1 创建任务

`POST /api/intake/jobs`

请求体：

```json
{
  "sourceImageDataUrl": "data:image/png;base64,...",
  "sourceFilename": "shirt-01.png",
  "categoryHint": "top",
  "garmentName": "白色针织上衣",
  "notes": "希望生成正面平铺标准图"
}
```

返回：

```json
{
  "jobId": "job_20260331_xxx",
  "status": "queued"
}
```

### 6.2 查询任务

`GET /api/intake/jobs/:jobId`

返回：

```json
{
  "id": "job_20260331_xxx",
  "status": "processing",
  "steps": {
    "ingest": "completed",
    "segmentation": "processing",
    "understanding": "pending",
    "canonicalization": "pending",
    "generation": "pending",
    "review": "pending"
  },
  "artifacts": {
    "sourceImageUrl": "/api/intake/jobs/job_20260331_xxx/artifacts/source",
    "maskImageUrl": null,
    "standardImageUrl": null
  }
}
```

### 6.3 拉取产物

`GET /api/intake/jobs/:jobId/artifacts/:kind`

其中 `kind` 可为：

- `source`
- `mask`
- `standard`

## 7. 数据结构

任务对象建议至少保存：

```json
{
  "id": "job_001",
  "status": "queued",
  "provider": "mock",
  "categoryHint": "top",
  "predictions": {
    "category": null,
    "subCategory": null
  },
  "artifacts": {
    "sourceImagePath": "./storage/uploads/job_001-source.png",
    "maskImagePath": null,
    "standardImagePath": null
  },
  "review": {
    "requiresHumanReview": true,
    "reasons": []
  },
  "createdAt": "2026-03-31T00:00:00.000Z",
  "updatedAt": "2026-03-31T00:00:00.000Z"
}
```

## 8. 执行计划

### Phase 1

状态：已执行

内容：

- 明确从前端伪算法切换到 AI 路线
- 输出本技术方案
- 新增本地 AI 服务骨架

### Phase 2

状态：下一步执行

内容：

- 把独立处理页接入本地 AI 服务
- 前端改成“创建任务 + 轮询状态 + 显示 AI 结果”

### Phase 3

状态：需要你提供条件后执行

内容：

- 接真实 AI Provider
- 输出真正的抠图和标准图

你需要提供：

- 你准备接哪家 AI 服务
- 对应 API Key
- 10 到 30 张真实衣物样例图
- 5 到 10 张你理想中的“标准成片”参考图

### Phase 4

状态：后续执行

内容：

- 把独立处理页嵌回衣柜页的“新增衣物”
- 完成入库闭环

## 9. 我已经直接开始执行的部分

本轮除了文档，我还会同步落地一个本地 Node 服务骨架，先完成：

- 任务创建
- 状态查询
- 本地保存源图
- Provider 抽象层
- Mock Provider

这样后面接真实 AI 时，只需要替换 Provider，不需要重写前后端结构。

## 10. AI 测试资料准备清单

在继续接入真实 AI Provider 之前，需要先准备一批测试资料。

### 10.1 目录约定

测试资料统一放在：

`assets/ai-test`

其中：

- `assets/ai-test/source`
  放原始衣物照片
- `assets/ai-test/reference`
  放你理想中的标准成片参考图
- `assets/ai-test/edge-cases`
  放难例图
- `assets/ai-test/notes`
  放文字说明

### 10.2 你需要提供的内容

#### A. AI 服务信息

- 你准备接入哪家 AI 服务
- 对应的 API Key

如果这一步暂时还没定，可以先把图片资料准备好。

#### B. 原始测试图

建议数量：

- `10 到 30 张`

放置位置：

- `assets/ai-test/source`

建议覆盖：

- 上衣
- 裤子
- 外套
- 折叠状态
- 褶皱状态
- 复杂背景
- 普通手机随手拍场景

#### C. 理想标准图参考

建议数量：

- `5 到 10 张`

放置位置：

- `assets/ai-test/reference`

要求尽量贴近目标输出：

- 平铺正面
- 袖子或裤腿自然展开
- 领口整理到位
- 背景干净或透明感明确

#### D. 难例图

建议数量：

- `5 到 10 张`

放置位置：

- `assets/ai-test/edge-cases`

建议包括：

- 黑色或深色衣物
- 背景复杂
- 反光明显
- 遮挡严重
- 大褶皱
- 局部没有拍全

#### E. 简短文字规则

放置位置：

- `assets/ai-test/notes`

建议写清楚：

- 当前优先支持哪些衣物品类
- 最不能接受的错误是什么
- 是否必须透明背景
- 领口、袖子、裤腿需要整理到什么程度

### 10.3 进入真实 AI 接入前的最低条件

满足下面这组最小条件后，就可以开始下一阶段开发：

- 已确定 AI 服务平台
- 已提供 API Key
- 已准备原始测试图
- 已准备标准成片参考图
- 已提供至少一份简短规则说明

### 10.4 下一阶段开发动作

测试资料准备完成后，下一步直接执行：

1. 选定并接入真实 AI Provider
2. 把 `studio/intake-studio.html` 接到本地 AI 服务
3. 跑第一轮真实图片测试
4. 根据输出结果迭代提示词、流程和人工校正逻辑
