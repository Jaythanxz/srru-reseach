const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration for Supabase Free Cloud Storage
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'research-files';

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[Storage Service] Supabase Free Cloud Storage Initialized successfully! Bucket:', BUCKET_NAME);
  } catch (err) {
    console.warn('[Storage Service] Supabase initialization failed, defaulting to local storage:', err.message);
  }
} else {
  console.log('[Storage Service] No Supabase credentials found. Running in Local Disk Storage mode (/uploads).');
}

/**
 * Upload a Multer file to Cloud Storage (Supabase) or Local Disk
 * @param {Object} file - Multer file object
 * @param {string} folder - Destination sub-folder (e.g., 'theses', 'covers', 'authors')
 * @returns {Promise<string>} Public URL or relative local path (e.g. '/uploads/...')
 */
async function uploadFileToStorage(file, folder = 'documents') {
  if (!file) return null;

  // 1. If Supabase Cloud Storage is configured, upload to Cloud
  if (supabase) {
    try {
      const fileExt = path.extname(file.originalname).toLowerCase() || '.pdf';
      const cleanFileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;
      
      // Read file buffer from disk if multer stored on disk
      let fileBuffer = file.buffer;
      if (!fileBuffer && file.path && fs.existsSync(file.path)) {
        fileBuffer = fs.readFileSync(file.path);
      }

      if (fileBuffer) {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(cleanFileName, fileBuffer, {
            contentType: file.mimetype || 'application/pdf',
            upsert: true
          });

        if (error) {
          console.error('[Storage Service Error] Failed to upload to Supabase:', error.message);
          // Fall back to local path if uploaded to local disk
          if (file.filename) return `/uploads/${file.filename}`;
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(cleanFileName);

        console.log(`[Storage Service] File uploaded to Supabase Cloud: ${publicUrlData.publicUrl}`);
        
        // Clean up temporary local file if it was created
        if (file.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            // ignore unlink error
          }
        }

        return publicUrlData.publicUrl;
      }
    } catch (cloudErr) {
      console.warn('[Storage Service] Cloud upload error, falling back to local file:', cloudErr.message);
    }
  }

  // 2. Default: Local disk storage fallback
  if (file.filename) {
    return `/uploads/${file.filename}`;
  }

  return '/uploads/sample_paper_1.pdf';
}

/**
 * Check if a file path is a remote Cloud URL
 * @param {string} pathOrUrl 
 * @returns {boolean}
 */
function isCloudUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return false;
  return pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://');
}

module.exports = {
  uploadFileToStorage,
  isCloudUrl,
  isCloudActive: () => !!supabase
};
