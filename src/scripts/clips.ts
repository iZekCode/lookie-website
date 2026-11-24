// Plays each screen recording only while it is on screen. With reduced motion the first frame stays as a still picture.
export function initClips() {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-clip]');
  if (!videos.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    },
    { threshold: 0.35 },
  );
  videos.forEach((video) => watcher.observe(video));
}
