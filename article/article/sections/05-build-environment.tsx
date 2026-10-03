import { Section, Subsection, Table } from "reacticle";

export function SectionBuildEnvironment() {
  return (
    <Section index="05" title="构建环境与坑点">
      <p>
        LFS 构建对执行环境有严格要求。agent 在指导你准备构建环境时，必须确认以下四项
        都满足，否则构建大概率失败。
      </p>

      <Subsection index="5.1" title="环境要求">
        <Table
          caption="构建环境四项要求"
          columns={[
            { key: "c0", label: "维度" },
            { key: "c1", label: "要求" },
            { key: "c2", label: "坑" },
          ]}
          rows={[
            { c0: "用户与权限", c1: "专用构建用户（非 root、无 shell 限制、无 sudo）；只能访问 /mnt/lfs 和源码目录", c2: "LFS 要求纯净环境，宿主机工具链会污染构建产物" },
            { c0: "磁盘空间", c1: "最低 100GB（含源码 + 中间产物 + 最终 ISO）；建议 200GB+", c2: "磁盘不足是构建失败最常见原因之一，必须 Step 1 前确认" },
            { c0: "网络", c1: "构建期间需稳定网络（下载源码）；chroot 内无网络", c2: "chroot 内尝试联网会失败，所有源码必须提前下载" },
            { c0: "时间", c1: "总耗时 4-6 小时；Step 2 最长（30-60 分钟）；Step 4 次长（2-3 小时）", c2: "构建期间不要中断（断电、重启），否则需要断点续传" },
          ]}
        />
      </Subsection>

      <Subsection index="5.2" title="各步骤坑点">
        <p>
          LFS 的坑看似分散在 9 步里，实则集中在三类：<strong>环境纯净度</strong>
          （宿主机工具链污染、chroot 挂载缺失）、<strong>构建顺序</strong>（依赖
          缺失、版本不匹配）、<strong>硬件适配</strong>（march 值、GPU 驱动、
          内核配置）。agent 的"搜索-决策-记录"循环就是为这三类设计的——每步
          开始前搜索该步相关的坑，把已知问题挡在执行之前。以下是 9 步的主要
          坑点汇总：
        </p>
        <Table
          caption="9 步坑点速查"
          columns={[
            { key: "c0", label: "步骤" },
            { key: "c1", label: "主要坑" },
            { key: "c2", label: "避坑方法" },
          ]}
          rows={[
            { c0: "1 主机准备", c1: "宿主机 gcc 版本过低 → 交叉编译器编译失败；/mnt/lfs 权限不正确", c2: "验证 gcc/ldd/make 版本符合 LFS 要求；ls -ld /mnt/lfs 确认 rw 权限" },
            { c0: "2 交叉工具链", c1: "-march 值错误 → 工具链在目标 CPU 无法运行；LTO 与 GCC 版本不兼容", c2: "搜索 CPU 型号 + best -march value + known issues；搜索 GCC 版本 + LTO known issues" },
            { c0: "3 Chroot", c1: "chroot 内缺少 /dev /proc /sys 挂载；chroot 内无网络；glibc 与交叉编译器不匹配", c2: "进 chroot 前挂载 /dev /proc /sys；源码提前下载；搜索 glibc 版本 + compatibility issues" },
            { c0: "4 基础系统", c1: "构建顺序错误 → 依赖缺失；某包版本有已知 bug；CFLAGS 不当", c2: "严格按 LFS 顺序；每包前搜索 known issues；搜索 best compile flags" },
            { c0: "5 内核+引导", c1: "内核配置错误 → 无法启动（黑屏/卡 logo）；GPU 驱动模块缺失 → 无显示；UEFI vs Legacy 配置错误", c2: "搜索 best kernel config + known issues；NVIDIA 联网装驱动；搜索主板型号 + UEFI boot config" },
            { c0: "6 桌面", c1: "GPU 驱动与桌面不兼容 → 黑屏/卡顿；输入法与桌面冲突；主题配置不当", c2: "搜索桌面 + GPU + compatibility issues；搜索桌面 + fcitx5 problems；搜索 best theme config" },
            { c0: "7 软件+Wine", c1: "Wine + GPU 驱动不兼容 → Windows 应用无法运行；软件版本不兼容", c2: "搜索 Wine 版本 + GPU + compatibility；搜索软件名 + 版本 + known issues" },
            { c0: "8 AI 助手", c1: "模型量化与内存不匹配 → 加载失败/OOM；llama.cpp 参数不当 → 推理性能差", c2: "8GB→Q4_K_M，16GB→Q5_K_M，32GB+→Q6_K；搜索 llama.cpp best build flags" },
            { c0: "9 打包 ISO", c1: "ISO 配置错误 → 无法启动；无人值守配置错误 → 安装失败；未做冒烟测试", c2: "搜索 live-build best ISO config；搜索 unattended preseed config；必须在虚拟机中冒烟测试" },
          ]}
        />
      </Subsection>

      <Subsection index="5.3" title="验证方法">
        <p>
          每步完成后必须验证产物，不可跳过。验证是构建质量的最后一道防线，
          道理很简单：LFS 是层层叠加的构建，第 3 步的 chroot 工具如果有问题，
          第 4 步的 50 个基础包全会受影响，错误会一路累积到第 9 步才暴露——
          那时你已经花了 4 个小时，回头排查的代价远超在第 3 步花 1 分钟验证。
          所以"验证"不是可选的质量检查，而是防止错误指数级放大的必要刹车。
        </p>
        <Table
          caption="9 步验证方法"
          columns={[
            { key: "c0", label: "步骤" },
            { key: "c1", label: "验证内容" },
            { key: "c2", label: "验证方法" },
          ]}
          rows={[
            { c0: "1", c1: "主机工具链版本", c2: "gcc --version、ldd --version、make --version" },
            { c0: "2", c1: "交叉编译器功能", c2: "编译并运行 hello world" },
            { c0: "3", c1: "chroot 工具功能", c2: "chroot 内 gcc、ld、bash 可运行" },
            { c0: "4", c1: "基础系统包功能", c2: "每包 make check + 基本功能测试" },
            { c0: "5", c1: "内核 + 引导", c2: "内核编译通过 + 引导配置正确" },
            { c0: "6", c1: "桌面环境功能", c2: "桌面能启动 + 输入法/网络/声音正常" },
            { c0: "7", c1: "用户软件功能", c2: "每个软件能正常运行" },
            { c0: "8", c1: "AI 助手功能", c2: "模型能加载 + 推理正常" },
            { c0: "9", c1: "ISO 可启动", c2: "虚拟机中启动 + 基本功能正常" },
          ]}
        />
      </Subsection>
    </Section>
  );
}
