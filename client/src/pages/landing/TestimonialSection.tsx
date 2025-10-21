import { Star } from "lucide-react";

const testimonials = [
  {
    id: "01",
    name: "Andi Wijaya, Kopi Senja",
    quote:
      "Benar-benar game-changer! Dulu pusing dengan nota yang menumpuk, sekarang semua tercatat otomatis. CekSaku membuat saya bisa lebih fokus mengembangkan bisnis, bukan lagi sibuk administrasi.",
  },
  {
    id: "02",
    name: "Siti Aisyah, Pemilik Toko Online",
    quote:
      "Awalnya saya tidak percaya bisa mengelola keuangan bisnis serapi ini. Laporan bulanan dari CekSaku sangat membantu saya melihat pos pengeluaran terbesar. Akhirnya bisa nabung untuk stok barang lebih banyak!",
  },
];

const TestimonialSection = () => {
  return (
    <section className="relative w-full 00 text-gray-200 py-32 md:py-48 overflow-hidden">
      <div className="container mx-auto px-4 relative h-[600px] md:h-[500px]">
        <h2
          className="font-serif text-7xl md:text-9xl lg:text-[10rem] text-center text-white/10 absolute inset-0 flex items-center justify-center z-0"
          aria-hidden="true"
        >
          Apa Kata
          <br /> Mereka?
        </h2>

        <div className="absolute top-8 left-4 md:left-12 lg:left-24 z-10">
          <div className="flex gap-1">
            <Star className="text-blue-400 fill-blue-400" size={20} />
            <Star className="text-blue-400 fill-blue-400" size={20} />
            <Star className="text-blue-400 fill-blue-400" size={20} />
            <Star className="text-blue-400 fill-blue-400" size={20} />
            <Star className="text-blue-400 fill-blue-400" size={20} />
          </div>
        </div>

        {/* 2. Kartu Testimoni Pertama (Kanan Atas) */}
        <div className="absolute top-0 right-4 md:right-12 lg:right-24 z-20 w-80 md:w-96">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <span className="text-sm text-white/40">({testimonials[0].id})</span>
            <blockquote className="mt-4 text-base leading-relaxed">
              {testimonials[0].quote}
            </blockquote>
            <cite className="mt-4 block text-right text-sm not-italic text-white/60">
              — {testimonials[0].name}
            </cite>
          </div>
        </div>

        {/* 3. Kartu Testimoni Kedua (Kiri Bawah) */}
        <div className="absolute top-1/2 left-4 md:left-12 lg:left-24 z-20 w-80 md:w-96">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <span className="text-sm text-white/40">({testimonials[1].id})</span>
            <blockquote className="mt-4 text-base leading-relaxed">
              {testimonials[1].quote}
            </blockquote>
            <cite className="mt-4 block text-right text-sm not-italic text-white/60">
              — {testimonials[1].name}
            </cite>
          </div>
        </div>

        {/* 4. Statistik (Kanan Bawah) */}
        <div className="absolute bottom-0 right-4 md:right-12 lg:right-24 z-10 flex flex-col md:flex-row gap-8 md:gap-16 text-center">
          <div>
            <p className="text-4xl md:text-5xl font-semibold">1200+</p>
            <p className="text-sm text-white/50">Ulasan</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-semibold">10.000+</p>
            <p className="text-sm text-white/50">Pengguna Puas</p>
          </div>
        </div>
      </div>
       {/* Garis Bawah */}
       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
    </section>
  );
};

export default TestimonialSection;