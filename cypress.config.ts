import { defineConfig } from "cypress";

export default defineConfig({
  // reporter: 'mochawesome',
  reporterOptions: {
    "charts": true,
    "overwrite": false,
    "html": false,
    "json": true,
    "reportDir": "cypress/results"
   },
  projectId: '5rdk4x',
  requestTimeout: 60000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
