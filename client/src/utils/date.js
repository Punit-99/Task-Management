export const formatDisplayDate = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

export const parseDisplayDate = (displayDate) => {
  if (!displayDate) return "";
  const [day, month, year] = displayDate.split("-");
  const fullYear = `20${year}`;
  return `${fullYear}-${month}-${day}`;
};
