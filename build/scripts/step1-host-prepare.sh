#!/bin/bash
# TTL Step 1: 主机准备（LFS Ch 2-4）
# 创建 LFS 目录布局、添加 lfs 用户、设置环境变量

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"

echo "=== TTL Step 1: 主机准备 ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step1-host-prepare" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step1" "$CONFIG" "$CONFIG" "."

# 创建 LFS 目录
echo "创建 LFS 目录: $LFS_DIR"
mkdir -p "$LFS_DIR"

# 创建目录布局
echo "创建目录布局..."
cd "$LFS_DIR"
mkdir -p {apps,bin,etc,home,lib,lib64,man,media,mnt,opt,root,sbin,srv,sys,usr,var}
mkdir -p usr/{bin,include,lib,lib64,local,share,src}
mkdir -p var/{log,mail,run,spool,tmp}
mkdir -p etc/{init.d,logrotate.d,rc.d}
mkdir -p sys/{dev,fs,proc}

# 添加 lfs 用户
echo "添加 lfs 用户..."
if ! id lfs &>/dev/null; then
    useradd -d $LFS_DIR -m -g users -G audio,cdrom,dip,fax,video \
        -s /bin/bash -c "LFS build account" lfs
fi

# 设置环境变量
echo "设置环境变量..."
cat >> /etc/profile.d/lfs.sh <<EOF
export LFS=$LFS_DIR
export LFS_TGT=x86_64-lfs-linux-gnu
export LC_ALL=en_US.UTF-8
export PATH=$LFS/tools/bin:$PATH
export LDFLAGS="-L$LFS/usr/lib -Wl,-rpath,\$LFS/usr/lib"
export CPPFLAGS="-I$LFS/usr/include"
export CFLAGS="-march=native -O2 -pipe"
EOF

# 设置 umask
echo "设置 umask..."
umask 022

# 验证
echo "验证目录布局..."
ls -la "$LFS_DIR"

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step1-host-prepare" "completed"

echo "=== Step 1 完成 ==="
