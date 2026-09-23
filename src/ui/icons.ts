const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  sword: svg('<path d="M19 4 L9.5 13.5"/><path d="M19 4 L20 3 M19 4 h1.5 M19 4 v-1.5"/><path d="M6.5 11.5 L12.5 17.5"/><path d="M9.5 14.5 L4.5 19.5"/>'),
  dodge: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.6-5.7"/><path d="M4 4.5v4h4"/>'),
  bag: svg('<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  pause: svg('<path d="M9 5v14M15 5v14"/>'),
  lock: svg('<rect x="6" y="11" width="12" height="9" rx="1.5"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>'),
  portal: svg('<ellipse cx="12" cy="12" rx="6" ry="8.5"/><ellipse cx="12" cy="12" rx="2.5" ry="4.5"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
};
