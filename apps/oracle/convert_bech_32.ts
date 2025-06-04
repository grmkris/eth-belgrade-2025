#!/usr/bin/env bun

import { bech32 } from 'bech32';

function roflIdToHex(roflId: string): string {
    try {
        const { prefix, words } = bech32.decode(roflId);
        
        if (prefix !== 'rofl') {
            throw new Error("Invalid ROFL app ID format - expected 'rofl' prefix");
        }
        
        // Convert from bech32 words to raw bytes using bech32.fromWords
        const rawAppID = new Uint8Array(bech32.fromWords(words));
        
        // Convert to hex string
        return Buffer.from(rawAppID).toString('hex');
    } catch (error) {
        throw new Error(`Failed to decode ROFL app ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length !== 1) {
        console.log("Usage: bun convert_bech_32.ts <rofl_app_id>");
        console.log("Example: bun convert_bech_32.ts rofl1qzl7hv7jn6h4368qkvfwj8rvyfy6q7qxqc2d0nl2");
        process.exit(1);
    }
    
    const roflId = args[0] as string;
    
    try {
        const hexResult = roflIdToHex(roflId);
        console.log(`ROFL App ID: ${roflId}`);
        console.log(`Hex format:  ${hexResult}`);
        console.log(`For Forge:   0x${hexResult}`);
        console.log(`Length:      ${hexResult.length} hex chars (${hexResult.length / 2} bytes)`);
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}

main();

export { roflIdToHex };
