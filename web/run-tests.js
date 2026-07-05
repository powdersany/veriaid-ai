/* eslint-disable @typescript-eslint/no-require-imports */
const { runE2ETest, runEdgeCaseTests } = require("./src/lib/test-utils.js");

(async () => {
  console.log("=== E2E HAPPY PATH TEST ===");
  const e2e = await runE2ETest();
  console.log(e2e.success ? "✅ SUCCESS" : "❌ FAILED");
  console.log(e2e.steps.join("\n"));

  console.log("\n=== EDGE CASE TESTS ===");
  const edge = await runEdgeCaseTests();
  edge.forEach(r => {
    console.log(`${r.success ? "✅" : "❌"} ${r.name}: ${r.error || "OK"}`);
  });
})();