import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import Logo from "@/components/logo/logo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowDown, BarChart, FileText, Import, ScanLine } from "lucide-react";
import "./landing.css";
import React, { useState } from "react";
import warrenBuffettImg from "@/assets/images/warren-buffett.png";
import mockupImg from "@/assets/images/mockup-ceksaku.png";
import { Plus, Minus } from "lucide-react";
import PricingSection from "./PricingSection";

const leftFeatures = [
  {
    title: "Lacak Otomatis",
    description:
      "Pindai struk dan catat pengeluaran tanpa perlu input manual yang melelahkan.",
  },
  {
    title: "Analisis Mendalam",
    description:
      "Pahami kebiasaan finansial Anda melalui grafik yang intuitif dan mudah dibaca.",
  },
];
const rightFeatures = [
  {
    title: "Laporan Cerdas",
    description:
      "Dapatkan ringkasan bulanan otomatis lengkap dengan wawasan dari AI.",
  },
  {
    title: "Impor & Ekspor Fleksibel",
    description:
      "Pindahkan data Anda dengan mudah kapan pun Anda butuhkan menggunakan format CSV.",
  },
];
const features = [
  {
    icon: <ScanLine />,
    title: "AI Receipt Scanner",
    description:
      "Unggah dan pindai struk Anda secara otomatis. Biarkan AI kami yang bekerja.",
  },
  {
    icon: <BarChart />,
    title: "Advanced Analytics",
    description:
      "Dapatkan wawasan mendalam tentang keuangan Anda dengan grafik interaktif.",
  },
  {
    icon: <Import />,
    title: "Impor & Ekspor CSV",
    description:
      "Impor transaksi dari file CSV dengan mudah, dan ekspor data Anda kapan saja.",
  },
  {
    icon: <FileText />,
    title: "Laporan Bulanan Otomatis",
    description:
      "Terima laporan keuangan bulanan yang informatif langsung ke email Anda.",
  },
];

const faqData = [
  {
    question: "Apa itu CekSaku?",
    answer:
      "CekSaku adalah website keuangan pribadi cerdas yang dirancang untuk membantu Anda melacak pemasukan, mengelola pengeluaran, dan mendapatkan wawasan finansial dengan bantuan teknologi AI.",
  },
  {
    question: "Bagaimana cara CekSaku membantu keuangan saya?",
    answer:
      "Dengan mencatat semua transaksi Anda, CekSaku memberikan gambaran jelas ke mana uang Anda pergi. Fitur analitik dan laporan bulanan membantu Anda mengidentifikasi pola pengeluaran, menemukan area untuk berhemat, dan mencapai tujuan keuangan Anda lebih cepat.",
  },
  {
    question: "Apakah data keuangan saya aman?",
    answer:
      "Tentu saja. Kami menggunakan enkripsi standar industri untuk melindungi data Anda. Privasi dan keamanan Anda adalah prioritas utama kami.",
  },
  {
    question: "Apakah saya harus memasukkan semua data secara manual?",
    answer:
      "Tidak sepenuhnya. Untuk pengeluaran, Anda bisa menggunakan fitur pindai struk (AI Scan) kami untuk mencatat transaksi secara otomatis. Anda juga bisa mengimpor data transaksi dari file CSV jika Anda sudah memilikinya.",
  },
  {
    question: "Apakah CekSaku gratis untuk digunakan?",
    answer:
      "Ya, kami menawarkan paket gratis yang mencakup fitur-fitur esensial untuk mengelola keuangan Anda. Kami juga memiliki paket premium dengan fitur lebih lanjut untuk analisis yang lebih mendalam. Tapi untuk saat ini semua fitur kami masih bersifat gratis.",
  },
  {
    question: "Di perangkat apa saja CekSaku bisa diakses?",
    answer:
      "CekSaku adalah website, sehingga Anda dapat mengaksesnya dari perangkat apa saja yang memiliki browser internet, seperti laptop, PC, tablet, dan smartphone.",
  },
];

const LandingPage = () => {
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");

    const elem = document.getElementById(targetId);

    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="hero-section-gradient relative flex flex-col h-[100vh] items-center justify-center text-slate-50 transition-bg">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4">
          
          <header className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-6">
            <nav className="flex items-center justify-between w-full max-w-6xl mx-auto px-6 py-3"> {/* Tetap justify-between */}
              {/* Logo di Kiri */}
              <Logo url="/" />

              {/* Tautan Tengah */}
              <div className="hidden md:flex items-center gap-6 bg-black/40 px-4 py-4 rounded-full">
                <Link
                  to="/syarat-ketentuan"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
                <Link
                  to="/kontak"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Kontak
                </Link>
              </div>

              {/* Tautan Auth di Kanan */}
              <div className="flex items-center gap-6">
                <Link
                  to={AUTH_ROUTES.SIGN_UP}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Daftar
                </Link>
                <Link to={AUTH_ROUTES.SIGN_IN} className="flex items-center">
                  <button className="final-cta-button cursor-pointer !mt-0 !h-10 !px-6 !py-2 !text-sm">
                    Masuk
                  </button>
                </Link>
              </div>
            </nav>
          </header>
          <div className="flex flex-col items-center text-center max-w-4xl mt-26">
            <h1
              className="text-5xl md:text-7xl font-bold hero-title-gradient opacity-0"
              style={{ animation: `reveal-up 1s ease 0.2s forwards` }}
            >
              Ingat Uang <br /> Ingat CekSaku
            </h1>
            <p
              className="mt-6 text-lg max-w-2xl text-gray-300 opacity-0"
              style={{ animation: `reveal-up 1s ease 0.5s forwards` }}
            >
              Ucapkan selamat tinggal pada pusingnya atur uang. CekSaku hadir
              untuk semua kalangan. Kini, Anda bisa mengelola keuangan pribadi
              layaknya seorang ahli—dengan cara yang sederhana, intuitif, dan
              pastinya tidak membosankan.
            </p>
            <ScrollReveal>
              <div className="mt-8 flex flex-col items-center gap-4">
                <Link to={AUTH_ROUTES.SIGN_UP}>
                  <button className="final-cta-button h-12 w-48 text-base cursor-pointer">
                    Mulai Sekarang
                  </button>
                </Link>
                <a
                  href="#mockup"
                  onClick={handleScroll}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-4"
                >
                  Pelajari lebih lanjut <ArrowDown size={16} />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="page-content">
        <section id="mockup" className="mockup-section">
          <div className="mockup-container-v2">
            <ScrollReveal className="features-top-left">
              {leftFeatures.map((feature, i) => (
                <div key={i} className="mockup-feature">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </ScrollReveal>
            <div className="mockup-image-center">
              <img src={mockupImg} alt="CekSaku App Mockup" />
            </div>
            <ScrollReveal className="features-bottom-right">
              {rightFeatures.map((feature, i) => (
                <div key={i} className="mockup-feature">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>
        <section className="info-section">
          <ScrollReveal>
            <div className="info-block my-24">
              <h2 className="info-headline hero-title-gradient">
                Siapa bilang mengelola keuangan itu membosankan?
              </h2>
              <p className="info-paragraph mt-12">
                Dengan CekSaku, wujudkan kebebasan finansial Anda. Platform
                intuitif kami memberikan kejelasan penuh atas arus kas,
                menyederhanakan keputusan finansial yang cerdas, dan menempatkan
                kekuatan untuk membangun kekayaan Anda di ujung jari Anda.
                Tinggalkan cara lama. Kelola keuangan Anda dengan cerdas dan
                modern.
              </p>
            </div>
          </ScrollReveal>
        </section>
        <section id="features" className="py-20 px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold hero-title-gradient">
              Fitur Unggulan
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Semua yang Anda butuhkan untuk mengontrol keuangan Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="feature-card h-full">
                  <div className="p-6">
                    <div className="text-blue-400 mb-4">
                      {React.cloneElement(feature.icon, { size: 32 })}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
        <section id="faq" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <ScrollReveal>
                <h2
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl hero-title-gradient opacity-0"
                  style={{ animation: `reveal-up 1s ease 0.5s forwards` }}
                >
                  Frequently Asked Questions
                </h2>
              </ScrollReveal>
            </div>
            <div className="mx-auto mt-16 max-w-3xl">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((item, index) => (
                  <AccordionItem
                    value={`item-${index}`}
                    key={index}
                    className="rounded-lg border-none bg-white/3 
             transition-all duration-300 ease-in-out 
             hover:scale-[1.05]
             "
                  >
                    <AccordionTrigger
                      className="group flex w-full items-center justify-between p-6 text-left text-white hover:no-underline
             [&>svg.transition-transform]:hidden"
                    >
                      <span className="flex-1">{item.question}</span>
                      <Plus className="h-5 w-5 shrink-0 group-data-[state=open]:hidden" />
                      <Minus className="h-5 w-5 shrink-0 group-data-[state=closed]:hidden" />
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-0 text-gray-300 text-base">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        <section className="quote-section my-24 overflow-x-hidden px-4">
          <ScrollReveal>
            <div className="mt-10 rounded-xl bg-gradient-to-l from-gray-400 via-gray-600 to-gray-black p-1">
              <div
                className="rounded-lg p-8"
                style={{ backgroundColor: "#0c0c0f" }}
              >
                <div className="quote-container">
                  <div className="quote-text-wrapper">
                    <blockquote
                      className="quote-text-interactive"
                      onMouseEnter={() => setIsQuoteHovered(true)}
                      onMouseLeave={() => setIsQuoteHovered(false)}
                    >
                      {isQuoteHovered ? (
                        <span className="quote-lang-id">
                          "<b>Jangan simpan</b> apa yang tersisa{" "}
                          <b>setelah dibelanjakan</b>; sebaliknya,{" "}
                          <b>belanjakan</b> apa yang tersisa{" "}
                          <b>setelah disimpan</b>."
                        </span>
                      ) : (
                        <span className="quote-lang-en">
                          "<b>Do not save</b> what is left <b>after spending</b>
                          ; instead <b>spend</b> what is left{" "}
                          <b>after saving</b>."
                        </span>
                      )}
                    </blockquote>
                    <cite>— Warren Buffett</cite>
                  </div>
                  <div className="quote-image-wrapper">
                    <img src={warrenBuffettImg} alt="Warren Buffett" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <PricingSection />

        <section className="final-section">
          <ScrollReveal>
            <div className="final-cta-container mt-48 mb-48">
              <h2 className="final-cta-title hero-title-gradient">
                Siap untuk mengendalikan keuangan Anda?
              </h2>
              <p className="final-cta-subtitle">
                Tidak ada waktu yang lebih baik dari sekarang untuk memulai
                perjalanan
              </p>
              <Link to={AUTH_ROUTES.SIGN_IN}>
                <button className="final-cta-button cursor-pointer">
                  Mulai sekarang
                </button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="footer-separator" />

        <div className="footer-content">
            <div className="footer-links">
              <div className="left-links flex flex-wrap gap-x-6 gap-y-2"> {/* Tambahkan flex-wrap dan gap */}
                <span>
                  &copy; {new Date().getFullYear()} CekSaku. All rights reserved
                </span>
                <Link to="/syarat-ketentuan" className="hover:text-gray-300">
                  Syarat & Ketentuan
                </Link>
                <Link to="/kontak" className="hover:text-gray-300"> {/* <-- Tautan Kontak di Footer */}
                  Kontak
                </Link>
                {/* <Link to="/kebijakan-privasi" className="hover:text-gray-300">
                  Kebijakan Privasi
                </Link> */}
              </div>
               {/* <div className="social-links">
                  // Link sosial media
                </div> */}
            </div>
            <div className="footer-disclaimer">
              <p>
                CekSaku is a trademark of CekSaku Technologies Inc. Any other
                trademarks are the property of their respective owners. Unless
                otherwise noted, use of third party logos does not imply
                endorsement of, sponsorship of, or affiliation with CekSaku.
              </p>
            </div>
          </div>
      </section>
      </div>
    </>
  );
};

export default LandingPage;
