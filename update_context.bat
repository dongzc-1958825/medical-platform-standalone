@echo off
chcp 65001 >nul
setlocal

echo ===============================================
echo    🏥 医案平台 - 更新项目上下文文档
echo ===============================================

echo.
echo 🔄 备份当前文档...
set "timestamp=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%"
set "timestamp=%timestamp: =0%"
copy "PROJECT_CONTEXT.md" "PROJECT_CONTEXT_backup_%timestamp%.md" >nul
echo ✅ 备份完成: PROJECT_CONTEXT_backup_%timestamp%.md

echo.
echo 📝 打开文档进行编辑...
echo   请更新内容后保存并关闭记事本
echo.
start notepad "PROJECT_CONTEXT.md"
pause

echo.
echo ✅ 文档更新完成！
echo.
echo 📋 当前项目状态摘要：
echo    - PWA配置已完成
echo    - 移动端医案详情页面开发中
echo    - 基础图标文件已创建
echo    - Service Worker已配置
echo.
pause