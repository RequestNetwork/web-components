import { capitalize } from "./capitalize";
import { Types } from "@requestnetwork/request-client.js";

export const checkStatus = (request: Types.IRequestDataWithEvents | null) => {
  const balance = Number(request?.balance?.balance ?? 0);
  const expectedAmount = Number(request?.expectedAmount ?? 0);

  if (balance > 0) {
    return balance >= expectedAmount ? "Paid" : "Partially Paid";
  }

  const eventStatus = {
    reject: "Rejected",
    cancel: "Canceled",
  };

  const dueDate = request?.contentData?.paymentTerms?.dueDate;
  if (dueDate && new Date(dueDate) < new Date()) {
    return "Overdue";
  }

  for (const [event, status] of Object.entries(eventStatus)) {
    if (
      request?.events?.some(
        (e: { name?: string }) => e?.name?.toLowerCase() === event.toLowerCase()
      )
    ) {
      return status;
    }
  }

  return capitalize(request?.state as string);
};
