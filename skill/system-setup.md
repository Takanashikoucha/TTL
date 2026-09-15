# 安装后系统配置指导

本文件指导 agent 在构建完成后、用户实际安装后，帮用户完成系统配置。内容参考 archlinux 简明指南（https://arch.icekylin.online/guide/），适配 TTL 的 LFS + BLFS 构建路线。

## 适用场景

- 用户用 TTL ISO 安装完系统后，需要配置显卡驱动、安全、功耗等
- 内嵌 AI 助手帮用户排查故障、建议优化
- 用户日常使用中的常见问题排查

## 显卡驱动

### 驱动选择原则

- **AMD 显卡**：一律使用开源驱动（AMDGPU / ATI）
- **NVIDIA 显卡**：使用闭源驱动（nvidia / nvidia-open）
- **双显卡（集显 + 独显）**：先装各自驱动，再用 optimus-manager 切换

### NVIDIA 独立显卡

按 GPU 架构选择驱动：

| GPU 架构 | 驱动 | 说明 |
|----------|------|------|
| Turing (TUXXX) 及更新 | `nvidia-open` | 开源驱动，alpha 质量，不适用于 AMD 集显系统 |
| 其他新型号 | `nvidia` | 闭源驱动 |
| GeForce 630 以下 ~ 400 系列 | `nvidia-390xx-dkms` | 老卡专用 |
| 更老 | `xf86-video-nouveau` | 开源驱动 |

**关键坑**：安装 NVIDIA 官方驱动后，必须编辑 `/etc/mkinitcpio.conf`，在 `HOOKS` 行删除 `kms`，然后 `mkinitcpio -P` 重新生成镜像。否则 initramfs 包含 nouveau 模块，与官方驱动冲突。

**首次启动联网安装**（TTL 构建中 NVIDIA 驱动不内置）：
1. 联网
2. 安装驱动包
3. 编辑 mkinitcpio.conf 删除 kms
4. mkinitcpio -P
5. 重启

### AMD 独立/集成显卡

先查 GPU 架构（TECHPOWERUP），再选驱动：

| GPU 架构 | 驱动 |
|----------|------|
| GCN 4 及之后 | AMDGPU（开源） |
| GCN 3 | AMDGPU |
| GCN 2 及以下 | ATI（开源） |

**关键坑**：GCN 2.0 及以下不要用 AMDGPU 驱动（实验性质，需自定义内核配置）。

### 双显卡（集显 + 独显）

1. 先按上述步骤装各自驱动
2. 安装 `optimus-manager` + `optimus-manager-qt`
3. `systemctl enable optimus-manager.service`
4. 重启后在菜单栏切换

**hybrid 动态切换**：
- 用 `prime-run <command>` 以独显运行程序
- 不要将 `__NV_PRIME_RENDER_OFFLOAD` 等环境变量加到全局环境（会黑屏）

**电源管理**：
- 最广泛适用的是 Bbswitch
- 不建议上来就装，某些硬件会黑屏
- 按 optimus-manager 官方文档一步步尝试

### 性能测试

- `glxgears`：简单 OpenGL 测试
- `glmark2`：更全面的 GPU 基准测试
- Unigine（valley / heaven / superposition）：最全面

## 安全配置

### 磁盘加密（LUKS）

**适用**：全新安装时（TTL 无人值守安装可配置）

1. `cryptsetup luksFormat --type luks2 /dev/<分区>`
2. `cryptsetup open /dev/<分区> cryptlvm`
3. LVM 逻辑卷（可选）
4. 格式化 + 挂载

**关键坑**：严禁加密 EFI 分区，否则无法启动。

**TPM 自动解锁**（可选）：
1. 安装 `tpm2-tools tpm2-tss`
2. 重新安装内核生成 initramfs
3. `systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs="0+1+2+3+4+5+7+13" /dev/<分区>`
4. 重启后无需输入密码

**关键坑**：PCR7 是强制要求。部分电脑（如 Intel NUC）导入后无法自动解锁，需进固件禁用再启用 TPM。

### 安全启动（Secure Boot）

**前提**：UEFI + Secure Boot 支持 + 关闭 CSM + 支持导入自定义密钥

1. 备份原密钥（`efi-readvar`）
2. 进固件设置 Setup Mode
3. 安装 `sbctl`，`sbctl create-keys`
4. 重装 GRUB（`--disable-shim-lock`）
5. `sbctl sign` 签名引导文件
6. `sbctl verify` 检查
7. （可选）导入 DBX 密钥
8. `sbctl enroll-keys`（双系统用 `-m`）
9. 进固件开启 Secure Boot

**关键坑**：
- `enroll-keys` 可能导致变砖（OpROM 带微软签名验证）
- 双系统用 `enroll-keys -m` 导入微软密钥
- 导入微软密钥后建议更新 DBX（`fwupd`）

### 文件级加密（fscrypt，/home）

**适用**：EXT4 / F2FS / UBIFS（Btrfs 需单独分区）

1. 安装 `fscrypt`
2. `fscrypt setup`
3. 配置 PAM 模块（`/etc/pam.d/system-login` + `/etc/pam.d/passwd`）
4. `fscrypt encrypt /home/<用户> --user=<用户>`
5. 退出重新登录验证

**关键坑**：严禁删除 `.fscrypt` 目录，否则永远无法解密。

## 功耗控制

### TLP（推荐，笔记本必装）

1. 安装 `tlp tlp-rdw`
2. `systemctl enable tlp.service NetworkManager-dispatcher.service`
3. `systemctl mask systemd-rfkill.service systemd-rfkill.socket`（避免冲突）
4. `tlp start` 手动启动

**查看信息**：
- `tlp-stat -b`：电池
- `tlp-stat -d`：磁盘
- `tlp-stat -g`：GPU
- `tlp-stat -p`：CPU

### 电压下探（Intel Haswell 及更新）

1. 安装 `intel-undervolt`
2. 编辑 `/etc/intel-undervolt.conf`（只调 CPU 核心电压 + 缓存电压）
3. `intel-undervolt apply` + `intel-undervolt read` 验证
4. 烤机测试（`s-tui`）
5. `systemctl enable --now intel-undervolt`

**关键坑**：可能损坏硬件（逆向工程方法），风险自负。从 50mV 开始，每次加 10mV。

### 降低功率墙（TDP）

1. 检查是否可调：`grep . /sys/class/powercap/intel-rapl/intel-rapl:0/*`
2. `enabled:1` 表示可调
3. 调整 `constraint_0_power_limit_uw`

**关键坑**：`package power limit is locked` = 不可调。

## 文件系统

### Btrfs（推荐）

**特性**：
- 写时复制（CoW）
- 透明压缩
- 快照 + 克隆
- SSD 优化
- 多设备管理

**常用操作**：
- 创建子卷：`btrfs subvolume create /path/<子卷名>`
- 创建快照：`btrfs subvolume snapshot /path/<源> /path/<快照>`
- 列出子卷：`btrfs subvolume list /path`
- 查看使用：`btrfs filesystem df /path`

**Timeshift 快照恢复**：
- 能进桌面：打开 Timeshift 选择快照还原
- 不能进桌面：`Ctrl+Alt+F2` 进 tty，`timeshift --restore --snapshot '<快照名>' --skip-grub`
- 不能进系统：Live CD 还原

**关键坑**：
- 恢复后无法挂载目录：fstab 中删除 `subvolid=xxx`，改为名称指定
- 恢复后无法挂载 boot：内核版本不一致 → chroot 后重新安装/更新内核包

## 故障排查

### 系统没有声音

1. 安装 `pipewire-pulse pipewire-alsa pipewire-jack`
2. 或安装 `alsa-utils pulseaudio pavucontrol`
3. 重启
4. NVIDIA 笔记本 `aplay -l` 只有 HDMI：内核启动参数加 `snd_hda_intel.dmic_detect=0`

### 键盘没有反应

- 联想小新 Pro14 / YOGA 14s 2021：BIOS 固件 ActiveHigh 写为 ActiveLow
- 部分主板 6.5+ 内核已修复，部分需修改 DSDT

### 关机卡住

1. 编辑 `/etc/systemd/system.conf`，`DefaultTimeoutStopSec=30s`
2. `systemctl daemon-reload`
3. 排查：`journalctl -p5` 搜索 `Killing` 关键字

### 软件包降级

1. 安装 `downgrade`
2. `downgrade <包名>`，选择版本

### 升级时异常

- 包管理器数据库锁未释放 → 确认无其他包管理进程后，移除数据库锁文件

### 滚挂了

- 长时间未更新 → 依赖冲突
- 修复：查看发行版公告，按公告步骤逐步修复；必要时回滚快照

## 内嵌 AI 助手职责

TTL 构建的内嵌 AI 助手应：

1. **解答 Linux 使用问题**（面向新手，通俗语言）
2. **根据硬件主动建议性能优化**（TLP / 电压下探 / 功率墙）
3. **帮助排查故障**（声音 / 键盘 / 关机 / 包管理）
4. **推荐适合场景的软件**
5. **定期扫描系统，发现可优化项并主动建议**

AI 应了解这台电脑的完整配置（从系统配置文件读取），所有建议都针对这台具体设备。

## 参考

- archlinux 简明指南：https://arch.icekylin.online/guide/
- Arch Wiki：https://wiki.archlinux.org/
- TLP 官方文档：https://linrunner.de/tlp/settings/index.html
- optimus-manager 文档：https://github.com/Askannz/optimus-manager/wiki
- sbctl：https://wiki.archlinux.org/title/Secure_Boot
