# 轻量级静态游戏 - SEO/GEO 优化站点

一个轻量级静态娱乐游戏落地页，内置完整的 SEO 与生成式引擎优化（GEO）配置，已部署到 Cloudflare Pages。

**生产地址：** https://static-casino-demo.pages.dev/

## 项目结构

```
static-casino-game/
├── index.html              # 主页：语义化 HTML + 完整 Meta / OG / Twitter Card / JSON-LD
├── privacy.html            # 隐私政策
├── terms.html              # 服务条款
├── 404.html                # 自定义 404 页面
├── assets/css/main.css     # 轻量级响应式样式
├── assets/js/main.js       # 老虎机演示逻辑（纯前端，无后端依赖）
├── assets/images/          # favicon.svg / logo.svg / og-image.png (1200×630)
├── site.webmanifest        # PWA 清单
├── sw.js                   # Service Worker（离线缓存）
├── robots.txt              # 爬虫协议
├── sitemap.xml             # 站点地图
├── _headers                # Cloudflare Pages / Netlify 响应头
├── _redirects              # Cloudflare Pages 重定向配置
├── netlify.toml            # Netlify 配置
├── vercel.json             # Vercel 配置
└── dist/                   # 部署产物（仅包含站点文件）
```

## 本地预览

```bash
cd static-casino-game
python -m http.server 8000
# 访问 http://localhost:8000
```

## 部署（Cloudflare Pages）

```bash
npx wrangler pages deploy dist --project-name static-casino-demo --branch main
```

或推送到 GitHub 后，在 Cloudflare Dashboard → Pages 连接仓库：
- Framework preset: **None**
- Build command: 留空
- Build output directory: `dist`

## SEO / GEO 优化清单

| 项 | 配置位置 | 说明 |
|---|---|---|
| 语义化标签 | index.html | header / nav / main / section / article / aside / footer |
| 基础 Meta | index.html | title / description / keywords / robots / canonical / theme-color |
| Open Graph | index.html | og:type / title / description / url / image / locale |
| Twitter Card | index.html | summary_large_image + image:alt |
| 结构化数据 | index.html (JSON-LD) | WebSite / VideoGame / Organization / BreadcrumbList / FAQPage / WebPage |
| GEO Speakable | index.html (JSON-LD) | SpeakableSpecification 标注可朗读摘要段落 |
| 可访问性 | index.html | skip-link / aria-label / aria-live / 键盘导航 / 语义标题层级 |
| 性能 | _headers | 关键资源 preload / defer 脚本 / 分级缓存 / 安全头 |
| PWA | site.webmanifest / sw.js | 离线缓存 / 独立展示模式 |

## 缓存策略

- HTML：`max-age=0, must-revalidate`
- CSS / JS：`max-age=86400`（1 天），更新时通过 `?v=` 版本号刷新
- 图片：`max-age=31536000, immutable`

## 替换为自定义域名

1. 在 Cloudflare Pages 项目 → Custom domains 绑定域名。
2. 全局替换 `https://static-casino-demo.pages.dev` 为新域名（index.html、privacy.html、terms.html、sitemap.xml、robots.txt）。
3. 在 Google Search Console / Bing Webmaster Tools 提交 `sitemap.xml`。

## 合规提示

页面已标注“仅供娱乐演示，不涉及真实货币赌博”。如所在地区对赌博类内容有法律限制，请自行合规调整，并视需要添加年龄验证或地域限制。
