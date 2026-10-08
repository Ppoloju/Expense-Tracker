export const CATEGORY_STYLES = {
  Food: 'border-[#bc6c25]/35 bg-[#f3e6d8] text-[#6b3f12] dark:bg-[#3a2a1a] dark:text-[#e9c9a8]',
  Travel: 'border-[#457b9d]/35 bg-[#e3edf3] text-[#1d4258] dark:bg-[#1e2f3a] dark:text-[#b8d4e8]',
  Bills: 'border-[#6d597a]/35 bg-[#ebe4ef] text-[#443651] dark:bg-[#2a2430] dark:text-[#d4c4de]',
  Entertainment: 'border-[#2d6a4f]/35 bg-[#dcebe3] text-[#1b4332] dark:bg-[#1b3328] dark:text-[#b7e4c7]',
  Other: 'border-[var(--border)] bg-[var(--inset)] text-[var(--text-primary)]',
}

export function categoryBadgeClass(category) {
  return `rounded-sm border px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[category] || CATEGORY_STYLES.Other}`
}
