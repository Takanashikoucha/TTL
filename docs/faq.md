# TTL 常见问题

## 构建相关

### Q: 构建需要多长时间？

A: 通常需要 4-6 小时，取决于硬件配置和软件包数量。

### Q: 构建失败怎么办？

A: 查看 `build-progress.json` 找到失败点，使用 `failure-handler.sh` 生成恢复方案。

### Q: 如何断点续传？

A: 构建中断后，从 `build-progress.json` 的 `resume_point` 继续，不重跑已完成步骤。

### Q: 如何更换桌面环境？

A: 修改 `ttl-config.json` 的 `desktop` 字段，重新构建。

### Q: 如何添加软件？

A: 修改 `ttl-config.json` 的 `packages` 字段，重新构建。

## 安装相关

### Q: 体验版和无人值守安装版有什么区别？

A: 
- 体验版：用于体验，不安装到磁盘，重启后恢复原状
- 无人值守安装版：自动安装到磁盘，无需用户交互

### Q: 如何双系统安装？

A: 先关闭 Windows 的快速启动，然后使用无人值守安装版安装。

### Q: 安装会删除我的数据吗？

A: 不会。无人值守安装只格式化 Linux 分区，不会碰其他分区。但务必备份重要数据！

## 使用相关

### Q: 如何启动 AI 助手？

A: 在终端运行 `ttl-ai`，或在桌面环境的应用菜单中找到 "TTL AI"。

### Q: AI 助手能做什么？

A: 
- 解答 Linux 使用问题
- 根据用户硬件主动建议性能优化方案
- 帮助排查故障
- 推荐适合用户场景的软件

### Q: 如何配置输入法？

A: 安装后自动启用 fcitx5 + Rime，无需手动配置。

### Q: 如何运行 Windows 软件？

A: 使用 Wine 或 WinApps，在应用菜单中找到 Windows 应用。

## 故障排查

### Q: 黑屏怎么办？

A: 检查 GPU 驱动是否正确安装，尝试使用 `nomodeset` 参数启动。

### Q: 输入法不工作怎么办？

A: 检查 fcitx5 是否安装，运行 `fcitx5-diagnose` 诊断。

### Q: 网络不工作怎么办？

A: 检查 NetworkManager 是否启用，运行 `nmcli device status` 查看状态。

### Q: 声音不工作怎么办？

A: 检查 PipeWire 是否启用，运行 `pactl list sinks` 查看音频设备。

## 参考

- 架构文档：`docs/architecture.md`
- 用户指南：`docs/user-guide.md`
- 配置示例：`examples/ttl-config.example.json`
