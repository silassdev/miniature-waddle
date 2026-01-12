export type ModerationResult =
  | { allowed: true }
  | { allowed: false; reason: string; safeReply?: string };

const BLOCK_PATTERNS: RegExp[] = [
  /\b(kill|murder|bomb|explode|terrorist|gun build|how to make a bomb)\b/i,
  /\b(suicide|kill myself|hurt myself|self[- ]harm)\b/i,
  /\b(child sex|porn|rape|sexual act)\b/i,
  /\b(illegal|steal|hack bank|download movies|crack license)\b/i,
];

const TECH_OUT_OF_SCOPE_PATTERNS: RegExp[] = [
  /\b(write a malware|ddos|how to hack|exploit)\b/i,
];

export function moderateUserInput(text: string): ModerationResult {
  if (!text || !text.trim()) {
    return { allowed: false, reason: "empty" };
  }

  for (const p of BLOCK_PATTERNS) {
    if (p.test(text)) {
      return {
        allowed: false,
        reason: "harmful",
        safeReply:
          "I'm sorry, I can't assist with requests that could cause harm. If you're in danger or thinking about self-harm, please contact local emergency services or a trusted person. Here's a verse that may bring comfort: Psalm 34:18.",
      };
    }
  }

  for (const p of TECH_OUT_OF_SCOPE_PATTERNS) {
    if (p.test(text)) {
      return {
        allowed: false,
        reason: "out_of_scope_tech",
        safeReply:
          "I can't help with that technical/illegal request. I can offer encouragement or suggest scripture and study tips instead.",
      };
    }
  }

  return { allowed: true };
}
