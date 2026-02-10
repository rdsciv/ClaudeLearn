#!/usr/bin/env node

import * as readline from "readline";
import { readFileSync, writeFileSync, existsSync } from "fs";

// ─── Colors & Formatting ────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgGreen: "\x1b[42m",
  bgCyan: "\x1b[46m",
};

const PROGRESS_FILE = ".claude-learn-progress.json";

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf-8"));
  }
  return { completedLessons: [], xp: 0, level: 1, badges: [], streak: 0, lastDate: null };
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typewrite(text, speed = 18) {
  for (const ch of text) {
    process.stdout.write(ch);
    await sleep(speed);
  }
  console.log();
}

function banner() {
  console.log(`
${c.cyan}${c.bold}    ╔══════════════════════════════════════════════════════════╗
    ║                                                          ║
    ║   ██████╗██╗      █████╗ ██╗   ██╗██████╗ ███████╗      ║
    ║  ██╔════╝██║     ██╔══██╗██║   ██║██╔══██╗██╔════╝      ║
    ║  ██║     ██║     ███████║██║   ██║██║  ██║█████╗        ║
    ║  ██║     ██║     ██╔══██║██║   ██║██║  ██║██╔══╝        ║
    ║  ╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝███████╗      ║
    ║   ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝      ║
    ║                                                          ║
    ║       ${c.yellow}L E A R N${c.cyan}   ·   ${c.green}B U I L D${c.cyan}   ·   ${c.magenta}I M P A C T${c.cyan}       ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝${c.reset}
  `);
}

function statusBar(progress) {
  const xpForNext = progress.level * 100;
  const pct = Math.min(100, Math.floor((progress.xp / xpForNext) * 100));
  const filled = Math.floor(pct / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  const badges = progress.badges.length > 0 ? progress.badges.join(" ") : "(none yet)";
  console.log(`${c.dim}────────────────────────────────────────────────────────────────${c.reset}`);
  console.log(
    `  ${c.yellow}${c.bold}Level ${progress.level}${c.reset}  ${c.cyan}[${bar}]${c.reset} ${c.bold}${progress.xp}/${xpForNext} XP${c.reset}   ${c.green}Badges: ${badges}${c.reset}`
  );
  console.log(
    `  ${c.dim}Lessons completed: ${progress.completedLessons.length}/${lessons.length}${c.reset}`
  );
  console.log(`${c.dim}────────────────────────────────────────────────────────────────${c.reset}`);
}

function ask(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

// ─── Lesson Definitions ─────────────────────────────────────────────
const lessons = [
  {
    id: "intro",
    title: "What is Claude Code?",
    icon: "01",
    category: "Foundations",
    xp: 50,
    badge: null,
    content: `
${c.bold}${c.cyan}Welcome to the world of Claude Code!${c.reset}

Claude Code is an ${c.bold}agentic AI coding assistant${c.reset} that lives in your terminal.
It can read your files, write code, run commands, search the web,
and work with you to build real software — all through conversation.

${c.yellow}Key Superpowers:${c.reset}
  ${c.green}*${c.reset} Read and understand entire codebases
  ${c.green}*${c.reset} Write, edit, and refactor code across multiple files
  ${c.green}*${c.reset} Run terminal commands (build, test, deploy)
  ${c.green}*${c.reset} Search the web for up-to-date documentation
  ${c.green}*${c.reset} Plan complex implementations before writing code
  ${c.green}*${c.reset} Debug errors by reading stack traces and logs

${c.magenta}Think of it as pair programming with an AI that never gets tired,
has read billions of lines of code, and genuinely wants to help
you build things that matter.${c.reset}
`,
    quiz: [
      {
        q: "What is Claude Code's primary interface?",
        options: ["A) A web browser", "B) The terminal / command line", "C) A desktop GUI", "D) A mobile app"],
        answer: 1,
        explanation: "Claude Code lives in your terminal. You interact with it through natural conversation right in your CLI.",
      },
      {
        q: "Which of these can Claude Code NOT do?",
        options: [
          "A) Read and write files",
          "B) Run terminal commands",
          "C) Physically build hardware",
          "D) Search the web",
        ],
        answer: 2,
        explanation: "Claude Code is a software tool — it can do incredible things with code and commands, but hardware is still on you!",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started & First Commands",
    icon: "02",
    category: "Foundations",
    xp: 75,
    badge: "Launcher",
    content: `
${c.bold}${c.cyan}Launching Claude Code${c.reset}

To start Claude Code, simply open your terminal and type:

  ${c.green}$ claude${c.reset}

That's it! Claude Code starts in your current directory and is ready
to help. Here are the essential first commands:

${c.yellow}Starting a conversation:${c.reset}
  ${c.green}$ claude${c.reset}                    # Start interactive mode
  ${c.green}$ claude "fix the login bug"${c.reset} # Start with a specific task
  ${c.green}$ claude -r${c.reset}                  # Resume your last conversation

${c.yellow}Helpful slash commands inside Claude Code:${c.reset}
  ${c.green}/help${c.reset}       Show all available commands
  ${c.green}/clear${c.reset}      Clear conversation history
  ${c.green}/compact${c.reset}    Summarize conversation to save context
  ${c.green}/cost${c.reset}       See token usage and costs

${c.yellow}Pro tip:${c.reset} You can pipe input directly:
  ${c.green}$ cat error.log | claude "explain this error"${c.reset}
  ${c.green}$ git diff | claude "review these changes"${c.reset}
`,
    quiz: [
      {
        q: "How do you resume your last Claude Code conversation?",
        options: ["A) claude --last", "B) claude -r", "C) claude resume", "D) claude --continue"],
        answer: 1,
        explanation: "The -r flag (short for --resume) picks up exactly where you left off.",
      },
      {
        q: 'What does the "/compact" command do?',
        options: [
          "A) Makes the terminal smaller",
          "B) Compresses your files",
          "C) Summarizes conversation to save context",
          "D) Deletes old messages",
        ],
        answer: 2,
        explanation: "/compact summarizes the conversation so far, freeing up context window space for longer sessions.",
      },
    ],
  },
  {
    id: "reading-code",
    title: "Exploring & Understanding Code",
    icon: "03",
    category: "Core Skills",
    xp: 75,
    badge: null,
    content: `
${c.bold}${c.cyan}Let Claude Code Be Your Codebase Guide${c.reset}

One of Claude Code's greatest strengths is understanding existing code.
You don't need to explain your project — just ask.

${c.yellow}Try asking:${c.reset}
  ${c.green}"What does this codebase do?"${c.reset}
  ${c.green}"How is authentication handled?"${c.reset}
  ${c.green}"Walk me through the data flow from API to UI"${c.reset}
  ${c.green}"Where is the database connection configured?"${c.reset}

${c.yellow}How Claude Code Explores:${c.reset}
  ${c.green}*${c.reset} ${c.bold}Glob${c.reset} — Finds files by name patterns (e.g., all *.tsx files)
  ${c.green}*${c.reset} ${c.bold}Grep${c.reset} — Searches file contents for specific code
  ${c.green}*${c.reset} ${c.bold}Read${c.reset} — Opens and reads specific files
  ${c.green}*${c.reset} ${c.bold}Bash${c.reset} — Runs commands like git log, tree, etc.

${c.magenta}Real-world example:${c.reset}
  You: "I just joined this team. Explain the project architecture."
  Claude Code: *reads package.json, explores directories, reads key files*
  Claude Code: "This is a Next.js app with a PostgreSQL database..."

${c.yellow}This is incredibly powerful for:${c.reset}
  - Onboarding onto new projects
  - Understanding legacy code
  - Finding where a bug might live
  - Learning how open-source projects work
`,
    quiz: [
      {
        q: "What's a great first question to ask Claude Code about a new codebase?",
        options: [
          'A) "Delete everything and start over"',
          'B) "What does this codebase do?"',
          'C) "Write me a new app"',
          'D) "How many lines of code are there?"',
        ],
        answer: 1,
        explanation: 'Asking "What does this codebase do?" lets Claude explore and give you a high-level understanding before diving deeper.',
      },
      {
        q: "Which tool does Claude Code use to search inside file contents?",
        options: ["A) Glob", "B) Read", "C) Grep", "D) Find"],
        answer: 2,
        explanation: "Grep searches file contents for patterns. Glob finds files by name. Read opens specific files.",
      },
    ],
  },
  {
    id: "writing-code",
    title: "Writing & Editing Code",
    icon: "04",
    category: "Core Skills",
    xp: 100,
    badge: "Builder",
    content: `
${c.bold}${c.cyan}Building With Claude Code${c.reset}

Claude Code doesn't just talk about code — it ${c.bold}writes it${c.reset}.
It can create new files, edit existing ones, and refactor across
your entire project.

${c.yellow}Creating new code:${c.reset}
  ${c.green}"Create a REST API endpoint for user registration"${c.reset}
  ${c.green}"Add a React component for a search bar with autocomplete"${c.reset}
  ${c.green}"Write a Python script that processes CSV files"${c.reset}

${c.yellow}Editing existing code:${c.reset}
  ${c.green}"Add input validation to the signup form"${c.reset}
  ${c.green}"Refactor this function to use async/await"${c.reset}
  ${c.green}"Fix the SQL injection vulnerability in the login query"${c.reset}

${c.yellow}How it works:${c.reset}
  1. Claude reads the relevant files first (context is key!)
  2. It uses ${c.bold}Edit${c.reset} for surgical changes to existing files
  3. It uses ${c.bold}Write${c.reset} for creating new files
  4. You review the diff and approve or request changes

${c.magenta}Best practices:${c.reset}
  ${c.green}*${c.reset} Be specific about what you want
  ${c.green}*${c.reset} Mention the language/framework if it matters
  ${c.green}*${c.reset} Ask Claude to follow existing patterns in your codebase
  ${c.green}*${c.reset} Review changes before committing — you're still the pilot!
`,
    quiz: [
      {
        q: "What should Claude Code do BEFORE editing a file?",
        options: [
          "A) Delete the old version",
          "B) Read the file to understand existing code",
          "C) Create a backup in the cloud",
          "D) Ask permission from GitHub",
        ],
        answer: 1,
        explanation: "Claude Code always reads files first to understand the existing code and patterns before making changes.",
      },
      {
        q: "What's the best way to get good results when asking Claude Code to write code?",
        options: [
          'A) Just say "write some code"',
          "B) Be specific about what you want and mention the framework",
          "C) Let Claude guess everything",
          "D) Only use single-word commands",
        ],
        answer: 1,
        explanation: "Specificity is key. The more context you give, the better the output.",
      },
    ],
  },
  {
    id: "debugging",
    title: "Debugging Like a Pro",
    icon: "05",
    category: "Core Skills",
    xp: 100,
    badge: "Debugger",
    content: `
${c.bold}${c.cyan}Debugging With Claude Code${c.reset}

Debugging is where Claude Code truly shines. Instead of staring
at stack traces alone, you have an AI partner who can trace through
your code and find the root cause.

${c.yellow}Strategies:${c.reset}

  ${c.bold}1. Share the error:${c.reset}
  ${c.green}"I'm getting this error: TypeError: Cannot read property 'map'
   of undefined. It happens when I load the dashboard."${c.reset}

  ${c.bold}2. Pipe logs directly:${c.reset}
  ${c.green}$ npm test 2>&1 | claude "why are these tests failing?"${c.reset}

  ${c.bold}3. Ask for investigation:${c.reset}
  ${c.green}"Users report the app crashes on login. Can you investigate?"${c.reset}

  ${c.bold}4. Let Claude run and diagnose:${c.reset}
  ${c.green}"Run the tests, find what's broken, and fix it"${c.reset}

${c.yellow}Claude Code's debugging process:${c.reset}
  ${c.green}*${c.reset} Reads the error message and relevant code
  ${c.green}*${c.reset} Traces the execution path
  ${c.green}*${c.reset} Identifies the root cause (not just the symptom)
  ${c.green}*${c.reset} Proposes and implements a fix
  ${c.green}*${c.reset} Can run tests to verify the fix works

${c.magenta}Pro tip:${c.reset} Don't just paste errors — give context about
${c.magenta}what you were trying to do. It helps Claude narrow down the issue.${c.reset}
`,
    quiz: [
      {
        q: "What's the most helpful thing you can share with Claude Code when debugging?",
        options: [
          "A) Just the error message",
          "B) The error message plus context about what you were doing",
          'C) Just say "it\'s broken"',
          "D) A screenshot of your face looking confused",
        ],
        answer: 1,
        explanation: "Error message + context = faster debugging. Claude can narrow down the issue much faster when it knows what action triggered the error.",
      },
      {
        q: "How can you pipe test output directly to Claude Code?",
        options: [
          "A) Copy-paste only",
          'B) npm test | claude "why are these failing?"',
          "C) You can't pipe to Claude Code",
          "D) Email the logs",
        ],
        answer: 1,
        explanation: "Unix pipes work great with Claude Code! You can pipe any command output directly into a prompt.",
      },
    ],
  },
  {
    id: "git-workflow",
    title: "Git & Version Control",
    icon: "06",
    category: "Workflows",
    xp: 100,
    badge: null,
    content: `
${c.bold}${c.cyan}Git Workflow With Claude Code${c.reset}

Claude Code integrates beautifully with Git, making version control
less tedious and more thoughtful.

${c.yellow}Committing changes:${c.reset}
  ${c.green}"commit these changes with a descriptive message"${c.reset}
  Claude reads the diff, understands the changes, and writes a
  meaningful commit message (not just "fix stuff").

${c.yellow}Code review:${c.reset}
  ${c.green}$ git diff | claude "review these changes for issues"${c.reset}
  ${c.green}"review the last 3 commits for potential bugs"${c.reset}

${c.yellow}Pull requests:${c.reset}
  ${c.green}"create a PR with a summary of all changes on this branch"${c.reset}
  Claude examines all commits, writes a title and description,
  and uses the GitHub CLI to create the PR.

${c.yellow}Branch management:${c.reset}
  ${c.green}"what changes are on this branch compared to main?"${c.reset}
  ${c.green}"help me resolve these merge conflicts"${c.reset}

${c.magenta}Safety first:${c.reset} Claude Code follows safe Git practices:
  ${c.green}*${c.reset} Never force-pushes unless you explicitly ask
  ${c.green}*${c.reset} Creates new commits instead of amending by default
  ${c.green}*${c.reset} Warns about sensitive files (.env, credentials)
  ${c.green}*${c.reset} Stages specific files rather than using "git add -A"
`,
    quiz: [
      {
        q: "What does Claude Code do when you ask it to commit?",
        options: [
          'A) Always uses "fix stuff" as the message',
          "B) Reads the diff and writes a meaningful commit message",
          "C) Pushes directly to main",
          "D) Deletes the branch",
        ],
        answer: 1,
        explanation: "Claude reads the actual changes to write descriptive, meaningful commit messages.",
      },
      {
        q: "Which of these is a safety practice Claude Code follows with Git?",
        options: [
          "A) Force-pushing to main automatically",
          "B) Never staging files",
          "C) Warning about committing sensitive files like .env",
          "D) Deleting old branches automatically",
        ],
        answer: 2,
        explanation: "Claude Code is careful with sensitive files and will warn you before committing things like .env or credentials.",
      },
    ],
  },
  {
    id: "planning",
    title: "Planning Before Building",
    icon: "07",
    category: "Workflows",
    xp: 75,
    badge: "Architect",
    content: `
${c.bold}${c.cyan}Plan Mode: Think Before You Code${c.reset}

For complex tasks, Claude Code has a ${c.bold}Plan Mode${c.reset} that lets you
design the approach before writing a single line of code.

${c.yellow}When to use Plan Mode:${c.reset}
  ${c.green}*${c.reset} New features with multiple components
  ${c.green}*${c.reset} Refactoring that touches many files
  ${c.green}*${c.reset} Architectural decisions (which library? what pattern?)
  ${c.green}*${c.reset} When you want to discuss trade-offs first

${c.yellow}How it works:${c.reset}
  1. You describe what you want to build
  2. Claude explores the codebase and existing patterns
  3. It creates a step-by-step implementation plan
  4. You review, ask questions, request changes
  5. Once approved, Claude executes the plan

${c.yellow}Example:${c.reset}
  You: "I want to add real-time notifications to our app"
  Claude (Plan Mode):
    - Step 1: Set up WebSocket server
    - Step 2: Create notification data model
    - Step 3: Build notification service
    - Step 4: Add UI components
    - Step 5: Write tests
  You: "Looks good, but use SSE instead of WebSockets"
  Claude: *adjusts plan and proceeds*

${c.magenta}This prevents wasted effort — you align on the approach
before any code is written.${c.reset}
`,
    quiz: [
      {
        q: "When should you use Plan Mode?",
        options: [
          "A) For fixing a typo",
          "B) For complex features that touch multiple files",
          "C) Never — just start coding",
          "D) Only for documentation",
        ],
        answer: 1,
        explanation: "Plan Mode shines for complex tasks. For a simple typo fix, just ask Claude to fix it directly.",
      },
      {
        q: "What happens after you approve a plan?",
        options: [
          "A) Nothing — you have to code it yourself",
          "B) Claude executes the plan and writes the code",
          "C) The plan is emailed to your team",
          "D) Claude deletes the plan",
        ],
        answer: 1,
        explanation: "Once you approve, Claude implements the plan step by step, writing real code.",
      },
    ],
  },
  {
    id: "impact-projects",
    title: "Building for Impact",
    icon: "08",
    category: "Making a Difference",
    xp: 150,
    badge: "Changemaker",
    content: `
${c.bold}${c.cyan}Code That Changes the World${c.reset}

Now that you know how to use Claude Code, let's talk about
${c.bold}what${c.reset} to build. Here are real domains where your code
can make a tangible difference:

${c.yellow}1. Accessibility${c.reset}
   Build tools that make the web usable for everyone.
   ${c.green}"Help me add ARIA labels and keyboard navigation to this app"${c.reset}

${c.yellow}2. Education${c.reset}
   Create learning platforms, tutoring tools, or study aids.
   ${c.green}"Build an interactive quiz app for students learning math"${c.reset}

${c.yellow}3. Health & Wellness${c.reset}
   Apps for tracking health, connecting patients, or managing care.
   ${c.green}"Create a medication reminder app with notifications"${c.reset}

${c.yellow}4. Environment${c.reset}
   Tools for tracking carbon footprints, waste, or conservation.
   ${c.green}"Build a dashboard that visualizes local air quality data"${c.reset}

${c.yellow}5. Community & Civic Tech${c.reset}
   Platforms that connect neighbors, manage volunteers, or track issues.
   ${c.green}"Create a community board app for sharing local resources"${c.reset}

${c.yellow}6. Open Source${c.reset}
   Contributing to open source amplifies your impact exponentially.
   ${c.green}"Help me understand this open-source project so I can contribute"${c.reset}

${c.magenta}The best part? Claude Code makes all of these achievable,
even if you're just starting out. You describe the vision,
and together you build it step by step.${c.reset}
`,
    quiz: [
      {
        q: "What's a great way to maximize your impact as a developer?",
        options: [
          "A) Only build proprietary software",
          "B) Contributing to open source projects",
          "C) Keep all your code private",
          "D) Never share your work",
        ],
        answer: 1,
        explanation: "Open source contributions multiply your impact — your code helps people you'll never meet.",
      },
      {
        q: "Can Claude Code help build accessibility features?",
        options: [
          "A) No, accessibility is too specialized",
          "B) Yes — it can add ARIA labels, keyboard navigation, and more",
          "C) Only for mobile apps",
          "D) Only if you already know all the ARIA specs",
        ],
        answer: 1,
        explanation: "Claude Code knows accessibility standards well and can help you add ARIA labels, keyboard nav, screen reader support, and more.",
      },
    ],
  },
];

// ─── Quiz Engine ─────────────────────────────────────────────────────
async function runQuiz(rl, lesson) {
  console.log(`\n${c.bgCyan}${c.bold} QUIZ TIME ${c.reset}\n`);
  let correct = 0;

  for (let i = 0; i < lesson.quiz.length; i++) {
    const q = lesson.quiz[i];
    console.log(`${c.bold}  Question ${i + 1}/${lesson.quiz.length}:${c.reset} ${q.q}\n`);
    q.options.forEach((opt) => console.log(`    ${opt}`));
    console.log();

    let answered = false;
    while (!answered) {
      const input = (await ask(rl, `  ${c.yellow}Your answer (A/B/C/D): ${c.reset}`)).trim().toUpperCase();
      const idx = "ABCD".indexOf(input);
      if (idx === -1) {
        console.log(`  ${c.red}Please enter A, B, C, or D.${c.reset}\n`);
        continue;
      }
      answered = true;
      if (idx === q.answer) {
        correct++;
        console.log(`\n  ${c.green}${c.bold}Correct!${c.reset} ${q.explanation}\n`);
      } else {
        console.log(
          `\n  ${c.red}${c.bold}Not quite.${c.reset} The answer is ${c.bold}${"ABCD"[q.answer]}${c.reset}. ${q.explanation}\n`
        );
      }
    }
  }

  const score = Math.round((correct / lesson.quiz.length) * 100);
  if (score === 100) {
    console.log(`  ${c.green}${c.bold}PERFECT SCORE! ${c.reset}${c.green}You nailed every question!${c.reset}`);
  } else if (score >= 50) {
    console.log(`  ${c.yellow}${c.bold}Good job!${c.reset} You got ${correct}/${lesson.quiz.length} right.`);
  } else {
    console.log(`  ${c.cyan}Keep learning!${c.reset} You got ${correct}/${lesson.quiz.length}. Review the lesson and try again.`);
  }

  return score;
}

// ─── Lesson Runner ──────────────────────────────────────────────────
async function runLesson(rl, lessonIndex, progress) {
  const lesson = lessons[lessonIndex];
  clearScreen();

  console.log(
    `\n${c.bgMagenta}${c.bold} LESSON ${lesson.icon} ${c.reset} ${c.bold}${c.magenta}${lesson.title}${c.reset}`
  );
  console.log(`${c.dim}  Category: ${lesson.category}  |  XP Reward: ${lesson.xp}${c.reset}`);
  if (progress.completedLessons.includes(lesson.id)) {
    console.log(`  ${c.green}${c.bold}[COMPLETED]${c.reset}`);
  }

  console.log(lesson.content);

  await ask(rl, `${c.cyan}  Press Enter to take the quiz...${c.reset}`);
  const score = await runQuiz(rl, lesson);

  // Award XP
  if (!progress.completedLessons.includes(lesson.id)) {
    const earned = score === 100 ? lesson.xp : Math.floor(lesson.xp * 0.5);
    progress.xp += earned;
    progress.completedLessons.push(lesson.id);
    console.log(`\n  ${c.green}${c.bold}+${earned} XP earned!${c.reset}`);

    if (lesson.badge) {
      progress.badges.push(lesson.badge);
      console.log(`  ${c.yellow}${c.bold}NEW BADGE: [${lesson.badge}]${c.reset}`);
    }

    // Level up check
    while (progress.xp >= progress.level * 100) {
      progress.xp -= progress.level * 100;
      progress.level++;
      console.log(`\n  ${c.magenta}${c.bold}*** LEVEL UP! You are now Level ${progress.level}! ***${c.reset}`);
    }

    saveProgress(progress);
  } else {
    console.log(`\n  ${c.dim}(Lesson already completed — no additional XP)${c.reset}`);
  }

  console.log();
  await ask(rl, `${c.cyan}  Press Enter to return to the menu...${c.reset}`);
}

// ─── Main Menu ──────────────────────────────────────────────────────
async function mainMenu(rl, progress) {
  clearScreen();
  banner();
  statusBar(progress);

  console.log(`\n${c.bold}  LESSONS${c.reset}\n`);

  const categories = [...new Set(lessons.map((l) => l.category))];
  for (const cat of categories) {
    console.log(`  ${c.underline}${c.bold}${cat}${c.reset}`);
    const catLessons = lessons.filter((l) => l.category === cat);
    for (const lesson of catLessons) {
      const idx = lessons.indexOf(lesson);
      const done = progress.completedLessons.includes(lesson.id);
      const status = done ? `${c.green}[done]${c.reset}` : `${c.dim}[    ]${c.reset}`;
      console.log(`    ${status}  ${c.bold}${lesson.icon}${c.reset}  ${lesson.title}  ${c.dim}(${lesson.xp} XP)${c.reset}`);
    }
    console.log();
  }

  console.log(`  ${c.yellow}T${c.reset}  Tips & Tutorials — Pro tips with walkthroughs`);
  console.log(`  ${c.yellow}P${c.reset}  Playground — Try a hands-on challenge`);
  console.log(`  ${c.yellow}I${c.reset}  Impact Ideas — Project ideas for good`);
  console.log(`  ${c.yellow}Q${c.reset}  Quit\n`);

  const choice = (await ask(rl, `${c.cyan}${c.bold}  Enter lesson number (01-08) or letter: ${c.reset}`))
    .trim()
    .toUpperCase();

  if (choice === "Q") return "quit";
  if (choice === "T") return "tips";
  if (choice === "P") return "playground";
  if (choice === "I") return "ideas";

  const num = parseInt(choice, 10);
  if (num >= 1 && num <= lessons.length) {
    return num - 1;
  }

  return "invalid";
}

// ─── Tips & Tutorials ───────────────────────────────────────────────
const tips = [
  {
    id: "drag-drop",
    title: "Drag & Drop Images Into Your Terminal",
    category: "Hidden Gems",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Did you know? You can drag and drop image files directly
into Claude Code's terminal input!${c.reset}

${c.yellow}How it works:${c.reset}
  1. Start Claude Code in your terminal
  2. Grab any image file (screenshot, mockup, diagram, photo)
  3. Drag it from Finder / file manager into the terminal window
  4. The file path gets pasted automatically
  5. Claude Code reads the image and understands it visually!

${c.yellow}Try these:${c.reset}
  ${c.green}* Drag a screenshot of a UI bug:${c.reset}
    "What's wrong with this layout?" + [drag image]

  ${c.green}* Drag a design mockup:${c.reset}
    "Build this UI in React" + [drag image]

  ${c.green}* Drag a whiteboard photo:${c.reset}
    "Turn this diagram into a database schema" + [drag image]

  ${c.green}* Drag an error screenshot:${c.reset}
    "Help me fix this error" + [drag image]

${c.magenta}This is incredibly powerful for bridging the gap between
visual ideas and working code.${c.reset}
`,
  },
  {
    id: "multi-turn",
    title: "Iterate Like a Conversation",
    category: "Hidden Gems",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Claude Code remembers everything in your session.
Use that to iterate naturally!${c.reset}

${c.yellow}Example conversation flow:${c.reset}
  ${c.green}You:${c.reset}   "Create a login form component"
  ${c.dim}Claude builds the form${c.reset}
  ${c.green}You:${c.reset}   "Add email validation"
  ${c.dim}Claude updates the same component${c.reset}
  ${c.green}You:${c.reset}   "Now add a password strength meter"
  ${c.dim}Claude adds it, keeping previous changes${c.reset}
  ${c.green}You:${c.reset}   "Make it match our existing dark theme"
  ${c.dim}Claude reads your theme and applies it${c.reset}

${c.yellow}Tips for great iteration:${c.reset}
  ${c.green}*${c.reset} Start broad, then refine with follow-ups
  ${c.green}*${c.reset} Say "undo that last change" if something isn't right
  ${c.green}*${c.reset} Reference previous work: "update the component we just made"
  ${c.green}*${c.reset} Use /compact if the conversation gets very long
`,
  },
  {
    id: "claude-md",
    title: "Project Memory with CLAUDE.md",
    category: "Power User",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Create a CLAUDE.md file in your project root to give
Claude Code persistent context about your project!${c.reset}

${c.yellow}What to put in CLAUDE.md:${c.reset}
  ${c.green}*${c.reset} Project architecture overview
  ${c.green}*${c.reset} Coding conventions and style preferences
  ${c.green}*${c.reset} Key file locations and their purposes
  ${c.green}*${c.reset} Build and test commands
  ${c.green}*${c.reset} Things to avoid or watch out for

${c.yellow}Example CLAUDE.md:${c.reset}
${c.dim}  # My Project
  - React frontend in /src, Express backend in /api
  - Use TypeScript strict mode
  - Tests go next to source files as *.test.ts
  - Run tests: npm test
  - Prefer functional components with hooks
  - Never use "any" type${c.reset}

${c.magenta}Claude Code reads this automatically every session,
so it always knows your project's rules and preferences.${c.reset}
`,
  },
  {
    id: "vim-mode",
    title: "Keyboard Shortcuts & Vim Mode",
    category: "Power User",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Speed up your Claude Code workflow with shortcuts!${c.reset}

${c.yellow}Essential shortcuts:${c.reset}
  ${c.green}Escape${c.reset}          Clear current input / interrupt
  ${c.green}Ctrl+C${c.reset}          Cancel current operation
  ${c.green}Up/Down${c.reset}         Navigate input history
  ${c.green}Shift+Enter${c.reset}     Multi-line input (newline without sending)

${c.yellow}Vim mode:${c.reset}
  Claude Code supports Vim keybindings for text input!
  If you're a Vim user, this feels right at home.

${c.yellow}Multi-line input trick:${c.reset}
  For long prompts, use Shift+Enter to write across
  multiple lines before sending. Great for detailed
  instructions with examples or step-by-step requests.

${c.magenta}Tip: Customize keybindings with /keybindings-help${c.reset}
`,
  },
  {
    id: "piping",
    title: "Unix Pipes — Claude's Secret Weapon",
    category: "Workflow",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Pipe any command output directly into Claude Code!${c.reset}

${c.yellow}Debugging:${c.reset}
  ${c.green}$ npm test 2>&1 | claude "why are these tests failing?"${c.reset}
  ${c.green}$ python app.py 2>&1 | claude "explain this traceback"${c.reset}
  ${c.green}$ docker logs myapp | claude "find errors in these logs"${c.reset}

${c.yellow}Code review:${c.reset}
  ${c.green}$ git diff | claude "review for bugs and security issues"${c.reset}
  ${c.green}$ git log --oneline -20 | claude "summarize recent changes"${c.reset}

${c.yellow}Understanding code:${c.reset}
  ${c.green}$ cat schema.sql | claude "explain this database schema"${c.reset}
  ${c.green}$ curl -s api.example.com | claude "what does this API return?"${c.reset}

${c.yellow}Generate code from specs:${c.reset}
  ${c.green}$ cat requirements.md | claude "build this feature"${c.reset}

${c.magenta}Pipes + Claude = any command output becomes actionable.${c.reset}
`,
  },
  {
    id: "headless",
    title: "Headless Mode for Automation",
    category: "Workflow",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Run Claude Code non-interactively for scripts and CI/CD!${c.reset}

${c.yellow}Headless mode with --print:${c.reset}
  ${c.green}$ claude --print "generate a .gitignore for a Node.js project"${c.reset}
  This outputs the result directly to stdout — no interactive
  session needed. Perfect for piping into files:
  ${c.green}$ claude --print "generate .gitignore for Node.js" > .gitignore${c.reset}

${c.yellow}Use in scripts:${c.reset}
  ${c.green}#!/bin/bash
  # Auto-generate commit messages
  MSG=$(git diff --staged | claude --print "write a commit message for this diff")
  git commit -m "$MSG"${c.reset}

${c.yellow}Use in CI/CD:${c.reset}
  ${c.green}# In your GitHub Action or CI pipeline:
  claude --print "review this PR for issues" < changes.diff${c.reset}

${c.magenta}Headless mode turns Claude Code into a building block
for automated workflows.${c.reset}
`,
  },
  {
    id: "context-tricks",
    title: "Context Window Mastery",
    category: "Power User",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}Get the most out of Claude Code's context window!${c.reset}

${c.yellow}The challenge:${c.reset}
  Claude Code has a large but finite context window. On long
  sessions, you might hit the limit.

${c.yellow}Strategies:${c.reset}
  ${c.green}1. /compact${c.reset}
     Summarizes your conversation so far. Use this periodically
     during long sessions to free up space.

  ${c.green}2. Be specific about files${c.reset}
     Instead of "look at the project", say
     "look at src/auth/login.ts" — this avoids loading
     unnecessary files into context.

  ${c.green}3. Start fresh for new tasks${c.reset}
     If switching to an unrelated task, start a new session
     rather than continuing a long one.

  ${c.green}4. Use CLAUDE.md${c.reset}
     Put recurring context in CLAUDE.md so you don't have to
     re-explain your project setup every session.

  ${c.green}5. Break big tasks into steps${c.reset}
     Instead of "refactor the entire auth system", do it
     module by module across sessions.

${c.magenta}Treat context like memory — keep it focused on what matters now.${c.reset}
`,
  },
  {
    id: "mcp",
    title: "MCP Servers — Extend Claude's Powers",
    category: "Advanced",
    icon: "~",
    tutorial: `
${c.bold}${c.cyan}MCP (Model Context Protocol) lets Claude Code connect
to external tools and services!${c.reset}

${c.yellow}What are MCP Servers?${c.reset}
  They're plugins that give Claude Code new abilities:
  ${c.green}*${c.reset} Query databases directly
  ${c.green}*${c.reset} Interact with APIs (GitHub, Jira, Slack, etc.)
  ${c.green}*${c.reset} Access Figma designs
  ${c.green}*${c.reset} Search documentation
  ${c.green}*${c.reset} And much more!

${c.yellow}How to use them:${c.reset}
  MCP servers are configured in your Claude Code settings.
  Once connected, Claude can use them automatically.

${c.yellow}Example — Figma integration:${c.reset}
  With the Figma MCP server connected, you can say:
  ${c.green}"Look at this Figma design and build it in React"${c.reset}
  Claude fetches the design, reads the layout, colors,
  and typography, then generates matching code.

${c.magenta}MCP turns Claude Code from a coding assistant into a
full development platform that connects to your entire workflow.${c.reset}
`,
  },
];

async function tipsAndTutorials(rl) {
  clearScreen();
  console.log(`\n${c.bgCyan}${c.bold} TIPS & TUTORIALS ${c.reset}\n`);
  console.log(`${c.dim}  Pro tips with step-by-step walkthroughs to level up your workflow.${c.reset}\n`);

  const categories = [...new Set(tips.map((t) => t.category))];
  for (const cat of categories) {
    console.log(`  ${c.underline}${c.bold}${cat}${c.reset}`);
    const catTips = tips.filter((t) => t.category === cat);
    for (let i = 0; i < catTips.length; i++) {
      const globalIdx = tips.indexOf(catTips[i]) + 1;
      console.log(`    ${c.yellow}${String(globalIdx).padStart(2)}${c.reset}  ${catTips[i].title}`);
    }
    console.log();
  }

  console.log(`  ${c.dim}Enter a number to read a tip, or press Enter to go back.${c.reset}\n`);

  const choice = (await ask(rl, `${c.cyan}${c.bold}  Select a tip (1-${tips.length}): ${c.reset}`)).trim();

  const num = parseInt(choice, 10);
  if (num >= 1 && num <= tips.length) {
    await showTip(rl, num - 1);
  }
}

async function showTip(rl, index) {
  const tip = tips[index];
  clearScreen();

  console.log(
    `\n${c.bgCyan}${c.bold} TIP ${c.reset} ${c.bold}${c.cyan}${tip.title}${c.reset}`
  );
  console.log(`${c.dim}  Category: ${tip.category}${c.reset}`);

  console.log(tip.tutorial);

  const nextIdx = index + 1;
  if (nextIdx < tips.length) {
    const action = (
      await ask(rl, `${c.cyan}  Press Enter for next tip, or 'b' for back: ${c.reset}`)
    ).trim().toLowerCase();
    if (action !== "b") {
      await showTip(rl, nextIdx);
      return;
    }
  } else {
    await ask(rl, `${c.cyan}  That's all the tips! Press Enter to go back...${c.reset}`);
  }
}

// ─── Playground ─────────────────────────────────────────────────────
async function playground(rl) {
  clearScreen();
  console.log(`\n${c.bgGreen}${c.bold} PLAYGROUND ${c.reset}\n`);

  const challenges = [
    {
      title: "Hello World API",
      desc: `Try this in Claude Code:
  ${c.green}"Create a simple Express.js API with a GET /hello endpoint
   that returns { message: 'Hello, World!' }"${c.reset}

  Then try: ${c.green}"Add a POST /greet endpoint that takes a name
  and returns a personalized greeting"${c.reset}`,
    },
    {
      title: "Bug Hunt",
      desc: `Create a file with an intentional bug and ask Claude to find it:

  1. Create a file with a subtle bug (off-by-one, null reference, etc.)
  2. Ask Claude: ${c.green}"There's a bug in this file. Can you find it?"${c.reset}
  3. See how quickly it identifies the root cause!`,
    },
    {
      title: "Code Review Partner",
      desc: `Use Claude Code to review code:

  ${c.green}$ git diff HEAD~3 | claude "review these changes for bugs,
    security issues, and improvement opportunities"${c.reset}

  Try it on your own recent changes or an open-source project!`,
    },
    {
      title: "Build an Impact Tool",
      desc: `Challenge yourself to build something meaningful:

  ${c.green}"Help me create a CLI tool that tracks my daily water intake
   and reminds me to stay hydrated"${c.reset}

  Or: ${c.green}"Build a simple expense tracker that categorizes spending
  and shows a summary"${c.reset}`,
    },
  ];

  for (let i = 0; i < challenges.length; i++) {
    console.log(`  ${c.bold}${c.yellow}Challenge ${i + 1}: ${challenges[i].title}${c.reset}`);
    console.log(`  ${challenges[i].desc}`);
    console.log();
  }

  await ask(rl, `${c.cyan}  Press Enter to return to the menu...${c.reset}`);
}

// ─── Impact Ideas ───────────────────────────────────────────────────
async function impactIdeas(rl) {
  clearScreen();
  console.log(`\n${c.bgMagenta}${c.bold} IMPACT PROJECT IDEAS ${c.reset}\n`);

  const ideas = [
    {
      title: "Neighborhood Helper",
      level: "Beginner",
      desc: "A web app where neighbors can post requests for help (groceries, rides) and others can volunteer.",
      prompt: '"Create a simple web app where people can post help requests and others can claim them"',
    },
    {
      title: "Accessibility Checker",
      level: "Intermediate",
      desc: "A CLI tool that scans HTML files and reports accessibility issues with suggested fixes.",
      prompt: '"Build a Node.js CLI tool that checks HTML files for common accessibility issues"',
    },
    {
      title: "Study Buddy",
      level: "Beginner",
      desc: "A flashcard app with spaced repetition to help students study more effectively.",
      prompt: '"Create a flashcard study app with spaced repetition using React"',
    },
    {
      title: "Carbon Footprint Tracker",
      level: "Intermediate",
      desc: "Track daily activities and estimate their carbon impact with tips for reduction.",
      prompt: '"Build a carbon footprint calculator that tracks daily activities"',
    },
    {
      title: "Community Food Map",
      level: "Advanced",
      desc: "Map food banks, community gardens, and free meal programs in your area.",
      prompt: '"Create a map-based app showing local food resources like food banks and community gardens"',
    },
    {
      title: "Mental Health Check-In",
      level: "Beginner",
      desc: "A simple daily mood tracker with journaling prompts and positive affirmations.",
      prompt: '"Build a daily mood tracker app with journaling prompts"',
    },
  ];

  for (const idea of ideas) {
    console.log(`  ${c.bold}${c.magenta}${idea.title}${c.reset} ${c.dim}[${idea.level}]${c.reset}`);
    console.log(`  ${idea.desc}`);
    console.log(`  ${c.green}Try: ${idea.prompt}${c.reset}`);
    console.log();
  }

  console.log(`${c.cyan}${c.bold}  Pick any idea above and ask Claude Code to help you build it!${c.reset}`);
  console.log(`${c.cyan}  Start with the prompt shown, and iterate from there.${c.reset}\n`);

  await ask(rl, `${c.cyan}  Press Enter to return to the menu...${c.reset}`);
}

// ─── Entry Point ────────────────────────────────────────────────────
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let progress = loadProgress();

  // Update streak
  const today = new Date().toISOString().slice(0, 10);
  if (progress.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    progress.streak = progress.lastDate === yesterday ? progress.streak + 1 : 1;
    progress.lastDate = today;
    saveProgress(progress);
  }

  clearScreen();
  banner();

  await typewrite(`  Welcome to Claude Learn — your interactive guide to Claude Code!`, 25);
  await typewrite(`  Learn to build software that makes the world better.`, 25);
  console.log();

  if (progress.streak > 1) {
    console.log(`  ${c.yellow}${c.bold}${progress.streak}-day learning streak! Keep it up!${c.reset}\n`);
  }

  await ask(rl, `${c.cyan}  Press Enter to start...${c.reset}`);

  let running = true;
  while (running) {
    progress = loadProgress();
    const result = await mainMenu(rl, progress);

    if (result === "quit") {
      running = false;
    } else if (result === "tips") {
      await tipsAndTutorials(rl);
    } else if (result === "playground") {
      await playground(rl);
    } else if (result === "ideas") {
      await impactIdeas(rl);
    } else if (result === "invalid") {
      // just loop back
    } else if (typeof result === "number") {
      await runLesson(rl, result, progress);
    }
  }

  clearScreen();
  console.log(`
${c.cyan}${c.bold}  Thanks for learning with Claude Learn!${c.reset}

  ${c.dim}Remember:${c.reset}
    ${c.green}*${c.reset} Every expert was once a beginner
    ${c.green}*${c.reset} The best code solves real problems for real people
    ${c.green}*${c.reset} Claude Code is always here when you need a partner

  ${c.magenta}Now go build something amazing.${c.reset}

  Run ${c.green}node learn.mjs${c.reset} anytime to continue your journey.
`);

  rl.close();
}

main().catch(console.error);
