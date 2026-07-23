"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GRID_PHOTOS, SPOTLIGHT_PHOTO, type Photo } from "@/lib/photos";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PhotoGalleryProps {
  onComplete: () => void;
}

// ─── Photo Card (grid item) ──────────────────────────────────────────────────

function PhotoCard({
  photo,
  onClick,
}: {
  photo: Photo;
  onClick: (photo: Photo) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layoutId={`photo-${photo.id}`}
      className="relative cursor-pointer rounded-2xl overflow-hidden group"
      style={{ aspectRatio: "4/5" }}
      onClick={() => onClick(photo)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Photo */}
      <Image
        src={photo.filename}
        alt={photo.hoverLabel}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Soft gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-rose/30 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Hover label pill */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <span
              className="inline-block px-3 py-1.5 rounded-full text-xs font-quicksand font-medium
                         bg-cream/90 text-rose shadow-md backdrop-blur-sm border border-blush/30
                         whitespace-nowrap"
            >
              {photo.hoverLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle inner border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
    </motion.div>
  );
}

// ─── Spotlight Photo (photo 11) ──────────────────────────────────────────────

function SpotlightCard({
  photo,
  onClick,
  viewed,
}: {
  photo: Photo;
  onClick: (photo: Photo) => void;
  viewed: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Section title */}
      <motion.p
        className="font-caveat text-2xl sm:text-3xl text-rose/70 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Our memories together 📸
      </motion.p>

      {/* Radial gold spotlight glow */}
      <div className="relative">
        <motion.div
          className="absolute -inset-8 sm:-inset-12 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(244,199,123,0.35) 0%, rgba(255,217,232,0.2) 40%, rgba(231,217,247,0.1) 65%, transparent 85%)",
          }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* The photo */}
        <motion.div
          layoutId={`photo-${photo.id}`}
          className="relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl mx-auto"
          style={{ width: "clamp(260px, 55vw, 420px)", aspectRatio: "4/5" }}
          onClick={() => onClick(photo)}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={photo.filename}
            alt={photo.hoverLabel}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 70vw, 420px"
            priority
          />

          {/* Gold rim */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: "2px solid rgba(244,199,123,0.4)",
              boxShadow: "inset 0 0 20px rgba(244,199,123,0.08)",
            }}
          />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-rose/25 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Hover label */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-quicksand font-medium
                             bg-cream/90 text-rose shadow-lg backdrop-blur-sm border border-gold/40
                             whitespace-nowrap"
                >
                  {photo.hoverLabel} ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "Tap to view" hint if not yet viewed */}
          {!viewed && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <span className="px-3 py-1 rounded-full text-xs font-quicksand bg-cream/80 text-rose/60 shadow-sm">
                tap to view
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Lightbox (enlarged photo + feeling) ─────────────────────────────────────

function Lightbox({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  const isSpotlight = photo.id === 12;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-rose/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 max-w-5xl w-full max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Enlarged photo */}
        <motion.div
          layoutId={`photo-${photo.id}`}
          className="relative rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
          style={{
            width: "clamp(280px, 45vw, 500px)",
            aspectRatio: "4/5",
          }}
        >
          <Image
            src={photo.filename}
            alt={photo.hoverLabel}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 80vw, 500px"
            priority
          />
          {isSpotlight && (
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ border: "2px solid rgba(244,199,123,0.5)" }}
            />
          )}
        </motion.div>

        {/* Feeling card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden max-w-md w-full"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div
            className="relative rounded-3xl px-8 py-10 shadow-xl border border-blush/20"
            style={{
              background:
                "linear-gradient(180deg, #FFF8F3 0%, #FFFAF6 40%, #FFF5EE 100%)",
            }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-3xl"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Label */}
            <p className="text-sm font-quicksand font-medium text-rose/40 mb-3 uppercase tracking-wider">
              {photo.hoverLabel}
            </p>

            {/* Feeling text */}
            <p className="font-caveat text-xl sm:text-2xl text-rose leading-relaxed">
              {photo.feeling}
            </p>

            {/* Panda emoji for photo 11 */}
            {isSpotlight && (
              <motion.div
                className="mt-4 text-3xl text-center"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🐼
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Close button */}
        <motion.button
          className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-10 h-10 rounded-full
                     bg-cream/80 backdrop-blur-sm flex items-center justify-center
                     text-rose/50 hover:text-rose hover:bg-cream transition-colors
                     shadow-md cursor-pointer border border-blush/20"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 2L12 12M12 2L2 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main PhotoGallery Component ─────────────────────────────────────────────

export default function PhotoGallery({ onComplete }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewedSpotlight, setViewedSpotlight] = useState(false);

  const handlePhotoClick = useCallback(
    (photo: Photo) => {
      setSelectedPhoto(photo);
      if (photo.id === 12) {
        setViewedSpotlight(true);
      }
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative flex flex-col items-center gap-10 text-center px-4 py-8 w-full"
    >
      {/* ── Spotlight photo 11 ── */}
      <SpotlightCard
        photo={SPOTLIGHT_PHOTO}
        onClick={handlePhotoClick}
        viewed={viewedSpotlight}
      />

      {/* ── Grid divider ── */}
      <motion.div
        className="flex items-center gap-3 w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blush/40 to-transparent" />
        <span className="font-caveat text-lg text-rose/40">more moments</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blush/40 to-transparent" />
      </motion.div>

      {/* ── Photo grid (photos 1-10) ── */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {GRID_PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
          >
            <PhotoCard photo={photo} onClick={handlePhotoClick} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox photo={selectedPhoto} onClose={handleClose} />
        )}
      </AnimatePresence>

      {/* ── Continue button (gated on viewing spotlight photo 11) ── */}
      <AnimatePresence>
        {viewedSpotlight && (
          <motion.div
            className="flex flex-col items-center gap-3 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.p
              className="font-caveat text-lg text-rose/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Every photo is a hug I get to keep 💛
            </motion.p>

            <motion.button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-full font-quicksand font-medium text-rose cursor-pointer
                         bg-blush/60 hover:bg-blush active:scale-95 transition-all duration-200
                         shadow-md hover:shadow-lg border border-blush/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Continue 💌
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
