import { Navbar } from "@/shared/navbar";
import { Hero } from "@/shared/hero";
import { How } from "@/shared/how";
import { WhyZooko } from "@/shared/why";
import { Footer } from "@/shared/footer";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <How />
      <WhyZooko />
      <Footer />
    </div>
  );
}
