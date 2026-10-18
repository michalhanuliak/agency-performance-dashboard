import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./openapi.json",
    },
    output: {
      target: "./src/api/__generated__",
      client: "react-query",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "customInstance",
        },
      },
    },
  },
});
