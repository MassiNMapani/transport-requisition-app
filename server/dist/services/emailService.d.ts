export interface EmailPayload {
    to: string;
    subject: string;
    text: string;
}
export declare const sendEmail: ({ to, subject, text }: EmailPayload) => Promise<void>;
//# sourceMappingURL=emailService.d.ts.map