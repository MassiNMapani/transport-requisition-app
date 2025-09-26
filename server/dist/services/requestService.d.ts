import { z } from 'zod';
import { ITravelRequest } from '../models/TravelRequest';
import { IUser } from '../models/User';
declare const requestSchema: z.ZodObject<{
    description: z.ZodString;
    destination: z.ZodString;
    purposeOfTravel: z.ZodString;
    travelStartDate: z.ZodString;
    travelEndDate: z.ZodString;
    modeOfTravel: z.ZodString;
    travelers: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        numberOfDays: z.ZodNumber;
        perDiemRate: z.ZodNumber;
        total: z.ZodNumber;
    }, z.core.$strip>>;
    vehicleRequired: z.ZodBoolean;
    accommodationRequired: z.ZodBoolean;
    otherRequirements: z.ZodOptional<z.ZodString>;
    programFee: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateRequestInput = z.infer<typeof requestSchema>;
export declare const createTravelRequest: (input: CreateRequestInput, requester: IUser) => Promise<ITravelRequest>;
export declare const listRequestsForUser: (user: IUser) => Promise<(import("mongoose").FlattenMaps<ITravelRequest> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[]>;
export declare const listPendingApprovals: (user: IUser) => Promise<(import("mongoose").FlattenMaps<ITravelRequest> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
})[]>;
export declare const getRequestById: (id: string, user: IUser) => Promise<import("mongoose").Document<unknown, {}, ITravelRequest, {}, {}> & ITravelRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
interface ApprovalDecisionInput {
    requestId: string;
    user: IUser;
    decision: 'APPROVE' | 'REJECT';
    comments?: string;
}
export declare const decideOnRequest: ({ requestId, user, decision, comments, }: ApprovalDecisionInput) => Promise<import("mongoose").Document<unknown, {}, ITravelRequest, {}, {}> & ITravelRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
//# sourceMappingURL=requestService.d.ts.map