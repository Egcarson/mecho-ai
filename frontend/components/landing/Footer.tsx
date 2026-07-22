import Container from "@/components/shared/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-400 md:flex-row">
          <p>© {new Date().getFullYear()} LocalVoice AI</p>

          <p>Built by [Later input] • Built for AI Now Hackathon</p>
        </div>
      </Container>
    </footer>
  );
}
