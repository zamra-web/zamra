export function initSiteChrome(options = {}) {
  const { enableSmoothScroll = true } = options;
  const header = document.getElementById('header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.setAttribute('aria-controls', 'nav-menu');

    const icon = mobileToggle.querySelector('i');
    const setIcon = (open) => {
      if (!icon) return;
      icon.classList.toggle('bi-x-lg', open);
      icon.classList.toggle('bi-list', !open);
    };

    const setState = (open) => {
      navMenu.classList.toggle('active', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      setIcon(open);
      document.body.classList.toggle('nav-open', open);
    };

    setState(navMenu.classList.contains('active'));

    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      setState(!navMenu.classList.contains('active'));
    });

    navMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setState(false);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        setState(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setState(false);
    });

    const onResize = () => {
      if (window.innerWidth >= 768) setState(false);
    };
    window.addEventListener('resize', onResize, { passive: true });
  }

  if (enableSmoothScroll) {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();

            const headerOffset = (header?.offsetHeight || 80) + 8;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            });

            window.history.pushState(null, '', targetId);
          }
        }
      });
    });
  }
}
