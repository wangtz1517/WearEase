# AI Intake Service

本目录是“新增衣物 AI 标准化”的本地后端服务。

当前支持两种 provider：

- `mock`
  用于联调网页和任务流程，不调用真实 AI
- `seedream`
  调用火山方舟 Seedream 图片生成接口，返回真实标准图

## 启动

默认使用 `mock`：

```bash
cd ai-intake-service
node src/server.js
```

默认端口：
`8123`

健康检查：
`GET http://127.0.0.1:8123/health`

## 使用 Seedream

不要把 API Key 写进代码里，使用环境变量启动。

也可以直接使用一键启动脚本：

```powershell
.\start-ai-intake.ps1
```

或在项目根目录双击：

```text
start-ai-intake.bat
```

脚本会自动读取 `ai-intake-service/.env`。

首次使用时：

1. 复制 `ai-intake-service/.env.example` 为 `ai-intake-service/.env`
2. 把 `VOLCENGINE_API_KEY` 改成你自己的 Key
3. 再运行脚本

PowerShell 示例：

```powershell
$env:AI_PROVIDER="seedream"
$env:VOLCENGINE_API_KEY="你的新APIKey"
$env:VOLCENGINE_IMAGE_MODEL="doubao-seedream-5-0-260128"
node src/server.js
```

可选环境变量：

- `AI_PROVIDER`
  `mock` 或 `seedream`
- `VOLCENGINE_API_KEY`
  火山方舟 API Key
- `VOLCENGINE_IMAGE_MODEL`
  默认 `doubao-seedream-5-0-260128`
- `VOLCENGINE_BASE_URL`
  默认 `https://ark.cn-beijing.volces.com/api/v3`

说明：

- 当前 `seedream` provider 会把上传图作为参考图传给模型
- 当前只生成 `standard` 产物
- `mask` 还没有接入独立抠图模型，所以会为空
- 最终结果仍建议人工复核

## 接口

### 创建任务

`POST /api/intake/jobs`

请求示例：

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

`GET /api/intake/jobs/:jobId`

### 获取产物

`GET /api/intake/jobs/:jobId/artifacts/source`

`GET /api/intake/jobs/:jobId/artifacts/standard`
