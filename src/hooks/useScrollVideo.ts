import { useEffect, useState, type RefObject } from "react";
import { useLenis } from "../lib/lenis";

export interface ScrollVideoOptions {
  /** Turn scrubbing on/off (e.g. off on mobile or with reduced motion). */
  enabled?: boolean;
  /** How quickly the video catches up to the scroll position each frame (0–1). Lower = smoother/laggier. */
  smoothing?: number;
  /**
   * Progress points (0–1) the component cares about. `milestone` reports how many
   * have been passed, so React only re-renders when one is crossed, not every frame.
   */
  milestones?: readonly number[];
  /** CSS custom property written on the section with the live progress (0–1). */
  progressVar?: string;
}

export interface ScrollVideoState {
  /** True once video metadata has loaded and scrubbing can start. */
  isReady: boolean;
  /** Number of `milestones` passed at the current scroll position. */
  milestone: number;
}

const MIN_SEEK_DELTA = 1 / 60;
const SETTLE_EPSILON = 0.001;
const NO_MILESTONES: readonly number[] = [];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Pins a video's playback position to scroll progress through `sectionRef`.
 * Progress is 0 when the section's top hits the viewport top and 1 when its
 * bottom reaches the viewport bottom. Live progress is written to a CSS
 * variable on the section so text/overlays can animate without re-renders.
 */
export function useScrollVideo(
  sectionRef: RefObject<HTMLElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  {
    enabled = true,
    smoothing = 0.12,
    milestones = NO_MILESTONES,
    progressVar = "--scroll-progress",
  }: ScrollVideoOptions = {},
): ScrollVideoState {
  const lenis = useLenis();
  const [isReady, setIsReady] = useState(false);
  const [milestone, setMilestone] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!enabled || !section || !video) return;

    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;
    let rafId = 0;
    let lastMilestone = -1;

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      return scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;
    };

    const tick = () => {
      rafId = 0;
      if (!duration) return;

      currentTime += (targetTime - currentTime) * smoothing;
      if (Math.abs(targetTime - currentTime) < SETTLE_EPSILON) currentTime = targetTime;

      // Only seek when the change is visible, and never queue a seek on top of one in flight.
      if (!video.seeking && Math.abs(currentTime - video.currentTime) > MIN_SEEK_DELTA) {
        video.currentTime = currentTime;
      }

      if (currentTime !== targetTime) rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const update = () => {
      const progress = readProgress();
      section.style.setProperty(progressVar, progress.toFixed(4));

      const passed = milestones.filter((m) => progress >= m).length;
      if (passed !== lastMilestone) {
        lastMilestone = passed;
        setMilestone(passed);
      }

      if (duration) {
        // Stop just short of the end so the last frame stays decoded on Safari.
        targetTime = Math.min(progress * duration, duration - 0.05);
        startLoop();
      }
    };

    const onMetadata = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (!duration) return;
      currentTime = video.currentTime;
      setIsReady(true);
      update();
    };

    // iOS/Safari won't render seeks until the video has played once after a user gesture.
    const unlockEvents = ["touchstart", "pointerdown", "keydown"] as const;
    const unlock = () => {
      removeUnlock();
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };
    const removeUnlock = () => {
      unlockEvents.forEach((e) => window.removeEventListener(e, unlock));
    };
    unlockEvents.forEach((e) => window.addEventListener(e, unlock, { once: true, passive: true }));

    video.pause();
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();
    else video.addEventListener("loadedmetadata", onMetadata);

    // Use Lenis's scroll event when available; fall back to native scroll only if Lenis isn't running.
    const unsubscribeScroll = lenis
      ? lenis.on("scroll", update)
      : (() => {
          window.addEventListener("scroll", update, { passive: true });
          return () => window.removeEventListener("scroll", update);
        })();
    window.addEventListener("resize", update);
    update();

    return () => {
      unsubscribeScroll();
      window.removeEventListener("resize", update);
      video.removeEventListener("loadedmetadata", onMetadata);
      removeUnlock();
      if (rafId) cancelAnimationFrame(rafId);
      section.style.removeProperty(progressVar);
      setIsReady(false);
    };
  }, [enabled, lenis, milestones, progressVar, sectionRef, smoothing, videoRef]);

  return { isReady: enabled && isReady, milestone: enabled ? milestone : 0 };
}
