(function () {
    const MANIFEST_PATH = 'img/image-manifest.json';
    let manifestPromise = null;

    const fetchManifest = () => {
        if (!manifestPromise) {
            manifestPromise = fetch(MANIFEST_PATH, { cache: 'no-store' })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Unable to load image manifest');
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error(error);
                    return {};
                });
        }
        return manifestPromise;
    };

    const applyImages = async () => {
        const manifest = await fetchManifest();
        document.querySelectorAll('[data-img-key]').forEach((node) => {
            const key = node.getAttribute('data-img-key');
            if (!key || !manifest[key]) {
                return;
            }
            const assetPath = manifest[key];
            if (node.dataset.imgType === 'background') {
                node.style.backgroundImage = `url('${assetPath}')`;
            } else {
                if (!node.getAttribute('src') || node.getAttribute('src').startsWith('data:image/svg')) {
                    node.setAttribute('src', assetPath);
                } else {
                    node.setAttribute('data-src', assetPath);
                }
                node.setAttribute('loading', 'lazy');
                node.setAttribute('decoding', 'async');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        applyImages();
    });

    window.applyManifestImages = applyImages;
})();
