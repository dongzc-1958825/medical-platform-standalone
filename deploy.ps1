Write-Host "=== 众创医案平台部署流程 ===" -ForegroundColor Green
Write-Host ("版本: 1.0.1 | 时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor Cyan

# 1. 检查构建状态
Write-Host "`n[1/4] 检查构建状态..." -ForegroundColor Yellow
if (-Not (Test-Path "docs")) {
    Write-Host "  ❌ docs 目录不存在" -ForegroundColor Red
    Write-Host "  请先运行: npm run build" -ForegroundColor Yellow
    $choice = Read-Host "  是否现在构建？(y/n)"
    if ($choice -eq "y") {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ❌ 构建失败！终止部署。" -ForegroundColor Red
            exit 1
        }
        Write-Host "  ✓ 构建成功" -ForegroundColor Green
    } else {
        Write-Host "  部署终止。" -ForegroundColor Yellow
        exit 0
    }
} else {
    $docsSize = (Get-ChildItem docs -Recurse | Measure-Object -Property Length -Sum).Sum / 1KB
    Write-Host ("  ✓ docs 存在 (" + [math]::Round($docsSize, 2) + " KB)") -ForegroundColor Green
}

# 2. 创建备份
Write-Host "`n[2/4] 创建部署前备份..." -ForegroundColor Yellow
try {
    .\backup.ps1
    Write-Host "  ✓ 备份完成" -ForegroundColor Green
} catch {
    Write-Host ("  ❌ 备份失败: " + $_) -ForegroundColor Red
    Write-Host "  继续部署吗？备份可能不完整。" -ForegroundColor Yellow
    $choice = Read-Host "  (c=继续, 其他=取消)"
    if ($choice -ne "c") {
        exit 1
    }
}

# 3. 预览验证（可选）
Write-Host "`n[3/4] 预览验证..." -ForegroundColor Yellow
Write-Host "  预览地址: http://localhost:4173" -ForegroundColor Cyan
Write-Host "  需要验证:" -ForegroundColor Gray
Write-Host "    • 首页加载 (http://localhost:4173/)" -ForegroundColor Gray
Write-Host "    • 登录页面 (http://localhost:4173/#/login)" -ForegroundColor Gray
Write-Host "    • 移动端 (http://localhost:4173/#/mobile)" -ForegroundColor Gray

$previewChoice = Read-Host "`n  是否启动预览服务器？(y=启动并验证, s=跳过验证, n=仅验证)"
if ($previewChoice -eq "y") {
    Write-Host "  启动预览服务器..." -ForegroundColor Cyan
    Start-Job -ScriptBlock { npm run preview }
    Write-Host "  等待3秒服务器启动..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
    Write-Host "  请手动验证以上功能" -ForegroundColor Cyan
    Read-Host "  按回车继续部署..."
} elseif ($previewChoice -eq "n") {
    Write-Host "  请手动验证功能后继续" -ForegroundColor Yellow
    Read-Host "  按回车继续部署..."
} else {
    Write-Host "  ⚠️ 跳过预览验证" -ForegroundColor DarkYellow
}

# 4. 部署确认与执行
Write-Host "`n[4/4] 部署确认..." -ForegroundColor Yellow
Write-Host "  当前构建信息:" -ForegroundColor Cyan
Write-Host ("    • 构建时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm")) -ForegroundColor Gray
Write-Host "    • 主文件: docs/assets/index-*.js" -ForegroundColor Gray
Write-Host "    • HTML入口: docs/index.html" -ForegroundColor Gray

Write-Host "`n  部署选项:" -ForegroundColor Cyan
Write-Host "    1. GitHub Pages (推送到 gh-pages)" -ForegroundColor Gray
Write-Host "    2. Vercel 部署" -ForegroundColor Gray
Write-Host "    3. 自定义服务器 (手动上传)" -ForegroundColor Gray
Write-Host "    4. 仅标记为可部署，稍后手动操作" -ForegroundColor Gray

$deployOption = Read-Host "`n  选择部署方式 (1-4)"
switch ($deployOption) {
    "1" {
        Write-Host "`n  部署到 GitHub Pages..." -ForegroundColor Green
        Write-Host ("  请执行: git add docs && git commit -m 'deploy: " + (Get-Date -Format "yyyyMMdd") + "' && git push") -ForegroundColor Cyan
    }
    "2" {
        Write-Host "`n  部署到 Vercel..." -ForegroundColor Green
        Write-Host "  请执行: vercel --prod" -ForegroundColor Cyan
    }
    "3" {
        Write-Host "`n  自定义服务器部署" -ForegroundColor Green
        Write-Host "  请手动上传 docs/ 目录到服务器" -ForegroundColor Cyan
    }
    "4" {
        Write-Host "`n  标记为可部署" -ForegroundColor Green
        # 创建部署标记文件
        $deployFlag = @{
            ready_for_deployment = $true
            timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
            version = "1.0.1"
            build_hash = (Get-ChildItem docs/assets/index-*.js | Select-Object -First 1).Name
        }
        $deployFlag | ConvertTo-Json | Out-File "deploy_ready.json" -Encoding UTF8
        Write-Host "  ✓ 创建标记文件: deploy_ready.json" -ForegroundColor Green
    }
    default {
        Write-Host "  ❌ 无效选项，终止部署" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✓ 部署流程完成！" -ForegroundColor Green
Write-Host ("部署时间: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")) -ForegroundColor Cyan
