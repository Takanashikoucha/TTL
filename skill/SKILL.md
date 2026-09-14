# TTL SKILL — TimeToLinux 个性化桌面发行版构建

> 当用户表达"想切换到 Linux"、"帮我构建一个 Linux 发行版"、"我想用 Linux 但不知道选哪个"等意图时，加载本 SKILL。

## 核心理念（刻入 DNA）

> **开箱即用 × 极致特化**
> 不是"装完能用"，而是"装完就像为你量身定做了三年"。

- **完整桌面体验**：启动即进图形桌面，不是无界面服务器
- **全链路性能优化**：从 GCC 工具链 → glibc → 内核 → 用户空间，全部针对用户 CPU 指令集重新编译
- **开箱即用**：桌面美化、输入法、Windows 软件兼容（Wine/WinApps）全部预配置
- **内嵌 AI**：Qwen3.5-9B 本地问答助手，携带同样的理念持续帮用户优化

## 三大能力

### 能力 1：搜索避坑（Search & Pitfall Avoidance）

每次搜索不仅找"最佳实践"，还要**主动搜索已知坑**：

**双轨搜索**：
- **轨道 1**：最佳实践搜索（如 "GCC 15 best -march flags for haswell 2025"）
- **轨道 2**：避坑搜索（必须执行，如 "GCC 15 -march haswell known issues bugs 2025"）

**避坑关注点**：
- 该版本/配置的已知 critical bug
- 特定硬件组合的兼容性问题
- 会影响用户体验的坑（卡顿、黑屏、输入法失效等）
- 社区已知的 workaround

**输出**：`pitfall-report.json`（每步生成）

详见 `search-protocol.md`。

### 能力 2：构建进度管理（Progress & Resume）

构建可能持续 4-6 小时，必须支持**断点续传**：

- **进度文件**：`build-progress.json` 实时记录每步状态
- **进度粒度**：Step → 包 → 命令 三级
- **断点续传**：构建中断后从断点继续，不重跑已完成步骤

详见 `progress-protocol.md`。

### 能力 3：失败指导（Failure Recovery）

构建失败时，提供**结构化故障排查指导**：

- **失败分类**：网络/编译/依赖/资源/配置 五类
- **恢复方案**：每类失败提供多个恢复选项 + 风险等级
- **失败知识库**：`failure-kb.json` 记录已知失败模式和解决方案

详见 `failure-protocol.md`。

## 完整流程

### 阶段 A：用户电脑端（SKILL 驱动）

**A1. 环境探查**
- 运行 `build/scripts/probe.sh` 收集硬件信息
- **SKILL 行为**：根据探查结果，主动搜索该硬件的最佳 Linux 配置
  - 例：检测到 NVIDIA RTX 4090 → 搜索 "RTX 4090 Linux best kernel config 2025"
  - 例：检测到 64GB 内存 → 搜索 "64GB RAM Linux vm tuning best practices"

**A2. 偏好问答**（6 个问题，通俗语言）

| 问题 | 选项 | 说明 |
|------|------|------|
| Q1 桌面环境 | XFCE / GNOME / KDE / i3 | 根据内存/CPU 推荐 |
| Q2 常用软件 | 浏览器/办公/开发/媒体/游戏/设计 | 预装到 Linux |
| Q3 使用场景 | 办公/开发/游戏/设计/综合 | 决定内核调优方向 |
| Q4 性能倾向 | 性能/均衡/省电 | 笔记本推荐均衡 |
| Q5 安装方式 | 体验版/无人值守安装版 | 建议先体验 |
| Q6 其他偏好 | 语言/时区/双系统/加密 | 系统配置 |

**SKILL 行为**：每个回答后，主动搜索该选择的最新最佳实践 + 避坑
  - 例：用户选 KDE → 搜索 "KDE Plasma 6 best configuration 2025" + "KDE Plasma 6 known issues 2025"
  - 例：用户选游戏 → 搜索 "Linux gaming best setup Proton 2025" + "Linux gaming known issues 2025"

**A3. 生成配置**
- 综合探查 + 问答 + 搜索结果，生成 `ttl-config.json`
- **SKILL 行为**：配置中每个字段都有"为什么这样选"的注释
- 向用户展示配置摘要 + 每个决策的理由 + 避坑报告

### 阶段 B：GitHub Actions 构建端（SKILL 理念驱动每步决策）

**核心原则：每个 Step 开始前，AI 必须执行"搜索-决策-记录"循环**

```
每个 Step 的标准流程：
1. 读取 build-progress.json（检查是否需要断点续传）
2. 读取 ttl-config.json + versions.lock
3. 搜索-决策-记录（最佳实践 + 避坑双轨）
4. 执行构建（带进度更新）
5. 验证产物
6. 更新 build-progress.json
7. 上传 artifact + 决策日志 + 避坑报告
```

**Step 1-9 的 SKILL 搜索决策示例**：

| Step | 构建内容 | SKILL 主动搜索示例 |
|------|---------|-------------------|
| Step 1 | 主机准备 | "LFS 12.4 best host preparation 2025" |
| Step 2 | 交叉工具链 | "GCC 15 best -march flags for <用户CPU> 2025"、"LTO best practices GCC 2025" |
| Step 3 | Chroot 工具 | "Python 3.13 best build flags 2025" |
| Step 4 | 基础系统（~50 包） | 每个包搜索最佳编译参数；"glibc 2.42 best security flags 2025" |
| Step 5 | 内核 + GRUB | "Linux 6.16 best kernel config for <用户硬件> 2025"、"GRUB UEFI best config 2025" |
| Step 6 | 桌面体验 | "<桌面环境> best theme configuration 2025"、"fcitx5 rime best config 2025"、"Linux desktop fonts best practice 2025" |
| Step 7 | 用户软件 + Wine | "Wine 9 best configuration for <用户GPU> 2025"、"WinApps best setup 2025" |
| Step 8 | AI 助手 | "llama.cpp best build flags for <用户CPU> 2025"、"Qwen3.5-9B best inference settings 2025" |
| Step 9 | 打包 ISO | "live-build best ISO configuration 2025"、"unattended install best preseed config 2025" |

**决策日志格式**（每步生成，随产物上传）：
```json
{
  "step": "step4-base-system",
  "decisions": [
    {
      "component": "gcc",
      "version": "15.2.0",
      "reason": "LFS 12.4 指定版本，经搜索确认为当前最稳定",
      "flags": ["-march=haswell", "-flto", "-enable-default-pie", "-enable-default-ssp"],
      "reason_flags": "用户 CPU 为 Intel i7-8700K (Haswell)，支持 AVX2；LTO 启用链接时优化；PIE+SSP 安全加固",
      "sources": ["https://gcc.gnu.org/install/", "https://lfs.org/..."]
    }
  ],
  "pitfalls": [
    {
      "issue": "GCC 15.2 + glibc 2.42 在特定条件下编译失败",
      "severity": "medium",
      "workaround": "应用 gcc-glibc-compat.patch",
      "source": "https://..."
    }
  ]
}
```

### 阶段 C：发行版运行端（Qwen3.5-9B 携带理念）

内嵌 AI 助手的系统提示词：
```
你是 TTL 系统内置 AI 助手，核心理念是"开箱即用 × 极致特化"。

你的职责：
1. 帮助用户解答 Linux 使用问题（面向新手，通俗语言）
2. 根据用户硬件，主动建议性能优化方案
3. 帮助用户排查故障
4. 推荐适合用户场景的软件
5. 定期扫描系统，发现可优化项并主动建议

你了解这台电脑的完整配置（从 /etc/ttl-hardware.json 读取），
所有建议都针对这台具体设备，而非泛泛而谈。
```

## 桌面体验（完整 GUI 发行版）

TTL 构建的是**完整桌面 Linux 发行版**，用户启动后直接进入图形桌面，无需任何命令行操作。

### 桌面环境（根据用户选择）

| 选项 | 适用场景 | 包含组件 |
|------|---------|---------|
| **XFCE** | 轻量、老电脑 | 面板、窗口管理器、文件管理器、系统监视器、设置管理器 |
| **GNOME** | 现代、新电脑 | Shell、文件管理器、设置、终端、软件中心 |
| **KDE Plasma** | 高度可定制 | 桌面、面板、Plasma 工作台、系统设置 |
| **i3/sway** | 极简、程序员 | 平铺窗口管理器、配置编辑器 |

### 桌面美化（开箱即用，无需用户配置）

- **图标主题**：Yaru（现代）/ Tela（扁平）/ Adwaita（默认）
- **光标主题**：Adwaita / 自定义
- **窗口主题**：与图标主题配套
- **壁纸**：根据用户偏好自动选择（风景/抽象/纯色）
- **字体**：
  - 中文：Noto Sans CJK SC
  - 英文：Inter / Fira Sans
  - 等宽：JetBrains Mono / Fira Code
  - 字体渲染：FreeType + Fontconfig 优化（hinting、antialiasing）
- **启动画面**：TTL 品牌 Logo + 加载动画
- **登录界面**：定制主题（LightDM/GDM/SDDM 根据桌面环境选择）

### 预装核心应用（开箱即用）

| 类别 | 应用 |
|------|------|
| **浏览器** | Firefox（默认）/ Chromium（可选） |
| **办公** | OnlyOffice / LibreOffice |
| **媒体** | VLC、MPV、Obs Studio |
| **图片** | GIMP、ImageMagick |
| **视频** | Blender、Kdenlive |
| **音乐** | Audacity、Lollypop |
| **终端** | GNOME Terminal / Konsole / xfce4-terminal |
| **文件管理** | Nautilus / Dolphin / Thunar（随桌面环境） |
| **系统工具** | 磁盘工具、网络管理器、电源管理 |
| **开发** | VS Code、Git、Vim、Python、Node.js（根据用户选择） |
| **AI 助手** | ttl-ai（桌面应用 + 命令行 + API） |

### 输入法（开箱即用）

- **框架**：fcitx5（推荐）/ ibus
- **中文**：Rime（小狼毫）/ 拼音
- **英文**：默认
- **切换**：Ctrl+Space 中英文切换，Alt+Shift 输入法切换
- **预配置**：安装后自动启用，无需用户手动设置

### Windows 软件兼容（开箱即用）

- **Wine 9.x**：预装 + 预配置
- **WinApps**：Windows 应用桥接
- **预配置**：
  - 中文输入法在 Wine 中可用
  - 常用 Windows 软件一键安装脚本
  - GPU 加速配置（根据用户 GPU）
- **桌面集成**：Wine 应用出现在应用菜单中

### 网络（开箱即用）

- **有线**：自动 DHCP
- **无线**：NetworkManager 预配置，图形界面连接
- **蓝牙**：BlueZ 预装
- **打印机**：CUPS 预装 + 自动发现

### 声音（开箱即用）

- **PulseAudio / PipeWire**：预装
- **音频设备**：自动检测
- **默认输出**：根据用户硬件选择

## 性能特化（全链路）

| 层级 | 优化内容 |
|------|---------|
| **GCC 工具链** | `-march=<用户CPU>` + LTO + PIE + SSP |
| **Glibc** | `--enable-stack-protector=strong` + CPU 特性自动检测 |
| **内核** | KASLR + StackProtector + GPU 驱动 + NVME + 调度器调优 |
| **用户空间** | 所有软件用优化后的 GCC 重新编译 |

## 风险提示（必须告知用户）

1. **数据备份**："安装前务必备份重要数据！虽然无人值守安装不会碰其他分区，但任何磁盘操作都有风险。"
2. **双系统**："如果你要双系统，先关闭 Windows 的快速启动，否则 Linux 看不到 Windows 分区。"
3. **NVIDIA 驱动**："NVIDIA 显卡用户注意：Linux 驱动需要联网安装，首次启动后需要联网。"
4. **游戏**："Linux 游戏通过 Steam + Proton 运行，大部分 Windows 游戏可以玩，但少数有反作弊的游戏不行。"
5. **构建时间**："GitHub Actions 构建需要 4-6 小时，免费账号每月有 2000 分钟额度，够用。"

## 参考

- LFS: https://www.linuxfromscratch.org/lfs/view/stable/
- BLFS: https://linuxfromscratch.org/blfs/view/stable-systemd/
- Qwen3.5: https://huggingface.co/Qwen/Qwen3.5-9B
- live-build: https://github.com/debian-live/live-build
