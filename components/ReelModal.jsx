"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  ArrowUpDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
} from "lucide-react";
import styles from "./ReelModal.module.css";

function getInstagramEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed/?autoplay=1`;
  }
  return null;
}

const isDirectVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return (
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) ||
    url.includes("ik.imagekit.io") ||
    !url.includes("instagram.com")
  );
};

export default function ReelModal({
  isOpen,
  onClose,
  reels = [],
  currentIndex = 0,
  onNavigate,
}) {
  const currentReel = reels[currentIndex];
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const modalRef = useRef(null);
  const videoRef = useRef(null);

  // Reel Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted to ensure 100% mobile autoplay compliance
  const [progress, setProgress] = useState(0);
  const [flashIcon, setFlashIcon] = useState(null); // 'play' | 'pause' | null
  const flashTimerRef = useRef(null);
  const lastToggleTimeRef = useRef(0);

  const triggerFlash = (type) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlashIcon(type);
    flashTimerRef.current = setTimeout(() => {
      setFlashIcon(null);
    }, 700);
  };

  // Autoplay & reset video state on reel change or modal open
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    const video = videoRef.current;

    setProgress(0);
    video.currentTime = 0;
    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy fallback: if unmuted autoplay is blocked on mobile, mute and retry
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        });
    }
  }, [currentIndex, isOpen]);

  // Video progress updater
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  // Tap to Play / Pause Toggle (Debounced to prevent touch/click bounce on mobile)
  const togglePlayPause = (e) => {
    if (e) {
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault && e.type === "touchend") e.preventDefault();
    }

    const now = Date.now();
    if (now - lastToggleTimeRef.current < 300) {
      return; // Ignore duplicate bounce events
    }
    lastToggleTimeRef.current = now;

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            triggerFlash("play");
          })
          .catch((err) => {
            console.warn("Play blocked or interrupted:", err);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
      triggerFlash("pause");
    }
  };

  // Mute / Unmute Toggle (Two-way synchronized with video DOM)
  const toggleMute = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Keyboard navigation with capture listener
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    const handleKeyCapture = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
        return;
      }
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "PageDown"
      ) {
        e.preventDefault();
        if (currentIndex < reels.length - 1) {
          onNavigate(currentIndex + 1);
        }
        return;
      }
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlayPause(e);
        return;
      }
      if (e.key === "m") {
        e.preventDefault();
        toggleMute(e);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyCapture, true);
    return () => {
      clearTimeout(timer);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyCapture, true);
    };
  }, [isOpen, currentIndex, reels.length, isMuted, onClose, onNavigate]);

  // Touch gesture handlers (Fast Tap detection + Swipe Up/Down / Left/Right)
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const minDistance = 45;

    // Instant Mobile Tap: If finger movement is minimal and short duration, handle play/pause immediately
    if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15 && deltaTime < 350) {
      const target = e.target;
      const isTopBar = target && target.closest(`.${styles.modalTopBar}`);
      const isBottomBar = target && target.closest(`.${styles.bottomBar}`);
      const isNavBtn = target && target.closest(`.${styles.navBtn}`);

      if (!isTopBar && !isBottomBar && !isNavBtn && isDirect) {
        togglePlayPause(e);
      }
      return;
    }

    // Vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -minDistance) {
        // Swiped UP -> Next Reel
        if (currentIndex < reels.length - 1) {
          onNavigate(currentIndex + 1);
        }
      } else if (deltaY > minDistance) {
        // Swiped DOWN -> Previous Reel
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        } else {
          onClose();
        }
      }
    } else {
      // Horizontal swipe
      if (deltaX < -minDistance) {
        // Swiped LEFT -> Next Reel
        if (currentIndex < reels.length - 1) {
          onNavigate(currentIndex + 1);
        }
      } else if (deltaX > minDistance) {
        // Swiped RIGHT -> Previous Reel
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      }
    }
  };

  if (!isOpen || !currentReel) return null;

  const isDirect = isDirectVideoUrl(currentReel.url);
  const embedUrl = isDirect ? null : getInstagramEmbedUrl(currentReel.url);
  const displayLabel = currentReel.label || `Heena Marble Masterpiece`;

  const whatsappMessage = encodeURIComponent(
    `Hi Heena Marble, I saw your reel "${displayLabel}" on your website and would like to enquire about this marble design & pricing.`
  );
  const whatsappUrl = `https://wa.me/918769386438?text=${whatsappMessage}`;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Desktop Prev Arrow */}
      {currentIndex > 0 && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.prevBtn}`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          aria-label="Previous Reel (Left Arrow / Up Arrow)"
          title="Previous (← / ↑)"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={0}
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Progress Bar (Reels Style) */}
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Floating Top Bar with Counter, Swipe Hint, Audio Toggle & Close */}
        <div className={styles.modalTopBar}>
          <div className={styles.topBadgeGroup}>
            <span className={styles.counterBadge}>
              {currentIndex + 1} / {reels.length}
            </span>
            <span className={styles.swipeHint}>
              <ArrowUpDown size={11} />
              Swipe
            </span>
          </div>

          <div
            className="flex items-center gap-2 pointer-events-auto"
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Dedicated Play / Pause Button */}
            {isDirect && (
              <button
                type="button"
                onClick={togglePlayPause}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  togglePlayPause(e);
                }}
                className={styles.iconBtn}
                title={isPlaying ? "Pause Video (Space)" : "Play Video (Space)"}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} className="translate-x-0.5 fill-current" />
                )}
              </button>
            )}

            {/* Audio Mute / Unmute Button */}
            {isDirect && (
              <button
                type="button"
                onClick={toggleMute}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className={styles.iconBtn}
                title={isMuted ? "Unmute Audio (M)" : "Mute Audio (M)"}
                aria-label="Toggle Sound"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className={styles.closeBtn}
              aria-label="Close modal (Esc)"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Frame Area */}
        <div
          className={styles.videoWrapper}
          onClick={isDirect ? togglePlayPause : undefined}
        >
          {isDirect ? (
            <>
              <video
                ref={videoRef}
                key={currentReel.url}
                src={currentReel.url}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() => {
                  if (videoRef.current) {
                    setIsMuted(videoRef.current.muted);
                  }
                }}
                onTimeUpdate={handleTimeUpdate}
                className={styles.nativeVideo}
              />

              {/* Persistent Center Play Button when Paused */}
              {!isPlaying && !flashIcon && (
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className={styles.pausedCenterBtn}
                  aria-label="Play video"
                  title="Play"
                >
                  <Play size={38} className="text-white fill-white translate-x-0.5" />
                </button>
              )}

              {/* Animated Center Play/Pause Flash Indicator on Tap */}
              {flashIcon && (
                <div className={styles.playStateOverlay} aria-hidden="true">
                  {flashIcon === "play" ? (
                    <Play size={44} className="text-white fill-white drop-shadow-lg" />
                  ) : (
                    <Pause size={44} className="text-white fill-white drop-shadow-lg" />
                  )}
                </div>
              )}
            </>
          ) : embedUrl ? (
            <div className={styles.iframeCropWrapper}>
              <iframe
                key={embedUrl}
                src={embedUrl}
                className={styles.modalIframe}
                allowFullScreen
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={displayLabel}
              />
            </div>
          ) : (
            <div className="text-white text-center p-8">Video unavailable</div>
          )}
        </div>

        {/* Bottom Floating Action Strip */}
        <div
          className={styles.bottomBar}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b38b4d] mb-0.5">
              <Sparkles size={11} />
              <span>HEENA MARBLE CRAFT</span>
            </div>
            <p className={styles.reelLabel} title={displayLabel}>
              {displayLabel}
            </p>
          </div>

          <div className={styles.ctaGroup}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <MessageCircle size={15} />
              <span>Enquire</span>
            </a>

            <a
              href={
                isDirect
                  ? "https://www.instagram.com/heena_marble/"
                  : currentReel.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instaBtn}
              title="Official Instagram Profile"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Desktop Next Arrow */}
      {currentIndex < reels.length - 1 && (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          aria-label="Next Reel (Right Arrow / Down Arrow)"
          title="Next (→ / ↓ / Space)"
        >
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  );
}
