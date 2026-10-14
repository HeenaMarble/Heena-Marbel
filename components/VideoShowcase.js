'use client';

import { useEffect, useRef, useState } from 'react';
import { Blocks, CircleDotDashed, Gem, Hammer, Mountain, ScanLine } from 'lucide-react';
import styles from './VideoShowcase.module.css';

const JOURNEY_STEPS = [
  {
    title: 'Marble Extraction',
    label: 'The Origin',
    description: 'Where exceptional Makrana marble is carefully selected at its source.',
    icon: Mountain,
    video: '/Steps_involved/0 To 25Sec.mp4',
    poster: '/Steps_involved/thumbnails/step-1.jpg',
  },
  {
    title: 'Marble Cutting',
    label: 'First Form',
    description: 'Raw stone is sized and prepared with precision for the work ahead.',
    icon: CircleDotDashed,
    video: '/Steps_involved/2 ; 23Min To 4.19Min.mp4',
    poster: '/Steps_involved/thumbnails/step-2.jpg',
  },
  {
    title: 'Marble Carving',
    label: 'Artisan Detail',
    description: 'Skilled hands bring depth, character, and intricate detail to every surface.',
    icon: Hammer,
    video: '/Steps_involved/4 ; 57Min To 5.1Min.mp4',
    poster: '/Steps_involved/thumbnails/step-3.jpg',
  },
  {
    title: 'Marble CNC Work',
    label: 'Modern Precision',
    description: 'Advanced technology ensures unmatched accuracy and consistency.',
    icon: ScanLine,
    video: '/Steps_involved/5 ; 09Min To 5.29Min.mp4',
    poster: '/Steps_involved/thumbnails/step-4.jpg',
  },
  {
    title: 'Marble Installation',
    label: 'Perfect Placement',
    description: 'Expert installation brings each piece together with care and precision.',
    icon: Blocks,
    video: '/Steps_involved/5 ; 53Min To 6.50Min.mp4',
    poster: '/Steps_involved/thumbnails/step-5.jpg',
  },
  {
    title: 'Completion',
    label: 'The Masterpiece',
    description: 'A timeless work of art, ready to be admired for generations.',
    icon: Gem,
    video: '/Steps_involved/7 ; 33Min To 8.25Min.mp4',
    poster: '/Steps_involved/thumbnails/step-6.jpg',
  },
];

export default function VideoShowcase({ videos }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isPhone, setIsPhone] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const journeySteps = JOURNEY_STEPS.map((step, index) => {
    const configuredVideo = videos?.find(
      (video) => Number(video.display_order) === index + 1 && video.url,
    );

    return configuredVideo ? { ...step, video: configuredVideo.url } : step;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 620px)');
    const updatePhoneState = () => setIsPhone(mediaQuery.matches);

    updatePhoneState();
    mediaQuery.addEventListener('change', updatePhoneState);
    return () => mediaQuery.removeEventListener('change', updatePhoneState);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let revealTimer;
    section.classList.add(styles.motionReady);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add(styles.isVisible);
          revealTimer = window.setTimeout(() => {
            section.classList.remove(styles.motionReady, styles.isVisible);
          }, 1050);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearTimeout(revealTimer);
    };
  }, []);

  const pauseOtherVideos = (selectedIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== selectedIndex && !video.paused) {
        video.pause();
      }
    });
  };

  const playVideo = (index) => {
    const video = videoRefs.current[index];
    if (!video) {
      return;
    }

    pauseOtherVideos(index);
    setPlaybackError(null);
    setActiveVideo(index);

    const playback = video.play();
    if (playback) {
      playback.catch(() => {
        setActiveVideo(null);
        setPlayingVideo(null);
        setPlaybackError(index);
      });
    }
  };

  const togglePlayback = (index) => {
    const video = videoRefs.current[index];
    if (!video) {
      return;
    }

    if (video.paused || video.ended) {
      playVideo(index);
      return;
    }

    video.pause();
  };

  return (
    <section ref={sectionRef} className={`section ${styles.videoSection}`} aria-labelledby="journey-title">
      <div className={`container ${styles.sectionInner}`}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>The Art of Creation</span>
          <h2 id="journey-title" className={styles.heading}>From Quarry to Masterpiece</h2>
          <p className={styles.intro}>
            Witness the remarkable journey of Makrana marble &mdash; from raw stone shaped by nature
            to a finished work of enduring beauty, crafted with heritage, skill and modern precision.
          </p>
        </header>

        <div className={styles.railScroller}>
          <ol className={styles.journeyRail} aria-label="Marble craftsmanship journey">
            {journeySteps.map((step, index) => {
              const StepIcon = step.icon;

              return (
                <li key={step.title} className={styles.railStep}>
                  <span className={styles.railIcon} aria-hidden="true">
                    <StepIcon strokeWidth={1.6} />
                  </span>
                  <span className={styles.railNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.railLabel}>{step.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className={styles.videoGrid}>
          {journeySteps.map((step, index) => {
            const isActive = activeVideo === index;
            const isPlaying = playingVideo === index;
            const hasError = playbackError === index;

            return (
              <article
                key={step.title}
                className={`${styles.videoCard} ${isActive ? styles.isPlaying : ''}`}
                style={{ '--step-delay': `${index * 70}ms` }}
              >
                <div className={styles.media}>
                  <video
                    ref={(video) => {
                      videoRefs.current[index] = video;
                    }}
                    className={styles.video}
                    poster={step.poster}
                    preload="none"
                    playsInline
                    controls={isActive && !isPhone}
                    onPlay={() => {
                      pauseOtherVideos(index);
                      setPlaybackError(null);
                      setActiveVideo(index);
                      setPlayingVideo(index);
                    }}
                    onPause={() => setPlayingVideo((current) => (current === index ? null : current))}
                    onEnded={() => setPlayingVideo((current) => (current === index ? null : current))}
                  >
                    <source src={step.video} type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>

                  {!isActive && (
                    <button
                      type="button"
                      className={styles.playButton}
                      onClick={() => playVideo(index)}
                      aria-label={`Play ${step.title} video`}
                    >
                      <span className={styles.playIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path d="M8.25 5.55v12.9L18.6 12 8.25 5.55Z" />
                        </svg>
                      </span>
                      <span className={styles.playText}>Watch process</span>
                    </button>
                  )}

                  {isActive && (
                    <button
                      type="button"
                      className={`${styles.playButton} ${styles.mobilePlaybackButton}`}
                      onClick={() => togglePlayback(index)}
                      aria-label={`${isPlaying ? 'Pause' : 'Play'} ${step.title} video`}
                    >
                      <span className={styles.playIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          {isPlaying ? (
                            <path d="M6.75 5h4.5v14h-4.5V5Zm6 0h4.5v14h-4.5V5Z" />
                          ) : (
                            <path d="M8.25 5.55v12.9L18.6 12 8.25 5.55Z" />
                          )}
                        </svg>
                      </span>
                    </button>
                  )}

                  <span className={styles.stepBadge}>{String(index + 1).padStart(2, '0')}</span>
                  <div className={styles.mediaShade} aria-hidden="true" />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeading}>
                    <span className={styles.cardLabel}>{step.label}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.description}</p>
                  {hasError && (
                    <p className={styles.errorMessage} role="alert">
                      Playback could not start. Please try the play button again.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
