"use client";
import { Logo } from "@/components/Logo";
import { useSessions } from "@/components/sessions";
import Link from "next/link";
import { Button } from "./ui/button";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { TrackedLink } from "./TrackedLink";
import { ArrowRight } from "lucide-react";

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
  const router = useRouter();

  const { node, isOpen, setIsOpen } = useClickOutside();
  const params = useParams();
  const sessionId = params.sessionId as string;

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [sessionId]);

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
          "absolute z-10 flex h-screen w-64 flex-shrink-0 flex-grow-0 flex-col bg-[#202222] p-6 px-3 text-primary transition-all md:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3">
            <Link href="/">
              <p className="text-gradient flex items-center text-2xl font-light tracking-tight transition-all duration-200 ease-in-out selection:bg-orange-200 selection:text-orange-600 hover:text-orange-400">
                <span className="group mr-3 h-8 w-8">
                  <Logo />
                </span>
                complexity
              </p>
            </Link>
          </div>
        </div>
        <div className="mb-4 mt-8 w-full flex-grow overflow-y-auto pb-2 selection:bg-orange-200/90 selection:text-orange-600 ">
          <div className="align-center sticky top-0 mb-2 grid grid-cols-3 items-center bg-[#202222]  px-3 pb-2 text-xs font-semibold uppercase text-gray-200/90">
            Sessions{" "}
            <span className={cn("text-gray-300", !sessions.length && "hidden")}>
              ({sessions.length || 0})
            </span>
            <span className="place-self-end">
              <Button
                title="Ask a new question"
                className={cn(
                  "pointer-events-auto rounded-full border border-orange-50/10 bg-primary/5 text-sm transition-opacity duration-200 hover:bg-orange-600",
                  {
                    "opacity-0": !sessionId,
                    "pointer-events-none": !sessionId,
                  },
                )}
                variant="outline"
                onClick={() => router.push("/")}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
            </span>
          </div>
          {sessions.length > 0 && (
            <div className="prose flex w-full flex-col gap-2 lg:prose-lg ">
              {sessions.map(([item]) => (
                <TrackedLink
                  key={item.id}
                  className={cn(
                    "w-full cursor-pointer rounded-xl px-3 py-2 align-middle text-sm font-normal text-gray-300 no-underline transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary",
                    sessionId === item.id &&
                      "border-primary/20 bg-primary/10 text-primary",
                  )}
                  href={`/q/${item.id}`}
                  phData={{
                    "question-id": item.id,
                    "question-text": item.question,
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
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center pb-2 pt-2">
            <Link href="/about">
              <Button variant="link">
                <p className="text-gray-200">
                  About <span className="text-gradient">complexity</span>{" "}
                </p>
                <ArrowRight className="ml-1 inline-block h-4 w-4 text-gray-200" />
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
