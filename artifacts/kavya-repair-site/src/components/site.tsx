import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Cpu,
  ExternalLink,
  Laptop,
  Menu,
  MessageCircle,
  MonitorCog,
  Phone,
  ShieldCheck,
  Wrench,
  X,
} from 'lucide-react';
import {
  RepairStatus,
  useCreateContactMessage,
  useCreateRepairRequest,
  getGetOperationsSummaryQueryKey,
  getListRepairRequestsQueryKey,
  useGetOperationsSummary,
  useListRepairRequests,
  useListReviews,
  useListServices,
  useUpdateRepairRequest,
} from '@workspace/api-client-react';

const fallbackServices = [
  { id: 1, title: 'Laptop chip-level repair', description: 'Board-level diagnosis and component repair for the faults others skip.', icon: 'chip' },
  { id: 2, title: 'Laptop hardware repair', description: 'Practical fixes for screens, keyboards, hinges, ports, storage and more.', icon: 'laptop' },
  { id: 3, title: 'Computer repair', description: 'Reliable repair work for everyday desktop and computer problems.', icon: 'monitor' },
  { id: 4, title: 'Laptop diagnostics', description: 'A clear diagnosis before any repair work begins.', icon: 'diagnostic' },
  { id: 5, title: 'Motherboard repair', description: 'Careful fault-finding where the real problem lives: the board.', icon: 'board' },
  { id: 6, title: 'Laptop maintenance', description: 'Keep a working machine clean, cool and dependable for longer.', icon: 'maintenance' },
];

const iconForService = (kind: string) => {
  if (kind.includes('chip') || kind.includes('mother')) return <Cpu size={28} strokeWidth={1.3} />;
  if (kind.includes('computer') || kind.includes('monitor')) return <MonitorCog size={28} strokeWidth={1.3} />;
  if (kind.includes('diagnos')) return <ShieldCheck size={28} strokeWidth={1.3} />;
  if (kind.includes('mainten')) return <Wrench size={28} strokeWidth={1.3} />;
  return <Laptop size={28} strokeWidth={1.3} />;
};

type Notice = { tone: 'success' | 'error'; text: string } | null;

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="container-wide nav-shell">
      <a className="brand-mark" href="#top" onClick={close} data-testid="link-brand-home" aria-label="Kavya Technologies home">
        <span className="brand-glyph" aria-hidden="true"><span>KT</span></span>
        <span><span className="brand-name">Kavya Technologies</span><span className="brand-sub">Repair lab / Kopargaon</span></span>
      </a>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-menu">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      <nav className="nav-links" data-open={open} aria-label="Primary navigation">
        <a href="#services" onClick={close} data-testid="link-services">Services</a>
        <a href="#approach" onClick={close} data-testid="link-approach">Our approach</a>
        <a href="#reviews" onClick={close} data-testid="link-reviews">Reviews</a>
        <a href="#contact" onClick={close} data-testid="link-contact">Contact</a>
        <a className="nav-cta" href="#repair" onClick={close} data-testid="link-book-repair">Book a repair <ArrowUpRight size={14} /></a>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container-wide hero-layout">
        <div className="hero-copy reveal">
          <div className="hero-kicker"><span className="kicker-line" /><span className="eyebrow">Precision repair / Kopargaon</span></div>
          <h1 className="display">When your laptop stops, <em>we start.</em></h1>
          <p className="hero-intro body-copy">A neighborhood repair lab for laptops and computers. Clear diagnosis, careful hands, and the right fix for the machine in front of us.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#repair" data-testid="button-start-repair">Start a repair request <ArrowUpRight size={15} /></a>
            <a className="button-quiet" href="https://wa.me/919094459494" target="_blank" rel="noreferrer" data-testid="link-whatsapp-hero"><MessageCircle size={15} /> WhatsApp us</a>
          </div>
          <div className="hero-meta">
            <div><span className="meta-value">5.0 <span className="stars" aria-label="5 out of 5 stars">★★★★★</span></span><span className="meta-label">Google rating / 38 reviews</span></div>
            <div><span className="meta-value">09:00—21:00</span><span className="meta-label">Monday—Saturday</span></div>
            <div><span className="meta-value">Kopargaon</span><span className="meta-label">Court Road / Maharashtra</span></div>
          </div>
        </div>
        <div className="visual-stage reveal delay-2" aria-label="Kavya Technologies diagnostic lab visual">
          <div className="lab-card">
            <div className="lab-head"><span className="lab-title">KT / DIAGNOSTIC CONSOLE</span><span className="lab-status"><span className="status-dot" /> READY</span></div>
            <div className="laptop-art" aria-hidden="true"><span className="diagnostic-pulse" /></div>
            <div className="lab-readout">
              <div className="readout">SIGNAL<strong>STABLE</strong></div>
              <div className="readout">BOARD<strong>ONLINE</strong></div>
              <div className="readout">NEXT STEP<strong>DIAGNOSE</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const { data, isLoading, isError, refetch } = useListServices();
  const services = Array.isArray(data) && data.length > 0
  ? data
  : fallbackServices;
  return (
    <section className="section" id="services">
      <div className="container-wide">
        <div className="section-heading">
          <div><div className="eyebrow">01 / What we repair</div><h2>Small fault or stubborn board. Bring us the real problem.</h2></div>
          <p className="section-note">No dramatic promises. Just careful diagnostics and repair work grounded in what your device actually needs.</p>
        </div>
        {isError && <div className="empty-note" role="alert">Live service list is unavailable. Showing Kavya Technologies’ core service menu. <button className="button-quiet" onClick={() => refetch()} data-testid="button-retry-services">Retry</button></div>}
        {isLoading ? <div className="services-grid">{[1, 2, 3, 4, 5, 6].map((item) => <div className="service-card skeleton" key={item} />)}</div> : (
          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.id} data-testid={`card-service-${service.id}`}>
                <span className="service-no">0{index + 1}</span>
                <div className="service-icon">{iconForService(`${service.icon} ${service.title}`)}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Approach() {
  const steps = [
    ['01', 'Tell us what changed', 'Share the symptom, the device and what you have already tried.'],
    ['02', 'We diagnose first', 'We look for the root fault before suggesting repair work.'],
    ['03', 'You get a clear next step', 'You know what needs attention before work moves ahead.'],
    ['04', 'We return it ready', 'A repaired machine, explained plainly, without the theatre.'],
  ];
  return (
    <section className="section process-section" id="approach">
      <div className="container-wide">
        <div className="section-heading"><div><div className="eyebrow">02 / The repair flow</div><h2>Good repair is a sequence, not a guess.</h2></div><p className="section-note">Built for people who want their device treated like it matters.</p></div>
        <div className="process-grid">{steps.map(([number, title, copy]) => <article className="process-step" key={number}><b>{number}</b><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div>
    </section>
  );
}

export function RepairForm() {
  const mutation = useCreateRepairRequest();
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', deviceType: 'Laptop', deviceModel: '', service: 'Laptop diagnostics', problemDescription: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    mutation.mutate({ data: { ...form, email: form.email || null, deviceModel: form.deviceModel || null } }, {
      onSuccess: () => {
        setNotice({ tone: 'success', text: 'Request received. Kavya Technologies will contact you on the number provided.' });
        setForm({ customerName: '', phone: '', email: '', deviceType: 'Laptop', deviceModel: '', service: 'Laptop diagnostics', problemDescription: '' });
      },
      onError: () => setNotice({ tone: 'error', text: 'We could not send that request. Please try again or call 090944 59494.' }),
    });
  };
  return (
    <section className="section" id="repair">
      <div className="container-wide repair-panel">
        <div>
          <div className="eyebrow">03 / Start here</div>
          <h2>Let’s get your machine back in the room.</h2>
          <p className="body-copy">Give us the useful details. We will follow up to understand the fault and the next practical step.</p>
          <div className="section-rule" style={{ margin: '32px 0 20px' }} />
          <p className="mono" style={{ color: 'hsl(var(--primary))', fontSize: 12 }}>DIRECT LINE / 090944 59494</p>
        </div>
        <form className="form-card" onSubmit={submit} aria-label="Repair request form">
          <div className="form-grid">
            <Field label="Your name" required><input required minLength={2} value={form.customerName} onChange={(event) => update('customerName', event.target.value)} placeholder="Name" data-testid="input-repair-name" /></Field>
            <Field label="Phone" required><input required minLength={10} value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="090944 59494" data-testid="input-repair-phone" /></Field>
            <Field label="Email (optional)"><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" data-testid="input-repair-email" /></Field>
            <Field label="Device type" required><select value={form.deviceType} onChange={(event) => update('deviceType', event.target.value)} data-testid="select-device-type"><option>Laptop</option><option>Desktop computer</option><option>Computer</option></select></Field>
            <Field label="Device model"><input value={form.deviceModel} onChange={(event) => update('deviceModel', event.target.value)} placeholder="Model, if known" data-testid="input-device-model" /></Field>
            <Field label="Service"><select value={form.service} onChange={(event) => update('service', event.target.value)} data-testid="select-repair-service">{fallbackServices.map((service) => <option key={service.id}>{service.title}</option>)}</select></Field>
            <Field label="What is happening?" required full><textarea required minLength={10} value={form.problemDescription} onChange={(event) => update('problemDescription', event.target.value)} placeholder="Tell us what the machine is doing, or not doing." data-testid="textarea-problem" /></Field>
          </div>
          {notice && <p className={notice.tone === 'error' ? 'form-error' : 'form-message'} role="status">{notice.text}</p>}
          <div className="submit-row"><span className="body-copy" style={{ fontSize: 11 }}>No diagnosis is made from this form alone.</span><button className="button-primary" type="submit" disabled={mutation.isPending} data-testid="button-submit-repair">{mutation.isPending ? 'Sending request…' : 'Send repair request'} <ArrowUpRight size={14} /></button></div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children, required, full }: { label: string; children: ReactNode; required?: boolean; full?: boolean }) {
  return <div className={`field${full ? ' full' : ''}`}><label>{label}{required ? ' *' : ''}</label>{children}</div>;
}

export function Reviews() {
  const { data, isLoading, isError, refetch } = useListReviews();
  return (
    <section className="section" id="reviews">
      <div className="container-wide reviews-layout">
        <div>
          <div className="eyebrow">04 / From customers</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 5.2rem)', lineHeight: '.93', letterSpacing: '-.07em', margin: '14px 0 35px' }}>Trust is earned one repaired device at a time.</h2>
          <div className="rating-lockup"><div className="rating-number">5.0</div><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><div className="rating-copy">Google rating / 38 reviews</div></div>
        </div>
        <div>
          {isError && <div className="empty-note" role="alert">Reviews could not load. <button className="button-quiet" onClick={() => refetch()} data-testid="button-retry-reviews">Try again</button></div>}
          {isLoading && <div className="reviews-list"><div className="review-card skeleton" /><div className="review-card skeleton" /></div>}
          {!isLoading && !isError && Array.isArray(data) && data.length ? (
  <div className="reviews-list">
    {data.map((review) => (
      <article
        className="review-card"
        key={review.id}
        data-testid={`card-review-${review.id}`}
      >
        <blockquote>“{review.review}”</blockquote>
        <div className="review-footer">
          <span>{review.customerName}</span>
          <span>
            <span className="stars">{'★'.repeat(review.rating)}</span> / {review.date}
          </span>
        </div>
      </article>
    ))}
  </div>
) : null}
          {!isLoading && !isError && (!Array.isArray(data) || !data.length) && (
  <div className="empty-note" data-testid="empty-reviews">
    Customer reviews will appear here when available.
  </div>
)}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const items = [
    ['Where is Kavya Technologies?', 'You will find us on Court Rd, near Central Bank of India, Mahadevnagar, Kopargaon, Maharashtra 423601.'],
    ['When are you open?', 'We are open Monday to Saturday from 9 AM to 9 PM. Sunday is closed.'],
    ['How do I start a repair?', 'Use the repair request form on this page, call 090944 59494, or message us on WhatsApp at +91 90944 59494.'],
    ['What kind of work do you do?', 'Kavya Technologies handles laptop chip-level repair, laptop hardware repair, computer repair, laptop diagnostics, motherboard repair and laptop maintenance.'],
  ];
  return (
    <section className="section" id="faq">
      <div className="container-wide">
        <div className="section-heading"><div><div className="eyebrow">05 / Quick answers</div><h2>The useful details, before you leave home.</h2></div><CircleHelp color="hsl(var(--primary))" size={34} strokeWidth={1.2} /></div>
        <div className="faq-grid">{items.map(([question, answer], index) => <details className="faq-item" key={question} open={index === 0}><summary data-testid={`button-faq-${index}`}>{question}<span><ChevronDown size={16} /></span></summary><div className="faq-answer">{answer}</div></details>)}</div>
      </div>
    </section>
  );
}

export function Contact() {
  const mutation = useCreateContactMessage();
  const [notice, setNotice] = useState<Notice>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    mutation.mutate({ data: { ...form, phone: form.phone || null, email: form.email || null } }, {
      onSuccess: () => { setNotice({ tone: 'success', text: 'Message sent. We will get back to you.' }); setForm({ name: '', phone: '', email: '', message: '' }); },
      onError: () => setNotice({ tone: 'error', text: 'Message could not be sent. Please call 090944 59494.' }),
    });
  };
  return (
    <section className="contact-band" id="contact">
      <div className="container-wide contact-band-inner">
        <div><div className="eyebrow">06 / Find the lab</div><h2>Bring the problem. Leave with a plan.</h2><dl className="contact-details"><div><dt>Visit</dt><dd>Court Rd near Central Bank of India<br />Mahadevnagar, Kopargaon</dd></div><div><dt>Call / WhatsApp</dt><dd><a href="tel:09094459494" data-testid="link-phone-contact">090944 59494</a><br /><a href="https://wa.me/919094459494" target="_blank" rel="noreferrer" data-testid="link-whatsapp-contact">+91 90944 59494</a></dd></div><div><dt>Hours</dt><dd>Mon—Sat / 9 AM—9 PM<br />Sunday / Closed</dd></div><div><dt>Directions</dt><dd><a href="https://www.google.com/maps/search/?api=1&query=Kavya+Technologies+Kopargaon" target="_blank" rel="noreferrer" data-testid="link-directions">Open in Maps <ExternalLink size={12} /></a></dd></div></dl></div>
        <form className="form-card" onSubmit={submit} aria-label="Contact form" style={{ background: 'rgba(12,25,29,.15)', borderColor: 'rgba(12,25,29,.3)' }}>
          <div className="eyebrow" style={{ color: 'inherit', opacity: .65 }}>Have a question?</div>
          <div className="form-grid" style={{ marginTop: 22 }}><Field label="Name" required><input required minLength={2} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" data-testid="input-contact-name" /></Field><Field label="Phone"><input value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Phone number" data-testid="input-contact-phone" /></Field><Field label="Email"><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Email address" data-testid="input-contact-email" /></Field><Field label="Message" required full><textarea required minLength={10} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="How can we help?" data-testid="textarea-contact-message" /></Field></div>
          {notice && <p className={notice.tone === 'error' ? 'form-error' : 'form-message'} role="status">{notice.text}</p>}
          <button className="button-quiet" type="submit" disabled={mutation.isPending} data-testid="button-submit-contact" style={{ borderColor: 'rgba(12,25,29,.45)', color: 'inherit' }}>{mutation.isPending ? 'Sending…' : 'Send message'} <ArrowUpRight size={14} /></button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return <footer className="footer"><div className="container-wide footer-inner"><span>© {new Date().getFullYear()} Kavya Technologies / Kopargaon, Maharashtra</span><span><a href="#top" data-testid="link-back-top">Back to top ↑</a></span></div></footer>;
}

export function AppShell() {
  return <div className="site-shell"><Header /><main><Hero /><Services /><Approach /><RepairForm /><Reviews /><FAQ /><Contact /></main><Footer /></div>;
}

export function OperationsShell() {
  const queryClient = useQueryClient();
  const { data: summary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useGetOperationsSummaryForShell();
  const { data: requests, isLoading: requestsLoading, isError: requestsError, refetch: refetchRequests } = useListRepairRequestsForShell();
  const updateRequest = useUpdateRepairRequestForShell();
  const [filter, setFilter] = useState('');
  const visibleRequests = useMemo(() => (requests ?? []).filter((request) => !filter || request.status === filter), [requests, filter]);
  return (
    <div className="ops-shell">
      <div className="container-wide">
        <div className="ops-header"><div><a className="eyebrow" href="/" data-testid="link-ops-home">← Public site</a><h1>Operations desk</h1><p className="body-copy">Kavya Technologies / repair requests and incoming messages</p></div><span className="status-tag">API CONNECTED</span></div>
        {summaryError && <div className="empty-note" role="alert">Operations summary is unavailable. <button className="button-quiet" onClick={() => refetchSummary()} data-testid="button-retry-summary">Retry</button></div>}
        {summaryLoading ? <div className="ops-grid">{[1, 2, 3, 4, 5].map((item) => <div className="ops-stat skeleton" key={item} />)}</div> : <div className="ops-grid">{[['Requests', summary?.totalRepairRequests ?? 0], ['Pending', summary?.pending ?? 0], ['Contacted', summary?.contacted ?? 0], ['In progress', summary?.inProgress ?? 0], ['Completed', summary?.completed ?? 0]].map(([label, value]) => <div className="ops-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 15 }}><div><div className="eyebrow">Repair queue</div><h2 style={{ margin: '10px 0 0', fontSize: 28, letterSpacing: '-.05em' }}>Recent requests</h2></div><select className="button-quiet" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter requests by status" data-testid="select-ops-filter"><option value="">All statuses</option>{Object.values(RepairStatus).map((status) => <option value={status} key={status}>{status}</option>)}</select></div>
        {requestsError && <div className="empty-note" role="alert">Repair requests are unavailable. <button className="button-quiet" onClick={() => refetchRequests()} data-testid="button-retry-requests">Retry</button></div>}
        {requestsLoading ? <div className="skeleton" style={{ minHeight: 220 }} /> : !requestsError && visibleRequests.length ? <div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Customer</th><th>Device</th><th>Request</th><th>Status</th><th>Update</th></tr></thead><tbody>{visibleRequests.map((request) => <tr key={request.id} data-testid={`row-repair-${request.id}`}><td><strong>{request.customerName}</strong><br /><span className="body-copy">{request.phone}</span></td><td>{request.deviceType}<br /><span className="body-copy">{request.deviceModel || 'Model not provided'}</span></td><td style={{ maxWidth: 300 }}>{request.service}<br /><span className="body-copy">{request.problemDescription}</span></td><td><span className="status-tag">{request.status}</span></td><td><div className="ops-actions">{[RepairStatus.Contacted, RepairStatus.In_Progress, RepairStatus.Completed].filter((status) => status !== request.status).map((status) => <button key={status} onClick={() => updateRequest.mutate({ id: request.id, data: { status } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListRepairRequestsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetOperationsSummaryQueryKey() }); } })} disabled={updateRequest.isPending} data-testid={`button-update-${request.id}-${status.replaceAll(' ', '-').toLowerCase()}`}>{status}</button>)}</div></td></tr>)}</tbody></table></div> : !requestsError ? <div className="empty-note">No repair requests match this filter.</div> : null}
      </div>
    </div>
  );
}

function useGetOperationsSummaryForShell() {
  // Kept as a small wrapper so the operations surface stays easy to split from the public site later.
  return useGetOperationsSummary();
}
function useListRepairRequestsForShell() { return useListRepairRequests(); }
function useUpdateRepairRequestForShell() { return useUpdateRepairRequest(); }