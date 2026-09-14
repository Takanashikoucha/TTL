#!/bin/bash
# TTL 失败处理脚本
# 捕获失败、分类、生成恢复方案

set -e

FAILURE_LOG="${1:-failure.log}"
COMPONENT="${2:-unknown}"
STEP="${3:-unknown}"
COMMAND="${4:-unknown}"
KB_FILE="${5:-failure-kb.json}"

# 捕获失败信息
capture_failure() {
    local failure_file="failure-report.json"
    
    cat > "$failure_file" <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "step": "$STEP",
  "component": "$COMPONENT",
  "command": "$COMMAND",
  "error_log": "$(cat "$FAILURE_LOG" 2>/dev/null | head -100)",
  "system_state": {
    "disk_space": "$(df -h / 2>/dev/null | awk 'NR==2 {print $4}' || echo 'unknown')",
    "memory": "$(free -h 2>/dev/null | awk '/^Mem:/ {print $3" used, "$2" total"}' || echo 'unknown')",
    "cpu_load": "$(uptime 2>/dev/null | awk -F 'load average:' '{print $2}' || echo 'unknown')"
  }
}
EOF
    
    echo "失败信息已捕获: $failure_file"
}

# 分类失败
classify_failure() {
    local error_log=$(cat "$FAILURE_LOG" 2>/dev/null)
    
    if [[ "$error_log" == *"404"* || "$error_log" == *"timeout"* || "$error_log" == *"connection refused"* ]]; then
        echo "network"
    elif [[ "$error_log" == *"error:"* || "$error_log" == *"undefined reference"* ]]; then
        echo "compile_error"
    elif [[ "$error_log" == *"No such file"* || "$error_log" == *"cannot find"* ]]; then
        echo "dependency_missing"
    elif [[ "$error_log" == *"No space left"* || "$error_log" == *"Killed"* || "$error_log" == *"out of memory"* ]]; then
        echo "resource"
    elif [[ "$error_log" == *"configure"* && "$error_log" == *"failed"* ]]; then
        echo "config_error"
    else
        echo "unknown"
    fi
}

# 生成恢复方案
generate_recovery_plan() {
    local failure_type="$1"
    local recovery_file="recovery-plan.json"
    
    local diagnosis=""
    local solutions="[]"
    
    case "$failure_type" in
        "network")
            diagnosis="下载失败"
            solutions='[
                {"option": "retry", "description": "重试", "risk": "low", "command": "重新执行下载命令"},
                {"option": "change_mirror", "description": "换镜像源", "risk": "low", "command": "换用清华/中科大镜像"}
            ]'
            ;;
        "compile_error")
            diagnosis="编译错误"
            solutions='[
                {"option": "search_workaround", "description": "搜索 workaround", "risk": "low", "command": "web_search 错误信息"},
                {"option": "apply_patch", "description": "应用社区 patch", "risk": "low", "command": "patch -p1 < fix.patch"},
                {"option": "downgrade_version", "description": "降级版本", "risk": "medium", "command": "使用 versions.lock 中的旧版本"}
            ]'
            ;;
        "dependency_missing")
            diagnosis="依赖缺失"
            solutions='[
                {"option": "check_build_order", "description": "检查构建顺序", "risk": "low", "command": "检查是否漏了前置包"},
                {"option": "install_dependency", "description": "补装依赖", "risk": "low", "command": "安装缺失的依赖包"}
            ]'
            ;;
        "resource")
            diagnosis="资源不足"
            solutions='[
                {"option": "cleanup", "description": "清理临时文件", "risk": "low", "command": "rm -rf /tmp/build/*"},
                {"option": "reduce_parallelism", "description": "减少并行度", "risk": "low", "command": "make -j2 或 make -j1"}
            ]'
            ;;
        "config_error")
            diagnosis="配置错误"
            solutions='[
                {"option": "check_config", "description": "检查配置文件", "risk": "low", "command": "检查配置文件"},
                {"option": "reset_default", "description": "回退到默认值", "risk": "medium", "command": "使用默认配置"}
            ]'
            ;;
        *)
            diagnosis="未知错误"
            solutions='[
                {"option": "search_error", "description": "搜索错误信息", "risk": "low", "command": "web_search 完整错误信息"}
            ]'
            ;;
    esac
    
    cat > "$recovery_file" <<EOF
{
  "failure_type": "$failure_type",
  "component": "$COMPONENT",
  "step": "$STEP",
  "command": "$COMMAND",
  "diagnosis": "$diagnosis",
  "recovery_options": $solutions,
  "recommended": "$(echo "$solutions" | jq -r '.[0].option' 2>/dev/null || echo 'search_error')",
  "resume_point": {
    "step": "$STEP",
    "package": "$COMPONENT",
    "action": "retry"
  }
}
EOF
    
    echo "恢复方案已生成: $recovery_file"
    cat "$recovery_file"
}

# 主函数
main() {
    echo "=== TTL 失败处理 ==="
    echo "步骤: $STEP"
    echo "组件: $COMPONENT"
    echo "命令: $COMMAND"
    echo ""
    
    # 捕获失败信息
    capture_failure
    
    # 分类失败
    local failure_type=$(classify_failure)
    echo "失败类型: $failure_type"
    
    # 生成恢复方案
    generate_recovery_plan "$failure_type"
    
    echo ""
    echo "=== 失败处理完成 ==="
}

main "$@"
