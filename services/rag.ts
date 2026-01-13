import clientPromise from "../lib/mongodb";
import type { Document } from "mongodb";

const DB_NAME = process.env.MONGODB_DB || "shepherdai";
const VERSES_COLLECTION = "verses";

/* ---------------------------
   Embedding function placeholder
   ---------------------------
   Implement createEmbedding() for your environment.

   Example (pseudo-code for Gemini SDK — adapt to the exact SDK call in your project):

   import { GoogleGenerativeAI } from "@google/generative-ai";
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

   async function createEmbedding(text: string): Promise<number[]> {
     // Replace with actual SDK call. The shape below is illustrative.
     const model = genAI.getEmbeddingModel({ model: "models/text-embedding-004" });
     const resp = await model.embedContent({ input: text });
     // adapt to the SDK response shape: resp.embedding || resp.output[0].embedding
     return resp.embedding;
   }
*/

export async function createEmbedding(text: string): Promise<number[]> {
  throw new Error(
    "createEmbedding() not implemented. Plug your embeddings SDK call here (text-embedding-004). See comments in this file."
  );
}

/* ---------------------------
   Vector math (cosine similarity)
   --------------------------- */
function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function norm(a: number[]) {
  return Math.sqrt(dot(a, a));
}
function cosineSim(a: number[], b: number[]) {
  const na = norm(a);
  const nb = norm(b);
  if (na === 0 || nb === 0) return -1;
  return dot(a, b) / (na * nb);
}

/* ---------------------------
   Index a verse (one-time / seed)
   --------------------------- */
export async function indexVerse(ref: string, text: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection(VERSES_COLLECTION);

  const embedding = await createEmbedding(text);

  const doc = {
    ref,
    text,
    embedding,
    createdAt: new Date(),
  };

  await col.updateOne({ ref }, { $set: doc }, { upsert: true });
  return doc;
}

/* ---------------------------
   Query top-k verses (for in-memory similarity)
   - Good for prototyping with the full Bible (~31k verses).
   - For production, use Atlas Vector Search or a vector DB.
   --------------------------- */
export async function queryTopKVerses(query: string, k = 5) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const col = db.collection(VERSES_COLLECTION);

  const qEmbedding = await createEmbedding(query);

  // Load all verses embeddings into memory (acceptable for prototyping).
  // For production, use a vector search index..
  const cursor = col.find({ embedding: { $exists: true } }) as any;
  const all = (await cursor.toArray()) as (Document & { embedding: number[]; ref: string; text: string })[];

  // compute total scores
  const scored = all
    .map((v) => {
      const score = cosineSim(qEmbedding, v.embedding);
      return { ref: v.ref, text: v.text, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored;
}
