export function normalizeComponentName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Component";

  const parts = trimmed.split(/[\s-_]+/g).filter(Boolean);
  const pascal = parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

  return pascal || "Component";
}