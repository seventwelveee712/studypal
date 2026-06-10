# StudyPal - AI 智能学习助手

![GitHub](https://img.shields.io/github/license/your-username/studypal)
![Node.js](https://img.shields.io/node/v/next)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.x-green)

一个基于 AI 的智能学习助手，帮助用户更高效地学习和管理知识。

## ✨ 功能特性

### 🧠 智能问答
- 基于文档的 AI 问答
- 支持多文档关联提问
- 实时对话交互

### 📚 文档管理
- PDF 文档上传与解析
- 文档列表管理
- 文档搜索功能

### 🎯 学习计划
- AI 生成个性化学习计划
- 任务管理与打卡
- 学习进度追踪

### 🗺️ 学习路径
- 预设学习目标
- 渐进式学习步骤
- 进度可视化

### 📝 学习笔记
- AI 辅助笔记创作
- 智能标签建议
- 内容摘要提取

### 📊 学习评测
- 知识评测功能
- 文档测验生成
- 学习数据统计

### 🏆 成就系统
- 多种成就徽章
- 学习连续记录
- 数据可视化仪表盘

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS 3
- **图标**: Lucide React
- **状态管理**: React Context
- **数据存储**: 本地 JSON 文件

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3001 查看应用。

### 生产构建

```bash
npm run build
npm run start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # 组件目录
│   ├── ChatInterface.tsx   # 聊天界面
│   ├── Dashboard.tsx       # 数据仪表盘
│   ├── DocumentUploader.tsx # 文档上传
│   ├── Header.tsx          # 头部导航
│   ├── Loading.tsx         # 加载组件
│   ├── ErrorBoundary.tsx   # 错误边界
│   └── ...                 # 其他组件
├── contexts/               # Context 目录
│   └── ThemeContext.tsx    # 主题上下文
├── lib/                    # 工具函数
│   ├── ai.ts               # AI 相关
│   ├── document.ts         # 文档管理
│   ├── studyPlan.ts        # 学习计划
│   └── ...                 # 其他工具
└── data/                   # 数据存储
```

## 🔧 配置说明

### 环境变量

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| OPENAI_API_KEY | OpenAI API 密钥 | - |
| APP_PORT | 应用端口 | 3001 |

## 🎨 主题切换

应用支持亮色/暗色主题切换，点击右上角的太阳/月亮图标即可切换。

## 📱 响应式设计

应用完全支持移动端和桌面端访问，自动适配不同屏幕尺寸。

## 🧪 测试

```bash
npm run test
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**StudyPal** - 让学习更智能、更高效 🚀
