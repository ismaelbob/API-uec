const isGoogleDriveUrl = (value) => {
  if (typeof value !== 'string' || !value) return false;
  try {
    const url = new URL(value);
    return url.hostname === 'drive.google.com';
  } catch (error) {
    return false;
  }
};

const extractDriveFileId = (value) => {
  const fileMatch = value.match(/\/file\/d\/([\w-]+)/);
  if (fileMatch) return fileMatch[1];

  const idMatch = value.match(/[?&]id=([\w-]+)/);
  if (idMatch) return idMatch[1];

  return null;
};

const toDirectDriveUrl = (value) => {
  if (!isGoogleDriveUrl(value)) return value;

  const id = extractDriveFileId(value);
  if (!id) return value;

  return `https://drive.google.com/uc?export=view&id=${id}`;
};

module.exports = { toDirectDriveUrl };