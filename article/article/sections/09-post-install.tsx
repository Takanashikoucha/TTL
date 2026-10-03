import { Section, Subsection, Table } from "reacticle";

export function SectionPostInstall() {
  return (
    <Section index="09" title="安装后配置与坑点">
      <p>
        装完系统不等于万事大吉。显卡驱动、安全配置、功耗控制、文件系统、日常故障——
        每一项都有自己的坑。这一节汇总了安装后最常见的坑点和避坑方法，内容参考
        archlinux 简明指南，适配 TTL 的 LFS + BLFS 路线。
      </p>

      <Subsection index="9.1" title="显卡驱动">
        <p>
          <strong>驱动选择原则</strong>：AMD 显卡一律用开源驱动（AMDGPU / ATI）；
          NVIDIA 显卡用闭源驱动（nvidia / nvidia-open）；双显卡（集显 + 独显）先装
          各自驱动，再用 optimus-manager 切换。
        </p>
        <Table
          caption="NVIDIA 驱动选择"
          columns={[
            { key: "c0", label: "GPU 架构" },
            { key: "c1", label: "驱动" },
            { key: "c2", label: "说明" },
          ]}
          rows={[
            { c0: "Turing 及更新", c1: "nvidia-open", c2: "开源驱动，alpha 质量，不适用于含 AMD 集显的 hybrid 系统" },
            { c0: "其他新型号", c1: "nvidia", c2: "闭源驱动" },
            { c0: "GeForce 630 以下 ~ 400 系列", c1: "nvidia-390xx-dkms", c2: "老卡专用" },
            { c0: "更老", c1: "xf86-video-nouveau", c2: "开源驱动" },
          ]}
        />
        <p>
          <strong>关键坑</strong>：安装 NVIDIA 官方驱动后，必须编辑
          <code>/etc/mkinitcpio.conf</code>，在 HOOKS 行删除 <code>kms</code>，然后
          <code>mkinitcpio -P</code> 重新生成镜像。否则 initramfs 包含 nouveau 模块，
          与官方驱动冲突。
        </p>
        <p>
          <strong>首次启动联网安装</strong>（TTL 构建中 NVIDIA 驱动不内置）：联网 →
          安装驱动包 → 编辑 mkinitcpio.conf 删除 kms → mkinitcpio -P → 重启。
        </p>
      </Subsection>

      <Subsection index="9.2" title="安全配置">
        <Table
          caption="安全配置坑点"
          columns={[
            { key: "c0", label: "项目" },
            { key: "c1", label: "关键坑" },
          ]}
          rows={[
            { c0: "磁盘加密（LUKS）", c1: "严禁加密 EFI 分区，否则无法启动" },
            { c0: "LUKS + TPM 自动解锁", c1: "PCR7 是强制要求；部分电脑（Intel NUC）导入后无法自动解锁，需进固件禁用再启用 TPM" },
            { c0: "安全启动（Secure Boot）", c1: "enroll-keys 可能导致变砖（OpROM 带微软签名验证）；双系统用 enroll-keys -m 导入微软密钥" },
            { c0: "文件级加密（fscrypt）", c1: "严禁删除 .fscrypt 目录，否则永远无法解密" },
          ]}
        />
      </Subsection>

      <Subsection index="9.3" title="功耗控制">
        <Table
          caption="功耗控制坑点"
          columns={[
            { key: "c0", label: "项目" },
            { key: "c1", label: "关键坑" },
          ]}
          rows={[
            { c0: "TLP（笔记本必装）", c1: "与 systemd-rfkill 冲突，需 systemctl mask" },
            { c0: "电压下探（Intel Haswell+）", c1: "可能损坏硬件（逆向工程方法），风险自负；从 50mV 开始，每次加 10mV，烤机测试" },
            { c0: "降低功率墙（TDP）", c1: "package power limit is locked = 不可调，先检查 intel-rapl 的 enabled 值" },
          ]}
        />
      </Subsection>

      <Subsection index="9.4" title="文件系统（Btrfs）">
        <Table
          caption="Btrfs 坑点"
          columns={[
            { key: "c0", label: "场景" },
            { key: "c1", label: "原因" },
            { key: "c2", label: "解决" },
          ]}
          rows={[
            { c0: "Timeshift 恢复后无法挂载目录", c1: "子卷 ID 变更", c2: "fstab 中删除 subvolid=xxx，改为名称指定" },
            { c0: "Timeshift 恢复后无法挂载 boot", c1: "内核版本不一致", c2: "chroot 后重新安装/更新内核包" },
            { c0: "定时任务不生效", c1: "cron 服务未启动", c2: "systemctl enable --now cronie.service" },
          ]}
        />
      </Subsection>

      <Subsection index="9.5" title="故障排查">
        <Table
          caption="常见故障"
          columns={[
            { key: "c0", label: "问题" },
            { key: "c1", label: "原因" },
            { key: "c2", label: "解决" },
          ]}
          rows={[
            { c0: "系统没有声音", c1: "PipeWire/ALSA 未安装", c2: "安装 pipewire-pulse pipewire-alsa pipewire-jack" },
            { c0: "NVIDIA 笔记本只有 HDMI 音频", c1: "sof 驱动问题", c2: "内核启动参数加 snd_hda_intel.dmic_detect=0" },
            { c0: "关机卡住 1 分 30 秒", c1: "某进程不愿停止", c2: "DefaultTimeoutStopSec=30s + journalctl -p5 排查" },
            { c0: "升级时异常", c1: "包管理器数据库锁未释放", c2: "确认无其他包管理进程后移除数据库锁文件" },
            { c0: "滚挂了", c1: "长时间未更新 → 依赖冲突", c2: "多看官网公告，勤更新；必要时回滚快照" },
          ]}
        />
      </Subsection>
    </Section>
  );
}
