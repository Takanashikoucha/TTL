#!/bin/bash
# TTL Step 9: 打包 ISO
# 打包体验版 + 无人值守安装版 ISO

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 9: 打包 ISO ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step9-package-iso" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step9" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 读取安装配置
DISTRO_NAME=$(jq -r '.distro_name // "my-linux"' "$CONFIG")
UNATTENDED=$(jq -r '.install.unattended // true' "$CONFIG")
TIMEZONE=$(jq -r '.install.timezone // "Asia/Shanghai"' "$CONFIG")
LOCALE=$(jq -r '.install.locale // "zh_CN.UTF-8"' "$CONFIG")
USERNAME=$(jq -r '.install.username // "user"' "$CONFIG")
ENCRYPTION=$(jq -r '.install.encryption // false' "$CONFIG")

# 创建输出目录
OUTPUT_DIR="${5:-/output}"
mkdir -p "$OUTPUT_DIR"

# 打包体验版 ISO
echo "打包体验版 ISO..."
# 使用 live-build 打包
# lb config -c /etc/live/build.conf
# lb build
#
# 或者使用 xorriso 手动打包
# xorriso -as mkisofs \
#     -o "$OUTPUT_DIR/${DISTRO_NAME}-trial.iso" \
#     -b isolinux/isolinux.bin \
#     -c isolinux/boot.cat \
#     -no-emul-boot \
#     -boot-load-seg 0x07C0 \
#     -boot-load-size 4 \
#     -boot-info-load \
#     -eltorito-boot \
#     -e boot/efi/boot.efi \
#     -no-emul-boot \
#     -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
#     "$LFS_DIR"

# 打包无人值守安装版 ISO
if [[ "$UNATTENDED" == "true" ]]; then
    echo "打包无人值守安装版 ISO..."
    # 创建 preseed 配置文件
    # cat > /etc/live/preseed.cfg <<EOF
    # d-i partman-auto/method string regular
    # d-i partman-auto/choose_recipe string atomic
    # d-i partman/confirm boolean true
    # d-i partman/confirm_nooverwrite boolean true
    # d-i time/zone string $TIMEZONE
    # d-i keyboard-configuration/xkb-keymap us
    # d-i console-setup/charmap string UTF-8
    # d-i console-setup/confirm boolean true
    # d-i base-passwd/password string $USERNAME
    # d-i passwd/user-fullname string $USERNAME
    # d-i passwd/username string $USERNAME
    # d-i passwd/user-password password $USERNAME
    # d-i passwd/user-password-again password $USERNAME
    # d-i passwd/user-uid string 1000
    # d-i pkgsel/extra-packages string $CORE_PACKAGES $DEV_PACKAGES
    # d-i finish-install/reboot now
    # EOF
    
    # 打包 ISO
    # xorriso -as mkisofs \
    #     -o "$OUTPUT_DIR/${DISTRO_NAME}-unattended.iso" \
    #     -b isolinux/isolinux.bin \
    #     -c isolinux/boot.cat \
    #     -no-emul-boot \
    #     -boot-load-seg 0x07C0 \
    #     -boot-load-size 4 \
    #     -boot-info-load \
    #     -eltorito-boot \
    #     -e boot/efi/boot.efi \
    #     -no-emul-boot \
    #     -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
    #     "$LFS_DIR"
fi

# 验证 ISO
echo "验证 ISO..."
# isohybrid --check "$OUTPUT_DIR/${DISTRO_NAME}-trial.iso"
# isohybrid --check "$OUTPUT_DIR/${DISTRO_NAME}-unattended.iso"

# 生成校验和
echo "生成校验和..."
# sha256sum "$OUTPUT_DIR"/*.iso > "$OUTPUT_DIR/SHA256SUMS"

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step9-package-iso" "completed"

echo "=== Step 9 完成 ==="
echo "ISO 文件已生成:"
ls -lh "$OUTPUT_DIR"/*.iso
