import { Section, Subsection, Table, Raw } from "reacticle";

export function SectionThreeCapabilities() {
  return (
    <Section index="04" title="三大能力">
      <p>
        TTL 的 agent 之所以能驾驭 4-6 小时的复杂构建，靠的是三项核心能力：
        搜索避坑、进度管理、失败指导。这三项能力贯穿整个构建过程，确保每个决策
        都经过充分调查、每次中断都能续传、每次失败都有结构化恢复路径。
      </p>

      <Subsection index="4.1" title="能力 1：搜索-决策-记录-避坑">
        <p>
          每个构建决策都必须经过<strong>双轨搜索</strong>——这不是可选项，是铁律。
          轨道 1 找最佳实践，轨道 2 找已知坑，两轨并行、缺一不可。
        </p>

        <Raw title="双轨搜索">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--ra-space-3, 0.75rem)" }}>
            <div style={{ padding: "var(--ra-space-3, 0.75rem)", borderTop: "2px solid var(--ra-color-accent, currentColor)" }}>
              <strong style={{ color: "var(--ra-color-accent, currentColor)", fontSize: "var(--ra-text-sm, 0.9rem)" }}>
                轨道 1 · 最佳实践
              </strong>
              <ul style={{ margin: "var(--ra-space-2, 0.5rem) 0 0 1.2em", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)", lineHeight: 1.6 }}>
                <li>组件 + best + 方面 + 硬件 + 年份</li>
                <li>组件 + 版本 + recommended configuration + 年份</li>
                <li>组件 + performance optimization + 硬件 + 年份</li>
              </ul>
            </div>
            <div style={{ padding: "var(--ra-space-3, 0.75rem)", borderTop: "2px solid var(--ra-color-risk, var(--ra-color-accent, currentColor))" }}>
              <strong style={{ color: "var(--ra-color-risk, var(--ra-color-accent, currentColor))", fontSize: "var(--ra-text-sm, 0.9rem)" }}>
                轨道 2 · 避坑（必须执行）
              </strong>
              <ul style={{ margin: "var(--ra-space-2, 0.5rem) 0 0 1.2em", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)", lineHeight: 1.6 }}>
                <li>组件 + 版本 + known issues bugs + 年份</li>
                <li>组件 + 硬件 + compatibility problems + 年份</li>
                <li>组件 + 方面 + pitfalls workarounds + 年份</li>
                <li>组件 + 方面 + crash hang freeze + 年份</li>
              </ul>
            </div>
          </div>
        </Raw>

        <p>
          每步开始前必须执行双轨搜索，每个包编译前都要搜索，失败时额外搜索错误信息的
          workaround。搜索来源优先官方文档、LFS/BLFS 论坛、Arch Wiki、GitHub Issues、
          Stack Exchange。搜索结果必须交叉验证（不盲目相信单一来源），优先最近 1 年的
          信息，区分官方和社区（官方 &gt; 社区）。每个决策都要记录参考来源 URL。
          <strong>避坑优先</strong>：如果最佳实践和避坑冲突，优先避坑。
        </p>
        <p>
          每步生成两份文档：<strong>决策日志</strong>（组件名 + 版本 + 选择理由 +
          编译参数 + 参数理由 + 参考来源）和<strong>避坑报告</strong>（组件名 +
          问题描述 + 严重程度 + 规避措施 + 来源 + 是否已规避）。
        </p>
      </Subsection>

      <Subsection index="4.2" title="能力 2：进度管理 + 断点续传">
        <p>
          构建持续 4-6 小时，必然跨多轮对话甚至多次中断。TTL 用两级进度文件保证
          任何中断都能从断点恢复，不用从头开始。
        </p>
        <p>
          <strong>build-progress.json</strong>（构建断点续传）实时记录：构建标识
          （build_id、开始/更新时间、整体状态）、当前步骤、每步状态（pending /
          in_progress / completed / failed / skipped）、每步产物（文件名、URL、决策日志、
          避坑报告、耗时）、断点信息（失败时的步骤 + 包 + 命令阶段）、进度统计
          （已完成包数 / 总包数、百分比、预计剩余时间）。
        </p>
        <p>
          进度粒度分三级：步骤级（9 步）、包级（基础系统每包 + 用户软件）、命令级
          （configure / make / make install 三阶段）。更新频率是实时的——步骤开始/完成、
          包开始/完成、命令阶段变化、失败，都立即更新。
        </p>
        <p>
          <strong>断点续传流程</strong>：构建失败/中断 → 读取进度文件 → 找到断点
          （步骤 + 包 + 命令阶段）→ 从该点继续（不重跑已完成的步骤）→ 更新进度文件 →
          继续后续步骤。例如失败点是"基础系统 / gcc / make install"，恢复时下载前序
          步骤的产物、解压到构建环境、从 gcc 的 make install 继续。
        </p>
        <p>
          此外还有一个<strong>跨轮状态文件</strong>（管 agent 的记忆，与 build-progress.json
          并行）：记录 9 步状态、搜索发现、每轮进展、操作指纹（防重复失败）、后台任务
          清单、阻塞点。会话恢复后依次读取这些段落，从当前阶段续接，不重新扫仓库、
          不要求用户重述目标。
        </p>
      </Subsection>

      <Subsection index="4.3" title="能力 3：失败分类 + 恢复指导">
        <p>
          构建失败时，agent 提供<strong>结构化故障排查</strong>：先捕获失败（完整错误
          日志 + 失败步骤/包/命令 + 系统状态），然后按五类分类，每类有多个恢复选项 +
          风险等级 + 推荐选项。
        </p>

        <Table
          caption="失败五分类"
          columns={[
            { key: "c0", label: "类型" },
            { key: "c1", label: "特征" },
            { key: "c2", label: "恢复方案" },
            { key: "c3", label: "风险" },
          ]}
          rows={[
            { c0: "A 网络", c1: "下载失败 / 镜像不可用 / DNS 失败", c2: "重试 / 换镜像 / 检查网络 / 用离线包", c3: "low" },
            { c0: "B 编译", c1: "编译器/链接器报错 / make check 失败", c2: "搜索 workaround / 社区 patch / 降级 / 跳过 / 调参", c3: "medium（降级）/ low（patch）" },
            { c0: "C 依赖", c1: "找不到头文件/库 / 依赖未装", c2: "检查构建顺序 / 补装 / 检查 configure / 设环境变量", c3: "low" },
            { c0: "D 资源", c1: "磁盘/内存不足 / CPU 过载", c2: "清理临时文件 / 减并行度 / 加 swap / 分步构建", c3: "low" },
            { c0: "E 配置", c1: "configure 失败 / 内核/系统配置错误", c2: "检查配置 / 回退默认 / 参考官方文档 / 搜索最佳实践", c3: "medium" },
          ]}
        />

        <p>
          每个恢复方案的风险等级、具体操作、预计耗时等五要素要求，以及所有方案
          都失败时的升级处理流程，详见 §06（循环防护与失败恢复）。这里只关注
          分类本身——ABCDE 五类覆盖了构建中绝大多数失败场景。
        </p>
        <p>
          已知失败模式会沉淀到<strong>失败知识库</strong>（错误模式 + 失败类型 +
          诊断 + 解决方案列表 + 来源），下次遇到同类失败可直接复用。
        </p>
      </Subsection>
    </Section>
  );
}
