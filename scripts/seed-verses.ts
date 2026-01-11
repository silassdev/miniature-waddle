import "dotenv/config";
import clientPromise from "../lib/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set. Set it in your environment.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const EMBEDDING_MODEL = "models/text-embedding-004";
const DB_NAME = process.env.MONGODB_DB || "shepherdai";
const VERSES_COLLECTION = "verses";

/**
 * Robust extractor for embedding response shapes across SDK versions.
 */
async function extractEmbedding(resp: any): Promise<number[] | null> {
  if (!resp) return null;
  if (Array.isArray(resp?.embedding)) return resp.embedding;
  if (Array.isArray(resp?.data?.[0]?.embedding)) return resp.data[0].embedding; // some SDKs
  if (Array.isArray(resp?.output?.[0]?.embedding)) return resp.output[0].embedding;
  if (Array.isArray(resp?.response?.embedding)) return resp.response.embedding;
  // try nested candidate/content patterns
  if (Array.isArray(resp?.candidates) && Array.isArray(resp.candidates[0]?.embedding)) {
    return resp.candidates[0].embedding;
  }
  return null;
}

async function createEmbedding(text: string): Promise<number[]> {
  // get embedding model handle
  const embedModel: any = genAI.getEmbeddingModel
    ? genAI.getEmbeddingModel({ model: EMBEDDING_MODEL })
    : // some SDKs may use generative model handles for embedding; fallback:
    genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  // try common SDK call names
  let resp: any;
  try {
    if (typeof embedModel.embedContent === "function") {
      resp = await embedModel.embedContent({ input: text });
    } else if (typeof embedModel.embed === "function") {
      resp = await embedModel.embed({ input: text });
    } else if (typeof embedModel.generateEmbedding === "function") {
      resp = await embedModel.generateEmbedding({ input: text });
    } else {
      // last-resort: attempt generateContent and try to parse embedding
      resp = await embedModel.generateContent({ input: text });
    }
  } catch (err) {
    console.error("Embedding call failed for text:", text.slice(0, 60), err);
    throw err;
  }

  const embedding = await extractEmbedding(resp);
  if (!embedding) {
    console.error("Failed to extract embedding from response:", JSON.stringify(resp).slice(0, 800));
    throw new Error("Embedding extraction failed");
  }
  return embedding;
}

/* -------------------------------
   KJV Verses (topical, ~50 entries)
   Fields: { ref, text, tags }
   KJV is public domain.
   ------------------------------- */
const VERSES: { ref: string; text: string; tags: string[] }[] = [
  // Comfort (10)
  { ref: "Psalm 34:18", text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.", tags: ["comfort", "broken-hearted"] },
  { ref: "Matthew 5:4", text: "Blessed are they that mourn: for they shall be comforted.", tags: ["comfort", "mourning"] },
  { ref: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God...", tags: ["comfort", "presence"] },
  { ref: "Psalm 23:4", text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil...", tags: ["comfort", "valley"] },
  { ref: "2 Corinthians 1:3", text: "Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort;", tags: ["comfort", "mercies"] },
  { ref: "Psalm 147:3", text: "He healeth the broken in heart, and bindeth up their wounds.", tags: ["comfort", "healing"] },
  { ref: "Romans 8:28", text: "And we know that all things work together for good to them that love God...", tags: ["comfort", "providence"] },
  { ref: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble.", tags: ["comfort", "refuge"] },
  { ref: "Lamentations 3:22", text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not.", tags: ["comfort", "mercies"] },
  { ref: "John 14:27", text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled.", tags: ["comfort", "peace"] },

  // Forgiveness (8)
  { ref: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", tags: ["forgiveness", "confession"] },
  { ref: "Psalm 103:12", text: "As far as the east is from the west, so far hath he removed our transgressions from us.", tags: ["forgiveness", "removal"] },
  { ref: "Isaiah 1:18", text: "Though your sins be as scarlet, they shall be as white as snow.", tags: ["forgiveness", "purity"] },
  { ref: "Ephesians 1:7", text: "In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace;", tags: ["forgiveness", "redemption"] },
  { ref: "Colossians 3:13", text: "Forbearing one another, and forgiving one another; even as Christ forgave you.", tags: ["forgiveness", "forbearance"] },
  { ref: "Matthew 6:14", text: "For if ye forgive men their trespasses, your heavenly Father will also forgive you:", tags: ["forgiveness", "command"] },
  { ref: "Psalm 32:5", text: "I acknowledged my sin unto thee, and mine iniquity have I not hid. I said, I will confess my transgressions unto the LORD; and thou forgavest the iniquity of my sin.", tags: ["forgiveness", "confession"] },
  { ref: "Micah 7:18", text: "Who is a God like unto thee, that pardoneth iniquity, and passeth by the transgression of the remnant of his heritage?", tags: ["forgiveness", "pardon"] },

  // Anxiety / Peace (8)
  { ref: "Philippians 4:6-7", text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God... shall keep your hearts and minds through Christ Jesus.", tags: ["anxiety", "peace", "prayer"] },
  { ref: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", tags: ["anxiety", "rest"] },
  { ref: "Psalm 55:22", text: "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.", tags: ["anxiety", "burden"] },
  { ref: "Isaiah 26:3", text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.", tags: ["anxiety", "peace"] },
  { ref: "1 Peter 5:7", text: "Casting all your care upon him; for he careth for you.", tags: ["anxiety", "care"] },
  { ref: "Psalm 94:19", text: "In the multitude of my thoughts within me thy comforts delight my soul.", tags: ["anxiety", "comfort"] },
  { ref: "Romans 15:13", text: "Now the God of hope fill you with all joy and peace in believing...", tags: ["anxiety", "hope"] },
  { ref: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", tags: ["anxiety", "trust"] },

  // Strength / Hope (8)
  { ref: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles;", tags: ["strength", "hope"] },
  { ref: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me.", tags: ["strength", "Christ"] },
  { ref: "Psalm 27:1", text: "The LORD is my light and my salvation; whom shall I fear?", tags: ["strength", "fearless"] },
  { ref: "Habakkuk 3:19", text: "The LORD God is my strength, and he will make my feet like hinds' feet...", tags: ["strength", "trust"] },
  { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil...", tags: ["hope", "future"] },
  { ref: "Romans 8:31", text: "If God be for us, who can be against us?", tags: ["hope", "assurance"] },
  { ref: "Deuteronomy 31:6", text: "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God is with thee.", tags: ["strength", "courage"] },
  { ref: "Psalm 31:24", text: "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.", tags: ["strength", "courage"] },

  // Guidance / Wisdom (6)
  { ref: "James 1:5", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally...", tags: ["wisdom", "guidance"] },
  { ref: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path.", tags: ["guidance", "word"] },
  { ref: "Isaiah 30:21", text: "Thine ears shall hear a word behind thee, saying, This is the way, walk ye in it...", tags: ["guidance", "direction"] },
  { ref: "Matthew 7:7", text: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.", tags: ["guidance", "ask"] },
  { ref: "Proverbs 16:9", text: "A man's heart deviseth his way: but the LORD directeth his steps.", tags: ["guidance", "steps"] },
  { ref: "Psalm 25:4", text: "Shew me thy ways, O LORD; teach me thy paths.", tags: ["guidance", "teach"] },

  // Encouragement / Healing (10)
  { ref: "James 5:16", text: "The effectual fervent prayer of a righteous man availeth much.", tags: ["prayer", "healing"] },
  { ref: "Mark 5:34", text: "Daughter, thy faith hath made thee whole; go in peace, and be whole of thy plague.", tags: ["healing", "faith"] },
  { ref: "2 Corinthians 12:9", text: "My grace is sufficient for thee: for my strength is made perfect in weakness.", tags: ["encouragement", "grace"] },
  { ref: "Psalm 103:2-3", text: "Bless the LORD, O my soul, who forgiveth all thine iniquities; who healeth all thy diseases.", tags: ["healing", "forgiveness"] },
  { ref: "Exodus 15:2", text: "The LORD is my strength and song, and he is become my salvation.", tags: ["strength", "praise"] },
  { ref: "John 16:33", text: "In the world ye shall have tribulation: but be of good cheer; I have overcome the world.", tags: ["encouragement", "overcome"] },
  { ref: "Romans 12:12", text: "Rejoicing in hope; patient in tribulation; continuing instant in prayer.", tags: ["encouragement", "prayer"] },
  { ref: "Hebrews 4:16", text: "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.", tags: ["encouragement", "grace"] },
  { ref: "1 Thessalonians 5:16", text: "Rejoice evermore.", tags: ["encouragement", "joy"] },
  { ref: "Psalm 46:10", text: "Be still, and know that I am God.", tags: ["encouragement", "stillness"] },
];

async function upsertVerse(db: any, v: { ref: string; text: string; tags: string[] }) {
  const col = db.collection(VERSES_COLLECTION);
  const existing = await col.findOne({ ref: v.ref });
  if (existing && existing.embedding && existing.embedding.length > 0) {
    console.log(`Skipping (has embedding): ${v.ref}`);
    return;
  }

  console.log(`Embedding and indexing: ${v.ref}`);
  const embedding = await createEmbedding(v.text);
  const doc = {
    ref: v.ref,
    text: v.text,
    tags: v.tags,
    embedding,
    createdAt: new Date(),
  };
  await col.updateOne({ ref: v.ref }, { $set: doc }, { upsert: true });
}

async function createEmbedding(text: string) {
  // Delegate to createEmbedding wrapper above
  return await createEmbeddingForText(text);
}

// Wrapper to avoid name collision
async function createEmbeddingForText(text: string) {
  return await createEmbeddingImplementation(text);
}

async function createEmbeddingImplementation(text: string) {
  return await createEmbeddingActual(text);
}

async function createEmbeddingActual(text: string) {
  return await (async () => {
    // reuse createEmbedding defined earlier in this file
    return await createEmbeddingInternal(text);
  })();
}

// Actual lowest-level function using SDK
async function createEmbeddingInternal(text: string): Promise<number[]> {
  // implement once using genAI handle above
  const model: any = genAI.getEmbeddingModel
    ? genAI.getEmbeddingModel({ model: EMBEDDING_MODEL })
    : genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  let resp: any;
  if (typeof model.embedContent === "function") {
    resp = await model.embedContent({ input: text });
  } else if (typeof model.embed === "function") {
    resp = await model.embed({ input: text });
  } else if (typeof model.generateContent === "function") {
    // fallback
    resp = await model.generateContent({ input: text });
  } else {
    throw new Error("No supported embedding method found on SDK model object");
  }

  const emb = await extractEmbedding(resp);
  if (!emb) throw new Error("Failed to extract embedding from SDK response");
  return emb;
}

async function main() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  console.log(`Seeding ${VERSES.length} verses into ${DB_NAME}.${VERSES_COLLECTION} ...`);
  for (const v of VERSES) {
    try {
      await upsertVerse(db, v);
    } catch (err) {
      console.error("Failed to index:", v.ref, err);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error seeding verses:", err);
  process.exit(1);
});
