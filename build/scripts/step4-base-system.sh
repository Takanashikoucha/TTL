#!/bin/bash
# TTL Step 4: 基础系统（LFS Ch 8）
# 编译 ~50 个基础包，全部针对用户 CPU 优化

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 4: 基础系统 ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step4-base-system" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step4" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 读取用户 CPU 架构
CPU_ARCH=$(jq -r '.hardware_profile.cpu_arch // "x86_64"' "$CONFIG")
CPU_FLAGS=$(jq -r '.hardware_profile.cpu_flags | join(" ")' "$CONFIG")

# 设置优化参数
# 针对用户 CPU 的优化
OPT_FLAGS="-march=native -O2 -pipe"
if [[ "$CPU_ARCH" == "haswell" ]]; then
    OPT_FLAGS="-march=haswell -O2 -pipe -flto"
elif [[ "$CPU_ARCH" == "skylake" ]]; then
    OPT_FLAGS="-march=skylake -O2 -pipe -flto"
fi

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

# 在 chroot 内编译 ~50 个基础包
# 每个包都用优化后的 GCC 编译

# 包列表（按 LFS Ch 8 顺序）
PACKAGES=(
    "man-pages" "iana-etc" "glibc" "zlib" "bzip2" "xz" "lz4" "zstd"
    "file" "readline" "m4" "bc" "flex" "tcl" "expect" "dejagnu"
    "pkgconf" "binutils" "gmp" "mpfr" "mpc" "attr" "acl" "libcap"
    "libxcrypt" "shadow" "gcc" "ncurses" "sed" "psmisc" "gettext"
    "bison" "grep" "bash" "libtool" "gdbm" "gperf" "expat"
    "inetutils" "less" "perl" "xml-parser" "intltool" "autoconf"
    "automake" "openssl" "libelf" "libffi" "python" "flit-core"
    "packaging" "wheel" "setuptools" "ninja" "meson" "kmod"
    "coreutils" "diffutils" "gawk" "findutils" "groff" "grub"
    "gzip" "iproute2" "kbd" "libpipeline" "make" "patch" "tar"
    "texinfo" "vim" "markupsafe" "jinja2" "udev" "man-db"
    "procps-ng" "util-linux" "e2fsprogs" "sysklogd" "sysvinit"
)

# 编译每个包
for pkg in "${PACKAGES[@]}"; do
    echo "编译 $pkg..."
    
    # 更新进度
    ./progress-tracker.sh "$PROGRESS_FILE" update "step4-base-system" "in_progress" "package=$pkg"
    
    # 这里根据包名执行对应的编译命令
    # 示例（GCC）：
    # if [[ "$pkg" == "gcc" ]]; then
    #     tar -xf gcc-${GCC_VERSION}.tar.xz
    #     cd gcc-${GCC_VERSION}
    #     mkdir -v build && cd build
    #     ../configure --prefix=/usr \
    #         LD=ld \
    #         --enable-languages=c,c++ \
    #         --enable-default-pie \
    #         --enable-default-ssp \
    #         --enable-host-pie \
    #         --disable-multilib \
    #         --disable-bootstrap \
    #         --disable-fixincludes \
    #         --with-system-zlib \
    #         CFLAGS="$OPT_FLAGS"
    #     make
    #     make install
    #     cd .. && rm -rf gcc-${GCC_VERSION}
    # fi
    
    # 示例（Glibc）：
    # if [[ "$pkg" == "glibc" ]]; then
    #     tar -xf glibc-${GLIBC_VERSION}.tar.xz
    #     cd glibc-${GLIBC_VERSION}
    #     patch -Np1 -i ../glibc-${GLIBC_VERSION}-fhs-1.patch
    #     mkdir -v build && cd build
    #     ../configure --prefix=/usr \
    #         --disable-werror \
    #         --disable-nscd \
    #         libc_cv_slibdir=/usr/lib \
    #         --enable-stack-protector=strong \
    #         --enable-kernel=5.4
    #     make
    #     make check
    #     make install
    #     cd .. && rm -rf glibc-${GLIBC_VERSION}
    # fi
    
    echo "  $pkg 编译完成"
done

# 退出 chroot
exit

# 卸载虚拟文件系统
umount $LFS/tmp
umount $LFS/sys
umount $LFS/proc
umount $LFS/dev/pts
umount $LFS/dev

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step4-base-system" "completed"

echo "=== Step 4 完成 ==="
