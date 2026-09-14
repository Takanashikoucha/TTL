# TTL 用户指南

## 快速开始

### 1. 环境探查

在你的电脑上运行：

```bash
git clone https://github.com/Takanashikoucha/TTL.git
cd TTL
./build/scripts/probe.sh probe-report.json
```

### 2. 偏好问答

回答 6 个问题：

| 问题 | 选项 | 说明 |
|------|------|------|
| Q1 桌面环境 | XFCE / GNOME / KDE / i3 | 根据内存/CPU 推荐 |
| Q2 常用软件 | 浏览器/办公/开发/媒体/游戏/设计 | 预装到 Linux |
| Q3 使用场景 | 办公/开发/游戏/设计/综合 | 决定内核调优方向 |
| Q4 性能倾向 | 性能/均衡/省电 | 笔记本推荐均衡 |
| Q5 安装方式 | 体验版/无人值守安装版 | 建议先体验 |
| Q6 其他偏好 | 语言/时区/双系统/加密 | 系统配置 |

### 3. 生成配置

```bash
./build/scripts/generate-config.py probe-report.json answers.json ttl-config.json
```

### 4. 启动构建

在 GitHub Actions 中手动触发构建：

```
Actions → TTL Build → Run workflow
```

### 5. 下载 ISO

构建完成后，从 Release 下载：
- `ttl-trial.iso`：体验版
- `ttl-unattended.iso`：无人值守安装版

## 风险提示

1. **数据备份**：安装前务必备份重要数据！
2. **双系统**：先关闭 Windows 的快速启动
3. **NVIDIA 驱动**：首次启动后需要联网
4. **游戏**：少数有反作弊的游戏不行
5. **构建时间**：需要 4-6 小时

## 常见问题

### Q: 构建失败怎么办？

A: 查看 `build-progress.json` 找到失败点，使用 `failure-handler.sh` 生成恢复方案。

### Q: 如何断点续传？

A: 构建中断后，从 `build-progress.json` 的 `resume_point` 继续。

### Q: 如何更换桌面环境？

A: 修改 `ttl-config.json` 的 `desktop` 字段，重新构建。

### Q: 如何添加软件？

A: 修改 `ttl-config.json` 的 `packages` 字段，重新构建。

## 参考

- 架构文档：`docs/architecture.md`
- FAQ：`docs/faq.md`
- 配置示例：`examples/ttl-config.example.json`
