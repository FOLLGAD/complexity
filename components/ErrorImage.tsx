"use client";
export const ErrorImage = ({ src }: { src: string }) => {
  return (
    <img
      src={src}
      className="w-full h-full object-cover"
      // @ts-ignore
      onError={(e) => (e.target.src = "https://placehold.co/600x400")}
    />
  );
};
