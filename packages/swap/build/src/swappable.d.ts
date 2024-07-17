import { NFT } from '@bitcoin-computer/TBC721';
declare const Contract: typeof import("@bitcoin-computer/lib").Contract;
export declare class Swappable extends Contract {
    name: string;
    artist: string;
    _id: string;
    _rev: string;
    _root: string;
    _owners: string[];
    constructor(name?: string, symbol?: string);
    transfer(to: string): void;
    swap(that: NFT): void;
}
export {};
