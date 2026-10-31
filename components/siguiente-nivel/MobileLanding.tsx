// @ts-nocheck
/* eslint-disable */
'use client'
// Generated from the "Main.dc.html" artboard of the Yele design canvas.
// Behaviour: pinned hero → horizontal card sequence (scroll or drag) → form sheet that
// snaps up and locks (drag its top handle down to go back) → Por qué / Proyectos /
// Precios / formulario / FAQ / vídeo / formulario final. Front end only: the three
// forms set a "Recibido ✓" state — wire them to /api/lead in onSubmit / onSubmit2 / onSubmit3.
import React from 'react'
import { submitSiguienteNivelLead } from './leadSubmit'

export default class MobileLanding extends React.Component<{ accent?: string }, any> {

constructor(props) {
super(props);
this.ANIM = 3256;   // scroll px that drive the card sequence
this.PEEK_AT = 3380;  // scroll px where the sheet starts peeking up
this.FORM_AT = 3520; // scroll px where it snaps fully open and locks
this.drag = null;
this.sheetEl = null;
this.PROJECTS = [{"title": "Blackcrest", "desc": "Ventanas y puertas arquitectónicas de alta gama. Una web centrada en el producto con precio al instante según medidas: presupuesta cualquier hueco en segundos.", "v": "/media/siguiente-nivel/proyectos/blackcrest.mp4", "p": "/media/blackcrest/4_poster.webp", "a": "/media/blackcrest/6.webp", "b": "/media/blackcrest/1.webp"}, {"title": "Clark Fork", "desc": "Casas de troncos y madera a medida, construidas en Montana desde 1993. Una web serena y editorial que deja hablar al oficio y al paisaje.", "v": "/media/siguiente-nivel/proyectos/clarkfork.mp4", "p": "/media/clarkfork/4_poster.webp", "a": "/media/clarkfork/2.webp", "b": "/media/clarkfork/3.webp"}, {"title": "Clear Cool Water", "desc": "Una marca de agua de manantial de Florida que se vende por cajas. Una tienda limpia y centrada en el producto, con origen, datos de pureza y pedidos con un toque.", "v": "/media/siguiente-nivel/proyectos/clearwater.mp4", "p": "/media/clearwater/4_poster.webp", "a": "/media/clearwater/1.webp", "b": "/media/clearwater/2.webp"}, {"title": "Reptile Roadshow", "desc": "Espectáculos en vivo con animales exóticos y encuentros con reptiles. Una web atrevida, con tonos de selva y paquetes por niveles que se reservan al instante.", "v": "/media/siguiente-nivel/proyectos/reptileroadshow.mp4", "p": "/media/reptileroadshow/4_poster.webp", "a": "/media/reptileroadshow/1.webp", "b": "/media/reptileroadshow/2.webp"}, {"title": "Shinsetsu", "desc": "Una agencia de viajes boutique que diseña viajes de esquí a medida por la legendaria nieve polvo de Hokkaido.", "v": "/media/siguiente-nivel/proyectos/hokkaido.mp4", "p": "/media/hokkaido/4_poster.webp", "a": "/media/hokkaido/1.webp", "b": "/media/hokkaido/2.webp"}, {"title": "Restoration Bros", "desc": "Especialistas 24/7 en daños por agua y restauración tras desastres en Tampa, con una web pensada para cuando cada minuto cuenta.", "v": "/media/siguiente-nivel/proyectos/renovationbros.mp4", "p": "/media/renovationbros/4_poster.webp", "a": "/media/renovationbros/1.webp", "b": "/media/renovationbros/2.webp"}, {"title": "Duna", "desc": "Branding de producto completo para Duna, dátiles medjool ecológicos.", "v": "/media/siguiente-nivel/proyectos/duna.mp4", "p": "/media/duna/1_poster.webp", "a": "/media/duna/2.webp", "b": "/media/duna/4.webp"}, {"title": "Marketasa", "desc": "Una agencia de marketing de resultados. Una web editorial y de alto contraste que presenta sus casos de éxito como una revista.", "v": "/media/siguiente-nivel/proyectos/marketasa.mp4", "p": "/media/marketasa/4_poster.webp", "a": "/media/marketasa/1.webp", "b": "/media/marketasa/2.webp"}];
this.FAQS = [{"q": "¿Cuánto cuesta una web?", "a": "Las webs de Yele empiezan en 699€. La mayoría de pequeños negocios elige el plan Launch (699€) o el plan Business (1.199€). Las webs más avanzadas empiezan en 2.799€."}, {"q": "¿Hay una cuota mensual?", "a": "Sí — Yele Care, nuestro plan de mantenimiento, desde 19€/mes, en tres niveles: Yele Care Lite (19€/mes) — alojamiento, seguridad y copias; Yele Care (49€/mes) — un rediseño anual, actualizamos tu contenido y monitorización; y Yele Care+ (99€/mes) — seguridad avanzada, copias, monitorización y servicios."}, {"q": "¿Yele Care es obligatorio?", "a": "No — pero lo recomendamos mucho. Yele Care incluye un rediseño completo cada año, así renuevas tu web anualmente y todo sigue funcionando — alojado, seguro, con copias, monitorizado y actualizado. Puedes alojar y gestionar la web tú mismo, pero con Yele Care nunca tienes que preocuparte por la parte técnica."}, {"q": "¿Puedo actualizar mi web más adelante con mi contenido?", "a": "Sí — cuando quieras. Con Yele Care Lite puedes subir y actualizar tu contenido tú mismo, fácilmente. Con Yele Care y Yele Care+, te ayudamos a subirlo o lo hacemos por ti."}, {"q": "¿Tengo que pagar todo por adelantado?", "a": "No. Pagas el 50% al empezar. El 50% restante se paga cuando la web está terminada y aprobada para su lanzamiento."}, {"q": "¿La propiedad del diseño es mía?", "a": "Sí. Tú eres propietario de los archivos de diseño y tienes los derechos de todo el contenido que creamos para ti."}, {"q": "¿El alojamiento está incluido?", "a": "Sí. El alojamiento está incluido con Yele Care."}, {"q": "¿Mi dominio está incluido?", "a": "Podemos proporcionar y gestionar un dominio estándar para tu web cuando sea necesario, y también puedes traer tu dominio actual. Los dominios premium o inusualmente caros pueden tener un coste adicional."}, {"q": "¿Los clientes pueden reservar cita desde mi web?", "a": "Sí. Con Business, los clientes pueden elegir y confirmar automáticamente una hora en un calendario sincronizado. Con Launch, tu web tiene botones de acción automáticos para llamarte o rellenar un formulario. Reservas más avanzadas, pagos, recordatorios o citas con varios profesionales están disponibles con Business o Pro."}, {"q": "¿El SEO está incluido?", "a": "Todas las webs incluyen una base de SEO. Incluye configuración técnica, títulos de página, descripciones, sitemap, indexación, optimización móvil y analítica."}, {"q": "¿Podéis crear imágenes y vídeos?", "a": "Creamos los recursos visuales necesarios para tu web como parte del proyecto. El contenido continuo de imagen y vídeo en el futuro no está incluido y tiene un coste adicional."}, {"q": "¿Podéis gestionar mi publicidad?", "a": "Sí. Yele puede configurar y gestionar campañas de Google Ads y Meta. La gestión de publicidad y la inversión en anuncios son independientes de tu plan de web."}, {"q": "¿Podéis añadir IA a mi web?", "a": "Sí. Podemos añadir chat con IA, recepcionistas telefónicos con IA, automatización de clientes potenciales, seguimiento de clientes y otras herramientas de negocio con IA."}];
this.NEEDS = ["Web nueva", "Rediseño web", "Sistema de reservas", "Pagos online", "E-commerce", "SEO", "Publicidad", "Contenido / media", "Chat IA", "Teléfono IA", "Automatizaciones"];
this.PLANS = ["Launch — 699€", "Business — 1.199€", "No estoy seguro — recomiéndame uno"];
this.projEls = [];
this.trackEl = null;
this.projTrackRef = (el) => { this.trackEl = el; };
this.projPlayActive = () => {
var cur = this.state.proj || 0, vids = [];
if (this.trackEl) vids = Array.prototype.slice.call(this.trackEl.querySelectorAll('video'));
if (!vids.length) vids = this.projEls;
vids.forEach(function (v, i) {
if (!v) return;
if (i === cur) { v.muted = true; v.playsInline = true; if (v.readyState === 0) { try { v.load(); } catch (err) {} } var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
else if (!v.paused) { try { v.pause(); } catch (err) {} }
});
};
var selfP = this;
var playV = function (v) { if (!v) return; v.muted = true; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); };
this.playV = playV;
// one stable ref + pause-guard per slide; only the active slide plays
this.projRefs = this.PROJECTS.map(function (_, i) { return function (el) { selfP.projEls[i] = el; if (el && i === (selfP.state ? (selfP.state.proj || 0) : 0)) playV(el); }; });
this.projKeep = this.PROJECTS.map(function (_, i) { return function (e) { var v = e && e.currentTarget; if (v && !v.ended && i === (selfP.state.proj || 0)) playV(v); }; });
this.goProj = (d) => { var n = this.PROJECTS.length; this.setState({ proj: ((this.state.proj || 0) + d + n) % n }); };
this.projPrev = () => this.goProj(-1);
this.keepPlaying = (e) => { var v = e && e.currentTarget; if (v && !v.ended) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } };
this.projNext = () => this.goProj(1);
// Drag: the track follows the pointer, then settles on the next/previous project
this.pDrag = null;
this.projDragStart = (e) => { this.pDrag = { x0: e.clientX, y0: e.clientY, dx: 0, on: false, id: e.pointerId, el: e.currentTarget }; };
this.projDragMove = (e) => {
var d = this.pDrag; if (!d) return;
var dx = e.clientX - d.x0, dy = e.clientY - d.y0;
if (!d.on) {
if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { d.on = true; try { d.el.setPointerCapture(d.id); } catch (err) {} this.setState({ projDragging: true }); }
else return;
}
d.dx = dx; this.setState({ projDx: dx });
};
this.projDragEnd = () => {
var d = this.pDrag; this.pDrag = null;
if (!d || !d.on) return;
var w = d.el ? d.el.clientWidth : 360, dx = d.dx;
var step = dx < -Math.min(70, w * 0.18) ? 1 : (dx > Math.min(70, w * 0.18) ? -1 : 0);
this.setState({ projDragging: false, projDx: 0 });
if (step) this.goProj(step);
var selfE = this; setTimeout(function () { selfE.projPlayActive(); }, 60);
};
this.projDragCancel = () => { this.pDrag = null; this.setState({ projDragging: false, projDx: 0 }); };
this.finalEl = null;
this.midEl = null;
this.midFormRef = (el) => { this.midEl = el; };
this.onSubmit3 = (e) => {
if (e && e.preventDefault) e.preventDefault();
if (this.state.sent3) return;
this.setState({ sent3: true });
var g = (id) => { var el = typeof document !== 'undefined' && document.getElementById(id); return el && el.value ? String(el.value).trim() : ''; };
submitSiguienteNivelLead({ name: g('f3-nombre'), email: g('f3-email'), phone: g('f3-tel'), needs: this.state.needs || [] });
};
this.finalFormRef = (el) => { this.finalEl = el; };
// Pricing buttons: preselect the plan and glide to the last form
this.pickPlan = (label) => {
this.setState({ plan: label });
var sh = this.sheetEl, f = this.midEl || this.finalEl;
if (sh && f) sh.scrollTo({ top: f.offsetTop - 40, behavior: 'smooth' });
};
this.pickLaunch = () => this.pickPlan(this.PLANS[0]);
this.pickBusiness = () => this.pickPlan(this.PLANS[1]);
this.onSubmit2 = (e) => {
if (e && e.preventDefault) e.preventDefault();
if (this.state.sent2) return;
this.setState({ sent2: true });
var g = (id) => { var el = typeof document !== 'undefined' && document.getElementById(id); return el && el.value ? String(el.value).trim() : ''; };
submitSiguienteNivelLead({ name: g('f2-nombre'), businessName: g('f2-negocio'), email: g('f2-email'), phone: g('f2-tel'), currentWebsite: g('f2-web'), company: g('f2-negocio-desc'), packageInterest: this.state.plan ? [this.state.plan] : [], needs: this.state.needs || [] });
};
// Horizontal swipe on the stage: left = next step, right = previous.
// Steps: 0 hero, 1 card 1, 2 card 2, 3 card 3; swiping left on card 3 opens the form.
this.swipe = null;
this.stepY = [0, 0.30, 0.66, 1.0];
this.swipeStart = (e) => { this.swipe = { x: e.clientX, y: e.clientY }; };
this.swipeCancel = () => { this.swipe = null; };
this.swipeEnd = (e) => {
var sw = this.swipe; this.swipe = null;
if (!sw || this.state.formOpen || !this.scrollerEl) return;
var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
var y = this.scrollerEl.scrollTop, A = this.ANIM;
var cur = y < A * 0.15 ? 0 : (y < A * 0.48 ? 1 : (y < A * 0.82 ? 2 : 3));
var next = dx < 0 ? cur + 1 : cur - 1;
if (next < 0) return;
var top = next > 3 ? this.FORM_AT + 20 : Math.round(A * this.stepY[next]);
this.scrollerEl.scrollTo({ top: top, behavior: 'smooth' });
};
this.sheetRef = (el) => { this.sheetEl = el; };
this.state = { y: 0, when: null, sent: false, nope: false, pulse: false, formOpen: false, dragging: false, dragY: 0, proj: 0, faqOpen: 0, needs: [], plan: null, sent2: false };
// Sheet: close (drag-down release or keyboard) → back to card 3
this.closeSheet = () => {
if (this.scrollerEl) this.scrollerEl.scrollTop = this.ANIM;
this.drag = null;
this.setState({ formOpen: false, dragging: false, dragY: 0, y: this.ANIM });
};
this.dragStart = (e) => {
if (!this.state.formOpen) return;
this.drag = { y0: e.clientY, dy: 0 };
try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
this.setState({ dragging: true, dragY: 0 });
};
this.dragMove = (e) => {
if (!this.drag) return;
var dy = Math.max(0, e.clientY - this.drag.y0);
this.drag.dy = dy;
this.setState({ dragY: dy });
};
this.dragEnd = () => {
if (!this.drag) return;
var dy = this.drag.dy;
this.drag = null;
if (dy > 140) this.closeSheet();
else this.setState({ dragging: false, dragY: 0 });
};
this.handleKey = (e) => {
if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); this.closeSheet(); }
};
// CTA 1 press: ring + shine burst, then glide to the cards
this.pressCta = (e) => {
if (e && e.preventDefault) e.preventDefault();
var self = this;
this.setState({ pulse: false }, function () {
self.setState({ pulse: true });
clearTimeout(self.pulseT);
self.pulseT = setTimeout(function () { self.setState({ pulse: false }); }, 700);
setTimeout(function () { self.goToCards(); }, 220);
});
};
this.ovEl = null;
this.ovVideoRef = (el) => { this.ovEl = el; };
// CTA 2: drop the overlay in from the top and play its clip from the start
this.openNope = (e) => {
if (e && e.preventDefault) e.preventDefault();
this.setState({ nope: true });
var v = this.ovEl;
if (v) { v.muted = true; try { v.currentTime = 0; } catch (err) {} var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
};
// "Me lo he pensado": press burst, lift the overlay away, back to the hero
this.rethink = () => {
var self = this;
this.setState({ pulse2: true });
setTimeout(function () {
self.setState({ nope: false, pulse2: false });
if (self.scrollerEl) self.scrollerEl.scrollTo({ top: 0, behavior: 'smooth' });
setTimeout(function () { if (self.ovEl) self.ovEl.pause(); }, 750);
}, 260);
};
this.onSubmit = (e) => {
if (e && e.preventDefault) e.preventDefault();
if (this.state.sent) return;
this.setState({ sent: true });
var g = (id) => { var el = typeof document !== 'undefined' && document.getElementById(id); return el && el.value ? String(el.value).trim() : ''; };
submitSiguienteNivelLead({ name: g('f-nombre'), email: g('f-email'), phone: g('f-tel'), company: g('f-empresa'), timeline: this.state.when || '' });
};
this.scrollerEl = null;
this.scrollerRef = (el) => { this.scrollerEl = el; };
// CTA 1: glide to the point where card 1 has fully landed
this.goToCards = (e) => {
if (e && e.preventDefault) e.preventDefault();
var el = this.scrollerEl;
if (!el) return;
el.scrollTo({ top: Math.round(this.ANIM * 0.30), behavior: 'smooth' });
};
this.videoRef = (el) => {
if (el) { el.muted = true; var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); }
};
// Lazy video: below-the-fold clips (why/beyond cards, robot) carry preload="none"
// and no autoPlay, so nothing downloads until they scroll near the viewport.
// IntersectionObserver then plays them (which triggers the fetch) and pauses
// them when they leave — keeping the hero + first paint fast on mobile ad traffic.
this.lazyIO = null;
this.lazyVideoRef = (el) => {
if (!el) return;
try {
if (!this.lazyIO && typeof IntersectionObserver !== 'undefined') {
this.lazyIO = new IntersectionObserver((entries) => {
entries.forEach((en) => {
var vid = en.target;
if (en.isIntersecting) { vid.muted = true; var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
else { try { vid.pause(); } catch (e2) {} }
});
}, { rootMargin: '300px 0px', threshold: 0.01 });
}
if (this.lazyIO) this.lazyIO.observe(el);
} catch (e) {}
};
this.onScroll = (e) => {
var y = e.currentTarget.scrollTop;
if (!this.state.formOpen && y >= this.FORM_AT) { if (this.sheetEl) this.sheetEl.scrollTop = 0; this.setState({ y: y, formOpen: true, dragY: 0 }); }
else this.setState({ y: y });
};
}
componentDidUpdate(prevProps, prevState) {
if (prevState && prevState.proj !== this.state.proj) {
var self2 = this;
this.projPlayActive();
clearTimeout(this.projT1); clearTimeout(this.projT2);
this.projT1 = setTimeout(function () { self2.projPlayActive(); }, 120);
this.projT2 = setTimeout(function () { self2.projPlayActive(); }, 760);
}
}
componentDidMount() {
this.onResize = () => this.setState({ vh: window.innerHeight });
this.onResize();
window.addEventListener('resize', this.onResize);
}
componentWillUnmount() {
window.removeEventListener('resize', this.onResize);
clearTimeout(this.projT1); clearTimeout(this.projT2); clearTimeout(this.pulseT);
if (this.lazyIO) { try { this.lazyIO.disconnect(); } catch (e) {} }
}
renderVals() {
var accent = this.props.accent ?? '#D46FC8';
var y = this.state.y;
var p = Math.min(1, Math.max(0, y / this.ANIM));
// q: 0 → 1 while the form sheet rises over the pinned stage
var st = this.state;
var VH = st.vh || 844;
// peek: 0 → 1 as the scroll nears the trigger (sheet shows up to 120px)
var peek = Math.min(1, Math.max(0, (y - this.PEEK_AT) / (this.FORM_AT - this.PEEK_AT)));
// q: how much the sheet covers the stage (0 = hidden, 1 = full)
var q = st.formOpen ? Math.max(0, 1 - st.dragY / VH) : peek * (120 / VH);
var sheetT = st.formOpen ? 'translateY(' + st.dragY + 'px)' : 'translateY(' + (VH - Math.round(peek * 120)) + 'px)';
var easeTr = 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)';
var live = st.dragging || (!st.formOpen && peek > 0 && peek < 1);
var sheetTr = st.dragging ? 'none' : (st.formOpen ? easeTr : 'transform 180ms ease-out');
var seg = function (a, b) { return Math.min(1, Math.max(0, (p - a) / (b - a))); };
var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
// Phase A: hero text out left, card 1 in from right
var e1 = ease(seg(0.03, 0.27));
// Phase B: card 1 out left, card 2 in from right
var e2 = ease(seg(0.39, 0.62));
// Phase C: card 2 out left, card 3 in from right
var e3 = ease(seg(0.74, 0.97));
var off = 120;
var step = e3 > 0.5 ? '04 / 04' : (e2 > 0.5 ? '03 / 04' : (e1 > 0.5 ? '02 / 04' : '01 / 04'));
// Card 2: accent lifted toward white, slightly translucent
var h = accent.replace('#', '');
if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
var mix = function (i) { var c = parseInt(h.substr(i, 2), 16); return Math.round(c + (255 - c) * 0.5); };
var card2Bg = 'rgba(' + mix(0) + ',' + mix(2) + ',' + mix(4) + ',0.82)';
var self = this;
var whenOpts = ['Lo antes posible', '1–3 meses', 'No estoy seguro, solo mirando'];
var chips = whenOpts.map(function (label) {
var on = self.state.when === label;
return {
label: label,
pressed: on ? 'true' : 'false',
bg: on ? 'rgba(212,111,200,0.16)' : 'rgba(255,255,255,0.05)',
border: on ? accent : 'rgba(255,255,255,0.15)',
color: on ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
pick: function () { self.setState({ when: label }); }
};
});
var chipStyle = function (on) {
return {
pressed: on ? 'true' : 'false',
bg: on ? 'rgba(212,111,200,0.16)' : 'rgba(255,255,255,0.05)',
border: on ? accent : 'rgba(255,255,255,0.15)',
color: on ? '#FFFFFF' : 'rgba(255,255,255,0.8)'
};
};
var needs = this.state.needs || [];
var needChips = this.NEEDS.map(function (label) {
var c = chipStyle(needs.indexOf(label) >= 0); c.label = label;
c.pick = function () { var cur = (self.state.needs || []).slice(); var i = cur.indexOf(label); if (i >= 0) cur.splice(i, 1); else cur.push(label); self.setState({ needs: cur }); };
return c;
});
var planChips = this.PLANS.map(function (label) {
var c = chipStyle(self.state.plan === label); c.label = label;
c.pick = function () { self.setState({ plan: label }); };
return c;
});
var faqs = this.FAQS.map(function (f, i) {
var open = self.state.faqOpen === i;
return { q: f.q, a: f.a, open: open, expanded: open ? 'true' : 'false', iconT: open ? 'rotate(45deg)' : 'rotate(0deg)',
toggle: function () { self.setState({ faqOpen: open ? -1 : i }); } };
});
var planChipsLight = this.PLANS.map(function (label) {
var on = self.state.plan === label;
return { label: label, pressed: on ? 'true' : 'false',
bg: on ? 'rgba(212,111,200,0.18)' : '#FFFFFF',
border: on ? '#B0489F' : 'rgba(22,22,26,0.15)',
color: '#16161A',
pick: function () { self.setState({ plan: label }); } };
});
var pi = this.state.proj || 0;
return {
accent: accent,
projSlides: this.PROJECTS.map(function (p, i) {
var near = Math.abs(i - pi) <= 1 || Math.abs(i - pi) === self.PROJECTS.length - 1;
return { title: p.title, desc: p.desc, v: p.v, p: p.p, a: p.a, b: p.b, ref: self.projRefs[i], keep: self.projKeep[i], preload: near ? 'auto' : 'metadata',  hidden: i === pi ? 'false' : 'true' };
}),
projTrackT: 'translateX(calc(' + (-pi * 100) + '% - ' + (pi * 16) + 'px + ' + (this.state.projDx || 0) + 'px))',
projTrackTr: this.state.projDragging ? 'none' : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
projDragStart: this.projDragStart,
projDragMove: this.projDragMove,
projDragEnd: this.projDragEnd,
projDragCancel: this.projDragCancel,
projTrackRef: this.projTrackRef,
projPlayActive: this.projPlayActive,
projCounter: (pi + 1) + ' / ' + this.PROJECTS.length,
projPrev: this.projPrev,
projNext: this.projNext,
keepPlaying: this.keepPlaying,
pickLaunch: this.pickLaunch,
pickBusiness: this.pickBusiness,
faqs: faqs,
needChips: needChips,
planChips: planChips,
finalFormRef: this.finalFormRef,
midFormRef: this.midFormRef,
planChipsLight: planChipsLight,
onSubmit3: this.onSubmit3,
submitLabel3: this.state.sent3 ? 'Recibido ✓' : 'Empezar',
onSubmit2: this.onSubmit2,
submitLabel2: this.state.sent2 ? 'Recibido ✓' : 'Quiero mi web',
chips: chips,
ovT: this.state.nope ? 'translateY(0%)' : 'translateY(-100%)',
ovPE: this.state.nope ? 'auto' : 'none',
ovHidden: this.state.nope ? 'false' : 'true',
ovTab: this.state.nope ? 0 : -1,
ovVideoRef: this.ovVideoRef,
openNope: this.openNope,
pressCta: this.pressCta,
pulse: this.state.pulse,
pulse2: !!this.state.pulse2,
rethink: this.rethink,
submitLabel: this.state.sent ? 'Recibido ✓' : 'Empezar',
onSubmit: this.onSubmit,
sheetT: sheetT,
swipeStart: this.swipeStart,
swipeEnd: this.swipeEnd,
swipeCancel: this.swipeCancel,
sheetRef: this.sheetRef,
sheetOv: (st.formOpen && !st.dragging) ? 'auto' : 'hidden',
sheetTr: sheetTr,
sheetHidden: st.formOpen ? 'false' : 'true',
sheetTab: st.formOpen ? 0 : -1,
handleColor: st.dragging ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)',
scrollOv: st.formOpen ? 'hidden' : 'auto',
stageTr: live ? 'none' : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 650ms cubic-bezier(0.22, 1, 0.36, 1)',
dimTr: live ? 'none' : 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1)',
dragStart: this.dragStart,
dragMove: this.dragMove,
dragEnd: this.dragEnd,
handleKey: this.handleKey,
stageT: 'scale(' + (1 - 0.06 * q) + ')',
stageR: (q > 0 ? Math.round(24 * q) : 0) + 'px',
stageDim: 0.55 * q,
card2Bg: card2Bg,
heroT: 'translateX(' + (-off * e1) + '%)',
heroO: 1 - e1 * 0.7,
c1T: 'translateX(' + (off * (1 - e1) - off * e2) + '%)',
c2T: 'translateX(' + (off * (1 - e2) - off * e3) + '%)',
c3T: 'translateX(' + (off * (1 - e3)) + '%)',
dim: 0.45 * e1,
hintO: Math.max(0, 1 - seg(0, 0.08)),
barW: (p * 100) + '%',
stepLabel: step,
onScroll: this.onScroll,
videoRef: this.videoRef,
lazyVideoRef: this.lazyVideoRef,
scrollerRef: this.scrollerRef,
goToCards: this.goToCards
};
}

render() {
const v: any = this.renderVals();
return (
<>
{/* Phone frame: holds the scroller and the "No quiero" overlay */}
<div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#0B0B0D" }}>

{/* Phone viewport: everything scrolls inside it */}
<div className="sn-scroller" ref={v.scrollerRef} onScroll={v.onScroll} style={{ position: "relative", width: "100%", height: "100%", overflowY: `${v.scrollOv}`, overflowX: "hidden", scrollbarWidth: "none", background: "#0B0B0D", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", color: "#F4F2EC" }}>

{/* Scroll track: pinned stage, scroll room for the cards, then the form sheet */}
<div style={{ position: "relative" }}>

{/* Pinned stage (stays behind while the form rises) */}
<div style={{ position: "sticky", top: "0", zIndex: "0", width: "100%", height: "100dvh", overflow: "hidden", transform: `${v.stageT}`, transformOrigin: "50% 0%", borderRadius: `${v.stageR}`, transition: `${v.stageTr}`, touchAction: "pan-y", WebkitUserSelect: "none", userSelect: "none" }} onPointerDown={v.swipeStart} onPointerUp={v.swipeEnd} onPointerCancel={v.swipeCancel}>

  {/* First frame, shown instantly while the video loads */}
  <img src="/media/siguiente-nivel/hero-mobile-poster.jpg" alt="" aria-hidden="true" fetchpriority="high" loading="eager" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  {/* Background video — pinned */}
  <video ref={v.videoRef} src="/media/siguiente-nivel/hero-mobile.mp4" poster="/media/siguiente-nivel/hero-mobile-poster.jpg" autoPlay muted loop playsInline preload="auto" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }}></video>

  {/* Top scrim for the brand bar */}
  <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "140px", background: "linear-gradient(180deg, rgba(11,11,13,0.6) 0%, rgba(11,11,13,0) 100%)" }}></div>

  {/* Bottom scrim so the headline and cards read over the video */}
  <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "560px", background: "linear-gradient(0deg, rgba(11,11,13,0.9) 0%, rgba(11,11,13,0.62) 50%, rgba(11,11,13,0) 100%)" }}></div>

  {/* Dim layer that deepens as the cards arrive */}
  <div style={{ position: "absolute", inset: "0", background: "#0B0B0D", opacity: `${v.dim}` }}></div>

  {/* Scroll progress line */}
  <div style={{ position: "absolute", left: "0", top: "0", height: "3px", width: `${v.barW}`, background: `${v.accent}` }}></div>

  {/* Top bar */}
  <div style={{ position: "absolute", left: "24px", right: "24px", top: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <a href="#" aria-label="Yele" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px" }}>
      <img src="/media/logomedia/mainlogo.svg" alt="Yele" draggable={false} style={{ height: "30px", width: "auto", display: "block" }} />
    </a>
    
  </div>

  {/* Hero copy: slides out to the left */}
  <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "64px", display: "flex", flexDirection: "column", gap: "18px", transform: `${v.heroT}`, opacity: `${v.heroO}`, willChange: "transform" }}>
    
    <h1 style={{ margin: "0", fontSize: "48px", lineHeight: "0.94", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.02em", textTransform: "uppercase", textWrap: "balance" }}>Estás a un paso de subir al <span style={{ color: `${v.accent}` }}>siguiente nivel</span></h1>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "flex-start", gap: "6px", marginTop: "8px" }}>
      <a href="#" className="sn-ctaPink" onClick={v.pressCta} style={{ position: "relative", overflow: "visible", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "16px 32px", borderRadius: "12px", background: `${v.accent}`, color: "#16161A", fontFamily: "var(--font-body), system-ui, sans-serif", fontSize: "16px", fontWeight: "600", lineHeight: "1.5", textDecoration: "none" }}>Quiero una web mejor{v.pulse && (<><span aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "12px", pointerEvents: "none", animation: "snRing 650ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }}></span><span aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "12px", overflow: "hidden", pointerEvents: "none" }}><span style={{ position: "absolute", top: "0", bottom: "0", left: "0", width: "40%", background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)", animation: "snShine 600ms ease-out forwards" }}></span></span></>)}</a>
      <a href="#" className="sn-cta2" onClick={v.openNope} style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body), system-ui, sans-serif", fontSize: "14px", fontWeight: "500", textDecoration: "underline", textUnderlineOffset: "4px" }}>No quiero, me va de maravilla</a>
    </div>
  </div>

  {/* Card 1: Tu página actual — in from the right, then out to the left */}
  <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "32px", height: "356px", transform: `${v.c1T}`, willChange: "transform", boxSizing: "border-box", padding: "22px 22px", borderRadius: "20px", background: "rgba(22,22,27,0.55)", WebkitBackdropFilter: "blur(18px) saturate(140%)", backdropFilter: "blur(18px) saturate(140%)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column", gap: "18px" }}>
    <h3 style={{ margin: "17px 0 0", fontSize: "30px", lineHeight: "1", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.01em", textTransform: "uppercase", color: "#F4F2EC" }}>Tu página actual</h3>
    <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#C9C9D2" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill="none" stroke={v.accent} strokeWidth="1.5"></circle><path d="M7 7l6 6M13 7l-6 6" fill="none" stroke={v.accent} strokeWidth="1.8" strokeLinecap="round"></path></svg><span>Es lenta.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#C9C9D2" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill="none" stroke={v.accent} strokeWidth="1.5"></circle><path d="M7 7l6 6M13 7l-6 6" fill="none" stroke={v.accent} strokeWidth="1.8" strokeLinecap="round"></path></svg><span>Diseño anticuado.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#C9C9D2" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill="none" stroke={v.accent} strokeWidth="1.5"></circle><path d="M7 7l6 6M13 7l-6 6" fill="none" stroke={v.accent} strokeWidth="1.8" strokeLinecap="round"></path></svg><span>Fotos de stock que nadie se cree.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#C9C9D2" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill="none" stroke={v.accent} strokeWidth="1.5"></circle><path d="M7 7l6 6M13 7l-6 6" fill="none" stroke={v.accent} strokeWidth="1.8" strokeLinecap="round"></path></svg><span>No cumple con la ley.</span></li>
    </ul>
  </div>

  {/* Card 3: Lo que obtendrás — in from the right (last) */}
  <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "32px", height: "356px", transform: `${v.c3T}`, willChange: "transform", boxSizing: "border-box", padding: "22px 22px", borderRadius: "20px", background: `${v.card2Bg}`, WebkitBackdropFilter: "blur(18px) saturate(140%)", backdropFilter: "blur(18px) saturate(140%)", border: "1px solid rgba(255,255,255,0.35)", color: "#0B0B0D", display: "flex", flexDirection: "column", gap: "18px" }}>
    <h3 style={{ margin: "17px 0 0", fontSize: "30px", lineHeight: "1", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.01em", textTransform: "uppercase", color: "#0B0B0D" }}>Lo que obtendrás</h3>
    <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#1E0B1C" }}><span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", flexShrink: "0", marginTop: "-1px", borderRadius: "999px", background: "#0B0B0D", color: `${v.accent}`, fontSize: "15px", fontWeight: "800", lineHeight: "1" }}>1</span><span><strong style={{ fontWeight: "700" }}>Credibilidad.</strong> Pareces el profesional que eres.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#1E0B1C" }}><span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", flexShrink: "0", marginTop: "-1px", borderRadius: "999px", background: "#0B0B0D", color: `${v.accent}`, fontSize: "15px", fontWeight: "800", lineHeight: "1" }}>2</span><span><strong style={{ fontWeight: "700" }}>Más captación.</strong> Más llamadas, reservas y ventas.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#1E0B1C" }}><span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", flexShrink: "0", marginTop: "-1px", borderRadius: "999px", background: "#0B0B0D", color: `${v.accent}`, fontSize: "15px", fontWeight: "800", lineHeight: "1" }}>3</span><span><strong style={{ fontWeight: "700" }}>Diseño propio.</strong> Tu personalidad, no del montón.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#1E0B1C" }}><span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", flexShrink: "0", marginTop: "-1px", borderRadius: "999px", background: "#0B0B0D", color: `${v.accent}`, fontSize: "15px", fontWeight: "800", lineHeight: "1" }}>4</span><span><strong style={{ fontWeight: "700" }}>Legal:</strong> cookies, privacidad, aviso legal.</span></li>
    </ol>
  </div>


  {/* Card 2: Por 699€ — in from the right, then out to the left */}
  <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "32px", height: "356px", transform: `${v.c2T}`, willChange: "transform", boxSizing: "border-box", padding: "22px 22px", borderRadius: "20px", background: "rgba(22,22,27,0.62)", WebkitBackdropFilter: "blur(18px) saturate(140%)", backdropFilter: "blur(18px) saturate(140%)", border: `1.5px solid ${v.accent}`, display: "flex", flexDirection: "column", gap: "18px" }}>
    <h3 style={{ margin: "0", display: "flex", alignItems: "baseline", gap: "10px", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.01em", textTransform: "uppercase", color: "#F4F2EC" }}><span style={{ fontSize: "30px", lineHeight: "1" }}>Por</span><span style={{ fontSize: "52px", lineHeight: "0.9", color: `${v.accent}` }}>699€</span><span style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.04em", lineHeight: "1", color: "#C9C9D2" }}>+IVA</span></h3>
    <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#E4E2EA" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill={v.accent}></circle><path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="#0B0B0D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Página web nueva completa, sin límite de páginas.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#E4E2EA" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill={v.accent}></circle><path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="#0B0B0D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Diseño singular, nada de plantillas.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#E4E2EA" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill={v.accent}></circle><path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="#0B0B0D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Optimizada para móvil y apareces en Google.</span></li>
      <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "19px", lineHeight: "1.3", color: "#E4E2EA" }}><svg viewBox="0 0 20 20" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", marginTop: "1px" }}><circle cx="10" cy="10" r="9" fill={v.accent}></circle><path d="M6 10.5l2.6 2.5L14 7.5" fill="none" stroke="#0B0B0D" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Demo en 24 h. Entrega en 7 días.</span></li>
    </ul>
  </div>

  {/* Scroll hint: fades as soon as the user scrolls */}
  

  {/* Placeholder tag for the photo */}

  {/* Darkens the stage as the form sheet covers it */}
  <div style={{ position: "absolute", inset: "0", background: "#000000", opacity: `${v.stageDim}`, transition: `${v.dimTr}`, pointerEvents: "none" }}></div>

</div>

{/* Scroll room for the card sequence, a short hold on card 3, then the trigger zone for the form */}
<div aria-hidden="true" style={{ height: "3620px" }}></div>



</div>
</div>

{/* ===== FORM SHEET: rises, snaps to full screen, locks; drag the handle down to leave ===== */}
<section id="empezar" className="sn-scroller" ref={v.sheetRef} aria-hidden={v.sheetHidden} style={{ position: "absolute", left: "0", right: "0", top: "0", height: "100dvh", zIndex: "10", overflowX: "hidden", overflowY: `${v.sheetOv}`, scrollbarWidth: "none", boxSizing: "border-box", padding: "0 24px 16px", borderRadius: "28px 28px 0 0", background: "#0D0E12", boxShadow: "0 -24px 60px rgba(0,0,0,0.55)", fontFamily: "var(--font-body), system-ui, sans-serif", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "10px", transform: `${v.sheetT}`, transition: `${v.sheetTr}`, willChange: "transform" }}>
  <button type="button" aria-label="Arrastra hacia abajo para volver" onPointerDown={v.dragStart} onPointerMove={v.dragMove} onPointerUp={v.dragEnd} onPointerCancel={v.dragEnd} onKeyDown={v.handleKey} tabIndex={v.sheetTab} style={{ position: "sticky", top: "0", zIndex: "3", flexShrink: "0", alignSelf: "stretch", height: "34px", margin: "0 -24px", padding: "0", border: "0", background: "#0D0E12", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", touchAction: "none" }}><span style={{ width: "44px", height: "5px", borderRadius: "999px", background: `${v.handleColor}` }}></span></button>
  {/* Screen 1: the form (fits one screen) */}
  <div style={{ flexShrink: "0", minHeight: "calc(100dvh - 54px)", display: "flex", flexDirection: "column", gap: "10px" }}>
  <h2 style={{ margin: "0 0 4px", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "34px", lineHeight: "0.95", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.015em", textTransform: "uppercase", color: "#FFFFFF" }}>Empezar <span style={{ color: `${v.accent}` }}>ahora</span></h2>
  <p style={{ margin: "-2px 0 6px", fontSize: "20px", fontWeight: "600", lineHeight: "1.2", color: "rgba(255,255,255,0.85)" }}>Demo en 24h</p>

  <form onSubmit={v.onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor="f-nombre" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Nombre <span style={{ color: `${v.accent}` }}>*</span></label>
      <input id="f-nombre" className="sn-yf" type="text" name="nombre" required autoComplete="name" placeholder="Tu nombre completo" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor="f-email" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Correo electrónico <span style={{ color: `${v.accent}` }}>*</span></label>
      <input id="f-email" className="sn-yf" type="email" name="email" required autoComplete="email" placeholder="tu@correo.com" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor="f-tel" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Teléfono <span style={{ color: `${v.accent}` }}>*</span></label>
      <input id="f-tel" className="sn-yf" type="tel" name="telefono" required autoComplete="tel" placeholder="+34 600 000 000" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor="f-empresa" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Describe tu empresa <span style={{ color: `${v.accent}` }}>*</span></label>
      <textarea id="f-empresa" className="sn-yf" name="empresa" required rows={2} placeholder="¿Qué haces y para quién lo haces?" style={{ boxSizing: "border-box", width: "100%", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px", lineHeight: "1.4", resize: "none" }}></textarea>
    </div>
    <fieldset style={{ margin: "0", padding: "0", border: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
      <legend style={{ padding: "0", marginBottom: "6px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>¿Cuándo necesitas tu web? <span style={{ color: `${v.accent}` }}>*</span></legend>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {v.chips.map((chip: any, chipIndex: number) => (<React.Fragment key={chipIndex}>
          <button type="button" className="sn-chip" onClick={chip.pick} aria-pressed={chip.pressed} style={{ minHeight: "40px", padding: "6px 14px", borderRadius: "9999px", border: `1px solid ${chip.border}`, background: `${chip.bg}`, color: `${chip.color}`, fontFamily: "inherit", fontSize: "14px", cursor: "pointer" }}>{chip.label}</button>
        </React.Fragment>))}
      </div>
    </fieldset>
    <button type="submit" className="sn-send" style={{ marginTop: "4px", width: "100%", minHeight: "52px", padding: "14px 24px", border: "0", borderRadius: "12px", background: `${v.accent}`, color: "#16161A", fontFamily: "inherit", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>{v.submitLabel}</button>
    <p style={{ margin: "0", fontSize: "11px", lineHeight: "1.45", color: "rgba(255,255,255,0.5)" }}>Al hacer clic, aceptas que Yele pueda contactarte en el número que facilitas — incluso mediante tecnología automatizada. Consulta nuestra <a href="/es/privacy-policy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Política de Privacidad</a>.</p>
  </form>

  <a href="https://wa.me/34655517760" target="_blank" rel="noopener noreferrer" className="sn-cta2" style={{ alignSelf: "center", display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "40px", color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: "500", textDecoration: "none" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "16px", height: "16px" }}><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="#25D366" strokeWidth="2" strokeLinejoin="round"></path><path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 1a4 4 0 0 1-2.4-2.4l1-1-1-2L9 8.5z" fill="#25D366"></path></svg><span style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}>O danos un toque por WhatsApp</span></a>
  </div>

  {/* ===== Por qué los negocios eligen Yele (from yele.design/es/letsbuild) ===== */}
  <div style={{ flexShrink: "0", padding: "56px 0 48px", display: "flex", flexDirection: "column", gap: "32px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h2 style={{ margin: "0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "30px", lineHeight: "36px", fontWeight: "700", letterSpacing: "-0.01em", color: "#FFFFFF" }}>Por qué los negocios eligen Yele</h2>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(1, minmax(0, 1fr))", gap: "24px" }}>
      <article className="sn-whycard" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
        <video ref={v.lazyVideoRef} src="/media/whyyele3/whyyele1_mobile.mp4" poster="/media/whyyele3/whyyele1_poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "144px", objectFit: "cover", borderRadius: "12px", background: "#0D0E12" }}></video>
        <h3 style={{ margin: "16px 0 0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "#FFFFFF" }}>Diseño único</h3>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "22.75px", color: "rgba(255,255,255,0.7)" }}>Creamos un diseño que solo es tuyo, pensado para que tu negocio destaque y se recuerde.</p>
      </article>
      <article className="sn-whycard" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
        <video ref={v.lazyVideoRef} src="/media/whyyele3/whyyele6_mobile.mp4" poster="/media/whyyele3/whyyele6_poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "144px", objectFit: "cover", borderRadius: "12px", background: "#0D0E12" }}></video>
        <h3 style={{ margin: "16px 0 0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "#FFFFFF" }}>Asequible y transparente</h3>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "22.75px", color: "rgba(255,255,255,0.7)" }}>Webs profesionales desde 699€, con precios claros y sin presupuestos confusos.</p>
      </article>
      <article className="sn-whycard" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
        <video ref={v.lazyVideoRef} src="/media/whyyele3/whyyele3_mobile.mp4" poster="/media/whyyele3/whyyele3_poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "144px", objectFit: "cover", borderRadius: "12px", background: "#0D0E12" }}></video>
        <h3 style={{ margin: "16px 0 0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "#FFFFFF" }}>A medida</h3>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "22.75px", color: "rgba(255,255,255,0.7)" }}>Diseñada en torno a tu negocio, no una plantilla genérica con tu logo encima.</p>
      </article>
      <article className="sn-whycard" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
        <video ref={v.lazyVideoRef} src="/media/whyyele3/whyyele2_mobile.mp4" poster="/media/whyyele3/whyyele2_poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "144px", objectFit: "cover", borderRadius: "12px", background: "#0D0E12" }}></video>
        <h3 style={{ margin: "16px 0 0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "#FFFFFF" }}>Entrega rápida</h3>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "22.75px", color: "rgba(255,255,255,0.7)" }}>Objetivo de entrega a partir de 1 semana.</p>
      </article>
      <article className="sn-whycard" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
        <video ref={v.lazyVideoRef} src="/media/beyond/AIcall_mobile.mp4" poster="/media/beyond/AIcall_poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "144px", objectFit: "cover", borderRadius: "12px", background: "#0D0E12" }}></video>
        <h3 style={{ margin: "16px 0 0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "#FFFFFF" }}>Soporte 24/7</h3>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "22.75px", color: "rgba(255,255,255,0.7)" }}>Seguimos contigo tras el lanzamiento — soporte cuando lo necesites.</p>
      </article>
      <article className="sn-whycard" style={{ borderRadius: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "24px" }}>
        <video ref={v.lazyVideoRef} src="/media/beyond/Marketing_mobile.mp4" poster="/media/beyond/Marketing_poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ display: "block", width: "100%", height: "144px", objectFit: "cover", borderRadius: "12px", background: "#0D0E12" }}></video>
        <h3 style={{ margin: "16px 0 0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "#FFFFFF" }}>Pensada para crecer</h3>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "22.75px", color: "rgba(255,255,255,0.7)" }}>Añade SEO, publicidad, contenido, IA y automatización a medida que creces.</p>
      </article>
    </div>
  </div>

  {/* ===== Últimos proyectos (from yele.design/es/letsbuild) ===== */}
  <div style={{ flexShrink: "0", padding: "24px 0 64px", display: "flex", flexDirection: "column", gap: "24px" }}>
    <h2 style={{ margin: "0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "34px", lineHeight: "1.1", fontWeight: "400", letterSpacing: "-0.01em", color: "#FFFFFF" }}>Últimos proyectos</h2>
    {/* Carousel: the current project slides out left while the next one comes in from the right; follows the finger while dragging */}
    <div onPointerDown={v.projDragStart} onPointerMove={v.projDragMove} onPointerUp={v.projDragEnd} onPointerCancel={v.projDragCancel} style={{ overflow: "hidden", touchAction: "pan-y", WebkitUserSelect: "none", userSelect: "none", cursor: "grab" }}>
      <div ref={v.projTrackRef} onTransitionEnd={v.projPlayActive} style={{ display: "flex", gap: "16px", transform: `${v.projTrackT}`, transition: `${v.projTrackTr}`, willChange: "transform" }}>
        {v.projSlides.map((sl: any, slIndex: number) => (<React.Fragment key={slIndex}>
          <div aria-hidden={sl.hidden} style={{ flex: "0 0 100%", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <video ref={sl.ref} onPause={sl.keep} onCanPlay={sl.keep} onLoadedData={sl.keep} src={sl.v} poster={sl.p} muted loop playsInline preload={sl.preload} disablePictureInPicture aria-hidden="true" style={{ pointerEvents: "none", display: "block", width: "100%", aspectRatio: "3 / 2", objectFit: "cover", objectPosition: "top", borderRadius: "16px", background: "#1A1A1F" }}></video>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
              <img src={sl.a} alt={`${sl.title} — detalle 1`} draggable={false} style={{ display: "block", width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "12px", background: "#1A1A1F" }} />
              <img src={sl.b} alt={`${sl.title} — detalle 2`} draggable={false} style={{ display: "block", width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "12px", background: "#1A1A1F" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "104px", marginTop: "12px" }}>
              <div style={{ fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "24px", fontWeight: "700", color: "#FFFFFF" }}>{sl.title}</div>
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)" }}>{sl.desc}</p>
            </div>
          </div>
        </React.Fragment>))}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{v.projCounter}</span>
      <div style={{ display: "flex", gap: "12px" }}>
        <button type="button" className="sn-arrowbtn" onClick={v.projPrev} aria-label="Proyecto anterior" style={{ width: "56px", height: "56px", borderRadius: "9999px", border: "2px solid #3A3A38", background: "transparent", color: "#F2F1EE", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <button type="button" className="sn-arrowbtn" onClick={v.projNext} aria-label="Proyecto siguiente" style={{ width: "56px", height: "56px", borderRadius: "9999px", border: "2px solid #3A3A38", background: "transparent", color: "#F2F1EE", fontSize: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
    </div>
  </div>

  {/* ===== Precios ===== */}
  <div style={{ flexShrink: "0", margin: "0 -24px", padding: "64px 24px", background: "#FFFFFF", color: "#16161A", display: "flex", flexDirection: "column", gap: "28px" }}>
    <h2 style={{ margin: "0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "36px", lineHeight: "1.1", fontWeight: "700", color: "#16161A" }}>Precios</h2>

    <div style={{ position: "relative", borderRadius: "24px", padding: "48px 32px 32px", background: "#1C1D24", border: `2px solid ${v.accent}`, boxShadow: "0 24px 64px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column", gap: "20px" }}>
      <span style={{ position: "absolute", top: "18px", left: "32px", padding: "4px 12px", borderRadius: "9999px", background: `${v.accent}`, color: "#16161A", fontSize: "12px", fontWeight: "600" }}>Más popular</span>
      <div>
        <p style={{ margin: "0", fontSize: "14px", fontWeight: "500", color: "rgba(255,255,255,0.6)" }}>Launch</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "8px" }}><span style={{ fontSize: "24px", fontWeight: "600", color: "rgba(255,255,255,0.6)" }}>€</span><span style={{ fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "48px", lineHeight: "1", fontWeight: "600", color: "#FFFFFF" }}>699</span><span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginLeft: "4px" }}>+ IVA</span></div>
      </div>
      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Sin límite de páginas — web funcional</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Diseño web a medida</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Optimización móvil</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Reserva por calendario</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Dominio y correo propios</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>SEO e indexación en Google</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,0.8)" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Contenido de imagen y vídeo profesional</span></li>
      </ul>
      <button type="button" className="sn-planbtn" onClick={v.pickLaunch} style={{ width: "100%", minHeight: "44px", padding: "12px 24px", border: "0", borderRadius: "9999px", background: "#F2F0EB", color: "#16161A", fontFamily: "inherit", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>Elegir Launch</button>
    </div>

    <div style={{ borderRadius: "24px", padding: "32px", background: "#F7F6F3", boxShadow: "0 0 0 1px rgba(0,0,0,0.07), 0 16px 56px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <p style={{ margin: "0", fontSize: "14px", fontWeight: "500", color: "#6E6E76" }}>Business</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginTop: "8px" }}><span style={{ fontSize: "24px", fontWeight: "600", color: "#6E6E76" }}>€</span><span style={{ fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "48px", lineHeight: "1", fontWeight: "600", color: "#16161A" }}>1.199</span><span style={{ fontSize: "14px", color: "#6E6E76", marginLeft: "4px" }}>+ IVA</span></div>
      </div>
      <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          <li style={{ fontSize: "14px", fontWeight: "700", color: "#16161A" }}>Todo lo de Launch, y además:</li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Videos cinemáticos y animaciones avanzadas</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Chatbot con IA</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Aceptación de pagos</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>E-commerce pequeño</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Optimización de conversión</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>SEO avanzado</span></li>
          <li style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", lineHeight: "1.5", color: "#16161A" }}><svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "15px", height: "15px", flexShrink: "0", marginTop: "3px" }}><path d="M20 6 9 17l-5-5" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Analítica detallada</span></li>
      </ul>
      <button type="button" className="sn-planbtn" onClick={v.pickBusiness} style={{ width: "100%", minHeight: "44px", padding: "12px 24px", border: "0", borderRadius: "9999px", background: "#1A1A1F", color: "#F2F0EB", fontFamily: "inherit", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>Elegir Business</button>
    </div>

    <p style={{ margin: "0", textAlign: "center", fontSize: "16px", lineHeight: "1.5", color: "#6E6E76" }}>Paga el 50% al principio y el 50% restante en el lanzamiento.</p>
  </div>

  {/* ===== Formulario tras precios ===== */}
  <div ref={v.midFormRef} id="form-precios" style={{ flexShrink: "0", margin: "-10px -24px 0", padding: "8px 24px 64px", background: "#FFFFFF", color: "#16161A" }}>
    <div style={{ borderRadius: "24px", padding: "28px 24px", background: "#FCEEF8", boxShadow: "0 0 0 1px rgba(176,72,159,0.12), 0 16px 56px rgba(176,72,159,0.14)", display: "flex", flexDirection: "column", gap: "18px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h2 style={{ margin: "0", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "30px", lineHeight: "0.95", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.015em", textTransform: "uppercase", color: "#16161A" }}>Empezar <span style={{ color: "#B0489F" }}>ahora</span></h2>
        <p style={{ margin: "6px 0 0", fontSize: "18px", fontWeight: "600", lineHeight: "1.2", color: "#16161A" }}>Demo en 24h</p>
      </div>
      <form onSubmit={v.onSubmit3} style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f3-nombre" style={{ fontSize: "14px", color: "#6E6E76" }}>Nombre <span style={{ color: "#B0489F" }}>*</span></label>
        <input id="f3-nombre" className="sn-yfl" type="text" required autoComplete="name" placeholder="Tu nombre completo" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(22,22,26,0.15)", background: "#FFFFFF", color: "#16161A", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f3-email" style={{ fontSize: "14px", color: "#6E6E76" }}>Correo electrónico <span style={{ color: "#B0489F" }}>*</span></label>
        <input id="f3-email" className="sn-yfl" type="email" required autoComplete="email" placeholder="tu@correo.com" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(22,22,26,0.15)", background: "#FFFFFF", color: "#16161A", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f3-tel" style={{ fontSize: "14px", color: "#6E6E76" }}>Teléfono <span style={{ color: "#B0489F" }}>*</span></label>
        <input id="f3-tel" className="sn-yfl" type="tel" required autoComplete="tel" placeholder="+34 600 000 000" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(22,22,26,0.15)", background: "#FFFFFF", color: "#16161A", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
        <fieldset style={{ margin: "0", padding: "0", border: "0" }}>
          <legend style={{ padding: "0", marginBottom: "8px", fontSize: "14px", color: "#6E6E76" }}>¿Qué plan te interesa?</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {v.planChipsLight.map((chip: any, chipIndex: number) => (<React.Fragment key={chipIndex}>
              <button type="button" className="sn-chipl" onClick={chip.pick} aria-pressed={chip.pressed} style={{ minHeight: "40px", padding: "6px 14px", borderRadius: "9999px", border: `1px solid ${chip.border}`, background: `${chip.bg}`, color: `${chip.color}`, fontFamily: "inherit", fontSize: "14px", cursor: "pointer" }}>{chip.label}</button>
            </React.Fragment>))}
          </div>
        </fieldset>
        <button type="submit" className="sn-send" style={{ marginTop: "4px", width: "100%", minHeight: "52px", padding: "14px 24px", border: "0", borderRadius: "12px", background: `${v.accent}`, color: "#16161A", fontFamily: "inherit", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>{v.submitLabel3}</button>
        <p style={{ margin: "0", fontSize: "11px", lineHeight: "1.45", color: "#6E6E76" }}>Al hacer clic, aceptas que Yele pueda contactarte en el número que facilitas — incluso mediante tecnología automatizada. Consulta nuestra <a href="/es/privacy-policy" style={{ color: "#16161A", textDecoration: "underline", textUnderlineOffset: "3px" }}>Política de Privacidad</a>.</p>
      </form>
    </div>
  </div>

  {/* ===== FAQ ===== */}
  <div style={{ flexShrink: "0", margin: "-10px -24px 0", padding: "16px 24px 64px", background: "#FFFFFF", color: "#16161A", display: "flex", flexDirection: "column", gap: "20px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <p style={{ margin: "0", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6E6E76" }}>Preguntas frecuentes</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {v.faqs.map((f: any, fIndex: number) => (<React.Fragment key={fIndex}>
        <div style={{ borderBottom: "1px solid rgba(22,22,26,0.1)" }}>
          <button type="button" onClick={f.toggle} aria-expanded={f.expanded} style={{ width: "100%", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 0", border: "0", background: "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: "16px", fontWeight: "500", lineHeight: "1.4", color: "#16161A" }}>{f.q}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "20px", height: "20px", flexShrink: "0", transition: "transform 250ms ease", transform: `${f.iconT}` }}><path d="M5 12h14M12 5v14" fill="none" stroke={v.accent} strokeWidth="2" strokeLinecap="round"></path></svg>
          </button>
          {f.open && (<>
            <p style={{ margin: "0 0 20px", paddingRight: "36px", fontSize: "15px", lineHeight: "1.6", color: "rgba(22,22,26,0.7)" }}>{f.a}</p>
          </>)}
        </div>
      </React.Fragment>))}
    </div>
  </div>

  {/* ===== Vídeo (robot), full-bleed, recortado para móvil con el robot centrado ===== */}
  <div style={{ position: "relative", flexShrink: "0", margin: "-10px -24px 0", background: "#0D0E12" }}>
    <video ref={v.lazyVideoRef} src="/media/siguiente-nivel/robot-mobile.mp4" poster="/media/siguiente-nivel/robot-mobile-poster.jpg" muted loop playsInline preload="none" disablePictureInPicture aria-hidden="true" style={{ pointerEvents: "none", display: "block", width: "100%", aspectRatio: "9 / 16", objectFit: "cover", objectPosition: "center" }}></video>
    <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "46%", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "72px 28px 0", boxSizing: "border-box", background: "linear-gradient(180deg, rgba(11,11,13,0.55) 0%, rgba(11,11,13,0.25) 60%, rgba(11,11,13,0) 100%)", pointerEvents: "none" }}>
      <h2 style={{ margin: "0", textAlign: "center", fontFamily: "var(--font-sn-display), var(--font-display), system-ui, sans-serif", fontSize: "38px", lineHeight: "0.95", fontWeight: "800", fontStretch: "82%", letterSpacing: "-0.015em", textTransform: "uppercase", color: "#FFFFFF", textWrap: "balance", textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}>¿Listo para una web <span style={{ color: `${v.accent}` }}>mejor</span>?</h2>
    </div>
  </div>

  {/* ===== Último formulario ===== */}
  <div ref={v.finalFormRef} id="build-form" style={{ flexShrink: "0", padding: "64px 0 40px", display: "flex", flexDirection: "column", gap: "24px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "rgba(255,255,255,0.7)" }}>Cuéntanos un poco sobre tu negocio y te recomendaremos el plan adecuado.</p>
    </div>
    <form onSubmit={v.onSubmit2} style={{ display: "flex", flexDirection: "column", gap: "14px", margin: "0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f2-nombre" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Nombre <span style={{ color: `${v.accent}` }}>*</span></label>
        <input id="f2-nombre" className="sn-yf" type="text" required autoComplete="name" placeholder="Tu nombre completo" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f2-negocio" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Nombre del negocio</label>
        <input id="f2-negocio" className="sn-yf" type="text" autoComplete="organization" placeholder="Nombre de tu negocio" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f2-email" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Correo electrónico <span style={{ color: `${v.accent}` }}>*</span></label>
        <input id="f2-email" className="sn-yf" type="email" required autoComplete="email" placeholder="tu@correo.com" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f2-tel" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Teléfono</label>
        <input id="f2-tel" className="sn-yf" type="tel" autoComplete="tel" placeholder="+34 600 000 000" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f2-web" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Web actual (opcional)</label>
        <input id="f2-web" className="sn-yf" type="url" autoComplete="url" placeholder="https://" style={{ boxSizing: "border-box", width: "100%", height: "46px", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label htmlFor="f2-negocio-desc" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>¿A qué se dedica tu negocio?</label>
        <textarea id="f2-negocio-desc" className="sn-yf" rows={3} placeholder="Cuéntanos brevemente" style={{ boxSizing: "border-box", width: "100%", padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FFFFFF", fontFamily: "inherit", fontSize: "16px", lineHeight: "1.4", resize: "none" }}></textarea>
      </div>
      <fieldset style={{ margin: "0", padding: "0", border: "0" }}>
        <legend style={{ padding: "0", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>¿Qué necesitas?</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {v.needChips.map((chip: any, chipIndex: number) => (<React.Fragment key={chipIndex}>
            <button type="button" className="sn-chip" onClick={chip.pick} aria-pressed={chip.pressed} style={{ minHeight: "40px", padding: "6px 14px", borderRadius: "9999px", border: `1px solid ${chip.border}`, background: `${chip.bg}`, color: `${chip.color}`, fontFamily: "inherit", fontSize: "14px", cursor: "pointer" }}>{chip.label}</button>
          </React.Fragment>))}
        </div>
      </fieldset>
      <fieldset style={{ margin: "0", padding: "0", border: "0" }}>
        <legend style={{ padding: "0", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>¿Qué plan te interesa?</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {v.planChips.map((chip: any, chipIndex: number) => (<React.Fragment key={chipIndex}>
            <button type="button" className="sn-chip" onClick={chip.pick} aria-pressed={chip.pressed} style={{ minHeight: "40px", padding: "6px 14px", borderRadius: "9999px", border: `1px solid ${chip.border}`, background: `${chip.bg}`, color: `${chip.color}`, fontFamily: "inherit", fontSize: "14px", cursor: "pointer" }}>{chip.label}</button>
          </React.Fragment>))}
        </div>
      </fieldset>
      <button type="submit" className="sn-send" style={{ marginTop: "6px", width: "100%", minHeight: "52px", padding: "14px 24px", border: "0", borderRadius: "12px", background: `${v.accent}`, color: "#16161A", fontFamily: "inherit", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>{v.submitLabel2}</button>
      <p style={{ margin: "0", fontSize: "11px", lineHeight: "1.45", color: "rgba(255,255,255,0.5)" }}>Sin compromiso. Al hacer clic, aceptas que Yele pueda contactarte en el número que facilitas — incluso mediante tecnología automatizada. Consulta nuestra <a href="/es/privacy-policy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Política de Privacidad</a>.</p>
    </form>
  </div>

  {/* ===== Footer ===== */}
  <footer style={{ flexShrink: "0", margin: "0 calc(-1 * var(--sn-pad)) -24px", padding: "40px var(--sn-pad) 36px", background: "#0B0B0D", borderTop: "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--font-body), system-ui, sans-serif", color: "#F4F2EC" }}>
    <div style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.01em" }}>yele<span style={{ color: "#D46FC8" }}>.design</span></div>
    <p style={{ margin: "10px 0 24px", fontSize: "14px", lineHeight: "1.55", color: "rgba(244,242,236,0.6)" }}>Webs a medida para negocios que quieren subir de nivel. Diseño propio, entrega en 7 días.</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "28px 48px" }}>
      <div>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(244,242,236,0.4)", marginBottom: "12px" }}>Contacto</div>
        <a href="mailto:info@yele.design" style={{ display: "block", fontSize: "15px", color: "rgba(244,242,236,0.82)", textDecoration: "none", marginBottom: "10px" }}>info@yele.design</a>
        <a href="https://wa.me/34655517760" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: "15px", color: "rgba(244,242,236,0.82)", textDecoration: "none" }}>WhatsApp</a>
      </div>
      <div>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(244,242,236,0.4)", marginBottom: "12px" }}>Legal</div>
        <a href="/es/privacy-policy" style={{ display: "block", fontSize: "15px", color: "rgba(244,242,236,0.82)", textDecoration: "none", marginBottom: "10px" }}>Política de Privacidad</a>
        <a href="/es/terms" style={{ display: "block", fontSize: "15px", color: "rgba(244,242,236,0.82)", textDecoration: "none", marginBottom: "10px" }}>Términos y Condiciones</a>
        <a href="/es/legal-notice" style={{ display: "block", fontSize: "15px", color: "rgba(244,242,236,0.82)", textDecoration: "none" }}>Aviso Legal</a>
      </div>
    </div>
    <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "12px", color: "rgba(244,242,236,0.45)" }}>© 2026 Yele · yele.design · Hecho en España</div>
  </footer>
</section>

{/* ===== "No quiero" overlay: slides down from the top ===== */}
<div role="dialog" aria-modal="true" aria-label="¿Seguro?" aria-hidden={v.ovHidden} style={{ position: "absolute", inset: "0", zIndex: "20", overflow: "hidden", background: "#E9A9CF", transform: `${v.ovT}`, transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)", pointerEvents: `${v.ovPE}` }}>
  <video ref={v.ovVideoRef} src="/media/siguiente-nivel/nope-mobile.mp4" poster="/media/siguiente-nivel/nope-mobile-poster.jpg" muted loop playsInline preload="none" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }}></video>
  {/* Sits just above the gorilla's head */}
  <div style={{ position: "absolute", left: "24px", right: "24px", top: "31%", display: "flex", justifyContent: "center" }}>
    <button type="button" className="sn-ctaPink" onClick={v.rethink} tabIndex={v.ovTab} style={{ position: "relative", overflow: "visible", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "16px 32px", border: "0", borderRadius: "12px", background: `${v.accent}`, color: "#16161A", fontFamily: "var(--font-body), system-ui, sans-serif", fontSize: "16px", fontWeight: "600", lineHeight: "1.5", cursor: "pointer", boxShadow: "0 12px 32px rgba(90,20,80,0.28)" }}>Me lo he pensado{v.pulse2 && (<><span aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "12px", pointerEvents: "none", animation: "snRing 650ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }}></span><span aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "12px", overflow: "hidden", pointerEvents: "none" }}><span style={{ position: "absolute", top: "0", bottom: "0", left: "0", width: "40%", background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)", animation: "snShine 600ms ease-out forwards" }}></span></span></>)}</button>
  </div>
</div>

</div>
</>
);
}
}
