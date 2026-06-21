// "Mon nom::https://...mp3" -> { label: "Mon nom", url: "https://...mp3" }
// "https://...mp3" -> { label: "", url: "https://...mp3" }
export const parseListenQuestion = (value: string) => {
  if (!value) return { label: "", url: "" };
  const idx = value.indexOf("::");
  if (idx === -1) return { label: "", url: value };
  return { label: value.slice(0, idx), url: value.slice(idx + 2) };
};

export const buildListenQuestion = (label: string, url: string) =>
  label.trim() ? `${label.trim()}::${url}` : url;