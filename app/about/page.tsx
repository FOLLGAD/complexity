import { Logo } from "@/components/Logo";
import { TrackedLink } from "@/components/TrackedLink";

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
      <p className="animate-fade-in mb-8 text-center text-lg font-normal text-gray-300 [--animation-delay:400ms]">
        The world's knowledge at your fingertips
      </p>

      <div className="w-full max-w-xs pt-4 md:max-w-md md:pt-10 lg:max-w-xl">
        <h2 className="text-2xl">About</h2>
        <p className="mt-4 text-lg">
          <span className="text-gradient">complexity</span> is a search engine
          that uses AI to answer questions. It is built on top of the Cohere AI
          platform and is designed to provide a fast and efficient way to find
          answers to your questions.
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
                linkurl: "https://twitter.com/TheHamedMP",
              }}
            >
              Hamed Mohammadpour
            </TrackedLink>{" "}
            – design
          </li>
        </ul>
      </div>
    </div>
  );
}
