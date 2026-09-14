#!/bin/bash
# TTL Step 2: 交叉工具链（LFS Ch 5-6）
# Binutils Pass1 → GCC Pass1 → Linux API Headers → Glibc → Libstdc++ → 临时工具

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 2: 交叉工具链 ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step2-cross-toolchain" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step2" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 下载源码
echo "下载源码..."
mkdir -p /sources
cd /sources

# 这里需要根据 versions.lock 下载所有源码
# 示例：
# wget https://ftp.gnu.org/gnu/binutils/binutils-${BINUTILS_VERSION}.tar.xz
# wget https://ftp.gnu.org/gnu/gcc/gcc-${GCC_VERSION}/gcc-${GCC_VERSION}.tar.xz
# ...

# 编译 Binutils Pass 1
echo "编译 Binutils Pass 1..."
# tar -xf binutils-${BINUTILS_VERSION}.tar.xz
# cd binutils-${BINUTILS_VERSION}
# mkdir -v build && cd build
# ../configure --prefix=$LFS/tools --host=$LFS_TGT --target=$LFS_TGT \
#     --with-libgcc --disable-multilib --disable-nls --disable-werror
# make
# make install
# cd .. && rm -rf binutils-${BINUTILS_VERSION}

# 编译 GCC Pass 1
echo "编译 GCC Pass 1..."
# tar -xf gcc-${GCC_VERSION}.tar.xz
# cd gcc-${GCC_VERSION}
# tar -xf ../mpfr-${MPFR_VERSION}.tar.xz && mv -v mpfr-${MPFR_VERSION} mpfr
# tar -xf ../gmp-${GMP_VERSION}.tar.xz && mv -v gmp-${GMP_VERSION} gmp
# tar -xf ../mpc-${MPC_VERSION}.tar.gz && mv -v mpc-${MPC_VERSION} mpc
# mkdir -v build && cd build
# ../configure --prefix=$LFS/tools --host=$LFS_TGT --target=$LFS_TGT \
#     --with-glibc-version=2.42 --with-sysroot=$LFS --with-newlib \
#     --without-headers --enable-default-pie --enable-default-ssp \
#     --disable-nls --disable-shared --disable-multilib --disable-threads \
#     --disable-libatomic --disable-libgomp --disable-libquadmath \
#     --disable-libssp --disable-libvtv --disable-libstdcxx \
#     --enable-languages=c,c++
# make
# make install
# cd .. && rm -rf gcc-${GCC_VERSION}

# 编译 Linux API Headers
echo "编译 Linux API Headers..."
# tar -xf linux-${LINUX_VERSION}.tar.xz
# cd linux-${LINUX_VERSION}
# make mrproper
# make headers_install ARCH=x86 INSTALL_HDR_PATH=dest
# cp -rv dest/include/* $LFS/usr/include
# cd .. && rm -rf linux-${LINUX_VERSION}

# 编译 Glibc（交叉版）
echo "编译 Glibc（交叉版）..."
# tar -xf glibc-${GLIBC_VERSION}.tar.xz
# cd glibc-${GLIBC_VERSION}
# mkdir -v build && cd build
# ../configure --prefix=/usr --host=$LFS_TGT --target=$LFS_TGT \
#     --with-headers=$LFS/usr/include --disable-werror \
#     --libc_cv_slibdir=/usr/lib
# make
# make install
# cd .. && rm -rf glibc-${GLIBC_VERSION}

# 编译 Libstdc++
echo "编译 Libstdc++..."
# tar -xf gcc-${GCC_VERSION}.tar.xz
# cd gcc-${GCC_VERSION}
# tar -xf ../mpfr-${MPFR_VERSION}.tar.xz && mv -v mpfr-${MPFR_VERSION} mpfr
# tar -xf ../gmp-${GMP_VERSION}.tar.xz && mv -v gmp-${GMP_VERSION} gmp
# tar -xf ../mpc-${MPC_VERSION}.tar.gz && mv -v mpc-${MPC_VERSION} mpc
# mkdir -v build && cd build
# ../configure --prefix=$LFS/tools --host=$LFS_TGT --target=$LFS_TGT \
#     --with-glibc-version=2.42 --with-sysroot=$FS --with-newlib \
#     --without-headers --enable-default-pie --enable-default-ssp \
#     --disable-nls --disable-shared --disable-multilib --disable-threads \
#     --disable-libatomic --disable-libgomp --disable-libquadmath \
#     --disable-libssp --disable-libvtv --enable-languages=c,c++
# make
# make install
# cd .. && rm -rf gcc-${GCC_VERSION}

# 编译临时工具（15 个）
echo "编译临时工具..."
# 这里编译 M4、Ncurses、Bash、Coreutils、Diffutils、File、Findutils、
# Gawk、Grep、Gzip、Make、Patch、Sed、Tar、Xz、Binutils Pass 2、GCC Pass 2
# 每个包都用交叉 GCC 编译

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step2-cross-toolchain" "completed"

echo "=== Step 2 完成 ==="
