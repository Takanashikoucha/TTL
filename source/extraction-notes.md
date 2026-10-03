# Extraction Notes

## 输入类型
- 9 个本地 Markdown 文件（README.md + skill/ 下 8 个 .md）
- 全部为干净、结构完整的 Markdown（本项目自有文档，非外部抓取）

## 提取方式
- 直接机械拼接（保持原文结构，未过度改写）
- SKILL.md 的 YAML frontmatter（name/version/description）已剥离
- 文件间用 `---` 水平线分隔
- 拼接顺序：README → SKILL → build-environment → search-protocol → progress-protocol → failure-protocol → github-actions → report-protocol → system-setup

## 可能丢失的信息
- 无。源材料为纯文字 + 表格 + 代码块，无图片、无脚注、无公式
- 各文件原有的相对路径引用（如 `详见 xxx.md`）在整合后仍保留原文，但指向的是 skill/ 目录下的文件（整合版中这些引用变成文档内的章节锚点）

## 语言与翻译
- 源语言：简体中文
- 目标语言：简体中文（用户未指定，跟随源语言）
- 无需翻译

## 需要用户补充的素材
- 无。素材完整，足以支撑一篇完整长文

## 置信度
- 高置信（自有文档，结构清晰，无转换风险）
- 无需升级为独立 Source Reviewer SubAgent
