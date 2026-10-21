/** 构建与本地遥测配置；路由：/，数据来自仓库快照。 */
import { localizedPages } from "./scripts/localized-plugin.ts";
import { defineConfig } from "vite";
import { agentEyes } from "vite-plugin-agent-eyes";
export default defineConfig({
  plugins: [...agentEyes(), localizedPages()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        brand: "brand.html",
        standards: "standards.html",
      },
    },
  },
  server: { port: 5179, strictPort: true },
});
