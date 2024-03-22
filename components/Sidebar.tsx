"use client";
import { Logo } from "@/components/Logo";
import { useSessions } from "@/components/sessions";
import Link from "next/link";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Sidebar = () => {
  const { sessions } = useSessions();

  return (
    <aside className="flex flex-col items-center p-8 px-4 text-primary w-64 flex-shrink-0 flex-grow-0 border-r border-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <p className="text-md font-medium flex items-center hover:text-orange-400">
              <span className="w-8 h-8 mr-1">
                <Logo />
              </span>
              Complexity
            </p>
          </Link>
        </div>
      </div>
      <div className="mt-8 w-full">
        <div className="text-xs text-gray-500 font-bold mb-2 uppercase px-2">
          Sessions
        </div>
        {sessions.length > 0 ? (
          <div className="flex flex-col gap-2 w-full overflow-ellipsis">
            {sessions.map(([item]) => (
              <Link
                key={item.id}
                className="w-full overflow-ellipsis line-clamp-2 cursor-pointer text-sm font-medium text-gray-300 hover:text-primary hover:bg-primary/10 border p-2 hover:border-primary/20 rounded-lg"
                href={`/?id=${item.id}`}
              >
                {item.question}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 p-2">Ask a question.</p>
        )}
      </div>
      <div className="flex-grow" />
      <div className="flex items-center">
        <a
          href="https://twitter.com/emilahlback"
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-sm text-gray-500 p-2">@emilahlback</span>
        </a>
        <a
          href="https://github.com/follgad/complexity"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline" className="w-12 h-12 p-3">
            <GitHubLogoIcon className="w-full h-full" />
          </Button>
        </a>
      </div>
    </aside>
  );
};
