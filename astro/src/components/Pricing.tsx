import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type VehicleType = "Hatchback" | "Sedan" | "Crossover" | "Pickups" | "SUVs";

const VEHICLE_TYPES: VehicleType[] = ["Hatchback", "Sedan", "Crossover", "Pickups", "SUVs"];

type PricingPlan = {
  plan_bg_color: string;
  plan_name: string;
  plan_descp: string;
  plan_price: Partial<Record<VehicleType, number>>;
  serviceId: string;
  plan_feature: string[];
};

const pricingData: PricingPlan[] = [
  {
    plan_bg_color: "bg-gray-500/10",
    plan_name: "Silver Detailing Package",
    plan_descp: "Professional car detailing for everyday needs",
    plan_price: {
      Hatchback: 6500,
      Sedan: 7500,
      Crossover: 8500,
      Pickups: 10000,
    },
    serviceId: "silver",
    plan_feature: [
      "Complete Floor Vacuum",
      "Dashboard Cleaning",
      "All Tyres Cleaning",
      "p-H Neutral Foam Wash",
    ],
  },
  {
    plan_bg_color: "bg-yellow-500/20",
    plan_name: "Gold Detailing Package",
    plan_descp: "Enhanced detailing with wax protection and deeper cleaning",
    plan_price: {
      Hatchback: 10000,
      Sedan: 11000,
      Crossover: 13000,
      Pickups: 14000,
      SUVs: 16000,
    },
    serviceId: "gold",
    plan_feature: [
      "All Silver Package Features",
      "All Seats Surface Vacuum",
      "Centre Console Cleaning",
      "Interior Plastics Polishing",
      "Safe Wash Technique",
      "Door Handles Cleaning",
      "Engine Bay Cleaning",
    ],
  },
  {
    plan_bg_color: "bg-cyan-500/10",
    plan_name: "Diamond Detailing Package",
    plan_descp:
      "Full body ceramic coating with complete deep detailing — the ultimate protection",
    plan_price: {
      Hatchback: 22000,
      Sedan: 25000,
      Crossover: 28000,
      Pickups: 31000,
      SUVs: 34000,
    },
    serviceId: "diamond",
    plan_feature: [
      "All Gold Package Features",
      "Tyres Dressing & Shining",
      "Streak-Free Glass Cleaning",
      "Body Waxing / Polishing",
    ],
  },
];

export function Pricing() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("Sedan");
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 80,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : index * 0.2,
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const getPrice = (plan: PricingPlan) => plan.plan_price[selectedVehicle];

  return (
    <section className="bg-background py-10 xl:py-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8">
        <div className="flex flex-col gap-8 md:gap-12 justify-center items-center w-full">
          {/* Heading */}
          <div className="flex flex-col gap-4 justify-center items-center animate-in fade-in slide-in-from-top-8 duration-700 ease-in-out">
            <Badge
              variant={"outline"}
              className="py-1 px-3 text-sm font-normal leading-5 w-fit h-7"
            >
              Pricing
            </Badge>
            <div className="max-w-3xs sm:max-w-md mx-auto text-center">
              <h2 className="text-foreground text-3xl sm:text-5xl font-medium">
                Pick the plan that fits your car
              </h2>
            </div>
          </div>

          {/* Vehicle Type Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {VEHICLE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedVehicle(type)}
                aria-pressed={selectedVehicle === type}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedVehicle === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {pricingData?.map((items: PricingPlan, index: number) => {
              const price = getPrice(items);
              if (!price) return null;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  className={cn("w-full")}
                >
                  <Card
                    className={cn(
                      items.plan_bg_color,
                      "p-8 sm:p-10 rounded-2xl ring-0 w-full h-full"
                    )}
                  >
                    <CardContent className="flex flex-col gap-6 h-full px-0">
                      <div className="flex flex-col gap-3">
                        <Badge
                          className="py-1 px-3 text-sm font-normal leading-5 h-auto whitespace-normal w-fit"
                        >
                          {items.plan_name}
                        </Badge>
                        <p className="text-sm font-normal text-muted-foreground">
                          {items.plan_descp}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
                          {selectedVehicle} Price
                        </p>
                        <p className="text-4xl sm:text-5xl font-semibold text-card-foreground">
                          PKR {price.toLocaleString()}
                        </p>
                      </div>

                      <Button
                        asChild
                        className="relative bg-white hover:bg-white hover:text-black dark:hover:text-black text-black text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden"
                      >
                        <a href={`/calendar?service=${items.serviceId}`}>
                          <span className="relative z-10 transition-all duration-500">
                            Book This Service
                          </span>
                          <div className="absolute right-1 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                            <ArrowUpRight size={16} />
                          </div>
                        </a>
                      </Button>

                      <Separator />

                      <div className="flex flex-col items-start gap-3">
                        <p className="text-card-foreground text-base sm:text-xl font-normal sm:font-medium">
                          Features
                        </p>
                        <ul className="flex flex-col items-start self-stretch gap-3">
                          {items.plan_feature?.map(
                            (feature: string, idx: number) => {
                              return (
                                <li
                                  key={idx}
                                  className="flex items-center gap-3 text-card-foreground text-base font-normal tracking-normal"
                                >
                                  <BadgeCheck size={16} aria-hidden="true" />
                                  {feature}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
