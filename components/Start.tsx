"use client";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useComplexity } from "./complexity";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const examples = [
  "xz backdoor",
  "EU AltStore coming soon",
  "Altman gives up OpenAI fund",
  "Microplastics found in ancient digs",
  "US House bans use of Microsoft Copilot",
];

export const Start = () => {
  const { ask, loading } = useComplexity();
  const [input, setInput] = useState("");

  return (
    <div
      className={
        "absolute bottom-0 top-0 flex w-full flex-col items-center justify-center overflow-y-auto transition-all duration-100 ease-in-out selection:bg-orange-200 selection:text-orange-600"
      }
    >
      <div className="mb-2 flex flex-col items-center justify-between">
        <div className="mb-4 h-24 w-24">{/* <Logo /> */}</div>
        <h1 className="text-gradient mb-1 mt-2 text-4xl font-medium tracking-tight">
          complexity
        </h1>
      </div>
      <p className="animate-fade-in mb-16 text-lg font-normal text-gray-300 [--animation-delay:400ms]">
        The world's knowledge at your fingertips
      </p>
      <form
        className="flex w-full flex-col items-center gap-4 px-4"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input, true);
          setInput("");
        }}
      >
        <div className="relative w-full max-w-lg">
          <Input
            className="text-md rounded-full border border-orange-50/10 p-4 py-6 pl-6 text-orange-50 placeholder:font-thin placeholder:text-gray-400 focus:border-orange-100 focus:bg-primary/5 focus:text-primary"
            placeholder="Ask anything..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
            disabled={loading}
          />
          <div className="absolute bottom-0 right-0 top-0 flex h-full items-center justify-center">
            <Button
              variant="outline"
              className={cn(
                "mr-2 h-8 w-8 rounded-full p-0",
                input ? "bg-orange-400" : "bg-gray-800",
              )}
              type="submit"
              disabled={loading || !input}
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <h3 className="mt-8 text-xs font-bold uppercase text-gray-200/90">
          Trending
        </h3>
        <div className="flex flex-col items-center gap-2 text-center">
          {examples.map((example) => (
            <Card
              key={example}
              className="mt-0 w-auto cursor-pointer rounded-xl border bg-[#202222] p-2 px-3 text-sm text-gray-300 hover:border-orange-300/20 hover:bg-primary/10 hover:text-primary"
              onClick={() => {
                if (loading) return;
                setInput(example);
                ask(example, true);
              }}
            >
              {example}
            </Card>
          ))}
        </div>
      </form>
    </div>
  );
};

// export const Start = () => {
//   const { ask, loading } = useComplexity();
//   const [input, setInput] = useState("");

//   return (
//     <div className="w-full h-full transition-all duration-100 ease-in-out flex flex-col items-center justify-center absolute top-0 bottom-0">
//       <div className="flex flex-col items-center justify-between mb-2">
//         <div className="w-24 h-24 mb-4">
//           <Logo />
//         </div>
//         <h1 className="text-3xl tracking-widest mb-2 mt-2">
//           {/* underline decoration-orange-400 underline-offset-[3px] */}
//           Complexity
//         </h1>
//       </div>
//       <p className="mb-12">The world's knowledge at your fingertips</p>
//       <form
//         className="w-full flex flex-col items-center gap-4 px-2"
//         onSubmit={(e) => {
//           e.preventDefault();
//           ask(input, true);
//           setInput("");
//         }}
//       >
//         <div className="relative w-full max-w-lg">
//           <Input
//             className="text-md p-4 py-6 text-gray-300 focus:text-primary focus:bg-primary/10 border focus:border-primary/20 rounded-lg"
//             placeholder="Ask anything..."
//             onChange={(e) => setInput(e.target.value)}
//             value={input}
//             disabled={loading}
//           />
//           <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
//             <Button
//               variant="outline"
//               className="w-10 h-10 p-0 mr-1"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? (
//                 <LoaderCircle className="animate-spin" />
//               ) : (
//                 <ArrowRight />
//               )}
//             </Button>
//           </div>
//         </div>
//         <h3 className="text-xs text-gray-400 font-bold mt-8 uppercase">
//           Trending
//         </h3>
//         <div className="text-center flex flex-col gap-2 items-center">
//           {examples.map((example) => (
//             <Card
//               key={example}
//               className="text-sm w-auto cursor-pointer mt-0 p-1 px-2 text-gray-300 hover:text-primary hover:bg-primary/10 border hover:border-primary/20 rounded-lg"
//               onClick={() => {
//                 if (loading) return;
//                 setInput(example);
//                 ask(example, true);
//               }}
//             >
//               {example}
//             </Card>
//           ))}
//         </div>
//       </form>
//     </div>
//   );
// };
