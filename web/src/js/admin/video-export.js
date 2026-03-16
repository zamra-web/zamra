export async function downloadVideoPoster(ratio, fares, sectorId, sectors, airlines) {
    // Show loading toast (assuming toast is globally available or we can just use basic UI feedback)
    const toastMessage = `Generating ${ratio} Video... Please remain on this tab.`;
    if (window.toast) window.toast('info', 'Video Generation', toastMessage);

    if (typeof MediaRecorder === 'undefined') {
        if (window.toast) window.toast('error', 'Video Generation', 'Your browser does not support MediaRecorder.');
        throw new Error('MediaRecorder is not supported in this browser.');
    }

    const VIDEO_THEMES = [
        {
            id: 'classic',
            topBar: ['#0c4a8a', '#1e67c2', '#60a5fa'],
            headerBg: '#0f172a',
            headerOverlayFrom: '#0f172a',
            headerOverlayTo: 'rgba(15, 23, 42, 0)',
            badgeBg: 'rgba(12, 74, 138, 0.25)',
            badgeBorder: 'rgba(96, 165, 250, 0.4)',
            badgeText: '#dbeafe',
            subtitle: '#dbeafe',
            accent: '#60a5fa',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f3f6ff',
            sectorText: '#2563eb',
            fareBadgeBg: '#0f172a',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#2563eb'
        },
        {
            id: 'deep',
            topBar: ['#073160', '#0c4a8a', '#1e67c2'],
            headerBg: '#111827',
            headerOverlayFrom: '#111827',
            headerOverlayTo: 'rgba(17, 24, 39, 0)',
            badgeBg: 'rgba(12, 74, 138, 0.28)',
            badgeBorder: 'rgba(30, 103, 194, 0.45)',
            badgeText: '#e0efff',
            subtitle: '#cfe1ff',
            accent: '#1e67c2',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f4f7ff',
            sectorText: '#1e67c2',
            fareBadgeBg: '#111827',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#1e67c2'
        },
        {
            id: 'royal',
            topBar: ['#0f4f9e', '#1e67c2', '#60a5fa'],
            headerBg: '#0c1f3a',
            headerOverlayFrom: '#0c1f3a',
            headerOverlayTo: 'rgba(12, 31, 58, 0)',
            badgeBg: 'rgba(15, 79, 158, 0.25)',
            badgeBorder: 'rgba(96, 165, 250, 0.4)',
            badgeText: '#dbeafe',
            subtitle: '#dbeafe',
            accent: '#0f4f9e',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f0f7ff',
            sectorText: '#0f4f9e',
            fareBadgeBg: '#0c1f3a',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#0f4f9e'
        }
    ];

    const RATIO_PRESETS = {
        '1x1': {
            width: 1080,
            height: 1080,
            headerHeight: 320,
            headerGap: 56,
            footerHeight: 110,
            footerGap: 20,
            marginX: 90,
            rowHeight: 86,
            rowInset: 10,
            maxRows: 7,
            topBarHeight: 16,
            badge: { w: 220, h: 42, y: 64, textSize: 15 },
            title: { size: 60, offset: 86 },
            subtitle: { size: 22, offset: 138 },
            table: { headSize: 18, headOffset: 20, dateSize: 24, sectorSize: 20, timeSize: 20, fareSize: 24 },
            logo: { maxW: 96, h: 36 },
            footer: { logo: 44, titleSize: 22, infoSize: 18 },
            columns: { sector: 0.28, airline: 0.5, time: 0.72 },
            motion: {
                rowsStart: 1300,
                rowStagger: 700,
                rowReveal: 650,
                rowSlide: 18,
                footerDelay: 600,
                footerReveal: 700,
                hold: 1400,
                parallaxAmp: 4,
                parallaxSpeed: 2200,
                topShiftAmp: 0.12,
                topShiftSpeed: 2200,
                badgePulseAmp: 0.015,
                badgePulseSpeed: 1200,
                headerFade: 900,
                titleRise: 8,
                subtitleRise: 10
            }
        },
        '9x16': {
            width: 1080,
            height: 1920,
            headerHeight: 440,
            headerGap: 70,
            footerHeight: 120,
            footerGap: 24,
            marginX: 70,
            rowHeight: 92,
            rowInset: 10,
            maxRows: 10,
            topBarHeight: 16,
            badge: { w: 240, h: 44, y: 76, textSize: 16 },
            title: { size: 60, offset: 96 },
            subtitle: { size: 24, offset: 154 },
            table: { headSize: 19, headOffset: 24, dateSize: 26, sectorSize: 22, timeSize: 22, fareSize: 26 },
            logo: { maxW: 110, h: 40 },
            footer: { logo: 48, titleSize: 24, infoSize: 20 },
            columns: { sector: 0.29, airline: 0.5, time: 0.71 },
            motion: {
                rowsStart: 1500,
                rowStagger: 760,
                rowReveal: 700,
                rowSlide: 20,
                footerDelay: 650,
                footerReveal: 760,
                hold: 1600,
                parallaxAmp: 5,
                parallaxSpeed: 2400,
                topShiftAmp: 0.14,
                topShiftSpeed: 2400,
                badgePulseAmp: 0.015,
                badgePulseSpeed: 1300,
                headerFade: 1000,
                titleRise: 10,
                subtitleRise: 12
            }
        },
        '16x9': {
            width: 1920,
            height: 1080,
            headerHeight: 300,
            headerGap: 52,
            footerHeight: 96,
            footerGap: 18,
            marginX: 200,
            rowHeight: 78,
            rowInset: 10,
            maxRows: 6,
            topBarHeight: 16,
            badge: { w: 240, h: 40, y: 48, textSize: 15 },
            title: { size: 70, offset: 74 },
            subtitle: { size: 22, offset: 124 },
            table: { headSize: 18, headOffset: 18, dateSize: 22, sectorSize: 20, timeSize: 20, fareSize: 24 },
            logo: { maxW: 110, h: 36 },
            footer: { logo: 42, titleSize: 22, infoSize: 18 },
            columns: { sector: 0.3, airline: 0.55, time: 0.75 },
            motion: {
                rowsStart: 1100,
                rowStagger: 620,
                rowReveal: 600,
                rowSlide: 16,
                footerDelay: 520,
                footerReveal: 650,
                hold: 1300,
                parallaxAmp: 3,
                parallaxSpeed: 2000,
                topShiftAmp: 0.12,
                topShiftSpeed: 2200,
                badgePulseAmp: 0.012,
                badgePulseSpeed: 1100,
                headerFade: 850,
                titleRise: 8,
                subtitleRise: 10
            }
        }
    };

    function getPreset(ratioKey) {
        return RATIO_PRESETS[ratioKey] || RATIO_PRESETS['1x1'];
    }

    function hashStringSeed(value = '') {
        const str = String(value);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function normalizeFlightTime(value) {
        if (!value) return '';
        const raw = String(value).trim();
        if (!raw) return '';
        const cleaned = raw.replace(/[–—]/g, '-').replace(/\s+/g, ' ');
        if (!cleaned.includes('-')) return cleaned;
        const parts = cleaned.split('-').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
        return parts[0] || cleaned;
    }

    function pickTheme(seedValue) {
        if (!VIDEO_THEMES.length) return VIDEO_THEMES[0];
        const idx = hashStringSeed(seedValue) % VIDEO_THEMES.length;
        return VIDEO_THEMES[idx];
    }

    return new Promise(async (resolve, reject) => {
        try {
            // 1. Dimensions setup
            const preset = getPreset(ratio);
            const { width, height } = preset;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;

            // 2. Pre-load assets
            let titleText = 'MULTIPLE → SECTORS';
            let themeSeed = sectorId;
            if (sectorId !== 'all') {
                const sector = sectors.find(s => s.id === sectorId);
                const originName = sector ? (sector.sectorFrom || 'DEP').toUpperCase() : 'DEP';
                const destName = sector ? (sector.sectorTo || 'ARR').toUpperCase() : 'ARR';
                titleText = `${originName} → ${destName}`;
                themeSeed = sector?.sectorCode || `${originName}-${destName}`;
            }
            const theme = pickTheme(themeSeed);
            const motion = preset.motion;

            const airlineMap = {};
            airlines.forEach(a => {
                if (a.id) airlineMap[a.id.trim().toLowerCase()] = a;
                if (a.code) airlineMap[a.code.trim().toLowerCase()] = a;
                if (a.name) airlineMap[a.name.trim().toLowerCase()] = a;
            });

            const getAirline = (rawId) => {
                if (!rawId) return null;
                return airlineMap[String(rawId).trim().toLowerCase()];
            };

            const toAirlineKey = (rawId) => {
                const airline = getAirline(rawId);
                if (airline?.id) return airline.id;
                return String(rawId || '').trim().toLowerCase();
            };

            const toTimeKey = (rawTime) => normalizeFlightTime(rawTime).replace(/\s+/g, '');

            // Deduplicate flights (same sector, airline, date, time) taking the cheapest rate
            const groupedFaresMap = new Map();
            fares.forEach(fare => {
                const dtTime = fare.flightDate instanceof Date ? fare.flightDate.getTime() : fare.flightDate;
                const airlineKey = toAirlineKey(fare.airlineId);
                const timeKey = toTimeKey(fare.flightTime);
                const key = `${fare.sectorId}_${airlineKey}_${dtTime}_${timeKey}`;
                if (!groupedFaresMap.has(key)) {
                    groupedFaresMap.set(key, fare);
                } else {
                    if (fare.finalRate < groupedFaresMap.get(key).finalRate) {
                        groupedFaresMap.set(key, fare);
                    }
                }
            });
            const uniqueLowestFares = Array.from(groupedFaresMap.values());

            const sortedFares = uniqueLowestFares.sort((a, b) => {
                let valA = a.flightDate, valB = b.flightDate;
                if (valA instanceof Date) valA = valA.getTime();
                if (valB instanceof Date) valB = valB.getTime();
                return valA - valB;
            });

            const sectorMap = {};
            sectors.forEach(s => {
                sectorMap[s.id] = s.sectorCode || s.id;
            });

            const fileSafe = (s) =>
                String(s || '')
                    .trim()
                    .replace(/[^a-z0-9]+/gi, '-')
                    .replace(/^-+|-+$/g, '')
                    .toLowerCase();

            let sectorSlug = 'all-sectors';
            if (sectorId !== 'all') {
                const sector = sectors.find(s => s.id === sectorId);
                const raw = sector?.sectorCode
                    || (sector ? `${sector.sectorFrom || ''}-${sector.sectorTo || ''}` : '')
                    || sectorMap[sectorId]
                    || sectorId;
                sectorSlug = fileSafe(raw) || fileSafe(sectorId) || 'sector';
            }

            const arrow = '→';
            const maxTitleWidth = width - (preset.marginX * 1.4);
            let fittedTitleSize = preset.title.size;
            const measureTitleWidth = (size) => {
                ctx.font = `900 ${size}px Arial, sans-serif`;
                if (titleText.includes(arrow)) {
                    const parts = titleText.split(arrow);
                    const left = parts[0].trim();
                    const right = parts[1].trim();
                    const arrowText = ` ${arrow} `;
                    return ctx.measureText(left).width + ctx.measureText(arrowText).width + ctx.measureText(right).width;
                }
                return ctx.measureText(titleText).width;
            };
            while (fittedTitleSize > 42 && measureTitleWidth(fittedTitleSize) > maxTitleWidth) {
                fittedTitleSize -= 2;
            }

            async function fetchLogoImage(url) {
                if (!url) return null;
                try {
                    const res = await fetch(url);
                    if (!res.ok) return null;
                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    return new Promise((res, rej) => {
                        const img = new Image();
                        img.onload = () => res(img);
                        img.onerror = () => res(null); // Return null on error so we don't break
                        img.src = objectUrl;
                    });
                } catch { return null; }
            }

            // Load hero background
            const bgImg = new Image();
            await new Promise((res) => {
                bgImg.onload = res;
                bgImg.onerror = res;
                bgImg.src = '/assets/img/hero-banner-bg.png';
            });

            // Load Zamra logo
            const logoImg = new Image();
            await new Promise((res) => {
                logoImg.onload = res;
                logoImg.onerror = res;
                logoImg.src = '/assets/img/logo.webp';
            });

            // Preload Airline Logos
            const loadedLogos = {};
            const uniqueAirlines = [...new Set(sortedFares.map(f => f.airlineId))].map(id => getAirline(id)).filter(a => a && a.logoUrl);
            await Promise.all(uniqueAirlines.map(async a => {
                const img = await fetchLogoImage(a.logoUrl);
                if (img) {
                    loadedLogos[a.id] = img;
                }
            }));

            // 3. Start Recording
            const stream = canvas.captureStream(30); // 30 FPS
            
            // Prefer MP4 if available (Safari/Chrome 129+), fallback to webm with h264, then standard webm
            let mimeType = 'video/mp4';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm; codecs=h264';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm';
                }
            }
            
            const recorder = new MediaRecorder(stream, { mimeType });
            const chunks = [];
            recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

            // Start Recorder
            recorder.start(100); // Record in 100ms chunks to ensure data availability

            // 4. Animation loop
            const headerHeight = preset.headerHeight;
            const rowHeight = preset.rowHeight;
            const footerHeight = preset.footerHeight;
            const startY = headerHeight + preset.headerGap;
            const availableHeight = height - startY - footerHeight - preset.footerGap;
            const computedMaxRows = Math.max(1, Math.floor(availableHeight / rowHeight));
            const maxRows = preset.maxRows ? Math.min(computedMaxRows, preset.maxRows) : computedMaxRows;
            const visibleFares = sortedFares.slice(0, maxRows);

            const rowsStart = motion.rowsStart;
            const footerEntryTime = rowsStart + (visibleFares.length * motion.rowStagger) + motion.footerDelay;
            const totalDuration = footerEntryTime + motion.footerReveal + motion.hold;
            const startTime = performance.now();
            let stopped = false;

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

            function drawRoundedRect(x, y, w, h, r) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.arcTo(x + w, y, x + w, y + r, r);
                ctx.lineTo(x + w, y + h - r);
                ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
                ctx.lineTo(x + r, y + h);
                ctx.arcTo(x, y + h, x, y + h - r, r);
                ctx.lineTo(x, y + r);
                ctx.arcTo(x, y, x + r, y, r);
                ctx.closePath();
            }

            function drawFrame(now) {
                if (stopped) return;
                const elapsed = now - startTime;
                
                if (elapsed > totalDuration) {
                    try {
                        stopped = true;
                        recorder.stop();
                    } catch(e) { console.error("Error stopping recorder", e); }
                    return; // End loop
                }

                // --- Draw Background ---
                ctx.fillStyle = theme.bodyBg;
                ctx.fillRect(0, 0, width, height);

                // Ambient gradient wash for premium depth
                const wash = ctx.createLinearGradient(0, 0, width, height);
                wash.addColorStop(0, 'rgba(255,255,255,0.35)');
                wash.addColorStop(0.5, 'rgba(255,255,255,0)');
                wash.addColorStop(1, 'rgba(37,99,235,0.06)');
                ctx.fillStyle = wash;
                ctx.fillRect(0, 0, width, height);

                // --- Draw Header Area ---
                // Depending on ratio, header height changes
                // Use precomputed headerHeight
                
                // Draw Hero Image with overlay
                ctx.fillStyle = theme.headerBg;
                ctx.fillRect(0, 0, width, headerHeight);
                if (bgImg.complete && bgImg.width > 0) {
                    const parallax = motion.parallaxAmp * Math.sin(elapsed / motion.parallaxSpeed);
                    ctx.globalAlpha = 0.22;
                    // Cover logic
                    const scale = Math.max(width / bgImg.width, headerHeight / bgImg.height);
                    const dw = bgImg.width * scale;
                    const dh = bgImg.height * scale;
                    const dx = (width - dw) / 2;
                    const dy = (headerHeight - dh) / 2 + parallax;
                    ctx.drawImage(bgImg, dx, dy, dw, dh);
                    ctx.globalAlpha = 1.0;
                }

                // Gradient overlay
                const grad = ctx.createLinearGradient(0, 0, 0, headerHeight);
                grad.addColorStop(0, theme.headerOverlayFrom);
                grad.addColorStop(1, theme.headerOverlayTo);
                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(0, 0, width, headerHeight);
                ctx.globalAlpha = 1.0;

                // Header Text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Top Decor
                const topShift = (Math.sin(elapsed / motion.topShiftSpeed) + 1) / 2;
                const topGrad = ctx.createLinearGradient(-width * motion.topShiftAmp * topShift, 0, width * (1 + motion.topShiftAmp * topShift), 0);
                topGrad.addColorStop(0, theme.topBar[0]);
                topGrad.addColorStop(0.5, theme.topBar[1]);
                topGrad.addColorStop(1, theme.topBar[2]);
                ctx.fillStyle = topGrad;
                ctx.fillRect(0, 0, width, preset.topBarHeight);

                // Badge
                const badgeW = preset.badge.w, badgeH = preset.badge.h;
                const badgeY = preset.badge.y;
                const badgePulse = 1 + motion.badgePulseAmp * Math.sin(elapsed / motion.badgePulseSpeed);
                const badgeWidth = badgeW * badgePulse;
                const badgeX = (width / 2) - (badgeWidth / 2);
                ctx.fillStyle = theme.badgeBg;
                drawRoundedRect(badgeX, badgeY, badgeWidth, badgeH, 20);
                ctx.fill();
                ctx.strokeStyle = theme.badgeBorder;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.fillStyle = theme.badgeText;
                ctx.font = `bold ${preset.badge.textSize}px Arial, sans-serif`;
                ctx.fillText('EXCLUSIVE DEALS', width/2, badgeY + (badgeH/2));

                // Title
                const titleSize = fittedTitleSize;
                ctx.font = `900 ${titleSize}px Arial, sans-serif`;
                ctx.textBaseline = 'middle';
                const headerT = easeOutCubic(Math.min(1, elapsed / motion.headerFade));
                if (titleText.includes(arrow)) {
                    const parts = titleText.split(arrow);
                    const left = parts[0].trim();
                    const right = parts[1].trim();
                    const arrowText = ` ${arrow} `;
                    ctx.textAlign = 'left';
                    const leftWidth = ctx.measureText(left).width;
                    const arrowWidth = ctx.measureText(arrowText).width;
                    const rightWidth = ctx.measureText(right).width;
                    const totalWidth = leftWidth + arrowWidth + rightWidth;
                    const startX = (width - totalWidth) / 2;
                    const titleY = badgeY + preset.title.offset - (motion.titleRise * (1 - headerT));
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(left, startX, titleY);
                    ctx.fillStyle = theme.accent;
                    ctx.fillText(arrowText, startX + leftWidth, titleY);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(right, startX + leftWidth + arrowWidth, titleY);
                    ctx.textAlign = 'center';
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    const titleY = badgeY + preset.title.offset - (motion.titleRise * (1 - headerT));
                    ctx.fillText(titleText, width/2, titleY);
                }
                
                // Subtitle
                const subtitleT = easeOutCubic(Math.min(1, Math.max(0, (elapsed - 120) / (motion.headerFade + 200))));
                ctx.fillStyle = theme.subtitle;
                ctx.font = `700 ${preset.subtitle.size}px Arial, sans-serif`;
                const subtitleY = badgeY + preset.subtitle.offset - (motion.subtitleRise * (1 - subtitleT));
                ctx.globalAlpha = subtitleT;
                ctx.fillText('SPECIAL FARES AVAILABLE NOW', width/2, subtitleY);
                ctx.globalAlpha = 1.0;

                // --- Draw Fares ---
                // Layout calculations
                const marginX = preset.marginX;
                const listWidth = width - (marginX * 2);

                // Draw Table Header
                ctx.fillStyle = theme.tableHeadText;
                ctx.font = `bold ${preset.table.headSize}px Arial, sans-serif`;
                ctx.textAlign = 'left';
                ctx.fillText('DATE', marginX + 20, startY - preset.table.headOffset);
                
                ctx.textAlign = 'center';
                ctx.fillText('SECTOR', marginX + (listWidth * preset.columns.sector), startY - preset.table.headOffset);
                ctx.fillText('AIRLINE', marginX + (listWidth * preset.columns.airline), startY - preset.table.headOffset);
                ctx.fillText('TIME', marginX + (listWidth * preset.columns.time), startY - preset.table.headOffset);
                
                ctx.textAlign = 'right';
                ctx.fillText('FARE', marginX + listWidth - 20, startY - preset.table.headOffset);

                // Draw rows (animated entrance)
                for (let i = 0; i < visibleFares.length; i++) {
                    const f = visibleFares[i];
                    const entryTime = rowsStart + (i * motion.rowStagger);
                    
                    if (elapsed < entryTime) continue; // Not yet visible
                    
                    // Fade in effect
                    const fadeDuration = motion.rowReveal;
                    const progress = Math.min(1, (elapsed - entryTime) / fadeDuration);
                    const opacity = easeInOut(progress);
                    
                    // Slide up effect
                    const slideOffset = motion.rowSlide * (1 - opacity);
                    const y = startY + (i * rowHeight) + slideOffset;
                    
                    ctx.globalAlpha = opacity;
                    
                    // Row Background
                    const rowBg = i % 2 === 0 ? '#ffffff' : theme.rowAlt;
                    ctx.fillStyle = rowBg;
                    drawRoundedRect(marginX, y, listWidth, rowHeight - preset.rowInset, 12);
                    ctx.fill();

                    // Content
                    ctx.fillStyle = '#0f172a';
                    ctx.textBaseline = 'middle';
                    
                    // Date
                    const dt = f.flightDate instanceof Date
                        ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
                        : f.flightDate;
                    ctx.textAlign = 'left';
                    ctx.font = `900 ${preset.table.dateSize}px Arial, sans-serif`;
                    ctx.fillText(dt, marginX + 20, y + (rowHeight/2) - 5);

                    // Sector
                    ctx.font = `700 ${preset.table.sectorSize}px Arial, sans-serif`;
                    ctx.fillStyle = theme.sectorText;
                    ctx.textAlign = 'center';
                    const sName = sectorMap[f.sectorId] || f.sectorId;
                    ctx.fillText(sName, marginX + (listWidth * preset.columns.sector), y + (rowHeight/2) - 5);
                    ctx.fillStyle = '#0f172a'; // reset

                    // Airline Logo/Text
                    const centerX = marginX + (listWidth * preset.columns.airline);
                    const airlineObj = getAirline(f.airlineId);
                    const logo = airlineObj ? loadedLogos[airlineObj.id] : null;
                    if (logo && logo.width > 0) {
                        const logoW = Math.min(preset.logo.maxW, logo.width);
                        const logoH = preset.logo.h;
                        ctx.drawImage(logo, centerX - (logoW/2), y + (rowHeight/2) - 5 - (logoH/2), logoW, logoH);
                    } else {
                        ctx.font = `700 ${Math.max(18, preset.table.sectorSize - 2)}px Arial, sans-serif`;
                        ctx.textAlign = 'center';
                        const aName = airlineObj?.name || f.airlineId || '—';
                        ctx.fillText(aName, centerX, y + (rowHeight/2) - 5);
                    }

                    // Time
                    let timeText = normalizeFlightTime(f.flightTime) || '—';
                    ctx.font = `800 ${preset.table.timeSize}px Arial, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.fillText(timeText, marginX + (listWidth * preset.columns.time), y + (rowHeight/2) - 5);

                    // Fare Badge
                    const fareText = `₹${(f.finalRate || 0).toLocaleString()}`;
                    ctx.font = `900 ${preset.table.fareSize}px Arial, sans-serif`;
                    ctx.textAlign = 'right';
                    
                    const textW = ctx.measureText(fareText).width;
                    const badgeRight = marginX + listWidth - 20;
                    const badgeW = textW + 40;
                    const badgeH = 50;
                    
                    ctx.fillStyle = theme.fareBadgeBg;
                    drawRoundedRect(badgeRight - badgeW, y + (rowHeight/2) - 5 - (badgeH/2), badgeW, badgeH, 12);
                    ctx.fill();
                    
                    ctx.fillStyle = theme.fareBadgeText;
                    ctx.fillText(fareText, badgeRight - 20, y + (rowHeight/2) - 5);

                    ctx.globalAlpha = 1.0;
                }

                // --- Draw Footer ---
                // Slide up footer at the very end
                if (elapsed > footerEntryTime) {
                    const footerOpacity = easeInOut(Math.min(1, (elapsed - footerEntryTime) / motion.footerReveal));
                    ctx.globalAlpha = footerOpacity;
                    
                    const fHeight = footerHeight;
                    const fY = height - fHeight + (20 * (1 - footerOpacity));
                    
                    ctx.fillStyle = theme.footerBg;
                    ctx.fillRect(0, height - fHeight, width, fHeight); // Fixed bg
                    ctx.fillRect(0, fY, width, fHeight); // Moving bg inside
                    
                    ctx.fillStyle = theme.footerBorder;
                    ctx.fillRect(0, height - fHeight, width, 2);

                    // Logo
                    if (logoImg.complete && logoImg.width > 0) {
                        ctx.drawImage(logoImg, marginX, height - (fHeight/2) - 24, preset.footer.logo, preset.footer.logo);
                    }
                    
                    ctx.fillStyle = theme.footerText;
                    ctx.font = `900 ${preset.footer.titleSize}px Arial, sans-serif`;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Zamra Travels', marginX + (preset.footer.logo + 16), height - (fHeight/2));
                    
                    // Contact
                    ctx.font = `700 ${preset.footer.infoSize}px Arial, sans-serif`;
                    ctx.textAlign = 'right';
                    ctx.fillStyle = theme.footerText;
                    ctx.fillText('zamratravels.com  |  +91 98466 06739', width - marginX, height - (fHeight/2));

                    ctx.globalAlpha = 1.0;
                }

                // Next frame
                requestAnimationFrame(drawFrame);
            }

            const safetyStop = setTimeout(() => {
                if (!stopped && recorder.state === 'recording') {
                    try {
                        stopped = true;
                        recorder.stop();
                    } catch (e) {
                        console.error('Safety stop error:', e);
                    }
                }
            }, totalDuration + 1500);

            // Start loop
            requestAnimationFrame(drawFrame);

            // 5. Handle recording completion
            recorder.onstop = () => {
                clearTimeout(safetyStop);
                const blob = new Blob(chunks, { type: mimeType });
                if (!blob || !blob.size) {
                    if (window.toast) window.toast('error', 'Generation Error', 'No video data was produced.');
                    reject(new Error('No video data generated.'));
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                a.download = `zamra-video-${ratio}-${sectorSlug}-${Date.now()}.${ext}`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                
                if (window.toast) window.toast('success', 'Video Generated', `Your ${ratio} video has been downloaded!`);
                resolve();
            };

            recorder.onerror = (e) => {
                console.error("Recorder Error:", e);
                if (window.toast) window.toast('error', 'Generation Error', 'Failed to encode the video stream.');
                reject(e);
            };

        } catch (error) {
            console.error(error);
            if (window.toast) window.toast('error', 'Generation Failed', error.message);
            reject(error);
        }
    });
}
