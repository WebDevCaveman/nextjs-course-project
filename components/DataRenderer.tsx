import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface StateSkeletonProps {
  image?: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

export const StateSkeleton = ({ image, title, message, button }: StateSkeletonProps) => {
  return (
    <section className="flex flex-col items-center gap-6 py-20 text-center">
      {image && (
        <>
          <Image
            src={image.light}
            alt={image.alt}
            width={358}
            height={358}
            className="h-auto w-full max-w-[270px] rounded-md dark:hidden"
          />
          <Image
            src={image.dark}
            alt={image.alt}
            width={358}
            height={358}
            className="hidden h-auto w-full max-w-[270px] rounded-md dark:block"
          />
        </>
      )}
      <h2 className="text-2xl">{title}</h2>
      <p className="max-w-[46ch] whitespace-pre-line">{message}</p>
      {button && (
        <Button variant="cta" size="cta" asChild>
          <Link href={button.href}>{button.text}</Link>
        </Button>
      )}
    </section>
  );
};

interface DataRendererProps<T> {
  success: boolean;
  error?: {
    message?: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: StateSkeletonProps;
  render: (data: T[]) => React.ReactNode;
}

export const DataRenderer = <T,>({ success, error, empty = DEFAULT_EMPTY, data, render }: DataRendererProps<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{ light: DEFAULT_ERROR.image.light, dark: DEFAULT_ERROR.image.dark, alt: DEFAULT_ERROR.image.alt }}
        title={DEFAULT_ERROR.title}
        message={error?.message || DEFAULT_ERROR.message}
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={empty.image ? { light: empty.image.light, dark: empty.image.dark, alt: empty.image.alt } : undefined}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <>{render(data)}</>;
};
