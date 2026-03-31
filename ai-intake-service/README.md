# AI Intake Service

本目录是“新增衣物 AI 标准化”本地服务骨架。

当前目标不是立刻跑出真实 AI 图，而是先把下面这些基础能力搭起来：

- 接收前端上传
- 创建任务
- 保存源图
- 查询任务状态
- Provider 抽象
- Mock Provider 占位

## 当前状态

已完成：

- 本地 HTTP 服务
- `POST /api/intake/jobs`
- `GET /api/intake/jobs/:jobId`
- `GET /api/intake/jobs/:jobId/artifacts/:kind`
- 本地任务 JSON 落盘
- 本地源图落盘
- Mock Provider 任务编排

未完成：

- 真实 AI 分割
- 真实标准图生成
- 与 `intake-studio.html` 的前端联调

## 启动方式

```bash
cd ai-intake-service
node src/server.js
```

默认端口：

`8123`

健康检查：

`GET http://127.0.0.1:8123/health`

## 接口

### 创建任务

`POST /api/intake/jobs`

请求体：

```json
{
  "sourceImageDataUrl": "data:image/png;base64,...",
  "sourceFilename": "shirt.png",
  "categoryHint": "top",
  "garmentName": "白色针织衫",
  "notes": "生成标准平铺图"
}
```

### 查询任务

`GET /api/intake/jobs/:jobId`

### 获取产物

`GET /api/intake/jobs/:jobId/artifacts/source`

当前只有 `source` 一定存在。

## 下一步

下一步要做的事很明确：

- 前端 intake-studio 改成调这个服务
- 再接真实 AI Provider

要继续往下做，需要你后面提供：

- AI 平台选择
- API Key
- 样例衣物图片
- 理想输出参考图
