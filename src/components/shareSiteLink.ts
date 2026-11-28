// V0 shares the site's own link only: the device's share sheet where there is one, else the clipboard.
export async function shareSiteLink() {
  const url = `${window.location.origin}/`;
  const { clipboard } = navigator;
  // Many desktop browsers have no share sheet, though the types say navigator.share always exists.
  if ("share" in navigator) {
    try {
      await navigator.share({ url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      throw error;
    }
  }
  await clipboard.writeText(url);
  return "copied";
}
