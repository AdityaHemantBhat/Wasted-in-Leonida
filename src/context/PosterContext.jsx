import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { CHARGES } from '../data/charges';
import { RANDOM_NAMES, RANDOM_ALIASES, RANDOM_SEEN } from '../data/suspects';
import { getCaseNumber } from '../utils/caseNumber';
import { exportPosterPNG } from '../utils/exportPoster';
import { saveSuspect, compressImageToBase64 } from '../utils/suspectsStorage';

const PosterContext = createContext(null);

export function PosterProvider({ children }) {
  const [name, setName] = useState("Jason Duval");
  const [alias, setAlias] = useState("The Highway Ghost");
  const [seen, setSeen] = useState("Vice City");
  const [charges, setCharges] = useState(["Grand Theft Auto", "Reckless Evading", "Armed Robbery"]);
  const [stars, setStars] = useState(6);
  const [reward, setReward] = useState(50000);
  const [filter, setFilter] = useState("bw");
  const [zoom, setZoom] = useState(100);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoAspectRatio, setPhotoAspectRatio] = useState(79 / 50);
  const [photoFit, setPhotoFit] = useState("contain"); // "contain" = show full photo without cutting, "cover" = crop to fill
  const [photoAspect, setPhotoAspect] = useState("auto"); // "auto", "portrait", "standard", "story", "square"
  const [step, setStep] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Toast handler
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  }, []);

  // Case number computed
  const caseNo = useMemo(() => {
    return getCaseNumber(name, alias);
  }, [name, alias]);

  // Photo handlers
  const handlePhotoUpload = useCallback((file) => {
    if (!file || !/^image\//.test(file.type)) {
      showToast("That file is not an image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto(img);
      setPhotoUrl(url);
      const ratio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
      setPhotoAspectRatio(ratio);
      setPhotoName(file.name.length > 34 ? file.name.slice(0, 31) + "…" : file.name);
      showToast("Photo loaded. Full photo visible — no parts cut off.");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast("Could not read that image.");
    };
    img.src = url;
  }, [showToast]);

  const removePhoto = useCallback(() => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhoto(null);
    setPhotoUrl(null);
    setPhotoName("");
    setPhotoAspectRatio(79 / 50);
  }, [photoUrl]);

  // Charge toggle
  const toggleCharge = useCallback((charge) => {
    setCharges((prev) => {
      const idx = prev.indexOf(charge);
      if (idx >= 0) {
        return prev.filter((c) => c !== charge);
      } else {
        if (prev.length >= 3) {
          showToast("Three charges max. Even LCPD has limits.");
          return prev;
        }
        return [...prev, charge];
      }
    });
  }, [showToast]);

  // Load preset from Wanted Wall
  const loadPreset = useCallback((preset) => {
    setName(preset.name || 'Unknown Suspect');
    setAlias(preset.alias || '');
    setSeen(preset.seen || 'Vice City');
    setCharges(preset.charges ? [...preset.charges] : ['Grand Theft Auto']);
    setStars(preset.stars || 5);
    setReward(preset.reward || 50000);
    if (preset.filter) setFilter(preset.filter);
    if (preset.photoFit) setPhotoFit(preset.photoFit);
    if (preset.photoAspect) setPhotoAspect(preset.photoAspect);
    if (preset.zoom) setZoom(preset.zoom);

    if (preset.photoUrl) {
      const img = new Image();
      img.onload = () => {
        setPhoto(img);
        setPhotoUrl(preset.photoUrl);
        const ratio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
        setPhotoAspectRatio(ratio || 79 / 50);
        setPhotoName(`${preset.name}.jpg`);
      };
      img.src = preset.photoUrl;
    } else {
      setPhoto(null);
      setPhotoUrl(null);
      setPhotoName('');
    }

    showToast(`${preset.name} loaded into the Workbench.`);
  }, [showToast]);

  // Randomize
  const randomize = useCallback(() => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const rName = pick(RANDOM_NAMES);
    const rAlias = pick(RANDOM_ALIASES);
    const rSeen = pick(RANDOM_SEEN);

    const pool = [...CHARGES];
    const rCharges = [];
    for (let i = 0; i < 3; i++) {
      const picked = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      rCharges.push(picked);
    }

    const rStars = 2 + Math.floor(Math.random() * 5);
    const rReward = 10000 + Math.floor(Math.random() * 99) * 10000;

    setName(rName);
    setAlias(rAlias);
    setSeen(rSeen);
    setCharges(rCharges);
    setStars(rStars);
    setReward(rReward);
    showToast("New file generated. This one's a runner.");
  }, [showToast]);

  // Pin / Save suspect to Wanted Wall (stored locally without a backend)
  const saveToWall = useCallback(() => {
    let photoDataUrl = null;
    if (photo) {
      photoDataUrl = compressImageToBase64(photo, 520, 0.85);
    } else if (photoUrl && photoUrl.startsWith('data:')) {
      photoDataUrl = photoUrl;
    }

    const suspectRecord = {
      name: name.trim() || 'Unknown Suspect',
      alias: alias.trim() || 'The Highway Ghost',
      seen: seen || 'Vice City',
      charges: charges.length ? [...charges] : ['Grand Theft Auto'],
      stars,
      reward,
      filter,
      zoom,
      photoUrl: photoDataUrl,
      photoFit,
      photoAspect,
      photoAspectRatio,
      caseNo
    };

    const saved = saveSuspect(suspectRecord);
    if (saved) {
      showToast(`Pinned "${suspectRecord.name}" to Wanted Wall! Searchable below.`);
    } else {
      showToast('Could not save suspect to local storage.');
    }
    return saved;
  }, [
    name,
    alias,
    seen,
    charges,
    stars,
    reward,
    filter,
    zoom,
    photo,
    photoUrl,
    photoFit,
    photoAspect,
    photoAspectRatio,
    caseNo,
    showToast
  ]);

  // Download PNG (and auto-archive to Wanted Wall so friend is saved)
  const downloadPoster = useCallback(async () => {
    setIsDownloading(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await exportPosterPNG(
        {
          name,
          alias,
          seen,
          charges,
          stars,
          reward,
          filter,
          zoom,
          photo,
          photoUrl,
          photoFit,
          photoAspect,
          photoAspectRatio
        },
        caseNo
      );
      // Auto-save to local Wanted Wall
      saveToWall();
      showToast("Saved archival PNG & pinned to Wanted Wall.");
    } catch (err) {
      console.error(err);
      showToast("Export failed in this browser.");
    } finally {
      setIsDownloading(false);
    }
  }, [
    name,
    alias,
    seen,
    charges,
    stars,
    reward,
    filter,
    zoom,
    photo,
    photoUrl,
    photoFit,
    photoAspect,
    photoAspectRatio,
    caseNo,
    saveToWall,
    showToast
  ]);

  const value = {
    name,
    setName,
    alias,
    setAlias,
    seen,
    setSeen,
    charges,
    toggleCharge,
    setCharges,
    stars,
    setStars,
    reward,
    setReward,
    filter,
    setFilter,
    zoom,
    setZoom,
    photo,
    photoUrl,
    photoName,
    photoAspectRatio,
    photoFit,
    setPhotoFit,
    photoAspect,
    setPhotoAspect,
    handlePhotoUpload,
    removePhoto,
    step,
    setStep,
    caseNo,
    loadPreset,
    randomize,
    saveToWall,
    downloadPoster,
    isDownloading,
    toastMessage,
    showToast
  };

  return (
    <PosterContext.Provider value={value}>
      {children}
    </PosterContext.Provider>
  );
}

export function usePoster() {
  const context = useContext(PosterContext);
  if (!context) {
    throw new Error("usePoster must be used within a PosterProvider");
  }
  return context;
}
