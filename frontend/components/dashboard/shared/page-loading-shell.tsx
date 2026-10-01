type PageLoadingShellProps = {
  children: React.ReactNode;
};

export function PageLoadingShell({ children }: PageLoadingShellProps) {
  return (
    <main
      className="
        mx-auto
        w-full
        max-w-6xl
        px-4
        pb-24
        pt-8

        sm:px-6
        sm:pt-10

        lg:px-8
        lg:pb-16
        lg:pt-12
      "
    >
      <div className="animate-pulse">{children}</div>
    </main>
  );
}
