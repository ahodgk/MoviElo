import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";
// todo catch errs and pino log them
// const vite_logger = createLogger();
// vite_logger.info = logger.info;
// vite_logger.warn = logger.warn;
// vite_logger.error = logger.error;
import { patchCssModules } from "vite-css-modules";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
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

      // FIXME: Workaround until Vinxi and Tanstack Start support CSS module
      patchCssModules(),
      cssInjectedByJsPlugin({
        cssAssetsFilterFunction: (asset) => {
          // Filter out CSS assets that are not needed for the current page
          // For example, you can exclude CSS files that are not in the "app" directory
          // Removed debugging console.log statement
          if (asset.fileName.includes("client")) {
            return true;
          }
          return false;
        },
      }),
    ],
  },
});
