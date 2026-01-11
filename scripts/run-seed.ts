import "dotenv/config";
import fs from "fs";
import clientPromise from "../lib/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VERSES = JSON.parse(fs.readFileSync("scripts/seed-topical-50.json", "utf8"));

async function main() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "shepherdai");
  // assume you have an indexVerse(ref, text) util; otherwise implement embedding+upsert here.
  for (const v of VERSES) {
    console.log("Would index:", v.ref);
    // await indexVerse(v.ref, v.text)  // call your existing function
  }
  process.exit(0);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
