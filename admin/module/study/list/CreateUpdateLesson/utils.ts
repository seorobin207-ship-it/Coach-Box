export const DEFAULT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQzMCIgdmlld0JveD0iMCAwIDcwMCA0MzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDMwIiBmaWxsPSIjRjNGNEY2Ii8+Cjxzdmcgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMzE4IiB5PSIxODMiPgo8cGF0aCBkPSJNNTYgNDhWMTZDNTYgMTMuNzkgNTQuMjEgMTIgNTIgMTJIMTJDOS43OSAxMiA4IDEzLjc5IDggMTZWNDhDOCA1MC4yMSA5Ljc5IDUyIDEyIDUySDUyQzU0LjIxIDUyIDU2IDUwLjIxIDU2IDQ4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTYgMzJDMTkuMzEzNyAzMiAyMiAyOS4zMTM3IDIyIDI2QzIyIDIyLjY4NjMgMTkuMzEzNyAyMCAxNiAyMEMxMi42ODYzIDIwIDEwIDIyLjY4NjMgMTAgMjZDMTAgMjkuMzEzNyAxMi42ODYzIDMyIDE2IDMyWiIgZmlsbD0iIzY3NzQ4QyIvPgo8cGF0aCBkPSJNOCA0OEw4IDQwTDE2IDMyTDI0IDQwSDMyTDQ4IDI0TDU2IDMyVjQ4SDhaIiBmaWxsPSIjNjc3NDhDIi8+Cjwvc3ZnPgo8L3N2Zz4K";

export const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  // If it's a base64 data URL or blob URL (from file upload), use as is
  if (image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  // If image is already a full URL, use as is
  if (image.startsWith("http")) {
    return image;
  }

  // If it's already a Cloudinary URL, avoid duplication
  if (image.includes("res.cloudinary.com")) {
    return image;
  }

  // If it looks like a Cloudinary path (starts with version number)
  if (image.match(/^v\d+\//)) {
    // This is a Cloudinary path, construct full URL
    return `${process.env.NEXT_PUBLIC_CLOUNDINARY_UPLOAD}/${image}`;
  }

  // If it's a relative path, construct it for local storage
  return image.startsWith("/") ? image : `/${image}`;
};
