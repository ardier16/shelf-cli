export declare type ShelfCommandAction = (...args: string[]) => void;
export declare type ShelfCommand = {
    name: string;
    description: string;
    arguments: string;
    action: ShelfCommandAction;
};
export declare const COMMANDS: ShelfCommand[];
