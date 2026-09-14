#!/bin/bash
# TTL Step 7: 用户软件 + Wine
# 编译用户选择的软件 + Wine 9 + WinApps

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 7: 用户软件 + Wine ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step7-user-apps" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step7" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 读取用户软件配置
CORE_PACKAGES=$(jq -r '.packages.core | join(" ")' "$CONFIG")
DEV_PACKAGES=$(jq -r '.packages.dev | join(" ")' "$CONFIG")
EXTRA_PACKAGES=$(jq -r '.packages.extra | join(" ")' "$CONFIG")
WINE_VERSION=$(jq -r '.windows_compat.wine_version // "9.0"' "$CONFIG")
WINAPPS=$(jq -r '.windows_compat.winapps // true' "$CONFIG")
WIN_APPS=$(jq -r '.windows_compat.preinstalled_apps | join(" ")' "$CONFIG")

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

# 编译核心软件
echo "编译核心软件..."
# for pkg in $CORE_PACKAGES; do
#     # 根据包名执行对应的编译命令
#     # 示例（Firefox）：
#     if [[ "$pkg" == "firefox" ]]; then
#         tar -xf firefox-${FIREFOX_VERSION}.tar.xz
#         cd firefox-${FIREFOX_VERSION}
#         ./configure --prefix=/usr
#         make
#         make install
#         cd .. && rm -rf firefox-${FIREFOX_VERSION}
#     fi
#     # 示例（VLC）：
#     if [[ "$pkg" == "vlc" ]]; then
#         tar -xf vlc-${VLC_VERSION}.tar.xz
#         cd vlc-${VLC_VERSION}
#         ./configure --prefix=/usr
#         make
#         make install
#         cd .. && rm -rf vlc-${VLC_VERSION}
#     fi
# done

# 编译开发软件
echo "编译开发软件..."
# for pkg in $DEV_PACKAGES; do
#     # 根据包名执行对应的编译命令
# done

# 编译额外软件
echo "编译额外软件..."
# for pkg in $EXTRA_PACKAGES; do
#     # 根据包名执行对应的编译命令
# done

# 编译 Wine
echo "编译 Wine $WINE_VERSION..."
# tar -xf wine-${WINE_VERSION}.tar.xz
# cd wine-${WINE_VERSION}
# ./configure --prefix=/usr
# make
# make install
# cd .. && rm -rf wine-${WINE_VERSION}

# 配置 Wine
echo "配置 Wine..."
# 设置 Wine 前缀
# export WINEPREFIX=~/.wine
# wineboot
#
# 配置 GPU 加速
# 根据用户 GPU 类型配置
# if [[ "$GPU_DRIVER" == "nvidia" ]]; then
#     # NVIDIA 配置
#     echo "export WINEVIDEO=direct3d" >> ~/.bashrc
# elif [[ "$GPU_DRIVER" == "amd" ]]; then
#     # AMD 配置
#     echo "export WINEVIDEO=vulkan" >> ~/.bashrc
# fi

# 编译 WinApps
if [[ "$WINAPPS" == "true" ]]; then
    echo "编译 WinApps..."
    # tar -xf winapps-${WINAPPS_VERSION}.tar.xz
    # cd winapps-${WINAPPS_VERSION}
    # ./configure --prefix=/usr
    # make
    # make install
    # cd .. && rm -rf winapps-${WINAPPS_VERSION}
    
    # 预装 Windows 应用
    # for app in $WIN_APPS; do
    #     # 根据应用名执行对应的安装命令
    # done
fi

# 退出 chroot
exit

# 卸载虚拟文件系统
umount $LFS/tmp
umount $LFS/sys
umount $LFS/proc
umount $LFS/dev/pts
umount $LFS/dev

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step7-user-apps" "completed"

echo "=== Step 7 完成 ==="
