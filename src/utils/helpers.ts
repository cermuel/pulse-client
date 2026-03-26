export function timeAgo(dateStr: string, now = Date.now()) {
  const diff = now - parseBackendDate(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 1) return "0s ago";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function timeUntil(target: number, now = Date.now()) {
  const diff = target - now;
  if (diff <= 0) return "due now";
  const secs = Math.ceil(diff / 1000);
  if (secs < 60) return `in ${secs}s`;
  const mins = Math.ceil(secs / 60);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.ceil(mins / 60);
  return `in ${hrs}h`;
}

export function formatInterval(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds % 3600 === 0) return `${seconds / 3600}h`;
  if (seconds % 60 === 0) return `${seconds / 60}m`;
  return `${seconds}s`;
}

export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parseBackendDate(dateStr));
}

export function parseBackendDate(dateStr: string) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateStr);
  return new Date(hasTimezone ? dateStr : `${dateStr}Z`);
}
