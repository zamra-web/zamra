export async function downloadVideoPoster(ratio, fares, sectorId, sectors, airlines) {
    // Show loading toast (assuming toast is globally available or we can just use basic UI feedback)
    const toastMessage = `Generating ${ratio} Video... Please remain on this tab.`;
    if (window.toast) window.toast('info', 'Video Generation', toastMessage);

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
            const sector = sectors.find(s => s.id === sectorId);
            const originName = sector ? (sector.sectorFrom || 'DEP').toUpperCase() : 'DEP';
            const destName = sector ? (sector.sectorTo || 'ARR').toUpperCase() : 'ARR';

            const sortedFares = [...fares].sort((a, b) => {
                let valA = a.flightDate, valB = b.flightDate;
                if (valA instanceof Date) valA = valA.getTime();
                if (valB instanceof Date) valB = valB.getTime();
                return valA - valB;
            }).slice(0, 10); // Standard poster limits to 10

            const airlineMap = {};
            airlines.forEach(a => {
                if (a.id) airlineMap[a.id] = a;
                if (a.code) airlineMap[a.code] = a;
                if (a.name) airlineMap[a.name] = a;
            });

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
                bgImg.src = '/assets/img/hero-bg.webp';
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
            const uniqueAirlines = [...new Set(sortedFares.map(f => f.airlineId))].map(id => airlineMap[id]).filter(a => a?.logoUrl);
            await Promise.all(uniqueAirlines.map(async a => {
                const img = await fetchLogoImage(a.logoUrl);
                if (img) loadedLogos[a.id] = img;
            }));

            // 3. Start Recording
            const stream = canvas.captureStream(30); // 30 FPS
            
            // Prefer MP4 if available (Safari/Chrome), fallback to webm
            let mimeType = 'video/webm; codecs=vp9';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/mp4'; // Safari
                }
            }
            
            const recorder = new MediaRecorder(stream, { mimeType });
            const chunks = [];
            recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

            // Start Recorder
            recorder.start(100); // Record in 100ms chunks to ensure data availability

            // 4. Animation loop
            const totalDuration = 10000 + (sortedFares.length * 1500); // 10s base + 1.5s per fare
            const startTime = performance.now();

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
                const elapsed = now - startTime;
                
                if (elapsed > totalDuration) {
                    try {
                        recorder.stop();
                    } catch(e) { console.error("Error stopping recorder", e); }
                    return; // End loop
                }

                // --- Draw Background ---
                ctx.fillStyle = '#f8fafc'; // bg-slate-50
                ctx.fillRect(0, 0, width, height);

                // --- Draw Header Area ---
                // Depending on ratio, header height changes
                const headerHeight = ratio === '9x16' ? 400 : 300;
                
                // Draw Hero Image with overlay
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(0, 0, width, headerHeight);
                if (bgImg.complete && bgImg.width > 0) {
                    ctx.globalAlpha = 0.2;
                    // Cover logic
                    const scale = Math.max(width / bgImg.width, headerHeight / bgImg.height);
                    const dw = bgImg.width * scale;
                    const dh = bgImg.height * scale;
                    const dx = (width - dw) / 2;
                    const dy = (headerHeight - dh) / 2;
                    ctx.drawImage(bgImg, dx, dy, dw, dh);
                    ctx.globalAlpha = 1.0;
                }

                // Gradient overlay
                const grad = ctx.createLinearGradient(0, 0, 0, headerHeight);
                grad.addColorStop(0, '#1e293b');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(0, 0, width, headerHeight);
                ctx.globalAlpha = 1.0;

                // Header Text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Top Decor
                const topGrad = ctx.createLinearGradient(0,0,width,0);
                topGrad.addColorStop(0, '#2563eb');
                topGrad.addColorStop(0.5, '#60a5fa');
                topGrad.addColorStop(1, '#1558c0');
                ctx.fillStyle = topGrad;
                ctx.fillRect(0, 0, width, 16);

                // Badge
                const badgeW = 200, badgeH = 40;
                const badgeY = 60;
                ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
                drawRoundedRect((width/2) - (badgeW/2), badgeY, badgeW, badgeH, 20);
                ctx.fill();
                ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.fillStyle = '#bfdbfe';
                ctx.font = 'bold 16px Arial, sans-serif';
                ctx.fillText('EXCLUSIVE DEALS', width/2, badgeY + (badgeH/2));

                // Title
                ctx.fillStyle = '#ffffff';
                ctx.font = '900 ' + (ratio === '16x9' ? '70px' : '56px') + ' Arial, sans-serif';
                ctx.fillText(`${originName} → ${destName}`, width/2, badgeY + 80);
                
                // Subtitle
                ctx.fillStyle = '#dbeafe';
                ctx.font = '700 24px Arial, sans-serif';
                ctx.fillText('SPECIAL FARES AVAILABLE NOW', width/2, badgeY + 140);

                // --- Draw Fares ---
                // Layout calculations
                const startY = headerHeight + 60;
                const rowHeight = 90;
                const marginX = ratio === '9x16' ? 40 : (ratio === '1x1' ? 80 : 160);
                const listWidth = width - (marginX * 2);

                // Draw Table Header
                ctx.fillStyle = '#64748b';
                ctx.font = 'bold 18px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('DATE', marginX + 20, startY - 20);
                
                ctx.textAlign = 'center';
                ctx.fillText('AIRLINE', marginX + (listWidth * 0.35), startY - 20);
                ctx.fillText('TIME', marginX + (listWidth * 0.65), startY - 20);
                
                ctx.textAlign = 'right';
                ctx.fillText('FARE', marginX + listWidth - 20, startY - 20);

                // Draw rows (animated entrance)
                for (let i = 0; i < sortedFares.length; i++) {
                    const f = sortedFares[i];
                    const entryTime = 1000 + (i * 800); // Starts appearing after 1s, staggered by 0.8s
                    
                    if (elapsed < entryTime) continue; // Not yet visible
                    
                    // Fade in effect
                    const fadeDuration = 500;
                    const opacity = Math.min(1, (elapsed - entryTime) / fadeDuration);
                    
                    // Slide up effect
                    const slideOffset = 20 * (1 - opacity);
                    const y = startY + (i * rowHeight) + slideOffset;
                    
                    ctx.globalAlpha = opacity;
                    
                    // Row Background
                    if (i % 2 === 0) {
                        ctx.fillStyle = '#ffffff';
                        drawRoundedRect(marginX, y, listWidth, rowHeight - 10, 12);
                        ctx.fill();
                    }

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

                    // Airline Logo/Text
                    const centerX = marginX + (listWidth * 0.35);
                    const logo = loadedLogos[f.airlineId];
                    if (logo && logo.width > 0) {
                        const logoW = Math.min(100, logo.width);
                        const logoH = 40;
                        ctx.drawImage(logo, centerX - (logoW/2), y + (rowHeight/2) - 5 - (logoH/2), logoW, logoH);
                    } else {
                        ctx.font = '700 20px Arial, sans-serif';
                        ctx.textAlign = 'center';
                        const aName = airlineMap[f.airlineId]?.name || f.airlineId || '—';
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
                    
                    ctx.fillStyle = '#0f172a';
                    drawRoundedRect(badgeRight - badgeW, y + (rowHeight/2) - 5 - (badgeH/2), badgeW, badgeH, 12);
                    ctx.fill();
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(fareText, badgeRight - 20, y + (rowHeight/2) - 5);

                    ctx.globalAlpha = 1.0;
                }

                // --- Draw Footer ---
                // Slide up footer at the very end
                const footerEntryTime = 1000 + (sortedFares.length * 800) + 500;
                if (elapsed > footerEntryTime) {
                    const footerOpacity = Math.min(1, (elapsed - footerEntryTime) / 500);
                    ctx.globalAlpha = footerOpacity;
                    
                    const fHeight = 100;
                    const fY = height - fHeight + (20 * (1 - footerOpacity));
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, height - fHeight, width, fHeight); // Fixed bg
                    ctx.fillRect(0, fY, width, fHeight); // Moving bg inside
                    
                    ctx.fillStyle = '#f1f5f9';
                    ctx.fillRect(0, height - fHeight, width, 2);

                    // Logo
                    if (logoImg.complete && logoImg.width > 0) {
                        ctx.drawImage(logoImg, marginX, height - (fHeight/2) - 24, 48, 48);
                    }
                    
                    ctx.fillStyle = '#1e293b';
                    ctx.font = '900 24px Arial, sans-serif';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Zamra Travels', marginX + 64, height - (fHeight/2));
                    
                    // Contact
                    ctx.font = '700 20px Arial, sans-serif';
                    ctx.textAlign = 'right';
                    ctx.fillText('zamratravels.com  |  +91 98765 43210', width - marginX, height - (fHeight/2));

                    ctx.globalAlpha = 1.0;
                }

                // Next frame
                requestAnimationFrame(drawFrame);
            }

            // Start loop
            requestAnimationFrame(drawFrame);

            // 5. Handle recording completion
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // extension handling
                const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                a.download = `zamra-video-${ratio}-${Date.now()}.${ext}`;
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
