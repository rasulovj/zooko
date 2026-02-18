const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

const UZ_MONTHS_SHORT = [
  "yan", "fev", "mar", "apr", "may", "iyn",
  "iyl", "avg", "sen", "okt", "noy", "dek",
];

const UZ_WEEKDAYS_SHORT = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

export function formatDate(date: string | Date, withTime = false) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  if (!withTime) return `${day}.${month}.${year}`;
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year}, ${h}:${m}`;
}

export function formatDateLong(date: string | Date) {
  const d = new Date(date);
  return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function getMonthName(date: Date, short = false) {
  return short ? UZ_MONTHS_SHORT[date.getMonth()] : UZ_MONTHS[date.getMonth()];
}

export function getWeekdayShort(date: Date) {
  return UZ_WEEKDAYS_SHORT[date.getDay()];
}
