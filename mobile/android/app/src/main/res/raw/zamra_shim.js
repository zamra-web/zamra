/*
 * Injected into every portal page by ZamraWebViewClient.
 *
 * An Android WebView ignores <a download> when the href is a blob: or data: URL, which is exactly
 * how this codebase emits every file it produces:
 *
 *   - jsPDF .save()        -> detached <a download>, fired with dispatchEvent(new MouseEvent)
 *   - html2canvas exports  -> link.download = name; link.click()
 *   - CSV / poster / video -> URL.createObjectURL(blob) on an <a download>
 *
 * So we catch all three ways an anchor can be clicked, pull the bytes out ourselves, and stream
 * them to the native side in base64 chunks. Nothing here changes behaviour in a normal browser —
 * the file only ever loads inside the app, where window.ZamraNative exists.
 */
(function () {
    'use strict';

    if (window.__zamraShimInstalled) return;

    var native = window.ZamraNative;
    if (!native || typeof native.beginSave !== 'function') return;

    window.__zamraShimInstalled = true;

    var CHUNK_BYTES = 512 * 1024;
    var TOAST_ABOVE_BYTES = 4 * 1024 * 1024;

    // ---- helpers --------------------------------------------------------------------------

    function base64OfSlice(slice) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                var result = String(reader.result);
                var comma = result.indexOf(',');
                resolve(comma >= 0 ? result.slice(comma + 1) : '');
            };
            reader.onerror = function () {
                reject(reader.error || new Error('Could not read the file'));
            };
            reader.readAsDataURL(slice);
        });
    }

    function streamToNative(blob, filename) {
        var token = native.beginSave(filename, blob.type || '');
        if (!token) return Promise.resolve(false);

        if (blob.size > TOAST_ABOVE_BYTES) {
            try { native.toast('Saving ' + filename + '…'); } catch (e) { /* cosmetic */ }
        }

        var offset = 0;

        function pump() {
            if (offset >= blob.size) {
                return Promise.resolve(native.endSave(token));
            }
            var slice = blob.slice(offset, offset + CHUNK_BYTES);
            offset += CHUNK_BYTES;
            return base64OfSlice(slice).then(function (chunk) {
                if (!native.appendChunk(token, chunk)) {
                    throw new Error('Native side rejected a chunk');
                }
                return pump();
            });
        }

        return pump().catch(function (err) {
            try { native.cancelSave(token); } catch (e) { /* already gone */ }
            console.error('[zamra] download failed', err);
            return false;
        });
    }

    function filenameFor(anchor, blob) {
        var name = (anchor.getAttribute('download') || '').trim();
        if (name) return name;

        var stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        var type = (blob && blob.type ? blob.type : '').split(';')[0];
        var ext = ({
            'application/pdf': 'pdf',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'text/csv': 'csv',
            'text/plain': 'txt',
            'application/json': 'json',
            'video/mp4': 'mp4',
            'video/webm': 'webm'
        })[type];

        return 'zamra-' + stamp + (ext ? '.' + ext : '');
    }

    /**
     * Returns true when we took ownership of the click, meaning the caller must not let the
     * WebView handle it (it would do nothing at all).
     */
    function intercept(anchor) {
        if (!anchor || anchor.tagName !== 'A') return false;
        if (!anchor.hasAttribute('download')) return false;

        var href = anchor.href || anchor.getAttribute('href') || '';
        if (!href) return false;

        var isInMemory = href.indexOf('blob:') === 0 || href.indexOf('data:') === 0;
        var isRemote = href.indexOf('http:') === 0 || href.indexOf('https:') === 0;
        if (!isInMemory && !isRemote) return false;

        // Remote files stream straight to DownloadManager — no need to route megabytes
        // through the JS bridge.
        if (isRemote) {
            var remoteName = (anchor.getAttribute('download') || '').trim();
            return native.downloadUrl(href, remoteName, anchor.type || '');
        }

        fetch(href)
            .then(function (response) { return response.blob(); })
            .then(function (blob) { return streamToNative(blob, filenameFor(anchor, blob)); })
            .catch(function (err) {
                console.error('[zamra] could not read the generated file', err);
                try { native.toast('Could not prepare that file.'); } catch (e) { /* ignore */ }
            });

        return true;
    }

    // ---- the three ways this app clicks a download link -------------------------------------

    // 1. link.click()
    var nativeClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
        if (intercept(this)) return;
        return nativeClick.apply(this, arguments);
    };

    // 2. node.dispatchEvent(new MouseEvent('click')) — what jsPDF's saveAs() uses, on an anchor
    //    that was never added to the document, so no listener on document would ever see it.
    var nativeDispatch = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event) {
        if (event && event.type === 'click' && this instanceof HTMLAnchorElement) {
            if (intercept(this)) return true;
        }
        return nativeDispatch.apply(this, arguments);
    };

    // 3. A real tap on a download link that lives in the page.
    document.addEventListener('click', function (event) {
        var anchor = event.target && event.target.closest ? event.target.closest('a[download]') : null;
        if (anchor && intercept(anchor)) {
            event.preventDefault();
        }
    }, true);
})();
