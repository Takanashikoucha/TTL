#!/bin/bash
# TTL 构建进度管理脚本
# 管理 build-progress.json，支持断点续传

set -e

PROGRESS_FILE="${1:-build-progress.json}"
ACTION="${2:-status}"  # status | update | resume | complete

# 初始化进度文件
init_progress() {
    local build_id="ttl-$(date +%Y%m%d-%H%M%S)"
    
    cat > "$PROGRESS_FILE" <<EOF
{
  "build_id": "$build_id",
  "started_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "updated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "in_progress",
  "current_step": "step1-host-prepare",
  "steps": {
    "step1-host-prepare": {"status": "pending"},
    "step2-cross-toolchain": {"status": "pending"},
    "step3-chroot-tools": {"status": "pending"},
    "step4-base-system": {"status": "pending"},
    "step5-kernel": {"status": "pending"},
    "step6-desktop-experience": {"status": "pending"},
    "step7-user-apps": {"status": "pending"},
    "step8-ai-assistant": {"status": "pending"},
    "step9-package-iso": {"status": "pending"}
  },
  "resume_point": null,
  "total_duration_seconds": 0,
  "estimated_remaining_seconds": 21600
}
EOF
    
    echo "进度文件已初始化: $PROGRESS_FILE"
}

# 显示当前进度
show_status() {
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        echo "进度文件不存在: $PROGRESS_FILE"
        return 1
    fi
    
    echo "=== 构建进度 ==="
    jq -r '.build_id as $id | .status as $status | .current_step as $current | 
           "构建 ID: \($id)\n状态: \($status)\n当前步骤: \($current)\n\n各步骤状态:" | 
           .steps | to_entries[] | "  \(.key): \(.value.status)"' "$PROGRESS_FILE"
    
    # 显示断点续传点
    if [[ $(jq '.resume_point != null' "$PROGRESS_FILE") == "true" ]]; then
        echo ""
        echo "断点续传点:"
        jq -r '.resume_point | "  步骤: \(.step)\n  包: \(.package)\n  操作: \(.action)"' "$PROGRESS_FILE"
    fi
}

# 更新步骤状态
update_step() {
    local step="$1"
    local status="$2"
    local extra="${3:-}"
    
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        echo "进度文件不存在: $PROGRESS_FILE"
        return 1
    fi
    
    # 更新步骤状态
    local update_cmd=".steps[\"$step\"].status = \"$status\""
    
    if [[ "$status" == "in_progress" ]]; then
        update_cmd+=", .current_step = \"$step\""
    fi
    
    if [[ "$status" == "completed" ]]; then
        update_cmd+=", .steps[\"$step\"].completed_at = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\""
    fi
    
    # 更新总时间
    update_cmd+=", .updated_at = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\""
    
    jq "$update_cmd" "$PROGRESS_FILE" > "$PROGRESS_FILE.tmp" && mv "$PROGRESS_FILE.tmp" "$PROGRESS_FILE"
    
    echo "步骤 $step 状态已更新为: $status"
}

# 设置断点续传点
set_resume_point() {
    local step="$1"
    local package="$2"
    local action="$3"
    
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        echo "进度文件不存在: $PROGRESS_FILE"
        return 1
    fi
    
    jq ".resume_point = {step: \"$step\", package: \"$package\", action: \"$action\"}" \
       "$PROGRESS_FILE" > "$PROGRESS_FILE.tmp" && mv "$PROGRESS_FILE.tmp" "$PROGRESS_FILE"
    
    echo "断点续传点已设置: $step / $package / $action"
}

# 获取断点续传点
get_resume_point() {
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        echo "进度文件不存在: $PROGRESS_FILE"
        return 1
    fi
    
    jq -r '.resume_point // "无断点续传点"' "$PROGRESS_FILE"
}

# 标记构建完成
complete_build() {
    if [[ ! -f "$PROGRESS_FILE" ]]; then
        echo "进度文件不存在: $PROGRESS_FILE"
        return 1
    fi
    
    jq '.status = "completed" | .updated_at = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"' \
       "$PROGRESS_FILE" > "$PROGRESS_FILE.tmp" && mv "$PROGRESS_FILE.tmp" "$PROGRESS_FILE"
    
    echo "构建已标记为完成"
}

# 主函数
main() {
    case "$ACTION" in
        init)
            init_progress
            ;;
        status)
            show_status
            ;;
        update)
            if [[ -z "${3:-}" || -z "${4:-}" ]]; then
                echo "用法: progress-tracker.sh <file> update <step> <status> [extra]"
                exit 1
            fi
            update_step "$3" "$4" "${5:-}"
            ;;
        resume)
            get_resume_point
            ;;
        set-resume)
            if [[ -z "${3:-}" || -z "${4:-}" || -z "${5:-}" ]]; then
                echo "用法: progress-tracker.sh <file> set-resume <step> <package> <action>"
                exit 1
            fi
            set_resume_point "$3" "$4" "$5"
            ;;
        complete)
            complete_build
            ;;
        *)
            echo "未知操作: $ACTION"
            echo "可用操作: init | status | update | resume | set-resume | complete"
            exit 1
            ;;
    esac
}

main "$@"
