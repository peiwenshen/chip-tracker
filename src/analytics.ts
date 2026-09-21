declare global {
  interface Window {
    gtag?: (
      command: "event",
      name: string,
    ) => void;
  }
}

export const trackTransfer = () => {
  window.gtag?.("event", "transfer_completed");
};
