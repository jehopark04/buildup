import {
  createTrackedFileMatcher,
  scanTextWithRules,
} from "./scan-utils.mjs";

export const secretScanConfig = {
  includedRoots: [
    ".github/",
    "app/",
    "components/",
    "docs/",
    "lib/",
    "scripts/",
  ],
  includedFiles: [
    "README.md",
    "eslint.config.mjs",
    "next.config.ts",
    "package.json",
    "tsconfig.json",
    "vitest.config.mts",
  ],
  excludedFiles: [
    "package-lock.json",
    "lib/security/render-scan.mjs",
    "lib/security/scan-utils.mjs",
    "lib/security/secret-scan.mjs",
    "scripts/check-dangerous-rendering.mjs",
    "scripts/check-secrets.mjs",
  ],
  supportedExtensions: [
    ".cjs",
    ".cts",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mdx",
    ".mjs",
    ".mts",
    ".ts",
    ".tsx",
    ".yaml",
    ".yml",
  ],
};

export const secretFailRules = [
  {
    label: "DATABASE_URL assignment",
    regex: /\bDATABASE_URL\s*=\s*['"`]?[^\s'"`]+/,
    severity: "fail",
  },
  {
    label: "API_KEY assignment",
    regex: /\b(?:[A-Z0-9_]*_)?API_KEY\s*=\s*['"`]?[^\s'"`]+/,
    severity: "fail",
  },
  {
    label: "SECRET_KEY assignment",
    regex: /\bSECRET_KEY\s*=\s*['"`]?[^\s'"`]+/,
    severity: "fail",
  },
  {
    label: "JWT_SECRET assignment",
    regex: /\bJWT_SECRET\s*=\s*['"`]?[^\s'"`]+/,
    severity: "fail",
  },
  {
    label: "DB_PASSWORD assignment",
    regex: /\bDB_PASSWORD\s*=\s*['"`]?[^\s'"`]+/,
    severity: "fail",
  },
  {
    label: "private key block",
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    severity: "fail",
  },
  {
    label: "AWS access key",
    regex: /\bAKIA[0-9A-Z]{16}\b/,
    severity: "fail",
  },
  {
    label: "OpenAI-style secret token",
    regex: /\bsk-[A-Za-z0-9_-]{10,}\b/,
    severity: "fail",
  },
  {
    label: "Bearer token literal",
    regex: /\bBearer\s+[A-Za-z0-9._-]{16,}\b/,
    severity: "fail",
  },
];

export const secretWarnRules = [
  {
    label: "DATABASE_URL identifier",
    regex: /\bDATABASE_URL\b/,
    severity: "warn",
  },
  {
    label: "API_KEY identifier",
    regex: /\bAPI_KEY\b/,
    severity: "warn",
  },
  {
    label: "SECRET_KEY identifier",
    regex: /\bSECRET_KEY\b/,
    severity: "warn",
  },
  {
    label: "JWT_SECRET identifier",
    regex: /\bJWT_SECRET\b/,
    severity: "warn",
  },
  {
    label: "DB_PASSWORD identifier",
    regex: /\bDB_PASSWORD\b/,
    severity: "warn",
  },
];

export const secretScanMatcher = createTrackedFileMatcher(secretScanConfig);

export function scanTextForSecrets({ filePath, contents }) {
  const failFindings = scanTextWithRules({
    filePath,
    contents,
    rules: secretFailRules,
  });
  const failedLines = new Set(failFindings.map((finding) => finding.lineNumber));
  const warnFindings = scanTextWithRules({
    filePath,
    contents,
    rules: secretWarnRules,
  }).filter((finding) => !failedLines.has(finding.lineNumber));

  return [...failFindings, ...warnFindings];
}
