export const getCurrentMondayISO = () => {
  const now = new Date();
  const day = now.getDay(); // 0=dim, 1=lun...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0]; // ex: "2026-06-09"
};