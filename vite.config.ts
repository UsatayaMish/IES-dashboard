import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: "192.168.166.117",
  //   port: 5173,
  // },
});
