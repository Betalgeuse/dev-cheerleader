#!/usr/bin/env node

// src/cheerleader.ts
import { readFileSync } from "fs";
var ASCII_CHEERLEADERS = {
  welcome: [
    String.raw`
   \(^o^)/   오늘도 화이팅!
    /|\      같이 열심히 해보자!
    / \
        `,
    String.raw`
    *
   \(>v<)/   Let's go!!!
    /|\      오늘도 멋진 하루!
    / \
        `,
    String.raw`
    ~
   \(^_^)/   새로운 시작이야!
    /|\      화이팅~!
    / \
        `
  ],
  preCompact: [
    String.raw`
   \(^_^)/   잠깐! 머리 정리중...
    /|\      넌 정말 잘하고 있어!
    / \      곧 돌아올게!
        `,
    String.raw`
    (>_<)b   컨텍스트 정리하고 올게~
    /|\      지금까지 수고했어!
    / \
        `,
    String.raw`
   \(o_o)/   휴식도 실력이야!
    /|\      잠깐 쉬고 더 잘해보자!
    / \
        `
  ],
  errorRecovery: [
    String.raw`
   \(>_<)/   에러? 괜찮아!
    /|\      버그는 성장의 기회야!
    / \      다시 해보자!
        `,
    String.raw`
   \(O_O)/   오류 발생!
    /|\      하지만 걱정마~
    / \      같이 고쳐보자!
        `,
    String.raw`
   (^_^)b    실패는 성공의 어머니!
    /|\      디버깅 타임~
    / \
        `
  ],
  success: [
    String.raw`
   \(*v*)/   성공! 대단해!
    /|\      역시 천재!
    / \
        `,
    String.raw`
    * * *
   \(^o^)/   Perfect! 잘했어!
    /|\
    / \
        `,
    String.raw`
   \(^_^)/   빌드 성공!
    /|\      이 기세 그대로!
    / \
        `
  ]
};
var MESSAGES = {
  welcome: [
    "\uC0C8\uB85C\uC6B4 \uC138\uC158 \uC2DC\uC791! \uC624\uB298\uB3C4 \uBA4B\uC9C4 \uCF54\uB4DC \uB9CC\uB4E4\uC5B4\uBCF4\uC790!",
    "\uB2E4\uC2DC \uB9CC\uB098\uC11C \uBC18\uAC00\uC6CC! \uC5B4\uB514\uAE4C\uC9C0 \uD588\uB354\uB77C?",
    "\uC790, \uC2DC\uC791\uD574\uBCFC\uAE4C? \uC624\uB298\uB3C4 \uD654\uC774\uD305!",
    "Ready? \uAC19\uC774 \uBB38\uC81C \uD574\uACB0\uD574\uBCF4\uC790!"
  ],
  preCompact: [
    "\uCEE8\uD14D\uC2A4\uD2B8 \uC815\uB9AC\uD560\uAC8C. \uC7A0\uC2DC \uD6C4 \uB354 \uAC00\uBCBC\uC6B4 \uB9C8\uC74C\uC73C\uB85C \uB3CC\uC544\uC62C\uAC8C!",
    "\uC9C0\uAE08\uAE4C\uC9C0 \uC815\uB9D0 \uC5F4\uC2EC\uD788 \uD588\uC5B4! \uC7A0\uAE50 \uC26C\uACE0 \uAC00\uC790~",
    "\uBA38\uB9AC \uC2DD\uD788\uACE0 \uC62C\uAC8C! \uB10C \uCD5C\uACE0\uC57C!",
    "\uC815\uB9AC\uD558\uACE0 \uC62C\uAC8C~ \uB2E4\uC74C\uC5D4 \uB354 \uBE60\uB974\uAC8C!"
  ],
  errorKeywords: {
    "error": "\uC5D0\uB7EC \uB0AC\uC5B4\uB3C4 \uAD1C\uCC2E\uC544! \uCC28\uADFC\uCC28\uADFC \uD574\uACB0\uD574\uBCF4\uC790!",
    "fail": "\uC2E4\uD328\uB294 \uC131\uACF5\uC73C\uB85C \uAC00\uB294 \uAE38\uC774\uC57C!",
    "exception": "\uC608\uC678 \uC0C1\uD669\uC774\uB124~ \uAC19\uC774 \uBD84\uC11D\uD574\uBCF4\uC790!",
    "undefined": "undefined \uCC3E\uC558\uB2E4! \uC6D0\uC778 \uBD84\uC11D \uACE0\uACE0!",
    "cannot": "\uD560 \uC218 \uC5C6\uB2E4\uACE0? \uBC29\uBC95\uC744 \uCC3E\uC544\uBCF4\uC790!",
    "not found": "\uBABB \uCC3E\uC558\uC5B4\uB3C4 \uAD1C\uCC2E\uC544! \uB2E4\uB978 \uBC29\uBC95\uC774 \uC788\uC744 \uAC70\uC57C!"
  },
  buildSuccess: [
    "\uBE4C\uB4DC \uC131\uACF5! \uC5ED\uC2DC \uCD5C\uACE0! \u{1F389}",
    "\uD14C\uC2A4\uD2B8 \uD1B5\uACFC! \uB300\uB2E8\uD574!",
    "\uAE54\uB054\uD558\uAC8C \uC644\uB8CC! \uC774 \uAE30\uC138\uB85C!"
  ]
};
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function formatOutput(ascii, message, type) {
  const border = "\u2501".repeat(45);
  const typeEmoji = {
    welcome: "\u{1F31F}",
    preCompact: "\u{1F4AB}",
    errorRecovery: "\u{1F4AA}",
    success: "\u{1F389}"
  }[type] || "\u2728";
  return `
${border}
${typeEmoji} DEV CHEERLEADER ${typeEmoji}
${border}
${ascii}
\u{1F4E3} ${message}
${border}
`;
}
function detectError(output) {
  const lowerOutput = output.toLowerCase();
  for (const [keyword, message] of Object.entries(MESSAGES.errorKeywords)) {
    if (lowerOutput.includes(keyword)) {
      return message;
    }
  }
  return null;
}
function detectSuccess(output) {
  const successKeywords = ["success", "passed", "ok", "done", "complete", "built"];
  const lowerOutput = output.toLowerCase();
  return successKeywords.some((kw) => lowerOutput.includes(kw));
}
async function main() {
  try {
    const input = readFileSync(0, "utf-8");
    const data = JSON.parse(input);
    const hookType = process.env.CHEERLEADER_HOOK_TYPE || "welcome";
    let output = "";
    switch (hookType) {
      case "session_start":
        output = formatOutput(
          getRandomItem(ASCII_CHEERLEADERS.welcome),
          getRandomItem(MESSAGES.welcome),
          "welcome"
        );
        break;
      case "pre_compact":
        output = formatOutput(
          getRandomItem(ASCII_CHEERLEADERS.preCompact),
          getRandomItem(MESSAGES.preCompact),
          "preCompact"
        );
        break;
      case "post_tool_use":
        const toolOutput = data.tool_output || "";
        const errorMsg = detectError(toolOutput);
        if (errorMsg) {
          output = formatOutput(
            getRandomItem(ASCII_CHEERLEADERS.errorRecovery),
            errorMsg,
            "errorRecovery"
          );
          break;
        }
        if (detectSuccess(toolOutput)) {
          output = formatOutput(
            getRandomItem(ASCII_CHEERLEADERS.success),
            getRandomItem(MESSAGES.buildSuccess),
            "success"
          );
          break;
        }
        break;
      default:
        break;
    }
    if (output) {
      console.log(output);
    }
    process.exit(0);
  } catch (err) {
    console.error("Cheerleader hook error:", err);
    process.exit(1);
  }
}
main().catch((err) => {
  console.error("Uncaught error:", err);
  process.exit(1);
});
