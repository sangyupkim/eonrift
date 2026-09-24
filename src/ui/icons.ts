const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  sword: svg('<path d="M19 4 L9.5 13.5"/><path d="M19 4 L20 3 M19 4 h1.5 M19 4 v-1.5"/><path d="M6.5 11.5 L12.5 17.5"/><path d="M9.5 14.5 L4.5 19.5"/>'),
  dodge: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.6-5.7"/><path d="M4 4.5v4h4"/>'),
  bag: svg('<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  pause: svg('<path d="M9 5v14M15 5v14"/>'),
  lock: svg('<rect x="6" y="11" width="12" height="9" rx="1.5"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>'),
  portal: svg('<ellipse cx="12" cy="12" rx="6" ry="8.5"/><ellipse cx="12" cy="12" rx="2.5" ry="4.5"/>'),
  person: svg('<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>'),
  warp: svg('<ellipse cx="12" cy="12" rx="6" ry="8.5"/><path d="M9 12h6M13 9.5l2.5 2.5-2.5 2.5"/>'),
  book: svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11h5"/>'),
  hammer: svg('<path d="M13 7l4-4 4 4-4 4z"/><path d="M15 9L5 19"/>'),
  potion: svg('<path d="M9 3h6M10 3v5l-4.5 8.5A3 3 0 0 0 8.2 21h7.6a3 3 0 0 0 2.7-4.5L14 8V3"/><path d="M7.5 14h9"/>'),
  hand: svg('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2.5-3.5a1.5 1.5 0 0 1 2.3-1.9L8 14"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
};
