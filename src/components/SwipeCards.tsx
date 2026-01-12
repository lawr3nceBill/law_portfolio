"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface SwipeCardsProps {
  className?: string;
}

const SwipeCards = ({ className }: SwipeCardsProps) => {
  const [cards, setCards] = useState<Card[]>(cardData);

  const resetCards = () => {
    setCards(cardData);
  };

  return (
    <div
      className={cn(
        "relative grid h-[233px] w-[175px] place-items-center",
        className,
      )}
    >
      {cards.length === 0 && (
        <div style={{ gridRow: 1, gridColumn: 1 }} className="z-20">
          <Button onClick={resetCards} variant={"outline"}>
            <RefreshCw className="size-4" />
            Again
          </Button>
        </div>
      )}
      {cards.map((card) => {
        return (
          <Card key={card.id} cards={cards} setCards={setCards} {...card} />
        );
      })}
    </div>
  );
};

const Card = ({
  id,
  url,
  setCards,
  cards,
}: {
  id: number;
  url: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
}) => {
  const x = useMotionValue(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dominantColor, setDominantColor] = useState<string>("");

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1]?.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const loadImage = () => {
      // Set canvas size to a smaller version for faster processing
      canvas.width = 100;
      canvas.height = 100;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, 100, 100);

      try {
        // Get image data
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;

        // Calculate average color
        let r = 0,
          g = 0,
          b = 0;
        let count = 0;

        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Increase saturation for more vibrant glow
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;

        if (saturation < 0.3) {
          // Boost colors if too dull
          const boost = 1.5;
          r = Math.min(255, Math.floor(r * boost));
          g = Math.min(255, Math.floor(g * boost));
          b = Math.min(255, Math.floor(b * boost));
        }

        setDominantColor(`${r}, ${g}, ${b}`);
      } catch (error) {
        // CORS error or other issue, use default color
        setDominantColor("139, 92, 246"); // Default purple
      }
    };

    if (img.complete) {
      loadImage();
    } else {
      img.addEventListener("load", loadImage);
      return () => img.removeEventListener("load", loadImage);
    }
  }, [url]);

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 100) {
      // If swiped far enough, remove the card
      setCards((pv) => pv.filter((v) => v.id !== id));
    } else {
      // Otherwise, animate the card back to the center
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    }
  };

  return (
    <motion.div
      className="absolute h-[233px] w-[175px] origin-bottom hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        boxShadow: isFront && dominantColor
          ? `0 0 40px rgba(${dominantColor}, 0.6), 0 0 80px rgba(${dominantColor}, 0.4), 0 10px 15px -3px rgb(0 0 0 / 0.3)`
          : isFront
            ? "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)"
            : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: -150,
        right: 150,
        top: 0,
        bottom: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      <img
        ref={imgRef}
        src={url}
        alt="Placeholder alt"
        className="h-full w-full rounded-lg bg-white object-cover"
        draggable="false"
        crossOrigin="anonymous"
      />
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <p className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Based in UAE 🇦🇪 🌞
        </p>
      </div>
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
};

const cardData: Card[] = [
  {
    id: 1,
    url: "/img/law-1.jpeg",
  },
  {
    id: 2,
    url: "/img/law-2.jpeg",
  },
];
