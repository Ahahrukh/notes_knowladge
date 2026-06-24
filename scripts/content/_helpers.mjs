// Content block helpers — keeps seed files compact and readable.
export const T = (value) => ({ type: "text", value });
export const H = (value, level = 2) => ({ type: "heading", value, level });
export const C = (language, value, explanation) => ({
  type: "code",
  language,
  value,
  explanation,
});
export const N = (value) => ({ type: "note", value });
export const L = (items, ordered = false) => ({ type: "list", items, ordered });
