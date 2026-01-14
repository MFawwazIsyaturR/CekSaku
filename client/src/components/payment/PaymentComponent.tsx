import { useState } from 'react';
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { useCreateSubscriptionPaymentMutation } from "@/features/payment/paymentAPI";
import { SubscriptionPlan } from "@/features/payment/paymentType";

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 29900, // IDR 29,900
    currency: 'IDR',
    period: 'month',
    features: [
      'Up to 50 transactions/month',
      'Basic analytics',
      'Email support',
      'Standard reports'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 59900, // IDR 59,900
    currency: 'IDR',
    period: 'month',
    features: [
      'Unlimited transactions',
      'Advanced analytics',
      'Priority support',
      'Custom reports',
      'Automated categorization',
      'Goal tracking'
    ]
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    price: 99900, // IDR 99,900
    currency: 'IDR',
    period: 'month',
    features: [
      'Everything in Premium',
      'Multi-account management',
      'Export to multiple formats',
      'API access',
      'Dedicated account manager'
    ]
  }
];

const PaymentComponent = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useTypedSelector((state) => state.auth);
  
  const [createSubscriptionPayment, { isLoading: isCreatingPayment }] = useCreateSubscriptionPaymentMutation();

  const handlePayment = async (plan: SubscriptionPlan) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createSubscriptionPayment({
        userId: user?.id || '',
        plan: plan.name,
        price: plan.price,
        currency: plan.currency
      }).unwrap();

      const { token } = response;

      // Load Midtrans SNAP script dynamically
      const script = document.createElement('script');
      // Use VITE environment variables (Vite uses VITE_ prefix)
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; 
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
      
      script.onload = () => {
        // @ts-ignore
        window.snap.pay(token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            alert('Payment successful!');
            setIsLoading(false);
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            alert('Payment pending, please complete the transaction');
            setIsLoading(false);
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            alert('Payment failed, please try again');
            setIsLoading(false);
          },
          onClose: function() {
            console.log('Customer closed the popup');
            setIsLoading(false);
          }
        });
      };

      document.body.appendChild(script);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Select a subscription plan that fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${
              selectedPlan.id === plan.id ? 'border-primary border-2' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {selectedPlan.id === plan.id && (
                  <Badge variant="secondary">Popular</Badge>
                )}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: plan.currency,
                    minimumFractionDigits: 0
                  }).format(plan.price)}
                </span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <CardDescription>
                Perfect for {plan.id === 'basic' ? 'individuals' : 
                           plan.id === 'premium' ? 'small businesses' : 
                           'enterprises'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setSelectedPlan(plan);
                  handlePayment(plan);
                }}
                disabled={isLoading}
              >
                {isLoading && selectedPlan.id === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentComponent;