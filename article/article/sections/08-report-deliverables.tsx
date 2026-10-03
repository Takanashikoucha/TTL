import { Section, Subsection, Table } from "reacticle";

export function SectionReportDeliverables() {
  return (
    <Section index="08" title="报告与交付物">
      <p>
        构建完成后，agent 必须<strong>主动</strong>执行（不等你要求）一套标准化的
        交付流程：生成报告文档、整理产物、提交到你的 fork 仓库、发布 GitHub Release。
        这套流程确保你能随时回顾构建决策、实际安装时有据可依、日后排查问题有章可循。
      </p>

      <Subsection index="8.1" title="交付物结构">
        <p>
          所有产物提交到你 fork 仓库的 <code>dist/</code> 目录，结构如下：
        </p>
        <pre style={{ overflowX: "auto", fontSize: "var(--ra-text-xs, 0.78rem)", lineHeight: 1.6 }}>
{`dist/
├── report/
│   ├── build-report.md          # 构建报告（主文档，8 章节）
│   ├── decision-log.md          # 决策日志
│   ├── pitfall-report.md        # 避坑报告
│   ├── failure-knowledge.md     # 失败知识库
│   └── smoke-test.md            # 冒烟测试报告
├── guide/
│   ├── install-guide.md         # 安装指南
│   ├── first-boot.md            # 首次启动指南
│   └── daily-use.md             # 日常使用指南
├── iso/
│   ├── ttl-live-<build_id>.iso  # 体验版
│   └── ttl-install-<build_id>.iso # 无人值守版
└── config/
    ├── build-config.json        # 构建配置
    └── build-progress.json      # 最终进度文件`}
        </pre>
      </Subsection>

      <Subsection index="8.2" title="构建报告（8 章节）">
        <p>
          build-report.md 是主文档，必须包含 8 个章节：
        </p>
        <ol>
          <li><strong>构建摘要</strong>——ID、起止时间、总耗时、平台、硬件画像、产物列表（ISO 文件名 + 大小 + SHA256）</li>
          <li><strong>用户偏好回顾</strong>——桌面环境、软件清单、性能倾向、安装方式、其他偏好</li>
          <li><strong>9 步构建摘要</strong>——每步状态 + 耗时 + 关键决策 + 验证结果</li>
          <li><strong>决策日志摘要</strong>——指向 decision-log.md，列出关键决策（march 值、LTO、内核配置、GPU 驱动、模型量化）</li>
          <li><strong>避坑报告摘要</strong>——指向 pitfall-report.md，列出 critical 级别的坑 + 规避状态</li>
          <li><strong>失败记录</strong>——所有失败 + 分类 + 恢复方案 + 结果，指向 failure-knowledge.md</li>
          <li><strong>冒烟测试结果</strong>——指向 smoke-test.md，ISO 启动 + 基本功能验证</li>
          <li><strong>风险提示回顾</strong>——数据备份、双系统/BitLocker、NVIDIA 联网、游戏反作弊</li>
        </ol>
      </Subsection>

      <Subsection index="8.3" title="三份指南">
        <Table
          caption="三份指南职责"
          columns={[
            { key: "c0", label: "指南" },
            { key: "c1", label: "覆盖内容" },
          ]}
          rows={[
            { c0: "install-guide.md", c1: "安装前准备（备份/关快速启动/BitLocker/UEFI）+ 体验版使用 + 无人值守安装 + 首次启动指引" },
            { c0: "first-boot.md", c1: "NVIDIA 驱动联网安装 + 基本验证（桌面/输入法/网络/声音/GPU）+ AI 助手验证" },
            { c0: "daily-use.md", c1: "常用命令（更新/包管理/服务/磁盘/硬件）+ 故障排查（声音/键盘/关机/降级/快照）+ 安全配置 + AI 助手使用" },
          ]}
        />
      </Subsection>

      <Subsection index="8.4" title="提交要求">
        <ol>
          <li><strong>构建完成后立即提交</strong>——不等用户要求，agent 主动执行</li>
          <li><strong>提交到 fork 仓库</strong>——<code>git add dist/ &amp;&amp; git commit &amp;&amp; git push</code></li>
          <li><strong>同时发布 Release</strong>——ISO 文件发布到 GitHub Release（artifact 保留期只有 90 天）</li>
          <li><strong>报告必须完整</strong>——build-report.md 的 8 个章节 + 3 份指南缺一不可</li>
          <li><strong>SHA256 校验</strong>——每个 ISO 文件附 SHA256 校验和</li>
        </ol>
      </Subsection>
    </Section>
  );
}
