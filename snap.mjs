import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const PORT = 5173;
const PAGES = [
    { name: "landing-top", url: "/?component=LandingTop" },
    { name: "landing-bottom", url: "/?component=LandingBottom" } // если нужен второй блок
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
    // 1) vite preview
    const preview = spawn("npx", ["vite", "preview", "--port", String(PORT)], { stdio: "inherit", shell: true });
    await sleep(1500);

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
        for (const p of PAGES) {
            const page = await browser.newPage();
            const url = `http://localhost:${PORT}${p.url}`;
            console.log("→ open", url);
            await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
            // ждём, пока Plasmic смонтируется
            await page.waitForFunction(() => {
                const el = document.getElementById("root");
                return el && el.innerHTML.trim().length > 0;
            }, { timeout: 60000 });

            const styles = await page.evaluate(() => Array.from(document.querySelectorAll("head style"))
                .map(s => s.textContent || "").join("\n"));
            const html = await page.evaluate(() => document.getElementById("root").innerHTML);

            const out = `<!-- static export: ${p.url} -->
<style>${styles}</style>
<div class="plasmic-static">
${html}
</div>\n`;
            await fs.mkdir("dist", { recursive: true });
            await fs.writeFile(path.join("dist", `${p.name}.html`), out, "utf8");
            console.log("✔ saved dist/%s.html", p.name);
            await page.close();
        }
    } finally {
        await browser.close();
        preview.kill("SIGTERM");
    }
}

run().catch(e => { console.error(e); process.exit(1); });
