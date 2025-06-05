// src/lib/utils/anonymizeIP.ts

/**
 * Anonymizes an IPv4 or IPv6 address for privacy compliance.
 *
 * @param ip - The raw IP address string
 * @returns An anonymized version of the IP
 */
export function anonymizeIP(ip: string): string {
    if (!ip || ip === "unknown") return ip;

    // IPv4: 192.168.1.100 → 192.168.1.0
    if (ip.includes(".")) {
        const parts = ip.split(".");
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
        }
        return ip; // Invalid IPv4 format
    }

    // IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 → 2001:0db8:85a3:0000::1
    if (ip.includes(":")) {
        const segments = ip.split(":");
        // Take the first 4 segments and mask the rest
        return `${segments.slice(0, 4).join(":")}::1`;
    }

    return ip;
}


// export function anonymizeIP(ip: string): string {
//     if (!ip || ip === "unknown") return ip;

//     // IPv4: mask last octet
//     if (ip.includes(".")) {
//         return ip.replace(/\.\d+$/, ".0");
//     }

//     // IPv6: shorten to prefix
//     if (ip.includes(":")) {
//         return ip.split(":").slice(0, 4).join(":") + "::1";
//     }

//     return ip;
// }