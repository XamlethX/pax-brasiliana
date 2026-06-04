import { ReactNode } from "react";
import Image from "next/image";

interface TextWithImageProps {
  children: ReactNode;
}

export default function TextWithImage({ children }: TextWithImageProps) {
  return (
    <section className="bg-mist grid-lines-overview relative flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/3 px-2.5 lg:pl-5 lg:pr-0">
        <div className="relative w-full min-h-[120px] lg:min-h-0 h-full">
          <Image
            src="/images/pattern-bg.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            loading="lazy"
            className="z-[1] object-cover"
          />
        </div>
      </div>
      <div className="w-full lg:w-2/3 flex-1 flex flex-col gap-10 justify-between">
        <div className="text-bark text-paragraphs px-5 lg:pl-5 lg:pr-0 pt-16 lg:pt-20 pb-16 lg:pb-20 max-w-[800px]">
          {children}
        </div>
      </div>
    </section>
  );
}
