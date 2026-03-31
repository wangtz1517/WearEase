# AI Intake Service

本目录是“新增衣物 AI 标准化”用到的本地后端服务。

它的职责不是直接做前端展示，而是作为中间层：

```text
前端页面 -> 本地 AI 服务 -> 外部 AI Provider
```

## 当前作用

- 接收上传图片
- 创建处理任务
- 调用 provider
- 保存产物和任务状态
- 向前端返回 `jobId`、状态和结果图

## 当前支持的 provider

- `mock`
  用于联调流程，不调用真实 AI

- `seedream`
  调用火山方舟 Seedream 图片生成接口，返回真实标准图

## 启动方式

### 方式 1：直接运行

```powershell
cd ai-intake-service
node src/server.js
```

### 方式 2：使用一键启动脚本

```powershell
.\start-ai-intake.ps1
```

或者从仓库根目录双击：

```text
start-ai-intake.bat
```

默认端口：

```text
8123
```

健康检查：

```text
GET http://127.0.0.1:8123/health
```

## 环境变量

参考模板：

```text
ai-intake-service/.env.example
```

常用配置：

```env
PORT=8123
AI_PROVIDER=seedream
STORAGE_DIR=./storage
VOLCENGINE_IMAGE_MODEL=doubao-seedream-5-0-260128
VOLCENGINE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
VOLCENGINE_API_KEY=
```

说明：

- 不要把真实 API Key 写进代码
- 真实密钥只放本地 `.env`
- `.env` 已被 `.gitignore` 忽略

## 目录结构

```text
ai-intake-service/
├─ src/
│  ├─ config.js
│  ├─ job-store.js
│  ├─ server.js
│  ├─ services/
│  └─ providers/
├─ storage/
├─ .env.example
├─ package.json
└─ start-ai-intake.ps1
```

## API 概览

### 创建任务

```text
POST /api/intake/jobs
```

请求体示例：

```json
{
  "sourceImageDataUrl": "data:image/png;base64,...",
  "sourceFilename": "shirt.png",
  "categoryHint": "top",
  "garmentName": "白色针织上衣",
  "notes": "生成标准归档图"
}
```

### 查询任务

```text
GET /api/intake/jobs/:jobId
```

### 获取产物

```text
GET /api/intake/jobs/:jobId/artifacts/source
GET /api/intake/jobs/:jobId/artifacts/mask
GET /api/intake/jobs/:jobId/artifacts/standard
```

### 测试素材接口

```text
GET /api/test-assets/source
GET /api/test-assets/source/:filename
```

## 当前行为说明

在 `seedream` 模式下：

- 上传图会作为参考图传给模型
- 当前主产物是 `standard`
- `mask` 还没有接独立抠图模型，因此可能为空

在 `mock` 模式下：

- 主要用于跑通上传、轮询、结果展示链路
- 不验证真实 AI 质量

## 运行产物

运行时文件保存在：

```text
ai-intake-service/storage/
```

其中包括：

- `uploads/`
- `jobs/`

这些都是本地运行时数据，不提交到 GitHub。

## 适合的使用场景

这个服务适合当前项目的“单机联调”和“本地原型验证”阶段。

如果后面要继续演进，优先顺序建议是：

1. 优化 prompt 和输入约束
2. 增加前处理和质量校验
3. 引入多步 AI 流程
4. 最后再考虑更深的模型定制
