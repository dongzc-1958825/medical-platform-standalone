# backup.ps1 - 众创医案平台备份脚本
param(
    [string]$SourcePath = "docs",
    [int]$KeepCount = 5
)

Write-Host "=== 众创医案平台部署备份 ===" -ForegroundColor Green
Write-Host ("备份时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor Cyan

# 检查源目录
if (-Not (Test-Path $SourcePath)) {
    Write-Host "错误: 源目录 $SourcePath 不存在！" -ForegroundColor Red
    Write-Host "请先运行: npm run build" -ForegroundColor Yellow
    exit 1
}

# 创建备份目录
$backupRoot = "deploy_backups"
if (-Not (Test-Path $backupRoot)) {
    New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
}

# 生成备份文件名
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupName = "medical_platform_$timestamp"
$backupPath = Join-Path $backupRoot $backupName

# 执行备份
Write-Host "正在备份 $SourcePath ..." -ForegroundColor Yellow
try {
    Copy-Item -Path $SourcePath -Destination $backupPath -Recurse -Force
    Write-Host "✓ 备份完成: $backupPath" -ForegroundColor Green
} catch {
    Write-Host "备份失败: $_" -ForegroundColor Red
    exit 1
}

# 创建信息文件
$info = @{
    "project" = "众创医案平台";
    "version" = "1.0.1";
    "backup_time" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss");
    "source_dir" = $SourcePath;
    "build_date" = "2025-12-13";
    "backup_type" = "pre_deployment";
}
$info | ConvertTo-Json | Out-File (Join-Path $backupPath "backup_info.json") -Encoding UTF8

# 清理旧备份
Write-Host "清理旧备份（保留最近 $KeepCount 个）..." -ForegroundColor Yellow
$backups = @(Get-ChildItem $backupRoot -Directory | 
             Where-Object {$_.Name -like "medical_platform_*"} |
             Sort-Object CreationTime -Descending)

if ($backups.Count -gt $KeepCount) {
    $oldBackups = $backups | Select-Object -Skip $KeepCount
    $deletedCount = 0
    foreach ($old in $oldBackups) {
        try {
            Remove-Item $old.FullName -Recurse -Force
            $deletedCount++
        } catch {
            Write-Host "警告: 无法删除 $($old.Name)" -ForegroundColor DarkYellow
        }
    }
    if ($deletedCount -gt 0) {
        Write-Host "✓ 已清理 $deletedCount 个旧备份" -ForegroundColor Green
    }
}

# 显示统计
$totalSize = (Get-ChildItem $backupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "备份大小: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
Write-Host "当前备份数量: $(if($backups.Count -gt $KeepCount){$KeepCount}else{$backups.Count})/$KeepCount" -ForegroundColor Cyan
Write-Host "备份完成！" -ForegroundColor Green
