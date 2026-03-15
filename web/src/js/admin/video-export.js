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

    function hashStringSeed(value = '') {
        const str = String(value);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function pickTheme(seedValue) {
        if (!VIDEO_THEMES.length) return VIDEO_THEMES[0];
        const idx = hashStringSeed(seedValue) % VIDEO_THEMES.length;
        return VIDEO_THEMES[idx];
    }

    return new Promise(async (resolve, reject) => {
        try {
            // 1. Dimensions setup
            let width, height;
            if (ratio === '1x1') { width = 1080; height = 1080; }
            else if (ratio === '9x16') { width = 1080; height = 1920; }
            else if (ratio === '16x9') { width = 1920; height = 1080; }
            else { throw new Error('Invalid ratio selected'); }

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

            // Deduplicate flights (same sector, airline, date, time) taking the cheapest rate
            const groupedFaresMap = new Map();
            fares.forEach(fare => {
                const dtTime = fare.flightDate instanceof Date ? fare.flightDate.getTime() : fare.flightDate;
                const key = `${fare.sectorId}_${fare.airlineId}_${dtTime}_${fare.flightTime}`;
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
            const headerHeight = ratio === '9x16' ? 400 : 300;
            const rowHeight = 90;
            const footerHeight = 100;
            const startY = headerHeight + 60;
            const availableHeight = height - startY - footerHeight - 20;
            const maxRows = Math.max(1, Math.floor(availableHeight / rowHeight));
            const visibleFares = sortedFares.slice(0, maxRows);

            const totalDuration = 10000 + (visibleFares.length * 1500); // 10s base + 1.5s per fare
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
                    const parallax = 6 * Math.sin(elapsed / 1800);
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
                const topShift = (Math.sin(elapsed / 1600) + 1) / 2;
                const topGrad = ctx.createLinearGradient(-width * 0.15 * topShift, 0, width * (1 + 0.15 * topShift), 0);
                topGrad.addColorStop(0, theme.topBar[0]);
                topGrad.addColorStop(0.5, theme.topBar[1]);
                topGrad.addColorStop(1, theme.topBar[2]);
                ctx.fillStyle = topGrad;
                ctx.fillRect(0, 0, width, 16);

                // Badge
                const badgeW = 200, badgeH = 40;
                const badgeY = 60;
                const badgePulse = 1 + 0.02 * Math.sin(elapsed / 700);
                ctx.fillStyle = theme.badgeBg;
                drawRoundedRect((width/2) - (badgeW/2), badgeY, badgeW * badgePulse, badgeH, 20);
                ctx.fill();
                ctx.strokeStyle = theme.badgeBorder;
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.fillStyle = theme.badgeText;
                ctx.font = 'bold 16px Arial, sans-serif';
                ctx.fillText('EXCLUSIVE DEALS', width/2, badgeY + (badgeH/2));

                // Title
                const titleSize = ratio === '16x9' ? 70 : 56;
                ctx.font = `900 ${titleSize}px Arial, sans-serif`;
                ctx.textBaseline = 'middle';
                const arrow = '→';
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
                    const titleY = badgeY + 80 - (6 * (1 - easeOutCubic(Math.min(1, elapsed / 800))));
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
                    const titleY = badgeY + 80 - (6 * (1 - easeOutCubic(Math.min(1, elapsed / 800))));
                    ctx.fillText(titleText, width/2, titleY);
                }
                
                // Subtitle
                ctx.fillStyle = theme.subtitle;
                ctx.font = '700 24px Arial, sans-serif';
                const subtitleY = badgeY + 140 - (8 * (1 - easeOutCubic(Math.min(1, elapsed / 1000))));
                ctx.globalAlpha = Math.min(1, elapsed / 1000);
                ctx.fillText('SPECIAL FARES AVAILABLE NOW', width/2, subtitleY);
                ctx.globalAlpha = 1.0;

                // --- Draw Fares ---
                // Layout calculations
                const marginX = ratio === '9x16' ? 40 : (ratio === '1x1' ? 80 : 160);
                const listWidth = width - (marginX * 2);

                // Draw Table Header
                ctx.fillStyle = theme.tableHeadText;
                ctx.font = 'bold 18px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('DATE', marginX + 20, startY - 20);
                
                ctx.textAlign = 'center';
                ctx.fillText('SECTOR', marginX + (listWidth * 0.25), startY - 20);
                ctx.fillText('AIRLINE', marginX + (listWidth * 0.45), startY - 20);
                ctx.fillText('TIME', marginX + (listWidth * 0.65), startY - 20);
                
                ctx.textAlign = 'right';
                ctx.fillText('FARE', marginX + listWidth - 20, startY - 20);

                // Draw rows (animated entrance)
                for (let i = 0; i < visibleFares.length; i++) {
                    const f = visibleFares[i];
                    const entryTime = 1000 + (i * 800); // Starts appearing after 1s, staggered by 0.8s
                    
                    if (elapsed < entryTime) continue; // Not yet visible
                    
                    // Fade in effect
                    const fadeDuration = 650;
                    const progress = Math.min(1, (elapsed - entryTime) / fadeDuration);
                    const opacity = easeOutCubic(progress);
                    
                    // Slide up effect
                    const slideOffset = 26 * (1 - opacity);
                    const y = startY + (i * rowHeight) + slideOffset;
                    
                    ctx.globalAlpha = opacity;
                    
                    // Row Background
                    const rowBg = i % 2 === 0 ? '#ffffff' : theme.rowAlt;
                    ctx.fillStyle = rowBg;
                    drawRoundedRect(marginX, y, listWidth, rowHeight - 10, 12);
                    ctx.fill();

                    // Content
                    ctx.fillStyle = '#0f172a';
                    ctx.textBaseline = 'middle';
                    
                    // Date
                    const dt = f.flightDate instanceof Date
                        ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
                        : f.flightDate;
                    ctx.textAlign = 'left';
                    ctx.font = '900 26px Arial, sans-serif';
                    ctx.fillText(dt, marginX + 20, y + (rowHeight/2) - 5);

                    // Sector
                    ctx.font = '700 22px Arial, sans-serif';
                    ctx.fillStyle = theme.sectorText;
                    ctx.textAlign = 'center';
                    const sName = sectorMap[f.sectorId] || f.sectorId;
                    ctx.fillText(sName, marginX + (listWidth * 0.25), y + (rowHeight/2) - 5);
                    ctx.fillStyle = '#0f172a'; // reset

                    // Airline Logo/Text
                    const centerX = marginX + (listWidth * 0.45);
                    const airlineObj = getAirline(f.airlineId);
                    const logo = airlineObj ? loadedLogos[airlineObj.id] : null;
                    if (logo && logo.width > 0) {
                        const logoW = Math.min(100, logo.width);
                        const logoH = 40;
                        ctx.drawImage(logo, centerX - (logoW/2), y + (rowHeight/2) - 5 - (logoH/2), logoW, logoH);
                    } else {
                        ctx.font = '700 20px Arial, sans-serif';
                        ctx.textAlign = 'center';
                        const aName = airlineObj?.name || f.airlineId || '—';
                        ctx.fillText(aName, centerX, y + (rowHeight/2) - 5);
                    }

                    // Time
                    let timeText = f.flightTime || '—';
                    if (timeText.includes('-')) {
                        const parts = timeText.split('-');
                        timeText = `${parts[0].trim()} - ${parts[1].trim()}`;
                    }
                    ctx.font = '800 22px Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(timeText, marginX + (listWidth * 0.65), y + (rowHeight/2) - 5);

                    // Fare Badge
                    const fareText = `₹${(f.finalRate || 0).toLocaleString()}`;
                    ctx.font = '900 26px Arial, sans-serif';
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
                const footerEntryTime = 1000 + (visibleFares.length * 800) + 500;
                if (elapsed > footerEntryTime) {
                    const footerOpacity = easeInOut(Math.min(1, (elapsed - footerEntryTime) / 600));
                    ctx.globalAlpha = footerOpacity;
                    
                    const fHeight = 100;
                    const fY = height - fHeight + (20 * (1 - footerOpacity));
                    
                    ctx.fillStyle = theme.footerBg;
                    ctx.fillRect(0, height - fHeight, width, fHeight); // Fixed bg
                    ctx.fillRect(0, fY, width, fHeight); // Moving bg inside
                    
                    ctx.fillStyle = theme.footerBorder;
                    ctx.fillRect(0, height - fHeight, width, 2);

                    // Logo
                    if (logoImg.complete && logoImg.width > 0) {
                        ctx.drawImage(logoImg, marginX, height - (fHeight/2) - 24, 48, 48);
                    }
                    
                    ctx.fillStyle = theme.footerText;
                    ctx.font = '900 24px Arial, sans-serif';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Zamra Travels', marginX + 64, height - (fHeight/2));
                    
                    // Contact
                    ctx.font = '700 20px Arial, sans-serif';
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
