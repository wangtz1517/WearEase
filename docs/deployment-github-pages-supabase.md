# GitHub Pages + Supabase 部署说明

## 1. GitHub Pages

仓库里已经加了 GitHub Actions 工作流：

- `.github/workflows/deploy-pages.yml`
- `scripts/build-pages.js`

你只需要：

1. 推送到 `main`
2. 进入 GitHub 仓库 `Settings -> Pages`
3. 把发布方式切换成 `GitHub Actions`

默认站点地址会是：

```text
https://wangtz1517.github.io/AtelierArchive/
```

## 2. Supabase 项目

在 Supabase 新建项目后，先做三件事：

1. 打开 SQL Editor
2. 执行 `supabase/schema.sql`
3. 在 `Authentication -> URL Configuration` 里配置：

```text
Site URL:
https://wangtz1517.github.io/AtelierArchive/

Redirect URL:
https://wangtz1517.github.io/AtelierArchive/
```

如果你开启邮箱确认，注册后用户会先收到验证邮件，再回来登录。

## 3. 前端公开配置

编辑根目录的 `public-config.js`：

```js
window.APP_CONFIG = Object.assign(
  {
    siteUrl: "https://wangtz1517.github.io/AtelierArchive/",
    supabaseUrl: "https://YOUR_PROJECT.supabase.co",
    supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
    supabaseBucket: "garment-images",
    aiServiceBaseUrl: "http://127.0.0.1:8123"
  },
  window.APP_CONFIG || {}
);
```

说明：

- `supabaseAnonKey` 是前端公开 key，可以放在 GitHub Pages。
- 绝对不要把 `service_role` key 放进前端。
- `aiServiceBaseUrl` 现在默认还是本地开发地址。

## 4. 当前已接好的能力

- 邮箱注册
- 邮箱密码登录
- 登录态恢复
- 衣柜自定义衣物同步到 `garments` 表
- 删除和编辑同步到云端
- 衣物图片支持上传到 `garment-images` bucket

## 5. 当前仍是第二阶段的部分

AI 处理台现在还是调用本地服务：

```text
http://127.0.0.1:8123
```

所以 GitHub Pages 上线后：

- 主站
- 登录/注册
- 云端衣柜数据

这些都可以工作。

但 `AI 图片标准化处理` 还需要你把 `ai-intake-service` 单独部署到可公网访问的地址，然后把 `public-config.js` 里的 `aiServiceBaseUrl` 改成那个线上地址。

## 6. 建议的下一步

推荐顺序：

1. 先推 GitHub Pages，把主站上线
2. 再创建 Supabase 项目并执行 `supabase/schema.sql`
3. 填写 `public-config.js`，验证注册/登录/云端保存
4. 最后再单独部署 `ai-intake-service`
