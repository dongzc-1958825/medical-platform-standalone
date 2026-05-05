import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// 最简配置，唯一目标：构建成功
export default defineConfig({
  plugins: [react()],
  base: "/medical-platform/", // 保持你的base
  build: {
    outDir: "docs"
    // 移除所有复杂选项，让Vite使用默认值
  }
})
