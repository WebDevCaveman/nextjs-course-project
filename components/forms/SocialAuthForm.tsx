const providerButton =
  "border-line-strong bg-base text-fg hover:border-accent-solid flex h-[45px] items-center justify-center gap-2.5 rounded-lg border text-[15px] font-medium";

const SocialAuthForm = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3.5">
        <span className="bg-line h-px flex-1" />
        <span className="text-fg-subtle text-[13px]">or</span>
        <span className="bg-line h-px flex-1" />
      </div>

      <button type="button" className={providerButton}>
        <i className="devicon-github-original text-[20px]" />
        GitHub
      </button>
      <button type="button" className={providerButton}>
        <i className="devicon-google-plain colored text-[20px]" />
        Google
      </button>
    </div>
  );
};

export default SocialAuthForm;
