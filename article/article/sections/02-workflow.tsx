import { Section, Subsection, Table, Raw } from "reacticle";

export function SectionWorkflow() {
  return (
    <Section index="02" title="完整工作流程">
      <p>
        TTL 的工作流分五个阶段，从 agent 加载 SKILL 开始，到发行版日常运作为止。
        每个阶段都有明确的输入、输出和用户确认点——agent 不会自作主张跳过任何一步。
      </p>

      <Raw title="五阶段流程">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--ra-space-2, 0.5rem)",
            alignItems: "stretch",
          }}
        >
          {[
            { num: "0", label: "加载 SKILL", desc: "读 8 份协议文档" },
            { num: "A", label: "用户电脑端", desc: "探查 + 问答 + 生成配置" },
            { num: "B", label: "构建执行端", desc: "9 步构建 + 搜索-决策-记录" },
            { num: "C", label: "报告 + 产物", desc: "8 报告 + 3 指南 + ISO" },
            { num: "D", label: "发行版运行端", desc: "内嵌 AI 持续优化" },
          ].map((s, i, arr) => (
            <div
              key={s.num}
              style={{
                flex: "1 1 8rem",
                minWidth: "8rem",
                padding: "var(--ra-space-3, 0.75rem)",
                borderLeft: "2px solid var(--ra-color-accent, currentColor)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "var(--ra-text-lg, 1.3rem)",
                  fontWeight: "var(--ra-font-weight-bold, 700)",
                  color: "var(--ra-color-accent, currentColor)",
                  marginBottom: "var(--ra-space-1, 0.25rem)",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "var(--ra-text-sm, 0.9rem)",
                  fontWeight: "var(--ra-font-weight-semibold, 600)",
                  color: "var(--ra-color-fg, inherit)",
                  marginBottom: "var(--ra-space-1, 0.25rem)",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: "var(--ra-text-xs, 0.78rem)",
                  color: "var(--ra-color-muted, inherit)",
                  lineHeight: 1.4,
                }}
              >
                {s.desc}
              </div>
              {i < arr.length - 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "-0.4rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ra-color-border, currentColor)",
                    fontSize: "var(--ra-text-lg, 1.3rem)",
                  }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </Raw>

      <Subsection index="2.1" title="阶段 0：加载 SKILL">
        <p>
          用户 fork 本仓库并 clone 到本地后，告诉 AI agent 工作目录是仓库根目录，
          然后说"加载 <code>skill/SKILL.md</code> 并执行 SKILL"。agent 会按顺序读取
          8 份协议文档：SKILL.md（完整流程）、build-environment.md（环境要求 + 坑点）、
          search-protocol.md（搜索-决策-记录-避坑）、progress-protocol.md（进度管理 +
          断点续传）、failure-protocol.md（失败分类 + 恢复）、github-actions.md（CI 构建）、
          report-protocol.md（报告 + 产物）、system-setup.md（安装后配置）。
        </p>
      </Subsection>

      <Subsection index="2.2" title="阶段 A：用户电脑端">
        <p>
          这是 agent 与用户互动最多的阶段，分三步：
        </p>
        <ol>
          <li>
            <strong>A1 环境探查</strong>——agent 收集你的硬件信息（CPU 型号与指令集、
            内存大小、磁盘类型、GPU 型号与驱动类型、已装软件）。每收集一项，就主动搜索
            该硬件的最佳 Linux 配置 + 已知问题（双轨搜索，详见 §04）。
          </li>
          <li>
            <strong>A2 偏好问答</strong>——agent 逐项问你 6 类偏好（桌面环境倾向、常用软件
            类别、主要使用场景、性能倾向、安装方式、其他偏好），每项都附推荐 + 理由。
            你每回答一项，agent 就搜索该选择的最新最佳实践 + 避坑。
          </li>
          <li>
            <strong>A3 生成配置</strong>——agent 综合探查 + 问答 + 搜索结果，生成一份完整的
            构建配置（覆盖硬件画像、桌面环境、输入法、内核、软件包、Windows 兼容、AI 助手、
            安装 8 个维度，每个字段附"为什么这样选"的注释）。向你展示配置摘要 + 决策理由 +
            避坑报告，<strong>等你确认后才进入构建</strong>。
          </li>
        </ol>
      </Subsection>

      <Subsection index="2.3" title="阶段 B：构建执行端">
        <p>
          核心原则：<strong>每个构建步骤开始前，agent 必须执行"搜索-决策-记录"循环</strong>。
          每步的标准流程是固定的 8 拍：
        </p>
        <ol>
          <li>读取进度文件（检查是否需要断点续传）</li>
          <li>读取构建配置 + 版本锁定</li>
          <li>搜索-决策-记录（最佳实践 + 避坑双轨）</li>
          <li><strong>询问用户</strong>：本步关键决策展示推荐 + 理由，等你确认或调整</li>
          <li>执行构建（带进度更新）</li>
          <li>验证产物</li>
          <li>更新进度文件</li>
          <li>上传产物 + 决策日志 + 避坑报告</li>
        </ol>
        <p>
          构建平台在 Step 1 前由你选择：本地构建（agent 逐步指导）、GitHub Actions
          （agent 生成 workflow，你 push 后自动构建，详见 §07）、或其他 CI（agent 按平台
          语法生成配置）。
        </p>
      </Subsection>

      <Subsection index="2.4" title="阶段 C：报告 + 产物提交">
        <p>
          构建完成后，agent 必须主动执行（不等你要求）：生成 5 份报告文档
          （构建报告、决策日志、避坑报告、失败知识库、冒烟测试报告，其中构建报告内含
          8 个章节）+ 3 份指南（安装指南、首次启动指南、日常使用指南），
          复制 ISO 到 <code>dist/iso/</code>，复制构建配置到 <code>dist/config/</code>，
          然后 <code>git add dist/ &amp;&amp; git commit &amp;&amp; git push</code>，
          最后发布 GitHub Release（ISO 文件）。详见 §08。
        </p>
      </Subsection>

      <Subsection index="2.5" title="阶段 D：发行版运行端">
        <p>
          内嵌 AI 助手在你装机后持续工作，职责有五项：帮你解答 Linux 使用问题（面向新手、
          通俗语言）；根据你的硬件主动建议性能优化方案（TLP / 电压下探 / 功率墙）；
          帮你排查故障（声音 / 键盘 / 关机 / 包管理）；推荐适合你场景的软件；
          定期扫描系统，发现可优化项并主动建议。AI 了解你电脑的完整配置（从系统配置文件
          读取），所有建议都针对你这台具体设备。详见 §10。
        </p>
      </Subsection>

      <Table
        caption="五阶段概览"
        columns={[
          { key: "c0", label: "阶段" },
          { key: "c1", label: "执行端" },
          { key: "c2", label: "核心动作" },
          { key: "c3", label: "用户确认点" },
        ]}
        rows={[
          { c0: "0 加载", c1: "agent", c2: "读 8 份协议文档", c3: "—" },
          { c0: "A 用户端", c1: "agent + 用户", c2: "探查 → 问答 → 生成配置", c3: "配置确认后才构建" },
          { c0: "B 构建端", c1: "agent + 用户", c2: "9 步构建（每步搜索-决策-记录）", c3: "每步关键决策确认" },
          { c0: "C 报告产物", c1: "agent", c2: "8 报告 + 3 指南 + ISO + Release", c3: "—" },
          { c0: "D 运行端", c1: "内嵌 AI", c2: "答疑 / 优化 / 排障 / 推荐 / 扫描", c3: "—" },
        ]}
      />
    </Section>
  );
}
