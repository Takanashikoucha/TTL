#!/bin/bash
# TTL 环境探查脚本
# 在用户电脑上运行，收集硬件信息
# 输出：JSON 格式的探查报告

set -e

OUTPUT_FILE="${1:-probe-report.json}"

# 检测操作系统
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS $(sw_vers -productVersion 2>/dev/null || echo 'unknown')"
    elif [[ "$OSTYPE" == "linux"* ]]; then
        echo "Linux $(uname -r)"
    elif command -v powershell.exe &>/dev/null; then
        echo "Windows $(powershell.exe -command "[System.Environment]::OSVersion.Version" 2>/dev/null || echo 'unknown')"
    else
        echo "Unknown"
    fi
}

# 检测 CPU
detect_cpu() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sysctl -n machdep.cpu.brand_string 2>/dev/null || echo "Apple Silicon"
    elif [[ "$OSTYPE" == "linux"* ]]; then
        grep -m1 "model name" /proc/cpuinfo | cut -d: -f2 | xargs || echo "Unknown"
    else
        echo "Unknown"
    fi
}

# 检测 CPU 架构
detect_cpu_arch() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ "$(uname -m)" == "arm64" ]]; then
            echo "apple-silicon"
        else
            echo "x86_64"
        fi
    elif [[ "$OSTYPE" == "linux"* ]]; then
        uname -m
    else
        echo "x86_64"
    fi
}

# 检测 CPU 指令集
detect_cpu_flags() {
    local flags=()
    if [[ "$OSTYPE" == "linux"* ]]; then
        local cpuinfo=$(grep -m1 "flags" /proc/cpuinfo)
        for flag in avx avx2 avx512f avx512bw avx512cd avx512dq fma sse4_2 sse4_1; do
            if [[ "$cpuinfo" == *"$flag"* ]]; then
                flags+=("$flag")
            fi
        done
    fi
    echo "${flags[@]}"
}

# 检测 CPU 核心数
detect_cpu_cores() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sysctl -n hw.ncpu 2>/dev/null || echo "8"
    elif [[ "$OSTYPE" == "linux"* ]]; then
        nproc 2>/dev/null || grep -c "^processor" /proc/cpuinfo
    else
        echo "8"
    fi
}

# 检测内存
detect_ram() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # 返回 GB
        $(sysctl -n hw.memsize 2>/dev/null | awk '{print $1/1024/1024/1024}')
    elif [[ "$OSTYPE" == "linux"* ]]; then
        free -g | awk '/^Mem:/ {print $2}'
    else
        echo "16"
    fi
}

# 检测磁盘
detect_disk() {
    local disk_type="ssd"
    local disk_size=0
    
    if [[ "$OSTYPE" == "linux"* ]]; then
        # 检测磁盘类型
        if command -v lsblk &>/dev/null; then
            if lsblk -o NAME,TYPE,ROTA 2>/dev/null | grep -q "ROTA=0"; then
                disk_type="ssd"
            else
                disk_type="hdd"
            fi
        fi
        # 检测磁盘大小
        disk_size=$(df -BG / 2>/dev/null | awk 'NR==2 {print $2}' | tr -d 'G' || echo "500")
    fi
    
    echo "$disk_type $disk_size"
}

# 检测 GPU
detect_gpu() {
    if [[ "$OSTYPE" == "linux"* ]]; then
        if command -v lspci &>/dev/null; then
            lspci 2>/dev/null | grep -i "vga\|3d\|display" | head -1 | awk '{print $3" "$4" "$5" "$6" "$7" "$8" "$9" "$10}' || echo "Unknown"
        else
            echo "Unknown"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        system_profiler SPDisplaysDataType 2>/dev/null | grep "Chipset Model" | head -1 | cut -d: -f2 | xargs || echo "Apple GPU"
    else
        echo "Unknown"
    fi
}

# 检测 GPU 驱动类型
detect_gpu_driver() {
    local gpu=$(detect_gpu)
    if [[ "$gpu" == *NVIDIA* || "$gpu" == *GeForce* || "$gpu" == *Quadro* ]]; then
        echo "nvidia"
    elif [[ "$gpu" == *AMD* || "$gpu" == *Radeon* ]]; then
        echo "amd"
    elif [[ "$gpu" == *Intel* || "$gpu" == *Iris* ]]; then
        echo "intel"
    else
        echo "intel"  # 默认
    fi
}

# 检测显示器分辨率
detect_display() {
    if [[ "$OSTYPE" == "linux"* ]]; then
        if command -v xrandr &>/dev/null; then
            xrandr 2>/dev/null | grep "*" | head -1 | awk '{print $1}' || echo "1920x1080"
        else
            echo "1920x1080"
        fi
    else
        echo "1920x1080"
    fi
}

# 检测已安装软件
detect_installed_software() {
    local software=()
    
    # 浏览器
    for browser in firefox chromium google-chrome brave; do
        if command -v "$browser" &>/dev/null; then
            software+=("$browser")
        fi
    done
    
    # 办公
    for office in libreoffice onlyoffice wps; do
        if command -v "$office" &>/dev/null; then
            software+=("$office")
        fi
    done
    
    # 开发
    for dev in git vim nvim python3 node npm cargo rust go java; do
        if command -v "$dev" &>/dev/null; then
            software+=("$dev")
        fi
    done
    
    # 媒体
    for media in vlc mpv obs-studio audacity; do
        if command -v "$media" &>/dev/null; then
            software+=("$media")
        fi
    done
    
    # 设计
    for design in gimp inkscape krita blender; do
        if command -v "$design" &>/dev/null; then
            software+=("$design")
        fi
    done
    
    # 游戏
    for game in steam lutris; do
        if command -v "$game" &>/dev/null; then
            software+=("$game")
        fi
    done
    
    echo "${software[@]}"
}

# 主函数
main() {
    local os=$(detect_os)
    local cpu=$(detect_cpu)
    local cpu_arch=$(detect_cpu_arch)
    local cpu_flags=$(detect_cpu_flags)
    local cpu_cores=$(detect_cpu_cores)
    local ram_gb=$(detect_ram)
    local disk_info=$(detect_disk)
    local disk_type=$(echo "$disk_info" | awk '{print $1}')
    local disk_size=$(echo "$disk_info" | awk '{print $2}')
    local gpu=$(detect_gpu)
    local gpu_driver=$(detect_gpu_driver)
    local display=$(detect_display)
    local installed_software=$(detect_installed_software)
    
    # 生成 JSON
    cat > "$OUTPUT_FILE" <<EOF
{
  "probe_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "os": "$os",
  "cpu": "$cpu",
  "cpu_arch": "$cpu_arch",
  "cpu_flags": [$(echo "$cpu_flags" | sed 's/ /", "/g' | sed 's/^/"/' | sed 's/$/"/')],
  "cpu_cores": $cpu_cores,
  "ram_gb": $ram_gb,
  "disk_type": "$disk_type",
  "disk_size_gb": $disk_size,
  "gpu": "$gpu",
  "gpu_driver": "$gpu_driver",
  "display_resolution": "$display",
  "installed_software": [$(echo "$installed_software" | sed 's/ /", "/g' | sed 's/^/"/' | sed 's/$/"/')]
}
EOF
    
    echo "探查完成，报告已保存到 $OUTPUT_FILE"
    cat "$OUTPUT_FILE"
}

main "$@"
