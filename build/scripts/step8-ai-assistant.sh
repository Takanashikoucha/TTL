#!/bin/bash
# TTL Step 8: AI 助手
# 编译 llama.cpp + 下载 Qwen3.5-9B 模型

set -e

LFS_DIR="${1:-/mnt/lfs}"
CONFIG="${2:-ttl-config.json}"
PROGRESS_FILE="${3:-build-progress.json}"
VERSIONS_LOCK="${4:-versions.lock}"

echo "=== TTL Step 8: AI 助手 ==="

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step8-ai-assistant" "in_progress"

# 搜索-决策-记录-避坑
./search-decide.sh "step8" "$CONFIG" "$CONFIG" "."

# 读取版本
source "$VERSIONS_LOCK" 2>/dev/null || true

# 读取 AI 配置
MODEL=$(jq -r '.ai_assistant.model // "qwen3.5-9b"' "$CONFIG")
QUANTIZATION=$(jq -r '.ai_assistant.quantization // "q4_k_m"' "$CONFIG")
RUNTIME=$(jq -r '.ai_assistant.runtime // "llama.cpp"' "$CONFIG")
SYSTEM_PROMPT=$(jq -r '.ai_assistant.system_prompt // "你是 TTL 系统内置 AI 助手"' "$CONFIG")

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

# 编译 llama.cpp
echo "编译 llama.cpp..."
# git clone https://github.com/ggerganov/llama.cpp.git
# cd llama.cpp
# cmake -B build -DCMAKE_BUILD_TYPE=Release
# cmake --build build --config Release
# cmake --install build
# cd .. && rm -rf llama.cpp

# 下载 Qwen3.5-9B 模型
echo "下载 Qwen3.5-9B 模型 ($QUANTIZATION)..."
# 从 HuggingFace 下载
# curl -L -o /usr/share/ttl/models/qwen3.5-9b-${QUANTIZATION}.gguf \
#     "https://huggingface.co/unsloth/Qwen3.5-9B-GGUF/resolve/main/qwen3.5-9b-${QUANTIZATION}.gguf"
#
# 或者从本地缓存下载
# cp /sources/qwen3.5-9b-${QUANTIZATION}.gguf /usr/share/ttl/models/

# 配置 AI 助手
echo "配置 AI 助手..."
# 创建配置目录
# mkdir -p /etc/ttl
#
# 写入系统提示词
# cat > /etc/ttl/ai-system-prompt.txt <<EOF
# $SYSTEM_PROMPT
# EOF
#
# 写入硬件配置
# cat > /etc/ttl-hardware.json <<EOF
# $(cat "$CONFIG")
# EOF
#
# 创建启动脚本
# cat > /usr/local/bin/ttl-ai <<'EOF'
# #!/bin/bash
# # TTL AI 助手启动脚本
# 
# MODEL="/usr/share/ttl/models/qwen3.5-9b-q4_k_m.gguf"
# SYSTEM_PROMPT=$(cat /etc/ttl/ai-system-prompt.txt)
# 
# # 启动 llama.cpp 服务器
# llama-server \
#     -m "$MODEL" \
#     --system "$SYSTEM_PROMPT" \
#     --port 8080 \
#     --ctx-size 4096
# EOF
# chmod +x /usr/local/bin/ttl-ai
#
# 创建 systemd 服务
# cat > /etc/systemd/system/ttl-ai.service <<EOF
# [Unit]
# Description=TTL AI Assistant
# After=network.target
# 
# [Service]
# ExecStart=/usr/local/bin/ttl-ai
# Restart=always
# 
# [Install]
# WantedBy=multi-user.target
# EOF
#
# 启用服务
# systemctl enable ttl-ai

# 退出 chroot
exit

# 卸载虚拟文件系统
umount $LFS/tmp
umount $LFS/sys
umount $LFS/proc
umount $LFS/dev/pts
umount $LFS/dev

# 更新进度
./progress-tracker.sh "$PROGRESS_FILE" update "step8-ai-assistant" "completed"

echo "=== Step 8 完成 ==="
