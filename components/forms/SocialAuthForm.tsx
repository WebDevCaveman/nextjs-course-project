import { Button } from "@/components/ui/button";

const SocialAuthForm = () => {
  return (
    <div className="grid gap-3">
      <Button variant="outline">
        <i className="devicon-github-original text-[16px]" />
        GitHub
      </Button>
      <Button variant="outline">
        <i className="devicon-google-plain colored text-[16px]" />
        Google
      </Button>
    </div>
  );
};

export default SocialAuthForm;
