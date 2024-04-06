import { LogoSwinging } from "@/components/LogoSwinging";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-48 pb-8 drop-shadow-xl">
        <LogoSwinging />
      </div>
      <h2 className="mb-4 text-3xl font-bold">404 – Page Not Found</h2>
      <p>
        This one's too difficult even for{" "}
        <Link href="/">
          <span className="text-gradient">complexity</span>
        </Link>
        .
      </p>
      <Link href="/">
        <Button
          className={cn(
            "pointer-events-auto mx-auto mt-8 rounded-xl bg-primary/10 text-sm shadow-xl transition-opacity duration-200 hover:bg-primary/50",
          )}
          variant="outline"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Ask a question
        </Button>
      </Link>
    </div>
  );
}
