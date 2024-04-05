"use client";
export const ErrorImage = ({ src }: { src: string }) => {
  return (
    <img
      src={src}
      className="h-full w-full object-cover"
      onError={(e) =>
        (
          // @ts-ignore
          (e.target.src = "https://placehold.co/600x400"),
          // @ts-ignore
          (e.target.style.visibility = "hidden")
        )
      }
    />
  );
};
