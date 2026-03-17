import { existsSync, rmSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const workspaceRoot = process.cwd();
const lockPath = path.join(workspaceRoot, ".next", "dev", "lock");

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getStaleProcessIds() {
  const escapedRoot = escapeForRegex(workspaceRoot);

  try {
    if (process.platform === "win32") {
      const script = [
        `$rootPattern = '${escapedRoot.replace(/'/g, "''")}'`,
        "$processes = Get-CimInstance Win32_Process | Where-Object {",
        "  $_.ProcessId -ne $PID -and",
        "  $_.Name -match 'node|cmd' -and",
        "  $_.CommandLine -match $rootPattern -and",
        "  $_.CommandLine -match 'next dev|next\\\\dist\\\\server\\\\lib\\\\start-server'",
        "} | Select-Object -ExpandProperty ProcessId",
        "$processes -join ','",
      ].join("; ");

      const raw = execFileSync("powershell.exe", ["-NoProfile", "-Command", script], {
        cwd: workspaceRoot,
        encoding: "utf8",
      }).trim();

      return raw
        .split(",")
        .map((entry) => Number(entry.trim()))
        .filter((entry) => Number.isInteger(entry) && entry > 0);
    }

    const raw = execFileSync("pgrep", ["-f", `${workspaceRoot}.*next( dev|/dist/server/lib/start-server)`], {
      cwd: workspaceRoot,
      encoding: "utf8",
    }).trim();

    return raw
      .split(/\s+/)
      .map((entry) => Number(entry.trim()))
      .filter((entry) => Number.isInteger(entry) && entry > 0 && entry !== process.pid);
  } catch {
    return [];
  }
}

function stopProcesses(processIds) {
  for (const processId of processIds) {
    try {
      process.kill(processId, "SIGTERM");
    } catch {
      // Ignore processes that already exited.
    }
  }
}

const staleProcessIds = getStaleProcessIds();

if (staleProcessIds.length > 0) {
  console.log(`[dev-safe] Closing stale Next.js processes: ${staleProcessIds.join(", ")}`);
  stopProcesses(staleProcessIds);
}

if (existsSync(lockPath)) {
  rmSync(lockPath, { force: true });
  console.log("[dev-safe] Removed stale .next/dev/lock");
}

const nextBin = path.join(workspaceRoot, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev"], {
  cwd: workspaceRoot,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
