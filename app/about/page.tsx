import { Logo } from "@/components/Logo";
import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <div className="flex h-full w-full flex-col items-center pt-16">
      <div className="mb-2 flex flex-col items-center justify-between">
        <div className="group mx-auto mb-4 h-16 w-16 items-center justify-center align-middle">
          <Logo />
        </div>
        <h1 className="text-gradient mb-1 mt-2 text-4xl font-medium tracking-tight">
          complexity
        </h1>
      </div>

      <p className="animate-fade-in mb-0 text-center text-lg font-normal text-gray-300 [--animation-delay:400ms]">
        The world's knowledge at your fingertips
      </p>

      <div className="w-full max-w-xs pt-4 md:max-w-md md:pt-10 lg:max-w-xl">
        <h2 className="mt-4 text-2xl">About</h2>

        <p className="mt-4">
          <span className="text-gradient">complexity</span> is a search engine
          that uses AI to answer questions. It is designed to provide a fast and
          efficient way to find answers to your questions.
        </p>
        <p className="mt-4">
          Any questions, feedback or suggestions can be directed to{" "}
          <TrackedLink
            href="https://twitter.com/emilahlback"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gradient"
            phData={{
              linkurl: "https://twitter.com/emilahlback",
            }}
          >
            Emil Ahlbäck
          </TrackedLink>
          .
        </p>
        <h3 className="mt-4 text-xl">Created by</h3>
        <ul className="mb-8 mt-4 list-inside list-disc marker:text-gray-400">
          <li className="mt-2">
            <TrackedLink
              href="https://twitter.com/emilahlback"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient"
              phData={{
                linkurl: "https://twitter.com/emilahlback",
              }}
            >
              Emil Ahlbäck
            </TrackedLink>
          </li>
          <li className="mt-2">
            <TrackedLink
              href="https://twitter.com/TheHamedMP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient"
              phData={{
                linkurl: "https://twitter.com/thehamedmp",
              }}
            >
              Hamed Mohammadpour
            </TrackedLink>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center">
        <a href="https://github.com/follgad/complexity" target="_blank">
          <Button variant="ghost">
            <span className="flex flex-row items-center gap-1">
              <GitHubLogoIcon className="h-4 w-4" />
              Github
            </span>
          </Button>
        </a>
      </div>

      <div className="mx-auto mt-20 flex flex-col items-center justify-center ">
        <h2 className="text-lg font-medium">Powered by</h2>
        <TrackedLink
          href="https://cohere.com/"
          target="_blank"
          rel=""
          className=""
          phData={{
            linkurl: "https://cohere.com/",
          }}
        >
          <Image
            src="/cohere-logo-white.svg"
            width={200}
            height={200}
            alt="https://cohere.com/"
            className=""
          />
        </TrackedLink>
      </div>
    </div>
  );
}
