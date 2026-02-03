import placeholder from "../assets/cover-placeholder.svg";

const OPENLIBRARY_BASE = "https://covers.openlibrary.org/b";

export { placeholder };
/**
 * Resolve the correct cover image URL for a book.
 * Safe against bad data, string IDs, and Open Library edge cases.
 */
export const getCoverUrl = (
  { cover_source, cover_id, cover_url },
  size = "M",
) => {
  // 1️⃣ User-uploaded covers (Cloudinary, etc.)
  if (cover_source === "cloudinary" && cover_url) {
    return cover_url;
  }

  // 2️⃣ Open Library covers (ID key)
  if (cover_source === "openlibrary") {
    const numericId = Number(cover_id);

    // cover_id = -1, 0, NaN → no cover
    if (Number.isInteger(numericId) && numericId > 0) {
      return `${OPENLIBRARY_BASE}/id/${numericId}-${size}.jpg`;
    }
  }

  // 3️⃣ Fallback
  return placeholder;
};
