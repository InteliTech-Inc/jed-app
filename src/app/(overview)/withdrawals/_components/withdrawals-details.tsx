import { Button } from "@/components/ui/button";
import { Withdrawal } from "./data-table";
import { IconInfoCircle, IconClipboard } from "@tabler/icons-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";

export function WithdrawalsDetails({ row }: { row: Withdrawal }) {
  const handleCopy = (text: string) => {
    copyToClipboard(text);
    toast.success("Reference ID copied to clipboard");
  };

  return (
    <div>
      {row && (
        <div className="fixed inset-0 z-50 flex items-start justify-end overflow-hidden bg-black/50">
          <div className="h-full w-full max-w-md overflow-auto bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Withdrawal Details</h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="mb-2 font-semibold">Reference ID</div>
                <div className="flex items-center justify-between">
                  <code className="rounded bg-blue-100 px-2 py-1 font-mono text-sm">
                    {row.reference}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-100"
                    onClick={() => handleCopy(row.reference)}
                  >
                    <IconClipboard />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-muted-foreground text-sm">Amount</div>
                    <div className="font-semibold">
                      GHS {row.amount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Status</div>
                    <div
                      className={`font-semibold ${
                        row.status === "completed"
                          ? "text-green-600"
                          : row.status === "pending"
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground text-sm">Date</div>
                  <div className="font-semibold">
                    {new Date(row.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="mb-2 text-sm font-medium">Payment Method</div>
                  <div className="rounded-lg border p-3">
                    <div className="mb-2 font-semibold">{row.method}</div>
                    {row.method === "Bank Transfer" ? (
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">Bank:</span>
                          <span>{row.bank}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">
                            Account Number:
                          </span>
                          <span>{row.accountNumber}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">
                            Account Name:
                          </span>
                          <span>{row.accountName}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">
                            Provider:
                          </span>
                          <span>{row.provider}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">
                            Phone Number:
                          </span>
                          <span>{row.phoneNumber}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-muted-foreground">
                            Account Name:
                          </span>
                          <span>{row.accountName || "N/A"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {row.status === "pending" && (
                <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                  <div className="flex items-start">
                    <IconInfoCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Processing in Progress</h4>
                      <p className="text-sm">
                        Your withdrawal is being processed. This typically takes
                        1-3 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
