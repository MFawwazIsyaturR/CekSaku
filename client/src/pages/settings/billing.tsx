import { Badge } from "@/components/ui/badge"; 
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useState } from "react";

type PlanFeature = {
  text: string;
  footnote?: string;
  negative?: boolean;
};

const features: PlanFeature[] = [
  { text: "Unlimited transactions" },
  { text: "Unlimited accounts" },
  { text: "Unlimited budgets" },
  { text: "Unlimited categories" },
  { text: "AI receipt scanning", footnote: "10 scans per month" },
  { text: "Advanced analytics" },
  { text: "Export data (CSV, PDF)" },
  { text: "Priority support" },
];

const plans = [
  {
    name: "Free",
    price: 0,
    features: features.slice(0, 4),
    isMostPopular: false,
    isCurrent: true,
  },
  {
    name: "Pro",
    price: 75000,
    features: features,
    isMostPopular: true,
    isCurrent: false,
  },
];

function PlanFeature({ text, footnote, negative }: PlanFeature) {
  return (
    <li className="flex items-center gap-2">
      {negative ? (
        <X className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Check className="h-4 w-4 text-primary" />
      )}
      <span
        className={cn("text-sm", { "text-muted-foreground": negative })}
      >
        {text}
      </span>
      {footnote && (
        <span className="ml-1 text-xs text-muted-foreground">({footnote})</span>
      )}
    </li>
  );
}

function Billing() {
  const [isYearly, setIsYearly] = useState(false);
  const toggleBilling = () => setIsYearly(!isYearly);

  return (
    <div className="p-1">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex justify-center">
          <div
            onClick={toggleBilling}
            className="inline-flex cursor-pointer items-center rounded-full bg-muted p-1"
          >
            <Button
              variant={!isYearly ? "default" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              Monthly
            </Button>
            <Button
              variant={isYearly ? "default" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              Yearly (Save 20%)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn("flex flex-col", {
                "border-2 border-primary shadow-lg": plan.isMostPopular,
              })}
            >
              <CardHeader className="relative">
                {plan.isMostPopular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">
                    {isYearly
                      ? `Rp${(plan.price * 12 * 0.8).toLocaleString("id-ID")}`
                      : `Rp${plan.price.toLocaleString("id-ID")}`}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.price > 0 ? (isYearly ? "/year" : "/month") : ""}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <PlanFeature key={feature.text} {...feature} />
                  ))}
                  {plan.name === "Free" &&
                    features
                      .slice(4)
                      .map((feature) => (
                        <PlanFeature
                          key={feature.text}
                          {...feature}
                          negative
                        />
                      ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={plan.isCurrent}
                  variant={plan.isMostPopular ? "default" : "outline"}
                >
                  {plan.isCurrent
                    ? "Current Plan"
                    : plan.name === "Free"
                    ? "Downgrade"
                    : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Billing;
