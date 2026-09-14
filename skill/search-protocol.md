# TTL 搜索-决策-记录-避坑 协议

## 目的

确保每个构建决策都经过充分调查，既找到最佳实践，又避开已知坑。

## 双轨搜索

### 轨道 1：最佳实践搜索

搜索该组件/配置的最新最佳实践：

```
模板：
  "<component> best <aspect> for <hardware> <year>"
  "<component> <version> recommended configuration <year>"
  "<component> performance optimization <hardware> <year>"

示例：
  "GCC 15 best -march flags for haswell 2025"
  "glibc 2.42 recommended security flags 2025"
  "Linux 6.16 kernel best config for NVIDIA RTX 3090 2025"
  "KDE Plasma 6 best theme configuration 2025"
  "Wine 9 best setup for NVIDIA RTX 3090 2025"
  "llama.cpp best build flags for haswell 2025"
```

### 轨道 2：避坑搜索（必须执行）

搜索该组件/配置的已知坑：

```
模板：
  "<component> <version> known issues bugs <year>"
  "<component> <hardware> compatibility problems <year>"
  "<component> <aspect> pitfalls workarounds <year>"
  "<component> <aspect> crash hang freeze <year>"

示例：
  "GCC 15 -march haswell known issues bugs 2025"
  "glibc 2.42 build problems workarounds"
  "Wine 9 NVIDIA 555 driver crash workaround"
  "KDE Plasma 6 fcitx5 input method problems"
  "Linux 6.16 kernel NVIDIA RTX 3090 boot issues"
  "llama.cpp Qwen3.5-9B inference problems"
```

## 避坑检查清单（每步必查）

- [ ] 该组件版本是否有已知 critical bug？
- [ ] 用户硬件组合是否有兼容性报告？
- [ ] 编译参数是否会导致运行时问题？
- [ ] 桌面/输入法/GPU 组合是否有已知冲突？
- [ ] 内核配置是否会导致特定硬件无法启动？
- [ ] 该版本是否有已知的安全漏洞？
- [ ] 社区是否有已知的 workaround？

## 搜索来源

优先搜索以下来源：

1. **官方文档**：组件官网、man page
2. **LFS/BLFS 论坛**：lfs-support mailing list
3. **Arch Wiki**：archlinux.org/wiki
4. **Fedora Magazine**：fedoramagazine.org
5. **GitHub Issues**：组件仓库的 issue tracker
6. **Reddit**：r/linux, r/linuxquestions
7. **Stack Exchange**：unix.stackexchange.com
8. **组件论坛**：各组件官方论坛

## 输出格式

### 决策日志（decision-log.json）

```json
{
  "step": "step4-base-system",
  "timestamp": "2025-09-15T10:00:00Z",
  "decisions": [
    {
      "component": "gcc",
      "version": "15.2.0",
      "reason": "LFS 12.4 指定版本，经搜索确认为当前最稳定",
      "flags": ["-march=haswell", "-flto", "-enable-default-pie", "-enable-default-ssp"],
      "reason_flags": "用户 CPU 为 Intel i7-8700K (Haswell)，支持 AVX2；LTO 启用链接时优化；PIE+SSP 安全加固",
      "sources": [
        "https://gcc.gnu.org/install/",
        "https://www.linuxfromscratch.org/lfs/view/stable/chapter08/gcc.html"
      ]
    }
  ]
}
```

### 避坑报告（pitfall-report.json）

```json
{
  "step": "step4-base-system",
  "timestamp": "2025-09-15T10:00:00Z",
  "pitfalls": [
    {
      "component": "gcc",
      "issue": "GCC 15.2 + glibc 2.42 在特定条件下编译失败",
      "severity": "medium",
      "workaround": "应用 gcc-glibc-compat.patch",
      "source": "https://github.com/gcc-mirror/gcc/issues/12345",
      "mitigated": true,
      "mitigation": "已应用 patch"
    },
    {
      "component": "glibc",
      "issue": "glibc 2.42 在 32 位系统上内存泄漏",
      "severity": "low",
      "workaround": "不适用（64 位系统）",
      "source": "https://sourceware.org/bugzilla/show_bug.cgi?id=30000",
      "mitigated": false,
      "mitigation": "N/A（64 位系统不受影响）"
    }
  ]
}
```

## 搜索频率

- **每步开始前**：必须执行双轨搜索
- **每个包编译前**：Step 4 的 50 个包，每个包都要搜索
- **失败时**：额外搜索错误信息的 workaround

## 搜索工具

- **web_search**：通用搜索
- **web_fetch**：获取具体页面
- **grep**：本地文档搜索
- **curl**：直接获取 API/页面

## 注意事项

1. **不要盲目相信搜索结果**：交叉验证多个来源
2. **注意时间**：优先最近 1 年的信息
3. **区分官方和社区**：官方文档 > 社区经验
4. **记录来源**：每个决策都要记录参考来源
5. **避坑优先**：如果最佳实践和避坑冲突，优先避坑
