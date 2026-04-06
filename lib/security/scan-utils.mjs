import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const SECURITY_SCAN_ALLOW_DIRECTIVE = "security-scan: allow";

export function hasSecurityScanAllowDirective(line) {
  return /security-scan:\s*allow\b\s+\S.+/i.test(line);
}

export function createTrackedFileMatcher({
  includedRoots = [],
  includedFiles = [],
  excludedFiles = [],
  excludedRoots = [],
  supportedExtensions = [],
}) {
  const includedFileSet = new Set(includedFiles);
  const excludedFileSet = new Set(excludedFiles);
  const extensionSet = new Set(supportedExtensions);

  return function matches(filePath) {
    if (excludedFileSet.has(filePath)) {
      return false;
    }

    if (excludedRoots.some((root) => filePath.startsWith(root))) {
      return false;
    }

    if (includedFileSet.has(filePath)) {
      return true;
    }

    if (!includedRoots.some((root) => filePath.startsWith(root))) {
      return false;
    }

    return extensionSet.has(path.extname(filePath));
  };
}

export function getTrackedFiles({ cwd = process.cwd(), matcher }) {
  const result = spawnSync("git", ["ls-files"], {
    cwd,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const errorOutput = result.stderr?.trim() || "Unable to list tracked files.";
    throw new Error(errorOutput);
  }

  return result.stdout
    .split("\n")
    .map((filePath) => filePath.trim())
    .filter(Boolean)
    .filter((filePath) => matcher(filePath));
}

export function readTrackedFile(filePath) {
  return readFileSync(filePath, "utf8");
}

export function scanTextWithRules({
  filePath,
  contents,
  rules,
  allowDirective = SECURITY_SCAN_ALLOW_DIRECTIVE,
}) {
  const lines = contents.split("\n");
  const findings = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const previousLine = index > 0 ? lines[index - 1] : "";
    const isAllowed =
      hasSecurityScanAllowDirective(line) || hasSecurityScanAllowDirective(previousLine);

    if (isAllowed) {
      continue;
    }

    for (const rule of rules) {
      if (rule.regex.test(line)) {
        findings.push({
          filePath,
          lineNumber: index + 1,
          label: rule.label,
          severity: rule.severity,
          allowDirective,
        });
      }
    }
  }

  return findings;
}

export function sortFindings(findings) {
  return [...findings].sort((left, right) => {
    if (left.filePath === right.filePath) {
      if (left.lineNumber === right.lineNumber) {
        return left.label.localeCompare(right.label);
      }

      return left.lineNumber - right.lineNumber;
    }

    return left.filePath.localeCompare(right.filePath);
  });
}

export function formatFinding(finding) {
  return `${finding.filePath}:${finding.lineNumber}: ${finding.severity}: ${finding.label}`;
}
