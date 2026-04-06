import {
  createTrackedFileMatcher,
  scanTextWithRules,
} from "./scan-utils.mjs";

export const renderScanConfig = {
  includedRoots: ["app/", "components/", "lib/"],
  excludedFiles: [
    "lib/security/render-scan.mjs",
    "lib/security/scan-utils.mjs",
    "lib/security/secret-scan.mjs",
  ],
  supportedExtensions: [".js", ".jsx", ".ts", ".tsx"],
};

export const dangerousRenderingRules = [
  {
    label: "dangerouslySetInnerHTML",
    regex: /\bdangerouslySetInnerHTML\b/,
    severity: "fail",
  },
  {
    label: "innerHTML assignment",
    regex: /\.innerHTML\s*=/,
    severity: "fail",
  },
  {
    label: "outerHTML assignment",
    regex: /\.outerHTML\s*=/,
    severity: "fail",
  },
  {
    label: "insertAdjacentHTML call",
    regex: /\binsertAdjacentHTML\s*\(/,
    severity: "fail",
  },
  {
    label: "document.write call",
    regex: /\bdocument\.write\s*\(/,
    severity: "fail",
  },
];

export const renderScanMatcher = createTrackedFileMatcher(renderScanConfig);

export function scanTextForDangerousRendering({ filePath, contents }) {
  return scanTextWithRules({
    filePath,
    contents,
    rules: dangerousRenderingRules,
  });
}
