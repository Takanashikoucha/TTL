// Cover.tsx —— TTL 文章封面
// 模板 C：上下分屏。上半深色块含标题 + kicker，下半浅色块是 SVG 编译流水线主视觉。
// 视觉主体：从左下到右上的编译流水线——CPU 芯片 → 工具链 → 内核 → 桌面 → AI → 显示器
// 只用 --ra-* token，离线优先，无远程图片。

export function Cover() {
  return (
    <section
      className="ra-cover"
      aria-label="文章封面"
      data-ra-cover=""
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "min(100%, 48rem, calc((100vh - 8rem) * 3 / 4))",
        margin: "0 auto var(--ra-space-7, 3rem) auto",
        aspectRatio: "3 / 4",
        overflow: "hidden",
        background: "transparent",
        color: "var(--ra-color-fg, inherit)",
        borderRadius: "var(--ra-radius-md, 0)",
        border: "1px solid var(--ra-color-border, currentColor)",
        isolation: "isolate",
      }}
    >
      {/* 上半：标题区（深色块） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "38%",
          background: "var(--ra-color-surface, transparent)",
          borderBottom: "1px solid var(--ra-color-border, currentColor)",
          display: "grid",
          alignContent: "center",
          justifyContent: "start",
          padding: "0 var(--ra-space-8, 4rem)",
          gap: "var(--ra-space-2, 0.5rem)",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: "var(--ra-text-xs, 0.72rem)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--ra-color-muted, inherit)",
            opacity: 0.9,
          }}
        >
          SKILL · LFS + BLFS · 9 步构建
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.8rem, 5vw, var(--ra-text-4xl, 3.2rem))",
            lineHeight: 1.05,
            fontWeight: "var(--ra-font-weight-bold, 700)",
            color: "var(--ra-color-fg, inherit)",
          }}
        >
          TTL
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "var(--ra-text-sm, 0.95rem)",
            color: "var(--ra-color-muted, inherit)",
            lineHeight: 1.4,
          }}
        >
          TimeToLinux · 为你的硬件量身定制的 Linux 发行版
        </p>
      </div>

      {/* 下半：SVG 编译流水线主视觉 */}
      <svg
        viewBox="0 0 1200 988"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "62%",
          color: "var(--ra-color-fg, inherit)",
          zIndex: 0,
        }}
      >
        <defs>
          {/* 细线网格背景 */}
          <pattern id="cover-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="1200" height="988" fill="url(#cover-grid)" />

        {/* 编译流水线：从左下到右上的斜线管道 */}
        {/* 管道主线 */}
        <line
          x1="120" y1="850" x2="1080" y2="150"
          stroke="var(--ra-color-accent, currentColor)"
          strokeWidth="3"
          opacity="0.6"
        />
        {/* 管道平行虚线（表示数据流） */}
        <line
          x1="140" y1="830" x2="1100" y2="130"
          stroke="var(--ra-color-accent, currentColor)"
          strokeWidth="1"
          strokeDasharray="8 6"
          opacity="0.3"
        />

        {/* 节点 1：CPU 芯片（起点） */}
        <g transform="translate(120, 850)">
          <rect x="-35" y="-35" width="70" height="70" rx="8" fill="none" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2" />
          <rect x="-22" y="-22" width="44" height="44" rx="4" fill="none" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1" opacity="0.5" />
          {/* 引脚 */}
          <line x1="-35" y1="-15" x2="-50" y2="-15" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1.5" />
          <line x1="-35" y1="0" x2="-50" y2="0" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1.5" />
          <line x1="-35" y1="15" x2="-50" y2="15" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1.5" />
          <line x1="35" y1="-15" x2="50" y2="-15" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1.5" />
          <line x1="35" y1="0" x2="50" y2="0" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1.5" />
          <line x1="35" y1="15" x2="50" y2="15" stroke="var(--ra-color-fg, currentColor)" strokeWidth="1.5" />
          <text x="0" y="60" textAnchor="middle" style={{ fontSize: "var(--ra-text-sm, 0.95rem)" }} fontFamily="var(--ra-font-body, inherit)" fill="var(--ra-color-muted, inherit)">
            CPU · -march
          </text>
        </g>

        {/* 节点 2：工具链（SVG 齿轮，不用 emoji） */}
        <g transform="translate(360, 680)">
          <circle r="28" fill="none" stroke="var(--ra-color-accent, currentColor)" strokeWidth="2" />
          {/* 齿轮：中心圆 + 8 条齿线 */}
          <circle r="10" fill="none" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2" />
          <line x1="0" y1="-22" x2="0" y2="-14" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="0" y1="14" x2="0" y2="22" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="-22" y1="0" x2="-14" y2="0" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="14" y1="0" x2="22" y2="0" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="-16" y1="-16" x2="-10" y2="-10" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="10" y1="10" x2="16" y2="16" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="16" y1="-16" x2="10" y2="-10" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <line x1="-10" y1="10" x2="-16" y2="16" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2.5" />
          <text x="0" y="55" textAnchor="middle" style={{ fontSize: "var(--ra-text-sm, 0.95rem)" }} fontFamily="var(--ra-font-body, inherit)" fill="var(--ra-color-muted, inherit)">
            工具链
          </text>
        </g>

        {/* 节点 3：内核 */}
        <g transform="translate(600, 510)">
          <rect x="-30" y="-30" width="60" height="60" rx="6" fill="none" stroke="var(--ra-color-accent, currentColor)" strokeWidth="2" />
          <line x1="-15" y1="-15" x2="15" y2="15" stroke="var(--ra-color-accent, currentColor)" strokeWidth="1.5" />
          <line x1="15" y1="-15" x2="-15" y2="15" stroke="var(--ra-color-accent, currentColor)" strokeWidth="1.5" />
          <text x="0" y="55" textAnchor="middle" style={{ fontSize: "var(--ra-text-sm, 0.95rem)" }} fontFamily="var(--ra-font-body, inherit)" fill="var(--ra-color-muted, inherit)">
            内核
          </text>
        </g>

        {/* 节点 4：桌面 */}
        <g transform="translate(840, 340)">
          <rect x="-32" y="-24" width="64" height="48" rx="4" fill="none" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2" />
          <line x1="-12" y1="24" x2="12" y2="24" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2" />
          <line x1="0" y1="24" x2="0" y2="38" stroke="var(--ra-color-fg, currentColor)" strokeWidth="2" />
          <text x="0" y="60" textAnchor="middle" style={{ fontSize: "var(--ra-text-sm, 0.95rem)" }} fontFamily="var(--ra-font-body, inherit)" fill="var(--ra-color-muted, inherit)">
            桌面
          </text>
        </g>

        {/* 节点 5：AI 助手 */}
        <g transform="translate(1080, 150)">
          <circle r="30" fill="none" stroke="var(--ra-color-accent, currentColor)" strokeWidth="2" />
          <circle r="18" fill="none" stroke="var(--ra-color-accent, currentColor)" strokeWidth="1" opacity="0.5" />
          <circle r="6" fill="var(--ra-color-accent, currentColor)" opacity="0.6" />
          <text x="0" y="55" textAnchor="middle" style={{ fontSize: "var(--ra-text-sm, 0.95rem)" }} fontFamily="var(--ra-font-body, inherit)" fill="var(--ra-color-muted, inherit)">
            AI 助手
          </text>
        </g>

        {/* 终点标注：开箱即用 */}
        <text
          x="1080" y="80"
          textAnchor="middle"
          style={{ fontSize: "var(--ra-text-base, 1.1rem)" }}
          fontFamily="var(--ra-font-body, inherit)"
          fill="var(--ra-color-accent, currentColor)"
          fontWeight="var(--ra-font-weight-bold, 700)"
          letterSpacing="0.1em"
        >
          开箱即用
        </text>
      </svg>
    </section>
  );
}
