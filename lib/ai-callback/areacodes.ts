// US area code → state + IANA timezone. Used to (a) pick the CA-specific AI
// disclosure greeting and (b) enforce the calling window in the lead's LOCAL
// time. Area code is a proxy (people keep numbers when they move) — treat it
// as best effort, which is why the window is stricter than the federal 8–21.
//
// Split-timezone states: each area code is mapped to the zone covering most
// of its population. UNKNOWN codes are handled conservatively in
// calling-window.ts (must be inside the window in BOTH Eastern and Pacific).

export type AreaInfo = { state: string; tz: string }

const ET = 'America/New_York'
const CT = 'America/Chicago'
const MT = 'America/Denver'
const AZ = 'America/Phoenix'
const PT = 'America/Los_Angeles'
const AK = 'America/Anchorage'
const HI = 'Pacific/Honolulu'
const PR = 'America/Puerto_Rico'

function add(map: Record<string, AreaInfo>, state: string, tz: string, codes: number[]) {
  for (const c of codes) map[String(c)] = { state, tz }
}

const AREA: Record<string, AreaInfo> = {}

add(AREA, 'AL', CT, [205, 251, 256, 334, 659, 938])
add(AREA, 'AK', AK, [907])
add(AREA, 'AZ', AZ, [480, 520, 602, 623, 928])
add(AREA, 'AR', CT, [479, 501, 870])
add(AREA, 'CA', PT, [209, 213, 279, 310, 323, 341, 350, 369, 408, 415, 424, 442, 510, 530, 559, 562, 619, 626, 628, 650, 657, 661, 669, 707, 714, 747, 760, 805, 818, 820, 831, 840, 858, 909, 916, 925, 949, 951])
add(AREA, 'CO', MT, [303, 719, 720, 970, 983])
add(AREA, 'CT', ET, [203, 475, 860, 959])
add(AREA, 'DE', ET, [302])
add(AREA, 'DC', ET, [202])
add(AREA, 'FL', ET, [239, 305, 321, 352, 386, 407, 448, 561, 645, 656, 689, 727, 754, 772, 786, 813, 850, 863, 904, 941, 954])
add(AREA, 'GA', ET, [229, 404, 470, 478, 678, 706, 762, 770, 912, 943])
add(AREA, 'HI', HI, [808])
add(AREA, 'ID', MT, [208, 986])
add(AREA, 'IL', CT, [217, 224, 309, 312, 331, 447, 464, 618, 630, 708, 730, 773, 779, 815, 847, 872])
add(AREA, 'IN', ET, [260, 317, 463, 574, 765, 812, 930])
add(AREA, 'IN', CT, [219])
add(AREA, 'IA', CT, [319, 515, 563, 641, 712])
add(AREA, 'KS', CT, [316, 620, 785, 913])
add(AREA, 'KY', ET, [502, 606, 859])
add(AREA, 'KY', CT, [270, 364])
add(AREA, 'LA', CT, [225, 318, 337, 504, 985])
add(AREA, 'ME', ET, [207])
add(AREA, 'MD', ET, [240, 301, 410, 443, 667])
add(AREA, 'MA', ET, [339, 351, 413, 508, 617, 774, 781, 857, 978])
add(AREA, 'MI', ET, [231, 248, 269, 313, 517, 586, 616, 679, 734, 810, 906, 947, 989])
add(AREA, 'MN', CT, [218, 320, 507, 612, 651, 763, 952])
add(AREA, 'MS', CT, [228, 601, 662, 769])
add(AREA, 'MO', CT, [314, 417, 557, 573, 636, 660, 816, 975])
add(AREA, 'MT', MT, [406])
add(AREA, 'NE', CT, [308, 402, 531])
add(AREA, 'NV', PT, [702, 725, 775])
add(AREA, 'NH', ET, [603])
add(AREA, 'NJ', ET, [201, 551, 609, 640, 732, 848, 856, 862, 908, 973])
add(AREA, 'NM', MT, [505, 575])
add(AREA, 'NY', ET, [212, 315, 329, 332, 347, 363, 516, 518, 585, 607, 624, 631, 646, 680, 716, 718, 838, 845, 914, 917, 929, 934])
add(AREA, 'NC', ET, [252, 336, 472, 704, 743, 828, 910, 919, 980, 984])
add(AREA, 'ND', CT, [701])
add(AREA, 'OH', ET, [216, 220, 234, 283, 326, 330, 380, 419, 436, 440, 513, 567, 614, 740, 937])
add(AREA, 'OK', CT, [405, 539, 572, 580, 918])
add(AREA, 'OR', PT, [458, 503, 541, 971])
add(AREA, 'PA', ET, [215, 223, 267, 272, 412, 445, 484, 570, 582, 610, 717, 724, 814, 835, 878])
add(AREA, 'RI', ET, [401])
add(AREA, 'SC', ET, [803, 821, 839, 843, 854, 864])
add(AREA, 'SD', CT, [605])
add(AREA, 'TN', CT, [615, 629, 731, 901, 931])
add(AREA, 'TN', ET, [423, 865])
add(AREA, 'TX', CT, [210, 214, 254, 281, 325, 346, 361, 409, 430, 432, 469, 512, 682, 713, 726, 737, 806, 817, 830, 832, 903, 936, 940, 945, 956, 972, 979])
add(AREA, 'TX', MT, [915])
add(AREA, 'UT', MT, [385, 801])
add(AREA, 'VT', ET, [802])
add(AREA, 'VA', ET, [276, 434, 540, 571, 686, 703, 757, 804, 826, 948])
add(AREA, 'WA', PT, [206, 253, 360, 425, 509, 564])
add(AREA, 'WV', ET, [304, 681])
add(AREA, 'WI', CT, [262, 274, 353, 414, 534, 608, 715, 920])
add(AREA, 'WY', MT, [307])
add(AREA, 'PR', PR, [787, 939])

// Toll-free / non-geographic — never dial these as a lead.
const NON_GEOGRAPHIC = new Set(['800', '833', '844', '855', '866', '877', '888', '900', '500', '521', '522', '533', '544', '566', '577', '588'])

export function areaCodeOf(e164: string): string {
  return e164.replace(/^\+1/, '').slice(0, 3)
}

export function lookupArea(e164: string): AreaInfo & { dialable: boolean } {
  const ac = areaCodeOf(e164)
  if (NON_GEOGRAPHIC.has(ac)) return { state: 'UNKNOWN', tz: ET, dialable: false }
  const hit = AREA[ac]
  if (hit) return { ...hit, dialable: true }
  return { state: 'UNKNOWN', tz: ET, dialable: true }
}
