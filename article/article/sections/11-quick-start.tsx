import { Section, Subsection, Raw, Table } from "reacticle";

export function SectionQuickStart() {
  return (
    <Section index="11" title="快速开始">
      <p>
        如果你想试试 TTL，整个过程比你想象的简单。5 步，大约 10 分钟的准备工作，
        剩下的交给 agent。
      </p>

      <Raw title="5 步快速开始">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ra-space-2, 0.5rem)" }}>
          {[
            { num: "1", title: "Fork 本仓库", desc: "在 GitHub 上 Fork TTL 仓库到你的账号，clone 到本地" },
            { num: "2", title: "告诉 agent 工作目录", desc: "打开 AI agent（Claude / Cursor / 任意支持 SKILL 的 agent），告诉它工作目录是仓库根目录" },
            { num: "3", title: "加载 SKILL", desc: "对 agent 说：'加载 skill/SKILL.md 并执行 SKILL'" },
            { num: "4", title: "回答 agent 的问题", desc: "agent 会逐项问你硬件信息和偏好（桌面环境、软件、性能倾向、安装方式），每项都附推荐 + 理由" },
            { num: "5", title: "确认配置 → 坐等构建", desc: "agent 展示完整构建配置 + 决策理由 + 避坑报告，你确认后开始 4-6 小时构建（可本地或 GHA）" },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                display: "flex",
                gap: "var(--ra-space-3, 0.75rem)",
                alignItems: "flex-start",
                padding: "var(--ra-space-3, 0.75rem)",
                borderLeft: "2px solid var(--ra-color-accent, currentColor)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--ra-text-lg, 1.3rem)",
                  fontWeight: "var(--ra-font-weight-bold, 700)",
                  color: "var(--ra-color-accent, currentColor)",
                  minWidth: "2rem",
                }}
              >
                {s.num}
              </span>
              <div>
                <strong style={{ fontSize: "var(--ra-text-sm, 0.9rem)" }}>{s.title}</strong>
                <p style={{ margin: "var(--ra-space-1, 0.25rem) 0 0", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)", lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Raw>

      <Subsection index="11.1" title="构建平台怎么选">
        <Table
          caption="三种构建平台对比"
          columns={[
            { key: "c0", label: "平台" },
            { key: "c1", label: "适合谁" },
            { key: "c2", label: "特点" },
          ]}
          rows={[
            { c0: "本地构建", c1: "有一台空闲 Linux 机器的人", c2: "agent 逐步指导，你需要守着；断电/重启会中断" },
            { c0: "GitHub Actions", c1: "没有本地构建机、或怕被打断的人", c2: "agent 生成 workflow，push 后自动构建；需 self-hosted runner" },
            { c0: "其他 CI", c1: "已有 GitLab CI / Jenkins 等的人", c2: "agent 按对应平台语法生成配置" },
          ]}
        />
      </Subsection>

      <Subsection index="11.2" title="构建期间你要做什么">
        <p>
          很少。agent 会在每步的关键决策点停下来问你（march 值确认、Python 版本确认、
          模型选择确认等），你只需要看一眼推荐 + 理由，说"确认"或"换成 XX"。
          其余时间 agent 自己跑搜索、编译、验证、记录。如果用 GHA，你甚至可以
          push 完就去干别的事，构建完了 agent 会通知你。
        </p>
      </Subsection>

      <Subsection index="11.3" title="构建完成后">
        <p>
          agent 主动生成交付物（5 份报告 + 3 份指南 + 2 个 ISO），提交到你的 fork
          仓库，发布 GitHub Release。你拿到 ISO 后，按 install-guide.md 安装，
          按 first-boot.md 完成首次启动配置，然后就可以享受你的专属发行版了。
        </p>
      </Subsection>
    </Section>
  );
}
