/**
 * PolyShield Encryption Algorithms
 * 12 custom, reversible ciphers that avoid standard hash/encryption patterns.
 */

export type PolyShieldCipher = {
  name: string;
  encrypt: (data: Uint8Array, key: Uint8Array) => Uint8Array;
  decrypt: (data: Uint8Array, key: Uint8Array) => Uint8Array;
};

// Helper: Derived key bytes expansion
function expandKey(key: Uint8Array, length: number): Uint8Array {
  const expanded = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    expanded[i] = key[i % key.length] ^ (i & 0xFF);
  }
  return expanded;
}

export const algorithms: PolyShieldCipher[] = [
  // 1. XORShift Cascade
  {
    name: "XOR_CASCADE",
    encrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const k = expandKey(key, data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ k[i];
      }
      return out;
    },
    decrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const k = expandKey(key, data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ k[i];
      }
      return out;
    }
  },

  // 2. Bitwise Rotation
  {
    name: "BIT_ROTATE",
    encrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const shift = (key[0] % 7) + 1;
      for (let i = 0; i < data.length; i++) {
        const val = data[i];
        out[i] = ((val << shift) | (val >> (8 - shift))) & 0xFF;
      }
      return out;
    },
    decrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const shift = (key[0] % 7) + 1;
      for (let i = 0; i < data.length; i++) {
        const val = data[i];
        out[i] = ((val >> shift) | (val << (8 - shift))) & 0xFF;
      }
      return out;
    }
  },

  // 3. Dynamic S-Box Substitution
  {
    name: "SBOX_SUB",
    encrypt: (data, key) => {
      const sbox = new Uint8Array(256);
      for (let i = 0; i < 256; i++) sbox[i] = i;
      // Shuffle S-Box using key
      for (let i = 255; i > 0; i--) {
        const j = key[i % key.length] % (i + 1);
        [sbox[i], sbox[j]] = [sbox[j], sbox[i]];
      }
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) out[i] = sbox[data[i]];
      return out;
    },
    decrypt: (data, key) => {
      const sbox = new Uint8Array(256);
      for (let i = 0; i < 256; i++) sbox[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = key[i % key.length] % (i + 1);
        [sbox[i], sbox[j]] = [sbox[j], sbox[i]];
      }
      const rsbox = new Uint8Array(256);
      for (let i = 0; i < 256; i++) rsbox[sbox[i]] = i;
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) out[i] = rsbox[data[i]];
      return out;
    }
  },

  // 4. Block Shuffling (Transposition)
  {
    name: "BLOCK_SHUFFLE",
    encrypt: (data, key) => {
      const out = new Uint8Array(data);
      const blockSize = (key[1] % 4) + 2;
      for (let i = 0; i < out.length - blockSize; i += blockSize) {
        const j = (i + (key[i % key.length] % (out.length - i)));
        for (let k = 0; k < blockSize && (i + k < out.length) && (j + k < out.length); k++) {
          [out[i + k], out[j + k]] = [out[j + k], out[i + k]];
        }
      }
      return out;
    },
    decrypt: (data, key) => {
      const out = new Uint8Array(data);
      const blockSize = (key[1] % 4) + 2;
      const swaps: [number, number][] = [];
      for (let i = 0; i < out.length - blockSize; i += blockSize) {
        const j = (i + (key[i % key.length] % (out.length - i)));
        swaps.push([i, j]);
      }
      for (let i = swaps.length - 1; i >= 0; i--) {
        const [a, b] = swaps[i];
        for (let k = 0; k < blockSize && (a + k < out.length) && (b + k < out.length); k++) {
          [out[a + k], out[b + k]] = [out[b + k], out[a + k]];
        }
      }
      return out;
    }
  },

  // 5. Additive Modulo (Vigenere-like)
  {
    name: "MODULO_ADD",
    encrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const k = expandKey(key, data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = (data[i] + k[i]) % 256;
      }
      return out;
    },
    decrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const k = expandKey(key, data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = (data[i] - k[i] + 256) % 256;
      }
      return out;
    }
  },

  // 6. Nibble Swap
  {
    name: "NIBBLE_SWAP",
    encrypt: (data, _) => {
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = ((data[i] & 0x0F) << 4) | ((data[i] & 0xF0) >> 4);
      }
      return out;
    },
    decrypt: (data, _) => {
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = ((data[i] & 0x0F) << 4) | ((data[i] & 0xF0) >> 4);
      }
      return out;
    }
  },

  // 7. Rail Fence (Key-based depth)
  {
    name: "RAIL_FENCE",
    encrypt: (data, key) => {
      const rails = (key[2] % 3) + 2;
      const fence: number[][] = Array.from({ length: rails }, () => []);
      let rail = 0, direction = 1;
      for (const b of data) {
        fence[rail].push(b);
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
      }
      return new Uint8Array(fence.flat());
    },
    decrypt: (data, key) => {
      const rails = (key[2] % 3) + 2;
      const railLengths = new Array(rails).fill(0);
      let rail = 0, direction = 1;
      for (let i = 0; i < data.length; i++) {
        railLengths[rail]++;
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
      }
      const fence: number[][] = [];
      let offset = 0;
      for (let i = 0; i < rails; i++) {
        fence[i] = Array.from(data.slice(offset, offset + railLengths[i]));
        offset += railLengths[i];
      }
      const out = new Uint8Array(data.length);
      rail = 0; direction = 1;
      for (let i = 0; i < data.length; i++) {
        out[i] = fence[rail].shift()!;
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
      }
      return out;
    }
  },

  // 8. Bit Flip (Masked)
  {
    name: "BIT_FLIP",
    encrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const mask = expandKey(key, data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ (mask[i] & 0xAA); // Flip alternate bits
      }
      return out;
    },
    decrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      const mask = expandKey(key, data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = data[i] ^ (mask[i] & 0xAA);
      }
      return out;
    }
  },

  // 9. Matrix Transpose
  {
    name: "MATRIX_TRANSPOSE",
    encrypt: (data, _) => {
      const size = Math.ceil(Math.sqrt(data.length));
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const r = Math.floor(i / size);
        const c = i % size;
        const target = c * size + r;
        if (target < data.length) out[target] = data[i];
        else out[i] = data[i]; // Fallback for incomplete matrix
      }
      return out;
    },
    decrypt: (data, _) => {
      const size = Math.ceil(Math.sqrt(data.length));
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const r = Math.floor(i / size);
        const c = i % size;
        const target = c * size + r;
        if (target < data.length) out[target] = data[i];
        else out[i] = data[i];
      }
      return out;
    }
  },

  // 10. Interleave
  {
    name: "INTERLEAVE",
    encrypt: (data, _) => {
      const out = new Uint8Array(data.length);
      const mid = Math.ceil(data.length / 2);
      for (let i = 0; i < data.length; i++) {
        if (i % 2 === 0) out[i / 2] = data[i];
        else out[mid + Math.floor(i / 2)] = data[i];
      }
      return out;
    },
    decrypt: (data, _) => {
      const out = new Uint8Array(data.length);
      const mid = Math.ceil(data.length / 2);
      for (let i = 0; i < data.length; i++) {
        if (i < mid) out[i * 2] = data[i];
        else out[(i - mid) * 2 + 1] = data[i];
      }
      return out;
    }
  },

  // 11. Gronsfeld Shift
  {
    name: "GRONSFELD",
    encrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const shift = key[i % key.length] % 10;
        out[i] = (data[i] + shift) % 256;
      }
      return out;
    },
    decrypt: (data, key) => {
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const shift = key[i % key.length] % 10;
        out[i] = (data[i] - shift + 256) % 256;
      }
      return out;
    }
  },

  // 12. Reverse Byte Order
  {
    name: "REVERSE_BYTES",
    encrypt: (data, _) => new Uint8Array([...data].reverse()),
    decrypt: (data, _) => new Uint8Array([...data].reverse())
  }
];
