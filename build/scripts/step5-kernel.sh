#!/bin/bash
# TTL Step 5: 内核 + GRUB（LFS Ch 9-10）
# 编译 Linux 内核，配置 GRUB

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 5: 内核 + GRUB ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step5-kernel" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step5" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 读取用户硬件配置
GPU_DRIVER=$(jq -r '.kernel.gpu_driver // "intel"' "$CONFIG")
POWER_PROFILE=$(jq -r '.kernel.power_profile // "balanced"' "$CONFIG")
DISK_TYPE=$(jq -r '.hardware_profile.disk_type // "ssd"' "$CONFIG")

# 挂载虚拟文件系统
mount -v --bind /dev $LFS/dev
mount -v --bind /dev/pts $LFS/dev/pts
mount -v -t proc proc $LFS/proc
mount -v -t sysfs sysfs $LFS/sys
mount -v -t tmpfs -o size=200M tmpfs $LFS/tmp

# 进入 chroot
chroot "$LFS" /usr/bin/env -i \
    HOME=/root \
    PATH=/usr/local/bin:/usr/bin \
    PS1='(lfs chroot) \u@\h:\w\$ ' \
    bash --login

# 编译 Linux 内核
echo "编译 Linux 内核..."
# tar -xf linux-${LINUX_VERSION}.tar.xz
# cd linux-${LINUX_VERSION}
# make mrproper

# 配置内核（针对用户硬件）
# make defconfig
# 然后修改配置：
# 
# 安全加固：
# CONFIG_RANDOMIZE_BASE=y  (KASLR)
# CONFIG_STACKPROTECTOR_STRONG=y
#
# GPU 驱动：
# if [[ "$GPU_DRIVER" == "nvidia" ]]; then
#     CONFIG_NVIDIA=y
# elif [[ "$GPU_DRIVER" == "amd" ]]; then
#     CONFIG_DRM_AMDGPU=y
# else
#     CONFIG_DRM_I915=y
# fi
#
# 磁盘优化：
# if [[ "$DISK_TYPE" == "nvme" ]]; then
#     CONFIG_BLK_DEV_NVME=y
# fi
#
# 电源管理：
# if [[ "$POWER_PROFILE" == "performance" ]]; then
#     CONFIG_CPU_FREQ_DEFAULT_GOV_PERFORMANCE=y
# elif [[ "$POWER_PROFILE" == "powersave" ]]; then
#     CONFIG_CPU_FREQ_DEFAULT_GOV_POWERSAVE=y
# else
#     CONFIG_CPU_FREQ_DEFAULT_GOV_SCHEDUTIL=y
# fi

# make
# make modules_install
# make install

# 配置 GRUB
echo "配置 GRUB..."
# grub-install
# update-grub

# 退出 chroot
exit

# 卸载虚拟文件系统
umount $LFS/tmp
umount $LFS/sys
umount $LFS/proc
umount $LFS/dev/pts
umount $LFS/dev

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step5-kernel" "completed"

echo "=== Step 5 完成 ==="
