import UserModel from "../../models/user.model";

export const resetAiScanQuota = async () => {
    const now = new Date();
    let resetCount = 0;
    let failedCount = 0;

    try {
        console.log("Starting AI scan quota reset job");

        // Find all Pro users with active subscription
        const result = await UserModel.updateMany(
            {
                subscriptionStatus: 'active',
                subscriptionPlan: { $ne: 'free' }
            },
            {
                $set: {
                    aiScanQuota: 10,
                    aiScanQuotaResetAt: now
                }
            }
        );

        resetCount = result.modifiedCount;

        console.log(`✅ Reset quota for ${resetCount} Pro users`);

        return {
            success: true,
            resetCount,
            failedCount: 0
        };
    } catch (error: any) {
        console.error("Error resetting AI scan quota:", error);

        return {
            success: false,
            error: error?.message,
            resetCount,
            failedCount
        };
    }
};
