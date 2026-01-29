import { motion } from "framer-motion";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Medicine } from "@/types/prescription";

interface MedicineTableProps {
  medicines: Medicine[];
  selectedMedicine: string | null;
  onSelectMedicine: (name: string) => void;
}

const TimingCell = ({ value }: { value: "Yes" | "No" }) => (
  <div className="flex justify-center">
    {value === "Yes" ? (
      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-success" />
      </div>
    ) : (
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
        <X className="w-4 h-4 text-muted-foreground" />
      </div>
    )}
  </div>
);

const MedicineTable = ({ medicines, selectedMedicine, onSelectMedicine }: MedicineTableProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
      setScrollProgress(scrollLeft / (scrollWidth - clientWidth));
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      // Initial check
      setTimeout(checkScroll, 100);
      // Handle resize
      window.addEventListener("resize", checkScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [medicines]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 shadow-card-elevated"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Medicines ({medicines.length})
        </h3>
        
        {/* Custom Scroll Slider UI - Compact version for header if needed, but we keep it below */}
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className="grid grid-cols-10 gap-4 py-3 border-b border-border text-sm font-medium text-muted-foreground">
              <div className="col-span-2">Medicine</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Freq</div>
              <div className="text-center">AM</div>
              <div className="text-center">PM</div>
              <div className="text-center">Night</div>
              <div className="col-span-2">Instructions</div>
              <div className="text-center">Duration</div>
            </div>

            {/* Table Body */}
            {medicines.map((medicine, index) => (
              <motion.div
                key={`${medicine.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectMedicine(medicine.name)}
                className={`
                  grid grid-cols-10 gap-4 py-4 border-b border-border/50 text-sm cursor-pointer
                  hover:bg-accent/30 transition-colors
                  ${selectedMedicine === medicine.name ? "bg-accent/50" : ""}
                `}
                role="button"
                tabIndex={0}
              >
                <div className="col-span-2">
                  <span className="font-semibold text-foreground">{medicine.name}</span>
                </div>
                <div className="text-center text-muted-foreground">{medicine.quantity}</div>
                <div className="text-center font-mono text-muted-foreground">{medicine.frequency}</div>
                <TimingCell value={medicine.timing.morning} />
                <TimingCell value={medicine.timing.afternoon} />
                <TimingCell value={medicine.timing.night} />
                <div className="col-span-2 text-muted-foreground">
                  {medicine.timing.instruction !== "-" ? medicine.timing.instruction : "-"}
                </div>
                <div className="text-center text-muted-foreground">
                  {medicine.duration !== "-" ? medicine.duration : "-"}
                </div>
              </motion.div>
            ))}

            {medicines.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No medicines found in the prescription
              </div>
            )}
          </div>
        </div>

        {/* Custom Scroll Slider UI */}
        <div className="flex items-center gap-4 mt-4 px-2">
          <button
            onClick={() => scroll("left")}
            disabled={!showLeftArrow}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent disabled:opacity-30 transition-all text-muted-foreground"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 h-2 bg-muted rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute h-full bg-primary rounded-full"
              initial={false}
              animate={{ 
                left: `${scrollProgress * 80}%`, // Adjust based on thumb width
                width: "20%" // Fixed thumb width for better look
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            />
          </div>

          <button
            onClick={() => scroll("right")}
            disabled={!showRightArrow}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent disabled:opacity-30 transition-all text-muted-foreground"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineTable;
