import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const require = createRequire(import.meta.url);

// Mirrors resolveDefaultConfigPath in tailwindcss/lib/util/resolveConfigPath.js,
// including its order — .js wins over .ts when both exist.
const CONFIG_FILES = [
	"tailwind.config.js",
	"tailwind.config.cjs",
	"tailwind.config.mjs",
	"tailwind.config.ts",
	"tailwind.config.cts",
	"tailwind.config.mts",
];

function resolveConfigPath() {
	for (const name of CONFIG_FILES) {
		const candidate = path.resolve(process.cwd(), name);
		if (existsSync(candidate)) return candidate;
	}
	return null;
}

// Tailwind loads tailwind.config.js through jiti + sucrase, and Vite blames the
// CSS entry file when that fails — the config's path never appears, so the error
// reads as an OKLCH or stylesheet problem. Load it here first, through Tailwind's
// own loader so this can never disagree with it, and name the file that is
// actually at fault. AGE-501.
const surfaceTailwindConfigErrors = {
	postcssPlugin: "caffeine-surface-tailwind-config-errors",
	Once(root) {
		// An @config directive overrides it, and resolves relative to the CSS
		// file — leave that case entirely to Tailwind.
		let hasAtConfig = false;
		root.walkAtRules("config", () => {
			hasAtConfig = true;
		});
		if (hasAtConfig) return;

		const configPath = resolveConfigPath();
		if (!configPath) return;

		const { loadConfig } = require("tailwindcss/lib/lib/load-config.js");
		try {
			loadConfig(configPath);
		} catch (error) {
			throw new Error(
				`${path.basename(configPath)} failed to load: ${error.message}\n` +
					`The error is in ${configPath}. Tailwind reports the failure ` +
					`against your CSS entry file, which is misleading.`,
			);
		}
	},
};

export default {
	plugins: [surfaceTailwindConfigErrors, tailwindcss(), autoprefixer()],
};
