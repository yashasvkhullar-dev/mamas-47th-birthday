import { create } from "zustand";

export const SECTION_ORDER = [
  "intro",
  "yesNoGate",
  "ageCounter",
  "lightsOn",
  "musicPlayer",
  "balloons",
  "loveLetter",
  "virtualHug",
  "photoGallery",
  "reasonsCards",
  "catchHeartsGame",
  "bakeCakeGame",
  "virtualGift",
  "floatingMessages3D",
  "tiramisuScene",
  "finale",
] as const;

export type SectionName = (typeof SECTION_ORDER)[number];

interface BirthdayState {
  /** Index of the current active step (0-based) */
  currentStep: number;
  /** Name of the current section */
  currentSection: SectionName;
  /** Visitor's name (collected during the experience) */
  visitorName: string;
  /** Whether the experience has started */
  hasStarted: boolean;
  /** Whether the pre-birthday countdown has completed */
  countdownComplete: boolean;

  /** Advance to the next step */
  goToNextStep: () => void;
  /** Jump to a specific step */
  goToStep: (step: number) => void;
  /** Set the visitor's name */
  setVisitorName: (name: string) => void;
  /** Mark the experience as started */
  startExperience: () => void;
  /** Mark countdown as complete */
  setCountdownComplete: () => void;
}

export const useBirthdayStore = create<BirthdayState>((set) => ({
  currentStep: 0,
  currentSection: SECTION_ORDER[0],
  visitorName: "",
  hasStarted: false,
  countdownComplete: false,

  goToNextStep: () =>
    set((state) => {
      const nextStep = Math.min(
        state.currentStep + 1,
        SECTION_ORDER.length - 1
      );
      return {
        currentStep: nextStep,
        currentSection: SECTION_ORDER[nextStep],
      };
    }),

  goToStep: (step: number) =>
    set(() => {
      const clampedStep = Math.max(
        0,
        Math.min(step, SECTION_ORDER.length - 1)
      );
      return {
        currentStep: clampedStep,
        currentSection: SECTION_ORDER[clampedStep],
      };
    }),

  setVisitorName: (name: string) => set({ visitorName: name }),

  startExperience: () => set({ hasStarted: true }),

  setCountdownComplete: () => set({ countdownComplete: true }),
}));
