# analyze-mobile-implementation.ps1
Write-Host "=== 移动端实现分析 ===" -ForegroundColor Green

# 1. 文件大小对比
Write-Host "`n1. 页面文件大小对比：" -ForegroundColor Cyan
$desktopCases = Get-Item "src\pages\CasesPage.tsx" -ErrorAction SilentlyContinue
$mobileCases = Get-Item "src\pages\mobile\MobileCasesPage.tsx" -ErrorAction SilentlyContinue

if ($desktopCases -and $mobileCases) {
    Write-Host "   桌面端 CasesPage.tsx: $($desktopCases.Length) 字节" -ForegroundColor Gray
    Write-Host "   移动端 MobileCasesPage.tsx: $($mobileCases.Length) 字节" -ForegroundColor Gray
    $ratio = [math]::Round($mobileCases.Length / $desktopCases.Length * 100, 1)
    Write-Host "   移动端是桌面端的: $ratio%" -ForegroundColor $(if ($ratio -lt 50) { "Red" } else { "Green" })
} else {
    Write-Host "   ❌ 无法找到页面文件" -ForegroundColor Red
}

# 2. 共享逻辑使用检查
Write-Host "`n2. 共享逻辑使用检查：" -ForegroundColor Cyan

if ($mobileCases) {
    Write-Host "   移动端 MobileCasesPage.tsx：" -ForegroundColor Yellow
    $mobileContent = Get-Content $mobileCases.FullName -Raw
    if ($mobileContent -match "from.*shared.*hooks") {
        Write-Host "   ✓ 导入共享Hooks" -ForegroundColor Green
        $imports = [regex]::Matches($mobileContent, "from.*shared.*hooks")
        foreach ($import in $imports) {
            Write-Host "     • $($import.Value)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ 未导入共享Hooks" -ForegroundColor Red
    }

    if ($mobileContent -match "useMedicalCases") {
        Write-Host "   ✓ 使用 useMedicalCases" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 未使用 useMedicalCases" -ForegroundColor Red
    }
}

if ($desktopCases) {
    Write-Host "`n   桌面端 CasesPage.tsx：" -ForegroundColor Yellow
    $desktopContent = Get-Content $desktopCases.FullName -Raw
    if ($desktopContent -match "from.*shared.*hooks") {
        Write-Host "   ✓ 导入共享Hooks" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 未导入共享Hooks" -ForegroundColor Red
    }
}

# 3. 移动端页面完整性检查
Write-Host "`n3. 移动端页面完整性：" -ForegroundColor Cyan
$mobilePages = Get-ChildItem "src\pages\mobile\*.tsx" -Exclude "*backup*" -ErrorAction SilentlyContinue
$corePages = @("MobileCasesPage", "MobileCaseDetailPage", "MobileLoginPage", "MobileProfilePage", "MobileHomePage")

if ($mobilePages) {
    Write-Host "   现有移动端页面 ($($mobilePages.Count) 个)：" -ForegroundColor Gray
    foreach ($page in $mobilePages) {
        $name = $page.BaseName
        $size = $page.Length
        $status = if ($size -gt 2000) { "✓" } elseif ($size -gt 500) { "⚠️" } else { "❌" }
        Write-Host "   $status $name ($size 字节)" -ForegroundColor $(if ($size -gt 2000) { "Green" } elseif ($size -gt 500) { "Yellow" } else { "Red" })
    }
} else {
    Write-Host "   ⚠️ 未找到移动端页面" -ForegroundColor Yellow
}

Write-Host "`n   缺失的核心页面：" -ForegroundColor Gray
foreach ($corePage in $corePages) {
    $exists = Test-Path "src\pages\mobile\$corePage.tsx"
    if (-not $exists) {
        Write-Host "   ❌ $corePage" -ForegroundColor Red
    }
}

# 4. 内容预览
Write-Host "`n4. 移动端 CasesPage 内容预览：" -ForegroundColor Cyan
if ($mobileCases) {
    Write-Host "   前 30 行：" -ForegroundColor Gray
    Get-Content $mobileCases.FullName | Select-Object -First 30 | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Gray
    }
}

# 5. 路由检查
Write-Host "`n5. 路由配置检查：" -ForegroundColor Cyan
if (Test-Path "src\App.tsx") {
    $appContent = Get-Content "src\App.tsx" -Raw
    $mobileRoutes = [regex]::Matches($appContent, "path.*?=.*?[\""'].*?mobile.*?[\""']")
    if ($mobileRoutes.Count -gt 0) {
        Write-Host "   移动端路由 ($($mobileRoutes.Count) 个)：" -ForegroundColor Gray
        foreach ($route in $mobileRoutes) {
            $path = $route.Value -replace ".*[\""']", "" -replace "[\""'].*", ""
            Write-Host "   • $path" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️ 未找到移动端路由" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ App.tsx 不存在" -ForegroundColor Red
}

Write-Host "`n=== 分析完成 ===" -ForegroundColor Green
