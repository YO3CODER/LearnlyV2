type Props = {
  children: React.ReactNode;
};

export const FeedWrapper = ({ children }: Props) => {
  return (
    <div className="flex-1 relative top-0 pb-10 pt-2 lg:pt-2 min-w-0">
      {children}
    </div>
  );
};