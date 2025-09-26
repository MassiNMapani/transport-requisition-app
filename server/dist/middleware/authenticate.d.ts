import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../models/enums';
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authenticate.d.ts.map