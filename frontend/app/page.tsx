import Background from "@/components/welcome/background";
import Logo from "@/components/welcome/logo";
import NameForm from "@/components/welcome/NameForm";
import Container from "@/components/shared/Container";
import PageWrapper from "@/components/shared/PageWrapper";

export default function Home() {
  return (
    <PageWrapper className="overflow-hidden">
      <Background />

      <Container className="relative flex min-h-screen items-center justify-center">
        <div className="w-full max-w-lg space-y-10">
          <Logo />
          <NameForm />
        </div>
      </Container>
    </PageWrapper>
  );
}
