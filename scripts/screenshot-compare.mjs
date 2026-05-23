import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "screenshots");

const LOCAL = "http://localhost:3000";
const REFERENCE = "https://buildaustralia.com";

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/manifesto", name: "manifesto" },
  { path: "/projects", name: "projects" },
  { path: "/projects/stock-tracker", name: "stock-tracker" },
  { path: "/projects/what-can-australia-build", name: "what-can-build" },
  { path: "/projects/what-can-australia-build/product/solar-panels", name: "supply-solar" },
  { path: "/projects/what-can-australia-build/product/batteries", name: "supply-batteries" },
  { path: "/projects/what-can-australia-build/product/steel", name: "supply-steel" },
  { path: "/essays", name: "essays" },
  { path: "/essays/its-time-to-build-australia", name: "essay-detail" },
  { path: "/store", name: "store" },
  { path: "/contact", name: "contact" },
  { path: "/get-involved", name: "get-involved" },
  { path: "/newsletter", name: "newsletter" },
  { path: "/privacy", name: "privacy" },
  { path: "/contribute", name: "contribute" },
];

const LOCAL_ROUTES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/manifesto", name: "manifesto" },
  { path: "/projetos", name: "projects" },
  { path: "/projetos/rastreador-b3", name: "stock-tracker" },
  { path: "/projetos/o-que-o-brasil-pode-construir", name: "what-can-build" },
  { path: "/projetos/o-que-o-brasil-pode-construir/placas-solares", name: "supply-solar" },
  { path: "/projetos/o-que-o-brasil-pode-construir/baterias", name: "supply-batteries" },
  { path: "/projetos/o-que-o-brasil-pode-construir/aco", name: "supply-steel" },
  { path: "/essays", name: "essays" },
  { path: "/essays/its-time-to-build", name: "essay-detail" },
  { path: "/store", name: "store" },
  { path: "/store/product/pax-brasiliana-tee", name: "store-product" },
  { path: "/contact", name: "contact" },
  { path: "/get-involved", name: "get-involved" },
  { path: "/newsletter", name: "newsletter" },
  { path: "/privacy", name: "privacy" },
  { path: "/contribute", name: "contribute" },
];

const VIEWPORTS = [
  { width: 1440, height: 900, label: "desktop" },
  { width: 375, height: 812, label: "mobile" },
];

async function screenshot(page, url, filepath) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`  OK  ${filepath}`);
  } catch (err) {
    console.log(`  SKIP ${filepath} — ${err.message}`);
  }
}

async function run() {
  const mode = process.argv[2] || "both";
  const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, "-");
  const dir = join(OUT, timestamp);

  await mkdir(join(dir, "local"), { recursive: true });
  await mkdir(join(dir, "reference"), { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 120000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport(vp);
    console.log(`\n— ${vp.label} (${vp.width}x${vp.height}) —`);

    if (mode === "both" || mode === "local") {
      console.log("\nLocal (Pax Brasiliana):");
      for (const route of LOCAL_ROUTES) {
        const file = join(dir, "local", `${route.name}-${vp.label}.png`);
        await screenshot(page, `${LOCAL}${route.path}`, file);
      }
    }

    if (mode === "both" || mode === "reference") {
      console.log("\nReference (Build Australia):");
      for (const route of ROUTES) {
        const file = join(dir, "reference", `${route.name}-${vp.label}.png`);
        await screenshot(page, `${REFERENCE}${route.path}`, file);
      }
    }
  }

  await browser.close();
  console.log(`\nScreenshots saved to: ${dir}`);
}

run();
