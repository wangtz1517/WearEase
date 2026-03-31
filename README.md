# Atelier Archive

个人电子衣柜原型项目。

这个仓库当前包含两条主线：

- 主站前端：衣柜、穿搭、收纳、新增衣物页面
- 本地 AI Intake Service：接收衣物图片、调用 AI、生成标准归档图

## 当前能力

- 独立的衣柜管理界面
- 新增衣物页已接入 AI 生成链路
- 支持通过本地后端调用 Seedream 生成标准归档图
- 生成后可直接加入衣柜
- 衣柜页支持看板视图和表格视图

## 仓库结构

```text
.
├─ index.html
├─ app.js
├─ styles.css
├─ studio/
│  ├─ intake-studio.html
│  ├─ intake-studio.js
│  └─ intake-studio.css
├─ ai-intake-service/
│  ├─ src/
│  ├─ start-ai-intake.ps1
│  ├─ .env.example
│  └─ README.md
├─ docs/
│  ├─ README.md
│  ├─ product/
│  ├─ ai/
│  ├─ design/
│  └─ archive/
├─ assets/
└─ start-ai-intake.bat
```

## 快速开始

### 1. 打开前端

主站是静态页面，直接打开根目录下的 `index.html` 即可。

### 2. 启动本地 AI 后端

如果要使用“新增衣物 -> AI 标准化 -> 加入衣柜”这条链路，需要先启动本地服务。

Windows 下推荐直接双击：

```text
start-ai-intake.bat
```

或者手动运行：

```powershell
cd ai-intake-service
node src/server.js
```

默认地址：

```text
http://127.0.0.1:8123
```

健康检查：

```text
http://127.0.0.1:8123/health
```

## Seedream 配置

如果要启用真实 AI，请在 `ai-intake-service/.env` 中配置：

```env
AI_PROVIDER=seedream
VOLCENGINE_API_KEY=your_api_key
VOLCENGINE_IMAGE_MODEL=doubao-seedream-5-0-260128
```

仓库只保留模板文件 `ai-intake-service/.env.example`。真实 `.env` 已被忽略，不会上传到 GitHub。

## 文档导航

- [文档总览](./docs/README.md)
- [产品文档](./docs/product/README.md)
- [AI 文档](./docs/ai/README.md)
- [设计文档](./docs/design/README.md)
- [AI 服务说明](./ai-intake-service/README.md)

## 当前开发重点

当前主线已经从“验证 AI 调用链路”推进到“主站集成”：

1. 新增衣物页面已并入主站
2. 标准图生成后可直接写入衣柜
3. 衣柜页支持看板与表格两种管理方式

后续如果继续优化，建议按这个顺序推进：

1. 继续积累通过样本和失败样本
2. 优化 prompt 和输入约束
3. 增加前处理或多步 AI 流程
4. 最后再考虑更深的模型定制

## 提交说明

以下内容为本地运行数据，不提交到仓库：

- `ai-intake-service/.env`
- `ai-intake-service/storage/`
- `assets/ai-test/`

