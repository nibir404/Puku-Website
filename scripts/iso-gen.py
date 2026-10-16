"""Isometric line-art illustrations for Puku story pages.

Style: white faces, ink strokes, one violet accent, mono annotations with
hand-drawn arrows. Every animatable part is an <g id="..."> so code can target it.
Run: python3 gen.py  -> writes *.svg next to this file.
"""
import math, os

# Palettes come from the Puku tokens. "css" emits var() references so one inline SVG
# follows the site's theme toggle; "light"/"dark" are flattened copies for Paper.
PALETTES = {
    "light": dict(INK="#282C22", MUTED="#626759", GHOST="#D3D5C8", WHITE="#FBFBF7", A_TOP="#DCDDFB",
                  A_L="#B0B3FC", A_R="#484DD0", A_SOFT="#ECECFB", LIME_T="#626759", LIME_L="#34362E", LIME_R="#282C22"),
    "dark": dict(INK="#C9CBBE", MUTED="#9DA193", GHOST="#34362E", WHITE="#1C1D1A", A_TOP="#B0B3FC",
                 A_L="#7377D6", A_R="#484DD0", A_SOFT="#25263A", LIME_T="#EEEEE5", LIME_L="#C9CBBE", LIME_R="#9DA193"),
    "css": dict(INK="var(--iso-ink)", MUTED="var(--iso-muted)", GHOST="var(--iso-ghost)", WHITE="var(--iso-face)",
                A_TOP="var(--iso-a-top)", A_L="var(--iso-a-left)", A_R="var(--iso-a-right)", A_SOFT="var(--iso-a-soft)",
                LIME_T="var(--iso-b-top)", LIME_L="var(--iso-b-left)", LIME_R="var(--iso-b-right)"),
}
globals().update(PALETTES["light"])
C30, S30 = math.cos(math.pi / 6), 0.5


class Iso:
    def __init__(self, w, h, ox, oy, u):
        self.w, self.h, self.ox, self.oy, self.u = w, h, ox, oy, u
        self.parts = []

    def p(self, x, y, z=0):
        return (self.ox + (x - y) * C30 * self.u, self.oy + (x + y) * S30 * self.u - z * self.u)

    def poly(self, pts, fill, stroke=None, sw=1.6, extra=""):
        stroke = stroke or INK
        d = " ".join(f"{a:.1f},{b:.1f}" for a, b in pts)
        return f'<polygon points="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>'

    def box(self, x, y, z, w, d, h, top=None, left=None, right=None, stroke=None, sw=1.6, extra=""):
        top, left, right, stroke = top or WHITE, left or WHITE, right or WHITE, stroke or INK
        P = self.p
        f_top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        f_left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
        f_right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
        return "".join([self.poly(f_left, left, stroke, sw, extra), self.poly(f_right, right, stroke, sw, extra),
                        self.poly(f_top, top, stroke, sw, extra)])

    def disc(self, cx, cy, z, r, h, top, side=None, stroke=None, sw=1.6):
        side, stroke = side or WHITE, stroke or INK
        sx, sy = self.p(cx, cy, z)
        rx, ry = r * self.u * math.sqrt(2) * C30, r * self.u * math.sqrt(2) * S30
        hh = h * self.u
        side_path = (f'<path d="M{sx-rx:.1f},{sy-hh:.1f} L{sx-rx:.1f},{sy:.1f} A{rx:.1f},{ry:.1f} 0 0 0 {sx+rx:.1f},{sy:.1f} '
                     f'L{sx+rx:.1f},{sy-hh:.1f}" fill="{side}" stroke="{stroke}" stroke-width="{sw}"/>')
        top_el = f'<ellipse cx="{sx:.1f}" cy="{sy-hh:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{top}" stroke="{stroke}" stroke-width="{sw}"/>'
        return side_path + top_el

    def line(self, pts3, stroke=None, sw=1.6, dash=None, extra=""):
        stroke = stroke or INK
        pts = [self.p(*q) for q in pts3]
        d = "M" + " L".join(f"{a:.1f},{b:.1f}" for a, b in pts)
        da = f'stroke-dasharray="{dash}"' if dash else ""
        return f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" {da} {extra}/>'

    def grid(self, x0, y0, n, m, step, stroke=None):
        stroke = stroke or GHOST
        out = []
        for i in range(n + 1):
            out.append(self.line([(x0 + i * step, y0, 0), (x0 + i * step, y0 + m * step, 0)], stroke, 1))
        for j in range(m + 1):
            out.append(self.line([(x0, y0 + j * step, 0), (x0 + n * step, y0 + j * step, 0)], stroke, 1))
        return "".join(out)

    def g(self, gid, *els):
        self.parts.append(f'<g id="{gid}">{"".join(els)}</g>')

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" fill="none">'
                + "".join(self.parts) + "</svg>")


def note(text_lines, tx, ty, arrow, anchor="start", size=15):
    """Mono annotation + hand-drawn curved arrow. arrow = (x1,y1, cx,cy, x2,y2)."""
    tsp = "".join(f'<tspan x="{tx}" dy="{0 if i == 0 else size + 7}">{t}</tspan>' for i, t in enumerate(text_lines))
    x1, y1, cx, cy, x2, y2 = arrow
    ang = math.atan2(y2 - cy, x2 - cx)
    a1 = (x2 - 9 * math.cos(ang - 0.45), y2 - 9 * math.sin(ang - 0.45))
    a2 = (x2 - 9 * math.cos(ang + 0.45), y2 - 9 * math.sin(ang + 0.45))
    return (f'<text x="{tx}" y="{ty}" font-family="var(--font-tx02, TX-02), TX-02, monospace" font-size="{size}" fill="{MUTED}" text-anchor="{anchor}">{tsp}</text>'
            f'<path d="M{x1},{y1} Q{cx},{cy} {x2},{y2}" stroke="{MUTED}" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
            f'<path d="M{a1[0]:.1f},{a1[1]:.1f} L{x2},{y2} L{a2[0]:.1f},{a2[1]:.1f}" stroke="{MUTED}" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')


def puku_p(s, x, y, z, k=1.0, faces=None):
    faces = faces or (A_TOP, A_L, A_R)
    """Upright pixel 'P' (3 wide x 5 tall, one cell deep) standing on (x, y, z)."""
    rows = ["XXX", "X.X", "XXX", "X..", "X.."]          # top -> bottom
    cells = [(cx, 4 - r) for r, row in enumerate(rows) for cx, ch in enumerate(row) if ch == "X"]
    out = []
    for cx, cz in sorted(cells, key=lambda c: (c[1], c[0])):
        out.append(s.box(x + cx * k, y, z + cz * k, k, k, k, *faces))
    return "".join(out)


def note_to(s, lines, tx, ty, target, bend=0.18, anchor="start", size=15):
    """Annotation whose arrow ends 10px short of an iso point."""
    ex, ey = s.p(*target)
    width = max(len(t) for t in lines) * size * 0.6
    below = ey > ty + (len(lines) - 1) * (size + 7)
    sx = tx + (width + 10 if ex > tx + width else width / 2)
    sy = (ty + (len(lines) - 1) * (size + 7) + 10) if below else (ty - size - 4)
    if ex > tx + width and abs(ey - ty) < 120:
        sy = ty - size / 3
    dx, dy = ex - sx, ey - sy
    L = math.hypot(dx, dy) or 1
    ex, ey = ex - dx / L * 12, ey - dy / L * 12
    cx, cy = (sx + ex) / 2 - dy * bend, (sy + ey) / 2 + dx * bend
    return note(lines, tx, ty, (round(sx), round(sy), round(cx), round(cy), round(ex), round(ey)), anchor, size)


# ---------------------------------------------------------------- 01 inception
def inception():
    s = Iso(820, 620, 380, 300, 30)
    s.g("ghost-cubes", s.box(-7.4, -1.4, 0, 1.6, 1.6, 1.6, WHITE, WHITE, WHITE, GHOST, 1.2),
        s.box(-6.2, 4.4, 0, 1.6, 1.6, 1.6, WHITE, WHITE, WHITE, GHOST, 1.2))
    s.g("route-lines", s.line([(-5.6, 0.4, 0.6), (-3.2, 0.4, 0.6), (-3.2, 2.4, 0.6), (-1.6, 2.4, 0.6)], sw=1.4, extra='class="flow"'),
        s.line([(-4.4, 4.0, 0.6), (-3.2, 4.0, 0.6), (-3.2, 2.4, 0.6)], sw=1.4, extra='class="flow"'))
    s.g("puku-cubes", s.box(-7.2, -0.4, 0, 1.6, 1.6, 1.6), s.box(-6.0, 3.2, 0, 1.6, 1.6, 1.6))
    s.g("platform", s.disc(1.5, 2.4, -0.7, 3.2, 0.55, WHITE), s.disc(1.5, 2.4, 0, 3.2, 0.3, A_SOFT))
    s.g("puku-p", puku_p(s, 0.0, 2.0, 0.3, 1.0))
    s.g("link", s.line([(4.7, 2.4, 0.3), (7.4, 2.4, 0.3), (7.4, 0.2, 0.3)], A_R, 1.6, "5 5", 'class="flow"'))
    s.g("nvidia-block", s.box(6.6, -1.6, 0, 1.8, 1.8, 2.2, LIME_T, LIME_L, LIME_R),
        s.box(6.8, -1.4, 2.2, 1.4, 1.4, 0.5, WHITE, WHITE, WHITE))
    s.parts.append(note_to(s, ["puku ai"], 30, 160, (-6.4, 0.4, 1.8)))
    s.parts.append(note_to(s, ["nvidia", "inception"], 660, 60, (7.5, -0.7, 2.9), -0.18))
    s.parts.append(note_to(s, ["our models,", "on new ground"], 120, 560, (0.2, 4.6, 0.3), -0.18))
    return s.svg()


# ---------------------------------------------------------------- 02 models
def models():
    s = Iso(720, 600, 360, 170, 30)
    s.g("ground", s.box(0, 0, -0.4, 8, 8, 0.4), s.grid(0, 0, 8, 8, 1))
    tower = []
    for i in range(7):
        inset = i * 0.18
        f = (A_TOP, A_L, A_R) if i < 3 else (WHITE, WHITE, WHITE)
        tower.append(s.box(1 + inset, 1 + inset, i * 0.75, 3 - 2 * inset, 3 - 2 * inset, 0.75, *f))
    s.g("model-puku-ai", *tower)
    s.g("model-feluda", s.box(4.6, 4.4, 0, 2.6, 0.9, 3.2), s.box(5.3, 4.4, 0.9, 1.2, 0.9, 1.3, A_SOFT, A_SOFT, A_SOFT),
        s.box(4.6, 5.3, 0, 2.6, 0.5, 1.2, A_TOP, A_L, A_R))
    s.parts.append(note(["puku-ai-2.9", "general purpose"], 40, 70, (120, 108, 150, 140, 196, 150)))
    s.parts.append(note(["feluda-1.0", "cybersecurity"], 560, 520, (600, 492, 610, 450, 560, 432)))
    return s.svg()


# ---------------------------------------------------------------- 03 compute
def compute():
    s = Iso(760, 640, 330, 200, 30)
    s.g("ground", s.box(0, 0, -0.4, 10, 6, 0.4), s.grid(0, 0, 10, 6, 1))
    racks = []
    for i in range(4):
        x = 1 + i * 2.2
        racks.append(f'<g id="rack-{i+1}">' + s.box(x, 1, 0, 1.4, 3.6, 5.2) +
                     "".join(s.line([(x + 1.4, 1.3, 0.6 + k * 0.9), (x + 1.4, 4.3, 0.6 + k * 0.9)],
                                    A_R if (k + i) % 2 == 0 else INK, 2.2 if (k + i) % 2 == 0 else 1)
                             for k in range(5)) + "</g>")
    s.g("racks", *racks)
    coins = "".join(s.disc(8.6, 6.8, k * 0.32, 0.9, 0.32, A_TOP if k == 4 else WHITE) for k in range(5))
    s.g("credit-stack", coins)
    s.parts.append(note(["gpu racks"], 60, 70, (130, 82, 170, 96, 196, 130)))
    s.parts.append(note(["$100k aws", "credits"], 600, 590, (620, 560, 640, 520, 610, 494)))
    return s.svg()


# ---------------------------------------------------------------- 04 ecosystem
def ecosystem():
    s = Iso(720, 620, 360, 150, 32)
    s.g("ground", s.grid(0, 0, 9, 9, 1.5))
    hub = (3.75, 3.75)
    spokes = [(0.5, 0.5), (8, 0.5), (0.5, 8), (8, 8)]
    s.g("links", *[s.line([(hub[0] + 0.75, hub[1] + 0.75, 0.6), (sx + 0.6, hub[1] + 0.75, 0.6), (sx + 0.6, sy + 0.6, 0.6)],
                          A_R, 1.6, "6 5", 'class="flow"') for sx, sy in spokes])
    names = ["lambda", "bria", "nebius", "scaleway"]
    for (sx, sy), n in zip(spokes, names):
        s.g(f"partner-{n}", s.box(sx, sy, 0, 1.2, 1.2, 1.2))
    s.g("hub-puku", s.box(hub[0], hub[1], 0, 1.5, 1.5, 3.2, A_TOP, A_L, A_R))
    s.parts.append(note(["lambda"], 120, 40, (170, 52, 230, 60, 290, 102)))
    s.parts.append(note(["bria"], 610, 220, (630, 232, 640, 270, 600, 300)))
    s.parts.append(note(["nebius"], 40, 330, (66, 342, 80, 380, 120, 404)))
    s.parts.append(note(["scaleway"], 470, 600, (500, 580, 470, 556, 420, 552)))
    return s.svg()


# ---------------------------------------------------------------- 06 next
def next_steps():
    s = Iso(900, 520, 230, 400, 25)
    s.g("ground", s.grid(-1, -13.4, 3, 15, 1))
    steps = []
    for i in reversed(range(6)):                       # back-to-front
        ghost = i >= 3
        st = GHOST if ghost else INK
        f = (WHITE, WHITE, WHITE) if ghost else ((A_TOP, A_L, A_R) if i == 2 else (WHITE, WHITE, WHITE))
        box = s.box(0, -i * 2.4, 0, 1.6, 1.6, 1 + i * 1.0, *f, stroke=st, sw=1.2 if ghost else 1.6,
                    extra='stroke-dasharray="4 4"' if ghost else "")
        steps.append(f'<g id="step-{i+1}">{box}</g>')
    s.g("steps", *steps)
    s.parts.append(note_to(s, ["today"], 400, 490, (1.6, -4.0, 1.2), -0.18))
    s.parts.append(note_to(s, ["more models,", "more domains"], 690, 60, (1.6, -12.0, 5.5), 0.18))
    return s.svg()


# ---------------------------------------------------------------- thumbnails for the index
def thumb_cube_pair():
    s = Iso(480, 300, 240, 110, 26)
    s.g("ground", s.grid(-1, -1, 6, 6, 1))
    s.g("a", s.box(0, 0, 0, 1.6, 1.6, 2.4, A_TOP, A_L, A_R))
    s.g("b", s.box(2.6, 2.6, 0, 1.6, 1.6, 1.4))
    s.g("l", s.line([(1.6, 0.8, 0.5), (3.4, 0.8, 0.5), (3.4, 2.6, 0.5)], A_R, 1.4, "5 4"))
    return s.svg()


def thumb_tower():
    s = Iso(480, 300, 240, 90, 24)
    s.g("ground", s.grid(0, 0, 6, 6, 1))
    s.g("t", *[s.box(1.5 + i * 0.2, 1.5 + i * 0.2, i * 0.8, 3 - i * 0.4, 3 - i * 0.4, 0.8,
                     *((A_TOP, A_L, A_R) if i == 0 else (WHITE, WHITE, WHITE))) for i in range(5)])
    return s.svg()


def thumb_disc():
    s = Iso(480, 300, 240, 120, 26)
    s.g("d", s.disc(2, 2, -0.4, 3, 0.5, WHITE), s.disc(2, 2, 0, 3, 0.3, A_SOFT))
    s.g("c", s.box(1.2, 1.2, 0.3, 1.6, 1.6, 2.2, A_TOP, A_L, A_R))
    return s.svg()


ARTS = [("inception", inception), ("models", models), ("compute", compute), ("ecosystem", ecosystem),
        ("next", next_steps), ("thumb-cubes", thumb_cube_pair), ("thumb-tower", thumb_tower), ("thumb-disc", thumb_disc)]

if __name__ == "__main__":
    import json, sys
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    paper_dir = sys.argv[1] if len(sys.argv) > 1 else None
    out = {}
    for mode in ("css", "light", "dark"):
        globals().update(PALETTES[mode])
        for name, fn in ARTS:
            svg = fn()
            if mode == "css":
                out[name] = svg
            elif paper_dir:
                os.makedirs(paper_dir, exist_ok=True)
                with open(os.path.join(paper_dir, f"{name}-{mode}.svg"), "w") as f:
                    f.write(svg)
    ts = ("// Generated by scripts/iso-gen.py, do not edit by hand.\n"
          "export const ISO_ART = " + json.dumps(out, indent=2) + " as const;\n"
          "export type IsoArtName = keyof typeof ISO_ART;\n")
    with open(os.path.join(root, "src", "lib", "iso-art.ts"), "w") as f:
        f.write(ts)
    print("ok", len(out))
