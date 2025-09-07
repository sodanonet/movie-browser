import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Global polyfills for Node.js environment
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
