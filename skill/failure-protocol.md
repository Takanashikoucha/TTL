# TTL 失败分类 + 恢复指导 协议

## 目的

构建失败时，提供结构化故障排查指导，帮助用户推进构建到最终成果。

## 失败处理流程

```
1. 捕获失败
   - 错误日志（完整保存）
   - 失败步骤 + 包名 + 命令
   - 系统状态（磁盘空间、内存、CPU）

2. 分类失败
   - 类型 A：网络问题（下载失败）
   - 类型 B：编译错误（源码 bug）
   - 类型 C：依赖缺失
   - 类型 D：资源不足（磁盘/内存）
   - 类型 E：配置错误

3. 生成恢复方案
   - 多个恢复选项 + 风险等级
   - 推荐选项
   - 断点续传点

4. 执行恢复 + 更新进度

5. 如果恢复失败 → 升级处理
   - 记录完整日志
   - 生成故障报告
   - 指导用户联系维护者
```

## 失败分类

### 类型 A：网络问题

**特征**：
- 下载失败（404、timeout、connection refused）
- 镜像源不可用
- DNS 解析失败

**恢复方案**：
1. 重试（可能是临时网络问题）
2. 换镜像源（如从官方源换到清华/中科大镜像）
3. 检查网络连接
4. 使用离线包（如果之前下载过）

**风险等级**：low

### 类型 B：编译错误

**特征**：
- 编译器报错（error: ...）
- 链接器报错（undefined reference）
- 测试失败（make check 失败）

**恢复方案**：
1. 搜索 workaround（web_search）
2. 应用社区 patch
3. 降级版本（如 GCC 15.2 → 14.2）
4. 跳过该包（如非核心包）
5. 调整编译参数（如去掉 -march=native）

**风险等级**：medium（降级/跳过）/ low（patch）

### 类型 C：依赖缺失

**特征**：
- 找不到头文件（fatal error: xxx.h: No such file）
- 找不到库（cannot find -lxxx）
- 依赖包未安装

**恢复方案**：
1. 检查构建顺序（是否漏了前置包）
2. 补装依赖包
3. 检查 configure 参数（是否指定了正确的路径）
4. 设置环境变量（CFLAGS、LDFLAGS、CPPFLAGS）

**风险等级**：low

### 类型 D：资源不足

**特征**：
- 磁盘空间不足（No space left on device）
- 内存不足（out of memory、killed）
- CPU 负载过高

**恢复方案**：
1. 清理临时文件（rm -rf /tmp/build/*）
2. 减少并行度（make -j4 → make -j2）
3. 增加 swap（如果内存不足）
4. 分步构建（先构建小包，清理后再构建大包）

**风险等级**：low

### 类型 E：配置错误

**特征**：
- configure 失败
- 内核配置错误
- 系统配置错误

**恢复方案**：
1. 检查配置文件
2. 回退到默认值
3. 参考官方文档
4. 搜索该配置的最佳实践

**风险等级**：medium

## 恢复方案格式

```json
{
  "failure_type": "compile_error",
  "component": "gcc-15.2.0",
  "step": "step4-base-system",
  "command": "make install",
  "error_summary": "error: ...",
  "error_log": "完整错误日志",
  "diagnosis": "已知问题：GCC 15.2 + glibc 2.42 在特定条件下编译失败",
  "recovery_options": [
    {
      "option": "apply_patch",
      "description": "应用社区 patch",
      "risk": "low",
      "command": "patch -p1 < gcc-glibc-compat.patch",
      "estimated_time": "5 分钟"
    },
    {
      "option": "downgrade_version",
      "description": "降级到 GCC 14.2",
      "risk": "medium（失去部分优化）",
      "command": "use gcc-14.2.0 from versions.lock",
      "estimated_time": "30 分钟"
    },
    {
      "option": "skip_package",
      "description": "跳过（非核心包）",
      "risk": "high（可能影响后续包）",
      "applicable": false,
      "reason": "GCC 是核心包，不能跳过"
    }
  ],
  "recommended": "apply_patch",
  "resume_point": {
    "step": "step4-base-system",
    "package": "gcc-15.2.0",
    "action": "make (retry after patch)"
  }
}
```

## 失败知识库（failure-kb.json）

```json
{
  "known_failures": [
    {
      "pattern": "gcc.*error.*glibc.*2.42",
      "type": "compile_error",
      "component": "gcc",
      "diagnosis": "GCC 15.2 + glibc 2.42 已知编译问题",
      "solutions": [
        {"action": "apply_patch", "patch": "gcc-glibc-compat.patch"},
        {"action": "downgrade", "target": "gcc-14.2.0"}
      ],
      "source": "https://github.com/gcc-mirror/gcc/issues/12345"
    },
    {
      "pattern": "No space left on device",
      "type": "resource",
      "diagnosis": "磁盘空间不足",
      "solutions": [
        {"action": "cleanup", "command": "rm -rf /tmp/build/*"},
        {"action": "reduce_parallelism", "flag": "-j2"}
      ],
      "source": "N/A"
    },
    {
      "pattern": "undefined reference.*_GLIBC_",
      "type": "compile_error",
      "component": "*",
      "diagnosis": "glibc 版本不匹配",
      "solutions": [
        {"action": "rebuild_glibc", "command": "cd glibc && make && make install"},
        {"action": "check_version", "command": "ldd --version"}
      ],
      "source": "N/A"
    },
    {
      "pattern": "curl.*(404|timeout|connection refused)",
      "type": "network",
      "diagnosis": "下载失败",
      "solutions": [
        {"action": "retry", "command": "重新执行下载命令"},
        {"action": "change_mirror", "command": "换用清华/中科大镜像"}
      ],
      "source": "N/A"
    },
    {
      "pattern": "Killed",
      "type": "resource",
      "diagnosis": "内存不足",
      "solutions": [
        {"action": "reduce_parallelism", "flag": "-j1"},
        {"action": "add_swap", "command": "fallocate -l 4G /swapfile && mkswap /swapfile && swapon /swapfile"}
      ],
      "source": "N/A"
    }
  ]
}
```

## 升级处理

如果恢复方案都失败：

1. **记录完整日志**：
   - 错误日志
   - 系统状态
   - 已尝试的恢复方案
   - 进度文件

2. **生成故障报告**：
   ```json
   {
     "build_id": "ttl-20250915-001",
     "failure_step": "step4-base-system",
     "failure_package": "gcc-15.2.0",
     "failure_command": "make install",
     "error_log": "完整错误日志",
     "system_state": {
       "disk_space": "50GB free",
       "memory": "16GB total, 12GB used",
       "cpu_load": "4.5"
     },
     "attempted_solutions": [
       {"option": "apply_patch", "result": "failed"},
       {"option": "downgrade_version", "result": "failed"}
     ],
     "timestamp": "2025-09-15T14:30:00Z"
   }
   ```

3. **指导用户联系维护者**：
   - 提交 Issue（使用 build_failure.md 模板）
   - 附上故障报告
   - 等待维护者回复

## 注意事项

1. **不要盲目重试**：同一错误连续 2 次失败后，必须换方案
2. **记录所有尝试**：每个恢复方案的结果都要记录
3. **风险告知**：每个恢复方案都要告知风险等级
4. **用户确认**：高风险方案（如降级、跳过）需要用户确认
5. **进度更新**：每次恢复后都要更新进度文件
