import type { CareerStatus } from "@/app/careers/types";

type VacancyDeadline = {
  status: CareerStatus;
  closing_date: string | null;
};

function parsePlainDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (parsed.toISOString().slice(0, 10) !== value) return null;
  return { year, month, day, timestamp };
}

function getUtcToday(now: Date) {
  return parsePlainDate(now.toISOString().slice(0, 10));
}

export function isVacancyAcceptingApplications(
  vacancy: VacancyDeadline,
  now = new Date()
) {
  if (vacancy.status !== "open") return false;
  if (vacancy.closing_date === null) return true;

  const closingDate = parsePlainDate(vacancy.closing_date);
  const today = getUtcToday(now);

  return Boolean(
    closingDate && today && closingDate.timestamp >= today.timestamp
  );
}

export function getDaysRemaining(closingDate: string | null, now = new Date()) {
  if (closingDate === null) return null;

  const closing = parsePlainDate(closingDate);
  const today = getUtcToday(now);
  if (!closing || !today) return null;

  return Math.floor((closing.timestamp - today.timestamp) / 86_400_000);
}

export function formatCareerDate(value: string) {
  const date = parsePlainDate(value);
  if (!date) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date.timestamp));
}
