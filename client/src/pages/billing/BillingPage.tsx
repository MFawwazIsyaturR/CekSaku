import { useEffect } from 'react';
import { useTypedSelector } from '@/app/hook';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, Check, X, Crown, History } from "lucide-react";
import PaymentComponent from '@/components/payment/PaymentComponent';

const BillingPage = () => {
  const { user } = useTypedSelector((state) => state.auth);

  // In a real application, you would fetch the user's subscription status from the backend
  const subscriptionStatus = user?.subscriptionStatus || 'free';
  const subscriptionPlan = user?.subscriptionPlan || 'Free Plan';
  const subscriptionExpiredAt = user?.subscriptionExpiredAt || null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and payment methods
          </p>
        </div>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Subscription</CardTitle>
                    <CardDescription>
                      Manage your current subscription plan
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={
                      subscriptionStatus === 'active' ? 'default' : 
                      subscriptionStatus === 'pending' ? 'secondary' : 
                      subscriptionStatus === 'cancelled' ? 'destructive' : 'outline'
                    }
                  >
                    {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{subscriptionPlan}</h3>
                    {subscriptionExpiredAt && (
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(subscriptionExpiredAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {subscriptionStatus === 'free' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Upgrade to Premium</h4>
                    <p className="text-blue-700 text-sm mb-4">
                      Unlock advanced features with our premium plans
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {subscriptionStatus === 'active' ? (
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                ) : (
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Display Subscription Options */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">Choose a Plan</h2>
              <PaymentComponent />
            </div>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Add or manage your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Default</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Wallet className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="text-sm text-muted-foreground">Jan 15, 2025</p>
                      </div>
                      <p className="font-medium">Rp 59,900</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">Basic Plan</p>
                        <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                      </div>
                      <p className="font-medium">Rp 29,900</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillingPage;