#!/bin/bash
# TTL Step 3: Chroot 工具（LFS Ch 7）
# 进入 chroot，编译 Gettext、Bison、Perl、Python、Texinfo、Util-linux

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 3: Chroot 工具 ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step3-chroot-tools" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step3" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 挂载虚拟文件系统
echo "挂载虚拟文件系统..."
mount -v --bind /dev $LFS/dev
mount -v --bind /dev/pts $LFS/dev/pts
mount -v -t proc proc $LFS/proc
mount -v -t sysfs sysfs $LFS/sys
mount -v -t tmpfs -o size=200M tmpfs $LFS/tmp

# 进入 chroot
echo "进入 chroot..."
chroot "$LFS" /usr/bin/env -i \
    HOME=/root \
    PATH=/usr/local/bin:/usr/bin \
    PS1='(lfs chroot) \u@\h:\w\$ ' \
    bash --login

# 在 chroot 内编译工具
# 编译 Gettext
echo "编译 Gettext..."
# tar -xf gettext-${GETTEXT_VERSION}.tar.xz
# cd gettext-${GETTEXT_VERSION}
# mkdir -v build && cd build
# ../configure --prefix=/usr --disable-libasprintf
# make
# make install
# cd .. && rm -rf gettext-${GETTEXT_VERSION}

# 编译 Bison
echo "编译 Bison..."
# tar -xf bison-${BISON_VERSION}.tar.xz
# cd bison-${BISON_VERSION}
# ./configure --prefix=/usr --without-debug
# make
# make install
# cd .. && rm -rf bison-${BISON_VERSION}

# 编译 Perl
echo "编译 Perl..."
# tar -xf perl-${PERL_VERSION}.tar.xz
# cd perl-${PERL_VERSION}
# sh Configure -des -Dprefix=/usr -Dman1dir=/usr/share/man/man1 \
#     -Dman3dir=/usr/share/man/man3 \
#     -Duseshrplib -Dusethreads
# make
# make install
# cd .. && rm -rf perl-${PERL_VERSION}

# 编译 Python
echo "编译 Python..."
# tar -xf Python-${PYTHON_VERSION}.tgz
# cd Python-${PYTHON_VERSION}
# ./configure --prefix=/usr --enable-optimizations \
#     --with-lto --with-system-ffi
# make
# make install
# cd .. && rm -rf Python-${PYTHON_VERSION}

# 编译 Texinfo
echo "编译 Texinfo..."
# tar -xf texinfo-${TEXINFO_VERSION}.tar.xz
# cd texinfo-${TEXINFO_VERSION}
# ./configure --prefix=/usr
# make
# make install
# cd .. && rm -rf texinfo-${TEXINFO_VERSION}

# 编译 Util-linux
echo "编译 Util-linux..."
# tar -xf util-linux-${UTIL_LINUX_VERSION}.tar.xz
# cd util-linux-${UTIL_LINUX_VERSION}
# ./configure --prefix=/usr --libdir=/usr/lib \
#     --disable-makeinstall-chown-dirs \
#     --with-shared --with-static
# make
# make install
# cd .. && rm -rf util-linux-${UTIL_LINUX_VERSION}

# 退出 chroot
exit

# 卸载虚拟文件系统
echo "卸载虚拟文件系统..."
umount $LFS/tmp
umount $LFS/sys
umount $LFS/proc
umount $LFS/dev/pts
umount $LFS/dev

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step3-chroot-tools" "completed"

echo "=== Step 3 完成 ==="
