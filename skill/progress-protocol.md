# TTL 构建进度管理 + 断点续传 协议

## 目的

构建可能持续 4-6 小时，必须支持断点续传，避免失败后从头开始。

## 进度文件（build-progress.json）

### 结构

```json
{
  "build_id": "ttl-20250915-001",
  "started_at": "2025-09-15T10:00:00Z",
  "updated_at": "2025-09-15T14:30:00Z",
  "status": "in_progress",
  "current_step": "step4-base-system",
  "steps": {
    "step1-host-prepare": {
      "status": "completed",
      "started_at": "2025-09-15T10:00:00Z",
      "completed_at": "2025-09-15T10:10:00Z",
      "artifact": "step1-host-prepare.tar.gz",
      "artifact_url": "https://github.com/.../artifacts/step1.tar.gz",
      "decision_log": "step1-decisions.json",
      "pitfall_report": "step1-pitfalls.json",
      "duration_seconds": 600
    },
    "step2-cross-toolchain": {
      "status": "completed",
      "started_at": "2025-09-15T10:10:00Z",
      "completed_at": "2025-09-15T10:50:00Z",
      "artifact": "step2-cross-toolchain.tar.gz",
      "artifact_url": "https://github.com/.../artifacts/step2.tar.gz",
      "decision_log": "step2-decisions.json",
      "pitfall_report": "step2-pitfalls.json",
      "duration_seconds": 2400
    },
    "step3-chroot-tools": {
      "status": "completed",
      "started_at": "2025-09-15T10:50:00Z",
      "completed_at": "2025-09-15T11:10:00Z",
      "artifact": "step3-chroot-tools.tar.gz",
      "artifact_url": "https://github.com/.../artifacts/step3.tar.gz",
      "decision_log": "step3-decisions.json",
      "pitfall_report": "step3-pitfalls.json",
      "duration_seconds": 1200
    },
    "step4-base-system": {
      "status": "in_progress",
      "started_at": "2025-09-15T11:10:00Z",
      "current_package": "gcc-15.2.0",
      "packages_completed": 23,
      "packages_total": 50,
      "progress_percent": 46,
      "package_status": {
        "man-pages": "completed",
        "iana-etc": "completed",
        "glibc": "completed",
        "zlib": "completed",
        "bzip2": "completed",
        "xz": "completed",
        "lz4": "completed",
        "zstd": "completed",
        "file": "completed",
        "readline": "completed",
        "m4": "completed",
        "bc": "completed",
        "flex": "completed",
        "tcl": "completed",
        "expect": "completed",
        "dejagnu": "completed",
        "pkgconf": "completed",
        "binutils": "completed",
        "gmp": "completed",
        "mpfr": "completed",
        "mpc": "completed",
        "attr": "completed",
        "acl": "completed",
        "libcap": "in_progress",
        "libxcrypt": "pending",
        "shadow": "pending",
        "gcc": "in_progress",
        "ncurses": "pending",
        "sed": "pending",
        "psmisc": "pending",
        "gettext": "pending",
        "bison": "pending",
        "grep": "pending",
        "bash": "pending",
        "libtool": "pending",
        "gdbm": "pending",
        "gperf": "pending",
        "expat": "pending",
        "inetutils": "pending",
        "less": "pending",
        "perl": "pending",
        "xml-parser": "pending",
        "intltool": "pending",
        "autoconf": "pending",
        "automake": "pending",
        "openssl": "pending",
        "libelf": "pending",
        "libffi": "pending",
        "python": "pending",
        "flit-core": "pending",
        "packaging": "pending",
        "wheel": "pending",
        "setuptools": "pending",
        "ninja": "pending",
        "meson": "pending",
        "kmod": "pending",
        "coreutils": "pending",
        "diffutils": "pending",
        "gawk": "pending",
        "findutils": "pending",
        "groff": "pending",
        "grub": "pending",
        "gzip": "pending",
        "iproute2": "pending",
        "kbd": "pending",
        "libpipeline": "pending",
        "make": "pending",
        "patch": "pending",
        "tar": "pending",
        "texinfo": "pending",
        "vim": "pending",
        "markupsafe": "pending",
        "jinja2": "pending",
        "udev": "pending",
        "man-db": "pending",
        "procps-ng": "pending",
        "util-linux": "pending",
        "e2fsprogs": "pending",
        "sysklogd": "pending",
        "sysvinit": "pending"
      }
    },
    "step5-kernel": { "status": "pending" },
    "step6-desktop-experience": { "status": "pending" },
    "step7-user-apps": { "status": "pending" },
    "step8-ai-assistant": { "status": "pending" },
    "step9-package-iso": { "status": "pending" }
  },
  "resume_point": {
    "step": "step4-base-system",
    "package": "gcc-15.2.0",
    "action": "make install"
  },
  "total_duration_seconds": 16200,
  "estimated_remaining_seconds": 14400
}
```

### 状态值

- `pending`：未开始
- `in_progress`：进行中
- `completed`：已完成
- `failed`：失败
- `skipped`：跳过（非核心包）

## 进度粒度

### 三级粒度

1. **Step 级别**：9 个步骤
2. **包级别**：Step 4 的 50 个包、Step 7 的 N 个用户软件
3. **命令级别**：每个包的 configure / make / make install 三阶段

### 更新频率

- **Step 开始/完成**：立即更新
- **包开始/完成**：立即更新
- **命令阶段变化**：立即更新
- **失败**：立即更新 + 记录失败信息

## 断点续传流程

```
1. 构建失败/中断
2. 读取 build-progress.json
3. 找到 resume_point
4. 从该点继续（不重跑已完成的步骤）
5. 更新进度文件
6. 继续后续步骤
```

### 断点续传示例

```
失败点：step4-base-system / gcc-15.2.0 / make install

恢复流程：
1. 读取 build-progress.json
2. 找到 resume_point: { step: "step4", package: "gcc-15.2.0", action: "make install" }
3. 下载 step1-3 的 artifact
4. 解压到构建环境
5. 从 gcc-15.2.0 的 make install 继续
6. 更新进度文件
7. 继续后续包
```

## 进度文件位置

- **构建中**：GitHub Actions artifact（每步上传）
- **完成后**：GitHub Release 附件
- **用户端**：本地保存（用于故障排查）

## 进度可视化

### 终端输出

```
[Step 4/9] 基础系统 (46%)
  ✓ man-pages
  ✓ iana-etc
  ✓ glibc
  ✓ zlib
  ...
  ✓ libcap
  → gcc (make install)
  ○ libxcrypt
  ○ shadow
  ...
  
  已完成: 23/50 包
  预计剩余: 4 小时
```

### GitHub Actions 日志

```
## Step 4: 基础系统
[1/50] man-pages ... ✓ (2m 30s)
[2/50] iana-etc ... ✓ (1m 15s)
[3/50] glibc ... ✓ (12m 45s)
...
[23/50] libcap ... ✓ (3m 20s)
[24/50] gcc ... → make install
```

## 注意事项

1. **原子性**：进度文件更新必须是原子操作（避免部分写入）
2. **备份**：每步完成后备份进度文件
3. **版本**：进度文件包含 build_id，避免混淆不同构建
4. **清理**：构建完成后清理临时进度文件
