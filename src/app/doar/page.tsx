import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="bg-sand/30 relative min-h-[600px] flex flex-col lg:flex-row w-full lg:pt-24">
          <img
            src="/images/doar-bg.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="media-overlay" aria-hidden="true" />
          <div
            className="relative pt-20 lg:pt-0 lg:border-t-[0.5px] lg:border-t-mist flex flex-col lg:flex-row w-full grid-lines"
            style={{ ["--grid-line-color" as string]: "#F8F6E880" }}
          >
            {/* LEFT 2/3 */}
            <div className="lg:w-2/3 pt-10 pb-5 lg:py-10 z-[2] relative px-5 lg:pl-10 flex flex-col gap-6 justify-between">
              <h1 className="text-mist text-h3 font-bold flex flex-col font-heading">
                <span>Apoie a</span>
                <span>Pax Brasiliana</span>
              </h1>
              <div className="lg:max-w-[412px] text-mist text-paragraphs flex flex-col gap-8">
                <p>
                  Somos uma organização sem fins lucrativos. 100% das doações
                  financiam diretamente a missão: reacender a capacidade do
                  Brasil de construir indústria, tecnologia e cultura.
                </p>
                <p>
                  Doe uma vez ou torne-se um apoiador mensal. Cada real constrói
                  algo.
                </p>
              </div>
            </div>

            {/* RIGHT 1/3 */}
            <div className="lg:w-1/3 z-[2] relative px-2.5 lg:pr-5 lg:pl-0 flex-1">
              <div className="px-2.5 lg:px-5 relative py-5 lg:py-10 border-t-[0.5px] border-t-mist/50 lg:border-t-0 h-full">
                <img
                  src="/images/pattern-bg.png"
                  alt=""
                  className="absolute inset-0 w-full z-[1] h-full object-cover"
                />
                <DonationForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
