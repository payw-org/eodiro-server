import { Page } from 'puppeteer';
export declare type TitleBuilder = (
/** A single notice item */ noticeItemElement: HTMLElement | Element) => string;
export declare type UrlBuilder = (
/** A single notice item */ noticeItemElement: HTMLElement | Element) => string;
export declare type FeedOptions = {
    /**
     * Minutes
     * @default 10
     */
    interval?: number;
};
export interface Publisher {
    /** Notice name which will be displayed on the end users */
    name: string;
    /** Unique key(id) for differentiating each subscriber */
    key: string;
    url: string;
    /** A CSS selector of */
    noticeItemSelector: string;
    titleBuilder: TitleBuilder;
    urlBuilder?: UrlBuilder;
}
export declare type PublisherBuilder = (siteInformation: {
    name: string;
    key: string;
    url: string;
}) => Publisher;
export declare type LastNotice = Record<string, {
    displayName: string;
    title: string;
}>;
export declare class CauNoticeWatcher {
    private feedOptions;
    private publishers;
    private lastNotice;
    constructor(feedOptions?: FeedOptions);
    register(publisher: Publisher): void;
    /**
     * Get the `last_notice.json` file inside '.eodiro' directory
     */
    static loadLastNoticeFile(): LastNotice;
    private writeLastNoticeFile;
    private getLastNoticeTitle;
    private updateLastNotice;
    run(): Promise<void>;
    private processPublisher;
    static visit(page: Page, publisher: Publisher, pageNumber?: number): Promise<{
        title: string;
        noticeItemUrl: string;
    }[]>;
}
