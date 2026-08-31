# Cipher4 — Image Generation Brief (v2, "Signal Glass")

Every image on the site is generated from this document. Paste each prompt into your image
model, then save the result to `public/images/` under the **exact filename given**, replacing
the placeholder that is there now.

> **What changed in v2.** The site is now dark-first with glassmorphic panels. Images sit
> *behind* translucent glass, which changes what a good image is. A bright, busy photograph
> behind a glass panel turns it into fog and drags the text on it below the contrast floor.
> Every prompt below has been re-graded darker with more open space. If you already generated
> images against v1, regenerate — v1 images will look washed out under the new panels.

---

## Before you start — read this part

Fourteen separately-generated images look like a stock library unless they share a treatment.
**The style block below is what makes them look like one photo shoot.** Append it, unchanged,
to the end of every prompt.

### THE STYLE BLOCK — append to every prompt

```
Shot on a full-frame camera, 35mm lens, f/4. Cinematic colour grade pushed hard toward deep
navy and cyan; warm tones heavily desaturated. Low-key exposure — the image should read as
dark overall, with light coming from one clear direction and large areas falling into shadow.
Soft directional light, no harsh flare, no lens dirt. Calm, controlled, documentary realism —
not sci-fi, no glowing holograms, no floating HUD graphics, no visible text, no readable logos
or brand marks, no distorted hands or faces. Muted contrast in the midtones, deep blacks,
slight film grain, generous negative space. Photorealistic, 4K.
```

### Rules that matter

1. **Filenames must match exactly.** The site references these paths; a renamed file shows nothing.
2. **Aspect ratio matters more than resolution.** Each slot lists one. Getting it wrong causes ugly cropping.
3. **Longest edge 2400px is plenty.** The build converts to WebP and AVIF and generates responsive
   sizes automatically, but it cannot fix a badly-cropped source.
4. **Dark beats bright, every time.** If you are choosing between two generations, take the darker
   one. Glass panels and text overlays both depend on it.
5. **No text in images, ever.** Generated text is always subtly wrong, and it cannot be translated
   or read by a screen reader.
6. **No recognisable faces.** People at a distance, from behind, in profile, or in silhouette — in
   PPE where the setting calls for it. This avoids uncanny-face artefacts and the implication that
   a stock model is a Cipher4 employee.
7. **Nigerian and West African context where people appear.** Crews on Nigerian operations should
   look like Nigerian crews. Say so in the prompt — models default otherwise.
8. **If a generation looks like a stock photo, regenerate it.** The tell is usually someone smiling
   at the camera or an unnaturally tidy environment.

---

## 1. Home hero — `hero-offshore.jpg`
**Ratio 21:9 · 2400 × 1029 · the single most important image on the site**

```
Wide dusk shot of an offshore support vessel lying alongside a lit oil and gas platform in a
calm open sea. Two or three deck crew in orange coveralls and hard hats, seen at a distance and
from behind, working on the vessel deck. Platform lights read cyan-white against a deep navy
sky in the last of the light. Camera low, close to the waterline, horizon sitting in the lower
third. The left third of the frame is open sea and sky, uncluttered and dark, for headline
text. The right side carries the platform structure but stays tonally simple — no bright sky,
no busy detail. West African offshore setting.
```
*Plus the style block.*

> **Two protected zones on this one.** Headline text sits over the **left third** — keep it calm
> and empty. Glass panels now float over the **right third** — keep it structurally interesting
> but tonally even, with no bright highlights. The middle can carry the subject.

---

## 2. Open Graph share image — `og-default.jpg`
**Ratio 1.91:1 · 1200 × 630 · what appears when the site is shared on LinkedIn or WhatsApp**

```
Aerial view at blue hour of a container terminal and adjacent offshore supply base, shot from
high and at an angle. Gantry cranes, stacked containers and one berthed vessel. Colours muted
hard toward navy, steel grey and cyan. Quiet, ordered, industrial, dark overall. Composition
weighted to the right so the left half stays open and calm.
```
*Plus the style block.*

---

## 3. Transport sector — `industry-transport.jpg`
**Ratio 16:9 · 1920 × 1080**

```
A haulage fleet of articulated trucks on a wide coastal highway at first light in West Africa,
shot from an elevated three-quarter angle. Two or three vehicles in motion with slight motion
blur on the wheels, the road curving toward the coast in the distance. Overcast, soft light,
muted colours pushed toward navy and grey, dark overall. No visible livery or company markings
on the trucks.
```
*Plus the style block.*
nice
---

## 4. Logistics sector — `industry-logistics.jpg`
**Ratio 16:9 · 1920 × 1080**

```
Blue-hour aerial of a busy container terminal: ship-to-shore gantry cranes standing over a
stacked container yard, one large vessel berthed alongside. Container colours desaturated toward
navy, rust and steel grey. Long exposure so terminal tractors leave soft cyan light trails
between the stacks. Elevated three-quarter angle, West African port setting, night falling.
```
*Plus the style block.*

---

## 5. Oil & gas sector — `industry-oil-and-gas.jpg`
**Ratio 16:9 · 1920 × 1080**

```
An offshore production platform photographed from a support vessel at dusk, in a calm sea. Deck
lighting on, the structure reading as a dark silhouette against a deep navy sky with the last
band of light at the horizon. A crew transfer basket or walkway visible mid-frame. Nobody's face
is visible. Restrained, serious, no drama in the weather.
```
*Plus the style block.*

---

## 6. Supply chain sector — `industry-supply-chain.jpg`
**Ratio 16:9 · 1920 × 1080**

```
Four professionals — West African, in business dress — reviewing printed tender documentation
spread across a meeting-room table. Shot from a middle distance and slightly to the side, so no
face is fully toward the camera. Single cool light source from a window to the left; the rest of
the room falling into shadow. A whiteboard out of focus behind them. Serious, working
atmosphere; nobody is smiling at the camera.
```
*Plus the style block.*

---

## 7. Software platforms — `solutions-software-platforms.jpg`
**Ratio 3:2 · 1800 × 1200**

```
An operations control room seen from behind two seated operators. A wall of monitors shows maps,
vessel positions and schedules — screen content abstract and unreadable, no legible text or
numbers. Room lighting very low, screens casting cool cyan-blue light onto the desks and the
operators' shoulders. The only light in the frame comes from the screens. Calm and orderly
rather than dramatic. West African operations centre.
```
*Plus the style block.*

> Screen content must stay abstract. Legible fake dashboards always look wrong — and the real
> product screenshots go elsewhere on the site, so this image does not need to carry them.

---

## 8. Field & offshore robotics — `solutions-robotics.jpg`
**Ratio 3:2 · 1800 × 1200 · also appears cropped to 16:9 inside a glass panel on the home page**

```
An industrial inspection drone in flight, close to the steel structure of an offshore platform,
photographed at first light. The drone is the clear subject in the near third of the frame,
sharply focused; the structure recedes behind it, slightly soft. Utilitarian, professional
equipment — not a consumer camera drone, no toy proportions. Cool grey-blue light, calm dark sea
below, overcast sky kept dim.
```
*Plus the style block.*

> **Crop warning.** This one is used twice: full 3:2 on the solutions page, and cropped to 16:9
> inside the floating hero panel. Keep the drone comfortably inside the middle band vertically,
> or the panel crop will cut it.

---

## 9. Technology supply — `solutions-technology-supply.jpg`
**Ratio 3:2 · 1800 × 1200**

```
An engineer in a plain work shirt, seen from behind and to the side, terminating structured
cabling in an industrial equipment room. Server and network racks either side, cable management
neat and deliberate. Practical task lighting from one direction, cool colour temperature, the
rest of the room dark. Real working environment rather than a showroom — no glowing blue LED
walls.
```
*Plus the style block.*

---

## 10. About — the team — `about-team.jpg`
**Ratio 4:3 · 1600 × 1200**

```
Three or four West African engineers in hard hats and hi-vis vests standing over a laptop and a
rolled technical drawing on the tailgate of a vehicle, at an industrial site. Shot from a middle
distance, candid, mid-conversation — one gesturing at the screen. Nobody looking at the camera.
Overcast daylight, muted colour, graded cool and dark.
```
*Plus the style block.*

---

## 11. About — field presence — `about-field.jpg`
**Ratio 4:3 · 1600 × 1200**

```
A single field engineer in coveralls, hard hat and life jacket, photographed from behind,
walking along the deck of an offshore support vessel toward a platform in the middle distance.
Early morning, calm grey-blue sea, no dramatic weather. The figure is small in the frame; the
scale of the structure ahead is the subject.
```
*Plus the style block.*

---

## 12. Careers — `careers.jpg`
**Ratio 4:3 · 1600 × 1200**

```
Two West African engineers at a workbench in a technical workshop, one holding a partly-assembled
robotic inspection unit while the other works on a laptop connected to it. Components and hand
tools on the bench. Single cool side light from a window; the rest of the workshop in shadow.
Focused, unposed, mid-task.
```
*Plus the style block.*

---

## 13. Contact — offices — `contact-offices.jpg`
**Ratio 4:3 · 1600 × 1200**

```
The exterior of a modern low-rise commercial office building in Abuja, photographed at blue hour
from across the street at a slight angle. Clean lines, glass and pale stone, warm interior
lights just coming on behind the glazing, mature trees in front. Graded cool and dark. No
signage, no readable text on the building.
```
*Plus the style block.*

> Changed from v1's late-afternoon framing to blue hour. A bright daylight building was the one
> image that refused to sit in a dark page without looking pasted on.

---

## 14. Case study headers — as projects are approved
**Ratio 3:2 · 1800 × 1200 · filename `project-[slug].jpg`**

Once each case study is written and approved, generate a header that shows the *environment* the
system runs in — the terminal, the vessel, the yard, the control room. Never a screenshot of the
system itself, and never anything that identifies the client.

Base prompt to adapt:

```
[The operating environment — e.g. "A marine supply base at first light, workboats alongside a
quay, cargo baskets on the dock"], photographed from a middle distance at an angle. Working
environment, unstaged, no people facing the camera, no readable signage or vessel names. Dark,
low-key, graded toward navy and cyan.
```
*Plus the style block.*

---

## What you are sending me, not generating

Three categories are **real assets, not generated images**. Do not prompt a model for these —
fabricating any of them is the specific failure that `projects.ts` and `credentials.ts` are
written to prevent.

### A. Product / interface screenshots
Screenshots of systems Cipher4 has actually built. Send them at the highest resolution you have,
PNG, no scaling up.

Before sending, check each one for: client names, real personnel names, live coordinates, vessel
names, internal URLs, ticket numbers, and anything in a browser chrome (bookmarks bar, tab
titles, address bar). If a screenshot cannot be cleaned, it does not ship — I will build the
section so it works with however many you can clear, including none.

### B. Client logos
`public/images/clients/`, SVG preferred, transparent PNG accepted. These render **only** where
`permissionGranted: true` in `projects.ts`. Send the written permission alongside each logo, or
the logo stays out — this is already enforced in code, not just in policy.

### C. The Cipher4 logo
`public/images/cipher4-logo.png` is currently **1.36 MB**, which is larger than every other image
on the site combined. If you have the original vector, send the SVG and this problem disappears
permanently. If not, say so and I will trace and optimise it.

---

## After you generate

1. Save each file to `public/images/` with its exact name from this brief.
2. Run `npm run dev` and check the pages the images appear on.
3. Check the **hero on a phone** specifically — it is the one image where the crop changes most
   between screen sizes, and it now also has glass panels sitting over it.

You do not need to compress anything or make WebP versions. The build does that, generates the
responsive sizes, and adds the dimensions that stop the page jumping while images load.

---

## What was wrong with the old images — so we don't repeat it

| File | Problem |
|---|---|
| `Engineering-Excellence.jpg` | **20.8 MB.** One image, larger than most entire websites. |
| `oil-and-gas.jpg` | **10.8 MB.** |
| `oil-and-gas1.png` | 7.9 MB, and a PNG of a photograph — the worst possible format choice. |
| `OPERATIONS.png` | Orange isometric 3D stock render. Off-brand in every colour it used. |
| `mobile-tracking.jpg` | Red and blue flat clipart. A third unrelated illustration style on the same page. |
| All of them | No `loading="lazy"`, no width/height, no modern formats. The home page exceeded 30 MB. |

Three unrelated illustration styles on one page is what made the old site read as assembled
rather than designed. One style block, applied without exception, is the fix.
