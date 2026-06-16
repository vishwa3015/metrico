export type ReviewStatus = "approved" | "pending" | "flagged" | "rejected";
export type RangeStatus = "in_range" | "out_of_range" | "needs_attention" | "invalid";
export type DeviceStatus = "online" | "offline" | "maintenance";

export interface TestResult {
  id: string;
  timestamp: string;
  site: string;
  operator: string;
  device: string;
  hocl: number | null;
  hoclStatus: RangeStatus;
  /** @deprecated — use hoclYellow + hoclBlue pads */
  hoclColor: string;
  hoclYellow: string;
  hoclBlue: string;
  ph: number | null;
  phStatus: RangeStatus;
  phColor: string;
  review: ReviewStatus;
  cartridgeLot: string;
  notes?: string;
}

export const results: TestResult[] = [
  { id: "MTR-10428", timestamp: "2026-06-09 09:14", site: "Plant A — Line 2", operator: "J. Okafor", device: "MTR-D-014", hocl: 1.82, hoclStatus: "in_range",       hoclColor: "#f4c95d", hoclYellow: "#f4c95d", hoclBlue: "#5b9fd6", ph: 7.1, phStatus: "in_range",       phColor: "#9cc7a0", review: "approved", cartridgeLot: "LOT-22A-0418" },
  { id: "MTR-10427", timestamp: "2026-06-09 08:52", site: "Plant A — Line 1", operator: "M. Reyes",  device: "MTR-D-012", hocl: 0.42, hoclStatus: "out_of_range",   hoclColor: "#fde9b8", hoclYellow: "#fde9b8", hoclBlue: "#bcd9ec", ph: 6.4, phStatus: "needs_attention", phColor: "#d2e2b1", review: "flagged",  cartridgeLot: "LOT-22A-0418", notes: "Re-test required" },
  { id: "MTR-10426", timestamp: "2026-06-09 08:31", site: "Plant B — Cold Room", operator: "S. Müller", device: "MTR-D-021", hocl: 2.05, hoclStatus: "in_range",   hoclColor: "#e8b94a", hoclYellow: "#e8b94a", hoclBlue: "#3f86c2", ph: 7.4, phStatus: "in_range",       phColor: "#7fb589", review: "approved", cartridgeLot: "LOT-22A-0419" },
  { id: "MTR-10425", timestamp: "2026-06-09 08:10", site: "Plant B — Prep",     operator: "S. Müller", device: "MTR-D-021", hocl: 1.61, hoclStatus: "in_range",   hoclColor: "#f1c25a", hoclYellow: "#f1c25a", hoclBlue: "#5293ce", ph: 7.0, phStatus: "in_range",       phColor: "#9cc7a0", review: "pending",  cartridgeLot: "LOT-22A-0419" },
  { id: "MTR-10424", timestamp: "2026-06-09 07:48", site: "Plant C — Pack",     operator: "A. Chen",   device: "MTR-D-007", hocl: 3.14, hoclStatus: "out_of_range", hoclColor: "#c98a2b", hoclYellow: "#c98a2b", hoclBlue: "#1f5f97", ph: 8.1, phStatus: "out_of_range",  phColor: "#4f8a5c", review: "flagged",  cartridgeLot: "LOT-22A-0411", notes: "Above max threshold" },
  { id: "MTR-10423", timestamp: "2026-06-09 07:22", site: "Plant A — Line 2",   operator: "J. Okafor", device: "MTR-D-014", hocl: null, hoclStatus: "invalid",      hoclColor: "#e6e6e6", hoclYellow: "#e6e6e6", hoclBlue: "#e6e6e6", ph: null, phStatus: "invalid",       phColor: "#e6e6e6", review: "rejected", cartridgeLot: "LOT-22A-0418", notes: "Cartridge read error" },
  { id: "MTR-10422", timestamp: "2026-06-08 18:02", site: "Plant A — Line 1",   operator: "M. Reyes",  device: "MTR-D-012", hocl: 1.75, hoclStatus: "in_range",     hoclColor: "#f4c95d", hoclYellow: "#f4c95d", hoclBlue: "#5b9fd6", ph: 6.9, phStatus: "needs_attention", phColor: "#cfe0ad", review: "pending", cartridgeLot: "LOT-22A-0417" },
  { id: "MTR-10421", timestamp: "2026-06-08 17:41", site: "Plant C — Pack",     operator: "A. Chen",   device: "MTR-D-007", hocl: 1.93, hoclStatus: "in_range",     hoclColor: "#eebd4f", hoclYellow: "#eebd4f", hoclBlue: "#4a8fcb", ph: 7.2, phStatus: "in_range",       phColor: "#8fc095", review: "approved", cartridgeLot: "LOT-22A-0411" },
  { id: "MTR-10420", timestamp: "2026-06-08 16:33", site: "Plant B — Cold Room",operator: "S. Müller", device: "MTR-D-021", hocl: 2.18, hoclStatus: "in_range",     hoclColor: "#e3b245", hoclYellow: "#e3b245", hoclBlue: "#3279bb", ph: 7.5, phStatus: "in_range",       phColor: "#7fb589", review: "approved", cartridgeLot: "LOT-22A-0419" },
  { id: "MTR-10419", timestamp: "2026-06-08 15:11", site: "Plant A — Line 2",   operator: "J. Okafor", device: "MTR-D-014", hocl: 1.55, hoclStatus: "in_range",     hoclColor: "#f1c25a", hoclYellow: "#f1c25a", hoclBlue: "#5293ce", ph: 7.0, phStatus: "in_range",       phColor: "#9cc7a0", review: "approved", cartridgeLot: "LOT-22A-0418" },
];

export const devices: { name: string; id: string; site: string; firmware: string; lastSync: string; status: DeviceStatus; cartridgeLot: string }[] = [
  { name: "Pack Line Tester",     id: "MTR-D-007", site: "Plant C — Pack",      firmware: "2.4.1", lastSync: "3 min ago",  status: "online",      cartridgeLot: "LOT-22A-0411" },
  { name: "Line 1 Tester",        id: "MTR-D-012", site: "Plant A — Line 1",    firmware: "2.4.1", lastSync: "8 min ago",  status: "online",      cartridgeLot: "LOT-22A-0418" },
  { name: "Line 2 Tester",        id: "MTR-D-014", site: "Plant A — Line 2",    firmware: "2.4.0", lastSync: "12 min ago", status: "online",      cartridgeLot: "LOT-22A-0418" },
  { name: "Receiving Bay Tester", id: "MTR-D-018", site: "Plant B — Receiving", firmware: "2.3.9", lastSync: "4 hr ago",   status: "offline",     cartridgeLot: "LOT-22A-0402" },
  { name: "Cold Room Tester",     id: "MTR-D-021", site: "Plant B — Cold Room", firmware: "2.4.1", lastSync: "5 min ago",  status: "online",      cartridgeLot: "LOT-22A-0419" },
  { name: "QA Lab Tester",        id: "MTR-D-024", site: "Plant C — QA Lab",    firmware: "2.4.1", lastSync: "1 day ago",  status: "maintenance", cartridgeLot: "—" },
];

export type UserRole = "Testing Staff" | "Supervisor" | "Facility Admin";
export type UserStatus = "active" | "invited" | "deactivated";

export const users: { name: string; email: string; role: UserRole; facility: string; status: UserStatus; last: string }[] = [
  { name: "Avery Thompson",  email: "avery.t@metrico.io",  role: "Facility Admin", facility: "All facilities", status: "active",      last: "Active now" },
  { name: "Maria Reyes",     email: "m.reyes@metrico.io",  role: "Supervisor",     facility: "Plant A",        status: "active",      last: "1 hr ago" },
  { name: "Priya Natarajan", email: "p.nat@metrico.io",    role: "Supervisor",     facility: "All facilities", status: "active",      last: "Yesterday" },
  { name: "Jamal Okafor",    email: "j.okafor@metrico.io", role: "Testing Staff",  facility: "Plant A",        status: "active",      last: "12 min ago" },
  { name: "Sven Müller",     email: "s.muller@metrico.io", role: "Testing Staff",  facility: "Plant B",        status: "active",      last: "20 min ago" },
  { name: "Ada Chen",        email: "a.chen@metrico.io",   role: "Testing Staff",  facility: "Plant C",        status: "active",      last: "2 hr ago" },
  { name: "Devon Wright",    email: "d.wright@metrico.io", role: "Testing Staff",  facility: "Plant C",        status: "invited",     last: "Invite pending" },
  { name: "Lucia Romero",    email: "l.romero@metrico.io", role: "Supervisor",     facility: "Plant B",        status: "deactivated", last: "14 days ago" },
];

export type AuditAction =
  | "Threshold range updated"
  | "Report exported"
  | "User added"
  | "Device added"
  | "User deactivated"
  | "Device renamed"
  | "Password reset";

export type AuditRecordType = "Threshold" | "Report" | "User" | "Device";

export const auditLog: {
  ts: string;
  user: string;
  action: AuditAction;
  recordType: AuditRecordType;
  details: string;
  ip: string;
  device: string;
}[] = [
  { ts: "2026-06-09 09:18", user: "Avery Thompson",  action: "Threshold range updated", recordType: "Threshold", details: "HOCl 50–80 ppm → 50–100 ppm",                       ip: "10.14.22.41",  device: "Chrome 126 · macOS" },
  { ts: "2026-06-09 08:42", user: "Priya Natarajon", action: "Report exported",         recordType: "Report",    details: "Weekly compliance — Plant A (PDF, 142 records)",    ip: "10.14.22.18",  device: "Safari 17 · iPadOS" },
  { ts: "2026-06-08 17:11", user: "Avery Thompson",  action: "User added",              recordType: "User",      details: "ada.chen@metrico.io · role: Testing Staff",         ip: "10.14.22.41",  device: "Chrome 126 · macOS" },
  { ts: "2026-06-08 14:02", user: "Maria Reyes",     action: "Device added",            recordType: "Device",    details: "Pack Line Tester (MTR-D-007) · firmware v2.4.1",    ip: "10.14.40.92",  device: "Edge 124 · Windows 11" },
  { ts: "2026-06-08 11:30", user: "Avery Thompson",  action: "Device renamed",          recordType: "Device",    details: "MTR-D-014: \"Plant A Line 2\" → \"Line 2 Tester\"",   ip: "10.14.22.41",  device: "Chrome 126 · macOS" },
  { ts: "2026-06-07 16:48", user: "Avery Thompson",  action: "User deactivated",        recordType: "User",      details: "l.romero@metrico.io · removed Plant B access",      ip: "10.14.22.41",  device: "Chrome 126 · macOS" },
  { ts: "2026-06-07 09:05", user: "Maria Reyes",     action: "Password reset",          recordType: "User",      details: "j.okafor@metrico.io · reset link sent",             ip: "10.14.40.92",  device: "Edge 124 · Windows 11" },
  { ts: "2026-06-06 18:22", user: "Priya Natarajan", action: "Report exported",         recordType: "Report",    details: "Audit pack — Q2 2026 (PDF, 4.6 MB)",                ip: "10.14.22.18",  device: "Safari 17 · iPadOS" },
  { ts: "2026-06-06 10:14", user: "Avery Thompson",  action: "Threshold range updated", recordType: "Threshold", details: "pH 6.0–8.0 → 5.5–8.0",                              ip: "10.14.22.41",  device: "Chrome 126 · macOS" },
];

export const kpiTrend = [
  { d: "Mon", inRange: 88, outOfRange: 6 },
  { d: "Tue", inRange: 92, outOfRange: 4 },
  { d: "Wed", inRange: 84, outOfRange: 9 },
  { d: "Thu", inRange: 90, outOfRange: 5 },
  { d: "Fri", inRange: 94, outOfRange: 3 },
  { d: "Sat", inRange: 86, outOfRange: 7 },
  { d: "Sun", inRange: 91, outOfRange: 4 },
];

export const hoclTrend = [
  { t: "06:00", v: 1.85 },
  { t: "08:00", v: 1.92 },
  { t: "10:00", v: 2.10 },
  { t: "12:00", v: 1.74 },
  { t: "14:00", v: 0.42 },
  { t: "16:00", v: 1.68 },
  { t: "18:00", v: 1.95 },
  { t: "20:00", v: 2.05 },
];

export const phTrend = [
  { t: "06:00", v: 7.0 },
  { t: "08:00", v: 7.1 },
  { t: "10:00", v: 7.2 },
  { t: "12:00", v: 6.9 },
  { t: "14:00", v: 6.4 },
  { t: "16:00", v: 7.1 },
  { t: "18:00", v: 7.3 },
  { t: "20:00", v: 7.2 },
];

export const activityFeed = [
  { ts: "09:18", actor: "Maria Reyes",     action: "reviewed result",   target: "MTR-10428" },
  { ts: "09:14", actor: "MTR-D-014",       action: "synced result",     target: "MTR-10428" },
  { ts: "08:52", actor: "System",          action: "flagged result",    target: "MTR-10427", note: "HOCl below minimum" },
  { ts: "08:40", actor: "Avery Thompson",  action: "updated threshold", target: "HOCl Min", note: "0.80 → 1.00 ppm" },
  { ts: "07:55", actor: "MTR-D-021",       action: "synced result",     target: "MTR-10426" },
  { ts: "07:48", actor: "System",          action: "flagged result",    target: "MTR-10424", note: "HOCl & pH out of range" },
];
