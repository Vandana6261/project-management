// Status definitions matching GitHub Project status conventions
export const STATUS_CONFIG = {
  BACKLOG: {
    key: "BACKLOG",
    label: "Backlog",
    order: 0,
    badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
    dotClass: "bg-zinc-400",
    headerBorder: "border-zinc-500/30",
    headerBg: "bg-zinc-500/5",
  },
  TODO: {
    key: "TODO",
    label: "Todo",
    order: 1,
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
    dotClass: "bg-sky-400",
    headerBorder: "border-sky-500/30",
    headerBg: "bg-sky-500/5",
  },
  IN_PROGRESS: {
    key: "IN_PROGRESS",
    label: "In Progress",
    order: 2,
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    dotClass: "bg-amber-400",
    headerBorder: "border-amber-500/30",
    headerBg: "bg-amber-500/5",
  },
  IN_REVIEW: {
    key: "IN_REVIEW",
    label: "In Review",
    order: 3,
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
    dotClass: "bg-purple-400",
    headerBorder: "border-purple-500/30",
    headerBg: "bg-purple-500/5",
  },
  DONE: {
    key: "DONE",
    label: "Done",
    order: 4,
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    dotClass: "bg-emerald-400",
    headerBorder: "border-emerald-500/30",
    headerBg: "bg-emerald-500/5",
  },
  CANCELLED: {
    key: "CANCELLED",
    label: "Cancelled",
    order: 5,
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
    dotClass: "bg-rose-400",
    headerBorder: "border-rose-500/30",
    headerBg: "bg-rose-500/5",
  },
};

export const ORDERED_STATUSES = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
  "CANCELLED",
];

export const PRIORITY_CONFIG = {
  LOW: {
    label: "Low",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  MEDIUM: {
    label: "Medium",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  HIGH: {
    label: "High",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  URGENT: {
    label: "Urgent",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export const formatDate = (dateString) => {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getAvatarColor = (name = "") => {
  const colors = [
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "bg-rose-500/20 text-rose-400 border-rose-500/30",
    "bg-sky-500/20 text-sky-400 border-sky-500/30",
    "bg-teal-500/20 text-teal-400 border-teal-500/30",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Parses composite task description containing optional sections:
 * [Description]
 * 
 * ### Reasons & Context
 * [Reasons]
 * 
 * ### Acceptance Criteria
 * [Criteria]
 * 
 * ### Custom Fields
 * [JSON or key-value]
 */
export const parseTaskContent = (rawText = "") => {
  if (!rawText) {
    return {
      description: "",
      reasons: "",
      criteria: "",
      customFields: {},
    };
  }

  const reasonsMarker = "### Reasons & Context";
  const criteriaMarker = "### Acceptance Criteria";
  const customMarker = "### Custom Fields";

  let description = rawText;
  let reasons = "";
  let criteria = "";
  let customFields = {};

  const reasonsIdx = rawText.indexOf(reasonsMarker);
  const criteriaIdx = rawText.indexOf(criteriaMarker);
  const customIdx = rawText.indexOf(customMarker);

  const indices = [
    { name: "reasons", idx: reasonsIdx },
    { name: "criteria", idx: criteriaIdx },
    { name: "custom", idx: customIdx },
  ].filter((item) => item.idx !== -1).sort((a, b) => a.idx - b.idx);

  if (indices.length > 0) {
    description = rawText.substring(0, indices[0].idx).trim();

    for (let i = 0; i < indices.length; i++) {
      const current = indices[i];
      const nextIdx = i + 1 < indices.length ? indices[i + 1].idx : rawText.length;
      let sectionContent = "";

      if (current.name === "reasons") {
        sectionContent = rawText.substring(current.idx + reasonsMarker.length, nextIdx).trim();
        reasons = sectionContent;
      } else if (current.name === "criteria") {
        sectionContent = rawText.substring(current.idx + criteriaMarker.length, nextIdx).trim();
        criteria = sectionContent;
      } else if (current.name === "custom") {
        sectionContent = rawText.substring(current.idx + customMarker.length, nextIdx).trim();
        try {
          customFields = JSON.parse(sectionContent);
        } catch {
          // parse line key: value
          const lines = sectionContent.split("\n");
          lines.forEach((line) => {
            const [k, ...v] = line.split(":");
            if (k && v.length) customFields[k.trim()] = v.join(":").trim();
          });
        }
      }
    }
  }

  return { description, reasons, criteria, customFields };
};

export const serializeTaskContent = ({ description = "", reasons = "", criteria = "", customFields = {} }) => {
  const parts = [];
  if (description.trim()) {
    parts.push(description.trim());
  }
  if (reasons.trim()) {
    parts.push(`### Reasons & Context\n${reasons.trim()}`);
  }
  if (criteria.trim()) {
    parts.push(`### Acceptance Criteria\n${criteria.trim()}`);
  }
  if (Object.keys(customFields).length > 0) {
    parts.push(`### Custom Fields\n${JSON.stringify(customFields, null, 2)}`);
  }
  return parts.join("\n\n");
};
