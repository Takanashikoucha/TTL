import { Section, Subsection, Raw } from "reacticle";

export function SectionLoopProtection() {
  return (
    <Section index="06" title="循环防护与失败恢复">
      <p>
        构建失败后的恢复操作如果不加约束，很容易陷入"重试 → 失败 → 再重试"的死循环。
        TTL 用三重机制强制打破循环：指纹去重、进度停滞检测、轮次预算。任一触发就
        <strong>BLOCK</strong>（停止 + 向你报告 + 等待指示），没有例外。
      </p>

      <Raw title="三重循环防护机制">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--ra-space-3, 0.75rem)" }}>
          <div style={{ padding: "var(--ra-space-3, 0.75rem)", borderTop: "2px solid var(--ra-color-accent, currentColor)" }}>
            <strong style={{ fontSize: "var(--ra-text-sm, 0.9rem)", color: "var(--ra-color-accent, currentColor)" }}>
              ① 指纹去重
            </strong>
            <p style={{ margin: "var(--ra-space-2, 0.5rem) 0 0", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)", lineHeight: 1.6 }}>
              失败过的恢复命令禁止原样再执行。累计 3 次（含首执）后永久禁该指纹。
              "换个说法再试"计同一指纹。<strong>硬锚</strong>：同一指纹连续 2 次返回
              相同结果 = 已无新信息，第 3 次禁止执行。
            </p>
          </div>
          <div style={{ padding: "var(--ra-space-3, 0.75rem)", borderTop: "2px solid var(--ra-color-accent, currentColor)" }}>
            <strong style={{ fontSize: "var(--ra-text-sm, 0.9rem)", color: "var(--ra-color-accent, currentColor)" }}>
              ② 进度停滞
            </strong>
            <p style={{ margin: "var(--ra-space-2, 0.5rem) 0 0", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)", lineHeight: 1.6 }}>
              连续 3 轮无新进展（新信息/状态变化/新错误类型，至少占其一）= 停滞。
              触发后立即停止 + 向你报告。"新信息"指获得此前未知的事实/数据，
              不含重复确认已知内容。
            </p>
          </div>
          <div style={{ padding: "var(--ra-space-3, 0.75rem)", borderTop: "2px solid var(--ra-color-accent, currentColor)" }}>
            <strong style={{ fontSize: "var(--ra-text-sm, 0.9rem)", color: "var(--ra-color-accent, currentColor)" }}>
              ③ 轮次预算
            </strong>
            <p style={{ margin: "var(--ra-space-2, 0.5rem) 0 0", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)", lineHeight: 1.6 }}>
              默认 15 轮/任务；构建任务开始时上调（建议 30 轮）并记录。
              耗尽未完成 = 终止。三个机制独立、度量对象不同，任一触发即 BLOCK。
            </p>
          </div>
        </div>
      </Raw>

      <Subsection index="6.1" title="异常模式">
        <p>
          除了三重机制，还有两个硬锚提前拦截：<strong>同一错误连续 2 次</strong> →
          停止重试，必须换方案（换参数/换方法/换工具/报告阻塞）；<strong>同一错误类型
          在不同操作中再现 3 次</strong> = 系统性问题，等同处理。
        </p>
        <p>
          <strong>策略切换</strong>有严格记录要求：切换前在状态文件记录"已尝试什么 +
          为何换 + 新策略"；新策略必须产生不同于旧指纹的指纹。不能"换个说法再试"
          假装是新策略。
        </p>
      </Subsection>

      <Subsection index="6.2" title="恢复方案要求">
        <p>
          每个恢复方案必须包含五要素：选项名 + 描述、风险等级（low / medium / high）、
          具体操作（命令或步骤）、预计耗时、是否适用。推荐选项要明确标注。
          高风险方案（如降级、跳过）需要你确认后才执行。
        </p>
        <p>
          所有恢复尝试都要记录到状态文件的"操作指纹"段（指纹 + 执行次数 + 最近错误），
          每次恢复后都要更新进度文件 + 状态文件。不要盲目重试——同一错误连续 2 次
          失败后，必须换方案。
        </p>
      </Subsection>

      <Subsection index="6.3" title="升级处理">
        <p>
          如果所有恢复方案都失败，agent 会升级处理：记录完整日志（错误日志 + 系统状态 +
          已尝试的恢复方案 + 进度文件）、生成故障报告（构建标识 + 失败步骤/包/命令 +
          错误日志 + 系统状态 + 已尝试方案 + 时间戳）、指导你提交 Issue 并附上故障报告，
          等待维护者回复。
        </p>
      </Subsection>
    </Section>
  );
}
