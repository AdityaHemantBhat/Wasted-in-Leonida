const STORAGE_KEY = 'leonida_saved_suspects';
const UPDATE_EVENT = 'leonida:suspects_updated';

/**
 * Compress an HTMLImageElement or Image Bitmap to a compact data URL for localStorage
 */
export function compressImageToBase64(img, maxWidth = 520, quality = 0.85) {
  if (!img) return null;
  try {
    const canvas = document.createElement('canvas');
    const origW = img.naturalWidth || img.width || 500;
    const origH = img.naturalHeight || img.height || 500;
    const scale = Math.min(1, maxWidth / origW);
    canvas.width = Math.round(origW * scale);
    canvas.height = Math.round(origH * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch (err) {
    console.warn('Could not compress image to base64', err);
    return null;
  }
}

/**
 * Retrieve user-saved friends/suspects from localStorage
 */
export function getSavedSuspects() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse saved suspects from storage', e);
    return [];
  }
}

/**
 * Save a new or edited suspect
 */
export function saveSuspect(suspectData) {
  if (typeof window === 'undefined') return null;
  try {
    const current = getSavedSuspects();
    const id = suspectData.id || `suspect_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newSuspect = {
      ...suspectData,
      id,
      isCustom: true,
      pinnedAt: suspectData.pinnedAt || new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    // If already exists, update; otherwise prepend
    const existingIndex = current.findIndex(s => s.id === id || (s.name.toLowerCase() === newSuspect.name.toLowerCase() && s.isCustom));
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = newSuspect;
    } else {
      updated = [newSuspect, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
    return newSuspect;
  } catch (e) {
    console.error('Failed to save suspect to localStorage', e);
    return null;
  }
}

/**
 * Remove a user-saved suspect
 */
export function deleteSuspect(id) {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedSuspects();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Failed to delete suspect from localStorage', e);
  }
}

/**
 * Return only real user-saved / pinned suspects (zero dummy presets)
 */
export function getAllSuspects() {
  return getSavedSuspects();
}

export { UPDATE_EVENT };

