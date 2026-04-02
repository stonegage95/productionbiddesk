export function isEditorPreview() {
  if (typeof window === "undefined") return false;

  const { hostname } = window.location;

  return (
    hostname === "localhost" ||
    hostname.startsWith("id-preview--") ||
    hostname.endsWith(".lovableproject.com")
  );
}
