export declare type ShelfConfig = Record<string, string> & {
    gitlabToken: string;
    slackToken: string;
    jiraEmail: string;
    jiraToken: string;
};
export declare const CONFIG_PATH: string;
export declare const config: ShelfConfig;
