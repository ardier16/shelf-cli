export declare class GitSdk {
    checkout(branch: string): Promise<string>;
    createBranch(branch: string): Promise<string>;
    getCurrentBranch(): Promise<string>;
    pushOrigin(branch: string): Promise<string>;
    getRemoteUrl(): Promise<string>;
    _execCommand(command: string): Promise<string>;
}
export declare const gitSdk: GitSdk;
