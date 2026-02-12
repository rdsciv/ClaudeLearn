#!/usr/bin/env node

import * as readline from "readline";
import { execSync, spawn } from "child_process";
import { platform } from "os";

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  terra: "\x1b[38;2;218;119;86m",
};

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

clearScreen();

console.log(`
${c.terra}${c.bold}    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║   ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗      ║
    ║  ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝      ║
    ║  ██║     ██║     ███████║██║   ██║██║  ██║█████╗        ║
    ║  ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝        ║
    ║  ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗      ║
    ║   ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝      ║
    ║                                                          ║
    ║          L E A R N  ·  B U I L D  ·  I M P A C T         ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝${c.reset}

  ${c.bold}Choose your experience:${c.reset}

    ${c.yellow}${c.bold}1${c.reset}  ${c.bold}Terminal Version${c.reset}
       ${c.dim}Interactive CLI with quizzes, XP, and badges${c.reset}
       ${c.dim}Right here in your terminal${c.reset}

    ${c.yellow}${c.bold}2${c.reset}  ${c.bold}Web Version${c.reset}
       ${c.dim}Beautiful browser experience with Claude's brand styling${c.reset}
       ${c.dim}Opens in your default browser${c.reset}
`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`  ${c.cyan}${c.bold}Enter 1 or 2: ${c.reset}`, (answer) => {
  rl.close();
  const choice = answer.trim();

  if (choice === "1") {
    console.log(`\n  ${c.green}Launching terminal version...${c.reset}\n`);
    const child = spawn("node", ["learn.mjs"], {
      stdio: "inherit",
      cwd: import.meta.dirname,
    });
    child.on("exit", (code) => process.exit(code ?? 0));
  } else if (choice === "2") {
    console.log(`\n  ${c.green}Opening web version in your browser...${c.reset}`);
    const filePath = new URL("index.html", import.meta.url).pathname;
    const os = platform();
    try {
      if (os === "darwin") {
        execSync(`open "${filePath}"`);
      } else if (os === "win32") {
        execSync(`start "" "${filePath}"`);
      } else {
        execSync(`xdg-open "${filePath}"`);
      }
      console.log(`  ${c.dim}Opened! Check your browser.${c.reset}\n`);
    } catch {
      console.log(`\n  ${c.dim}Couldn't auto-open. Open this file in your browser:${c.reset}`);
      console.log(`  ${c.cyan}${filePath}${c.reset}\n`);
    }
    process.exit(0);
  } else {
    console.log(`\n  ${c.dim}Invalid choice. Run again with: npm start${c.reset}\n`);
    process.exit(1);
  }
});
