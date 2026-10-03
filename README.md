# TTL — TimeToLinux

> 现在正是切换到 Linux 的好时候。

TTL 是一个 **SKILL**，指导 AI agent 帮用户构建一个**专属于他的完整桌面 Linux 发行版**——开箱即用，针对他的设备特化优化，内嵌本地 AI 助手。

## 核心理念

> **开箱即用 × 极致特化**
> 不是"装完能用"，而是"装完就像为你量身定做了三年"。

- **完整桌面体验**：启动即进图形桌面，不是无界面服务器
- **全链路性能优化**：从工具链 → C 库 → 内核 → 用户空间，全部针对用户 CPU 指令集重新编译
- **开箱即用**：桌面美化、输入法、Windows 软件兼容全部预配置
- **内嵌 AI**：本地问答助手，携带同样的理念持续帮用户优化

---

## 🤖 面向 Agent

> 本节是给 AI agent 读的。人类用户请跳到 [面向人类](#-面向人类)。

### 触发条件

当用户表达以下意图时，加载本 SKILL：
- "想切换到 Linux"
- "帮我构建一个 Linux 发行版"
- "我想用 Linux 但不知道选哪个"
- "帮我做一个专属于我的 Linux"

### 标准工作流程

用户已 fork 本仓库并 clone 到本地。你的工作目录就是 fork 仓库根目录。按以下流程推进：

#### 阶段 0：加载 SKILL

1. 读取 `skill/SKILL.md`（完整流程 + 9 步构建指导）
2. 读取 `skill/build-environment.md`（构建环境要求 + 各步骤坑点）
3. 读取 `skill/search-protocol.md`（搜索-决策-记录-避坑）
4. 读取 `skill/progress-protocol.md`（进度管理 + 断点续传）
5. 读取 `skill/failure-protocol.md`（失败分类 + 恢复）
6. 读取 `skill/github-actions.md`（GitHub Actions 构建指导）
7. 读取 `skill/report-protocol.md`（报告 + 产物指南）
8. 读取 `skill/system-setup.md`（安装后配置指导）

#### 阶段 A：用户电脑端

**A1. 环境探查**
- 收集用户硬件信息（执行探查命令或逐项询问用户）
- 根据探查结果，主动搜索该硬件的最佳 Linux 配置（双轨搜索，详见 `search-protocol.md`）

**A2. 偏好问答**
- 逐项询问用户（每项附推荐 + 理由）
- 每个回答后，主动搜索该选择的最新最佳实践 + 避坑

**A3. 生成配置**
- 综合探查 + 问答 + 搜索结果，生成构建配置
- 向用户展示配置摘要 + 每个决策的理由 + 避坑报告
- **等用户确认后再进入构建**

#### 阶段 B：构建执行端

**核心原则：每个构建步骤开始前，agent 必须执行"搜索-决策-记录"循环**

每个步骤的标准流程：
1. 读取进度文件（检查是否需要断点续传）
2. 读取构建配置 + 版本锁定
3. 搜索-决策-记录（最佳实践 + 避坑双轨）
4. **询问用户**：本步的关键决策展示推荐 + 理由，等用户确认或调整后再执行
5. 执行构建（带进度更新）
6. 验证产物
7. 更新进度文件
8. 上传产物 + 决策日志 + 避坑报告

**构建平台选择**（Step 1 前询问用户）：
- 本地构建：用户自己机器上跑，agent 逐步指导
- GitHub Actions：agent 生成 workflow 文件，用户 push 后自动构建（详见 `github-actions.md`）
- 其他 CI：用户指定平台，agent 按该平台语法生成配置

**9 步构建路线**（详见 `SKILL.md`）：
1. 主机准备
2. 交叉工具链
3. Chroot 工具
4. 基础系统（~50 包）
5. 内核 + 引导加载器
6. 桌面体验
7. 用户软件 + Windows 兼容
8. AI 助手
9. 打包 ISO

#### 阶段 C：报告 + 产物提交

**构建完成后，必须执行**（详见 `report-protocol.md`）：

1. 生成构建报告（`dist/report/build-report.md`）
2. 生成决策日志（`dist/report/decision-log.md`）
3. 生成避坑报告（`dist/report/pitfall-report.md`）
4. 生成失败知识库（`dist/report/failure-knowledge.md`）
5. 生成冒烟测试报告（`dist/report/smoke-test.md`）
6. 生成安装指南（`dist/guide/install-guide.md`）
7. 生成首次启动指南（`dist/guide/first-boot.md`）
8. 生成日常使用指南（`dist/guide/daily-use.md`）
9. 复制 ISO 到 `dist/iso/`
10. 复制构建配置到 `dist/config/`
11. `git add dist/ && git commit -m "build: <build_id> 构建完成" && git push`
12. 发布 GitHub Release（ISO 文件）

#### 阶段 D：发行版运行端

内嵌 AI 助手的职责（详见 `system-setup.md`）：
1. 帮助用户解答 Linux 使用问题
2. 根据用户硬件，主动建议性能优化方案
3. 帮助用户排查故障
4. 推荐适合用户场景的软件
5. 定期扫描系统，发现可优化项并主动建议

### 风险提示（必须告知用户）

1. **数据备份**："安装前务必备份重要数据！"
2. **双系统**："如果你要双系统，先关闭 Windows 的快速启动。"
3. **NVIDIA 驱动**："NVIDIA 显卡用户注意：Linux 驱动需要联网安装。"
4. **游戏**："Linux 游戏通过 Steam + Proton 运行，少数有反作弊的游戏不行。"
5. **构建时间**："构建需要 4-6 小时，注意构建平台的额度限制。"
6. **构建环境**："LFS 构建需要专用用户和足够磁盘空间（建议 100GB+）。"

### 循环防护

构建失败后的恢复操作必须遵守循环防护规则（详见 `failure-protocol.md`）：
- 指纹去重：失败过的恢复命令禁止原样再执行
- 进度停滞：连续 3 轮无新进展 = 停滞 → 停止 + 向用户报告
- 轮次预算：构建任务建议 30 轮
- 同一错误连续 2 次 → 停止重试，必须换方案

---

## 👤 面向人类

### 这是什么

TTL 帮你构建一个**专属于你**的 Linux 发行版。不是 Ubuntu、不是 Fedora，而是针对你的 CPU 指令集、你的 GPU、你的使用习惯，从工具链到桌面环境全部重新编译的完整桌面系统。

### 快速开始

#### 第 1 步：Fork 本仓库

1. 在 GitHub 上点击 **Fork**
2. 将 fork 后的仓库 clone 到本地：
   ```bash
   git clone https://github.com/<你的用户名>/TTL.git
   cd TTL
   ```

#### 第 2 步：加载 SKILL 并告诉 AI

在你的 AI 助手（如 DeepSeek Harness、Claude 等）中：

1. 告诉 AI 你的工作目录是 fork 仓库根目录
2. 告诉 AI：

   > "加载 `skill/SKILL.md` 并执行 SKILL。我想切换到 Linux，帮我构建一个专属于我的发行版。"

AI 会按照 SKILL 的指导自动：
1. 探查你的电脑环境
2. 问你几个问题（桌面偏好、常用软件、性能倾向等）
3. 每个决策点主动搜索最佳实践 + 避坑
4. 生成构建配置（含决策理由）
5. 指导你执行构建（本地或 GitHub Actions）
6. 构建完成后生成报告 + 产物指南，提交到你的 fork 仓库

#### 第 3 步：构建

**本地构建**：
- 按 AI 指导准备构建环境（专用用户、100GB+ 磁盘）
- AI 逐步指导 9 步构建
- 构建耗时 4-6 小时

**GitHub Actions 构建**（推荐）：
- AI 生成 `.github/workflows/build.yml`
- 你 push 到 fork 仓库
- GitHub Actions 自动构建（需要 self-hosted runner，磁盘 100GB+）
- 构建完成自动上传 ISO + 报告

#### 第 4 步：获取产物

构建完成后，在你的 fork 仓库的 `dist/` 目录中：

```
dist/
├── iso/
│   ├── ttl-live-<build_id>.iso      # 体验版（U 盘启动试用，不写硬盘）
│   └── ttl-install-<build_id>.iso   # 无人值守安装版（U 盘启动自动安装）
├── report/
│   ├── build-report.md              # 构建报告（决策理由 + 避坑 + 失败记录）
│   └── ...
├── guide/
│   ├── install-guide.md            # 安装指南
│   ├── first-boot.md               # 首次启动指南（NVIDIA 驱动联网安装等）
│   └── daily-use.md               # 日常使用指南
└── config/
    └── build-config.json          # 构建配置（硬件画像 + 软件清单）
```

#### 第 5 步：安装使用

**体验版**：
1. U 盘启动
2. 直接进入完整桌面试用
3. 不写入硬盘，重启恢复原状
4. 适合评估是否满意

**无人值守安装版**：
1. U 盘启动
2. 自动分区 + 自动安装
3. 全程无需人工干预
4. 安装完成后重启进入桌面

**首次启动**：
- 按 `dist/guide/first-boot.md` 操作
- NVIDIA 用户：联网后安装驱动
- 验证桌面/输入法/网络/声音/AI 助手

### 仓库结构

```
TTL/
├── README.md                    # 本文件（面向 agent + 面向人类）
├── skill/
│   ├── SKILL.md                 # 核心理念 + 完整流程（含 9 步构建指导）+ 三大能力
│   ├── build-environment.md     # 构建环境要求 + 各步骤坑点 + 验证方法
│   ├── search-protocol.md       # 搜索-决策-记录-避坑 指导
│   ├── progress-protocol.md     # 进度管理 + 断点续传 指导
│   ├── failure-protocol.md      # 失败分类 + 恢复指导
│   ├── github-actions.md        # GitHub Actions 构建指导
│   ├── report-protocol.md       # 构建报告 + 产物指南 指导
│   └── system-setup.md          # 安装后系统配置指导
├── dist/                        # 构建产物（构建完成后由 agent 提交）
│   ├── iso/                   # ISO 文件
│   ├── report/                # 构建报告
│   ├── guide/                 # 使用指南
│   └── config/                # 构建配置
└── .github/
    └── workflows/
        └── build.yml          # GitHub Actions workflow（如使用）
```

### 许可

TTL SKILL：MIT License
