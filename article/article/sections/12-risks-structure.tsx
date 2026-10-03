import { Section, Subsection, Table, Raw } from "reacticle";

export function SectionRisksStructure() {
  return (
    <Section index="12" title="风险与仓库结构">
      <p>
        最后两件事：一是你必须知道的风险（agent 也会反复提醒），二是仓库本身的
        结构（方便你理解文档组织）。
      </p>

      <Subsection index="12.1" title="风险清单（必须告知用户）">
        <Table
          caption="五大风险"
          columns={[
            { key: "c0", label: "风险" },
            { key: "c1", label: "说明" },
          ]}
          rows={[
            { c0: "数据备份", c1: "无人值守安装会自动分区，任何磁盘操作都有风险，安装前务必备份重要数据" },
            { c0: "双系统 / BitLocker", c1: "关 Windows 快速启动；BitLocker 先获取恢复密钥" },
            { c0: "NVIDIA 驱动联网", c1: "TTL 构建中 NVIDIA 驱动不内置，首次启动需联网安装" },
            { c0: "游戏反作弊", c1: "Linux 下多数游戏的反作弊不支持，玩竞技网游前先查兼容性" },
            { c0: "构建中断", c1: "断电/重启 = 构建中断，需断点续传；GHA runner 不要随意重启" },
          ]}
        />
      </Subsection>

      <Subsection index="12.2" title="9 步耗时分布">
        <Raw title="各步耗时占比（4-6 小时总时长）">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--ra-space-2, 0.5rem)" }}>
            {[
              { name: "1 主机准备", min: 10, max: 20 },
              { name: "2 交叉工具链", min: 30, max: 60 },
              { name: "3 Chroot", min: 30, max: 45 },
              { name: "4 基础系统", min: 120, max: 180 },
              { name: "5 内核+引导", min: 30, max: 60 },
              { name: "6 桌面", min: 60, max: 120 },
              { name: "7 软件+Wine", min: 60, max: 120 },
              { name: "8 AI 助手", min: 30, max: 60 },
              { name: "9 打包 ISO", min: 30, max: 60 },
            ].map((s) => {
              const totalMin = 240;
              const pctMin = Math.round((s.min / totalMin) * 100);
              const width = Math.max(pctMin, 4);
              return (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "var(--ra-space-2, 0.5rem)" }}>
                  <span style={{ width: "8rem", fontSize: "var(--ra-text-xs, 0.78rem)", textAlign: "right", color: "var(--ra-color-muted, inherit)" }}>
                    {s.name}
                  </span>
                  <div style={{ flex: 1, height: "1.2rem", background: "var(--ra-color-bg-alt, rgba(127,127,127,0.1))", borderRadius: "0.25rem", overflow: "hidden" }}>
                    <div style={{ width: `${width}%`, height: "100%", background: "var(--ra-color-accent, currentColor)", opacity: 0.85, borderRadius: "0.25rem" }} />
                  </div>
                  <span style={{ width: "6rem", fontSize: "var(--ra-text-xs, 0.78rem)", color: "var(--ra-color-muted, inherit)" }}>
                    {s.min}-{s.max} 分钟
                  </span>
                </div>
              );
            })}
          </div>
        </Raw>
        <p>
          可以看到，<strong>Step 4（基础系统，50 包）占了总时长的近一半</strong>，
          其次是 Step 6（桌面）和 Step 7（软件 + Wine）。这也是为什么断点续传
          如此重要——万一 Step 4 中途失败，你不需要从头再来，只需从那一步的
          断点继续。
        </p>
      </Subsection>

      <Subsection index="12.3" title="仓库结构">
        <pre style={{ overflowX: "auto", fontSize: "var(--ra-text-xs, 0.78rem)", lineHeight: 1.6 }}>
{`TTL/
├── README.md                    # 入口（面向 agent + 面向人类）
├── skill/
│   ├── SKILL.md                 # 核心理念 + 完整流程 + 三大能力
│   ├── build-environment.md     # 构建环境要求 + 各步骤坑点 + 验证方法
│   ├── search-protocol.md       # 搜索-决策-记录-避坑 指导
│   ├── progress-protocol.md     # 进度管理 + 断点续传 指导
│   ├── failure-protocol.md      # 失败分类 + 恢复指导
│   ├── github-actions.md        # GitHub Actions 构建指导
│   ├── report-protocol.md       # 构建报告 + 产物指南 指导
│   └── system-setup.md          # 安装后系统配置指导
├── dist/                        # 构建产物（构建完成后由 agent 提交）
│   ├── iso/                     # ISO 文件
│   ├── report/                  # 构建报告
│   ├── guide/                   # 使用指南
│   └── config/                  # 构建配置
└── .github/
    └── workflows/
        └── build.yml            # GitHub Actions workflow（如使用）`}
        </pre>
        <p>
          8 份协议文档各司其职：SKILL.md 是总纲（完整流程 + 三大能力），
          其余 7 份分别是环境、搜索、进度、失败、CI、报告、安装后配置的专业
          指导。agent 加载 SKILL.md 时会按需引用这些专业文档。
        </p>
      </Subsection>
    </Section>
  );
}
