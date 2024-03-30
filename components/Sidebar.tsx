"use client";
import { Logo } from "@/components/Logo";
import { useSessions } from "@/components/sessions";
import Link from "next/link";
import { Button } from "./ui/button";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { TrackedLink } from "./TrackedLink";

const useClickOutside = () => {
  const node = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (e) => {
    if (node?.current?.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return { node, isOpen, setIsOpen };
};

export const Sidebar = () => {
  const { sessions } = useSessions();

  const { node, isOpen, setIsOpen } = useClickOutside();
  const params = useSearchParams();

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [params.get("id")]);

  return (
    <>
      <div className="absolute p-2 z-10 md:hidden">
        <Button
          variant="outline"
          className="p-4 w-16 h-16"
          onClick={() => setIsOpen(!isOpen)}
        >
          <HamburgerMenuIcon className="w-12 h-12" />
        </Button>
      </div>
      <aside
        ref={node}
        className={cn(
          "flex flex-col items-center p-8 px-4 text-primary w-64 flex-shrink-0 flex-grow-0 border-r border-gray-800 md:static absolute transition-all z-10 bg-background h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
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
        <div className="mt-8 w-full overflow-y-auto flex-grow pb-4 mb-4">
          <div className="text-xs text-gray-500 font-bold mb-2 uppercase px-2">
            Sessions
          </div>
          {sessions.length > 0 ? (
            <div className="flex flex-col gap-2 w-full overflow-ellipsis">
              {sessions.map(([item]) => (
                <TrackedLink
                  key={item.id}
                  className="w-full cursor-pointer text-sm font-medium text-gray-300 hover:text-primary hover:bg-primary/10 border p-2 hover:border-primary/20 rounded-lg"
                  href={`/?id=${item.id}`}
                  phData={{
                    questionId: item.id,
                    questionText: item.question,
                  }}
                >
                  <span
                    className="overflow-ellipsis line-clamp-2 pointer-events-none"
                    title={item.question}
                  >
                    {item.question}
                  </span>
                </TrackedLink>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 p-2">Ask a question.</p>
          )}
        </div>
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
    </>
  );
};
