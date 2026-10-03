import { Section, Subsection, Table } from "reacticle";

export function SectionNineSteps() {
  return (
    <Section index="03" title="九步构建路线">
      <p>
        TTL 的构建走 LFS + BLFS 路线，分 9 步。每一步都有明确的关键决策、用户确认点和
        验证方法。agent 会在每步开始前执行"搜索-决策-记录"循环，并向你展示推荐 + 理由，
        等你确认后才执行。每步的已知坑点见 §05 速查表。以下是 9 步的完整概览。
      </p>

      <Table
        caption="9 步构建概览"
        columns={[
          { key: "c0", label: "步骤" },
          { key: "c1", label: "内容" },
          { key: "c2", label: "耗时" },
          { key: "c3", label: "关键决策" },
        ]}
        rows={[
          { c0: "1", c1: "主机准备", c2: "10-20 分钟", c3: "构建平台选择 + 磁盘空间确认" },
          { c0: "2", c1: "交叉工具链", c2: "30-60 分钟", c3: "-march 值 + LTO 开关 + PIE/SSP 加固" },
          { c0: "3", c1: "Chroot 工具", c2: "30-45 分钟", c3: "glibc 安全参数 + Python 版本" },
          { c0: "4", c1: "基础系统", c2: "2-3 小时", c3: "构建顺序 + 每包版本 + CFLAGS" },
          { c0: "5", c1: "内核 + 引导", c2: "30-60 分钟", c3: "内核配置 + GPU 驱动 + UEFI/Legacy" },
          { c0: "6", c1: "桌面体验", c2: "1-2 小时", c3: "桌面环境 + 输入法 + 主题" },
          { c0: "7", c1: "用户软件 + Wine", c2: "1-2 小时", c3: "软件版本 + Wine 版本 + WinApps" },
          { c0: "8", c1: "AI 助手", c2: "30-60 分钟", c3: "llama.cpp 参数 + 模型量化" },
          { c0: "9", c1: "打包 ISO", c2: "30-60 分钟", c3: "ISO 配置 + 无人值守 preseed" },
        ]}
      />

      <Subsection index="3.1" title="Step 1：主机准备">
        <p>
          创建专用构建用户（非 root、无 shell 限制、无 sudo 权限），安装 LFS 要求的主机
          工具链（gcc、glibc、binutils、make、bash、coreutils 等），创建 <code>/mnt/lfs</code>
          目录并设置权限。<strong>关键决策</strong>：确认主机工具链版本满足 LFS 最低要求。
          <strong>询问用户</strong>：构建平台选择（本地 / GitHub Actions / 其他 CI）+
          磁盘空间确认（100GB+）。<strong>验证</strong>：<code>gcc --version</code>、
          <code>ldd --version</code>、<code>make --version</code> 输出符合 LFS 要求。
        </p>
      </Subsection>

      <Subsection index="3.2" title="Step 2：交叉工具链（最耗时）">
        <p>
          编译针对你 CPU 的 GCC 交叉编译器。<strong>关键决策</strong>有三个：
        </p>
        <ul>
          <li>
            <code>-march=&lt;你的CPU架构&gt;</code> 的选择——agent 会搜索该 CPU 的最佳
            march 值 + 已知问题（如 AMD Ryzen 9000 系列用 <code>-march=znver4</code>）。
          </li>
          <li>
            是否启用 LTO（链接时优化）——agent 搜索 LTO 在当前 GCC 版本的稳定性。
          </li>
          <li>
            PIE + SSP 安全加固参数（<code>-fPIE -fno-PIE -fstack-protector-strong</code>）。
          </li>
        </ul>
        <p>
          <strong>询问用户</strong>：march 值确认 + LTO 开关确认。<strong>验证</strong>：
          交叉编译器能编译并运行 hello world 测试程序。<strong>注意</strong>：此步耗时最长
          （GCC 编译 30-60 分钟），必须后台跑。
        </p>
      </Subsection>

      <Subsection index="3.3" title="Step 3：Chroot 工具">
        <p>
          在 chroot 环境中编译基础工具（binutils、gcc 第二阶段、glibc、coreutils 等）。
          <strong>关键决策</strong>：glibc 安全参数（stack protector 级别）+ Python 版本选择
          （agent 搜索当前最稳定版本）。<strong>询问用户</strong>：Python 版本确认 +
          glibc 安全参数确认。<strong>验证</strong>：chroot 内 <code>gcc</code>、
          <code>ld</code>、<code>bash</code> 可正常运行。<strong>注意</strong>：chroot
          环境内无网络，所有源码必须提前下载。
        </p>
      </Subsection>

      <Subsection index="3.4" title="Step 4：基础系统（~50 包）">
        <p>
          按 LFS 指定顺序编译约 50 个基础包。<strong>关键决策</strong>：构建顺序（严格按
          LFS，不可乱序）+ 每包版本（agent 每包前搜索"包名 + 版本 + known issues"）+
          CFLAGS 参数（agent 搜索"包名 + best compile flags"）。
          <strong>验证</strong>：每包编译后运行 <code>make check</code>（如适用）+
          基本功能测试。<strong>注意</strong>：50 包逐个编译，总耗时 2-3 小时。
        </p>
      </Subsection>

      <Subsection index="3.5" title="Step 5：内核 + 引导加载器（最关键的坑）">
        <p>
          编译 Linux 内核 + 配置引导加载器。<strong>关键决策</strong>：内核配置（agent 搜索
          "Linux 版本号 + best kernel config for 硬件型号" + 已知问题）+ GPU 驱动模块
          （NVIDIA 需专有驱动联网安装，AMD/Intel 用开源驱动）+ 引导加载器配置
          （UEFI vs Legacy，agent 搜索"主板型号 + UEFI boot config"）。
          <strong>验证</strong>：内核能编译通过 + 引导加载器配置正确。
          <strong>注意</strong>：内核配置错误是最严重的坑（无法启动/黑屏/卡 logo），
          必须充分搜索避坑。
        </p>
      </Subsection>

      <Subsection index="3.6" title="Step 6：桌面体验">
        <p>
          编译桌面环境 + 配置输入法 + 美化。<strong>关键决策</strong>：桌面环境选择
          （根据你的内存/CPU 推荐）+ 输入法（fcitx5 + Rime）+ 主题（图标/光标/壁纸/字体）。
          agent 会搜索"桌面环境 + GPU型号 + compatibility issues"和
          "桌面环境 + fcitx5 input method problems"避坑。
          <strong>验证</strong>：桌面环境能启动 + 输入法可用 + 网络/声音正常。
          <strong>注意</strong>：桌面环境编译耗时 1-2 小时。
        </p>
      </Subsection>

      <Subsection index="3.7" title="Step 7：用户软件 + Windows 兼容">
        <p>
          安装你选择的软件 + 配置 Wine + WinApps。<strong>关键决策</strong>：软件版本
          （agent 搜索"软件名 + 版本 + known issues"）+ Wine 版本 + WinApps 开关 +
          预装应用清单。agent 会搜索"Wine 版本 + GPU型号 + compatibility"避坑。
          <strong>验证</strong>：每个软件能正常运行。<strong>注意</strong>：Wine + GPU
          驱动兼容性是常见坑点。
        </p>
      </Subsection>

      <Subsection index="3.8" title="Step 8：AI 助手">
        <p>
          编译 llama.cpp + 下载模型。<strong>关键决策</strong>：llama.cpp 编译参数
          （agent 搜索"llama.cpp best build flags for 你的CPU型号"）+ 模型量化选择
          （根据内存：8GB→Q4_K_M，16GB→Q5_K_M，32GB+→Q6_K）+ 系统提示词
          （携带"开箱即用 × 极致特化"理念）。
          <strong>询问用户</strong>：模型选择确认 + 系统提示词展示（等你确认或修改）。
          <strong>验证</strong>：模型能加载 + 推理正常 + 响应时间可接受。
          <strong>注意</strong>：模型下载耗时（~5.7GB），必须后台跑。
        </p>
      </Subsection>

      <Subsection index="3.9" title="Step 9：打包 ISO">
        <p>
          打包体验版 + 无人值守安装版。<strong>关键决策</strong>：ISO 打包工具配置
          （agent 搜索"live-build best ISO configuration"）+ 无人值守安装配置
          （agent 搜索"unattended install best preseed config"）。
          体验版：不写入硬盘，重启恢复原状。无人值守版：自动分区 + 自动安装，
          全程无需人工干预。<strong>询问用户</strong>：磁盘布局确认 + 是否同时打包
          两个版本。<strong>验证</strong>：ISO 能在虚拟机中启动 + 基本功能正常（冒烟测试）。
        </p>
      </Subsection>
    </Section>
  );
}
