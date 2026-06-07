const sections = document.querySelectorAll<HTMLElement>('[data-animate-section]');

sections.forEach(section => {
  const threshold = parseFloat(section.dataset.threshold ?? '0.1');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll<HTMLElement>('[data-animate]').forEach(el => {
        el.classList.remove('opacity-0');
        el.dataset.animate?.split(' ').forEach(c => c && el.classList.add(c));
      });
      observer.unobserve(entry.target);
    });
  }, { threshold });

  observer.observe(section);
});
