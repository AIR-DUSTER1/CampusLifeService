import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      hmr: true,
      host: false,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "."),
      },
    },
    plugins: [uni()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/uni.scss";`,
        },
      },
    },
  };
});
