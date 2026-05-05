console.log("🔧 开始加载应用...")

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

const rootElement = document.getElementById("root")
if (!rootElement) {
  document.body.innerHTML = "<h1 style='color:red;padding:20px;'>❌ 错误：找不到#root元素</h1>"
  throw new Error("找不到#root元素")
}

console.log("✅ 找到#root元素")

try {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  console.log("🎉 React应用启动成功")
} catch (error) {
  console.error("❌ React启动失败:", error)
  rootElement.innerHTML = "<h1 style='color:red;padding:20px;'>React启动失败，请检查控制台</h1>"
}