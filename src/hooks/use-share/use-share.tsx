import { useCallback, useMemo } from "react";
import { Link } from "lucide-react";
import {
  ShareConfig,
  SOCIAL_PROVIDER,
  SocialProvider,
} from "./social_providers";
import { useClipboard } from "../use-clipboard";

type UseShareProps = ShareConfig & {
  clipboardTimeout?: number;
};

export const useShare = ({
  url,
  title,
  text,
  clipboardTimeout = 2000,
}: UseShareProps) => {
  const { isCopied, handleCopy } = useClipboard({ timeout: clipboardTimeout });

  const shareConfig = useMemo(
    () => ({
      url,
      ...(title && { title }),
      ...(text && { text }),
    }),
    [url, title, text]
  );

  const share = useCallback(
    async (provider: SocialProvider) => {
      try {
        if (provider === "clipboard") {
          return await handleCopy(url);
        }

        const providerConfig = SOCIAL_PROVIDER[provider];
        if (!providerConfig) {
          throw new Error(`Provider nãp suportado: ${provider}`);
        }

        const shareUrl = providerConfig.shareUrl(shareConfig);
        const shareWindow = window.open(
          shareUrl,
          "_blank",
          "width=600,height=600,location=yes,status=yes"
        );

        return !!shareWindow;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [shareConfig, handleCopy, url]
  );

  const shareButtons = useMemo(
    () => [
      ...Object.entries(SOCIAL_PROVIDER).map(([key, provider]) => ({
        provider: key,
        name: provider.name,
        icon: provider.icon,
        action: () => share(key as SocialProvider),
      })),
      {
        provider: "clipboard",
        name: isCopied ? "Link copiado!" : "Copar Link",
        icon: <Link className="h-4 w-4" />,
        action: () => share("clipboard"),
      },
    ],
    [isCopied, share]
  );

  return { shareButtons };
};
