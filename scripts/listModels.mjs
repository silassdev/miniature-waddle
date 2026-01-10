// scripts/listModels.mjs
import 'dotenv/config';
// Node 18+ required (native fetch)
// Usage:
//  GENERATIVE_API_KEY=YOUR_KEY node scripts/listModels.mjs
//  or
//  GENERATIVE_OAUTH_TOKEN=YOUR_OAUTH_TOKEN node scripts/listModels.mjs

const API_URL = "https://generativelanguage.googleapis.com/v1/models";

function short(s, n = 220) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n).trim() + "…" : s;
}

(async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GENERATIVE_API_KEY;
        const oauthToken = process.env.GENERATIVE_OAUTH_TOKEN;

        if (!apiKey && !oauthToken) {
            console.error(
                "Missing credentials. Set GENERATIVE_API_KEY or GENERATIVE_OAUTH_TOKEN in env before running."
            );
            process.exit(1);
        }

        const url = apiKey ? `${API_URL}?key=${encodeURIComponent(apiKey)}` : API_URL;
        const headers = oauthToken
            ? { Authorization: `Bearer ${oauthToken}`, Accept: "application/json" }
            : { Accept: "application/json" };

        console.log("Requesting model list from:", apiKey ? url : API_URL);
        const res = await fetch(url, { headers });

        const text = await res.text();
        if (!res.ok) {
            console.error("Request failed:", res.status, res.statusText);
            try {
                console.error("Response body:", JSON.parse(text));
            } catch (e) {
                console.error("Response body:", text);
            }
            process.exit(2);
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
            console.log("Raw response:", text);
            process.exit(3);
        }

        const models = Array.isArray(data.models) ? data.models : data.model ? [data.model] : [];

        if (!models.length) {
            console.log("No `models` array in response. Raw response:");
            console.log(JSON.stringify(data, null, 2));
            process.exit(0);
        }

        console.log(`\nFound ${models.length} model(s):\n`);

        models.forEach((m, i) => {
            console.log(`--- Model ${i + 1} ---`);
            console.log("name:        ", m.name ?? m.model ?? "(no name field)");
            if (m.displayName) console.log("displayName: ", m.displayName);
            if (m.description) console.log("description: ", short(m.description));
            // common fields that might exist
            if (m.supportedGenerationMethods) {
                console.log("supportedGenerationMethods:", m.supportedGenerationMethods.join(", "));
            }
            if (m.supportedMethods) {
                console.log("supportedMethods:", JSON.stringify(m.supportedMethods));
            }
            if (m.available && typeof m.available === "object") {
                console.log("availability:", JSON.stringify(m.available));
            }
            // fallback: print other interesting keys
            const otherKeys = Object.keys(m).filter(
                (k) =>
                    ![
                        "name",
                        "displayName",
                        "description",
                        "supportedGenerationMethods",
                        "supportedMethods",
                        "available",
                    ].includes(k)
            );
            if (otherKeys.length) {
                console.log("other keys:  ", otherKeys.join(", "));
            }
            // small pretty JSON for this model (truncated)
            try {
                const pretty = JSON.stringify(m, null, 2);
                console.log("\nfull model JSON (truncated to 2000 chars):");
                console.log(pretty.slice(0, 2000));
                if (pretty.length > 2000) console.log("…(truncated)");
            } catch (e) {
                // ignore
            }
            console.log("\n");
        });

        console.log("If you want, paste the names (the `name` field) of one or two models here and I will update your /api/chat example to use a supported model and correct endpoint shape.");
    } catch (err) {
        console.error("Unexpected error:", err);
        process.exit(99);
    }
})();
