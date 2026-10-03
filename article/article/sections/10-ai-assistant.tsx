import { Section, Subsection, Aside } from "reacticle";

export function SectionAiAssistant() {
  return (
    <Section index="10" title="内嵌 AI 助手">
      <p>
        TTL 构建的系统里有一个<strong>本地运行的 AI 助手</strong>（基于 llama.cpp +
        GGUF 量化模型）。它不是云端服务，不需要联网，所有推理都在你自己的 CPU 上完成。
        它携带与构建相同的理念——"开箱即用 × 极致特化"，在你装机后持续工作。
      </p>

      <Subsection index="10.1" title="五项职责">
        <ol>
          <li>
            <strong>解答 Linux 使用问题</strong>——面向新手，通俗语言，不甩术语。
            你问"怎么装个软件"，它会告诉你具体命令，而不是让你去翻 man page。
          </li>
          <li>
            <strong>根据硬件主动建议性能优化</strong>——TLP / 电压下探 / 功率墙。
            它知道你 CPU 的型号和架构，给出的建议是针对你这台机器的，不是泛泛而谈。
          </li>
          <li>
            <strong>帮助排查故障</strong>——声音 / 键盘 / 关机 / 包管理。
            它了解你系统的完整配置，能给出针对性的排查步骤。
          </li>
          <li>
            <strong>推荐适合场景的软件</strong>——你说"我要剪视频"，它推荐
            Kdenlive + 相关插件，而不是给你一堆无关选项。
          </li>
          <li>
            <strong>定期扫描系统，发现可优化项并主动建议</strong>——不是被动等你问，
            而是主动发现"你这个配置还可以这样优化"。
          </li>
        </ol>
      </Subsection>

      <Subsection index="10.2" title="模型选择">
        <p>
          模型量化根据内存自动匹配：8GB → Q4_K_M，16GB → Q5_K_M，32GB+ → Q6_K。
          模型大小约 5.7GB，下载耗时较长（构建 Step 8 中后台执行）。
          系统提示词携带"开箱即用 × 极致特化"理念，确保助手的回答风格与
          构建理念一致。
        </p>
      </Subsection>

      <Aside tone="note" label="完全本地，隐私无忧">
        所有推理都在本地 CPU 上完成，不上传任何数据到云端。你的系统配置、
        使用习惯、提问内容都不会离开你的机器。对于注重隐私的用户，这是一个
        重要的优势。
      </Aside>

      <p>
        首次启动后，按 <code>first-boot.md</code> 的步骤验证 AI 助手：模型能加载、
        推理正常、响应时间可接受。之后就可以在日常使用中随时调用它了。
      </p>
    </Section>
  );
}
