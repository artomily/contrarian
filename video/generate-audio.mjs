import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// Narration script — English, spoken by macOS "Daniel" (en_GB).
// One entry per scene. Order matters; ids match the Remotion timeline.
const scenes = [
  {
    id: "s1_hook",
    text:
      "On a blockchain, there is no undo button. The moment you sign, the transaction is final. Irreversible, and unforgiving. One careless approval can drain an entire wallet in a single block.",
  },
  {
    id: "s2_status_quo",
    text:
      "And almost every tool you use is designed to say yes. Your wallet confirms. Your app confirms. Everything pushes you toward that one bright button. But who is arguing for caution? Who challenges the decision before the money moves?",
  },
  {
    id: "s3_intro",
    text:
      "This is Contrarian. A decision firewall for onchain actions. It does the one thing nothing else will. Instead of confirming what you want to do, it actively argues against it, before your intent ever becomes a transaction.",
  },
  {
    id: "s4_intent",
    text:
      "It begins with plain language. Just describe the action you're about to take. Swap a token, stake your holdings, bridge to another chain, or lend on a protocol. No forms, no jargon. Contrarian reads your intent and prepares its case.",
  },
  {
    id: "s5_lenses",
    text:
      "That intent is then put on trial, examined through four adversarial lenses. A risk analyst hunts for ways you could lose. A market skeptic questions the timing and the hype. An opportunity cost critic asks what you are giving up. And a behavioral psychologist checks whether you are acting on fear, or on greed.",
  },
  {
    id: "s6_verdict",
    text:
      "Within seconds, each lens returns a score and a sharp set of counter arguments. Take this simple swap. Risk: ninety three. Fear of missing out: ninety two. The liquidity is dangerously thin. The price has surged three hundred and forty percent in a day. A textbook pump. The verdict is clear. Reconsider.",
  },
  {
    id: "s7_decision",
    text:
      "But Contrarian never locks you out. It is an advisor, not a gatekeeper. The final call always belongs to you. Read the case, weigh the risk, and choose. Execute anyway, or cancel, and keep your capital exactly where it is.",
  },
  {
    id: "s8_outro",
    text:
      "Contrarian. Because every transaction deserves an argument. Slow down. See the other side. And think, before you sign.",
  },
];

const VOICE = "Daniel";
const RATE = 162; // words per minute — measured, authoritative
const audioDir = new URL("./assets/audio/", import.meta.url).pathname;

const durations = {};
for (const s of scenes) {
  const aiff = `${audioDir}${s.id}.aiff`;
  const wav = `${audioDir}${s.id}.wav`;
  // Generate speech
  execSync(
    `say -v ${VOICE} -r ${RATE} -o ${JSON.stringify(aiff)} ${JSON.stringify(s.text)}`,
  );
  // Convert AIFF -> 16-bit PCM WAV (Remotion-friendly)
  execSync(`afconvert ${JSON.stringify(aiff)} ${JSON.stringify(wav)} -d LEI16 -f WAVE`);
  // Measure duration
  const info = execSync(`afinfo ${JSON.stringify(wav)}`).toString();
  const m = info.match(/estimated duration:\s*([\d.]+)\s*sec/);
  const sec = m ? parseFloat(m[1]) : 0;
  durations[s.id] = sec;
  console.log(`${s.id}: ${sec.toFixed(2)}s`);
}

const total = Object.values(durations).reduce((a, b) => a + b, 0);
console.log(`\nTotal narration: ${total.toFixed(1)}s (${(total / 60).toFixed(2)} min)`);

writeFileSync(
  new URL("./src/durations.json", import.meta.url),
  JSON.stringify(durations, null, 2),
);
console.log("wrote src/durations.json");
