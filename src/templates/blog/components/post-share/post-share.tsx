"use client";

import { useShare } from "@/hooks";
import { Button } from "@/components/ui/button";

type PostShareProps = {
  url: string;
  title: string;
  description: string;
}

export const PostShare = ({ url, description, title }: PostShareProps) => {
  const { shareButtons } = useShare({
    url,
    title,
    text: description,
  });

  return (
    <aside className="space-y-6">
      <div className="rounder-lg bg-gray-700">
        <h2 className="hidden md:block mb-4 text-heading-xs text-gray-100">
          Compartilhar
        </h2>

        <div className="flex justify-between md:flex-col gap-2">
          {shareButtons.map((provider) => (
            <Button
              key={provider.provider}
              onClick={() => provider.action()}
              variant="outline"
              className="w-fit md:w-full justify-start gap-2"
              title={provider.name}
            >
              {provider.icon}
              <span className="hidden md:block">{provider.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};
