import Image from "next/image";

type Props = {
  question: string;
};

export const QuestionBubble = ({ question }: Props) => {
  return (
    <div className="flex items-center gap-x-4 mb-6">

      {/* Mascot */}
      <div className="relative shrink-0">
        <div className="absolute inset-0 bg-blue-200/40 rounded-full blur-md scale-125" />
        <Image
          src="/mascot.svg"
          alt="Mascot"
          height={60}
          width={60}
          className="relative hidden lg:block drop-shadow-md"
        />
        <Image
          src="/mascot.svg"
          alt="Mascot"
          height={40}
          width={40}
          className="relative block lg:hidden drop-shadow-md"
        />
      </div>

      {/* Bubble */}
      <div className="relative py-3 px-5
        bg-white border border-slate-200
        rounded-2xl shadow-sm
        text-sm lg:text-base font-medium text-slate-700
        max-w-lg"
      >
        {question}
        {/* Arrow */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2
          w-3 h-3 bg-white border-l border-b border-slate-200
          rotate-45"
        />
      </div>

    </div>
  );
};