/**
 * The Cipher4 icon set, copied path for path from the Icons board
 * (design-handoff/design/boards/Icons.dc.html), plus the three contact icons
 * from the Phone-Screens board. 32 px grid, 1.5 px stroke, round ends, ink
 * lines and one amber node each.
 *
 * `lines` are drawn on (stroke-dashoffset); `node` is the amber dot that
 * lights up once the lines are in place.
 */

type Line =
  | { d: string }
  | { circle: [cx: number, cy: number, r: number] }
  | { rect: [x: number, y: number, w: number, h: number, rx: number] }

export interface IconDef {
  label: string
  group: 'services' | 'sectors' | 'delivery' | 'why' | 'contact'
  lines: Line[]
  node: [cx: number, cy: number, r: number]
}

export const icons = {
  // --- Services -----------------------------------------------------------
  'operational-platforms': {
    label: 'Operational platforms', group: 'services',
    lines: [{ d: 'M16 5 L28 11 L16 17 L4 11 Z' }, { d: 'M4 16 L16 22 L28 16' }, { d: 'M4 21 L16 27 L28 21' }],
    node: [16, 11, 2],
  },
  'ai-automation': {
    label: 'AI and automation', group: 'services',
    lines: [
      { d: 'M9 10.5 L16 16 L23 10.5 M9 21.5 L16 16 L23 21.5' },
      { circle: [7, 9, 2.5] }, { circle: [25, 9, 2.5] }, { circle: [7, 23, 2.5] }, { circle: [25, 23, 2.5] },
    ],
    node: [16, 16, 2.6],
  },
  'iot-robotics': {
    label: 'IoT and robotics', group: 'services',
    lines: [
      { d: 'M5 27 H17 M11 27 V20 L18 13 L24 16 M24 16 L27 13.5 M24 16 L27 18.5' },
      { circle: [11, 20, 1.6] },
      { d: 'M24 6 a5 5 0 0 1 4 4 M23 9 a2.5 2.5 0 0 1 2 2' },
    ],
    node: [18, 13, 2],
  },
  'digital-platforms': {
    label: 'Digital platforms', group: 'services',
    lines: [{ rect: [4, 6, 24, 20, 2] }, { d: 'M4 11 H28 M9 16 H21 M9 20.5 H16' }],
    node: [8, 8.6, 1.4],
  },
  'it-infrastructure': {
    label: 'IT infrastructure', group: 'services',
    lines: [
      { rect: [6, 5, 20, 6, 1] }, { rect: [6, 13, 20, 6, 1] }, { rect: [6, 21, 20, 6, 1] },
      { d: 'M10 8 H15 M10 16 H15 M10 24 H15' },
    ],
    node: [21.5, 8, 1.6],
  },
  'education-technology': {
    label: 'Education technology', group: 'services',
    lines: [
      { d: 'M16 10 C12 7 7.5 7 4 8 V25 C7.5 24 12 24 16 27 C20 24 24.5 24 28 25 V8 C24.5 7 20 7 16 10 Z' },
      { d: 'M16 10 V27' },
    ],
    node: [16, 5.5, 2],
  },

  // --- Sectors ------------------------------------------------------------
  maritime: {
    label: 'Maritime and ports', group: 'sectors',
    lines: [
      { d: 'M4 19 H28 L24.5 24.5 H7.5 Z' },
      { d: 'M10 19 V13 H18 V19 M20 19 V11 H23 V19 M14 13 V9.5' },
      { d: 'M3 28 q3 -2 6 0 t6 0 t6 0 t6 0' },
    ],
    node: [14, 7.5, 2],
  },
  'oil-gas': {
    label: 'Oil and gas', group: 'sectors',
    lines: [{ d: 'M11 28 L16 7 L21 28 M13.4 18 H18.6 M12.2 23 H19.8 M14.5 12.5 H17.5' }, { d: 'M5 28 H27' }],
    node: [16, 5, 2],
  },
  logistics: {
    label: 'Logistics and transport', group: 'sectors',
    lines: [
      { d: 'M3 8 H19 V21.5 H3 Z' }, { d: 'M19 12.5 H24.5 L29 17 V21.5 H19' },
      { circle: [8.5, 24, 2.5] }, { circle: [23.5, 24, 2.5] },
    ],
    node: [23.5, 24, 1.1],
  },
  'supply-chain': {
    label: 'Supply chain', group: 'sectors',
    lines: [
      { rect: [3, 4, 9, 9, 1] }, { rect: [20, 4, 9, 9, 1] }, { rect: [11.5, 19, 9, 9, 1] },
      { d: 'M12 8.5 H20 M8 13 L13 19 M24 13 L19 19' },
    ],
    node: [16, 8.5, 2],
  },

  // --- How we deliver -----------------------------------------------------
  discovery: {
    label: 'Discovery', group: 'delivery',
    lines: [{ circle: [14, 14, 8] }, { d: 'M20 20 L27 27' }],
    node: [14, 14, 2],
  },
  design: {
    label: 'Design', group: 'delivery',
    lines: [{ d: 'M16 7 L9 27 M16 7 L23 27 M11.2 21 H20.8' }],
    node: [16, 5, 2],
  },
  pilot: {
    label: 'Pilot', group: 'delivery',
    lines: [{ d: 'M8 26 V5 M8 6 H24 L20 11 L24 16 H8' }],
    node: [8, 28, 2],
  },
  deployment: {
    label: 'Deployment', group: 'delivery',
    lines: [{ rect: [5, 5, 8, 8, 1] }, { rect: [19, 5, 8, 8, 1] }, { rect: [5, 19, 8, 8, 1] }, { rect: [19, 19, 8, 8, 1] }],
    node: [16, 16, 2],
  },
  training: {
    label: 'Training and handover', group: 'delivery',
    lines: [
      { circle: [11, 11, 3.5] }, { circle: [22, 13, 3] },
      { d: 'M4 26 C4 21 7 18 11 18 S18 21 18 26 M18 22 C18.5 19.5 20 18.5 22 18.5 S26.5 20 27 26' },
    ],
    node: [27, 6, 2],
  },
  support: {
    label: 'Support', group: 'delivery',
    lines: [
      { d: 'M6 18 V15 A10 10 0 0 1 26 15 V18' },
      { rect: [4, 17, 5, 8, 1.5] }, { rect: [23, 17, 5, 8, 1.5] },
      { d: 'M25.5 25 C25.5 27.5 23 28.5 19.5 28.5' },
    ],
    node: [18, 28.5, 2],
  },

  // --- Why Cipher4 --------------------------------------------------------
  specialists: {
    label: 'Specialists', group: 'why',
    lines: [{ circle: [16, 16, 11] }, { circle: [16, 16, 6] }],
    node: [16, 16, 2.4],
  },
  'one-partner': {
    label: 'One partner', group: 'why',
    lines: [{ circle: [12, 16, 7] }, { circle: [20, 16, 7] }],
    node: [16, 16, 2],
  },
  accountability: {
    label: 'Accountability', group: 'why',
    lines: [{ d: 'M16 4 L26 8 V15 C26 22 21 26 16 28 C11 26 6 22 6 15 V8 Z' }, { d: 'M11 16 L15 20 L20 13.5' }],
    node: [21, 12, 1.8],
  },
  'works-with-what-you-have': {
    label: 'Works with what you have', group: 'why',
    lines: [{ d: 'M12 4 V10 M20 4 V10 M9 10 H23 V15 A7 7 0 0 1 9 15 Z M16 22 V26' }],
    node: [16, 28, 2],
  },

  // --- Contact (Phone-Screens board, not part of the 20) ------------------
  whatsapp: {
    label: 'WhatsApp', group: 'contact',
    lines: [{ d: 'M5 15 C5 9 10 5 16 5 S27 9 27 15 S22 25 16 25 C14.5 25 13 24.7 11.7 24.2 L6 26 L7.6 21 C6 19.3 5 17.3 5 15 Z' }],
    node: [16, 15, 2],
  },
  phone: {
    label: 'Phone', group: 'contact',
    lines: [{ d: 'M9 4 H13 L15 10 L12 12 C13.5 15.5 16.5 18.5 20 20 L22 17 L28 19 V23 C28 25.5 26 27 23.5 27 C13 26 6 19 5 8.5 C5 6 6.5 4 9 4 Z' }],
    node: [25, 7, 2],
  },
  mail: {
    label: 'Email', group: 'contact',
    lines: [{ rect: [4, 7, 24, 18, 2] }, { d: 'M4.5 8 L16 17 L27.5 8' }],
    node: [26, 7, 2],
  },
  sent: {
    label: 'Sent', group: 'contact',
    lines: [{ circle: [16, 16, 11] }, { d: 'M11 16.5 L14.5 20 L21 12.5' }],
    node: [25, 8, 1.8],
  },
} satisfies Record<string, IconDef>

export type C4IconName = keyof typeof icons
