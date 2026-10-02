import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
