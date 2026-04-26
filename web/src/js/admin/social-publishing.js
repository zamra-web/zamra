function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toMillis(value) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDateTime(value) {
  const ms = toMillis(value);
  if (!ms) return 'Unknown';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(ms);
}

function formatRelativeTime(value) {
  const ms = toMillis(value);
  if (!ms) return 'just now';
  const diff = ms - Date.now();
  const minutes = Math.round(diff / 60000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  const days = Math.round(hours / 24);
  return rtf.format(days, 'day');
}

function statusBadgeClass(status = '') {
  const key = String(status || '').toLowerCase();
  if (key === 'ready' || key === 'posted' || key === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (key === 'warning') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (key === 'blocked' || key === 'failed') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (['created', 'processing', 'queued', 'pending', 'partial', 'completed_with_failures'].includes(key)) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

function titleCaseStatus(value = '') {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Unknown';
}

function formatMarketLabel(deps, marketKey = '', fallback = 'Unknown airport group') {
  const market = deps.getPosterSocialMarket?.(marketKey);
  if (market?.label) return market.label;
  const raw = String(marketKey || '').trim();
  return raw ? raw.toUpperCase() : fallback;
}

function formatMarketSummary(market = null) {
  if (!market) return '';
  return market.summary || (Array.isArray(market.airports) ? market.airports.join(' · ') : '');
}

function getCreatedCount(record = {}) {
  const explicit = Number(record.createdItems);
  if (Number.isFinite(explicit) && explicit >= 0) return explicit;
  const planned = Number(record.plannedItems || 0);
  const posted = Number(record.postedItems || 0);
  return Math.max(planned - posted, 0);
}

function normalizeJobStatus(job = {}) {
  const raw = String(job.status || '').toLowerCase();
  const planned = Number(job.plannedItems || 0);
  const posted = Number(job.postedItems || 0);
  const created = getCreatedCount(job);
  if (raw === 'posted' || raw === 'completed' || (planned > 0 && posted >= planned && created === 0)) {
    return 'posted';
  }
  if (!planned && !raw) return 'pending';
  return 'created';
}

function normalizeItemStatus(item = {}) {
  return String(item.status || '').toLowerCase() === 'posted' ? 'posted' : 'created';
}

function hasRetainedMedia(item = {}) {
  return !!(
    item.queueId ||
    item.mediaUrl ||
    (Array.isArray(item.mediaUrls) && item.mediaUrls.length) ||
    item.filename ||
    (Array.isArray(item.filenames) && item.filenames.length)
  );
}

function canRetryJobItem(item = {}) {
  return normalizeItemStatus(item) !== 'posted'
    && hasRetainedMedia(item)
    && !!(item.lastError && item.lastError.message);
}

function isTerminalJobStatus(job = {}) {
  return normalizeJobStatus(job) === 'posted';
}

function isActiveJob(job = {}) {
  if (isTerminalJobStatus(job)) return false;
  const raw = String(job.status || '').toLowerCase();
  if (['failed', 'completed_with_failures'].includes(raw)) return false;
  const stage = String(job.currentStage || job.stage || '').toLowerCase();
  if (!stage) return ['created', 'processing', 'pending', 'queued', 'partial'].includes(raw);
  return !['failed', 'published', 'skipped'].includes(stage);
}

function buildFallbackMarketState(deps, marketKey) {
  const market = deps.getPosterSocialMarket?.(marketKey);
  const platforms = deps.getPosterSocialMarketPlatforms?.(marketKey);
  if (!market || !platforms) return null;

  const blockers = [];
  const channels = {};
  ['instagram', 'facebook', 'youtube'].forEach((platform) => {
    const configured = !!platforms[platform];
    channels[platform] = configured
      ? {
        id: `configured-${platform}`,
        source: 'local',
        status: 'ready',
        message: `${market.label} ${platform} channel is configured.`,
      }
      : {
        id: '',
        source: 'missing',
        status: 'blocked',
        message: `No ${platform} channel configured for ${market.label}.`,
      };
    if (!configured) blockers.push(`No ${platform} channel configured for ${market.label}.`);
  });

  return {
    key: market.key,
    label: market.label,
    status: blockers.length ? 'blocked' : 'ready',
    message: blockers[0] || `${market.label} posting setup is ready.`,
    channels,
  };
}

export function createSocialPublishingController(deps) {
  const state = {
    activeMarketKey: '',
    config: null,
    jobs: [],
    configUnsub: null,
    jobsUnsub: null,
    detailUnsub: null,
    isBusy: false,
  };

  function getRecentJobs() {
    const cutoff = Date.now() - (72 * 60 * 60 * 1000);
    return (state.jobs || []).filter((job) => toMillis(job.createdAt) >= cutoff);
  }

  function getMarketState(marketKey) {
    const market = state.config && state.config.markets ? state.config.markets[marketKey] : null;
    return market || buildFallbackMarketState(deps, marketKey);
  }

  function getActionReadiness(marketKey, action) {
    const market = getMarketState(marketKey);
    if (!market) {
      return {
        ready: false,
        message: 'Publishing setup is loading.',
      };
    }

    const requiredPlatforms = action === 'videos'
      ? ['instagram', 'facebook', 'youtube']
      : ['instagram', 'facebook'];

    const issues = [];
    requiredPlatforms.forEach((platform) => {
      const channel = market.channels && market.channels[platform] ? market.channels[platform] : null;
      if (!channel || !channel.id) {
        issues.push(`Missing ${platform} channel configuration.`);
        return;
      }
      if (channel.status === 'blocked') {
        issues.push(channel.message || `${platform} channel is blocked.`);
        return;
      }
    });

    return {
      ready: issues.length === 0,
      message: issues[0] || market.message || 'Publishing setup is ready.',
    };
  }

  function setBusy(next) {
    state.isBusy = !!next;
    renderMarketGrid();
  }

  function setInlineProgress(message = '') {
    const el = document.getElementById('social-publishing-progress')
      || document.getElementById('poster-video-progress');
    if (!el) return;
    if (message) {
      el.textContent = message;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  function ensureSubscriptions() {
    if (!state.configUnsub) {
      state.configUnsub = deps.subscribeSocialPublishingConfig((config) => {
        state.config = config;
        renderMarketGrid();
      });
    }
    if (!state.jobsUnsub) {
      state.jobsUnsub = deps.subscribeRecentSocialJobs((jobs) => {
        state.jobs = jobs;
        renderCurrentActivity();
        renderJobs();
      });
    }
  }

  function renderMarketGrid() {
    const grid = document.getElementById('poster-social-market-grid');
    if (!grid) return;

    const markets = deps.listPosterSocialMarkets();
    if (state.activeMarketKey && !markets.some((market) => market.key === state.activeMarketKey)) {
      state.activeMarketKey = '';
    }

    const activeMarket = markets.find((market) => market.key === state.activeMarketKey) || null;
    const activeImages = activeMarket ? getActionReadiness(activeMarket.key, 'images') : null;
    const activeVideos = activeMarket ? getActionReadiness(activeMarket.key, 'videos') : null;

    grid.innerHTML = `
      <div class="flex flex-col gap-3">
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
          ${markets.map((market) => {
            const marketState = getMarketState(market.key);
            const isActive = market.key === state.activeMarketKey;
            const status = marketState ? marketState.status : 'pending';
            const activeClasses = isActive
              ? 'border-primary bg-linear-to-br from-primary to-[#1b63b9] text-white shadow-[0_20px_36px_rgba(12,74,138,0.28)]'
              : 'border-slate-200 bg-white/90 text-navy shadow-[0_14px_28px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_32px_rgba(15,23,42,0.1)]';
            const badgeClasses = isActive
              ? 'bg-white/15 text-white'
              : statusBadgeClass(status);
            return `
              <button
                type="button"
                class="group min-h-[104px] rounded-[22px] border px-4 py-3 text-left transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 ${activeClasses}"
                data-market-social-select="1"
                data-market-key="${market.key}"
                aria-pressed="${isActive ? 'true' : 'false'}"
              >
                <span class="flex items-start justify-between gap-2">
                  <span class="text-[15px] font-bold">${market.label}</span>
                  <span class="inline-flex min-w-[54px] items-center justify-center rounded-full border px-2 py-1 text-[10px] font-bold ${badgeClasses}">
                    ${titleCaseStatus(status)}
                  </span>
                </span>
                <span class="mt-3 block text-[10px] font-semibold uppercase tracking-[0.2em] ${isActive ? 'text-white/72' : 'text-text-muted'}">
                  ${escapeHtml(formatMarketSummary(market))}
                </span>
                <span class="mt-2 block text-[11px] leading-5 ${isActive ? 'text-white/82' : 'text-text-muted'}">
                  ${escapeHtml((marketState && marketState.message) || 'Reading publishing setup…')}
                </span>
              </button>
            `;
          }).join('')}
        </div>
        ${activeMarket ? `
          <div class="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <i class="bi bi-share-fill"></i>
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-navy">${activeMarket.label}</p>
                    <p class="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">${escapeHtml(formatMarketSummary(activeMarket))}</p>
                  </div>
                </div>
                <p class="mt-3 text-sm text-text-muted">${escapeHtml(((getMarketState(activeMarket.key) || {}).message) || 'Reading publishing setup…')}</p>
              </div>
              <div class="grid grid-cols-2 gap-2 lg:min-w-[280px]">
                <button
                  type="button"
                  class="admin-btn admin-btn-soft justify-center ${(!activeImages?.ready || state.isBusy || deps.isBlockedByOtherWork()) ? 'opacity-60' : ''}"
                  data-market-social-action="images"
                  data-market-key="${activeMarket.key}"
                  ${(!activeImages?.ready || state.isBusy || deps.isBlockedByOtherWork()) ? 'disabled' : ''}
                >
                  <i class="bi bi-images"></i> Images
                </button>
                <button
                  type="button"
                  class="admin-btn admin-btn-primary justify-center ${(!activeVideos?.ready || state.isBusy || deps.isBlockedByOtherWork()) ? 'opacity-60' : ''}"
                  data-market-social-action="videos"
                  data-market-key="${activeMarket.key}"
                  ${(!activeVideos?.ready || state.isBusy || deps.isBlockedByOtherWork()) ? 'disabled' : ''}
                >
                  <i class="bi bi-camera-video"></i> Videos
                </button>
              </div>
            </div>
            <div class="mt-4 grid gap-2 md:grid-cols-2">
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
                <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Images</p>
                <p class="mt-1 text-sm font-semibold text-navy">${escapeHtml(activeImages?.message || 'Ready')}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
                <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Videos</p>
                <p class="mt-1 text-sm font-semibold text-navy">${escapeHtml(activeVideos?.message || 'Ready')}</p>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderCurrentActivity() {
    const root = document.getElementById('poster-social-current-activity');
    if (!root) return;

    const activeJob = getRecentJobs().find((job) => isActiveJob(job));
    if (!activeJob) {
      root.innerHTML = `
        <div class="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Current Activity</p>
              <p class="mt-1 text-base font-bold text-navy">No active social publishing jobs</p>
            </div>
            <span class="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass('ready')}">Idle</span>
          </div>
        </div>
      `;
      return;
    }

    const activeStatus = normalizeJobStatus(activeJob);
    const createdCount = getCreatedCount(activeJob);

    root.innerHTML = `
      <div class="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Current Activity</p>
            <p class="mt-1 text-base font-bold text-navy">${escapeHtml(activeJob.lastMessage || 'Processing social publishing job')}</p>
            <p class="mt-1 text-sm text-text-muted">${escapeHtml(formatMarketLabel(deps, activeJob.marketKey, 'Multiple airports'))} · ${titleCaseStatus(activeJob.mediaType || 'image')} · ${escapeHtml(activeJob.currentItemLabel || 'Preparing')}</p>
          </div>
          <span class="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(activeStatus)}">${titleCaseStatus(activeStatus)}</span>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          ${[
            ['Created', createdCount],
            ['Posted', activeJob.postedItems || 0],
          ].map(([label, value]) => `
            <div class="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">${label}</p>
              <p class="mt-2 text-2xl font-black text-navy">${value}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderJobs() {
    const root = document.getElementById('poster-social-jobs');
    if (!root) return;
    const jobs = getRecentJobs();

    root.innerHTML = `
      <div class="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Recent Publishing Jobs</p>
            <p class="mt-1 text-base font-bold text-navy">Last 3 days</p>
          </div>
          <p class="text-sm text-text-muted">${jobs.length} job${jobs.length === 1 ? '' : 's'} tracked</p>
        </div>
        <div class="mt-4 flex flex-col gap-3">
          ${jobs.length ? jobs.map((job) => {
            const displayStatus = normalizeJobStatus(job);
            const createdCount = getCreatedCount(job);
            return `
            <div class="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(displayStatus)}">${titleCaseStatus(displayStatus)}</span>
                    <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">${escapeHtml(formatMarketLabel(deps, job.marketKey, 'Multiple airports'))} · ${escapeHtml(job.mediaType || 'image')}</span>
                  </div>
                  <p class="mt-2 text-sm font-bold text-navy">${escapeHtml(job.lastMessage || 'No status message recorded.')}</p>
                  <p class="mt-1 text-xs text-text-muted">${formatDateTime(job.createdAt)} · ${formatRelativeTime(job.createdAt)}</p>
                </div>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-2">
                  ${[
                    ['Created', createdCount],
                    ['Posted', job.postedItems || 0],
                  ].map(([label, value]) => `
                    <div class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center">
                      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">${label}</p>
                      <p class="mt-1 text-base font-black text-navy">${value}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="mt-3 flex justify-end">
                <button type="button" class="admin-btn admin-btn-soft" data-view-social-job="1" data-job-id="${job.id}">
                  <i class="bi bi-list-task"></i> View Details
                </button>
              </div>
            </div>
          `;
          }).join('') : `
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center text-sm text-text-muted">
              No publishing jobs yet. Queue images or videos for any airport group to start tracking.
            </div>
          `}
        </div>
      </div>
    `;
  }

  function syncJobSnapshot(jobId, counts, overrides = {}) {
    const snapshot = {
      ...counts,
      ...overrides,
    };
    snapshot.createdItems = getCreatedCount(snapshot);
    if (!snapshot.status || snapshot.status !== 'posted') {
      snapshot.status = 'created';
    }
    return deps.updateSocialJob(jobId, snapshot);
  }

  async function runDispatcherSoon() {
    try {
      await deps.callRunSocialQueueNow();
    } catch (error) {
      console.warn('runSocialQueueNow failed:', error);
    }
  }

  async function refreshHealth(triggerButton = null, options = {}) {
    if (triggerButton) {
      triggerButton.disabled = true;
      triggerButton.dataset.defaultLabel = triggerButton.dataset.defaultLabel || triggerButton.innerHTML;
      triggerButton.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing…';
    }
    try {
      await deps.callRefreshSocialPublishingHealth();
      if (!options.silent) {
        deps.toast('success', 'Setup Refreshed', 'Airport group publishing setup has been refreshed.');
      }
    } catch (error) {
      if (!options.silent) {
        deps.toast('error', 'Refresh Failed', error.message || 'Failed to refresh publishing setup.');
      }
    } finally {
      if (triggerButton) {
        triggerButton.disabled = false;
        triggerButton.innerHTML = triggerButton.dataset.defaultLabel;
      }
    }
  }

  async function queueMarketImagesForSocial(marketKey) {
    const market = deps.getPosterSocialMarket(marketKey);
    if (!market) {
      deps.toast('error', 'Queue Failed', 'Unknown airport group.');
      return;
    }
    if (deps.isBlockedByOtherWork() || state.isBusy) {
      deps.toast('warning', 'Please Wait', 'Another poster export or social queue job is already running.');
      return;
    }
    const readiness = getActionReadiness(marketKey, 'images');
    if (!readiness.ready) {
      deps.toast('warning', 'Airport Group Not Ready', readiness.message);
      return;
    }

    const sectorIds = deps.getMarketSectorIds(marketKey);
    if (!sectorIds.length) {
      deps.toast('warning', 'No Sectors', `No routes touching ${market.label} are configured yet.`);
      return;
    }

    const { startDate, endDate } = deps.getPosterSocialDateFilters();
    setBusy(true);
    deps.setMarketQueueBusy(true);

    try {
      const fares = await deps.getFares({ sectorId: 'all', startDate, endDate, includeHidden: false });
      const faresBySector = new Map();
      fares.forEach((fare) => {
        if (!sectorIds.includes(fare.sectorId)) return;
        if (!faresBySector.has(fare.sectorId)) faresBySector.set(fare.sectorId, []);
        faresBySector.get(fare.sectorId).push(fare);
      });

      const eligibleSectors = sectorIds
        .map((sid) => deps.getSectors().find((sector) => sector.id === sid))
        .filter((sector) => sector && (faresBySector.get(sector.id)?.length || 0) > 0);

      if (!eligibleSectors.length) {
        deps.toast('warning', 'No Fares', `No live ${market.label} fares found for the selected date range.`);
        return;
      }

      const jobId = await deps.createSocialJob({
        source: 'admin',
        marketKey,
        mediaType: 'image',
        status: 'created',
        currentStage: 'rendering',
        lastMessage: `Rendering ${eligibleSectors.length} ${market.label} image batch${eligibleSectors.length > 1 ? 'es' : ''}.`,
        requestedBy: deps.getRequestedBy(),
        filters: { startDate, endDate, marketKey, sectorIds },
        plannedItems: eligibleSectors.length,
        createdItems: eligibleSectors.length,
      });

      const counts = {
        plannedItems: eligibleSectors.length,
        renderedItems: 0,
        uploadedItems: 0,
        queuedItems: 0,
        postedItems: 0,
        failedItems: 0,
        partialItems: 0,
      };

      const workspace = deps.createOffscreenPosterWorkspace();
      try {
        for (let index = 0; index < eligibleSectors.length; index += 1) {
          const sector = eligibleSectors[index];
          const sectorCode = sector.sectorCode || sector.id;
          const caption = deps.formatPosterSocialCaption(sector, marketKey, 'image');
          const itemId = await deps.createSocialJobItem(jobId, {
            source: 'admin',
            label: sectorCode,
            sectorId: sector.id,
            sectorCode,
            marketKey,
            mediaType: 'image',
            ratio: 'carousel',
            status: 'pending',
            stage: 'rendering',
            lastMessage: `Rendering ${sectorCode} image batch…`,
            platforms: ['instagram', 'facebook'],
            caption,
          });

          try {
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'rendering',
              currentItemLabel: sectorCode,
              lastMessage: `Rendering ${index + 1}/${eligibleSectors.length} · ${sectorCode}`,
              status: 'created',
            });

            const frames = await deps.populatePosterRenderStack(
              faresBySector.get(sector.id) || [],
              sector.id,
              workspace.stack,
              workspace.templateFrame,
            );
            if (!frames.length) {
              throw new Error(`No poster frames were generated for ${sectorCode}.`);
            }

            const items = [];
            for (const frame of frames) {
              const blob = await deps.renderPosterFrameToBlob(frame);
              if (!blob) continue;
              const page = Number(frame.dataset.posterPage || 1);
              const pageCount = Number(frame.dataset.posterPageCount || 1);
              const pageSuffix = pageCount > 1 ? `-p${page}` : '';
              items.push({
                blob,
                filename: `${deps.fileSafeSlug(sectorCode) || 'poster'}${pageSuffix}-${Date.now()}.jpg`,
              });
            }
            if (!items.length) {
              throw new Error(`No image blobs were produced for ${sectorCode}.`);
            }

            counts.renderedItems += 1;
            await deps.updateSocialJobItem(jobId, itemId, {
              stage: 'uploading',
              renderedAt: new Date(),
              lastMessage: 'Rendered successfully. Uploading poster media…',
            });
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'uploading',
              currentItemLabel: sectorCode,
              lastMessage: `Uploading ${sectorCode} to Firebase Storage…`,
            });

            const result = await deps.uploadAndQueueCarousel(items, {
              source: 'admin',
              jobId,
              jobItemId: itemId,
              label: sectorCode,
              sectorId: sector.id,
              sectorCode,
              marketKey,
              caption,
              platforms: ['instagram', 'facebook'],
              lastMessage: 'Uploaded and waiting for Buffer dispatch.',
            });

            counts.uploadedItems += 1;
            counts.queuedItems += 1;
            await deps.updateSocialJobItem(jobId, itemId, {
              queueId: result.queueId,
              status: 'pending',
              stage: 'waiting_dispatch',
              uploadedAt: new Date(),
              mediaUrls: result.mediaUrls || [],
              filenames: items.map((item) => item.filename),
              caption,
              lastMessage: 'Uploaded and waiting for Buffer dispatch.',
            });
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'waiting_dispatch',
              currentItemLabel: sectorCode,
              lastMessage: `Queued ${sectorCode} for Buffer dispatch.`,
            });
          } catch (error) {
            counts.failedItems += 1;
            await deps.updateSocialJobItem(jobId, itemId, {
              status: 'failed',
              stage: 'failed',
              lastError: { message: error.message || String(error), retryable: false },
              lastMessage: error.message || `Failed to queue ${sectorCode}.`,
            });
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'failed',
              currentItemLabel: sectorCode,
              lastMessage: error.message || `Failed to queue ${sectorCode}.`,
            });
            console.error('queueMarketImagesForSocial:', error);
          }
        }
      } finally {
        workspace.destroy();
      }

      await syncJobSnapshot(jobId, counts, {
        status: 'created',
        currentStage: counts.queuedItems ? 'waiting_dispatch' : 'failed',
        lastMessage: counts.queuedItems
          ? `Queued ${counts.queuedItems} ${market.label} image batch${counts.queuedItems > 1 ? 'es' : ''} for dispatch.`
          : `No ${market.label} image batches were queued.`,
      });

      await runDispatcherSoon();

      if (!counts.queuedItems) {
        deps.toast('warning', 'Queue Failed', `No ${market.label} image batches were queued.`);
        return;
      }

      const failureNote = counts.failedItems ? ` ${counts.failedItems} sector${counts.failedItems > 1 ? 's' : ''} failed.` : '';
      deps.toast('success', 'Queued for Social', `${counts.queuedItems} ${market.label} image batch${counts.queuedItems > 1 ? 'es' : ''} queued for Instagram/Facebook feed posts.${failureNote}`);
    } catch (error) {
      console.error('queueMarketImagesForSocial:', error);
      deps.toast('error', 'Queue Failed', error.message || 'Failed to queue airport images.');
    } finally {
      deps.setMarketQueueBusy(false);
      setBusy(false);
    }
  }

  async function queueMarketVideosForSocial(marketKey) {
    const market = deps.getPosterSocialMarket(marketKey);
    if (!market) {
      deps.toast('error', 'Queue Failed', 'Unknown airport group.');
      return;
    }
    if (deps.isBlockedByOtherWork() || state.isBusy) {
      deps.toast('warning', 'Please Wait', 'Another poster export or social queue job is already running.');
      return;
    }
    const readiness = getActionReadiness(marketKey, 'videos');
    if (!readiness.ready) {
      deps.toast('warning', 'Airport Group Not Ready', readiness.message);
      return;
    }

    const sectorIds = deps.getMarketSectorIds(marketKey);
    if (!sectorIds.length) {
      deps.toast('warning', 'No Sectors', `No routes touching ${market.label} are configured yet.`);
      return;
    }

    const { startDate, endDate } = deps.getPosterSocialDateFilters();
    setBusy(true);
    deps.setVideoExportBusy(true);
    deps.setMarketQueueBusy(true);

    try {
      const fares = await deps.getFares({ sectorId: 'all', startDate, endDate, includeHidden: false });
      const faresBySector = new Map();
      fares.forEach((fare) => {
        if (!sectorIds.includes(fare.sectorId)) return;
        if (!faresBySector.has(fare.sectorId)) faresBySector.set(fare.sectorId, []);
        faresBySector.get(fare.sectorId).push(fare);
      });

      const eligibleSectors = sectorIds
        .map((sid) => deps.getSectors().find((sector) => sector.id === sid))
        .filter((sector) => sector && (faresBySector.get(sector.id)?.length || 0) > 0);

      if (!eligibleSectors.length) {
        deps.toast('warning', 'No Fares', `No live ${market.label} fares found for the selected date range.`);
        return;
      }

      const totalPlanned = eligibleSectors.length * 2;
      const jobId = await deps.createSocialJob({
        source: 'admin',
        marketKey,
        mediaType: 'video',
        status: 'created',
        currentStage: 'rendering',
        lastMessage: `Rendering ${totalPlanned} ${market.label} video uploads.`,
        requestedBy: deps.getRequestedBy(),
        filters: { startDate, endDate, marketKey, sectorIds },
        plannedItems: totalPlanned,
        createdItems: totalPlanned,
      });
      const counts = {
        plannedItems: totalPlanned,
        renderedItems: 0,
        uploadedItems: 0,
        queuedItems: 0,
        postedItems: 0,
        failedItems: 0,
        partialItems: 0,
      };

      for (let index = 0; index < eligibleSectors.length; index += 1) {
        const sector = eligibleSectors[index];
        const sectorCode = sector.sectorCode || sector.id;
        const sectorFares = faresBySector.get(sector.id) || [];
        const variants = [
          {
            ratio: '9x16',
            label: `${sectorCode} · 9:16`,
            platforms: ['instagram', 'facebook', 'youtube'],
            captionType: 'video9x16',
          },
          {
            ratio: '16x9',
            label: `${sectorCode} · 16:9`,
            platforms: ['youtube'],
            captionType: 'video16x9',
          },
        ];

        for (const variant of variants) {
          const itemId = await deps.createSocialJobItem(jobId, {
            source: 'admin',
            label: variant.label,
            sectorId: sector.id,
            sectorCode,
            marketKey,
            mediaType: 'video',
            ratio: variant.ratio,
            status: 'pending',
            stage: 'rendering',
            lastMessage: `Rendering ${variant.label}…`,
            platforms: variant.platforms,
            caption: deps.formatPosterSocialCaption(sector, marketKey, variant.captionType),
            youtubeTitle: deps.formatPosterSocialYouTubeTitle(sector, marketKey, variant.captionType),
          });

          try {
            setInlineProgress(`Rendering ${index + 1}/${eligibleSectors.length} · ${variant.label}`);
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'rendering',
              currentItemLabel: variant.label,
              lastMessage: `Rendering ${variant.label}`,
            });
            const result = await deps.downloadVideoPoster(
              variant.ratio,
              sectorFares,
              sector.id,
              deps.getSectors(),
              deps.getAirlines(),
              { autoDownload: false, returnBlob: true, requireMp4: true },
            );
            if (!result || !result.blob) {
              throw new Error(`No video data was produced for ${variant.label}.`);
            }

            counts.renderedItems += 1;
            await deps.updateSocialJobItem(jobId, itemId, {
              stage: 'uploading',
              renderedAt: new Date(),
              lastMessage: 'Rendered successfully. Uploading video media…',
            });
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'uploading',
              currentItemLabel: variant.label,
              lastMessage: `Uploading ${variant.label} to Firebase Storage…`,
            });

            const filename = `${deps.fileSafeSlug(sectorCode)}-${variant.ratio}-${Date.now()}.mp4`;
            const caption = deps.formatPosterSocialCaption(sector, marketKey, variant.captionType);
            const upload = await deps.uploadAndQueueForSocial(result.blob, filename, {
              source: 'admin',
              jobId,
              jobItemId: itemId,
              label: variant.label,
              sectorId: sector.id,
              sectorCode,
              marketKey,
              mediaType: 'video',
              ratio: variant.ratio,
              caption,
              youtubeTitle: deps.formatPosterSocialYouTubeTitle(sector, marketKey, variant.captionType),
              platforms: variant.platforms,
              lastMessage: 'Uploaded and waiting for Buffer dispatch.',
            });

            counts.uploadedItems += 1;
            counts.queuedItems += 1;
            await deps.updateSocialJobItem(jobId, itemId, {
              queueId: upload.queueId,
              status: 'pending',
              stage: 'waiting_dispatch',
              uploadedAt: new Date(),
              mediaUrl: upload.mediaUrl || '',
              mediaUrls: upload.mediaUrl ? [upload.mediaUrl] : [],
              filename,
              caption,
              youtubeTitle: deps.formatPosterSocialYouTubeTitle(sector, marketKey, variant.captionType),
              lastMessage: 'Uploaded and waiting for Buffer dispatch.',
            });
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'waiting_dispatch',
              currentItemLabel: variant.label,
              lastMessage: `Queued ${variant.label} for Buffer dispatch.`,
            });
          } catch (error) {
            counts.failedItems += 1;
            await deps.updateSocialJobItem(jobId, itemId, {
              status: 'failed',
              stage: 'failed',
              lastError: { message: error.message || String(error), retryable: false },
              lastMessage: error.message || `Failed to queue ${variant.label}.`,
            });
            await syncJobSnapshot(jobId, counts, {
              currentStage: 'failed',
              currentItemLabel: variant.label,
              lastMessage: error.message || `Failed to queue ${variant.label}.`,
            });
            console.error('queueMarketVideosForSocial:', error);
          }
        }
      }

      await syncJobSnapshot(jobId, counts, {
        status: 'created',
        currentStage: counts.queuedItems ? 'waiting_dispatch' : 'failed',
        lastMessage: counts.queuedItems
          ? `Queued ${counts.queuedItems} ${market.label} video upload${counts.queuedItems > 1 ? 's' : ''} for dispatch.`
          : `No ${market.label} videos were queued.`,
      });

      await runDispatcherSoon();

      if (!counts.queuedItems) {
        deps.toast('warning', 'Queue Failed', `No ${market.label} videos were queued.`);
        return;
      }

      const failureNote = counts.failedItems ? ` ${counts.failedItems} render${counts.failedItems > 1 ? 's' : ''} failed.` : '';
      deps.toast('success', 'Queued for Social', `${counts.queuedItems} ${market.label} video upload${counts.queuedItems > 1 ? 's' : ''} queued.${failureNote}`);
    } catch (error) {
      console.error('queueMarketVideosForSocial:', error);
      deps.toast('error', 'Queue Failed', error.message || 'Failed to queue airport videos.');
    } finally {
      setInlineProgress('');
      deps.setVideoExportBusy(false);
      deps.setMarketQueueBusy(false);
      setBusy(false);
    }
  }

  function renderJobDetail(job, items) {
    const jobStatus = normalizeJobStatus(job);
    return `
      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">${escapeHtml(formatMarketLabel(deps, job.marketKey, 'Multiple airports'))} · ${escapeHtml(job.mediaType || 'image')}</p>
              <p class="mt-1 text-lg font-bold text-navy">${escapeHtml(job.lastMessage || 'No status message recorded.')}</p>
              <p class="mt-1 text-sm text-text-muted">${formatDateTime(job.createdAt)}</p>
            </div>
            <span class="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(jobStatus)}">${titleCaseStatus(jobStatus)}</span>
          </div>
        </div>
        <div class="space-y-3">
          ${items.map((item) => {
            const itemStatus = normalizeItemStatus(item);
            return `
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-sm font-bold text-navy">${escapeHtml(item.label || item.sectorCode || item.id)}</span>
                    <span class="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(itemStatus)}">${titleCaseStatus(itemStatus)}</span>
                  </div>
                  <p class="mt-2 text-sm text-text-muted">${escapeHtml(item.lastMessage || 'No status message recorded.')}</p>
                  <p class="mt-2 text-[12px] text-text-muted">${escapeHtml((item.platforms || []).join(', ') || 'No platforms')}</p>
                  ${item.lastError && item.lastError.message ? `<p class="mt-2 text-[12px] font-semibold text-rose-600">${escapeHtml(item.lastError.message)}</p>` : ''}
                </div>
                <div class="flex flex-wrap gap-2 lg:justify-end">
                  ${canRetryJobItem(item) ? `
                    <button type="button" class="admin-btn admin-btn-soft" data-action="retry-job-item" data-job-id="${job.id}" data-item-id="${item.id}">
                      <i class="bi bi-arrow-repeat"></i> Retry
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function openJobDetails(jobId) {
    const job = getRecentJobs().find((item) => item.id === jobId);
    if (!job) return;

    deps.openModal('Publishing Job Details', '<div id="social-job-detail-root" class="text-sm text-text-muted">Loading job details…</div>', true);
    const root = document.getElementById('social-job-detail-root');
    if (!root) return;

    if (state.detailUnsub) {
      state.detailUnsub();
      state.detailUnsub = null;
    }

    state.detailUnsub = deps.subscribeSocialJobItems(jobId, (items) => {
      root.innerHTML = renderJobDetail(job, items);
      root.onclick = async (event) => {
        const btn = event.target.closest('[data-action="retry-job-item"]');
        if (!btn) return;
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Retrying…';
        try {
          await deps.callRetrySocialJobItem(btn.dataset.jobId, btn.dataset.itemId);
          deps.toast('success', 'Retry Queued', 'A fresh queue entry has been created from the retained media.');
        } catch (error) {
          deps.toast('error', 'Retry Failed', error.message || 'Failed to retry this job item.');
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Retry';
        }
      };
    });

    const modal = document.getElementById('admin-modal');
    if (modal && !modal.dataset.socialDetailCleanupWired) {
      modal.dataset.socialDetailCleanupWired = '1';
      modal.addEventListener('close', () => {
        if (state.detailUnsub) {
          state.detailUnsub();
          state.detailUnsub = null;
        }
      });
    }
  }

  function wireUi() {
    const grid = document.getElementById('poster-social-market-grid');
    if (grid && !grid.dataset.wired) {
      grid.dataset.wired = '1';
      grid.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-market-social-select]');
        if (toggle) {
          state.activeMarketKey = state.activeMarketKey === toggle.dataset.marketKey ? '' : toggle.dataset.marketKey;
          renderMarketGrid();
          return;
        }

        const actionBtn = event.target.closest('[data-market-social-action]');
        if (!actionBtn) return;
        const marketKey = actionBtn.dataset.marketKey;
        const action = actionBtn.dataset.marketSocialAction;
        if (action === 'images') {
          queueMarketImagesForSocial(marketKey);
        } else if (action === 'videos') {
          queueMarketVideosForSocial(marketKey);
        }
      });
    }

    const jobsRoot = document.getElementById('poster-social-jobs');
    if (jobsRoot && !jobsRoot.dataset.wired) {
      jobsRoot.dataset.wired = '1';
      jobsRoot.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-view-social-job]');
        if (!btn) return;
        openJobDetails(btn.dataset.jobId);
      });
    }

    const refreshBtn = document.getElementById('poster-social-refresh-btn');
    if (refreshBtn && !refreshBtn.dataset.wired) {
      refreshBtn.dataset.wired = '1';
      refreshBtn.addEventListener('click', () => refreshHealth(refreshBtn));
    }
  }

  function render() {
    ensureSubscriptions();
    wireUi();
    renderMarketGrid();
    renderCurrentActivity();
    renderJobs();
  }

  return {
    render,
  };
}
