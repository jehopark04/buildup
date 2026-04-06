import { getTrackedFiles, readTrackedFile, formatFinding, sortFindings } from "../lib/security/scan-utils.mjs";
import { scanTextForSecrets, secretScanMatcher } from "../lib/security/secret-scan.mjs";

function partitionFindings(findings) {
  const failed = [];
  const warned = [];

  for (const finding of findings) {
    if (finding.severity === "fail") {
      failed.push(finding);
    } else {
      warned.push(finding);
    }
  }

  return { failed, warned };
}

try {
  const findings = getTrackedFiles({
    matcher: secretScanMatcher,
  }).flatMap((filePath) =>
    scanTextForSecrets({
      filePath,
      contents: readTrackedFile(filePath),
    }),
  );
  const orderedFindings = sortFindings(findings);
  const { failed, warned } = partitionFindings(orderedFindings);

  if (warned.length > 0) {
    console.warn("Secret scan warnings:");
    console.warn(warned.map(formatFinding).join("\n"));
  }

  if (failed.length > 0) {
    console.error("Secret scan failures:");
    console.error(failed.map(formatFinding).join("\n"));
    process.exit(1);
  }

  console.log("No high-confidence secrets found.");
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Secret scan failed unexpectedly.",
  );
  process.exit(1);
}
