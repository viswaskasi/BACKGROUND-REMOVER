import ImageUploader from "@/components/ImageUploader";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-20 px-4 md:px-8">
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-background to-background -z-10 pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary mb-6 ring-1 ring-primary/30">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Next-Gen AI Background Removal</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-4">
          Remove Backgrounds with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Unmatched Precision</span>
        </h1>

        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl">
          Instantly transform your images with our high-performance AI. Whether it&apos;s a product, portrait, or complex object, we&apos;ll isolate it flawlessly in seconds.
        </p>

        <ImageUploader />
      </div>

      {/* Professional Footer */}
      <footer className="mt-auto pt-24 pb-4 text-center text-sm text-muted-foreground/60 font-medium tracking-wide">
        Expertly crafted by Viswas
      </footer>
    </main>
  );
}
