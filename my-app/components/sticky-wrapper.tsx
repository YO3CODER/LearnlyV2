type Props = {
  children: React.ReactNode;
};

export const StickyWrapper = ({ children }: Props) => {
  return (
    <>
      {/* Spacer pour réserver la place dans le layout flex */}
      <div className="hidden lg:block w-[320px] shrink-0" />

      {/* Sidebar fixe sur desktop */}
      <div className="hidden lg:flex flex-col gap-y-4 fixed top-6 right-6 w-[320px] max-h-[calc(100vh-48px)] overflow-y-auto">
        {children}
      </div>
    </>
  );
};