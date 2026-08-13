import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid min-h-screen place-items-center bg-[image:var(--auth-grad)] px-6 py-10">
      <section className="border-line bg-base shadow-card flex w-full max-w-[500px] flex-col gap-6 rounded-xl border p-9">
        <div className="flex items-center gap-2.5">
          <Image src="/brand/logo-tile.svg" alt="DevFlow Logo" width={34} height={34} priority />
          <span className="text-xl font-semibold tracking-[-0.5px]">
            Dev<span className="text-accent-solid">Flow</span>
          </span>
        </div>

        {/* SignIn / SignUp / ForgotPassword — strony w grupie app/(auth) */}
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
