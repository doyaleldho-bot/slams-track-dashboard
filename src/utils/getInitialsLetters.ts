export const getInitials = (name?: string) => {
  if (!name) return "U"

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
