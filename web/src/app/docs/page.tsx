import { ComingSoon } from "@/components/ComingSoon";

export const metadata = {
  title: "API Docs · VeriAid AI",
  description: "Dokumentasi API VeriAid AI untuk integrasi dengan sistem internal organisasi.",
};

export default function DocsPage() {
  return (
    <ComingSoon
      emoji="📘"
      title="API Documentation"
      description="Dokumentasi API sedang dalam pengembangan. VeriAid AI akan menyediakan REST API untuk integrasi OCR, analisis AI, dan pencatatan SHA-256 hash ke blockchain."
    />
  );
}