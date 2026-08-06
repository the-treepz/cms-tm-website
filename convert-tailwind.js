const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'index.html');

let html = fs.readFileSync(INPUT, 'utf8');

// Helpers
const num = (v) => {
  if (v.endsWith('px')) { const n = parseFloat(v.slice(0,-2)); return Number.isInteger(n) ? n+'px' : n+'px'; }
  return v;
};

// Mapping from CSS prop + value -> Tailwind class (or null if can't convert)
// Returns array of classes (or null)
function declToClass(prop, val) {
  prop = prop.trim().toLowerCase();
  val = val.trim();
  const hasInterp = val.includes('{{') || val.includes('}}');
  const v = val;

  // ========== DISPLAY ==========
  if (prop === 'display') {
    if (v === 'flex') return ['flex'];
    if (v === 'grid') return ['grid'];
    if (v === 'block') return ['block'];
    if (v === 'inline-flex') return ['inline-flex'];
    if (v === 'inline-block') return ['inline-block'];
    if (v === 'none') return ['hidden'];
    if (v === 'contents') return ['contents'];
    return null;
  }
  if (prop === 'flex-direction') {
    if (v === 'column') return ['flex-col'];
    if (v === 'row') return ['flex-row'];
    if (v === 'column-reverse') return ['flex-col-reverse'];
    return null;
  }
  if (prop === 'flex-wrap') {
    if (v === 'wrap') return ['flex-wrap'];
    if (v === 'nowrap') return ['flex-nowrap'];
    return null;
  }
  if (prop === 'flex-grow' && v === '1') return ['flex-grow'];
  if (prop === 'flex-shrink' && v === '0') return ['flex-shrink-0'];
  if (prop === 'flex') {
    if (v === '1') return ['flex-1'];
    if (v === 'auto') return ['flex-auto'];
    if (v === 'none') return ['flex-none'];
    // e.g. "0 0 248px" -> flex-none w-[248px] basis-[248px]
    const parts = v.split(/\s+/);
    if (parts.length === 3) {
      const [g = '', s = '', b = ''] = parts;
      const out = [];
      if (g === '0' && s === '0') out.push('flex-none');
      else if (g === '1' && s === '1') out.push('flex-1');
      if (b && b !== 'auto') out.push(`basis-[${num(b)}]`);
      return out;
    }
    return null;
  }

  // ========== ALIGNMENT ==========
  if (prop === 'align-items') {
    const m = { 'flex-start':'items-start', 'center':'items-center', 'flex-end':'items-end', 'stretch':'items-stretch', 'baseline':'items-baseline' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'align-self') {
    const m = { 'flex-start':'self-start', 'center':'self-center', 'flex-end':'self-end', 'stretch':'self-stretch' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'justify-content') {
    const m = { 'flex-start':'justify-start', 'center':'justify-center', 'flex-end':'justify-end', 'space-between':'justify-between', 'space-around':'justify-around', 'space-evenly':'justify-evenly' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'justify-items') {
    const m = { 'start':'justify-items-start', 'center':'justify-items-center', 'end':'justify-items-end', 'stretch':'justify-items-stretch' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'place-items') {
    if (v === 'center') return ['place-items-center'];
    return null;
  }

  // ========== GAP ==========
  if (prop === 'gap') {
    const parts = v.split(/\s+/);
    if (parts.length === 1) return [`gap-[${num(parts[0])}]`];
    if (parts.length === 2) return [`gap-y-[${num(parts[0])}]`, `gap-x-[${num(parts[1])}]`];
    return null;
  }
  if (prop === 'row-gap' || prop === 'grid-row-gap') return [`gap-y-[${num(v)}]`];
  if (prop === 'column-gap' || prop === 'grid-column-gap') return [`gap-x-[${num(v)}]`];

  // ========== GRID ==========
  if (prop === 'grid-template-columns') {
    // repeat(3,1fr) -> grid-cols-3; repeat(N,1fr) -> grid-cols-N
    let m = v.match(/^repeat\((\d+),\s*1fr\)$/);
    if (m) return [`grid-cols-${m[1]}`];
    m = v.match(/^(\d+)\s*fr\s+(\d+)\s*fr$/);
    if (m) { const a = parseInt(m[1]), b = parseInt(m[2]); return [`grid-cols-[${a}fr_${b}fr]`]; }
    m = v.match(/^(\d+\.?\d*fr)\s+(\d+\.?\d*fr)\s+(\d+\.?\d*fr)$/);
    if (m) return [`grid-cols-[${m[1]}_${m[2]}_${m[3]}]`];
    if (v === '1fr 1fr') return [`grid-cols-2`];
    if (v === '1fr') return [`grid-cols-1`];
    if (v === '300px 1fr') return [`grid-cols-[300px_1fr]`];
    return [`grid-cols-[${v.replace(/\s+/g,'_')}]`];
  }
  if (prop === 'grid-template-rows') return [`grid-rows-[${v.replace(/\s+/g,'_')}]`];
  if (prop === 'grid-column') {
    if (v === '1 / -1') return ['col-span-full'];
    const m = v.match(/^(\d+)\s*\/\s*-\s*1$/);
    if (m) return [`col-[${m[1]}_-1]`];
    return [`col-[${v.replace(/\s+/g,'_')}]`];
  }
  if (prop === 'grid-row') return [`row-[${v.replace(/\s+/g,'_')}]`];

  // ========== POSITION ==========
  if (prop === 'position') {
    const m = { 'relative':'relative', 'absolute':'absolute', 'fixed':'fixed', 'sticky':'sticky', 'static':'static' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'top') { if (v === '0') return ['top-0']; return [`top-[${num(v)}]`]; }
  if (prop === 'left') { if (v === '0') return ['left-0']; return [`left-[${num(v)}]`]; }
  if (prop === 'right') { if (v === '0') return ['right-0']; return [`right-[${num(v)}]`]; }
  if (prop === 'bottom') { if (v === '0') return ['bottom-0']; return [`bottom-[${num(v)}]`]; }
  if (prop === 'inset') {
    if (v === '0') return ['inset-0'];
    return [`inset-[${num(v)}]`];
  }
  if (prop === 'z-index') return [`z-[${v}]`];

  // ========== OVERFLOW ==========
  if (prop === 'overflow') {
    const m = { 'hidden':'overflow-hidden', 'auto':'overflow-auto', 'scroll':'overflow-scroll', 'visible':'overflow-visible', 'clip':'overflow-clip' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'overflow-y') {
    const m = { 'hidden':'overflow-y-hidden', 'auto':'overflow-y-auto', 'scroll':'overflow-y-scroll' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'overflow-x') {
    const m = { 'hidden':'overflow-x-hidden', 'auto':'overflow-x-auto', 'scroll':'overflow-x-scroll' };
    return m[v] ? [m[v]] : null;
  }

  // ========== WIDTH / HEIGHT ==========
  if (prop === 'width') {
    if (v === '100%') return ['w-full'];
    if (v === '100vw') return ['w-screen'];
    if (v === '50%') return ['w-1/2'];
    if (v === '25%') return ['w-1/4'];
    if (v === '75%') return ['w-3/4'];
    if (v === '33.333%') return ['w-1/3'];
    if (v === '66.666%') return ['w-2/3'];
    if (v === 'auto') return ['w-auto'];
    if (v === 'max-content') return ['w-max'];
    if (v === 'min-content') return ['w-min'];
    if (v === 'fit-content') return ['w-fit'];
    return [`w-[${num(v)}]`];
  }
  if (prop === 'height') {
    if (v === '100%') return ['h-full'];
    if (v === '100vh') return ['h-screen'];
    if (v === '50%') return ['h-1/2'];
    if (v === 'auto') return ['h-auto'];
    if (v === 'max-content') return ['h-max'];
    return [`h-[${num(v)}]`];
  }
  if (prop === 'min-width') {
    if (v === 'max-content') return ['min-w-max'];
    return [`min-w-[${num(v)}]`];
  }
  if (prop === 'min-height') {
    if (v === 'max-content') return ['min-h-max'];
    return [`min-h-[${num(v)}]`];
  }
  if (prop === 'max-width') {
    // common sizes
    if (v === '100%') return ['max-w-full'];
    return [`max-w-[${num(v)}]`];
  }
  if (prop === 'max-height') {
    if (v === '100%') return ['max-h-full'];
    if (v === '100vh') return ['max-h-screen'];
    return [`max-h-[${num(v)}]`];
  }
  if (prop === 'aspect-ratio') return [`aspect-[${v.replace(/\s+/g,'/')}]`;

  // ========== PADDING ==========
  if (prop === 'padding') {
    const parts = v.split(/\s+/);
    if (parts.length === 1) {
      if (parts[0] === '0') return ['p-0'];
      return [`p-[${num(parts[0])}]`];
    }
    if (parts.length === 2) {
      return [`py-[${num(parts[0])}]`, `px-[${num(parts[1])}]`];
    }
    if (parts.length === 3) {
      return [`pt-[${num(parts[0])}]`, `px-[${num(parts[1])}]`, `pb-[${num(parts[2])}]`];
    }
    if (parts.length === 4) {
      return [`pt-[${num(parts[0])}]`, `pr-[${num(parts[1])}]`, `pb-[${num(parts[2])}]`, `pl-[${num(parts[3])}]`];
    }
    return null;
  }
  if (prop === 'padding-top') return v === '0' ? ['pt-0'] : [`pt-[${num(v)}]`];
  if (prop === 'padding-right') return v === '0' ? ['pr-0'] : [`pr-[${num(v)}]`];
  if (prop === 'padding-bottom') return v === '0' ? ['pb-0'] : [`pb-[${num(v)}]`];
  if (prop === 'padding-left') return v === '0' ? ['pl-0'] : [`pl-[${num(v)}]`];

  // ========== MARGIN ==========
  if (prop === 'margin') {
    if (v === '0 auto') return ['mx-auto'];
    if (v === '0') return ['m-0'];
    const parts = v.split(/\s+/);
    if (parts.length === 1) return [`m-[${num(parts[0])}]`];
    if (parts.length === 2) {
      if (parts[0] === '0' && parts[1] === 'auto') return ['mx-auto'];
      return [`my-[${num(parts[0])}]`, `mx-[${num(parts[1])}]`];
    }
    if (parts.length === 3) {
      return [`mt-[${num(parts[0])}]`, `mx-[${num(parts[1])}]`, `mb-[${num(parts[2])}]`];
    }
    if (parts.length === 4) {
      return [`mt-[${num(parts[0])}]`, `mr-[${num(parts[1])}]`, `mb-[${num(parts[2])}]`, `ml-[${num(parts[3])}]`];
    }
    return null;
  }
  if (prop === 'margin-top') return v === '0' ? ['mt-0'] : [`mt-[${num(v)}]`];
  if (prop === 'margin-right') return v === '0' ? ['mr-0'] : [`mr-[${num(v)}]`];
  if (prop === 'margin-bottom') return v === '0' ? ['mb-0'] : [`mb-[${num(v)}]`];
  if (prop === 'margin-left') return v === '0' ? ['ml-0'] : [`ml-[${num(v)}]`];

  // ========== TYPOGRAPHY ==========
  if (prop === 'font-family') {
    const f = v.split(',')[0].trim().replace(/['"]/g,'');
    return [`font-[${f}]`];
  }
  if (prop === 'font-weight') {
    const m = { '100':'font-thin','200':'font-extralight','300':'font-light','400':'font-normal','500':'font-medium','600':'font-semibold','700':'font-bold','800':'font-extrabold','900':'font-black' };
    return m[v] ? [m[v]] : [`font-[${v}]`];
  }
  if (prop === 'font-size') return [`text-[${num(v)}]`];
  if (prop === 'line-height') {
    // could be number ratio like 1.5 -> leading-1.5 style
    if (/^\d+(\.\d+)?$/.test(v)) return [`leading-[${v}]`];
    return [`leading-[${num(v)}]`];
  }
  if (prop === 'letter-spacing') return [`tracking-[${num(v)}]`];
  if (prop === 'text-transform') {
    const m = { 'uppercase':'uppercase', 'lowercase':'lowercase', 'capitalize':'capitalize', 'none':'normal-case' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'text-align') {
    const m = { 'left':'text-left', 'center':'text-center', 'right':'text-right', 'justify':'text-justify' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'text-decoration') {
    if (v === 'none') return ['no-underline'];
    if (v === 'underline') return ['underline'];
    if (v === 'line-through') return ['line-through'];
    return null;
  }
  if (prop === 'text-decoration-style' && v === 'none') return ['no-underline'];
  if (prop === 'color') {
    if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl')) return [`text-[${v.replace(/\s+/g,'')}]`];
    return [`text-[${v}]`];
  }
  if (prop === 'font-style' && v === 'italic') return ['italic'];
  if (prop === 'white-space' && v === 'nowrap') return ['whitespace-nowrap'];
  if (prop === 'word-break') {
    if (v === 'break-word') return ['break-words'];
    return null;
  }

  // ========== BACKGROUND ==========
  if (prop === 'background' || prop === 'background-color') {
    if (v === 'transparent') return ['bg-transparent'];
    if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl')) {
      return [`bg-[${v.replace(/\s+/g,'')}]`];
    }
    if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient') || v.startsWith('conic-gradient')) {
      return [`bg-[${v.replace(/\s+/g,'_').replace(/,/g,'\\,')}]`];
    }
    if (v.startsWith('repeating-linear-gradient')) {
      return [`bg-[image:${v.replace(/\s+/g,'_').replace(/,/g,'\\,')}]`];
    }
    return null;
  }
  if (prop === 'background-image') {
    if (v.startsWith('linear-gradient') || v.startsWith('radial-gradient') || v.startsWith('repeating-linear-gradient')) {
      return [`bg-[image:${v.replace(/\s+/g,'_').replace(/,/g,'\\,')}]`];
    }
    return null;
  }
  if (prop === 'background-size') {
    const m = { 'cover':'bg-cover', 'contain':'bg-contain' };
    return m[v] ? [m[v]] : [`bg-[size:${v}]`];
  }
  if (prop === 'background-repeat') {
    const m = { 'no-repeat':'bg-no-repeat', 'repeat':'bg-repeat', 'repeat-x':'bg-repeat-x', 'repeat-y':'bg-repeat-y' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'background-position') return [`bg-[position:${v.replace(/\s+/g,'_')}]`];
  if (prop === 'background-clip') return [`bg-clip-[${v}]`];
  if (prop === 'background-blend-mode') return [`bg-blend-[${v}]`];
  if (prop === 'backdrop-filter') {
    const blurM = v.match(/^blur\(([^)]+)\)$/);
    if (blurM) return [`backdrop-blur-[${num(blurM[1])}]`];
    return [`backdrop-filter:[${v}]`];
  }
  if (prop === 'filter') {
    const blurM = v.match(/^blur\(([^)]+)\)$/);
    if (blurM) return [`blur-[${num(blurM[1])}]`];
    return null;
  }
  if (prop === 'opacity') return [`opacity-[${v}]`];
  if (prop === 'visibility') {
    if (v === 'hidden') return ['invisible'];
    if (v === 'visible') return ['visible'];
    return null;
  }

  // ========== BORDER ==========
  if (prop === 'border' || prop === 'border-style') {
    if (prop === 'border' && v === 'none') return ['border-0'];
    // "1px solid #fff"
    const m = v.match(/^(\d+px)\s+(solid|dashed|dotted|double)\s+(.+)$/);
    if (m) {
      const [,w,s,c] = m;
      const out = [`border-[${w}]`, `border-${s}`];
      if (c.startsWith('#') || c.startsWith('rgb') || c.startsWith('hsl')) {
        out.push(`border-[${c.replace(/\s+/g,'')}]`);
      } else {
        out.push(`border-[${c}]`);
      }
      return out;
    }
    const wm = v.match(/^(\d+px)$/);
    if (wm) return [`border-[${wm[1]}]`];
    const sm = v.match(/^(solid|dashed|dotted)$/);
    if (sm) return [`border-${sm[1]}`];
    return null;
  }
  if (prop === 'border-width') return [`border-[${num(v)}]`];
  if (prop === 'border-style') {
    const m = { 'solid':'border-solid', 'dashed':'border-dashed', 'dotted':'border-dotted', 'none':'border-none' };
    return m[v] ? [m[v]] : [`border-[${v}]`];
  }
  if (prop === 'border-color') {
    if (v.startsWith('#') || v.startsWith('rgb')) return [`border-[${v.replace(/\s+/g,'')}]`];
    return [`border-[${v}]`];
  }
  if (prop === 'border-top') {
    const m = v.match(/^(\d+px)\s+(solid|dashed|dotted)\s+(.+)$/);
    if (m) {
      const [,w,s,c] = m;
      const out = [`border-t-[${w}]`, `border-t-${s}`];
      if (c.startsWith('#') || c.startsWith('rgb')) out.push(`border-t-[${c.replace(/\s+/g,'')}]`);
      else out.push(`border-t-[${c}]`);
      return out;
    }
    return null;
  }
  if (prop === 'border-bottom') {
    const m = v.match(/^(\d+px)\s+(solid|dashed|dotted)\s+(.+)$/);
    if (m) {
      const [,w,s,c] = m;
      const out = [`border-b-[${w}]`, `border-b-${s}`];
      if (c.startsWith('#') || c.startsWith('rgb')) out.push(`border-b-[${c.replace(/\s+/g,'')}]`);
      else out.push(`border-b-[${c}]`);
      return out;
    }
    return null;
  }
  if (prop === 'border-left') {
    const m = v.match(/^(\d+px)\s+(solid|dashed|dotted)\s+(.+)$/);
    if (m) {
      const [,w,s,c] = m;
      const out = [`border-l-[${w}]`, `border-l-${s}`];
      if (c.startsWith('#') || c.startsWith('rgb')) out.push(`border-l-[${c.replace(/\s+/g,'')}]`);
      else out.push(`border-l-[${c}]`);
      return out;
    }
    return null;
  }
  if (prop === 'border-right') {
    const m = v.match(/^(\d+px)\s+(solid|dashed|dotted)\s+(.+)$/);
    if (m) {
      const [,w,s,c] = m;
      const out = [`border-r-[${w}]`, `border-r-${s}`];
      if (c.startsWith('#') || c.startsWith('rgb')) out.push(`border-r-[${c.replace(/\s+/g,'')}]`);
      else out.push(`border-r-[${c}]`);
      return out;
    }
    return null;
  }
  if (prop === 'border-radius') {
    if (v === '50%') return ['rounded-full'];
    if (v === '999px' || v === '9999px') return ['rounded-full'];
    const parts = v.split(/\s+/);
    if (parts.length === 1) return [`rounded-[${num(parts[0])}]`];
    if (parts.length === 2) return [`rounded-tl-[${num(parts[0])}]`, `rounded-br-[${num(parts[0])}]`, `rounded-tr-[${num(parts[1])}]`, `rounded-bl-[${num(parts[1])}]`];
    if (parts.length === 4) return [`rounded-tl-[${num(parts[0])}]`, `rounded-tr-[${num(parts[1])}]`, `rounded-br-[${num(parts[2])}]`, `rounded-bl-[${num(parts[3])}]`];
    return [`rounded-[${v.replace(/\s+/g,'_')}]`];
  }
  if (prop === 'border-top-left-radius') return [`rounded-tl-[${num(v)}]`];
  if (prop === 'border-top-right-radius') return [`rounded-tr-[${num(v)}]`];
  if (prop === 'border-bottom-left-radius') return [`rounded-bl-[${num(v)}]`];
  if (prop === 'border-bottom-right-radius') return [`rounded-br-[${num(v)}]`];
  if (prop === 'outline') {
    if (v === 'none') return ['outline-none'];
    return null;
  }
  if (prop === 'box-shadow') {
    if (v === 'none') return ['shadow-none'];
    return [`shadow-[${v.replace(/\s+/g,'_').replace(/,/g,'\\,')}]`];
  }

  // ========== TRANSFORM ==========
  if (prop === 'transform') {
    const out = [];
    let rest = v;
    const tx = v.match(/translateX\(([^)]+)\)/);
    if (tx) { out.push(`translate-x-[${num(tx[1])}]`); rest = rest.replace(tx[0],''); }
    const ty = v.match(/translateY\(([^)]+)\)/);
    if (ty) { out.push(`translate-y-[${num(ty[1])}]`); rest = rest.replace(ty[0],''); }
    const t = v.match(/translate\(\s*([^,]+)\s*,\s*([^)]+)\)/);
    if (t) { out.push(`translate-x-[${num(t[1])}]`, `translate-y-[${num(t[2])}]`); rest = rest.replace(t[0],''); }
    const s = v.match(/scale\(([^)]+)\)/);
    if (s) { out.push(`scale-[${s[1].trim()}]`); rest = rest.replace(s[0],''); }
    const sk = v.match(/scale\(([^,]+),\s*([^)]+)\)/);
    if (sk) { out.push(`scale-x-[${sk[1].trim()}]`, `scale-y-[${sk[2].trim()}]`); rest = rest.replace(sk[0],''); }
    const rot = v.match(/rotate\(([^)]+)\)/);
    if (rot) { out.push(`rotate-[${rot[1]}]`); rest = rest.replace(rot[0],''); }
    if (out.length) return out;
    return null;
  }
  if (prop === 'will-change') return [`will-change-[${v.replace(/\s+/g,'_')}]`];

  // ========== TRANSITIONS ==========
  if (prop === 'transition') {
    if (v === 'none') return ['transition-none'];
    // keep complex transitions inline, they're often fine
    return [`transition-[${v.replace(/\s+/g,'_').replace(/,/g,'\\,')}]`];
  }
  if (prop === 'transition-property') return [`transition-[${v.replace(/\s+/g,'_').replace(/,/g,'\\,')}]`];
  if (prop === 'transition-duration') return [`duration-[${num(v)}]`];
  if (prop === 'transition-timing-function') {
    if (v === 'ease') return ['ease'];
    if (v === 'ease-in') return ['ease-in'];
    if (v === 'ease-out') return ['ease-out'];
    if (v === 'ease-in-out') return ['ease-in-out'];
    if (v === 'linear') return ['ease-linear'];
    return null;
  }

  // ========== ANIMATIONS ==========
  if (prop.startsWith('animation')) {
    // keep animation inline - too complex (esp. with animation-timeline:view())
    return null;
  }

  // ========== INTERACTIONS ==========
  if (prop === 'cursor') {
    const m = { 'pointer':'cursor-pointer', 'default':'cursor-default', 'text':'cursor-text', 'grab':'cursor-grab', 'grabbing':'cursor-grabbing', 'move':'cursor-move', 'not-allowed':'cursor-not-allowed', 'help':'cursor-help', 'wait':'cursor-wait' };
    return m[v] ? [m[v]] : [`cursor-[${v}]`];
  }
  if (prop === 'pointer-events') {
    if (v === 'none') return ['pointer-events-none'];
    if (v === 'auto') return ['pointer-events-auto'];
    return null;
  }
  if (prop === 'user-select') {
    if (v === 'none') return ['select-none'];
    if (v === 'text') return ['select-text'];
    return null;
  }
  if (prop === 'resize') {
    const m = { 'none':'resize-none', 'both':'resize', 'horizontal':'resize-x', 'vertical':'resize-y' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'appearance') {
    if (v === 'none') return ['appearance-none'];
    return null;
  }
  if (prop === 'accent-color') return [`accent-[${v}]`];

  // ========== IMAGE / OBJECT ==========
  if (prop === 'object-fit') {
    const m = { 'cover':'object-cover', 'contain':'object-contain', 'fill':'object-fill', 'none':'object-none', 'scale-down':'object-scale-down' };
    return m[v] ? [m[v]] : null;
  }
  if (prop === 'object-position') return [`object-[${v.replace(/\s+/g,'_')}]`];

  // ========== CONTENT ==========
  if (prop === 'content') return null; // keep inline

  return null; // can't convert
}

// Parse style string into array of [prop, val]
function parseStyle(styleStr) {
  const decls = [];
  // split by ; but not inside {{ }} or url() or parens or brackets
  let buf = '';
  let depth = 0;
  let inBraces = 0;
  for (let i = 0; i < styleStr.length; i++) {
    const c = styleStr[i];
    if (c === '{') inBraces++;
    else if (c === '}') inBraces--;
    else if (c === '(' && inBraces === 0) depth++;
    else if (c === ')' && inBraces === 0) depth--;
    if (c === ';' && depth === 0 && inBraces === 0) {
      if (buf.trim()) decls.push(buf.trim());
      buf = '';
    } else {
      buf += c;
    }
  }
  if (buf.trim()) decls.push(buf.trim());
  return decls.map(d => {
    const colon = d.indexOf(':');
    if (colon < 0) return null;
    return [d.slice(0, colon).trim(), d.slice(colon + 1).trim()];
  }).filter(Boolean);
}

// Process style="..." -> class="..." + style="..." (remaining)
function processStyleAttr(match) {
  const styleStr = match.slice(7, -1); // remove style="..."
  // if contains {{ }} in certain values, keep those declarations inline
  const decls = parseStyle(styleStr);
  if (decls.length === 0) return '';

  const classes = [];
  const remainingDecls = [];
  let hasInterpOverall = styleStr.includes('{{');

  for (const [prop, val] of decls) {
    const hasInterp = val.includes('{{') || val.includes('}}');
    // Keep animations inline — Tailwind arbitrary for animation etc.
    const isAnimationProp = prop.startsWith('animation');
    // Keep arbitrary content inline
    const isContent = prop === 'content';
    // Keep custom transitions inline that have multi-part with cubic-bezier etc
    const isComplexTransition = (prop === 'transition' || prop==='transition-timing-function') && (val.includes('cubic-bezier') || val.includes(','));

    if (hasInterp || isAnimationProp || isContent || isComplexTransition) {
      remainingDecls.push(`${prop}: ${val}`);
      continue;
    }
    const result = declToClass(prop, val);
    if (result && result.length) {
      for (const c of result) classes.push(c);
    } else {
      remainingDecls.push(`${prop}: ${val}`);
    }
  }

  return { classes, remainingDecls };
}

// Replace style attributes in the HTML
// We need to also merge with existing class="" if present
// Strategy: find tags with style attribute, process, then potentially add class attribute nearby

// Step 1: find all tags with style attribute and build replacement map
const STYLE_RE = /<([a-zA-Z][a-zA-Z0-9-]*)\s+((?:[^>|\s)*?style="([^"]*(?:\{\{[^}]*\}\}[^"]*)*)")((?:\s[^>]*)?>/g;
// Actually simpler: just process each occurrence using a regex on the style attr directly
const STYLE_ATTR_RE = /\sstyle="([^"]*(?:\{\{[^}]*\}\}[^"]*)*)"/g;
const CLASS_ATTR_RE = /\sclass="([^"]*)"/;

function convertStyles(html) {
  let out = '';
  let i = 0;
  // Work tag by tag
  const TAG_RE = /<([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)\s*>/g;
  let m;
  let last = 0;
  while ((m = TAG_RE.exec(html)) !== null) {
    out += html.slice(last, m.index);
    const tagName = m[1];
    let attrs = m[2];
    const styleMatch = attrs.match(STYLE_ATTR_RE);
    if (!styleMatch) {
      out += m[0];
      last = m.index + m[0].length;
      continue;
    }
    // remove style for processing
    const styleStrMatch = styleMatch[0].match(/\sstyle="([^"]*(?:\{\{[^}]*\}\}[^"]*)*)"/);
    const styleContent = styleStrMatch[1];
    // Process style
    const decls = parseStyle(styleContent);
    if (decls.length === 0) {
      out += m[0];
      last = m.index + m[0].length;
      continue;
    }
    const classes = [];
    const remainingDecls = [];
    for (const [prop, val] of decls) {
      const hasInterp = (val.includes('{{') || val.includes('}}'));
      const isAnimationProp = prop.startsWith('animation');
      const isContent = prop === 'content';
      const isComplexTransition = (prop === 'transition' || prop==='transition-timing-function') && (val.includes('cubic-bezier') || (prop === 'transition' && val.includes(',')));

      if (hasInterp || isAnimationProp || isContent || isComplexTransition) {
        remainingDecls.push(`${prop}: ${val}`);
        continue;
      }
      const result = declToClass(prop, val);
      if (result && result.length) {
        for (const c of result) classes.push(c);
      } else {
        remainingDecls.push(`${prop}: ${val}`);
      }
    }

    // Now remove style attr from attrs
    let newAttrs = attrs.replace(STYLE_ATTR_RE, '');
    // Remove existing class attr and merge classes
    const classMatch = newAttrs.match(CLASS_ATTR_RE);
    if (classMatch) {
      const existingClasses = classMatch[1].trim();
      const allClasses = (existingClasses ? existingClasses.split(/\s+/) : []).concat(classes);
      newAttrs = newAttrs.replace(CLASS_ATTR_RE, '') + ` class="${allClasses.join(' ')}"`;
    } else if (classes.length) {
      newAttrs += ` class="${classes.join(' ')}"`;
    }
    // Add remaining style back
    if (remainingDecls.length) {
      newAttrs += ` style="${remainingDecls.join('; ')}"`;
    }
    out += `<${tagName}${newAttrs}>`;
    last = m.index + m[0].length;
  }
  out += html.slice(last);
  return out;
}

let converted = convertStyles(html);
// Ensure we don't have empty `class="" style=""` mess - clean up
converted = converted.replace(/\sclass="\s*"/g, '');
converted = converted.replace(/\sstyle="\s*"/g, '');
// Clean double spaces
converted = converted.replace(/  +/g, ' ');
// Clean " >" -> ">"
converted = converted.replace(/\s+>/g, '>');
// Clean double spaces inside class attributes
converted = converted.replace(/class="([^"]*]*)"/g, (m, c) => 'class="' + c.replace(/\s+/g, ' ').trim() + '"');

fs.writeFileSync(INPUT, converted);

console.log('Done converting styles to Tailwind.');
