import { capitalize } from "./capitalize";
import { Types } from "@requestnetwork/request-client.js";

export const checkStatus = (request: Types.IRequestDataWithEvents | null) => {
  const balance = BigInt(request?.balance?.balance ?? 0);
  const expectedAmount = BigInt(request?.expectedAmount ?? 0);
  const today = new Date();
  let dueDate: Date | null = null;
  const isPaid = balance >= expectedAmount ? "Paid" : "Partially Paid";

  try {
    const rawDueDate = request?.contentData?.paymentTerms?.dueDate;
    if (rawDueDate) {
      dueDate = new Date(rawDueDate);
      if (isNaN(dueDate.getTime())) {
        console.warn("Invalid due date format");
        dueDate = null;
      }
    }
  } catch (e) {
    console.error("Error parsing due date:", e);
    dueDate = null;
  }

  const eventStatus = {
    reject: "Rejected",
    cancel: "Canceled",
  };

  for (const [event, status] of Object.entries(eventStatus)) {
    if (
      request?.events?.some(
        (e: { name?: string }) => e?.name?.toLowerCase() === event.toLowerCase()
      )
    ) {
      return capitalize(status);
    }
  }

  if (dueDate && dueDate < today) {
    if (balance === BigInt(0)) {
      return "Overdue";
    }
    return isPaid;
  } else {
    if (balance === BigInt(0)) {
      return "Awaiting Payment";
    }
    return isPaid;
  }
};
