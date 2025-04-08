export interface EmailTemplate {
    id: number;
    type: string;
    subject: string;
    cC: string;
    bCC: string;
    keyGuide: string;
    content: string;

}
