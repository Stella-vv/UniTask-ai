# UniTask AI Frontend

UniTask AI 是一个基于 React 的现代化教育管理平台前端应用，专为导师和学生设计，提供课程管理、作业管理、论坛交流、FAQ 管理等功能。

## 项目概述

UniTask AI 前端是一个单页面应用（SPA），采用 React 19 + Vite 构建，使用 Material-UI 组件库提供现代化的用户界面。项目支持导师和学生两种角色，提供不同的功能模块和权限控制。

## 功能特性

### 导师功能
- **仪表板** - 课程概览和统计信息
- **课程管理** - 课程详情查看和修改
- **作业管理** - 作业上传、编辑、详情查看
- **论坛管理** - 作业相关讨论区
- **Q&A 管理** - Q&A 文件上传和管理
- **FAQ 管理** - FAQ 上传和列表查看

### 学生功能
- **仪表板** - 个人学习概览
- **课程查看** - 课程详情和进度
- **作业查看** - 作业列表和详情
- **论坛参与** - 作业讨论区
- **FAQ 查看** - 常见问题解答
- **AI 助手** - 智能聊天帮助

## 技术栈

- **前端框架**: React 19.1.0
- **构建工具**: Vite 6.3.5
- **路由管理**: React Router DOM 7.6.2
- **UI 组件库**: Material-UI 7.1.2
- **HTTP 客户端**: Axios 1.10.0
- **样式方案**: Emotion (CSS-in-JS)
- **字体**: Poppins
- **代码规范**: ESLint 9.25.0

## 项目结构
src/
├── api/ # API 接口配置
│ └── index.js # Axios 实例和拦截器
├── components/ # 公共组件
│ ├── MainLayout.jsx # 导师主布局
│ ├── StudentMainLayout.jsx # 学生主布局
│ ├── ProtectedRoute.jsx # 路由保护组件
│ └── Sidebar.jsx # 侧边栏组件
├── PublicPage/ # 公共页面
│ ├── Login/ # 登录页面
│ └── Register/ # 注册页面
├── tutorworkspace/ # 导师工作区
│ ├── Dashboard/ # 仪表板
│ ├── CourseDetail/ # 课程详情
│ ├── CourseModify/ # 课程修改
│ ├── AssignmentList/ # 作业列表
│ ├── AssignmentUpload/ # 作业上传
│ ├── AssignmentDetail/ # 作业详情
│ ├── AssignmentModify/ # 作业修改
│ ├── Forum/ # 论坛
│ ├── QandA/ # Q&A 上传
│ ├── QandAList/ # Q&A 列表
│ ├── FaqUpload/ # FAQ 上传
│ └── FaqList/ # FAQ 列表
├── studentworkspace/ # 学生工作区
│ ├── Dashboard/ # 学生仪表板
│ ├── CourseDetail/ # 课程详情
│ ├── AssignmentList/ # 作业列表
│ ├── AssignmentDetail/ # 作业详情
│ ├── Forum/ # 论坛
│ ├── FaqList/ # FAQ 列表
│ └── Chat/ # AI 聊天助手
├── theme/ # 主题配置
│ └── theme.js # Material-UI 主题
├── App.jsx # 主应用组件
└── main.jsx # 应用入口


## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
cd UniTask-ai-frontend
npm install
```

### 环境配置

创建 `.env` 文件并配置后端 API 地址：

```env
VITE_BACKEND_URL=http://localhost:8008/api
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 身份验证

项目使用基于角色的访问控制（RBAC）：

- **导师角色** (`tutor`): 可以访问所有导师功能模块
- **学生角色** (`student`): 可以访问学生功能模块

身份验证通过 `ProtectedRoute` 组件实现，未登录用户会被重定向到登录页面。

## UI/UX 设计

- 采用 Material-UI 设计系统
- 响应式设计，支持桌面和移动设备
- 统一的主题色彩和字体
- 直观的导航和用户界面

## 开发指南

### 添加新页面

1. 在相应的 workspace 目录下创建新组件
2. 在 `App.jsx` 中添加路由配置
3. 根据需要添加权限控制

### API 调用

使用 `src/api/index.js` 中配置的 Axios 实例：

```javascript
import api from '../api';

// GET 请求
const response = await api.get('/endpoint');

// POST 请求
const response = await api.post('/endpoint', data);
```

### 样式开发

项目使用 Material-UI 的 `styled` 组件进行样式开发：

```javascript
import { styled } from '@mui/material/styles';

const StyledComponent = styled('div')(({ theme }) => ({
  // 样式定义
}));
```

## 脚本命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产版本
- `npm run lint` - 运行代码检查

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

**UniTask AI Frontend** - 让教育管理更智能、更高效！