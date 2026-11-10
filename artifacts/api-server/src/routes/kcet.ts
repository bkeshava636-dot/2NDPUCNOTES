import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  db,
  kcetSubjectsTable,
  kcetCategoriesTable,
  kcetMaterialsTable,
  kcetContributionsTable,
  kcetDownloadsTable,
} from "@workspace/db";
import { eq, and, asc, desc, ilike, or, sql } from "drizzle-orm";
import { supabase, BUCKET_NOTES } from "../supabase.js";
import { BUCKET_KCET, ensureKcetBucket, ensureKcetTablesAndDefaults } from "../lib/ensure-kcet.js";

const router = Router();

const uploadPdfMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

const uploadStudentMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max for student contributions
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

function isValidAdminToken(token: string): boolean {
  if (!token || !ADMIN_PASSWORD) return false;
  if (token.startsWith("adm_")) {
    const parts = token.split("_");
    if (parts.length === 3) {
      const ts = parseInt(parts[1], 10);
      if (isNaN(ts)) return false;
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - ts > maxAgeMs) return false;
      const data = `adm_${ts}`;
      const expectedHmac = crypto.createHmac("sha256", ADMIN_PASSWORD).update(data).digest("hex");
      const expected = `adm_${ts}_${expectedHmac}`;
      try {
        return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
      } catch {
        return false;
      }
    }
  }
  return false;
}

function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"] as string;
  if (!token || !isValidAdminToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function extractGoogleDriveFileId(url: string): string | null {
  const matchFile = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile?.[1]) return matchFile[1];
  const matchId = url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId?.[1]) return matchId[1];
  const matchFirstParam = url.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (matchFirstParam?.[1]) return matchFirstParam[1];
  return null;
}

async function resolveStorageUrl(
  fileKeyOrUrl: string,
  downloadName?: string,
  intent: "view" | "download" = "view"
): Promise<string> {
  if (fileKeyOrUrl.startsWith("http://") || fileKeyOrUrl.startsWith("https://")) {
    const driveId = extractGoogleDriveFileId(fileKeyOrUrl);
    if (driveId) {
      return intent === "download"
        ? `https://drive.google.com/uc?export=download&id=${driveId}`
        : `https://drive.google.com/file/d/${driveId}/preview`;
    }
    return fileKeyOrUrl;
  }
  // Support isolated kcet bucket first, fallback to notes bucket if needed
  const bucket = fileKeyOrUrl.startsWith("kcet-bucket:")
    ? BUCKET_KCET
    : await ensureKcetBucket();
  const cleanKey = fileKeyOrUrl.replace(/^kcet-bucket:/, "");

  const options = downloadName ? { download: downloadName } : undefined;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(cleanKey, 3600, options);
  if (!error && data?.signedUrl) {
    return data.signedUrl;
  }

  // Fallback attempt in BUCKET_NOTES with kcet prefix
  const fallback = await supabase.storage.from(BUCKET_NOTES).createSignedUrl(cleanKey, 3600, options);
  if (!fallback.error && fallback.data?.signedUrl) {
    return fallback.data.signedUrl;
  }

  throw new Error(error?.message || "Could not sign KCET file URL");
}

// ── Public KCET Storefront Routes ───────────────────────────────────────────

router.get("/kcet/stats", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const [materialsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(kcetMaterialsTable)
      .where(eq(kcetMaterialsTable.isVisible, true));
    const [subjectsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(kcetSubjectsTable)
      .where(eq(kcetSubjectsTable.isVisible, true));
    const [categoriesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(kcetCategoriesTable)
      .where(eq(kcetCategoriesTable.isVisible, true));
    const [downloadsSum] = await db
      .select({ total: sql<number>`coalesce(sum(download_count), 0)::int` })
      .from(kcetMaterialsTable);

    res.json({
      totalMaterials: materialsCount?.count ?? 0,
      totalSubjects: subjectsCount?.count ?? 0,
      totalCategories: categoriesCount?.count ?? 0,
      totalDownloads: downloadsSum?.total ?? 0,
    });
  } catch (err) {
    req.log?.error?.(err, "Failed to fetch KCET stats");
    res.status(500).json({ error: "Failed to fetch KCET stats" });
  }
});

router.get("/kcet/subjects", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const subjects = await db
      .select()
      .from(kcetSubjectsTable)
      .where(eq(kcetSubjectsTable.isVisible, true))
      .orderBy(asc(kcetSubjectsTable.sortOrder), asc(kcetSubjectsTable.id));
    res.json(subjects);
  } catch (err) {
    req.log?.error?.(err, "Failed to fetch KCET subjects");
    res.status(500).json({ error: "Failed to fetch KCET subjects" });
  }
});

router.get("/kcet/categories", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const categories = await db
      .select()
      .from(kcetCategoriesTable)
      .where(eq(kcetCategoriesTable.isVisible, true))
      .orderBy(asc(kcetCategoriesTable.sortOrder), asc(kcetCategoriesTable.id));
    res.json(categories);
  } catch (err) {
    req.log?.error?.(err, "Failed to fetch KCET categories");
    res.status(500).json({ error: "Failed to fetch KCET categories" });
  }
});

router.get("/kcet/materials", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const { subject, category, chapter, year, search, featured } = req.query as Record<string, string>;

    const conditions: any[] = [eq(kcetMaterialsTable.isVisible, true)];

    if (subject && subject !== "all") {
      conditions.push(ilike(kcetMaterialsTable.subject, subject));
    }
    if (category && category !== "all") {
      conditions.push(ilike(kcetMaterialsTable.category, category));
    }
    if (chapter && chapter !== "all") {
      conditions.push(ilike(kcetMaterialsTable.chapter, `%${chapter}%`));
    }
    if (year && year !== "all") {
      const y = parseInt(year, 10);
      if (!isNaN(y)) conditions.push(eq(kcetMaterialsTable.year, y));
    }
    if (featured === "true") {
      conditions.push(eq(kcetMaterialsTable.isFeatured, true));
    }
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(kcetMaterialsTable.title, q),
          ilike(kcetMaterialsTable.description, q),
          ilike(kcetMaterialsTable.chapter, q),
          ilike(kcetMaterialsTable.subject, q),
          ilike(kcetMaterialsTable.category, q)
        )
      );
    }

    const materials = await db
      .select()
      .from(kcetMaterialsTable)
      .where(and(...conditions))
      .orderBy(asc(kcetMaterialsTable.sortOrder), desc(kcetMaterialsTable.createdAt));

    res.json(materials);
  } catch (err) {
    req.log?.error?.(err, "Failed to list KCET materials");
    res.status(500).json({ error: "Failed to list KCET materials" });
  }
});

router.get("/kcet/materials/:id", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid material ID" });
      return;
    }
    const [material] = await db
      .select()
      .from(kcetMaterialsTable)
      .where(and(eq(kcetMaterialsTable.id, id), eq(kcetMaterialsTable.isVisible, true)));
    if (!material) {
      res.status(404).json({ error: "KCET material not found" });
      return;
    }
    res.json(material);
  } catch (err) {
    req.log?.error?.(err, "Failed to get KCET material");
    res.status(500).json({ error: "Failed to get KCET material" });
  }
});

router.get("/kcet/materials/:id/view", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [material] = await db.select().from(kcetMaterialsTable).where(eq(kcetMaterialsTable.id, id));
    if (!material || !material.pdfUrl) {
      res.status(404).json({ error: "PDF not found" });
      return;
    }
    const signedUrl = await resolveStorageUrl(material.pdfUrl);
    res.redirect(302, signedUrl);
  } catch (err: any) {
    req.log?.error?.(err, "Failed to view KCET PDF");
    res.status(500).json({ error: err?.message || "Failed to view PDF" });
  }
});

router.get("/kcet/materials/:id/download", async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [material] = await db.select().from(kcetMaterialsTable).where(eq(kcetMaterialsTable.id, id));
    if (!material || !material.pdfUrl) {
      res.status(404).json({ error: "PDF not found" });
      return;
    }

    const safeFilename = `${material.title.replace(/[^a-zA-Z0-9._-]+/g, "_")}.pdf`;
    const downloadUrl = await resolveStorageUrl(material.pdfUrl, safeFilename, "download");

    await db
      .update(kcetMaterialsTable)
      .set({ downloadCount: sql`${kcetMaterialsTable.downloadCount} + 1` })
      .where(eq(kcetMaterialsTable.id, id))
      .catch(() => {});

    await db
      .insert(kcetDownloadsTable)
      .values({
        materialId: id,
        ipAddress: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || null,
        deviceInfo: (req.headers["user-agent"] as string) || null,
      })
      .catch(() => {});

    if (req.query.mode === "json") {
      res.json({ downloadUrl, filename: safeFilename });
      return;
    }

    res.redirect(302, downloadUrl);
  } catch (err: any) {
    req.log?.error?.(err, "Failed to download KCET PDF");
    res.status(500).json({ error: err?.message || "Failed to download PDF" });
  }
});

// Student Contribution (Public)
router.post("/kcet/contribute", uploadStudentMemory.single("file"), async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const {
      subject,
      category,
      title,
      chapter,
      year,
      description,
      fileUrl: bodyFileUrl,
      contributorName,
      contributorContact,
    } = req.body;

    if (!subject || !category || !title?.trim()) {
      res.status(400).json({ error: "Subject, Category, and Material Title are required" });
      return;
    }

    let finalFileUrl = (bodyFileUrl || "").trim();

    if (req.file) {
      const bucket = await ensureKcetBucket();
      const ext = req.file.originalname.split(".").pop() || "pdf";
      const key = `contributions/${uuidv4()}.${ext}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(key, req.file.buffer, {
          contentType: req.file.mimetype || "application/pdf",
          upsert: false,
        });

      if (error) {
        // Fallback to BUCKET_NOTES under isolated kcet-contributions/ prefix if bucket creation failed
        const fallbackKey = `kcet-contributions/${uuidv4()}.${ext}`;
        const fb = await supabase.storage
          .from(BUCKET_NOTES)
          .upload(fallbackKey, req.file.buffer, {
            contentType: req.file.mimetype || "application/pdf",
            upsert: false,
          });
        if (fb.error) {
          res.status(500).json({ error: "Storage upload failed: " + fb.error.message });
          return;
        }
        finalFileUrl = fallbackKey;
      } else {
        finalFileUrl = `kcet-bucket:${key}`;
      }
    }

    if (!finalFileUrl) {
      res.status(400).json({ error: "Please attach a file or provide a valid link" });
      return;
    }

    const parsedYear = year ? parseInt(year, 10) : null;

    const [created] = await db
      .insert(kcetContributionsTable)
      .values({
        subject: subject.trim(),
        category: category.trim(),
        title: title.trim(),
        chapter: chapter?.trim() || null,
        year: parsedYear && !isNaN(parsedYear) ? parsedYear : null,
        description: description?.trim() || null,
        fileUrl: finalFileUrl,
        contributorName: contributorName?.trim() || "Anonymous",
        contributorContact: contributorContact?.trim() || null,
        status: "pending",
      })
      .returning();

    res.status(201).json(created);
  } catch (err: any) {
    req.log?.error?.(err, "KCET student contribution failed");
    res.status(500).json({ error: err?.message || "Failed to submit contribution" });
  }
});

// ── Admin KCET Routes (Shared Auth) ─────────────────────────────────────────

router.get("/admin/kcet/stats", requireAdmin, async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const [matRow] = await db.select({ count: sql<number>`count(*)::int` }).from(kcetMaterialsTable);
    const [subRow] = await db.select({ count: sql<number>`count(*)::int` }).from(kcetSubjectsTable);
    const [catRow] = await db.select({ count: sql<number>`count(*)::int` }).from(kcetCategoriesTable);
    const [dlRow] = await db
      .select({ total: sql<number>`coalesce(sum(download_count), 0)::int` })
      .from(kcetMaterialsTable);
    const [pendingRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(kcetContributionsTable)
      .where(eq(kcetContributionsTable.status, "pending"));
    const recentMaterials = await db
      .select()
      .from(kcetMaterialsTable)
      .orderBy(desc(kcetMaterialsTable.createdAt))
      .limit(5);

    res.json({
      totalMaterials: matRow?.count ?? 0,
      totalSubjects: subRow?.count ?? 0,
      totalCategories: catRow?.count ?? 0,
      totalDownloads: dlRow?.total ?? 0,
      pendingContributions: pendingRow?.count ?? 0,
      recentMaterials,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to load KCET admin stats" });
  }
});

// Admin KCET PDF Upload
router.post("/admin/kcet/upload/pdf", requireAdmin, uploadPdfMemory.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const bucket = await ensureKcetBucket();
    const ext = req.file.originalname.split(".").pop() || "pdf";
    const key = `materials/${uuidv4()}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(key, req.file.buffer, {
        contentType: req.file.mimetype || "application/pdf",
        upsert: false,
      });

    if (error) {
      const fbKey = `kcet-materials/${uuidv4()}.${ext}`;
      const fb = await supabase.storage
        .from(BUCKET_NOTES)
        .upload(fbKey, req.file.buffer, {
          contentType: req.file.mimetype || "application/pdf",
          upsert: false,
        });
      if (fb.error) {
        res.status(500).json({ error: "Upload to storage failed" });
        return;
      }
      res.json({ key: fbKey, sizeKb: Math.round(req.file.size / 1024) });
      return;
    }

    res.json({ key: `kcet-bucket:${key}`, sizeKb: Math.round(req.file.size / 1024) });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Upload failed" });
  }
});

// Admin KCET Subjects CRUD + Reorder
router.get("/admin/kcet/subjects", requireAdmin, async (req, res) => {
  await ensureKcetTablesAndDefaults();
  const rows = await db
    .select()
    .from(kcetSubjectsTable)
    .orderBy(asc(kcetSubjectsTable.sortOrder), asc(kcetSubjectsTable.id));
  res.json(rows);
});

router.post("/admin/kcet/subjects", requireAdmin, async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const { name, description, iconName, gradient, isVisible, sortOrder } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: "Subject name is required" });
      return;
    }
    const baseSlug = slugify(name.trim());
    const slug = `${baseSlug}`;
    const [created] = await db
      .insert(kcetSubjectsTable)
      .values({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        iconName: iconName || "Atom",
        gradient: gradient || "from-cyan-500 to-blue-600",
        isVisible: isVisible ?? true,
        sortOrder: sortOrder ?? 0,
      })
      .returning();
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to create KCET subject" });
  }
});

router.put("/admin/kcet/subjects/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description, iconName, gradient, isVisible, sortOrder } = req.body;
    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name.trim();
      updateData.slug = slugify(name.trim());
    }
    if (description !== undefined) updateData.description = description;
    if (iconName !== undefined) updateData.iconName = iconName;
    if (gradient !== undefined) updateData.gradient = gradient;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const [updated] = await db
      .update(kcetSubjectsTable)
      .set(updateData)
      .where(eq(kcetSubjectsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to update subject" });
  }
});

router.delete("/admin/kcet/subjects/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(kcetSubjectsTable).where(eq(kcetSubjectsTable.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to delete subject" });
  }
});

router.post("/admin/kcet/subjects/reorder", requireAdmin, async (req, res) => {
  try {
    const { orderedIds } = req.body as { orderedIds: number[] };
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: "orderedIds array required" });
      return;
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await db.update(kcetSubjectsTable).set({ sortOrder: i }).where(eq(kcetSubjectsTable.id, orderedIds[i]));
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Reorder failed" });
  }
});

// Admin KCET Categories CRUD + Reorder
router.get("/admin/kcet/categories", requireAdmin, async (req, res) => {
  await ensureKcetTablesAndDefaults();
  const rows = await db
    .select()
    .from(kcetCategoriesTable)
    .orderBy(asc(kcetCategoriesTable.sortOrder), asc(kcetCategoriesTable.id));
  res.json(rows);
});

router.post("/admin/kcet/categories", requireAdmin, async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const { name, description, iconName, isVisible, sortOrder } = req.body;
    if (!name?.trim()) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }
    const slug = slugify(name.trim());
    const [created] = await db
      .insert(kcetCategoriesTable)
      .values({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        iconName: iconName || "FileText",
        isVisible: isVisible ?? true,
        sortOrder: sortOrder ?? 0,
      })
      .returning();
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to create KCET category" });
  }
});

router.put("/admin/kcet/categories/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description, iconName, isVisible, sortOrder } = req.body;
    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name.trim();
      updateData.slug = slugify(name.trim());
    }
    if (description !== undefined) updateData.description = description;
    if (iconName !== undefined) updateData.iconName = iconName;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const [updated] = await db
      .update(kcetCategoriesTable)
      .set(updateData)
      .where(eq(kcetCategoriesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to update category" });
  }
});

router.delete("/admin/kcet/categories/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(kcetCategoriesTable).where(eq(kcetCategoriesTable.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to delete category" });
  }
});

router.post("/admin/kcet/categories/reorder", requireAdmin, async (req, res) => {
  try {
    const { orderedIds } = req.body as { orderedIds: number[] };
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: "orderedIds array required" });
      return;
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await db.update(kcetCategoriesTable).set({ sortOrder: i }).where(eq(kcetCategoriesTable.id, orderedIds[i]));
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Reorder failed" });
  }
});

// Admin KCET Materials CRUD + Reorder
router.get("/admin/kcet/materials", requireAdmin, async (req, res) => {
  await ensureKcetTablesAndDefaults();
  const rows = await db
    .select()
    .from(kcetMaterialsTable)
    .orderBy(asc(kcetMaterialsTable.sortOrder), desc(kcetMaterialsTable.createdAt));
  res.json(rows);
});

router.post("/admin/kcet/materials", requireAdmin, async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const {
      subject,
      category,
      title,
      description,
      chapter,
      year,
      pdfUrl,
      fileSizeKb,
      pageCount,
      isFeatured,
      isVisible,
      sortOrder,
    } = req.body;

    if (!subject || !category || !title?.trim() || !pdfUrl?.trim()) {
      res.status(400).json({ error: "Subject, Category, Title, and PDF URL/Key are required" });
      return;
    }

    const parsedYear = year !== undefined && year !== null && year !== "" ? parseInt(String(year), 10) : null;

    const [created] = await db
      .insert(kcetMaterialsTable)
      .values({
        subject: subject.trim(),
        category: category.trim(),
        title: title.trim(),
        description: description?.trim() || null,
        chapter: chapter?.trim() || null,
        year: parsedYear && !isNaN(parsedYear) ? parsedYear : null,
        pdfUrl: pdfUrl.trim(),
        fileSizeKb: fileSizeKb ? parseInt(String(fileSizeKb), 10) : null,
        pageCount: pageCount ? parseInt(String(pageCount), 10) : null,
        isFeatured: Boolean(isFeatured),
        isVisible: isVisible ?? true,
        sortOrder: sortOrder ? parseInt(String(sortOrder), 10) : 0,
      })
      .returning();

    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to create KCET material" });
  }
});

router.put("/admin/kcet/materials/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      subject,
      category,
      title,
      description,
      chapter,
      year,
      pdfUrl,
      fileSizeKb,
      pageCount,
      isFeatured,
      isVisible,
      sortOrder,
    } = req.body;

    const updateData: any = {};
    if (subject !== undefined) updateData.subject = subject.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (chapter !== undefined) updateData.chapter = chapter ? chapter.trim() : null;
    if (year !== undefined) {
      const parsedYear = year !== null && year !== "" ? parseInt(String(year), 10) : null;
      updateData.year = parsedYear && !isNaN(parsedYear) ? parsedYear : null;
    }
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl.trim();
    if (fileSizeKb !== undefined) updateData.fileSizeKb = fileSizeKb ? parseInt(String(fileSizeKb), 10) : null;
    if (pageCount !== undefined) updateData.pageCount = pageCount ? parseInt(String(pageCount), 10) : null;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isVisible !== undefined) updateData.isVisible = Boolean(isVisible);
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(String(sortOrder), 10) || 0;

    const [updated] = await db
      .update(kcetMaterialsTable)
      .set(updateData)
      .where(eq(kcetMaterialsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Material not found" });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to update material" });
  }
});

router.delete("/admin/kcet/materials/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(kcetMaterialsTable).where(eq(kcetMaterialsTable.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to delete material" });
  }
});

router.post("/admin/kcet/materials/reorder", requireAdmin, async (req, res) => {
  try {
    const { orderedIds } = req.body as { orderedIds: number[] };
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: "orderedIds array required" });
      return;
    }
    for (let i = 0; i < orderedIds.length; i++) {
      await db.update(kcetMaterialsTable).set({ sortOrder: i }).where(eq(kcetMaterialsTable.id, orderedIds[i]));
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Reorder failed" });
  }
});

// Admin KCET Contributions Moderation
router.get("/admin/kcet/contributions", requireAdmin, async (req, res) => {
  await ensureKcetTablesAndDefaults();
  const rows = await db
    .select()
    .from(kcetContributionsTable)
    .orderBy(desc(kcetContributionsTable.createdAt));
  res.json(rows);
});

router.get("/admin/kcet/contributions/:id/preview", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [item] = await db
      .select()
      .from(kcetContributionsTable)
      .where(eq(kcetContributionsTable.id, id));
    if (!item || !item.fileUrl) {
      res.status(404).json({ error: "Contribution not found" });
      return;
    }
    const url = await resolveStorageUrl(item.fileUrl);
    if (req.query.mode === "json") {
      res.json({ url });
      return;
    }
    res.redirect(302, url);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Preview failed" });
  }
});

router.patch("/admin/kcet/contributions/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { action } = req.body as { action: "approve" | "reject" | "pending" };
    const [item] = await db
      .select()
      .from(kcetContributionsTable)
      .where(eq(kcetContributionsTable.id, id));

    if (!item) {
      res.status(404).json({ error: "Contribution not found" });
      return;
    }

    if (action === "approve") {
      // Publish straight into isolated kcet_materials table if not already published
      let publishedMaterial = null;
      if (item.status !== "approved") {
        const [created] = await db
          .insert(kcetMaterialsTable)
          .values({
            subject: item.subject,
            category: item.category,
            title: item.title,
            description: item.description || (item.contributorName ? `Shared by ${item.contributorName}` : null),
            chapter: item.chapter,
            year: item.year,
            pdfUrl: item.fileUrl,
            isFeatured: false,
            isVisible: true,
            sortOrder: 0,
          })
          .returning();
        publishedMaterial = created;
      }

      const [updated] = await db
        .update(kcetContributionsTable)
        .set({ status: "approved" })
        .where(eq(kcetContributionsTable.id, id))
        .returning();

      res.json({ contribution: updated, publishedMaterial });
      return;
    }

    const nextStatus = action === "reject" ? "rejected" : "pending";
    const [updated] = await db
      .update(kcetContributionsTable)
      .set({ status: nextStatus })
      .where(eq(kcetContributionsTable.id, id))
      .returning();

    res.json({ contribution: updated });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to update contribution" });
  }
});

router.delete("/admin/kcet/contributions/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(kcetContributionsTable).where(eq(kcetContributionsTable.id, id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Delete failed" });
  }
});

// Admin KCET Downloads Audit
router.get("/admin/kcet/downloads", requireAdmin, async (req, res) => {
  try {
    await ensureKcetTablesAndDefaults();
    const rows = await db
      .select({
        download: kcetDownloadsTable,
        materialTitle: kcetMaterialsTable.title,
        subject: kcetMaterialsTable.subject,
        category: kcetMaterialsTable.category,
      })
      .from(kcetDownloadsTable)
      .leftJoin(kcetMaterialsTable, eq(kcetDownloadsTable.materialId, kcetMaterialsTable.id))
      .orderBy(desc(kcetDownloadsTable.downloadedAt))
      .limit(100);

    res.json(
      rows.map(({ download, materialTitle, subject, category }) => ({
        id: download.id,
        materialId: download.materialId,
        materialTitle: materialTitle ?? "Deleted Material",
        subject: subject ?? "—",
        category: category ?? "—",
        ipAddress: download.ipAddress,
        deviceInfo: download.deviceInfo,
        downloadedAt: download.downloadedAt,
      }))
    );
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to fetch KCET downloads" });
  }
});

export default router;
