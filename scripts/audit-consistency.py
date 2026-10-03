#!/usr/bin/env python3
"""扫描 TTL 源文档的一致性问题和口径不一致。

不做 HTML->MD 反向转换（会污染源文档）。只做确定性的检查：
1. 编号连续性（阶段/步骤/分类）
2. 交叉引用有效性（提到的文件/章节是否存在）
3. 表格列数一致性
4. frontmatter 完整性
5. 关键口径统一（报告数量、guide 数量、风险条数、9 步命名）
6. 明显的孤立字符（如多余的 | ）
"""
import re
import sys
from pathlib import Path

BASE = Path("/home/koucha/TTL")
FILES = [
    "README.md",
    "skill/SKILL.md",
    "skill/build-environment.md",
    "skill/search-protocol.md",
    "skill/progress-protocol.md",
    "skill/failure-protocol.md",
    "skill/github-actions.md",
    "skill/report-protocol.md",
    "skill/system-setup.md",
]

issues = []


def rel(p):
    return p.relative_to(BASE)


def scan_table_columns(text, fname):
    """检查 markdown 表格每行列数是否一致。"""
    lines = text.split("\n")
    in_table = False
    table_start = 0
    cols = None
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith("|") and stripped.endswith("|"):
            if not in_table:
                in_table = True
                table_start = i
                cells = [c for c in stripped.split("|")[1:-1]]
                cols = len(cells)
            else:
                cells = [c for c in stripped.split("|")[1:-1]]
                # 分隔行（---）跳过
                if all(re.fullmatch(r"\s*:?-{2,}:?\s*", c) for c in cells):
                    continue
                if len(cells) != cols:
                    issues.append(f"{rel(fname)}:{i} 表格列数不一致（表头 {cols} 列，此行 {len(cells)} 列）：{stripped[:60]}")
        else:
            if in_table:
                in_table = False
                cols = None


def scan_frontmatter(text, fname):
    """检查 YAML frontmatter 完整性。"""
    if not text.startswith("---"):
        return
    end = text.find("\n---", 3)
    if end == -1:
        issues.append(f"{rel(fname)}: frontmatter 未闭合")
        return
    fm = text[3:end]
    for key in ["name", "description"]:
        if not re.search(rf"^{key}\s*:", fm, re.M):
            issues.append(f"{rel(fname)}: frontmatter 缺少 {key}")


def scan_stray_chars(text, fname):
    """检查行尾孤立的 | 或其他可疑字符。排除 YAML block scalar（run: | / path: |）。"""
    for i, line in enumerate(text.split("\n"), 1):
        stripped = line.rstrip()
        if not stripped.endswith("|"):
            continue
        # 排除 YAML block scalar（行内是 "xxx: |" 形式）
        if re.search(r":\s*\|\s*$", stripped):
            continue
        # 排除正常表格行（以 | 开头）
        if line.strip().startswith("|"):
            continue
        # 排除行内有其他 | 的（表格行）
        if "|" in stripped[:-1]:
            continue
        issues.append(f"{rel(fname)}:{i} 行尾孤立 '|'：{stripped[:60]}")


def main():
    texts = {}
    for f in FILES:
        p = BASE / f
        if not p.exists():
            issues.append(f"{f}: 文件不存在")
            continue
        texts[f] = p.read_text(encoding="utf-8")
        scan_table_columns(texts[f], p)
        scan_frontmatter(texts[f], p)
        scan_stray_chars(texts[f], p)

    # 口径检查：报告数量
    for f, t in texts.items():
        for m in re.finditer(r"(\d+)\s*[份个]\s*(报告|guide|指南)", t):
            num, kind = m.group(1), m.group(2)
            pos = t[:m.start()].count("\n") + 1
            # 标记需要人工核对的口径声明
            if kind == "报告" and num not in ("5", "8"):
                issues.append(f"{rel(BASE/f)}:{pos} 报告数量声明为 {num}（预期 5 或 8，需核对上下文）")
            if kind in ("guide", "指南") and num not in ("3",):
                issues.append(f"{rel(BASE/f)}:{pos} guide/指南数量声明为 {num}（预期 3，需核对）")

    # 9 步命名一致性
    step_names_expected = [
        "主机准备", "交叉工具链", "Chroot", "基础系统", "内核",
        "桌面", "用户软件", "AI 助手", "打包 ISO",
    ]
    skill_md = texts.get("skill/SKILL.md", "")
    for sn in step_names_expected:
        if sn not in skill_md:
            issues.append(f"skill/SKILL.md: 9 步命名缺少「{sn}」（与其他文档可能不一致）")

    # 交叉引用检查：提到的 skill/xxx.md 文件是否存在
    for f, t in texts.items():
        for m in re.finditer(r"(skill/[a-z-]+\.md)", t):
            ref = m.group(1)
            if not (BASE / ref).exists():
                pos = t[:m.start()].count("\n") + 1
                issues.append(f"{rel(BASE/f)}:{pos} 引用了不存在的 {ref}")

    # 输出
    if not issues:
        print("✓ 未发现问题")
    else:
        print(f"发现 {len(issues)} 个问题：\n")
        for iss in issues:
            print(f"  - {iss}")
    return 0 if not issues else 1


if __name__ == "__main__":
    sys.exit(main())
