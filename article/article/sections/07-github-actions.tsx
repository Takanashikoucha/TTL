import { Section, Subsection, Table, CodeBlock } from "reacticle";

export function SectionGithubActions() {
  return (
    <Section index="07" title="GitHub Actions 构建">
      <p>
        如果你没有本地构建机，或本地构建机会被打断（断电、重启、休眠），可以把
        LFS + BLFS 构建放到 GitHub Actions 上执行。agent 会根据构建配置生成
        <code>.github/workflows/build.yml</code>，你只需 push 到仓库，CI 自动构建。
      </p>

      <Subsection index="7.1" title="适用场景">
        <ul>
          <li>没有本地构建机，或本地构建机会被打断</li>
          <li>构建需要 4-6 小时，本地挂着不现实</li>
          <li>需要可复现的构建（同一份配置 + 同一份 workflow = 同一份产物）</li>
        </ul>
      </Subsection>

      <Subsection index="7.2" title="核心设计原则">
        <ol>
          <li><strong>workflow 文件由 agent 生成</strong>——你只需 push</li>
          <li><strong>配置外置</strong>——build-config.json 放仓库里，workflow 读取，不硬编码</li>
          <li><strong>产物即状态</strong>——每步产物 + 进度文件 + 决策日志 + 避坑报告都上传为 artifact，断点续传靠下载 artifact 恢复</li>
          <li><strong>一次只跑一步</strong>——9 步拆成 9 个 job，每步结束即上传产物，避免单 job 超时</li>
          <li><strong>失败不丢状态</strong>——失败时也用 <code>if: always()</code> 上传进度文件 + 错误日志</li>
        </ol>
      </Subsection>

      <Subsection index="7.3" title="Runner 选择（关键坑）">
        <Table
          caption="Runner 选择"
          columns={[
            { key: "c0", label: "维度" },
            { key: "c1", label: "推荐" },
            { key: "c2", label: "理由" },
          ]}
          rows={[
            { c0: "Runner 类型", c1: "self-hosted（必须）", c2: "GitHub-hosted 磁盘只有 14GB，LFS 需要 100GB+" },
            { c0: "磁盘", c1: "200GB+", c2: "基础系统 50 包 + 桌面 + 用户软件的中间产物很大" },
            { c0: "时长", c1: "单 job 上限 360 分钟", c2: "9 步总耗时 4-6 小时，必须分步 + 断点续传" },
            { c0: "并发", c1: "同一仓库同一 workflow 串行", c2: "避免两个构建互相污染 /mnt/lfs" },
          ]}
        />
        <p>
          <strong>关键坑</strong>：GitHub-hosted runner 磁盘只有 14GB，LFS 构建需要
          100GB+。<strong>必须使用 self-hosted runner</strong>（一台常驻 Linux 机器，
          Ubuntu 22.04+，磁盘 200GB+，内存 16GB+，稳定网络，安装 actions-runner
          并注册到仓库）。agent 必须提醒你这一点。
        </p>
      </Subsection>

      <Subsection index="7.4" title="Workflow 结构">
        <p>
          每步一个 job，依赖前一步（<code>needs</code>）。每步的标准结构：checkout →
          下载前序产物 → 检查断点（是否需要重跑）→ 执行构建 → 上传进度（always）→
          上传产物（always）。
        </p>
        <CodeBlock
          language="yaml"
          code={`name: TTL Build

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
      - name: 编译交叉工具链
        if: steps.resume_check.outputs.skip != 'true'
        run: |
          # 编译 GCC 交叉编译器（30-60 分钟）
      # ... 上传进度 + 上传产物（同 step1）

  # ... step3 ~ step8 同构 ...

  step9_iso:
    needs: step8_ai
    runs-on: [self-hosted, linux]
    steps:
      - uses: actions/checkout@v4
      - name: 打包 ISO
        run: |
          # live-build 打包体验版 + 无人值守版
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
          files: dist/*.iso`}
          title="build.yml 结构示意（step3-8 同构省略）"
        />
        <p>
          关键设计点：<code>concurrency</code> 串行（同一时间只跑一个构建）；
          <code>if: always()</code> 上传进度（失败时也有断点依据）；每步独立 job +
          <code>needs</code> 依赖（单步失败不阻塞产物上传）；<code>workflow_dispatch</code>
          手动触发 + <code>resume_from</code> 输入支持断点续传。
        </p>
        <p>
          断点续传对接：用户触发 workflow_dispatch，填入 resume_from = stepN。第 N 步的
          job 读取 build-progress.json，发现 stepN 状态为 failed / in_progress，下载
          stepN-1-artifacts 解压到 /mnt/lfs/，从 stepN 的断点（包 + 命令阶段）继续。
          每步只下载前一步的 artifact，不重新跑前序步骤。
        </p>
      </Subsection>

      <Subsection index="7.5" title="风险提示">
        <Table
          caption="GHA 构建风险"
          columns={[
            { key: "c0", label: "风险" },
            { key: "c1", label: "说明" },
          ]}
          rows={[
            { c0: "Self-hosted runner 必须", c1: "GitHub-hosted 磁盘 14GB 不够，必须自建常驻 Linux 机器" },
            { c0: "Runner 安全", c1: "self-hosted runner 能访问仓库 secrets，不要放在不安全机器上" },
            { c0: "构建期间不要动 runner", c1: "runner 重启/断电 = 构建中断，需要断点续传" },
            { c0: "Artifact 保留期", c1: "GitHub artifact 默认保留 90 天，重要产物（ISO）要发布到 Release" },
            { c0: "并发限制", c1: "同一仓库同一时间只跑一个构建，排队等待" },
          ]}
        />
      </Subsection>
    </Section>
  );
}
