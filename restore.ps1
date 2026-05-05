Write-Host "=== 众创医案平台备份恢复 ===" -ForegroundColor Green
Write-Host ("恢复时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor Cyan

# 检查备份目录
if (-Not (Test-Path "deploy_backups")) {
    Write-Host "❌ 错误: 备份目录不存在！" -ForegroundColor Red
    exit 1
}

# 获取所有备份
$backups = @(Get-ChildItem "deploy_backups" -Directory | 
             Where-Object {$_.Name -like "medical_platform_*"} |
             Sort-Object CreationTime -Descending)

if ($backups.Count -eq 0) {
    Write-Host "❌ 错误: 没有找到备份！" -ForegroundColor Red
    exit 1
}

# 显示备份列表
Write-Host "`n可用备份 ($($backups.Count) 个):" -ForegroundColor Yellow
for ($i = 0; $i -lt $backups.Count; $i++) {
    $backup = $backups[$i]
    $infoFile = Join-Path $backup.FullName "backup_info.json"
    $timeStr = ""
    $sizeStr = ""
    
    if (Test-Path $infoFile) {
        try {
            $info = Get-Content $infoFile -Raw | ConvertFrom-Json
            $timeStr = $info.backup_time
        } catch {
            $timeStr = "信息读取失败"
        }
    }
    
    $sizeMB = [math]::Round((Get-ChildItem $backup.FullName -Recurse | Measure-Object Length -Sum).Sum / 1MB, 2)
    $sizeStr = "$sizeMB MB"
    
    Write-Host "  [$i] $($backup.Name)" -ForegroundColor Cyan
    Write-Host "      时间: $timeStr | 大小: $sizeStr" -ForegroundColor Gray
}

# 选择备份
Write-Host "`n选择要恢复的备份：" -ForegroundColor Yellow
try {
    $choice = Read-Host "输入备份编号 (0-$($backups.Count-1))"
    $index = [int]$choice
    if ($index -lt 0 -or $index -ge $backups.Count) {
        throw "编号超出范围"
    }
} catch {
    Write-Host "❌ 无效的选择: $choice" -ForegroundColor Red
    exit 1
}

$selectedBackup = $backups[$index]
Write-Host "`n选择的备份: $($selectedBackup.Name)" -ForegroundColor Green

# 显示备份详情
$infoFile = Join-Path $selectedBackup.FullName "backup_info.json"
if (Test-Path $infoFile) {
    $info = Get-Content $infoFile -Raw | ConvertFrom-Json
    Write-Host "备份信息:" -ForegroundColor Cyan
    $info.PSObject.Properties | ForEach-Object {
        Write-Host "  • $($_.Name): $($_.Value)" -ForegroundColor Gray
    }
}

# 确认恢复
Write-Host "`n⚠️ 警告: 恢复操作将替换当前 docs 目录" -ForegroundColor Red
$confirm = Read-Host "确认恢复此备份吗？(输入 'yes' 确认)"
if ($confirm -ne "yes") {
    Write-Host "恢复取消。" -ForegroundColor Yellow
    exit 0
}

# 备份当前 docs（如果存在）
if (Test-Path "docs") {
    $currentBackup = "docs_backup_before_restore_" + (Get-Date -Format "yyyyMMdd-HHmmss")
    Write-Host "`n备份当前 docs 到: $currentBackup" -ForegroundColor Yellow
    try {
        Copy-Item -Path "docs" -Destination $currentBackup -Recurse -Force
        Write-Host "✓ 当前版本已备份" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ 当前版本备份失败，继续恢复吗？" -ForegroundColor Red
        $continue = Read-Host "(c=继续, 其他=取消)"
        if ($continue -ne "c") {
            exit 1
        }
    }
}

# 执行恢复
Write-Host "`n正在恢复备份..." -ForegroundColor Yellow
try {
    # 删除当前 docs
    if (Test-Path "docs") {
        Remove-Item "docs" -Recurse -Force -ErrorAction Stop
    }
    
    # 从备份恢复
    $backupDocsPath = Join-Path $selectedBackup.FullName "docs"
    if (-Not (Test-Path $backupDocsPath)) {
        throw "备份中找不到 docs 目录"
    }
    
    Copy-Item -Path $backupDocsPath -Destination "docs" -Recurse -Force
    Write-Host "✓ 恢复成功！" -ForegroundColor Green
    
    # 显示恢复信息
    $restoredSize = (Get-ChildItem "docs" -Recurse | Measure-Object Length -Sum).Sum / 1KB
    Write-Host "`n恢复完成:" -ForegroundColor Cyan
    Write-Host ("  • 恢复自: " + $selectedBackup.Name) -ForegroundColor Gray
    Write-Host ("  • 恢复时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor Gray
    Write-Host ("  • 恢复大小: " + [math]::Round($restoredSize, 2) + " KB") -ForegroundColor Gray
    if (Test-Path $currentBackup) {
        Write-Host ("  • 原版本备份在: " + $currentBackup) -ForegroundColor Gray
    }
    
} catch {
    Write-Host ("❌ 恢复失败: " + $_) -ForegroundColor Red
    
    # 尝试恢复原备份
    if (Test-Path $currentBackup) {
        Write-Host "尝试恢复原始版本..." -ForegroundColor Yellow
        try {
            Remove-Item "docs" -Recurse -Force -ErrorAction SilentlyContinue
            Copy-Item -Path $currentBackup -Destination "docs" -Recurse -Force
            Write-Host "✓ 已恢复原始版本" -ForegroundColor Green
        } catch {
            Write-Host "❌ 恢复原始版本也失败" -ForegroundColor Red
        }
    }
    exit 1
}

Write-Host "`n恢复流程完成！" -ForegroundColor Green
