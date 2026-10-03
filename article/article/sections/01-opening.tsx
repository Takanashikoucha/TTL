import { Section, Subsection, Quote, Aside } from "reacticle";

export function SectionOpening() {
  return (
    <Section index="01" title="这是什么">
      <p>
        你是不是也想过换 Linux，但每次都被劝退了？Ubuntu 太"通用"，Fedora 太"折腾"，
        Arch 太"硬核"——没有一个是为<b>你这台特定的电脑</b>量身定做的。
      </p>
      <p>
        TTL（TimeToLinux）不一样。它不是一个现成的发行版，而是一套
        <strong>SKILL 文档</strong>——你把它喂给 AI agent，agent 就会帮你
        <strong>从零开始，针对你的 CPU 指令集、你的 GPU、你的使用习惯，重新编译
        一整套桌面 Linux 系统</strong>。从底层工具链到上层桌面环境，每一层都带着
        "为你的硬件优化"的基因。
      </p>
      <p>
        听起来很玄？其实原理不复杂：Linux 世界有一条古老的传统叫 LFS
        （Linux From Scratch）——不装现成的包，而是把每个软件从源码亲手编译一遍。
        TTL 把这条传统交给了 AI：你只管说想要什么，agent 负责搜索最佳实践、
        避开已知坑、记录每个决策、管理漫长的构建进度，最后交给你一个
        "开箱即用 × 极致特化"的发行版。
      </p>
      <p>
        这篇文章会带你走完 TTL 的全貌：它是什么、怎么工作、9 步构建怎么走、
        agent 靠哪三项能力驾驭这场 4-6 小时的马拉松、失败了怎么恢复、
        怎么用 GitHub Actions 托管构建、装完后有哪些坑要躲、内嵌 AI 助手能干什么、
        以及你该怎么上手。
      </p>

      <Quote who="TTL 核心理念">
        开箱即用 × 极致特化。不是"装完能用"，而是"装完就像为你量身定做了三年"。
      </Quote>

      <Subsection index="1.1" title="四条支柱">
        <ol>
          <li>
            <strong>完整桌面体验</strong>——启动即进图形桌面，不是无界面服务器。
            你要的是一个能日常使用的操作系统，不是一个命令行玩具。
          </li>
          <li>
            <strong>全链路性能优化</strong>——从工具链 → C 库 → 内核 → 用户空间，
            全部针对你的 CPU 指令集重新编译。不是"能跑就行"，而是"榨干你这块 CPU"。
          </li>
          <li>
            <strong>开箱即用</strong>——桌面美化、输入法、Windows 软件兼容（Wine +
            WinApps）全部预配置。装完就能用，不用再折腾半天环境。
          </li>
          <li>
            <strong>内嵌 AI 助手</strong>——本地运行的问答助手，携带同样的理念，
            在你装机后持续帮你优化、排障、推荐软件。
          </li>
        </ol>
      </Subsection>

      <Aside tone="note" label="不是 Ubuntu / Fedora">
        TTL 的产物不是 Ubuntu、不是 Fedora、也不是 Arch 的某个衍生版。它是一个
        <strong>专属于你</strong>的发行版——基于 LFS + BLFS 路线，从源码逐层编译，
        每个组件的版本、每个编译参数、每个内核选项，都是 agent 针对你的硬件搜索、
        决策、记录后确定的。换句话说，没有第二个人拥有和你一模一样的系统。
      </Aside>

      <p>
        接下来，我们从"完整工作流程"开始，一步步拆解 TTL 是怎么运转的。
      </p>
    </Section>
  );
}
