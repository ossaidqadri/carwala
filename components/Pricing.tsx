"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

type PricingPlan = {
  plan_bg_color: string;
  plan_name: string;
  plan_descp: string;
  plan_price: number;
  plan_feature: string[];
  serviceId: string;
};

const pricingData: PricingPlan[] = [
  {
    plan_bg_color: "bg-gray-500/10",
    plan_name: "Silver Detailing Package",
    plan_descp: "Professional car detailing for everyday needs",
    plan_price: 6500,
    serviceId: "silver",
    plan_feature: [
      "p-H Neutral Foam Wash",
      "Safe Hand Wash Technique",
      "Tyres Cleaning & Dressing",
      "Engine Bay Basic Cleaning",
      "Streak-Free Glass Cleaning",
      "Interior Vacuum & Cleaning",
      "Dashboard & Console Cleaning",
    ],
  },
  {
    plan_bg_color: "bg-yellow-500/20",
    plan_name: "Gold Detailing Package",
    plan_descp: "Enhanced detailing with wax protection and deeper cleaning",
    plan_price: 10000,
    serviceId: "gold",
    plan_feature: [
      "All Things Of Basic Package",
      "Double-Stage Wax Protection",
      "Full Engine Bay (Deep Cleaning)",
      "Trunk / Boot (Complete Cleaning)",
      "All Things Of Basic Package",
      "Improved Interior Detailing & Finishing",
    ],
  },
  {
    plan_bg_color: "bg-amber-600/20",
    plan_name: "Platinum Detailing Package",
    plan_descp: "Premium detailing with paint correction and complete interior restoration",
    plan_price: 14000,
    serviceId: "platinum",
    plan_feature: [
      "All Silver & Gold Package Features",
      "Full Body Polishing & Compounding",
      "Advanced Paint Finishing",
      "Interior Deep Cleaning",
      "Seats Shampooing & Detailing",
      "Mats & Carpets Deep Wash",
      "Complete Interior Restoration",
    ],
  },
  {
    plan_bg_color: "bg-red-500/20",
    plan_name: "Deep Detailing Package",
    plan_descp: "Specialized cleaning for freshly imported cars from Japan",
    plan_price: 20000,
    serviceId: "detailed",
    plan_feature: [
      "All Things of Basic, Gold & Platinum Package",
      "Complete Deep Cleaning of Everything",
      "Complete Deep Detailing of Everything",
    ],
  },
  {
    plan_bg_color: "bg-cyan-500/10",
    plan_name: "Diamond Detailing Package",
    plan_descp: "Full body ceramic coating with complete deep detailing — the ultimate protection",
    plan_price: 22000,
    serviceId: "diamond",
    plan_feature: [
      "Full Body Premium Quality Ceramic Coating",
      "All Things Of Basic, Gold & Platinum Package",
      "Complete Deep Cleaning of Everything",
      "Full Deep Detailing of Everything",
    ],
  },
];

export function Pricing() {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <section className="bg-background py-10 xl:py-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-16 lg:py-20 sm:py-16 py-8">
        <div className="flex flex-col gap-8 md:gap-12 justify-center items-center w-full">
          {/* Heading */}
          <div className="flex flex-col gap-4 justify-center items-center animate-in fade-in slide-in-from-top-8 duration-700 ease-in-out">
            {/* Badge */}
            <Badge
              variant={"outline"}
              className="py-1 px-3 text-sm font-normal leading-5 w-fit h-7"
            >
              Pricing
            </Badge>
            {/* Heading */}
            <div className="max-w-3xs sm:max-w-md mx-auto text-center">
              <h2 className="text-foreground text-3xl sm:text-5xl font-medium">
                Pick the plan that fits your car
              </h2>
            </div>
          </div>
          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {pricingData?.map((items: PricingPlan, index: number) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                className={cn(
                  "w-full",
                  index === pricingData.length - 1 && pricingData.length % 2 !== 0 && "md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto"
                )}
              >
                <Card
                  className={cn(
                    items.plan_bg_color,
                    "p-8 sm:p-10 rounded-2xl ring-0 w-full",
                  )}
                  key={index}
                >
                  <CardContent className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start self-stretch px-0 h-full w-full">
                    <div className="flex flex-col items-start justify-between self-stretch gap-6">
                      <div className="flex flex-col gap-3">
                        <Badge className="py-1 px-3 text-sm font-normal leading-5 h-auto whitespace-normal">
                          {items.plan_name}
                        </Badge>
                        <p className="text-sm font-normal text-muted-foreground max-w-56">
                          {items.plan_descp}
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
                            Starting from
                          </p>
                          <p className="text-4xl sm:text-5xl font-semibold text-card-foreground flex items-end">
                            PKR {items.plan_price.toLocaleString()}
                          </p>
                        </div>
                        <Link href={`/calendar?service=${items.serviceId}`}>
                          <Button className="relative bg-white hover:bg-white hover:text-black dark:hover:text-black text-black text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden">
                            <span className="relative z-10 transition-all duration-500">
                              Book This Service
                            </span>
                            <div className="absolute right-1 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                              <ArrowUpRight size={16} />
                            </div>
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="hidden lg:block"
                    />
                    <Separator
                      orientation="horizontal"
                      className="lg:hidden block"
                    />
                    <div className="flex flex-col items-start gap-3 grow">
                      <p className="text-card-foreground text-base sm:text-xl font-normal sm:font-medium">
                        Features
                      </p>
                      <ul className="flex flex-col items-start self-stretch gap-3">
                        {items.plan_feature?.map(
                          (feature: string, index: number) => {
                            return (
                              <li
                                key={index}
                                className="flex items-center gap-3 text-card-foreground text-base font-normal tracking-normal"
                              >
                                <BadgeCheck size={16} aria-hidden="true" />
                                {feature}
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
