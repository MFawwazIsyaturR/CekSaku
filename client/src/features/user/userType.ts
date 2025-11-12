

export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    subscriptionStatus?: 'active' | 'cancelled' | 'pending' | 'expired';
    subscriptionPlan?: string;
    subscriptionOrderId?: string;
    subscriptionExpiredAt?: string; // ISO date string
}
export interface UpdateUserResponse {
    data: User
}
