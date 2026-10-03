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
| Runner 类型 | `self-hosted`（Linux，Ubuntu 22.04+） | GitHub-hosted 磁盘只有 14GB，LFS 需要 100GB+，必须自建 |
| 磁盘 | 需 200GB+ | 基础系统 50 包 + 桌面 + 用户软件的中间产物很大 |
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
  workflow_dispatch:          # 手动触发（构建耗时长，手动更可控）
    inputs:
      resume_from:
        description: "断点续传点（留空 = 从头构建）"
        required: false

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
