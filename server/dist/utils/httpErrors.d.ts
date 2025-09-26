export declare class AppError extends Error {
    statusCode: number;
    details?: unknown;
    constructor(message: string, statusCode?: number, details?: unknown);
}
export declare const badRequest: (message: string, details?: unknown) => AppError;
export declare const unauthorized: (message?: string) => AppError;
export declare const forbidden: (message?: string) => AppError;
export declare const notFound: (message?: string) => AppError;
export type ErrorResponse = {
    message: string;
    details?: unknown;
};
//# sourceMappingURL=httpErrors.d.ts.map