import { Article, Hero, Lead, Raw, Summary } from "reacticle";
import { SectionOpening } from "./sections/01-opening";
import { SectionWorkflow } from "./sections/02-workflow";
import { SectionNineSteps } from "./sections/03-nine-steps";
import { SectionThreeCapabilities } from "./sections/04-three-capabilities";
import { SectionBuildEnvironment } from "./sections/05-build-environment";
import { SectionLoopProtection } from "./sections/06-loop-protection";
import { SectionGithubActions } from "./sections/07-github-actions";
import { SectionReportDeliverables } from "./sections/08-report-deliverables";
import { SectionPostInstall } from "./sections/09-post-install";
import { SectionAiAssistant } from "./sections/10-ai-assistant";
import { SectionQuickStart } from "./sections/11-quick-start";
import { SectionRisksStructure } from "./sections/12-risks-structure";
import { SectionConclusion } from "./sections/conclusion";

// Article.tsx is the ASSEMBLER, owned by the main agent. It imports and orders
// Section components — it must NOT contain Section bodies inline.
export function ArticleDoc() {
  return (
    <Article toc width="wide">
      <Hero
        title="TTL — TimeToLinux"
        subtitle="从 CPU 指令集到桌面的全链路重新编译"
        meta={[{ label: "来源", value: "TTL 项目文档" }, { label: "类型", value: "完整长文 · 100% 信息保留" }]}
      />
      <Lead>
        TTL 不是一个现成的发行版，而是一套指导 AI agent 帮你从零构建专属 Linux 的方法论。
        它追求的不是"装完能用"，而是"装完就像为你量身定做了三年"——从工具链到内核到桌面，
        全部针对你的 CPU 指令集重新编译。
      </Lead>
      <Summary
        title="TL;DR"
        points={[
          "TTL 是什么：一套 SKILL 文档，指导 AI agent 帮用户构建一个专属于他的完整桌面 Linux 发行版（LFS + BLFS 路线）。",
          "核心理念：开箱即用 × 极致特化——完整桌面体验、全链路性能优化、桌面美化/输入法/Wine 预配置、内嵌本地 AI 助手。",
          "构建流程：9 步（主机准备 → 交叉工具链 → Chroot → 基础系统 → 内核 → 桌面 → 用户软件 → AI 助手 → 打包 ISO），耗时 4-6 小时。",
          "最终产物：体验版 ISO（U 盘启动试用）+ 无人值守安装版 ISO（自动安装）+ 内嵌 AI 助手 + 完整报告与指南。",
        ]}
      />

      <SectionOpening />
      <SectionWorkflow />
      <SectionNineSteps />
      <SectionThreeCapabilities />
      <SectionBuildEnvironment />
      <SectionLoopProtection />
      <SectionGithubActions />
      <SectionReportDeliverables />
      <SectionPostInstall />
      <SectionAiAssistant />
      <SectionQuickStart />
      <SectionRisksStructure />
      <SectionConclusion />

      {/*
        ─── Colophon ───
        每篇 Beautiful Article 必须保留这一段。
      */}
      <Raw title="">
        <footer
          style={{
            marginTop: "var(--ra-space-7, 3rem)",
            paddingTop: "var(--ra-space-4, 1rem)",
            borderTop: "1px solid var(--ra-color-border, currentColor)",
            color: "var(--ra-color-muted, inherit)",
            fontSize: "var(--ra-text-xs, 0.78rem)",
            textAlign: "center",
            letterSpacing: "0.02em",
            opacity: 0.85,
          }}
        >
          Made with{" "}
          <a
            href="https://github.com/ConardLi/garden-skills"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            beautiful-article
          </a>{" "}
          · tufte theme
        </footer>
      </Raw>
    </Article>
  );
}
