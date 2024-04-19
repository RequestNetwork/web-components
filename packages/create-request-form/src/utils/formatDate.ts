export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
};
