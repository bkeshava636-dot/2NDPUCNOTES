import { db, kcetSubjectsTable, kcetCategoriesTable, kcetCounsellingTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import { supabase } from "../supabase.js";

export const BUCKET_KCET = "kcet-materials";

export const DEFAULT_KCET_SUBJECTS = [
  {
    name: "Physics",
    slug: "physics",
    description: "Mechanics, Electrodynamics, Optics, Modern Physics shortcuts & conceptual MCQs",
    iconName: "Atom",
    gradient: "from-cyan-500 to-blue-600",
    sortOrder: 1,
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    description: "Physical numericals, Organic reaction maps, Inorganic trends & NCERT line MCQs",
    iconName: "FlaskConical",
    gradient: "from-fuchsia-500 to-purple-600",
    sortOrder: 2,
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Calculus speed-tricks, Matrices, Vectors, 3D Geometry & Probability drills",
    iconName: "Sigma",
    gradient: "from-indigo-500 to-violet-600",
    sortOrder: 3,
  },
  {
    name: "Biology",
    slug: "biology",
    description: "Botany, Zoology, Genetics & Human Physiology rapid NCERT high-yield banks",
    iconName: "Dna",
    gradient: "from-emerald-500 to-teal-600",
    sortOrder: 4,
  },
];

export const DEFAULT_KCET_CATEGORIES = [
  {
    name: "Notes",
    slug: "notes",
    description: "Chapter-wise quick revision notes tailored for KCET objective speed",
    iconName: "BookOpen",
    sortOrder: 1,
  },
  {
    name: "PYQs",
    slug: "pyqs",
    description: "Previous Year Question papers with year-wise filtering & official keys",
    iconName: "History",
    sortOrder: 2,
  },
  {
    name: "Mock Papers",
    slug: "mock-papers",
    description: "Full-length 60-minute & subject-wise competitive practice tests",
    iconName: "FileCheck2",
    sortOrder: 3,
  },
  {
    name: "Syllabus",
    slug: "syllabus",
    description: "Official KEA KCET chapter weightage, deleted topics & blueprint analysis",
    iconName: "ListChecks",
    sortOrder: 4,
  },
  {
    name: "Objective Books",
    slug: "objective-books",
    description: "MCQ reference guides, MTG/NCERT fingertips & rank-booster PDFs",
    iconName: "Library",
    sortOrder: 5,
  },
  {
    name: "Formulas",
    slug: "formulas",
    description: "Chapter-wise formula sheets, reaction charts & rapid cheat sheets",
    iconName: "Zap",
    sortOrder: 6,
  },
];

export const DEFAULT_KCET_COUNSELLING_GUIDE = {
  slug: "2026-kea-counselling-guide",
  title: "Official KCET 2026 KEA Counselling Guide",
  subtitle: "Step-by-step breakdown of seats, verification slip, option entry, mock round, and college admission",
  notice: "Pre-Round update: Currently removed by KEA for 2026. Computer Science seat cap (900 seats/college) order is yet to be officially issued.",
  academicYear: "2026",
  isPublished: true,
  content: `This guide breaks down the entire official 2026 KEA process step-by-step.

# Part 1: How are Seats Decided? (The 3 Entrance Tracks)

Think of KEA Counseling as a **giant, automated matchmaking system**. It runs on high-end software (acc to KEA) to distribute seats with 100% transparency based on merit, seat availability, and government reservation rules (the "roster" system). No human can manually interfere with your allocation.

Depending on the course you want, KEA matches you using one of three tracks:

### YOUR CHOSEN PATHWAY
1. **NEET Rank** → Medical, Dental, AYUSH Courses
2. **KCET Rank** → Engineering, Nursing, Veterinary, Agriculture, Pharmacy
3. **Class 12 Marks** → BPT, BPO, Allied Health Sciences, D-Pharma

---

# Part 2: The Step-by-Step 2026 Journey

The entire counseling process flows through 6 key stages online:

\`[1. Download Verification Slip] ➔ [2. Pay Fee & Register] ➔ [3. Option Entry] ➔ [4. Practice Mock Round] ➔ [5. Real Rounds] ➔ [6. College Reporting]\`

### Stage 1: Get Your Verification Slip
Once ranks are out, you must log into the KEA portal and download your **Verification Slip**. This document is your official passport to counseling. It contains all your personal details, verified categories (like 2A, 3B, Hyderabad-Karnataka, Rural, etc.), and a **highly important QR Code** printed on it.

### Stage 2: Pay the ₹750 Entry Fee & Login
To activate your option entry dashboard, you must pay a **₹750 non-refundable Option Entry Fee** online (via UPI, NetBanking, or card).

* **The Login Process:** To enter the secure portal, you must scan the QR code from your Verification Slip (or manually type your Application Number and Option Entry CET Number), undergo a **live Face Recognition check** via webcam/phone camera, and enter a 6-digit OTP sent to your registered SMS, WhatsApp, or Email.

### Stage 3: Submit Your Wishlist ("Option Entry")
You choose college-and-course combinations and rank them in order of preference (Priority numbers: 1, 2, 3, etc.).
* *Example:*
   1. RV College - Computer Science
   2. BMS College - Computer Science
   3. PES University - Electronics
* You can add as many choices as you want (100, 200, or even more!).

### Stage 4: The Practice Run ("Mock Allotment")
The computer runs a simulation. It looks at your wishlist, compares it to everyone else's ranks, and tells you what seat you *would* get.  
*"Hey, based on your rank, if this were the real round, you would get Choice 12 on your list."*  
This gives you a clear picture of where you stand.  
You then get 2 to 3 days to **add, delete, or rearrange** your list!

### Stage 5: The Pre-Round (NEWLY ADDED FOR 2026) (REMOVED CURRENTLY)
Because NEET (Medical) results can be delayed, KEA runs a special **"Pre-Round"** in July for non-medical courses (Engineering, Agriculture, Veterinary, Pharmacy, B.Sc Nursing, D-Pharma).

* **If you get your dream seat in the Pre-Round:** You pay the fees, download your admission order, and happily exit the system early.
* **If you don't like it:** You can refuse the pre-round seat and enter the main Round 1 automatically.

About pre round: https://www.reddit.com/r/kcet/s/6mhLmruSBw

### Stage 6: The Real Rounds (Round 1, Round 2, & Round 3)
KEA runs the official, binding allotment rounds (2 regular rounds + 1 extended/mop-up round) for all courses combined.

---

# Part 3: KEA's Golden Rules of Option Entry

Option entry is where most students make critical mistakes. Keep these official rules in mind:

1. **The "Round 1 Only" Rule (CRITICAL):** The wishlist you enter and save in Round 1 is your **permanent wishlist** for all subsequent rounds. You are **NOT allowed to add new colleges/courses** in Round 2 or Round 3. You can only delete options or reorder your higher-placed options. The only exception is if KEA officially adds a brand-new college to the seat matrix mid-counseling.
2. **The Farmer’s Quota Code Difference:** If you applied for Veterinary (BVSc) or Agricultural courses and qualify for both the **Regular Rank** and the **Practical Rank (Farmers Quota)**, you must enter options for them **separately**. The college codes for regular seats and practical seats are entirely different.
3. **Save Every 2 Minutes:** The KEA portal is highly secure but can time out. Always click **"Save & Submit"** every 2 minutes while entering options.
4. **How to Delete Options:** If you want to delete a college choice from your wishlist, change its priority number to 0 (zero) and click **"Update Options."**

---

# Part 4: How to Build Your Wishlist (The "Shopping Strategy")

When building your wishlist, you can mix and match different streams (e.g., Choice #1: Bangalore Medical College MBBS, Choice #2: RV College Computer Science, Choice #3: Veterinary College Hebbal) on the same page.

| The Bucket | What it means | How to use it |
| :--- | :--- | :--- |
| **1. The "Dream" Bucket** *(Ambitious)* | Top-tier colleges where last year's cutoff rank was slightly higher than your rank. | Put these at the very top (first 20% of your list). If someone drops out, you might get lucky! |
| **2. The "Real" Bucket** *(Target)* | Colleges where your rank perfectly matches last year’s cutoffs. | Put these in the middle (next 30%). This is your most realistic zone. |
| **3. The "Safety" Bucket** *(Safe)* | Good colleges where your rank is much higher than last year’s cutoff. | Put these at the bottom (final 30%). This is your insurance policy to guarantee a seat. |

⚠️ **THE COMPUTER SCIENCE SEAT CAP:** A KEA rule limits the sum of all Computer Science seats (Core CS, AI & ML, Data Science, Cyber Security, etc.) to a maximum of 900 seats per college. Because elite colleges have fewer CS seats to hand out, **cutoffs in engineering will be tougher/lower this year. (GOV ORDER YET TO BE ISSUED)**

---

# Part 5: You Got a Seat! The 4 Choices & Medical Rules

Once Round 1 is over, KEA will display your allotted seat. You must consult with your parents and select one of the following 4 choices:

* **Choice 1: "I'm buying it!"**  
  You accept the seat, pay the college fees, and leave the counseling system.
* **Choice 2: "Hold this item in my cart, but let's see if I can get a better option on my wishlist."**  
  You pay the fees to safely secure this seat. You enter Round 2. The computer will *only* look at choices you ranked *higher* than this one. If you get a better one, you automatically move up. If you don't, you keep your original Choice 2 seat. *(This is the safest and most popular option!)*
* **Choice 3: "I don't want this item. Throw it away, but keep me in the store to see if my higher options open up."**  
  You reject the seat completely. You enter Round 2 empty-handed. *(Warning: This is risky. If you don't get a higher choice, you are left with nothing!)*
* **Choice 4: "I am leaving the store entirely."**  
  You reject the seat and completely exit the KEA system (usually because you got a seat in IIT, NIT, COMED-K, or private universities).

### Special Medical (UGNEET) Penalty Waiver Rule
Medical students are allowed to participate in both **MCC (All India Quota)** and **KEA (State Quota)** counseling in Round 1 and Round 2. If you are allotted a seat in both systems and choose to accept the All India seat, you can surrender your KEA seat **without paying any penalty or fine**.
* *Warning:* This penalty-free surrender is **only** valid during Round 1 and Round 2. If you try to exit a KEA medical seat in later rounds, you will face severe financial penalties.

---

# Part 6: Fee Payment & Reporting to College

If you select **Choice 1**, you must complete your admission using the following official process:

\`[Download Choice-1 Print & Challan] ➔ [Pay at Bank or Online] ➔ [Download KEA Confirmation Slip] ➔ [Report to College for OTP & Face Scan]\`

1. **Fee Payment:** Log in and download your customized KEA bank challan to pay at the bank, or complete the payment directly on the portal using the online gateway. Save your Transaction UTR/Reference number.
2. **Download Confirmation Slip:** Once the payment is verified, download your official **Confirmation Slip** from the KEA website.
3. **Go to College with Originals:** Visit the allotted college before the last date. Bring your Confirmation Slip, all original academic/category documents, two sets of photocopies, and the mobile phone registered with KEA.
4. **The Verification & OTP Step:** The college authorities will log into their portal, verify your documents, and use an **online Face Recognition system** to scan your face. A secure OTP will be sent to your registered mobile/WhatsApp.
5. **Provisional Admission Order:** Once the OTP is verified, the college will generate your **Provisional Admission Order**. Both you and the college authority will sign two copies of this order (one copy is yours, one is the college's) to officially secure your seat!

---

# Part 7: Watch out for Fraudsters!

KEA seat allotment is entirely software-automated, transparent, and merit-based. **No politician, broker, or agent can secure a seat for you through "backdoors" or bribes.** If anyone claims they can get you a seat through KEA connections, report them immediately in writing or via email to KEA officials!

---

# Your Action Plan for Today

Do not wait for the rank list to come out! Start doing these three things right now:

1. **Find your target rank bracket:** Use an online "Rank Predictor" based on your estimated KCET marks to guess your approximate rank.
2. **Shortlist your favorite branches:** Don't just blindly chase Computer Science if you don't like coding. Look into Information Science, Electronics, Mechanical, or Biotech.
3. **Explore Colleges:** Start looking at college placements, fees, distance from your home, and whether they are Autonomous (they make their own exams/syllabus) or VTU-affiliated.`,
};

let kcetInitialized = false;
let initPromise: Promise<void> | null = null;
let bucketEnsured = false;

export async function ensureKcetBucket(): Promise<string> {
  if (bucketEnsured) return BUCKET_KCET;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET_KCET);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET_KCET, { public: false });
    }
    bucketEnsured = true;
  } catch {
    // Fallback cleanly if storage policy restricts listBuckets
  }
  return BUCKET_KCET;
}

export async function ensureKcetTablesAndDefaults(): Promise<void> {
  if (kcetInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS kcet_subjects (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon_name TEXT NOT NULL DEFAULT 'Atom',
          gradient TEXT NOT NULL DEFAULT 'from-cyan-500 to-blue-600',
          is_visible BOOLEAN NOT NULL DEFAULT true,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon_name TEXT NOT NULL DEFAULT 'FileText',
          is_visible BOOLEAN NOT NULL DEFAULT true,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_materials (
          id SERIAL PRIMARY KEY,
          subject TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          chapter TEXT,
          year INTEGER,
          pdf_url TEXT NOT NULL,
          file_size_kb INTEGER,
          page_count INTEGER,
          download_count INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          is_visible BOOLEAN NOT NULL DEFAULT true,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_contributions (
          id SERIAL PRIMARY KEY,
          subject TEXT NOT NULL,
          category TEXT NOT NULL,
          title TEXT NOT NULL,
          chapter TEXT,
          year INTEGER,
          description TEXT,
          file_url TEXT NOT NULL,
          contributor_name TEXT,
          contributor_contact TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_downloads (
          id SERIAL PRIMARY KEY,
          material_id INTEGER NOT NULL,
          ip_address TEXT,
          device_info TEXT,
          downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS kcet_counselling (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE DEFAULT '2026-kea-counselling-guide',
          title TEXT NOT NULL DEFAULT 'Official KCET 2026 KEA Counselling Guide',
          subtitle TEXT DEFAULT 'Step-by-step breakdown of seats, verification slip, option entry, mock round, and college admission',
          notice TEXT DEFAULT 'Pre-Round update: Currently removed by KEA for 2026. Computer Science seat cap (900 seats/college) order is yet to be officially issued.',
          content TEXT NOT NULL,
          academic_year TEXT NOT NULL DEFAULT '2026',
          is_published BOOLEAN NOT NULL DEFAULT true,
          updated_by TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_kcet_materials_subject ON kcet_materials(subject);
        CREATE INDEX IF NOT EXISTS idx_kcet_materials_category ON kcet_materials(category);
        CREATE INDEX IF NOT EXISTS idx_kcet_counselling_slug ON kcet_counselling(slug);
      `);

      // Seed default subjects if table is empty
      const existingSubjects = await db.select().from(kcetSubjectsTable);
      if (existingSubjects.length === 0) {
        for (const sub of DEFAULT_KCET_SUBJECTS) {
          const found = await db
            .select()
            .from(kcetSubjectsTable)
            .where(eq(kcetSubjectsTable.slug, sub.slug));
          if (found.length === 0) {
            await db.insert(kcetSubjectsTable).values(sub).onConflictDoNothing();
          }
        }
      }

      // Seed default categories if table is empty
      const existingCategories = await db.select().from(kcetCategoriesTable);
      if (existingCategories.length === 0) {
        for (const cat of DEFAULT_KCET_CATEGORIES) {
          const found = await db
            .select()
            .from(kcetCategoriesTable)
            .where(eq(kcetCategoriesTable.slug, cat.slug));
          if (found.length === 0) {
            await db.insert(kcetCategoriesTable).values(cat).onConflictDoNothing();
          }
        }
      }

      // Seed default counselling guide if table is empty
      const existingCounselling = await db.select().from(kcetCounsellingTable);
      if (existingCounselling.length === 0) {
        await db.insert(kcetCounsellingTable).values(DEFAULT_KCET_COUNSELLING_GUIDE).onConflictDoNothing();
      }

      kcetInitialized = true;
    } catch (err) {
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}
