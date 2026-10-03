# TTL — TimeToLinux：为你的硬件量身定制的 Linux 发行版

> 本文整合自 TTL 项目的 9 份文档（README + 8 份 SKILL 协议），面向想了解这个项目的人类读者。

---

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
│   ├── SKILL.md               # 核心理念 + 完整流程（含 9 步构建指导）+ 三大能力
│   ├── build-environment.md   # 构建环境要求 + 各步骤坑点 + 验证方法
│   ├── search-protocol.md     # 搜索-决策-记录-避坑 指导
│   ├── progress-protocol.md   # 进度管理 + 断点续传 指导
│   ├── failure-protocol.md    # 失败分类 + 恢复指导
│   ├── github-actions.md      # GitHub Actions 构建指导
│   ├── report-protocol.md     # 构建报告 + 产物指南 指导
│   └── system-setup.md        # 安装后系统配置指导
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

---


# TTL SKILL — 指导 Agent 构建个性化桌面 Linux 发行版

> 当用户表达"想切换到 Linux"、"帮我构建一个 Linux 发行版"、"我想用 Linux 但不知道选哪个"等意图时，加载本 SKILL。

## 定位

本 SKILL **只指导 agent 该怎么做**，不包含任何构建脚本、配置 schema、软件清单或具体参数值。

agent 的职责是：探查用户环境 → 询问用户偏好 → 每个决策点主动搜索 → 生成构建配置 → 指导构建执行 → 构建失败时提供恢复指导。

**构建环境准备和各步骤坑点详见 `build-environment.md`**。
**GitHub Actions 构建指导详见 `github-actions.md`**。
**构建报告 + 产物指南详见 `report-protocol.md`**。
**安装后系统配置详见 `system-setup.md`**。

## 核心理念（刻入 DNA）

> **开箱即用 × 极致特化**
> 不是"装完能用"，而是"装完就像为你量身定做了三年"。

- **完整桌面体验**：启动即进图形桌面，不是无界面服务器
- **全链路性能优化**：从工具链 → C 库 → 内核 → 用户空间，全部针对用户 CPU 指令集重新编译
- **开箱即用**：桌面美化、输入法、Windows 软件兼容全部预配置
- **内嵌 AI**：本地问答助手，携带同样的理念持续帮用户优化

## 完整流程

### 阶段 A：用户电脑端（SKILL 驱动）

**A1. 环境探查**

收集用户硬件信息（执行探查命令或逐项询问用户）：
- CPU 型号与指令集（决定 `-march` 和编译优化方向）
- 内存大小（决定桌面环境推荐和内核调优方向）
- 磁盘类型（SSD/HDD/NVMe，决定 I/O 调优）
- GPU 型号与驱动类型（NVIDIA/AMD/Intel，决定内核模块和驱动方案）
- 已装软件（决定预装软件清单）

**SKILL 行为**：根据探查结果，主动搜索该硬件的最佳 Linux 配置（双轨搜索，详见 `search-protocol.md`）
  - 例：检测到 NVIDIA RTX 4090 → 搜索 "RTX 4090 Linux best kernel config 2025" + "RTX 4090 Linux known issues 2025"
  - 例：检测到 64GB 内存 → 搜索 "64GB RAM Linux vm tuning best practices"

**A2. 偏好问答**（通俗语言，根据硬件推荐选项）

逐项询问用户（每项附推荐 + 理由）：
1. 桌面环境倾向（轻量 / 现代 / 可定制 / 极简）— 根据内存/CPU 推荐
2. 常用软件类别（浏览器/办公/开发/媒体/游戏/设计）— 预装到 Linux
3. 主要使用场景（办公/开发/游戏/设计/综合）— 决定内核调优方向
4. 性能倾向（性能优先 / 均衡 / 省电）— 笔记本推荐均衡
5. 安装方式（先体验 / 直接无人值守安装）— 建议先体验
6. 其他偏好（语言/时区/双系统/加密）— 系统配置

**SKILL 行为**：每个回答后，主动搜索该选择的最新最佳实践 + 避坑
  - 例：用户选 KDE → 搜索 "KDE Plasma 6 best configuration 2025" + "KDE Plasma 6 known issues 2025"
  - 例：用户选游戏 → 搜索 "Linux gaming best setup Proton 2025" + "Linux gaming known issues 2025"

**A3. 生成配置**

综合探查 + 问答 + 搜索结果，生成构建配置。配置应覆盖以下维度（每个字段附"为什么这样选"的注释）：
- **硬件画像**：CPU 架构、指令集、核心数、内存、磁盘、GPU
- **桌面环境**：选择 + 主题（图标/光标/壁纸/字体）
- **输入法**：框架 + 输入法列表
- **内核**：版本、加固选项、CPU 优化、GPU 驱动、电源策略
- **软件包**：核心 / 开发 / 额外（根据用户选择）
- **Windows 兼容**：Wine 版本、WinApps、预装应用
- **AI 助手**：模型、量化、运行时、系统提示词
- **安装**：无人值守、磁盘布局、时区、语言、用户名、加密

向用户展示配置摘要 + 每个决策的理由 + 避坑报告，**等用户确认后再进入构建**。

### 阶段 B：构建执行端（SKILL 理念驱动每步决策）

**核心原则：每个构建步骤开始前，agent 必须执行"搜索-决策-记录"循环**（详见 `search-protocol.md`）

每个步骤的标准流程：
1. 读取进度文件（检查是否需要断点续传，详见 `progress-protocol.md`）
2. 读取构建配置 + 版本锁定
3. 搜索-决策-记录（最佳实践 + 避坑双轨）
4. **询问用户**：本步的关键决策（版本选择、编译参数、配置选项）展示推荐 + 理由，等用户确认或调整后再执行
5. 执行构建（带进度更新）
6. 验证产物
7. 更新进度文件
8. 上传产物 + 决策日志 + 避坑报告

**构建平台选择**（Step 1 前询问用户）：
- 本地构建：用户自己机器上跑，agent 逐步指导
- GitHub Actions：agent 生成 workflow 文件，用户 push 后自动构建（详见 `github-actions.md`）
- 其他 CI：用户指定平台，agent 按该平台语法生成配置

#### 构建步骤指导（LFS + BLFS 路线）

**Step 1：主机准备**
- 创建专用构建用户（非 root，无 shell 限制）
- 安装 LFS 要求的主机工具链（gcc、glibc、binutils、make、bash、coreutils 等）
- 创建 `/mnt/lfs` 目录并设置权限
- 关键决策：确认主机工具链版本满足 LFS 最低要求
- **询问用户**：构建平台选择（本地 / GitHub Actions / 其他 CI）+ 磁盘空间确认（100GB+）
- 验证：`gcc --version`、`ldd --version`、`make --version` 输出符合 LFS 要求

**Step 2：交叉工具链**
- 编译针对用户 CPU 的 GCC 交叉编译器
- 关键决策：`-march=<用户CPU架构>` 的选择（搜索该 CPU 的最佳 march 值 + 已知问题）
- 关键决策：是否启用 LTO（链接时优化）— 搜索 LTO 当前版本的稳定性
- 关键决策：PIE + SSP 安全加固参数
- **询问用户**：march 值确认（展示推荐 + 理由）+ LTO 开关确认（展示稳定性搜索结果）
- 验证：交叉编译器能编译并运行 hello world 测试程序
- 注意：此步耗时最长（GCC 编译 30-60 分钟），必须后台跑

**Step 3：Chroot 工具**
- 在 chroot 环境中编译基础工具（binutils、gcc 第二阶段、glibc、coreutils 等）
- 关键决策：glibc 安全参数（stack protector 级别）
- 关键决策：Python 版本选择（搜索当前最稳定版本）
- **询问用户**：Python 版本确认（展示推荐 + 理由）+ glibc 安全参数确认
- 验证：chroot 内 `gcc`、`ld`、`bash` 可正常运行
- 注意：chroot 环境内无网络，所有源码必须提前下载

**Step 4：基础系统（~50 包）**
- 按 LFS 指定顺序编译基础系统包
- 关键决策：每个包的编译参数（CFLAGS/CXXFLAGS/LDFLAGS）
- 关键决策：包版本选择（搜索每个包的当前最稳定版本 + 已知 bug）
- 关键决策：构建顺序（依赖关系决定顺序，不可乱序）
- **询问用户**：全局 CFLAGS 策略确认（`-march=native` vs 指定值 vs 保守值，展示推荐 + 理由）；每包版本如有多个候选，展示推荐 + 理由让用户确认
- 验证：每包编译后运行 `make check`（如适用）+ 基本功能测试
- 注意：50 个包逐个编译，总耗时 2-3 小时；每包前搜索最佳参数 + 避坑

**Step 5：内核 + 引导加载器**
- 编译针对用户硬件的 Linux 内核
- 关键决策：内核配置（搜索 "Linux <version> best kernel config for <用户硬件>"）
  - GPU 驱动模块（NVIDIA 需专有驱动，AMD/Intel 用开源驱动）
  - NVMe 支持（根据磁盘类型）
  - 调度器调优（根据性能倾向：性能/均衡/省电）
  - 安全加固（KASLR、StackProtector）
- 关键决策：引导加载器配置（UEFI vs Legacy，搜索用户主板最佳配置）
- **询问用户**：内核配置摘要展示（GPU 驱动方案 + 调度器 + 安全加固），等用户确认；引导加载器 UEFI vs Legacy 确认
- 验证：内核能编译通过 + 引导加载器配置正确
- 注意：内核配置错误会导致无法启动，必须搜索避坑

**Step 6：桌面体验**
- 编译用户选择的桌面环境 + 全套组件
- 关键决策：桌面环境版本（搜索当前最稳定 + 已知问题）
- 关键决策：主题配置（图标/光标/壁纸/字体 — 搜索最佳搭配）
- 关键决策：输入法配置（fcitx5 + Rime，搜索最佳配置 + 已知冲突）
- 关键决策：网络配置（NetworkManager，搜索最佳配置）
- 关键决策：声音配置（PipeWire，搜索最佳配置）
- **询问用户**：桌面环境版本确认 + 主题搭配展示（图标/光标/壁纸/字体推荐方案）+ 输入法方案确认
- 验证：桌面环境能启动 + 输入法可用 + 网络/声音正常
- 注意：桌面环境编译耗时 1-2 小时；GPU 驱动与桌面环境的兼容性是最大坑点

**Step 7：用户软件 + Windows 兼容**
- 编译用户选择的软件包
- 关键决策：每个软件的版本（搜索当前最稳定 + 已知问题）
- 关键决策：Wine 配置（搜索 "Wine <version> best configuration for <用户GPU>"）
- 关键决策：WinApps 配置（搜索最佳 setup）
- **询问用户**：软件清单最终确认（展示完整列表 + 版本 + 理由）+ Wine 版本确认 + WinApps 开关确认
- 验证：每个软件能正常运行
- 注意：Wine + GPU 驱动兼容性是常见坑点，必须搜索避坑

**Step 8：AI 助手**
- 编译 llama.cpp + 下载模型
- 关键决策：llama.cpp 编译参数（搜索 "llama.cpp best build flags for <用户CPU>"）
- 关键决策：模型量化选择（根据内存：8GB→Q4_K_M，16GB→Q5_K_M，32GB+→Q6_K）
- 关键决策：系统提示词（携带"开箱即用 × 极致特化"理念）
- **询问用户**：模型选择确认（展示推荐模型 + 量化 + 理由）+ 系统提示词展示（等用户确认或修改）
- 验证：模型能加载 + 推理正常 + 响应时间可接受
- 注意：模型下载耗时（~5.7GB），必须后台跑

**Step 9：打包 ISO**
- 打包体验版 + 无人值守安装版
- 关键决策：ISO 打包工具配置（搜索 "live-build best ISO configuration"）
- 关键决策：无人值守安装配置（搜索 "unattended install best preseed config"）
  - 体验版：不写入硬盘，重启恢复原状
  - 无人值守版：自动分区 + 自动安装，全程无需人工干预
- **询问用户**：磁盘布局确认（分区方案展示 + 理由）+ 是否同时打包体验版和无人值守版（还是只要一个）
- 验证：ISO 能在虚拟机中启动 + 基本功能正常（冒烟测试）
- 注意：冒烟测试必须执行，避免交付无法启动的 ISO

#### 决策日志要求（每步生成，随产物上传）

每个组件记录：
- 组件名 + 版本
- 选择理由（为什么选这个版本）
- 编译参数 + 参数理由（为什么用这些参数）
- 参考来源（URL 列表）

每个避坑记录：
- 组件名
- 问题描述
- 严重程度（critical / medium / low）
- 规避措施
- 来源
- 是否已规避 + 规避方式

### 阶段 C：报告 + 产物提交（构建完成后必须执行）

构建完成后，agent 必须生成完整的构建报告和产物使用指南，提交到用户 fork 仓库（详见 `report-protocol.md`）：

1. **构建报告**（`dist/report/build-report.md`）：构建摘要 + 用户偏好回顾 + 9 步摘要 + 决策日志 + 避坑报告 + 失败记录 + 冒烟测试 + 风险提示
2. **决策日志**（`dist/report/decision-log.md`）：每步的组件/版本/参数/理由/来源
3. **避坑报告**（`dist/report/pitfall-report.md`）：每步的已知坑/严重程度/规避措施
4. **失败知识库**（`dist/report/failure-knowledge.md`）：构建中遇到的失败 + 分类 + 解决方案
5. **冒烟测试报告**（`dist/report/smoke-test.md`）：ISO 启动 + 基本功能验证
6. **安装指南**（`dist/guide/install-guide.md`）：体验版 + 无人值守版安装步骤
7. **首次启动指南**（`dist/guide/first-boot.md`）：NVIDIA 驱动联网安装 + 基本验证
8. **日常使用指南**（`dist/guide/daily-use.md`）：常用命令 + 故障排查 + 安全配置
9. **提交**：`git add dist/ && git commit && git push` + 发布 GitHub Release

### 阶段 D：发行版运行端（内嵌 AI 携带理念）

内嵌 AI 助手的职责指导（详见 `system-setup.md`）：
1. 帮助用户解答 Linux 使用问题（面向新手，通俗语言）
2. 根据用户硬件，主动建议性能优化方案（TLP / 电压下探 / 功率墙）
3. 帮助用户排查故障（声音 / 键盘 / 关机 / 包管理）
4. 推荐适合用户场景的软件
5. 定期扫描系统，发现可优化项并主动建议

AI 应了解这台电脑的完整配置（从系统配置文件读取），所有建议都针对这台具体设备，而非泛泛而谈。

## 三大能力

### 能力 1：搜索避坑（Search & Pitfall Avoidance）

每次搜索不仅找"最佳实践"，还要**主动搜索已知坑**：

- **轨道 1**：最佳实践搜索
- **轨道 2**：避坑搜索（必须执行）

**避坑关注点**：
- 该版本/配置的已知 critical bug
- 特定硬件组合的兼容性问题
- 会影响用户体验的坑（卡顿、黑屏、输入法失效等）
- 社区已知的 workaround

详见 `search-protocol.md`。

### 能力 2：构建进度管理（Progress & Resume）

构建可能持续 4-6 小时，必须支持**断点续传**：

- **进度文件**：实时记录每步状态
- **进度粒度**：步骤 → 包 → 命令 三级
- **断点续传**：构建中断后从断点继续，不重跑已完成步骤

详见 `progress-protocol.md`。

### 能力 3：失败指导（Failure Recovery）

构建失败时，提供**结构化故障排查指导**：

- **失败分类**：网络/编译/依赖/资源/配置 五类
- **恢复方案**：每类失败提供多个恢复选项 + 风险等级
- **失败知识库**：记录已知失败模式和解决方案

详见 `failure-protocol.md`。

## 风险提示（必须告知用户）

1. **数据备份**："安装前务必备份重要数据！虽然无人值守安装不会碰其他分区，但任何磁盘操作都有风险。"
2. **双系统**："如果你要双系统，先关闭 Windows 的快速启动，否则 Linux 看不到 Windows 分区。"
3. **NVIDIA 驱动**："NVIDIA 显卡用户注意：Linux 驱动需要联网安装，首次启动后需要联网。"
4. **游戏**："Linux 游戏通过 Steam + Proton 运行，大部分 Windows 游戏可以玩，但少数有反作弊的游戏不行。"
5. **构建时间**："构建需要 4-6 小时，注意构建平台的额度限制。"
6. **构建环境**："LFS 构建需要专用用户和足够磁盘空间（建议 100GB+），构建期间不要中断。"

## 参考

- LFS: https://www.linuxfromscratch.org/lfs/view/stable/
- BLFS: https://linuxfromscratch.org/blfs/view/stable-systemd/
- live-build: https://github.com/debian-live/live-build
- GitHub Actions: https://docs.github.com/actions
- archlinux 简明指南: https://arch.icekylin.online/guide/

---

# 构建环境指导

本文件指导 agent 在准备和执行 LFS 构建时的环境要求、常见坑和验证方法。

## 构建环境要求

LFS 构建对执行环境有严格要求，agent 在指导用户准备构建环境时必须确认：

### 用户与权限
- **专用构建用户**：非 root，无 shell 限制，无 sudo 权限
- **权限隔离**：构建用户只能访问 `/mnt/lfs` 和源码目录，不能修改系统目录
- **原因**：LFS 要求纯净环境，避免宿主机工具链污染构建产物

### 磁盘空间
- **最低 100GB**（含源码 + 中间产物 + 最终 ISO）
- **建议 200GB+**（基础系统 50 包 + 桌面环境 + 用户软件的中间产物很大）
- **检查命令**：`df -h /mnt/lfs`
- **坑**：磁盘空间不足是构建失败的最常见原因之一，必须在 Step 1 前确认

### 网络
- **构建期间需要稳定网络**（下载源码包）
- **chroot 内无网络**：所有源码必须在进入 chroot 前下载完毕
- **坑**：chroot 内尝试联网会失败，必须提前下载

### 时间
- **总耗时 4-6 小时**（取决于硬件和包数量）
- **Step 2（交叉工具链）最长**：GCC 编译 30-60 分钟
- **Step 4（基础系统）次长**：50 包逐个编译 2-3 小时
- **坑**：构建期间不要中断（断电、重启），否则需要断点续传

## 各步骤环境坑点

### Step 1：主机准备
- **坑**：宿主机 gcc 版本过低 → 交叉编译器编译失败
- **验证**：`gcc --version`、`ldd --version`、`make --version` 输出符合 LFS 最低要求
- **坑**：`/mnt/lfs` 权限不正确 → 后续步骤全部失败
- **验证**：`ls -ld /mnt/lfs` 确认构建用户有 rw 权限

### Step 2：交叉工具链
- **坑**：`-march` 值错误 → 编译出的工具链在目标 CPU 上无法运行
- **避坑**：搜索 "<CPU型号> best -march value" + "<CPU型号> -march known issues"
- **坑**：LTO 与当前 GCC 版本不兼容 → 链接失败
- **避坑**：搜索 "GCC <version> LTO known issues"
- **验证**：交叉编译器能编译并运行 hello world 测试程序
- **注意**：此步耗时最长，必须后台跑

### Step 3：Chroot 工具
- **坑**：chroot 内缺少必要文件（/dev、/proc、/sys 未挂载）→ 编译失败
- **避坑**：进入 chroot 前挂载 /dev、/proc、/sys
- **坑**：chroot 内无网络 → 尝试下载会失败
- **避坑**：所有源码提前下载到 chroot 外
- **验证**：chroot 内 `gcc`、`ld`、`bash` 可正常运行
- **坑**：glibc 版本与交叉编译器不匹配 → 运行时错误
- **避坑**：搜索 "glibc <version> compatibility issues"

### Step 4：基础系统（~50 包）
- **坑**：构建顺序错误 → 依赖缺失
- **避坑**：严格按 LFS 指定顺序，不可乱序
- **坑**：某包版本有已知 bug → 编译失败或运行时问题
- **避坑**：每包前搜索 "<包名> <版本> known issues"
- **坑**：CFLAGS 参数不当 → 编译失败或性能下降
- **避坑**：搜索 "<包名> best compile flags <year>"
- **验证**：每包编译后运行 `make check`（如适用）+ 基本功能测试
- **注意**：50 包逐个编译，总耗时 2-3 小时

### Step 5：内核 + 引导加载器
- **坑**：内核配置错误 → 无法启动（黑屏/卡 logo）
- **避坑**：搜索 "Linux <version> best kernel config for <硬件>" + "Linux <version> kernel known issues"
- **坑**：GPU 驱动模块缺失 → 无显示输出
- **避坑**：NVIDIA 需专有驱动（联网安装），AMD/Intel 用开源驱动
- **坑**：引导加载器配置错误（UEFI vs Legacy）→ 无法引导
- **避坑**：搜索 "<主板型号> UEFI boot config"
- **验证**：内核能编译通过 + 引导加载器配置正确
- **注意**：内核配置错误是最严重的坑，必须充分搜索避坑

### Step 6：桌面体验
- **坑**：GPU 驱动与桌面环境不兼容 → 黑屏/卡顿
- **避坑**：搜索 "<桌面环境> <GPU型号> compatibility issues"
- **坑**：输入法与桌面环境冲突 → 输入法失效
- **避坑**：搜索 "<桌面环境> fcitx5 input method problems"
- **坑**：主题配置不当 → 显示异常
- **避坑**：搜索 "<桌面环境> best theme configuration"
- **验证**：桌面环境能启动 + 输入法可用 + 网络/声音正常
- **注意**：桌面环境编译耗时 1-2 小时

### Step 7：用户软件 + Windows 兼容
- **坑**：Wine + GPU 驱动不兼容 → Windows 应用无法运行
- **避坑**：搜索 "Wine <version> <GPU型号> compatibility"
- **坑**：软件版本不兼容 → 运行时报错
- **避坑**：搜索 "<软件名> <版本> known issues"
- **验证**：每个软件能正常运行
- **注意**：Wine + GPU 驱动兼容性是常见坑点

### Step 8：AI 助手
- **坑**：模型量化与内存不匹配 → 加载失败或 OOM
- **避坑**：8GB→Q4_K_M，16GB→Q5_K_M，32GB+→Q6_K
- **坑**：llama.cpp 编译参数不当 → 推理性能差
- **避坑**：搜索 "llama.cpp best build flags for <CPU>"
- **验证**：模型能加载 + 推理正常 + 响应时间可接受
- **注意**：模型下载耗时（~5.7GB），必须后台跑

### Step 9：打包 ISO
- **坑**：ISO 打包配置错误 → ISO 无法启动
- **避坑**：搜索 "live-build best ISO configuration"
- **坑**：无人值守安装配置错误 → 安装失败或卡住
- **避坑**：搜索 "unattended install best preseed config"
- **坑**：未做冒烟测试 → 交付无法启动的 ISO
- **避坑**：必须在虚拟机中启动 ISO 验证基本功能
- **验证**：ISO 能在虚拟机中启动 + 基本功能正常

## 验证方法

每步完成后必须验证产物，不可跳过：

| 步骤 | 验证内容 | 验证方法 |
|------|---------|---------|
| Step 1 | 主机工具链版本 | `gcc --version`、`ldd --version`、`make --version` |
| Step 2 | 交叉编译器功能 | 编译并运行 hello world |
| Step 3 | chroot 工具功能 | chroot 内 `gcc`、`ld`、`bash` 可运行 |
| Step 4 | 基础系统包功能 | 每包 `make check` + 基本功能测试 |
| Step 5 | 内核 + 引导 | 内核编译通过 + 引导配置正确 |
| Step 6 | 桌面环境功能 | 桌面能启动 + 输入法/网络/声音正常 |
| Step 7 | 用户软件功能 | 每个软件能正常运行 |
| Step 8 | AI 助手功能 | 模型能加载 + 推理正常 |
| Step 9 | ISO 可启动 | 虚拟机中启动 + 基本功能正常

## 安装后配置坑点（参考 archlinux 简明指南）

### GPU 驱动

| 场景 | 坑 | 避坑 |
|------|-----|------|
| NVIDIA 独立显卡 | 安装官方驱动后 initramfs 包含 nouveau 模块，冲突 | 编辑 `/etc/mkinitcpio.conf` 删除 `kms`，`mkinitcpio -P` |
| NVIDIA Turing 及更新 | `nvidia-open` 是 alpha 质量，不适用于 AMD 集显系统 | 搜索 "<GPU型号> nvidia-open known issues" |
| AMD GCN 2.0 及以下 | 不要用 AMDGPU 驱动（实验性质） | 用 ATI 开源驱动 |
| 双显卡 hybrid 模式 | 将 `__NV_PRIME_RENDER_OFFLOAD` 加到全局环境 → 黑屏 | 用 `prime-run <command>` 前缀 |
| 双显卡电源管理 | 上来就装 Bbswitch → 某些硬件黑屏 | 按 optimus-manager 文档一步步尝试 |

### 安全配置

| 场景 | 坑 | 避坑 |
|------|-----|------|
| LUKS 加密 | 加密 EFI 分区 → 无法启动 | 严禁加密 EFI 分区 |
| LUKS + TPM | 部分电脑（Intel NUC）导入后无法自动解锁 | 进固件禁用再启用 TPM |
| Secure Boot | `enroll-keys` 可能导致变砖（OpROM 带微软签名） | 双系统用 `enroll-keys -m` |
| fscrypt | 删除 `.fscrypt` 目录 → 永远无法解密 | 严禁删除 |

### 功耗控制

| 场景 | 坑 | 避坑 |
|------|-----|------|
| 电压下探 | 可能损坏硬件（逆向工程方法） | 从 50mV 开始，每次加 10mV，烤机测试 |
| 功率墙 | `package power limit is locked` = 不可调 | 先检查 `intel-rapl` 的 `enabled` 值 |
| TLP | 与 `systemd-rfkill` 冲突 | `systemctl mask systemd-rfkill.service systemd-rfkill.socket` |

### 文件系统（Btrfs）

| 场景 | 坑 | 避坑 |
|------|-----|------|
| Timeshift 恢复后无法挂载目录 | 子卷 ID 变更 | fstab 中删除 `subvolid=xxx`，改为名称指定 |
| Timeshift 恢复后无法挂载 boot | 内核版本不一致 | chroot 后重新安装/更新内核包 |
| 定时任务不生效 | `cron` 服务未启动 | `systemctl enable --now cronie.service` |

### 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 系统没有声音 | PipeWire/ALSA 未安装 | 安装 `pipewire-pulse pipewire-alsa pipewire-jack` |
| NVIDIA 笔记本只有 HDMI 音频 | sof 驱动问题 | 内核启动参数加 `snd_hda_intel.dmic_detect=0` |
| 关机卡住 1 分 30 秒 | 某进程不愿停止 | `DefaultTimeoutStopSec=30s` + `journalctl -p5` 排查 |
| 升级时异常 | 包管理器数据库锁未释放 | 确认无其他包管理进程后移除数据库锁文件 |
| 滚挂了 | 长时间未更新 → 依赖冲突 | 多看官网公告，勤更新 |

详细指导见 `system-setup.md`。

---

# 搜索-决策-记录-避坑 协议

## 目的

确保每个构建决策都经过充分调查，既找到最佳实践，又避开已知坑。

## 双轨搜索

### 轨道 1：最佳实践搜索

搜索该组件/配置的最新最佳实践：

```
模板：
  "<component> best <aspect> for <hardware> <year>"
  "<component> <version> recommended configuration <year>"
  "<component> performance optimization <hardware> <year>"
```

### 轨道 2：避坑搜索（必须执行）

搜索该组件/配置的已知坑：

```
模板：
  "<component> <version> known issues bugs <year>"
  "<component> <hardware> compatibility problems <year>"
  "<component> <aspect> pitfalls workarounds <year>"
  "<component> <aspect> crash hang freeze <year>"
```

## 避坑检查清单（每步必查）

- [ ] 该组件版本是否有已知 critical bug？
- [ ] 用户硬件组合是否有兼容性报告？
- [ ] 编译参数是否会导致运行时问题？
- [ ] 桌面/输入法/GPU 组合是否有已知冲突？
- [ ] 内核配置是否会导致特定硬件无法启动？
- [ ] 该版本是否有已知的安全漏洞？
- [ ] 社区是否有已知的 workaround？

## 搜索来源

优先搜索以下来源：

1. **官方文档**：组件官网、man page
2. **LFS/BLFS 论坛**：lfs-support mailing list
3. **Arch Wiki**：archlinux.org/wiki
4. **Fedora Magazine**：fedoramagazine.org
5. **GitHub Issues**：组件仓库的 issue tracker
6. **Reddit**：r/linux, r/linuxquestions
7. **Stack Exchange**：unix.stackexchange.com
8. **组件论坛**：各组件官方论坛

## 输出要求

### 决策日志（每步生成）

每个组件记录：
- 组件名 + 版本
- 选择理由（为什么选这个版本）
- 编译参数 + 参数理由（为什么用这些参数）
- 参考来源（URL 列表）

### 避坑报告（每步生成）

每个已知坑记录：
- 组件名
- 问题描述
- 严重程度（critical / medium / low）
- 规避措施
- 来源
- 是否已规避 + 规避方式

## 搜索频率

- **每步开始前**：必须执行双轨搜索
- **每个包编译前**：基础系统的每个包都要搜索
- **失败时**：额外搜索错误信息的 workaround

## 搜索工具指导

- 优先使用多引擎搜索（免 API key）；单一引擎降为后备
- 仅当多引擎缺失或连续失败才用单一引擎
- 搜索结果的 URL 用 HTTP 抓取获取完整页面内容
- 本地文档搜索用 ripgrep 正则
- 搜索前检查已失败的查询记录，避免重复搜索
- 每次搜索后记录查询 + 结果摘要

## 注意事项

1. **不要盲目相信搜索结果**：交叉验证多个来源
2. **注意时间**：优先最近 1 年的信息
3. **区分官方和社区**：官方文档 > 社区经验
4. **记录来源**：每个决策都要记录参考来源
5. **避坑优先**：如果最佳实践和避坑冲突，优先避坑

---

# 构建进度管理 + 断点续传 协议

## 目的

构建可能持续 4-6 小时，必须支持断点续传，避免失败后从头开始。

## 进度文件要求

进度文件（`build-progress.json`）必须实时记录：

- **构建标识**：build_id、开始时间、更新时间、整体状态
- **当前步骤**：正在执行的步骤名
- **每步状态**：pending / in_progress / completed / failed / skipped
- **每步产物**：产物文件名、产物 URL、决策日志、避坑报告、耗时
- **断点信息**：失败/中断时的步骤 + 包 + 命令阶段
- **进度统计**：已完成包数 / 总包数、百分比、预计剩余时间

## 状态值

- `pending`：未开始
- `in_progress`：进行中
- `completed`：已完成
- `failed`：失败
- `skipped`：跳过（非核心包）

## 进度粒度

### 三级粒度

1. **步骤级别**：9 个步骤
2. **包级别**：基础系统的每个包、用户软件
3. **命令级别**：每个包的 configure / make / make install 三阶段

### 更新频率

- **步骤开始/完成**：立即更新
- **包开始/完成**：立即更新
- **命令阶段变化**：立即更新
- **失败**：立即更新 + 记录失败信息

## 断点续传流程

```
1. 构建失败/中断
2. 读取进度文件
3. 找到断点（步骤 + 包 + 命令阶段）
4. 从该点继续（不重跑已完成的步骤）
5. 更新进度文件
6. 继续后续步骤
```

### 断点续传示例

```
失败点：基础系统 / gcc / make install

恢复流程：
1. 读取进度文件
2. 找到断点：步骤=基础系统，包=gcc，命令=make install
3. 下载前序步骤的产物
4. 解压到构建环境
5. 从 gcc 的 make install 继续
6. 更新进度文件
7. 继续后续包
```

## 进度文件位置

- **构建中**：构建平台 artifact（每步上传）
- **完成后**：Release 附件
- **用户端**：本地保存（用于故障排查）

## 进度可视化

### 终端输出格式

```
[Step 4/9] 基础系统 (46%)
  ✓ 已完成的包...
  → 当前包 (当前命令阶段)
  ○ 待处理的包...

  已完成: N/总数 包
  预计剩余: X 小时
```

## 跨轮状态管理指导

构建持续 4-6 小时，必然跨多轮对话。agent 必须用状态文件持久化关键信息，防止跨轮遗忘：

- **计划**：9 个步骤的状态（pending / in_progress / completed / blocked）
- **发现**：每 2 次操作后追加搜索发现、版本决策、避坑结论
- **进展**：每轮记录做了什么 + 结果
- **操作指纹**：每个构建命令的指纹 + 执行次数 + 最近错误（防重复失败）
- **后台任务**：每个后台构建任务的 id + 状态 + 是否已收集/关闭
- **阻塞点**：当前阻塞原因 + 等待用户指示

**写入时机（同轮成对，禁止攒到轮末批量补记）**：
- 每次构建命令执行后（无论成败）→ 更新指纹 + 次数
- 每次失败后 → 更新最近错误
- 每轮操作后 → 更新进展 + 预算
- 后台任务状态变化（启动/收集/关闭）→ 更新清单

**恢复协议**：会话恢复/中断后 → 依次读状态文件的 `## 计划` → `## 发现` → `## 进展` → `## 操作指纹` / `## 轮次预算`，从当前阶段续接；不重新扫仓库，不要求用户重述目标。

## 注意事项

1. **原子性**：进度文件更新必须是原子操作（避免部分写入）
2. **备份**：每步完成后备份进度文件
3. **版本**：进度文件包含 build_id，避免混淆不同构建
4. **清理**：构建完成后清理临时进度文件
5. **双文件并行**：状态文件管 agent 跨轮记忆，build-progress.json 管构建断点续传，两者并行维护

---

# 失败分类 + 恢复指导 协议

## 目的

构建失败时，提供结构化故障排查指导，帮助用户推进构建到最终成果。

## 失败处理流程

```
1. 捕获失败
   - 错误日志（完整保存）
   - 失败步骤 + 包名 + 命令
   - 系统状态（磁盘空间、内存、CPU）

2. 分类失败（五类）

3. 生成恢复方案
   - 多个恢复选项 + 风险等级
   - 推荐选项
   - 断点续传点

4. 执行恢复 + 更新进度

5. 如果恢复失败 → 升级处理
   - 记录完整日志
   - 生成故障报告
   - 指导用户联系维护者
```

## 失败分类

### 类型 A：网络问题

**特征**：
- 下载失败（404、timeout、connection refused）
- 镜像源不可用
- DNS 解析失败

**恢复方案**：
1. 重试（可能是临时网络问题）
2. 换镜像源
3. 检查网络连接
4. 使用离线包（如果之前下载过）

**风险等级**：low

### 类型 B：编译错误

**特征**：
- 编译器报错
- 链接器报错（undefined reference）
- 测试失败（make check 失败）

**恢复方案**：
1. 搜索 workaround
2. 应用社区 patch
3. 降级版本
4. 跳过该包（如非核心包）
5. 调整编译参数

**风险等级**：medium（降级/跳过）/ low（patch）

### 类型 C：依赖缺失

**特征**：
- 找不到头文件
- 找不到库
- 依赖包未安装

**恢复方案**：
1. 检查构建顺序（是否漏了前置包）
2. 补装依赖包
3. 检查 configure 参数（是否指定了正确的路径）
4. 设置环境变量（CFLAGS、LDFLAGS、CPPFLAGS）

**风险等级**：low

### 类型 D：资源不足

**特征**：
- 磁盘空间不足
- 内存不足（out of memory、killed）
- CPU 负载过高

**恢复方案**：
1. 清理临时文件
2. 减少并行度
3. 增加 swap（如果内存不足）
4. 分步构建（先构建小包，清理后再构建大包）

**风险等级**：low

### 类型 E：配置错误

**特征**：
- configure 失败
- 内核配置错误
- 系统配置错误

**恢复方案**：
1. 检查配置文件
2. 回退到默认值
3. 参考官方文档
4. 搜索该配置的最佳实践

**风险等级**：medium

## 恢复方案要求

每个恢复方案必须包含：
- 选项名 + 描述
- 风险等级（low / medium / high）
- 具体操作（命令或步骤）
- 预计耗时
- 是否适用（如不适用，说明原因）

推荐选项要明确标注。

## 失败知识库

记录已知失败模式和解决方案：
- 错误模式（正则或关键词）
- 失败类型
- 诊断（这是什么问题）
- 解决方案列表（操作 + 参数）
- 来源

## 升级处理

如果恢复方案都失败：

1. **记录完整日志**：
   - 错误日志
   - 系统状态
   - 已尝试的恢复方案
   - 进度文件

2. **生成故障报告**：
   - 构建标识
   - 失败步骤 + 包 + 命令
   - 错误日志
   - 系统状态（磁盘、内存、CPU）
   - 已尝试的恢复方案 + 结果
   - 时间戳

3. **指导用户联系维护者**：
   - 提交 Issue
   - 附上故障报告
   - 等待维护者回复

## 循环防护指导

构建失败后的恢复操作必须遵守循环防护规则：

- **指纹去重**：失败过的恢复命令禁止原样再执行；累计 3 次（含首执）后永久禁该指纹。"换个说法再试"计同一指纹。
- **进度停滞**：连续 3 轮无新进展（新信息/状态变化/新错误类型，至少占其一）= 停滞 → 停止 + 向用户报告
- **轮次预算**：默认 15 轮/任务；构建任务开始时上调（建议 30 轮）并记录；耗尽未完成 = 终止
- **同一错误连续 2 次** → 停止重试，必须换方案（换参数/换方法/换工具/报告阻塞）
- **策略切换**：切换前在状态文件记录「已尝试什么 + 为何换 + 新策略」；新策略必须产生不同于旧指纹的指纹

## 注意事项

1. **不要盲目重试**：同一错误连续 2 次失败后，必须换方案
2. **记录所有尝试**：每个恢复方案的结果都要记录（写入状态文件 `## 操作指纹`）
3. **风险告知**：每个恢复方案都要告知风险等级
4. **用户确认**：高风险方案（如降级、跳过）需要用户确认
5. **进度更新**：每次恢复后都要更新进度文件 + 状态文件

---

# GitHub Actions 构建指导

本文件指导 agent 帮用户把 LFS + BLFS 构建放到 GitHub Actions 上执行，并对接 `progress-protocol.md` 的断点续传。

## 适用场景

- 用户没有本地构建机，或本地构建机会被打断（断电、重启、休眠）
- 构建需要 4-6 小时，本地挂着不现实
- 需要可复现的构建（同一份配置 + 同一份 workflow = 同一份产物）

## 核心设计原则

1. **workflow 文件由 agent 生成**：agent 根据构建配置生成 `.github/workflows/build.yml`，用户只需 push 到仓库
2. **配置外置**：构建配置（`build-config.json`）放仓库里，workflow 读取它，不硬编码在 workflow 中
3. **产物即状态**：每步产物 + 进度文件 + 决策日志 + 避坑报告都上传为 artifact，断点续传靠下载 artifact 恢复
4. **一次只跑一步**：9 个步骤拆成 9 个 job（或 1 个 job 9 个 step），每步结束即上传产物，避免单 job 超时
5. **失败不丢状态**：失败时也要上传进度文件 + 错误日志（`if: always()`）

## 环境选择

### Runner 选择

| 维度 | 推荐 | 理由 |
|------|------|------|
| Runner 类型 | `ubuntu-latest`（GitHub-hosted） | 免维护，LFS 官方推荐 Ubuntu 宿主 |
| 磁盘 | 需 100GB+ | GitHub-hosted runner 默认 14GB 不够，必须用 self-hosted 或申请更大磁盘 |
| 时长 | 单 job 上限 360 分钟 | 9 步总耗时 4-6 小时，必须分步 + 断点续传 |
| 并发 | 同一仓库同一 workflow 串行 | 避免两个构建互相污染 `/mnt/lfs` |

**关键坑**：GitHub-hosted runner 磁盘只有 14GB，LFS 构建需要 100GB+。**必须使用 self-hosted runner**（或向 GitHub 申请更大磁盘的 runner）。agent 必须提醒用户这一点。

### Self-hosted runner 要求

- 一台 Linux 机器（Ubuntu 22.04+），常驻运行
- 磁盘 200GB+
- 内存 16GB+（编译大包时吃内存）
- 稳定网络（下载源码）
- 安装 `actions-runner` 并注册到仓库

## Workflow 结构

### 整体结构

```yaml
name: TTL Build

on:
  workflow_dispatch:          # 手动触发
    inputs:
      resume_from:
        description: "断点续传点（留空 = 从头构建）"
        required: false
  push:
    branches: [main]         # 可选：push 触发

concurrency:
  group: ttl-build           # 同一时间只跑一个构建
  cancel-in-progress: false  # 不取消正在跑的构建

jobs:
  # 每步一个 job，依赖前一步
  step1_host_prep:
    runs-on: [self-hosted, linux]
    steps:
      - uses: actions/checkout@v4
      - name: 准备主机环境
        run: |
          # 创建构建用户、/mnt/lfs、检查工具链
          # 详见 SKILL.md Step 1
      - name: 上传进度
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: step1-progress
          path: |
            build-progress.json
            decision-log/
            pitfall-report/
      - name: 上传产物
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: step1-artifacts
          path: /mnt/lfs/

  step2_cross_toolchain:
    needs: step1_host_prep
    runs-on: [self-hosted, linux]
    steps:
      - uses: actions/checkout@v4
      - name: 下载前序产物
        uses: actions/download-artifact@v4
        with:
          name: step1-artifacts
          path: /mnt/lfs/
      - name: 检查断点
        id: resume_check
        run: |
          # 读取 build-progress.json，判断 step2 是否需要重跑
          # 如果 resume_from 指定了 step2 之后的步骤，跳过本步
      - name: 编译交叉工具链
        if: steps.resume_check.outputs.skip != 'true'
        run: |
          # 编译 GCC 交叉编译器（30-60 分钟）
          # 详见 SKILL.md Step 2
      - name: 上传进度
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: step2-progress
          path: |
            build-progress.json
            decision-log/
            pitfall-report/
      - name: 上传产物
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: step2-artifacts
          path: /mnt/lfs/

  # ... step3 ~ step9 同构 ...

  step9_iso:
    needs: step8_ai
    runs-on: [self-hosted, linux]
    steps:
      - uses: actions/checkout@v4
      - name: 下载前序产物
        uses: actions/download-artifact@v4
        with:
          name: step8-artifacts
          path: /mnt/lfs/
      - name: 打包 ISO
        run: |
          # live-build 打包体验版 + 无人值守版
          # 详见 SKILL.md Step 9
      - name: 冒烟测试
        run: |
          # 虚拟机中启动 ISO，验证基本功能
      - name: 上传 ISO
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: ttl-iso
          path: dist/*.iso
      - name: 发布 Release
        if: success()
        uses: softprops/action-gh-release@v2
        with:
          files: dist/*.iso
```

### 关键设计点

1. **`concurrency` 串行**：同一仓库同一时间只跑一个构建，避免 `/mnt/lfs` 冲突
2. **`if: always()` 上传进度**：失败时也上传进度文件 + 错误日志，断点续传才有依据
3. **每步独立 job + `needs` 依赖**：单步失败不阻塞后续步骤的产物上传；断点续传时只重跑失败的步骤
4. **`workflow_dispatch` 手动触发**：构建耗时长，手动触发更可控；`resume_from` 输入支持断点续传
5. **产物路径统一**：所有产物放 `/mnt/lfs/`，进度文件放仓库根目录，artifact 命名规范（`stepN-progress` / `stepN-artifacts`）

## 断点续传对接

与 `progress-protocol.md` 的对接方式：

1. **进度文件**：`build-progress.json` 每步结束上传为 artifact（`stepN-progress`）
2. **断点恢复**：
   - 用户触发 `workflow_dispatch`，填入 `resume_from = stepN`
   - 第 N 步的 job 读取 `build-progress.json`，发现 stepN 状态为 `failed` / `in_progress`
   - 下载 `stepN-1-artifacts`，解压到 `/mnt/lfs/`
   - 从 stepN 的断点（包 + 命令阶段）继续
3. **产物链**：每步只下载前一步的 artifact，不重新跑前序步骤

## 失败处理

与 `failure-protocol.md` 的对接方式：

1. **失败时上传**：`if: always()` 确保失败时进度文件 + 错误日志 + 系统状态都上传
2. **故障报告**：失败 job 生成 `failure-report.md`（含错误日志、系统状态、已尝试的恢复方案），上传为 artifact
3. **用户侧**：用户下载故障报告，按 `failure-protocol.md` 的分类 + 恢复方案处理
4. **重新触发**：修复后通过 `workflow_dispatch` + `resume_from` 断点续传

## 配置外置

`build-config.json` 放仓库根目录，workflow 读取：

```json
{
  "build_id": "ttl-20250101-001",
  "hardware": { "cpu": "...", "arch": "...", "ram_gb": 32, "gpu": "..." },
  "desktop": { "env": "kde-plasma", "theme": "..." },
  "kernel": { "version": "...", "config": "..." },
  "packages": { "core": [...], "dev": [...], "extra": [...] },
  "wine": { "version": "...", "winapps": true },
  "ai": { "model": "...", "quantization": "Q5_K_M", "runtime": "llama.cpp" },
  "install": { "unattended": true, "disk_layout": "...", "timezone": "Asia/Shanghai" }
}
```

workflow 中用 `jq` 读取配置，不硬编码。配置变更 = 重新构建。

## 风险提示（必须告知用户）

1. **Self-hosted runner 必须**：GitHub-hosted runner 磁盘只有 14GB，不够 LFS 构建。必须自建 runner（一台常驻 Linux 机器）。
2. **runner 安全**：self-hosted runner 能访问仓库 secrets，不要放在不安全的机器上。
3. **构建期间不要动 runner**：runner 重启 / 断电 = 构建中断，需要断点续传。
4. **artifact 保留期**：GitHub artifact 默认保留 90 天，过期删除。重要产物（ISO）要发布到 Release。
5. **并发限制**：同一仓库同一时间只跑一个构建（`concurrency` 保证），排队等待。

## 验证方法

| 检查项 | 验证方法 |
|--------|---------|
| workflow 语法 | `actionlint .github/workflows/build.yml` |
| runner 磁盘 | `df -h /mnt/lfs` 确认 100GB+ |
| 断点续传 | 手动中断一次构建，用 `resume_from` 恢复，确认不重跑已完成步骤 |
| 失败上传 | 故意让某步失败，确认 `stepN-progress` artifact 包含进度文件 + 错误日志 |
| ISO 冒烟 | 冒烟测试 job 通过 = ISO 可启动 |

---

# 构建报告 + 产物指南 协议

## 目的

构建完成后，agent 必须生成一份**完整的构建报告**和**产物使用指南**，提交到用户的 fork 仓库中，以便：
- 用户回顾构建决策和理由
- 用户实际安装时查阅安装步骤
- 用户日后排查问题时参考故障知识库
- 其他用户参考该 fork 的构建配置

## 提交位置

所有产物提交到用户 fork 仓库的 `dist/` 目录：

```
<fork-repo>/
├── dist/
│   ├── report/
│   │   ├── build-report.md          # 构建报告（主文档）
│   │   ├── decision-log.md          # 决策日志（每步的组件/版本/参数/理由/来源）
│   │   ├── pitfall-report.md        # 避坑报告（每步的已知坑/严重程度/规避措施）
│   │   ├── failure-knowledge.md     # 失败知识库（构建中遇到的失败 + 解决方案）
│   │   └── smoke-test.md            # 冒烟测试报告
│   ├── guide/
│   │   ├── install-guide.md         # 安装指南（体验版 + 无人值守版）
│   │   ├── first-boot.md            # 首次启动指南（NVIDIA 驱动联网安装等）
│   │   └── daily-use.md             # 日常使用指南（常用命令 + 故障排查）
│   ├── iso/
│   │   ├── ttl-live-<build_id>.iso  # 体验版 ISO
│   │   └── ttl-install-<build_id>.iso # 无人值守安装版 ISO
│   └── config/
│       ├── build-config.json        # 构建配置（硬件画像 + 桌面 + 内核 + 软件 + AI）
│       └── build-progress.json      # 最终进度文件
├── skill/                           # SKILL 文档（fork 自带）
├── .github/
│   └── workflows/
│       └── build.yml                # GitHub Actions workflow（如使用）
└── README.md
```

## 构建报告（build-report.md）

### 必须包含的章节

1. **构建摘要**
   - 构建 ID、开始/结束时间、总耗时
   - 构建平台（本地 / GitHub Actions / 其他 CI）
   - 目标硬件画像（CPU / 内存 / 磁盘 / GPU）
   - 最终产物列表（ISO 文件名 + 大小 + SHA256）

2. **用户偏好回顾**
   - 桌面环境 + 主题
   - 软件清单（核心 / 开发 / 额外）
   - 性能倾向
   - 安装方式
   - 其他偏好（语言/时区/加密/双系统）

3. **9 步构建摘要**
   - 每步：状态（completed / skipped / failed）+ 耗时 + 关键决策
   - 每步的验证结果

4. **决策日志摘要**
   - 指向 `decision-log.md` 的完整记录
   - 列出关键决策（march 值、LTO、内核配置、GPU 驱动方案、模型量化等）

5. **避坑报告摘要**
   - 指向 `pitfall-report.md` 的完整记录
   - 列出 critical 级别的坑 + 规避状态

6. **失败记录**
   - 构建中遇到的所有失败 + 分类 + 恢复方案 + 结果
   - 指向 `failure-knowledge.md`

7. **冒烟测试结果**
   - 指向 `smoke-test.md`
   - ISO 启动 + 基本功能验证结果

8. **风险提示回顾**
   - 数据备份提醒
   - 双系统 / BitLocker 提醒
   - NVIDIA 驱动联网提醒
   - 游戏反作弊提醒

## 决策日志（decision-log.md）

每个组件记录（按步骤分组）：

```markdown
## Step 2：交叉工具链

### GCC 交叉编译器
- 版本：gcc-14.2.0
- 选择理由：当前最稳定版本，无已知 critical bug（来源：https://...）
- 编译参数：
  - `-march=znver4`：AMD Ryzen 9000 系列最佳 march 值（来源：https://...）
  - `--enable-lto`：GCC 14.2 LTO 稳定（来源：https://...）
  - `-fPIE -fno-PIE -fstack-protector-strong`：安全加固
- 参考来源：
  - https://...
  - https://...
```

## 避坑报告（pitfall-report.md）

每个已知坑记录（按步骤分组）：

```markdown
## Step 5：内核 + 引导加载器

### 坑 1：NVIDIA 驱动模块缺失
- 严重程度：critical
- 问题描述：NVIDIA 显卡需要专有驱动，内核编译时不内置
- 规避措施：首次启动后联网安装 NVIDIA 驱动
- 来源：https://...
- 是否已规避：是，first-boot.md 中已说明联网安装步骤

### 坑 2：内核配置错误导致无法启动
- 严重程度：critical
- 问题描述：GPU 驱动模块缺失 → 无显示输出
- 规避措施：搜索 "<桌面环境> <GPU型号> compatibility issues" 确认配置
- 来源：https://...
- 是否已规避：是，内核配置中已包含 GPU 驱动模块
```

## 失败知识库（failure-knowledge.md）

构建中遇到的每个失败记录：

```markdown
## 失败 1：Step 4 / glibc / make check
- 错误模式：`Assertion failed: ...`
- 失败类型：B（编译错误）
- 诊断：glibc 2.39 的 make check 在特定 CPU 上已知失败
- 解决方案：跳过 make check，直接 make install（风险：low）
- 来源：https://...
- 结果：成功
```

## 冒烟测试报告（smoke-test.md）

```markdown
## 冒烟测试

### 体验版 ISO
- 虚拟机启动：✓ 成功
- 进入桌面：✓ 成功
- 输入法可用：✓ 成功
- 网络正常：✓ 成功
- 声音正常：✓ 成功
- 重启恢复原状：✓ 成功

### 无人值守安装版 ISO
- 虚拟机启动：✓ 成功
- 自动分区：✓ 成功
- 自动安装：✓ 成功
- 安装后重启进入桌面：✓ 成功
- 基本功能正常：✓ 成功
```

## 安装指南（install-guide.md）

### 必须包含的章节

1. **安装前准备**
   - 数据备份提醒
   - 双系统：关闭 Windows 快速启动
   - BitLocker：获取恢复密钥
   - UEFI：进入 BIOS 关闭 Secure Boot（如需要）
   - 调整启动顺序为 U 盘

2. **体验版使用**
   - U 盘启动 → 直接进入完整桌面
   - 不写入硬盘，重启恢复原状
   - 适合试用、评估

3. **无人值守安装**
   - U 盘启动 → 自动分区 + 自动安装
   - 全程无需人工干预
   - 安装完成后重启进入桌面

4. **首次启动**
   - 指向 `first-boot.md`

## 首次启动指南（first-boot.md）

### 必须包含的章节

1. **NVIDIA 驱动联网安装**（如适用）
   - 联网后执行驱动安装命令
   - 验证驱动加载

2. **基本验证**
   - 桌面环境正常
   - 输入法可用
   - 网络/声音正常
   - GPU 驱动加载（`nvidia-smi` 或 `lspci`）

3. **AI 助手验证**
   - 模型加载
   - 推理正常
   - 响应时间可接受

## 日常使用指南（daily-use.md）

### 必须包含的章节

1. **常用命令**
   - 系统更新
   - 包管理
   - 服务管理
   - 磁盘空间查看/清理
   - 硬件信息查看

2. **故障排查**
   - 系统没有声音
   - 键盘没有反应
   - 关机卡住
   - 软件包降级
   - 系统快照恢复

3. **安全配置**（如适用）
   - 磁盘加密（LUKS）
   - 安全启动（Secure Boot）
   - 功耗控制（TLP）

4. **内嵌 AI 助手使用**
   - 如何调用
   - 能做什么（解答问题 / 性能优化建议 / 故障排查 / 软件推荐）

## 提交要求

1. **构建完成后立即提交**：不等用户要求，agent 主动提交
2. **提交到 fork 仓库**：`git add dist/ && git commit && git push`
3. **同时发布 Release**：ISO 文件发布到 GitHub Release（artifact 保留期只有 90 天）
4. **报告必须完整**：所有 8 个章节 + 4 个 guide 文件缺一不可
5. **SHA256 校验**：每个 ISO 文件附 SHA256 校验和

---

# 安装后系统配置指导

本文件指导 agent 在构建完成后、用户实际安装后，帮用户完成系统配置。内容参考 archlinux 简明指南（https://arch.icekylin.online/guide/），适配 TTL 的 LFS + BLFS 构建路线。

## 适用场景

- 用户用 TTL ISO 安装完系统后，需要配置显卡驱动、安全、功耗等
- 内嵌 AI 助手帮用户排查故障、建议优化
- 用户日常使用中的常见问题排查

## 显卡驱动

### 驱动选择原则

- **AMD 显卡**：一律使用开源驱动（AMDGPU / ATI）
- **NVIDIA 显卡**：使用闭源驱动（nvidia / nvidia-open）
- **双显卡（集显 + 独显）**：先装各自驱动，再用 optimus-manager 切换

### NVIDIA 独立显卡

按 GPU 架构选择驱动：

| GPU 架构 | 驱动 | 说明 |
|----------|------|------|
| Turing (TUXXX) 及更新 | `nvidia-open` | 开源驱动，alpha 质量，不适用于 AMD 集显系统 |
| 其他新型号 | `nvidia` | 闭源驱动 |
| GeForce 630 以下 ~ 400 系列 | `nvidia-390xx-dkms` | 老卡专用 |
| 更老 | `xf86-video-nouveau` | 开源驱动 |

**关键坑**：安装 NVIDIA 官方驱动后，必须编辑 `/etc/mkinitcpio.conf`，在 `HOOKS` 行删除 `kms`，然后 `mkinitcpio -P` 重新生成镜像。否则 initramfs 包含 nouveau 模块，与官方驱动冲突。

**首次启动联网安装**（TTL 构建中 NVIDIA 驱动不内置）：
1. 联网
2. 安装驱动包
3. 编辑 mkinitcpio.conf 删除 kms
4. mkinitcpio -P
5. 重启

### AMD 独立/集成显卡

先查 GPU 架构（TECHPOWERUP），再选驱动：

| GPU 架构 | 驱动 |
|----------|------|
| GCN 4 及之后 | AMDGPU（开源） |
| GCN 3 | AMDGPU |
| GCN 2 及以下 | ATI（开源） |

**关键坑**：GCN 2.0 及以下不要用 AMDGPU 驱动（实验性质，需自定义内核配置）。

### 双显卡（集显 + 独显）

1. 先按上述步骤装各自驱动
2. 安装 `optimus-manager` + `optimus-manager-qt`
3. `systemctl enable optimus-manager.service`
4. 重启后在菜单栏切换

**hybrid 动态切换**：
- 用 `prime-run <command>` 以独显运行程序
- 不要将 `__NV_PRIME_RENDER_OFFLOAD` 等环境变量加到全局环境（会黑屏）

**电源管理**：
- 最广泛适用的是 Bbswitch
- 不建议上来就装，某些硬件会黑屏
- 按 optimus-manager 官方文档一步步尝试

### 性能测试

- `glxgears`：简单 OpenGL 测试
- `glmark2`：更全面的 GPU 基准测试
- Unigine（valley / heaven / superposition）：最全面

## 安全配置

### 磁盘加密（LUKS）

**适用**：全新安装时（TTL 无人值守安装可配置）

1. `cryptsetup luksFormat --type luks2 /dev/<分区>`
2. `cryptsetup open /dev/<分区> cryptlvm`
3. LVM 逻辑卷（可选）
4. 格式化 + 挂载

**关键坑**：严禁加密 EFI 分区，否则无法启动。

**TPM 自动解锁**（可选）：
1. 安装 `tpm2-tools tpm2-tss`
2. 重新安装内核生成 initramfs
3. `systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs="0+1+2+3+4+5+7+13" /dev/<分区>`
4. 重启后无需输入密码

**关键坑**：PCR7 是强制要求。部分电脑（如 Intel NUC）导入后无法自动解锁，需进固件禁用再启用 TPM。

### 安全启动（Secure Boot）

**前提**：UEFI + Secure Boot 支持 + 关闭 CSM + 支持导入自定义密钥

1. 备份原密钥（`efi-readvar`）
2. 进固件设置 Setup Mode
3. 安装 `sbctl`，`sbctl create-keys`
4. 重装 GRUB（`--disable-shim-lock`）
5. `sbctl sign` 签名引导文件
6. `sbctl verify` 检查
7. （可选）导入 DBX 密钥
8. `sbctl enroll-keys`（双系统用 `-m`）
9. 进固件开启 Secure Boot

**关键坑**：
- `enroll-keys` 可能导致变砖（OpROM 带微软签名验证）
- 双系统用 `enroll-keys -m` 导入微软密钥
- 导入微软密钥后建议更新 DBX（`fwupd`）

### 文件级加密（fscrypt，/home）

**适用**：EXT4 / F2FS / UBIFS（Btrfs 需单独分区）

1. 安装 `fscrypt`
2. `fscrypt setup`
3. 配置 PAM 模块（`/etc/pam.d/system-login` + `/etc/pam.d/passwd`）
4. `fscrypt encrypt /home/<用户> --user=<用户>`
5. 退出重新登录验证

**关键坑**：严禁删除 `.fscrypt` 目录，否则永远无法解密。

## 功耗控制

### TLP（推荐，笔记本必装）

1. 安装 `tlp tlp-rdw`
2. `systemctl enable tlp.service NetworkManager-dispatcher.service`
3. `systemctl mask systemd-rfkill.service systemd-rfkill.socket`（避免冲突）
4. `tlp start` 手动启动

**查看信息**：
- `tlp-stat -b`：电池
- `tlp-stat -d`：磁盘
- `tlp-stat -g`：GPU
- `tlp-stat -p`：CPU

### 电压下探（Intel Haswell 及更新）

1. 安装 `intel-undervolt`
2. 编辑 `/etc/intel-undervolt.conf`（只调 CPU 核心电压 + 缓存电压）
3. `intel-undervolt apply` + `intel-undervolt read` 验证
4. 烤机测试（`s-tui`）
5. `systemctl enable --now intel-undervolt`

**关键坑**：可能损坏硬件（逆向工程方法），风险自负。从 50mV 开始，每次加 10mV。

### 降低功率墙（TDP）

1. 检查是否可调：`grep . /sys/class/powercap/intel-rapl/intel-rapl:0/*`
2. `enabled:1` 表示可调
3. 调整 `constraint_0_power_limit_uw`

**关键坑**：`package power limit is locked` = 不可调。

## 文件系统

### Btrfs（推荐）

**特性**：
- 写时复制（CoW）
- 透明压缩
- 快照 + 克隆
- SSD 优化
- 多设备管理

**常用操作**：
- 创建子卷：`btrfs subvolume create /path/<子卷名>`
- 创建快照：`btrfs subvolume snapshot /path/<源> /path/<快照>`
- 列出子卷：`btrfs subvolume list /path`
- 查看使用：`btrfs filesystem df /path`

**Timeshift 快照恢复**：
- 能进桌面：打开 Timeshift 选择快照还原
- 不能进桌面：`Ctrl+Alt+F2` 进 tty，`timeshift --restore --snapshot '<快照名>' --skip-grub`
- 不能进系统：Live CD 还原

**关键坑**：
- 恢复后无法挂载目录：fstab 中删除 `subvolid=xxx`，改为名称指定
- 恢复后无法挂载 boot：内核版本不一致 → chroot 后重新安装/更新内核包

## 故障排查

### 系统没有声音

1. 安装 `pipewire-pulse pipewire-alsa pipewire-jack`
2. 或安装 `alsa-utils pulseaudio pavucontrol`
3. 重启
4. NVIDIA 笔记本 `aplay -l` 只有 HDMI：内核启动参数加 `snd_hda_intel.dmic_detect=0`

### 键盘没有反应

- 联想小新 Pro14 / YOGA 14s 2021：BIOS 固件 ActiveHigh 写为 ActiveLow
- 部分主板 6.5+ 内核已修复，部分需修改 DSDT

### 关机卡住

1. 编辑 `/etc/systemd/system.conf`，`DefaultTimeoutStopSec=30s`
2. `systemctl daemon-reload`
3. 排查：`journalctl -p5` 搜索 `Killing` 关键字

### 软件包降级

1. 安装 `downgrade`
2. `downgrade <包名>`，选择版本

### 升级时异常

- 包管理器数据库锁未释放 → 确认无其他包管理进程后，移除数据库锁文件

### 滚挂了

- 长时间未更新 → 依赖冲突
- 修复：查看发行版公告，按公告步骤逐步修复；必要时回滚快照

## 内嵌 AI 助手职责

TTL 构建的内嵌 AI 助手应：

1. **解答 Linux 使用问题**（面向新手，通俗语言）
2. **根据硬件主动建议性能优化**（TLP / 电压下探 / 功率墙）
3. **帮助排查故障**（声音 / 键盘 / 关机 / 包管理）
4. **推荐适合场景的软件**
5. **定期扫描系统，发现可优化项并主动建议**

AI 应了解这台电脑的完整配置（从系统配置文件读取），所有建议都针对这台具体设备。

## 参考

- archlinux 简明指南：https://arch.icekylin.online/guide/
- Arch Wiki：https://wiki.archlinux.org/
- TLP 官方文档：https://linrunner.de/tlp/settings/index.html
- optimus-manager 文档：https://github.com/Askannz/optimus-manager/wiki
- sbctl：https://wiki.archlinux.org/title/Secure_Boot

---

