"use client";
import { Clipboard, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { exportToCSV, copyToClipboard } from "@/lib/utils";
import { Input } from "@/components/ui/input";
// import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

import { __BASE_URL } from "@/constants/url";
import { NominationsResponse } from "../page";
import { IconFileArrowRight } from "@tabler/icons-react";
import { Spinner } from "@/components/spinner";
import { ParamValue } from "next/dist/server/request/params";

export function LinkButton({
  id,
  results,
}: Readonly<{
  id: ParamValue;
  results: NominationsResponse[];
}>) {
  const url = `${__BASE_URL}/nom?id=${id}`;

  const [open, setOpen] = useState(false);
  const [downloadableUrl, setDownloadableUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyLink = async () => {
    if (navigator.share) {
      await navigator.share({
        url: downloadableUrl,
        title: "JED | Nominations",
        text: "Fill this form to add a new nomination",
      });
    } else {
      copyToClipboard(downloadableUrl);
      toast.success("Nominations forms link copied to clipboard");
    }
  };

  const handleShortenURL = async () => {
    setIsLoading(true);
    // const data = {
    //   url: url,
    // };

    try {
      // const res = await axios.post(
      //   `${process.env.NEXT_PUBLIC_URL_SHORTENER_API}/shorten-url`,
      //   data,
      //   {
      //     headers: {
      //       "content-type": "application/x-www-form-urlencoded",
      //       Accept: "application/json",
      //     },
      //   },
      // );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDownloadableUrl(`${process.env.NEXT_PUBLIC_URL_SHORTENER_API}/shor`);
      toast.success("URL shortened successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while shortening URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadData = () => {
    if (!results.length) {
      return toast.error("No data to download");
    }
    const data = results.map((r) => {
      return {
        "Full Name": r.full_name,
        EMAIL: r.email,
        CATEGORY: r.category.name,
        "PHONE NUMBER": r.phone,
        REASON: r.reasons,
        "SUBMITTED ON": format(new Date(r.created_at), "dd/MM/yyyy"),
      };
    });
    exportToCSV(data, `Nominations_Results`);
    toast.success("Nominations results exported successfully");
  };
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        onClick={handleDownloadData}
        disabled={!results.length}
        variant={"outline"}
        className="text-secondary shadow-none"
      >
        Export Data
        <IconFileArrowRight />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-fit gap-2">
            {" "}
            Share forms link
            <LinkIcon size={14} />
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="text-left text-xl">
              Nominations forms link.
            </DialogTitle>
            <DialogDescription className="text-left">
              Send out this link for people to nominate others for the different
              categories that you have added.
            </DialogDescription>
          </DialogHeader>
          <Input
            id="full_name"
            type="text"
            readOnly
            placeholder="Nominations forms URL"
            className="border-accent focus:border-secondary focus-visible:ring-secondary focus-visible:ring-opacity-50 border focus-visible:border-transparent focus-visible:ring-1"
            value={downloadableUrl}
          />
          <DialogFooter className="mt-4 gap-2">
            <Button onClick={handleCopyLink} className="gap-2">
              <Clipboard size={14} />
              Share forms link
            </Button>
            <Button
              variant="secondary"
              onClick={handleShortenURL}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="var(--color-primary)" />
              ) : (
                "Shorten URL"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
