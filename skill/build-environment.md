# 构建环境指导

本文件指导 agent 在准备和执行 LFS 构建时的环境要求、常见坑和验证方法。

## 构建环境要求

LFS 构建对执行环境有严格要求，agent 在指导用户准备构建环境时必须确认：

### 用户与权限
- **专用构建用户**：非 root，无 shell 限制，无 sudo 权限
- **权限隔离**：构建用户只能访问 `/mnt/lfs` 和源码目录，不能修改系统目录
- **原因**：LFS 要求纯净环境，避免宿主机工具链污染构建产物

### 磁盘空间
- **最低 100GB**（含源码 + 中间产物 + 最终 ISO）
- **建议 200GB+**（基础系统 50 包 + 桌面环境 + 用户软件的中间产物很大）
- **检查命令**：`df -h /mnt/lfs`
- **坑**：磁盘空间不足是构建失败的最常见原因之一，必须在 Step 1 前确认

### 网络
- **构建期间需要稳定网络**（下载源码包）
- **chroot 内无网络**：所有源码必须在进入 chroot 前下载完毕
- **坑**：chroot 内尝试联网会失败，必须提前下载

### 时间
- **总耗时 4-6 小时**（取决于硬件和包数量）
- **Step 2（交叉工具链）最长**：GCC 编译 30-60 分钟
- **Step 4（基础系统）次长**：50 包逐个编译 2-3 小时
- **坑**：构建期间不要中断（断电、重启），否则需要断点续传

## 各步骤环境坑点

### Step 1：主机准备
- **坑**：宿主机 gcc 版本过低 → 交叉编译器编译失败
- **验证**：`gcc --version`、`ldd --version`、`make --version` 输出符合 LFS 最低要求
- **坑**：`/mnt/lfs` 权限不正确 → 后续步骤全部失败
- **验证**：`ls -ld /mnt/lfs` 确认构建用户有 rw 权限

### Step 2：交叉工具链
- **坑**：`-march` 值错误 → 编译出的工具链在目标 CPU 上无法运行
- **避坑**：搜索 "<CPU型号> best -march value" + "<CPU型号> -march known issues"
- **坑**：LTO 与当前 GCC 版本不兼容 → 链接失败
- **避坑**：搜索 "GCC <version> LTO known issues"
- **验证**：交叉编译器能编译并运行 hello world 测试程序
- **注意**：此步耗时最长，必须后台跑

### Step 3：Chroot 工具
- **坑**：chroot 内缺少必要文件（/dev、/proc、/sys 未挂载）→ 编译失败
- **避坑**：进入 chroot 前挂载 /dev、/proc、/sys
- **坑**：chroot 内无网络 → 尝试下载会失败
- **避坑**：所有源码提前下载到 chroot 外
- **验证**：chroot 内 `gcc`、`ld`、`bash` 可正常运行
- **坑**：glibc 版本与交叉编译器不匹配 → 运行时错误
- **避坑**：搜索 "glibc <version> compatibility issues"

### Step 4：基础系统（~50 包）
- **坑**：构建顺序错误 → 依赖缺失
- **避坑**：严格按 LFS 指定顺序，不可乱序
- **坑**：某包版本有已知 bug → 编译失败或运行时问题
- **避坑**：每包前搜索 "<包名> <版本> known issues"
- **坑**：CFLAGS 参数不当 → 编译失败或性能下降
- **避坑**：搜索 "<包名> best compile flags <year>"
- **验证**：每包编译后运行 `make check`（如适用）+ 基本功能测试
- **注意**：50 包逐个编译，总耗时 2-3 小时

### Step 5：内核 + 引导加载器
- **坑**：内核配置错误 → 无法启动（黑屏/卡 logo）
- **避坑**：搜索 "Linux <version> best kernel config for <硬件>" + "Linux <version> kernel known issues"
- **坑**：GPU 驱动模块缺失 → 无显示输出
- **避坑**：NVIDIA 需专有驱动（联网安装），AMD/Intel 用开源驱动
- **坑**：引导加载器配置错误（UEFI vs Legacy）→ 无法引导
- **避坑**：搜索 "<主板型号> UEFI boot config"
- **验证**：内核能编译通过 + 引导加载器配置正确
- **注意**：内核配置错误是最严重的坑，必须充分搜索避坑

### Step 6：桌面体验
- **坑**：GPU 驱动与桌面环境不兼容 → 黑屏/卡顿
- **避坑**：搜索 "<桌面环境> <GPU型号> compatibility issues"
- **坑**：输入法与桌面环境冲突 → 输入法失效
- **避坑**：搜索 "<桌面环境> fcitx5 input method problems"
- **坑**：主题配置不当 → 显示异常
- **避坑**：搜索 "<桌面环境> best theme configuration"
- **验证**：桌面环境能启动 + 输入法可用 + 网络/声音正常
- **注意**：桌面环境编译耗时 1-2 小时

### Step 7：用户软件 + Windows 兼容
- **坑**：Wine + GPU 驱动不兼容 → Windows 应用无法运行
- **避坑**：搜索 "Wine <version> <GPU型号> compatibility"
- **坑**：软件版本不兼容 → 运行时报错
- **避坑**：搜索 "<软件名> <版本> known issues"
- **验证**：每个软件能正常运行
- **注意**：Wine + GPU 驱动兼容性是常见坑点

### Step 8：AI 助手
- **坑**：模型量化与内存不匹配 → 加载失败或 OOM
- **避坑**：8GB→Q4_K_M，16GB→Q5_K_M，32GB+→Q6_K
- **坑**：llama.cpp 编译参数不当 → 推理性能差
- **避坑**：搜索 "llama.cpp best build flags for <CPU>"
- **验证**：模型能加载 + 推理正常 + 响应时间可接受
- **注意**：模型下载耗时（~5.7GB），必须后台跑

### Step 9：打包 ISO
- **坑**：ISO 打包配置错误 → ISO 无法启动
- **避坑**：搜索 "live-build best ISO configuration"
- **坑**：无人值守安装配置错误 → 安装失败或卡住
- **避坑**：搜索 "unattended install best preseed config"
- **坑**：未做冒烟测试 → 交付无法启动的 ISO
- **避坑**：必须在虚拟机中启动 ISO 验证基本功能
- **验证**：ISO 能在虚拟机中启动 + 基本功能正常

## 验证方法

每步完成后必须验证产物，不可跳过：

| 步骤 | 验证内容 | 验证方法 |
|------|---------|---------|
| Step 1 | 主机工具链版本 | `gcc --version`、`ldd --version`、`make --version` |
| Step 2 | 交叉编译器功能 | 编译并运行 hello world |
| Step 3 | chroot 工具功能 | chroot 内 `gcc`、`ld`、`bash` 可运行 |
| Step 4 | 基础系统包功能 | 每包 `make check` + 基本功能测试 |
| Step 5 | 内核 + 引导 | 内核编译通过 + 引导配置正确 |
| Step 6 | 桌面环境功能 | 桌面能启动 + 输入法/网络/声音正常 |
| Step 7 | 用户软件功能 | 每个软件能正常运行 |
| Step 8 | AI 助手功能 | 模型能加载 + 推理正常 |
| Step 9 | ISO 可启动 | 虚拟机中启动 + 基本功能正常

## 安装后配置坑点（参考 archlinux 简明指南）

### GPU 驱动

| 场景 | 坑 | 避坑 |
|------|-----|------|
| NVIDIA 独立显卡 | 安装官方驱动后 initramfs 包含 nouveau 模块，冲突 | 编辑 `/etc/mkinitcpio.conf` 删除 `kms`，`mkinitcpio -P` |
| NVIDIA Turing 及更新 | `nvidia-open` 是 alpha 质量，不适用于 AMD 集显系统 | 搜索 "<GPU型号> nvidia-open known issues" |
| AMD GCN 2.0 及以下 | 不要用 AMDGPU 驱动（实验性质） | 用 ATI 开源驱动 |
| 双显卡 hybrid 模式 | 将 `__NV_PRIME_RENDER_OFFLOAD` 加到全局环境 → 黑屏 | 用 `prime-run <command>` 前缀 |
| 双显卡电源管理 | 上来就装 Bbswitch → 某些硬件黑屏 | 按 optimus-manager 文档一步步尝试 |

### 安全配置

| 场景 | 坑 | 避坑 |
|------|-----|------|
| LUKS 加密 | 加密 EFI 分区 → 无法启动 | 严禁加密 EFI 分区 |
| LUKS + TPM | 部分电脑（Intel NUC）导入后无法自动解锁 | 进固件禁用再启用 TPM |
| Secure Boot | `enroll-keys` 可能导致变砖（OpROM 带微软签名） | 双系统用 `enroll-keys -m` |
| fscrypt | 删除 `.fscrypt` 目录 → 永远无法解密 | 严禁删除 |

### 功耗控制

| 场景 | 坑 | 避坑 |
|------|-----|------|
| 电压下探 | 可能损坏硬件（逆向工程方法） | 从 50mV 开始，每次加 10mV，烤机测试 |
| 功率墙 | `package power limit is locked` = 不可调 | 先检查 `intel-rapl` 的 `enabled` 值 |
| TLP | 与 `systemd-rfkill` 冲突 | `systemctl mask systemd-rfkill.service systemd-rfkill.socket` |

### 文件系统（Btrfs）

| 场景 | 坑 | 避坑 |
|------|-----|------|
| Timeshift 恢复后无法挂载目录 | 子卷 ID 变更 | fstab 中删除 `subvolid=xxx`，改为名称指定 |
| Timeshift 恢复后无法挂载 boot | 内核版本不一致 | chroot 后重新安装/更新内核包 |
| 定时任务不生效 | `cron` 服务未启动 | `systemctl enable --now cronie.service` |

### 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 系统没有声音 | PipeWire/ALSA 未安装 | 安装 `pipewire-pulse pipewire-alsa pipewire-jack` |
| NVIDIA 笔记本只有 HDMI 音频 | sof 驱动问题 | 内核启动参数加 `snd_hda_intel.dmic_detect=0` |
| 关机卡住 1 分 30 秒 | 某进程不愿停止 | `DefaultTimeoutStopSec=30s` + `journalctl -p5` 排查 |
| 升级时异常 | 包管理器数据库锁未释放 | 确认无其他包管理进程后移除数据库锁文件 |
| 滚挂了 | 长时间未更新 → 依赖冲突 | 多看官网公告，勤更新 |

详细指导见 `system-setup.md`。 |
