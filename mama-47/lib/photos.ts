// ─── Photo Data ──────────────────────────────────────────────────────────────

export interface Photo {
  id: number;
  filename: string;
  hoverLabel: string;
  feeling: string;
}

export const PHOTOS: Photo[] = [
  {
    id: 1,
    filename: "/photos/photo-01.jpg",
    hoverLabel: "Us meeting for the first time",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 2,
    filename: "/photos/photo-02.jpg",
    hoverLabel: "My beautiful Mom",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 3,
    filename: "/photos/photo-03.jpg",
    hoverLabel: "Sleeping peacefully, no care in the world",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 4,
    filename: "/photos/photo-04.jpg",
    hoverLabel: "Us winning the baby show",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 5,
    filename: "/photos/photo-05.jpg",
    hoverLabel: "Our first win",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 6,
    filename: "/photos/photo-06.jpg",
    hoverLabel: "My Mom always holding me close",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 7,
    filename: "/photos/photo-07.jpg",
    hoverLabel: "Our first vacation together",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 8,
    filename: "/photos/photo-08.jpg",
    hoverLabel: "Our matching smiles",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 9,
    filename: "/photos/photo-09.jpg",
    hoverLabel: "My first dance",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 10,
    filename: "/photos/photo-10.jpg",
    hoverLabel: "Us getting mehndi together",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 11,
    filename: "/photos/photo-11.jpg",
    hoverLabel: "Our favourite vacation",
    feeling:
      "One of my favorite moments with you — I'll write the full story here soon. 💗",
  },
  {
    id: 12,
    filename: "/photos/photo-12.jpg",
    hoverLabel: "Our most timeless moment",
    feeling:
      "This one means the most to me. I'll tell you exactly why, right here. 🐼💗",
  },
];

/** Grid photos (1-11) */
export const GRID_PHOTOS = PHOTOS.filter((p) => p.id !== 12);

/** The special spotlighted photo */
export const SPOTLIGHT_PHOTO = PHOTOS.find((p) => p.id === 12)!;
