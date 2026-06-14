import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://localhost:62591";
const OUT = new URL("./assets/shots/", import.meta.url).pathname;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
  args: ["--no-sandbox", "--force-color-profile=srgb", "--hide-scrollbars"],
});

const page = await browser.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("PAGE ERROR:", m.text());
});

async function shot(name) {
  await page.screenshot({ path: OUT + name, type: "png" });
  console.log("captured", name);
}

// 1. Landing hero
await page.goto(BASE + "/", { waitUntil: "networkidle0" });
await sleep(2200); // let crystal + entrance animations settle
await shot("landing.png");

// scroll to the "lenses" / how-it-works section for a second landing shot
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.05 }));
await sleep(1400);
await shot("landing-lenses.png");

// 2. Dashboard idle (hero takeover)
await page.goto(BASE + "/dashboard", { waitUntil: "networkidle0" });
await sleep(2200);
await shot("dashboard-idle.png");

// 3. Trigger a real review by clicking the "Swap" quick action
const clicked = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button"));
  const b = btns.find((x) => x.textContent.trim() === "Swap");
  if (b) {
    b.click();
    return true;
  }
  return false;
});
console.log("clicked Swap:", clicked);

// wait for analysis to complete + animate in (lenses resolve <1.5s)
await sleep(4000);
await shot("workspace-analysis.png");

// scroll the conversation/analysis column to reveal the verdict panel
await page.evaluate(() => {
  const scrollers = Array.from(document.querySelectorAll("*")).filter((el) => {
    const s = getComputedStyle(el);
    return (
      (s.overflowY === "auto" || s.overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 40
    );
  });
  scrollers.forEach((el) => (el.scrollTop = el.scrollHeight));
  window.scrollTo({ top: document.body.scrollHeight });
});
await sleep(1600);
await shot("workspace-verdict.png");

await browser.close();
console.log("done");
