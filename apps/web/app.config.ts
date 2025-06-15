import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
// todo catch errs and pino log them
// const vite_logger = createLogger();
// vite_logger.info = logger.info;
// vite_logger.warn = logger.warn;
// vite_logger.error = logger.error;
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    // build: {
    //   cssMinify: "lightningcss",
    // },

    // css: {
    //   transformer: "lightningcss",
    //   lightningcss: {
    //     targets: browserslistToTargets(browserslist(">= 0.25%")),
    //   },
    // },
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
