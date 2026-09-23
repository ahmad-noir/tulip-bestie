import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, Check, ChevronRight, Flower2, Heart, LockKeyhole, MailOpen, PencilLine, Pin, RotateCcw, Sparkles, X } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type TulipProps = { fill: string; x: number; y: number; scale?: number; rotate?: number };

function Tulip({ fill, x, y, scale = 1, rotate = 0 }: TulipProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotate})`}>
      <path d="M12 130 C 6 92, 17 54, 27 21" stroke="#477b65" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M20 85 C 2 71, -5 58, 0 49 C 16 51, 27 60, 30 72" fill="#5b9072" />
      <path d="M23 103 C 43 89, 52 84, 57 70 C 40 72, 27 80, 22 90" fill="#477b65" />
      <path d="M27 40 C 9 29, 5 13, 12 0 C 21 5, 26 12, 28 20 C 29 10, 36 2, 46 0 C 51 14, 44 29, 29 40 Z" fill={fill} />
      <path d="M27 40 C 29 22, 30 10, 46 0 C 53 21, 46 33, 27 40 Z" fill="hsl(342 72% 35% / .22)" />
    </g>
  );
}

function BouquetIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? 'memory-illustration' : 'bouquet'} viewBox="0 0 260 310" role="img" aria-label="Illustration of a bright tulip bouquet">
      <path d="M104 309 C 92 256, 104 214, 131 173 C 153 139, 178 116, 207 91" stroke="#477b65" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M153 265 C 124 223, 81 211, 53 182" stroke="#5b9072" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M130 279 C 153 240, 183 212, 211 177" stroke="#477b65" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M111 244 C 73 224, 47 224, 28 235 C 51 246, 78 254, 112 250 Z" fill="#5b9072" />
      <path d="M155 238 C 192 218, 219 218, 239 228 C 215 241, 183 247, 155 246 Z" fill="#477b65" />
      <path d="M130 203 C 94 179, 74 146, 76 111 C 105 117, 124 135, 135 161" fill="#6a9c79" />
      <Tulip fill="#df4d73" x={37} y={84} scale={1.2} rotate={-18} />
      <Tulip fill="#f58a92" x={100} y={48} scale={1.35} rotate={-4} />
      <Tulip fill="#e76583" x={165} y={76} scale={1.16} rotate={16} />
      <Tulip fill="#f6b64f" x={84} y={128} scale={.9} rotate={-12} />
      <Tulip fill="#f2768e" x={143} y={131} scale={.92} rotate={12} />
      <circle cx="132" cy="287" r="11" fill="#f8cd5b" />
      <path d="M118 290 Q132 275 146 290" stroke="#d94770" strokeWidth="3" fill="none" />
    </svg>
  );
}

const reasons = [
  { title: 'You make my day just by talking to me.', body: 'Even when we are talking about absolutely nothing, hearing from you can turn my whole mood around. One message, one call, or one of your random stories and suddenly an ordinary day feels like ours.' },
  { title: 'You always support me, no matter what happens.', body: 'Whether I need a pep talk, someone to listen to my nonsense, or just a reminder that I can get through it, you show up. You never make me feel like I am too much.' },
  { title: 'Our vibes just match.', body: 'We can be silly, dramatic, quiet, or completely unserious and it still makes sense. I never have to explain the weird parts of me to you — you already get them.' },
  { title: 'We both love shawarma.', body: 'Some friendships are built on deep conversations. Ours are also built on knowing exactly when shawarma will fix the situation. Same cravings, same excitement, and absolutely no judgment about ordering extra.' },
];

function ScrollReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Home() {
  const [topScrolled, setTopScrolled] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(`Faiza, you honestly make life feel a little easier just by being there. You’ve always been the person who supports me, listens to my nonsense, gives me the pep talk I need, and somehow makes even the most ordinary days feel better.

And I know you’re upset with me right now. I hate knowing that I’m the reason you’re feeling this way. I might not always say it properly, but I genuinely appreciate everything you do for me and every time you’ve stood by me. Your support means more to me than I probably ever tell you.

And honestly, something happened this time that even surprised me. For the first time, I cried because I was genuinely scared of losing someone — and that someone was you. I never thought I’d be this afraid of losing a friendship, but the thought of you not being in my life genuinely hurt.

You deserve all the tulips in the world 🌷, but for now, all I can say is that I’m truly sorry. I hope you can forgive me when you’re ready.

Just know that I’m always in your corner too — loudly, stubbornly, and with unlimited snacks. 🤍

You’re allowed to be mad at me… bas please, zyada der tak nahi. 😭🌷`);
  const [draftNote, setDraftNote] = useState(note);
  const [openEnvelope, setOpenEnvelope] = useState<number | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setTopScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    const revealables = mainRef.current?.querySelectorAll('.reveal');
    revealables?.forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const saveNote = () => { setNote(draftNote); setEditing(false); };
  const cancelNote = () => { setDraftNote(note); setEditing(false); };
  const celebrate = () => {
    setCelebrated(true);
    window.setTimeout(() => setCelebrated(false), 3400);
  };

  return (
    <div className="site-shell">
      <header className={`topbar ${topScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <button className="wordmark" onClick={() => scrollTo('top')} data-testid="button-home">
            <span className="wordmark-mark"><Flower2 size={16} /></span>
            <span>a little something</span>
          </button>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#note" data-testid="link-note">the note</a>
            <a href="#finale" data-testid="link-finale">for you</a>
          </nav>
        </div>
      </header>

      <main id="top" ref={mainRef}>
        <section className="hero" data-testid="section-hero">
          <div className="hero-inner">
            <div className="hero-copy-block">
              <div className="hero-kicker tiny-label"><Sparkles size={13} /> private internet corner / just for you</div>
              <h1>For my <em>favorite</em> person.</h1>
              <p className="hero-copy">A tiny bouquet of words, memories, and very good reasons I am lucky to call you my best friend.</p>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => scrollTo('note')} data-testid="button-open-note">Open your note <MailOpen size={15} /></button>
                <button className="button-quiet" onClick={() => scrollTo('reasons')} data-testid="button-see-reasons">There are reasons <ChevronRight size={15} /></button>
              </div>
            </div>
            <div className="hero-art">
              <BouquetIllustration />
              <div className="float-tag one">grown with<br /><strong>too much love</strong></div>
              <div className="float-tag two"><Pin size={12} /> keep this tab</div>
            </div>
          </div>
          <button className="scroll-cue" onClick={() => scrollTo('manifesto')} data-testid="button-scroll-cue"><span><ArrowDown size={13} /></span> keep going</button>
        </section>

        <section className="section manifesto" id="manifesto" data-testid="section-manifesto">
          <div className="section-inner">
            <ScrollReveal><span className="tiny-label">01 / the important bit</span><h2>Friendship, but make it a flower.</h2></ScrollReveal>
            <ScrollReveal delay={130}>
              <div className="manifesto-copy">Some people enter your life like a <strong>firework.</strong> You arrived more like a tulip: bright, unexpected, and somehow making everything around you look better.</div>
              <p className="manifesto-note">No occasion required. No big announcement. Just a reminder from someone who notices how much better the world is with you in it.</p>
            </ScrollReveal>
          </div>
        </section>

        <section className="section" id="note" data-testid="section-note">
          <div className="section-inner note-wrap">
            <ScrollReveal className="note-intro">
              <div className="section-heading">
                <span className="tiny-label">02 / a note, in writing</span>
                <h2>Read this on a day you need it.</h2>
                <p>Or on a day you do not. The nice thing about best-friend notes is that they are allowed to arrive whenever they like.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <article className="letter" data-testid="card-bestie-note">
                <div className="letter-content">
                  <div className="letter-top"><span className="letter-date">SPRING / ALWAYS</span><span className="letter-stamp"><Heart size={15} fill="currentColor" /></span></div>
                  <h3>Dear Faiza,</h3>
                  {editing ? (
                    <div className="letter-editor">
                      <textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} aria-label="Editable bestie note" data-testid="textarea-bestie-note" />
                      <div className="editor-actions">
                        <button className="mini-button" onClick={saveNote} data-testid="button-save-note"><Check size={13} /> Save note</button>
                        <button className="mini-button secondary" onClick={cancelNote} data-testid="button-cancel-note"><X size={13} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="letter-body" data-testid="text-bestie-note">{note}</p>
                      <p className="letter-sign">Always in your corner,</p>
                    </>
                  )}
                  {!editing && <div className="edit-row"><button className="edit-button" onClick={() => { setDraftNote(note); setEditing(true); }} data-testid="button-edit-note"><PencilLine size={13} /> make it yours</button></div>}
                </div>
              </article>
            </ScrollReveal>
          </div>
        </section>

        <section className="section reasons" id="reasons" data-testid="section-reasons">
          <div className="section-inner reasons-layout">
            <ScrollReveal>
              <div className="section-heading">
                <span className="tiny-label">03 / evidence, actually</span>
                <h2>Reasons you are my favorite.</h2>
                <p>There are more than four. The website has limited storage. My affection does not.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={130}>
              <div className="reason-stage">
                <article className="reason-card" key={reasonIndex} data-testid={`card-reason-${reasonIndex}`}>
                  <span className="reason-number">REASON 0{reasonIndex + 1} / 04</span>
                  <h3>{reasons[reasonIndex].title}</h3>
                  <p>{reasons[reasonIndex].body}</p>
                  <button className="shuffle-button" onClick={() => setReasonIndex((reasonIndex + 1) % reasons.length)} data-testid="button-next-reason">another one <RotateCcw size={13} /></button>
                </article>
                <div className="reason-tabs" aria-label="Choose a reason">
                  {reasons.map((reason, index) => <button className={`reason-tab ${reasonIndex === index ? 'active' : ''}`} key={reason.title} onClick={() => setReasonIndex(index)} aria-label={`Show reason ${index + 1}`} data-testid={`button-reason-${index}`}>{String(index + 1).padStart(2, '0')}</button>)}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="section open-when" id="open-when" data-testid="section-open-when">
          <div className="section-inner">
            <ScrollReveal><div className="section-heading"><span className="tiny-label">04 / tiny emergency envelopes</span><h2>Open one when you need a little something.</h2><p>Tap a tab. There is no wrong answer.</p></div></ScrollReveal>
            <div className="envelope-grid">
              {[
                ['you need a win', 'This counts. Every tiny step counts. I am proud of the version of you who kept going today.'],
                ['the day is weird', 'A weird day is not a weird life. Drink some water, put on the song, and text me the unedited version.'],
                ['you forgot', 'You are funny, generous, wildly capable, and very easy to love. In case your brain was being rude about it.'],
              ].map(([title, reveal], index) => (
                <ScrollReveal key={title} delay={index * 100}>
                  <button className={`envelope ${openEnvelope === index ? 'open' : ''}`} onClick={() => setOpenEnvelope(openEnvelope === index ? null : index)} data-testid={`button-envelope-${index}`}>
                    <span className="envelope-seal">{openEnvelope === index ? <MailOpen size={16} /> : <LockKeyhole size={15} />}</span>
                    {openEnvelope === index ? <span className="envelope-reveal">{reveal}</span> : <span className="envelope-closed"><span>open when<br /><strong>{title}</strong></span><ChevronRight size={16} /></span>}
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section finale" id="finale" data-testid="section-finale">
          <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" />
          <div className="finale-inner">
            <ScrollReveal><span className="tiny-label">05 / the grand finale</span><h2>More flowers. More us.</h2><p>This little corner of the internet is yours whenever you need a bright spot. Close the tab, keep the feeling.</p><button className="button-primary" onClick={celebrate} data-testid="button-celebrate"><Heart size={15} fill="currentColor" /> {celebrated ? 'message received' : 'send a little love back'}</button><div className={`celebrate-message ${celebrated ? 'show' : ''}`} data-testid="status-celebration">{celebrated ? 'noted: bestie status remains extremely important.' : ''}</div></ScrollReveal>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="footer-inner"><span>made with care, on purpose</span><span>tulips are temporary. this friendship is not.</span></div></footer>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
