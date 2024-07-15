export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
};

export const inputDateFormat = (date: Date | string) => {
  const d = new Date(typeof date === "string" ? date : date.toString());
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month?.length < 2) month = "0" + month;
  if (day?.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
