import { getTrackedFiles, readTrackedFile, formatFinding, sortFindings } from "../lib/security/scan-utils.mjs";
import {
  renderScanMatcher,
  scanTextForDangerousRendering,
} from "../lib/security/render-scan.mjs";

try {
  const findings = getTrackedFiles({
    matcher: renderScanMatcher,
  }).flatMap((filePath) =>
    scanTextForDangerousRendering({
      filePath,
      contents: readTrackedFile(filePath),
    }),
  );
  const orderedFindings = sortFindings(findings);

  if (orderedFindings.length > 0) {
    console.error("Dangerous rendering patterns found:");
    console.error(orderedFindings.map(formatFinding).join("\n"));
    process.exit(1);
  }

  console.log("No dangerous rendering patterns found.");
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : "Dangerous rendering scan failed unexpectedly.",
  );
  process.exit(1);
}
