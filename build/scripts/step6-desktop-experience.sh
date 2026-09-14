#!/bin/bash
# TTL Step 6: 桌面体验
# 桌面环境 + 美化 + 输入法 + 网络 + 声音

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 6: 桌面体验 ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step6-desktop-experience" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step6" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 读取用户配置
DESKTOP=$(jq -r '.desktop // "xfce"' "$CONFIG")
ICON_THEME=$(jq -r '.desktop_theme.icon_theme // "yaru"' "$CONFIG")
CURSOR_THEME=$(jq -r '.desktop_theme.cursor_theme // "adwaita"' "$CONFIG")
WALLPAPER=$(jq -r '.desktop_theme.wallpaper // "auto_select"' "$CONFIG")
FONTS=$(jq -r '.desktop_theme.fonts | join(" ")' "$CONFIG")
INPUT_FRAMEWORK=$(jq -r '.input_method.framework // "fcitx5"' "$CONFIG")
IM_LIST=$(jq -r '.input_method.im_list | join(" ")' "$CONFIG")

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

# 编译桌面环境
echo "编译桌面环境: $DESKTOP..."
# 根据 DESKTOP 变量编译对应的桌面环境
# XFCE:
#   tar -xf xfce4-${XFCE4_VERSION}.tar.xz
#   cd xfce4-${XFCE4_VERSION}
#   ./configure --prefix=/usr
#   make
#   make install
#
# GNOME:
#   tar -xf gnome-${GNOME_VERSION}.tar.xz
#   cd gnome-${GNOME_VERSION}
#   ./configure --prefix=/usr
#   make
#   make install
#
# KDE:
#   tar -xf kde-plasma-${KDE_VERSION}.tar.xz
#   cd kde-plasma-${KDE_VERSION}
#   ./configure --prefix=/usr
#   make
#   make install
#
# i3:
#   tar -xf i3-wm-${I3_VERSION}.tar.xz
#   cd i3-wm-${I3_VERSION}
#   ./configure --prefix=/usr
#   make
#   make install

# 配置桌面美化
echo "配置桌面美化..."
# 图标主题
# apt install $ICON_THEME  # 或从源码编译
#
# 光标主题
# apt install $CURSOR_THEME
#
# 壁纸
# if [[ "$WALLPAPER" == "auto_select" ]]; then
#     # 自动选择壁纸
#     curl -o /usr/share/backgrounds/wallpaper.jpg "https://picsum.photos/1920/1080"
# else
#     curl -o /usr/share/backgrounds/wallpaper.jpg "$WALLPAPER"
# fi
#
# 字体
# for font in $FONTS; do
#     apt install fonts-$font
# done
#
# 字体渲染优化
# cat > /etc/fonts/local.conf <<EOF
# <?xml version="1.0"?>
# <!DOCTYPE fontconfig SYSTEM "fonts.dtd">
# <fontconfig>
#     <match target="font">
#         <edit name="antialias" mode="assign">
#             <bool>true</bool>
#         </edit>
#         <edit name="hinting" mode="assign">
#             <bool>true</bool>
#         </edit>
#         <edit name="hintstyle" mode="assign">
#             <const>hintslight</const>
#         </edit>
#     </match>
# </fontconfig>
# EOF

# 配置输入法
echo "配置输入法: $INPUT_FRAMEWORK..."
# 编译 fcitx5
# tar -xf fcitx5-${FCITX5_VERSION}.tar.xz
# cd fcitx5-${FCITX5_VERSION}
# ./configure --prefix=/usr
# make
# make install
#
# 编译 rime
# tar -xf rime-${RIME_VERSION}.tar.xz
# cd rime-${RIME_VERSION}
# ./configure --prefix=/usr
# make
# make install
#
# 配置输入法
# for im in $IM_LIST; do
#     # 启用输入法
#     fcitx5-configtool --enable $im
# done
#
# 设置默认输入法
# echo "export GTK_IM_MODULE=fcitx5" >> /etc/profile
# echo "export QT_IM_MODULE=fcitx5" >> /etc/profile
# echo "export XMODIFIERS=@im=fcitx5" >> /etc/profile

# 配置网络
echo "配置网络..."
# 编译 NetworkManager
# tar -xf networkmanager-${NM_VERSION}.tar.xz
# cd networkmanager-${NM_VERSION}
# ./configure --prefix=/usr
# make
# make install
#
# 编译 BlueZ
# tar -xf bluez-${BLUEZ_VERSION}.tar.xz
# cd bluez-${BLUEZ_VERSION}
# ./configure --prefix=/usr
# make
# make install
#
# 编译 CUPS
# tar -xf cups-${CUPS_VERSION}.tar.xz
# cd cups-${CUPS_VERSION}
# ./configure --prefix=/usr
# make
# make install
#
# 启用服务
# systemctl enable NetworkManager
# systemctl enable bluetooth
# systemctl enable cups

# 配置声音
echo "配置声音..."
# 编译 PipeWire
# tar -xf pipewire-${PIPEWIRE_VERSION}.tar.xz
# cd pipewire-${PIPEWIRE_VERSION}
# ./configure --prefix=/usr
# make
# make install
#
# 启用服务
# systemctl enable pipewire
# systemctl enable wireplumber

# 配置显示管理器
echo "配置显示管理器..."
# 根据桌面环境选择显示管理器
# XFCE → LightDM
# GNOME → GDM
# KDE → SDDM
# i3 → 无（直接启动）

# 退出 chroot
exit

# 卸载虚拟文件系统
umount $LFS/tmp
umount $LFS/sys
umount $LFS/proc
umount $LFS/dev/pts
umount $LFS/dev

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step6-desktop-experience" "completed"

echo "=== Step 6 完成 ==="
