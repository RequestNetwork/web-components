import { capitalize } from "./capitalize";
import { Types } from "@requestnetwork/request-client.js";

export const checkStatus = (request: Types.IRequestDataWithEvents | null) => {
  const balance = Number(request?.balance?.balance ?? 0);
  const expectedAmount = Number(request?.expectedAmount ?? 0);
  const today = new Date();
  const dueDate = new Date(request?.contentData?.paymentTerms?.dueDate);

  const eventStatus = {
    reject: "Rejected",
    cancel: "Canceled",
  };

  if (balance > 0) {
    return balance >= expectedAmount ? "Paid" : "Partially Paid";
  }

  if (dueDate < today && balance === 0) {
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
