'use client';

const PortfolioLoadingState = () => {
  return (
    <div className="min-h-screen text-dark">
      <section className="mx-auto max-w-350 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8 lg:pt-10">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-8">
          <aside className="order-1 w-full shrink-0 rounded-4xl border border-black/5 p-4 shadow-sm lg:sticky lg:top-8 lg:w-90 lg:self-start sm:p-5">
            <div className="animate-pulse space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 rounded-full bg-slate" />
                <div className="h-8 w-8 rounded-full bg-slate" />
              </div>
              <div className="h-14 rounded-2xl bg-slate" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-[1.35rem] p-3"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white/70" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded-full bg-white/70" />
                      <div className="h-3 w-1/2 rounded-full bg-white/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="order-2 min-w-0 flex-1 space-y-6 lg:space-y-8">
            <div className="overflow-hidden rounded-4xl border border-black/5 bg-white shadow-sm sm:rounded-[2.5rem]">
              <div className="relative min-h-[clamp(320px,50vh,540px)] animate-pulse sm:min-h-[clamp(360px,52vh,620px)] md:min-h-[clamp(380px,56vh,680px)] lg:min-h-[clamp(420px,60vh,720px)]">
                <div className="absolute inset-0 bg-white/20" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                  <div className="h-7 w-32 rounded-full" />
                  <div className="mt-5 h-16 w-full max-w-3xl rounded-3xl" />
                  <div className="mt-5 h-6 w-full max-w-2xl rounded-full" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-3xl border border-black/5 bg-white/85 shadow-sm sm:h-28"
                  />
                ))}
              </div>
              <div className="rounded-4xl border border-black/5 bg-white/85 p-5 shadow-sm sm:p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-28 rounded-full bg-slate" />
                  <div className="h-8 w-full max-w-2xl rounded-2xl bg-slate" />
                  <div className="h-8 w-full max-w-3xl rounded-2xl bg-slate" />
                  <div className="h-8 w-5/6 rounded-2xl bg-slate" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioLoadingState;
