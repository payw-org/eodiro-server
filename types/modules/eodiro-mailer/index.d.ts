interface MailOption {
    /**
     * "name" \<alias@eodiro.com\>
     */
    from?: {
        name: string;
        alias: string;
    };
    subject: string;
    to: string;
    html?: string;
}
export default class EodiroMailer {
    private static transporter;
    private static isReady;
    static verify(): Promise<boolean>;
    private static createFrom;
    static sendMail(options: MailOption): Promise<any>;
}
export {};
