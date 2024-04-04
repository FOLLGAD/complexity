"use client";
import { Logo } from "@/components/Logo";
import { useSessions } from "@/components/sessions";
import Link from "next/link";
import { Button } from "./ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { FaSquareXTwitter } from "react-icons/fa6";
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
      <div className="absolute z-10 m-2 p-2 md:hidden">
        <Button
          variant="outline"
          className="h-12 w-12 rounded-full p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <HamburgerMenuIcon className="h-6 w-6" />
        </Button>
      </div>
      <aside
        ref={node}
        className={cn(
          "absolute z-10 flex h-screen w-64 flex-shrink-0 flex-grow-0 flex-col bg-[#202222] p-6 px-4 text-primary transition-all md:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <p className="text-gradient flex items-center text-2xl font-light tracking-tight selection:bg-orange-200 selection:text-orange-600 hover:text-orange-400 transition-all duration-200 ease-in-out">
                <span className="mr-1 h-8 w-8">
                  <Logo />
                </span>
                complexity
              </p>
            </Link>
          </div>
        </div>
        <div className="mb-4 mt-8 w-full flex-grow overflow-y-auto pb-4 selection:bg-orange-200/90 selection:text-orange-600">
          <div className="mb-2 px-3 text-xs font-semibold uppercase text-gray-200/90">
            Sessions
          </div>
          {sessions.length > 0 ? (
            <div className="prose flex w-full flex-col gap-2 lg:prose-lg ">
              {sessions.map(([item]) => (
                <TrackedLink
                  key={item.id}
                  className={cn(
                    "w-full cursor-pointer rounded-xl p-3 px-3 text-sm font-normal text-gray-300 no-underline transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary",
                    params.get("id") === item.id &&
                      "border-primary/20 bg-primary/10 text-primary",
                  )}
                  href={`/?id=${item.id}`}
                  phData={{
                    questionId: item.id,
                    questionText: item.question,
                  }}
                >
                  <span
                    className="pointer-events-none line-clamp-2 overflow-ellipsis"
                    title={item.question}
                  >
                    {item.question}
                  </span>
                </TrackedLink>
              ))}
            </div>
          ) : (
            <p className="p-2 text-sm text-gray-500">Ask a question.</p>
          )}
        </div>
        <div className="flex items-center">
          <a
            href="https://twitter.com/emilahlback"
            target="_blank"
            rel="noreferrer"
            className="flex gap-1 align-bottom"
          >
            <FaSquareXTwitter className="h-6 w-6" />{" "}
            <p className="hover:text-orange-400">@emilahlback</p>
            <span className="p-2 font-mono text-sm font-medium text-gray-300"></span>
          </a>
        </div>
      </aside>
    </>
  );
};
