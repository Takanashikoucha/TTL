# 搜索-决策-记录-避坑 协议

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
```

### 轨道 2：避坑搜索（必须执行）

搜索该组件/配置的已知坑：

```
模板：
  "<component> <version> known issues bugs <year>"
  "<component> <hardware> compatibility problems <year>"
  "<component> <aspect> pitfalls workarounds <year>"
  "<component> <aspect> crash hang freeze <year>"
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

## 输出要求

### 决策日志（每步生成）

每个组件记录：
- 组件名 + 版本
- 选择理由（为什么选这个版本）
- 编译参数 + 参数理由（为什么用这些参数）
- 参考来源（URL 列表）

### 避坑报告（每步生成）

每个已知坑记录：
- 组件名
- 问题描述
- 严重程度（critical / medium / low）
- 规避措施
- 来源
- 是否已规避 + 规避方式

## 搜索频率

- **每步开始前**：必须执行双轨搜索
- **每个包编译前**：基础系统的每个包都要搜索
- **失败时**：额外搜索错误信息的 workaround

## 搜索工具指导

- 优先使用多引擎搜索（免 API key）；单一引擎降为后备
- 仅当多引擎缺失或连续失败才用单一引擎
- 搜索结果的 URL 用 HTTP 抓取获取完整页面内容
- 本地文档搜索用 ripgrep 正则
- 搜索前检查已失败的查询记录，避免重复搜索
- 每次搜索后记录查询 + 结果摘要

## 注意事项

1. **不要盲目相信搜索结果**：交叉验证多个来源
2. **注意时间**：优先最近 1 年的信息
3. **区分官方和社区**：官方文档 > 社区经验
4. **记录来源**：每个决策都要记录参考来源
5. **避坑优先**：如果最佳实践和避坑冲突，优先避坑
