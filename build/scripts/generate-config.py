#!/usr/bin/env python3
"""
TTL 配置生成脚本
读取探查报告 + 问答答案 → 生成 ttl-config.json
"""

import json
import sys
from datetime import datetime
from pathlib import Path


def load_probe_report(path: str) -> dict:
    """加载探查报告"""
    with open(path, 'r') as f:
        return json.load(f)


def load_answers(path: str) -> dict:
    """加载问答答案"""
    with open(path, 'r') as f:
        return json.load(f)


def recommend_desktop(probe: dict, answers: dict) -> str:
    """根据硬件和偏好推荐桌面环境"""
    ram = probe.get('ram_gb', 16)
    user_choice = answers.get('desktop', '')
    
    if user_choice:
        return user_choice
    
    # 自动推荐
    if ram <= 8:
        return 'xfce'
    elif ram <= 16:
        return 'gnome'
    else:
        return 'kde'


def recommend_kernel_optimizations(probe: dict) -> list:
    """根据 CPU 指令集推荐内核优化"""
    flags = probe.get('cpu_flags', [])
    optimizations = []
    
    if 'avx512f' in flags:
        optimizations.append('avx512')
    elif 'avx2' in flags:
        optimizations.append('avx2')
    elif 'avx' in flags:
        optimizations.append('avx')
    
    if 'fma' in flags:
        optimizations.append('fma')
    
    return optimizations


def recommend_power_profile(probe: dict, answers: dict) -> str:
    """推荐电源配置"""
    user_choice = answers.get('power_profile', '')
    if user_choice:
        return user_choice
    
    # 笔记本默认均衡，台式机默认性能
    if 'laptop' in probe.get('os', '').lower() or 'notebook' in probe.get('os', '').lower():
        return 'balanced'
    return 'performance'


def generate_config(probe: dict, answers: dict) -> dict:
    """生成构建配置"""
    desktop = recommend_desktop(probe, answers)
    kernel_opts = recommend_kernel_optimizations(probe)
    power_profile = recommend_power_profile(probe, answers)
    
    config = {
        "distro_name": answers.get('distro_name', 'my-linux'),
        "base": "lfs-12.4 + blfs-13.1",
        "hardware_profile": {
            "os": probe.get('os', 'unknown'),
            "cpu": probe.get('cpu', 'unknown'),
            "cpu_arch": probe.get('cpu_arch', 'x86_64'),
            "cpu_flags": probe.get('cpu_flags', []),
            "cpu_cores": probe.get('cpu_cores', 8),
            "ram_gb": probe.get('ram_gb', 16),
            "disk_type": probe.get('disk_type', 'ssd'),
            "disk_size_gb": probe.get('disk_size_gb', 500),
            "gpu": probe.get('gpu', 'unknown'),
            "gpu_driver": probe.get('gpu_driver', 'intel'),
            "display_resolution": probe.get('display_resolution', '1920x1080'),
            "installed_software": probe.get('installed_software', [])
        },
        "desktop": desktop,
        "desktop_theme": {
            "icon_theme": answers.get('icon_theme', 'yaru'),
            "cursor_theme": answers.get('cursor_theme', 'adwaita'),
            "wallpaper": answers.get('wallpaper', 'auto_select'),
            "fonts": answers.get('fonts', ['noto-cjk', 'jetbrains-mono'])
        },
        "input_method": {
            "framework": answers.get('input_method_framework', 'fcitx5'),
            "im_list": answers.get('input_method_list', ['rime', 'pinyin'])
        },
        "kernel": {
            "version": "6.16.1",
            "hardened": True,
            "cpu_optimizations": kernel_opts,
            "gpu_driver": probe.get('gpu_driver', 'intel'),
            "power_profile": power_profile
        },
        "packages": {
            "core": answers.get('core_packages', ['firefox', 'thunderbird', 'vlc']),
            "dev": answers.get('dev_packages', ['git', 'vim', 'python3', 'nodejs']),
            "extra": answers.get('extra_packages', [])
        },
        "windows_compat": {
            "wine_version": "9.0",
            "winapps": answers.get('winapps', True),
            "preinstalled_apps": answers.get('win_apps', [])
        },
        "ai_assistant": {
            "model": "qwen3.5-9b",
            "quantization": "q4_k_m",
            "runtime": "llama.cpp",
            "system_prompt": "你是 TTL 系统内置 AI 助手，核心理念是'开箱即用 × 极致特化'。帮助用户解答 Linux 使用问题，根据用户硬件主动建议性能优化方案，帮助排查故障，推荐适合用户场景的软件。"
        },
        "install": {
            "unattended": answers.get('unattended', True),
            "disk_layout": answers.get('disk_layout', 'auto'),
            "timezone": answers.get('timezone', 'Asia/Shanghai'),
            "locale": answers.get('locale', 'zh_CN.UTF-8'),
            "username": answers.get('username', 'user'),
            "encryption": answers.get('encryption', False)
        },
        "search_protocol": {
            "enabled": True,
            "search_sources": ["web", "lfs-forum", "arch-wiki", "fedoramagazine"],
            "decision_log": True
        }
    }
    
    return config


def main():
    if len(sys.argv) < 3:
        print("用法: generate-config.py <probe-report.json> <answers.json> [output.json]")
        sys.exit(1)
    
    probe_path = sys.argv[1]
    answers_path = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) > 3 else 'ttl-config.json'
    
    probe = load_probe_report(probe_path)
    answers = load_answers(answers_path)
    
    config = generate_config(probe, answers)
    
    with open(output_path, 'w') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"配置已生成: {output_path}")
    print(json.dumps(config, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
