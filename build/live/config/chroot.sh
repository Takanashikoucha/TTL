#!/bin/bash
# chroot 脚本
# 在 chroot 内执行，配置 TTL 系统

set -e

# 写入硬件配置
cat > /etc/ttl-hardware.json <<EOF
$(cat /live/config/ttl-config.json 2>/dev/null || echo '{}')
EOF

# 写入 AI 系统提示词
cat > /etc/ttl/ai-system-prompt.txt <<EOF
你是 TTL 系统内置 AI 助手，核心理念是"开箱即用 × 极致特化"。
帮助用户解答 Linux 使用问题，根据用户硬件主动建议性能优化方案，
帮助排查故障，推荐适合用户场景的软件。
EOF

# 配置 AI 助手
cat > /usr/local/bin/ttl-ai <<'EOF'
#!/bin/bash
# TTL AI 助手启动脚本

MODEL="/usr/share/ttl/models/qwen3.5-9b-q4_k_m.gguf"
SYSTEM_PROMPT=$(cat /etc/ttl/ai-system-prompt.txt)

# 启动 llama.cpp 服务器
llama-server \
    -m "$MODEL" \
    --system "$SYSTEM_PROMPT" \
    --port 8080 \
    --ctx-size 4096
EOF
chmod +x /usr/local/bin/ttl-ai

# 配置 systemd 服务
cat > /etc/systemd/system/ttl-ai.service <<EOF
[Unit]
Description=TTL AI Assistant
After=network.target

[Service]
ExecStart=/usr/local/bin/ttl-ai
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
systemctl enable ttl-ai

# 配置桌面美化
# 图标主题
# 光标主题
# 壁纸
# 字体

# 配置输入法
# fcitx5 + Rime

# 配置网络
# NetworkManager
# BlueZ
# CUPS

# 配置声音
# PipeWire

echo "TTL 系统配置完成"
