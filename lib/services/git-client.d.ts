export declare class GitClient {
    checkout(branch: string): Promise<void>;
    createBranch(branch: string): Promise<string>;
    getCurrentBranch(): Promise<string>;
    pushOrigin(branch: string): Promise<string>;
    getRemoteUrl(): Promise<string>;
    clone(url: string): Promise<string>;
    _execCommand(command: string): Promise<string>;
}
export declare const gitClient: GitClient;
