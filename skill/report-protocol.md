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
