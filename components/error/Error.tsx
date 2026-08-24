import Image from "next/image";

const Error = ({ image, title, description }: { image: string; title: string; description: string }) => {
  return (
    <section className="flex flex-col items-center gap-6 py-20 text-center">
      <Image
        src={`/errors/${image}.svg`}
        alt=""
        width={358}
        height={358}
        className="h-auto w-full max-w-[270px] rounded-md"
      />
      <h2 className="text-2xl">{title}</h2>
      <p className="max-w-[46ch] whitespace-pre-line">{description}</p>
    </section>
  );
};

export default Error;
