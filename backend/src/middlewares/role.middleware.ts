import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/app-error";
import { UserDocument } from "../models/user.model";

export const roleMiddleware = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as UserDocument;
        if (!user || user.role !== role) {
            throw new UnauthorizedException("Unauthorized access");
        }
        next();
    };
};
