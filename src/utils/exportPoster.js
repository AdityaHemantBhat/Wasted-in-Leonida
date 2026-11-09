import { fmtMoney, levelWord } from './formatters';

function drawStar(ctx, cx, cy, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.52;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function fitFont(ctx, text, weight, family, startPx, maxW, minPx = 14) {
  let px = startPx;
  while (px > minPx) {
    ctx.font = `${weight} ${px}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    px -= 2;
  }
  return px;
}

function computeLayout(state, caseNo, photoImg) {
  const W = 1080;
  const cqw = W / 100; // 10.8px per cqw unit (exact website container query scale)
  const padX = 4.8 * cqw;
  const padTop = 4.8 * cqw;
  const padBottom = 4.2 * cqw;
  const cw = W - padX * 2;

  // Frame aspect ratio matching PosterPreview.jsx
  let frameRatio = 79 / 50;
  if (state.photoAspect === 'portrait') {
    frameRatio = 3 / 4;
  } else if (state.photoAspect === 'story') {
    frameRatio = 9 / 16;
  } else if (state.photoAspect === 'square') {
    frameRatio = 1 / 1;
  } else if (state.photoAspect === 'standard') {
    frameRatio = 79 / 50;
  } else if (state.photoAspect === 'auto') {
    if (state.photoAspectRatio) {
      frameRatio = Math.max(0.56, Math.min(1.85, state.photoAspectRatio));
    } else if (photoImg) {
      const nw = photoImg.naturalWidth || photoImg.width || 79;
      const nh = photoImg.naturalHeight || photoImg.height || 50;
      frameRatio = Math.max(0.56, Math.min(1.85, nw / nh));
    }
  }

  const isTall = frameRatio < 1.05;
  const photoBoxW = isTall ? Math.round(Math.min(cw, 58 * frameRatio * cqw)) : cw;
  const photoBoxH = Math.round(photoBoxW / frameRatio);
  const photoBoxX = Math.round(padX + (cw - photoBoxW) / 2);

  const numCharges = (state.charges && state.charges.length) ? state.charges.length : 1;
  const displayName = (state.name && state.name.trim()) || 'Unknown Suspect';
  const nameLen = displayName.length;
  const nameScale = nameLen > 20 ? 4.6 : nameLen > 14 ? 5.4 : 6.2;
  const nameFontSize = nameScale * cqw;

  const rewardBoxH = (2.2 + 1.8 + 5.6 * 1.05 + 1.5 + 1.8) * cqw;
  const barH = 5.6 * cqw;

  // Track exact positions sequentially to guarantee zero excess canvas or awkward gaps
  let y = padTop;
  const pos = {};

  pos.headerY = y;
  y += 1.85 * cqw + 0.6 * cqw;

  pos.wantedY = y;
  y += 12.8 * 0.92 * cqw + 1.8 * cqw;

  pos.rule1Y = y;
  y += 0.55 * cqw + 2.2 * cqw;

  pos.starsY = y;
  y += 4.3 * cqw + 2.4 * cqw;

  pos.photoY = y;
  y += photoBoxH + 1.2 * cqw;

  pos.captionY = y;
  y += 1.65 * cqw + 1.8 * cqw;

  pos.nameY = y;
  y += nameFontSize * 1.02 + 0.6 * cqw;

  pos.aliasY = y;
  y += 3.0 * cqw + 2.4 * cqw;

  pos.tableTopRuleY = y;
  y += 0.35 * cqw + 1.6 * cqw;
  pos.tableHeadY = y;
  y += 1.55 * cqw + 0.5 * cqw;
  pos.tableValY = y;
  y += 2.25 * cqw + 1.6 * cqw;
  pos.tableBottomRuleY = y;
  y += 0.35 * cqw + 2.4 * cqw;

  pos.chargesHeadY = y;
  y += 1.55 * cqw + 1.2 * cqw;
  pos.chargesStartY = y;
  y += numCharges * 3.4 * cqw + 2.6 * cqw;

  pos.rewardY = y;
  y += rewardBoxH + 2.4 * cqw;

  pos.barcodeY = y;
  y += barH + padBottom;

  const totalH = Math.round(y);

  return {
    W,
    totalH,
    cqw,
    padX,
    padTop,
    padBottom,
    cw,
    frameRatio,
    photoBoxW,
    photoBoxH,
    photoBoxX,
    displayName,
    nameFontSize,
    numCharges,
    rewardBoxH,
    barH,
    pos
  };
}

export function exportPosterPNG(state, caseNo) {
  return new Promise(async (resolve, reject) => {
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Resolve photo element if given as URL or existing img
      let photoImg = null;
      if (state.photo && state.photo.complete && state.photo.naturalWidth) {
        photoImg = state.photo;
      } else if (state.photoUrl || (state.photo && state.photo.src)) {
        const src = state.photoUrl || state.photo.src;
        photoImg = await new Promise((res) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = src;
        });
      }

      const L = computeLayout(state, caseNo, photoImg);

      const cv = document.createElement('canvas');
      cv.width = L.W;
      cv.height = L.totalH;
      const ctx = cv.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not supported'));
        return;
      }

      const INK = '#141310';
      const SOFT = '#3d3a33';
      const FAINT = '#7a7261';
      const PAPER = '#ede6d6';

      // 1. Background paper
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, L.W, L.totalH);

      // Subtle radial sun-fade
      const grd = ctx.createRadialGradient(L.W / 2, 0, 60, L.W / 2, 0, L.W * 1.1);
      grd.addColorStop(0, 'rgba(120,90,30,0.08)');
      grd.addColorStop(1, 'rgba(120,90,30,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, L.W, L.totalH);

      // Fine aged border rule
      ctx.strokeStyle = 'rgba(20,19,16,.16)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, L.W - 2, L.totalH - 2);

      ctx.textBaseline = 'top';

      // 2. Department Header
      ctx.fillStyle = SOFT;
      ctx.textAlign = 'center';
      ctx.font = `600 ${1.85 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.3 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('LEONIDA COUNTY POLICE DEPARTMENT — STATE OF LEONIDA', L.W / 2, L.pos.headerY);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      // 3. WANTED Title
      ctx.fillStyle = INK;
      ctx.font = `900 ${12.8 * L.cqw}px Archivo, sans-serif`;
      ctx.fillText('WANTED', L.W / 2, L.pos.wantedY);

      // 4. Divider Line
      ctx.fillRect(L.padX, L.pos.rule1Y, L.cw, 0.55 * L.cqw);

      // 5. Stars Row
      ctx.textAlign = 'left';
      ctx.fillStyle = SOFT;
      ctx.font = `600 ${1.8 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.18 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('WANTED LEVEL', L.padX, L.pos.starsY + 0.8 * L.cqw);

      ctx.textAlign = 'right';
      ctx.fillStyle = INK;
      ctx.fillText(
        `${state.stars} / 6 — ${levelWord(state.stars)}`.toUpperCase(),
        L.W - L.padX,
        L.pos.starsY + 0.8 * L.cqw
      );
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      const starR = 2.15 * L.cqw;
      const starGap = 1.1 * L.cqw;
      const totalStarsW = 6 * (starR * 2) + 5 * starGap;
      let sx = L.W / 2 - totalStarsW / 2 + starR;
      const sy = L.pos.starsY + starR;
      for (let i = 1; i <= 6; i++) {
        if (i <= state.stars) {
          ctx.fillStyle = INK;
          drawStar(ctx, sx, sy, starR, true);
        } else {
          ctx.strokeStyle = INK;
          ctx.lineWidth = 0.22 * L.cqw;
          drawStar(ctx, sx, sy, starR, false);
        }
        sx += starR * 2 + starGap;
      }

      // 6. Photo Box
      const bw = 0.85 * L.cqw;
      ctx.fillStyle = INK;
      ctx.fillRect(L.photoBoxX - bw, L.pos.photoY - bw, L.photoBoxW + bw * 2, L.photoBoxH + bw * 2);

      ctx.fillStyle = '#1b1916';
      ctx.fillRect(L.photoBoxX, L.pos.photoY, L.photoBoxW, L.photoBoxH);

      ctx.save();
      ctx.beginPath();
      ctx.rect(L.photoBoxX, L.pos.photoY, L.photoBoxW, L.photoBoxH);
      ctx.clip();

      if (photoImg) {
        const nw = photoImg.naturalWidth || photoImg.width;
        const nh = photoImg.naturalHeight || photoImg.height;

        if (state.filter === 'bw') {
          ctx.filter = 'grayscale(1) contrast(1.08)';
        } else if (state.filter === 'neon') {
          ctx.filter = 'saturate(1.75) contrast(1.14) hue-rotate(-10deg)';
        }

        const isCover = state.photoFit === 'cover';
        const baseScale = isCover
          ? Math.max(L.photoBoxW / nw, L.photoBoxH / nh)
          : Math.min(L.photoBoxW / nw, L.photoBoxH / nh);
        const scale = baseScale * ((state.zoom || 100) / 100);
        const dw = nw * scale;
        const dh = nh * scale;

        ctx.drawImage(
          photoImg,
          L.photoBoxX + (L.photoBoxW - dw) / 2,
          L.pos.photoY + (L.photoBoxH - dh) / 2,
          dw,
          dh
        );
        ctx.filter = 'none';
      } else {
        const bg = ctx.createRadialGradient(
          L.photoBoxX + L.photoBoxW / 2,
          L.pos.photoY + L.photoBoxH * 0.38,
          40,
          L.photoBoxX + L.photoBoxW / 2,
          L.pos.photoY + L.photoBoxH * 0.5,
          L.photoBoxW * 0.75
        );
        bg.addColorStop(0, '#e6dfca');
        bg.addColorStop(1, '#d5cdb4');
        ctx.fillStyle = bg;
        ctx.fillRect(L.photoBoxX, L.pos.photoY, L.photoBoxW, L.photoBoxH);
        ctx.fillStyle = '#45413a';
        ctx.beginPath();
        ctx.arc(L.photoBoxX + L.photoBoxW / 2, L.pos.photoY + L.photoBoxH * 0.36, L.photoBoxH * 0.21, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(L.photoBoxX + L.photoBoxW / 2 - L.photoBoxH * 0.55, L.pos.photoY + L.photoBoxH);
        ctx.quadraticCurveTo(
          L.photoBoxX + L.photoBoxW / 2,
          L.pos.photoY + L.photoBoxH * 0.58,
          L.photoBoxX + L.photoBoxW / 2 + L.photoBoxH * 0.55,
          L.pos.photoY + L.photoBoxH
        );
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = SOFT;
        ctx.textAlign = 'center';
        ctx.font = `600 ${Math.min(2.3 * L.cqw, L.photoBoxW * 0.052)}px 'IBM Plex Mono', monospace`;
        ctx.fillText('NO PHOTO ON FILE', L.photoBoxX + L.photoBoxW / 2, L.pos.photoY + L.photoBoxH * 0.92);
      }
      ctx.restore();

      // 7. Caption
      ctx.fillStyle = SOFT;
      ctx.textAlign = 'center';
      ctx.font = `500 ${1.65 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.22 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText(
        `LAST KNOWN PHOTOGRAPH — ${state.seen || 'LEONIDA'}, LEONIDA`.toUpperCase(),
        L.W / 2,
        L.pos.captionY
      );
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      // 8. Name
      ctx.fillStyle = INK;
      fitFont(ctx, L.displayName.toUpperCase(), '900', 'Archivo, sans-serif', L.nameFontSize, L.cw);
      ctx.fillText(L.displayName.toUpperCase(), L.W / 2, L.pos.nameY);

      // 9. Alias
      const alias = state.alias && state.alias.trim()
        ? `\u201C${state.alias.trim()}\u201D`
        : '\u201CKnown by no other name\u201D';
      ctx.fillStyle = SOFT;
      ctx.font = `italic 600 ${3.0 * L.cqw}px Georgia, serif`;
      ctx.fillText(alias, L.W / 2, L.pos.aliasY);

      // 10. Details Grid (Alias / Last Seen / Case No)
      ctx.fillStyle = INK;
      ctx.fillRect(L.padX, L.pos.tableTopRuleY, L.cw, 0.35 * L.cqw);

      const col1W = L.cw * (1.2 / 3.15);
      const col2W = L.cw * (1.0 / 3.15);
      const col1X = L.padX + 0.4 * L.cqw;
      const col2X = col1X + col1W;
      const col3X = L.W - L.padX - 0.4 * L.cqw;

      ctx.textAlign = 'left';
      ctx.fillStyle = FAINT;
      ctx.font = `500 ${1.55 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.22 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('ALIAS', col1X, L.pos.tableHeadY);
      ctx.fillText('LAST SEEN', col2X, L.pos.tableHeadY);
      ctx.textAlign = 'right';
      ctx.fillText('CASE NO.', col3X, L.pos.tableHeadY);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      ctx.fillStyle = INK;
      ctx.font = `600 ${2.25 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.04 * L.cqw}px`;
      } catch (e) {}
      ctx.textAlign = 'left';

      let vAlias = (state.alias && state.alias.trim()) || '—';
      while (ctx.measureText(vAlias.toUpperCase()).width > col1W - 2 * L.cqw && vAlias.length > 4) {
        vAlias = vAlias.slice(0, -2);
      }
      if (vAlias !== ((state.alias && state.alias.trim()) || '—')) vAlias += '…';
      ctx.fillText(vAlias.toUpperCase(), col1X, L.pos.tableValY);

      let vSeen = (state.seen && state.seen.trim()) || 'LEONIDA';
      while (ctx.measureText(vSeen.toUpperCase()).width > col2W - 2 * L.cqw && vSeen.length > 4) {
        vSeen = vSeen.slice(0, -2);
      }
      if (vSeen !== ((state.seen && state.seen.trim()) || 'LEONIDA')) vSeen += '…';
      ctx.fillText(vSeen.toUpperCase(), col2X, L.pos.tableValY);

      ctx.textAlign = 'right';
      ctx.fillText(caseNo || 'LCPD-2026', col3X, L.pos.tableValY);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      ctx.fillStyle = INK;
      ctx.fillRect(L.padX, L.pos.tableBottomRuleY, L.cw, 0.35 * L.cqw);

      // 11. Charges & Stamp
      const stampW = 15.5 * L.cqw;
      const stampH = 8.6 * L.cqw;
      const stampX = L.W - L.padX - stampW;
      const stampY = L.pos.chargesHeadY + 0.5 * L.cqw;

      ctx.textAlign = 'left';
      ctx.fillStyle = FAINT;
      ctx.font = `500 ${1.55 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.22 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('CHARGES', L.padX, L.pos.chargesHeadY);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      const charges = state.charges && state.charges.length ? state.charges : [];
      let cy = L.pos.chargesStartY;
      if (!charges.length) {
        ctx.fillStyle = SOFT;
        ctx.font = `500 ${2.1 * L.cqw}px 'IBM Plex Mono', monospace`;
        ctx.fillText('NO CHARGES FILED — YET', L.padX, cy);
      } else {
        charges.forEach((c, i) => {
          ctx.fillStyle = FAINT;
          ctx.font = `600 ${2.0 * L.cqw}px 'IBM Plex Mono', monospace`;
          ctx.fillText(`0${i + 1}`, L.padX, cy);

          ctx.fillStyle = INK;
          fitFont(ctx, c.toUpperCase(), '800', 'Archivo, sans-serif', 2.55 * L.cqw, L.cw * 0.65);
          ctx.fillText(c.toUpperCase(), L.padX + 3.6 * L.cqw, cy);
          cy += 3.4 * L.cqw;
        });
      }

      // Red Rubber Stamp
      ctx.save();
      ctx.translate(stampX + stampW / 2, stampY + stampH / 2);
      ctx.rotate((-7 * Math.PI) / 180);
      ctx.strokeStyle = '#b3352b';
      ctx.lineWidth = 0.6 * L.cqw;
      ctx.fillStyle = '#b3352b';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(-stampW / 2, -stampH / 2, stampW, stampH, 0.8 * L.cqw);
        ctx.stroke();
      } else {
        ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);
      }
      ctx.textAlign = 'center';
      ctx.font = `900 ${3.3 * L.cqw}px Archivo, sans-serif`;
      try {
        ctx.letterSpacing = `${0.06 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('DO NOT', 0, -stampH * 0.38);
      ctx.fillText('APPROACH', 0, -stampH * 0.04);
      ctx.font = `600 ${1.6 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.3 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('ARMED & DANGEROUS', 0, stampH * 0.32);
      ctx.restore();

      // 12. Reward Box
      ctx.fillStyle = INK;
      ctx.fillRect(L.padX, L.pos.rewardY, L.cw, L.rewardBoxH);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#b9b09a';
      ctx.font = `500 ${1.8 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.42 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('R E W A R D', L.W / 2, L.pos.rewardY + 2.2 * L.cqw);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      ctx.fillStyle = PAPER;
      ctx.font = `900 ${5.6 * L.cqw}px Archivo, sans-serif`;
      ctx.fillText(fmtMoney(state.reward), L.W / 2, L.pos.rewardY + (2.2 + 1.8) * L.cqw);

      ctx.fillStyle = '#b9b09a';
      ctx.font = `500 ${1.5 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.2 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText(
        'FOR INFORMATION LEADING TO ARREST',
        L.W / 2,
        L.pos.rewardY + (2.2 + 1.8 + 5.6 * 1.05) * L.cqw
      );
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      // 13. Barcode & Footer
      let seed = 7;
      const cStr = String(caseNo || 'LCPD-2026');
      for (let i = 0; i < cStr.length; i++) seed = (seed * 31 + cStr.charCodeAt(i)) >>> 0;
      function rnd() {
        seed = (seed * 1103515245 + 12345) >>> 0;
        return seed / 4294967296;
      }
      let bx = L.padX;
      ctx.fillStyle = INK;
      while (bx < L.padX + 24 * L.cqw) {
        const wdt = (1 + Math.floor(rnd() * 3.4)) * (L.cqw / 5);
        const gp = (1 + Math.floor(rnd() * 2.6)) * (L.cqw / 5);
        ctx.fillRect(bx, L.pos.barcodeY, wdt, L.barH);
        bx += wdt + gp;
      }

      ctx.textAlign = 'right';
      ctx.fillStyle = INK;
      ctx.font = `600 ${2.0 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.14 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText(`CASE ${cStr}`.toUpperCase(), L.W - L.padX, L.pos.barcodeY + 0.4 * L.cqw);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      ctx.fillStyle = FAINT;
      ctx.font = `500 ${1.45 * L.cqw}px 'IBM Plex Mono', monospace`;
      try {
        ctx.letterSpacing = `${0.16 * L.cqw}px`;
      } catch (e) {}
      ctx.fillText('FAN-MADE POSTER — NOT AN OFFICIAL DOCUMENT', L.W - L.padX, L.pos.barcodeY + 3.2 * L.cqw);
      try {
        ctx.letterSpacing = '0px';
      } catch (e) {}

      // Trigger high-res file download
      cv.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        const a = document.createElement('a');
        const slug = (L.displayName.trim() || 'suspect')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        a.href = URL.createObjectURL(blob);
        a.download = `wanted-poster-${slug}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        resolve(true);
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}
