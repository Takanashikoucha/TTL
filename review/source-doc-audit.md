# 源文档一致性审计

审计方式：脚本（scripts/audit-consistency.py）+ 人工交叉核对关键事实。
审计范围：README.md + skill/ 下 8 份 md（共 9 份，1763 行）。

## 结论

源文档事实层面质量很高，**仅发现 1 个确凿笔误**，已修复。

## 已修复

| # | 位置 | 问题 | 修复 |
|---|------|------|------|
| 1 | `skill/report-protocol.md:235` | "所有 8 个章节 + **4** 个 guide 文件"——guide 实际只有 3 份（install-guide / first-boot / daily-use），"4"是笔误；且"8 个章节"易被误读为 8 个文件 | 改为"build-report.md 的 8 个章节 + **3** 份指南" |

> 这个笔误正是文章终审（final-review.md 1.5）在 HTML 里修掉的同一个错误——源头在 report-protocol.md。

## 交叉核对（全部一致，无矛盾）

| 关键事实 | 出现位置 | 一致性 |
|----------|----------|--------|
| 9 步构建 | README / SKILL / github-actions / report-protocol | ✓ 全部一致 |
| 4-6 小时耗时 | README / build-environment / github-actions / progress-protocol / SKILL | ✓ 全部一致 |
| 100GB 磁盘 | README / build-environment / github-actions / SKILL | ✓ 一致（"最低 100GB" vs "建议 100GB+" 不矛盾：一是下限一是推荐起步） |
| 双轨搜索/避坑 | 6 份文档 | ✓ 概念统一 |
| 交叉引用 skill/xxx.md | 7 处引用 | ✓ 全部存在，无缺失 |
| 文档规模 | 96-276 行 | ✓ 均衡 |

## 结构性观察（非错误，是设计选择）

- **README vs SKILL 详略差异**：README 快速开始 5 步（面向人类，简化），SKILL 阶段 0-A-D（面向 agent，细化）。README 把"阶段 A（探查+问答+生成配置）"折叠进"加载 SKILL"后的 AI 自动动作，SKILL 单列为阶段 A。颗粒度不同但不矛盾，属合理设计。
- **SKILL.md 阶段 C 编号**（203-210 行）：1-5 是 5 份报告（dist/report/），6-8 是 3 份指南（dist/guide/），9 是提交动作。编号清晰区分了两类，无误。

## 未做 HTML→MD 反向转换的原因

HTML 是文章的呈现层（含封面、重组章节、可视化、编辑加工），反向转会：
1. 丢失源文档的命令/参数/JSON schema 精度
2. 把文章的编辑措辞混进源文档的事实
3. 章节结构是文章重组的（12 节），与源文档 9 份一一对不上

故只做确定性的一致性检查与定点修复，不做整体反向转换。

## 复用

`python3 scripts/audit-consistency.py` 可随时重跑，检查：
- 表格列数一致性
- frontmatter 完整性
- 行尾孤立字符（已排除 YAML block scalar 误报）
- 报告/guide 数量声明
- 9 步命名完整性
- 交叉引用有效性
