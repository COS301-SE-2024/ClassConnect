// vite.config.ts
import { defineConfig } from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/vite/dist/node/index.js";
import { sveltekit } from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { svelteTesting } from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/@testing-library/svelte/src/vite.js";
import image from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/@rollup/plugin-image/dist/es/index.js";
import json from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/@rollup/plugin-json/dist/es/index.js";
import { terser } from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/rollup-plugin-terser/rollup-plugin-terser.mjs";
import viteImageMin from "file:///home/prokingk/Projects/School/COS301/classconnect/src/node_modules/vite-plugin-imagemin/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    sveltekit(),
    svelteTesting(),
    image(),
    json(),
    terser(),
    // Minify JavaScript
    viteImageMin({
      // Optimize images
      gifsicle: {
        optimizationLevel: 7
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false
          },
          {
            name: "addAttributesToSVGElement",
            params: {
              attributes: [{ xmlns: "http://www.w3.org/2000/svg" }]
            }
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"]
    }
  },
  ssr: {
    noExternal: ["three"]
  },
  build: {
    sourcemap: false,
    // Remove source maps
    rollupOptions: {
      external: ["bun.lockb"]
      // Exclude bun.lockb or any other binary files
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9raW5nay9Qcm9qZWN0cy9TY2hvb2wvQ09TMzAxL2NsYXNzY29ubmVjdC9zcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2tpbmdrL1Byb2plY3RzL1NjaG9vbC9DT1MzMDEvY2xhc3Njb25uZWN0L3NyYy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcm9raW5nay9Qcm9qZWN0cy9TY2hvb2wvQ09TMzAxL2NsYXNzY29ubmVjdC9zcmMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XG5pbXBvcnQgeyBzdmVsdGVUZXN0aW5nIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9zdmVsdGUvdml0ZSc7XG5pbXBvcnQgaW1hZ2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4taW1hZ2UnO1xuaW1wb3J0IGpzb24gZnJvbSAnQHJvbGx1cC9wbHVnaW4tanNvbic7XG5pbXBvcnQgeyB0ZXJzZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXRlcnNlcic7XG5pbXBvcnQgdml0ZUltYWdlTWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJzsgLy8gRm9yIG9wdGltaXppbmcgaW1hZ2VzXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtcblx0XHRzdmVsdGVraXQoKSxcblx0XHRzdmVsdGVUZXN0aW5nKCksXG5cdFx0aW1hZ2UoKSxcblx0XHRqc29uKCksXG5cdFx0dGVyc2VyKCksIC8vIE1pbmlmeSBKYXZhU2NyaXB0XG5cdFx0dml0ZUltYWdlTWluKHtcblx0XHRcdC8vIE9wdGltaXplIGltYWdlc1xuXHRcdFx0Z2lmc2ljbGU6IHtcblx0XHRcdFx0b3B0aW1pemF0aW9uTGV2ZWw6IDdcblx0XHRcdH0sXG5cdFx0XHRvcHRpcG5nOiB7XG5cdFx0XHRcdG9wdGltaXphdGlvbkxldmVsOiA3XG5cdFx0XHR9LFxuXHRcdFx0bW96anBlZzoge1xuXHRcdFx0XHRxdWFsaXR5OiAyMFxuXHRcdFx0fSxcblx0XHRcdHBuZ3F1YW50OiB7XG5cdFx0XHRcdHF1YWxpdHk6IFswLjY1LCAwLjhdLFxuXHRcdFx0XHRzcGVlZDogNFxuXHRcdFx0fSxcblx0XHRcdHN2Z286IHtcblx0XHRcdFx0cGx1Z2luczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6ICdyZW1vdmVWaWV3Qm94Jyxcblx0XHRcdFx0XHRcdGFjdGl2ZTogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG5hbWU6ICdhZGRBdHRyaWJ1dGVzVG9TVkdFbGVtZW50Jyxcblx0XHRcdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdFx0XHRhdHRyaWJ1dGVzOiBbeyB4bWxuczogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB9XVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0pXG5cdF0sXG5cdHRlc3Q6IHtcblx0XHRnbG9iYWxzOiB0cnVlLFxuXHRcdGVudmlyb25tZW50OiAnanNkb20nLFxuXHRcdHNldHVwRmlsZXM6IFsnLi92aXRlc3Qtc2V0dXAudHMnXSxcblx0XHRjb3ZlcmFnZToge1xuXHRcdFx0cmVwb3J0ZXI6IFsndGV4dCcsICdqc29uJywgJ2h0bWwnXVxuXHRcdH1cblx0fSxcblx0c3NyOiB7XG5cdFx0bm9FeHRlcm5hbDogWyd0aHJlZSddXG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0c291cmNlbWFwOiBmYWxzZSwgLy8gUmVtb3ZlIHNvdXJjZSBtYXBzXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0ZXh0ZXJuYWw6IFsnYnVuLmxvY2tiJ10gLy8gRXhjbHVkZSBidW4ubG9ja2Igb3IgYW55IG90aGVyIGJpbmFyeSBmaWxlc1xuXHRcdH1cblx0fVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9WLFNBQVMsb0JBQW9CO0FBQ2pYLFNBQVMsaUJBQWlCO0FBQzFCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sa0JBQWtCO0FBRXpCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLGNBQWM7QUFBQSxJQUNkLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxJQUNMLE9BQU87QUFBQTtBQUFBLElBQ1AsYUFBYTtBQUFBO0FBQUEsTUFFWixVQUFVO0FBQUEsUUFDVCxtQkFBbUI7QUFBQSxNQUNwQjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1IsbUJBQW1CO0FBQUEsTUFDcEI7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNWO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDVCxTQUFTLENBQUMsTUFBTSxHQUFHO0FBQUEsUUFDbkIsT0FBTztBQUFBLE1BQ1I7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNMLFNBQVM7QUFBQSxVQUNSO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixRQUFRO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLFFBQVE7QUFBQSxjQUNQLFlBQVksQ0FBQyxFQUFFLE9BQU8sNkJBQTZCLENBQUM7QUFBQSxZQUNyRDtBQUFBLFVBQ0Q7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLElBQ0QsQ0FBQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNMLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyxtQkFBbUI7QUFBQSxJQUNoQyxVQUFVO0FBQUEsTUFDVCxVQUFVLENBQUMsUUFBUSxRQUFRLE1BQU07QUFBQSxJQUNsQztBQUFBLEVBQ0Q7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNKLFlBQVksQ0FBQyxPQUFPO0FBQUEsRUFDckI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLFdBQVc7QUFBQTtBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2QsVUFBVSxDQUFDLFdBQVc7QUFBQTtBQUFBLElBQ3ZCO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
