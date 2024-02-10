export const formatDate = (dateStr) => {
  if (!dateStr || isNaN(Date.parse(dateStr))) {
    console.warn(`Invalid or empty date string: ${dateStr}`);
    return "Invalid Date";
  }

  const date = new Date(dateStr);
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const month = mo.charAt(0).toUpperCase() + mo.slice(1);
  return `${month.slice(0, 3)}. ${parseInt(da)}, ${ye}`;
};

export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "refused":
      return "Cancelled";
  }
};
