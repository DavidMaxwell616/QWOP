"""Inspect the archived SWF without executing Flash or modifying the game."""
from pathlib import Path
import collections
import hashlib
import json
import struct
import zlib

ROOT = Path(__file__).resolve().parent
raw = (ROOT / 'QWOP.swf').read_bytes()
data = raw[:8] + zlib.decompress(raw[8:]) if raw[:3] == b'CWS' else raw
assert data[:3] in (b'CWS', b'FWS')
assert len(data) == struct.unpack_from('<I', data, 4)[0]

class Bits:
    def __init__(self, data, byte=0): self.data, self.pos = data, byte * 8
    def read(self, n, signed=False):
        value = 0
        for _ in range(n):
            value = value * 2 + ((self.data[self.pos // 8] >> (7 - self.pos % 8)) & 1)
            self.pos += 1
        return value - (1 << n) if signed and n and value & (1 << (n - 1)) else value
    def byte(self): return (self.pos + 7) // 8

def rect(payload, offset=0):
    bits = Bits(payload, offset); n = bits.read(5)
    values = [bits.read(n, True) / 20 for _ in range(4)]
    return dict(zip(['xmin', 'xmax', 'ymin', 'ymax'], values)), bits.byte()

def tags(payload, offset=0):
    while offset < len(payload):
        header = struct.unpack_from('<H', payload, offset)[0]; offset += 2
        code, size = header >> 6, header & 63
        if size == 63: size = struct.unpack_from('<I', payload, offset)[0]; offset += 4
        yield code, payload[offset:offset + size]
        offset += size
        if code == 0: break

def matrix(payload, offset):
    bits = Bits(payload, offset); sx = sy = 1; r0 = r1 = 0
    if bits.read(1):
        n = bits.read(5); sx, sy = bits.read(n, True) / 65536, bits.read(n, True) / 65536
    if bits.read(1):
        n = bits.read(5); r0, r1 = bits.read(n, True) / 65536, bits.read(n, True) / 65536
    n = bits.read(5); tx, ty = bits.read(n, True) / 20, bits.read(n, True) / 20
    return {'a': sx, 'b': r0, 'c': r1, 'd': sy, 'tx': tx, 'ty': ty}, bits.byte()

def placements(payload, offset):
    result = []; frame = 1
    for code, block in tags(payload, offset):
        if code == 1: frame += 1
        if code not in (26, 70): continue
        flags = block[0]; flags2 = block[1] if code == 70 else 0
        pos = 2 if code == 70 else 1
        depth = struct.unpack_from('<H', block, pos)[0]; pos += 2
        item = {'frame': frame, 'depth': depth, 'move': bool(flags & 1)}
        if code == 70 and (flags2 & 8 or (flags2 & 16 and flags & 2)):
            end = block.index(0, pos); item['class'] = block[pos:end].decode(); pos = end + 1
        if flags & 2: item['symbolId'] = struct.unpack_from('<H', block, pos)[0]; pos += 2
        if flags & 4: item['matrix'], pos = matrix(block, pos)
        if flags & 8:
            bits = Bits(block, pos); add, mul, n = bits.read(1), bits.read(1), bits.read(4)
            bits.read(4 * n * (add + mul)); pos = bits.byte()
        if flags & 16: pos += 2
        if flags & 32:
            end = block.index(0, pos); item['name'] = block[pos:end].decode(); pos = end + 1
        result.append(item)
    return result

bounds, pos = rect(data, 8)
fps, frames = struct.unpack_from('<HH', data, pos); pos += 4
symbols = {}; sprites = {}; shapes = {}; sounds = {}; fonts = {}; counts = collections.Counter()
for code, block in tags(data, pos):
    counts[code] += 1
    if code == 76:
        count = struct.unpack_from('<H', block)[0]; p = 2
        for _ in range(count):
            sid = struct.unpack_from('<H', block, p)[0]; p += 2
            end = block.index(0, p); symbols[sid] = block[p:end].decode(); p = end + 1
    if code == 39:
        sid, frame_count = struct.unpack_from('<HH', block)
        sprites[sid] = {'frames': frame_count, 'placements': placements(block, 4)}
    if code in (2, 22, 32, 83): shapes[struct.unpack_from('<H', block)[0]] = rect(block, 2)[0]
    if code == 14:
        sid = struct.unpack_from('<H', block)[0]
        sounds[sid] = {'format': block[2] >> 4, 'sampleCount': struct.unpack_from('<I', block, 3)[0], 'tagBytes': len(block)}
    if code in (48, 75):
        sid = struct.unpack_from('<H', block)[0]
        fonts[sid] = {'name': block[5:5 + block[4]].decode('utf-8', errors='replace'), 'tagBytes': len(block)}
report = {'source': 'https://raw.githubusercontent.com/selenite-cc/flasharchive/main/QWOP.swf',
    'sha256': hashlib.sha256(raw).hexdigest(), 'compressedBytes': len(raw), 'frameRate': fps / 256,
    'stageBoundsPixels': bounds, 'symbols': symbols, 'sprites': sprites, 'shapeBoundsPixels': shapes,
    'sounds': sounds, 'fonts': fonts, 'rootPlacements': placements(data, pos), 'tagCounts': dict(counts),
    'notes': ['Matrices are local display-list transforms; translations and shape bounds are pixels, not physics units.',
              'Symbol IDs and QWOP_fla namespace match local PNG export names; code equivalence is not yet verified.',
              'ActionScript bytecode remains embedded in the SWF, not decompiled by this inventory.',
              'The literal dontstealthisgame.xml is absent from this SWF; this may be a different or modified build.',
              'No external dontstealthisgame.xml was located. Audio/font payloads remain embedded.']}
(ROOT / 'inventory.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print('Inventoried', len(symbols), 'symbols,',len(sprites),'timelines,',len(sounds),'sounds and',len(fonts),'fonts')
print('DemoWorld1 placements:',len(sprites[119]['placements']))
print('Font GS1:',fonts[1])
