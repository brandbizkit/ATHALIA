"use client";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
type View = "home" | "art" | "artist" | "upload";
type Data = {
  title: string;
  medium: string;
  year: string;
  story: string;
  instagram: string;
  social: string;
  posterPrice: string;
  originalPrice: string;
  sellOriginal: boolean;
  video?: File;
  master?: File;
  back?: File;
};
const media = "/media/";
const artImages = [
  "Screenshot_20260712_164126.jpg",
  "Screenshot_20260712_164157.jpg",
  "Screenshot_20260712_165108.jpg",
  "Screenshot_20260712_170054.jpg",
];
const posterImages = [
  "poster-green-dress.jpg",
  "poster-becoming.jpg",
  "poster-old-soul.jpg",
  "poster-halo-garden.jpg",
];
const processVideos = [
  "video_20260712_164400_edit.mp4",
  "video_20260712_164643_edit.mp4",
  "video_20260712_165018_edit.mp4",
  "video_20260712_165228_edit.mp4",
  "video_20260712_165350_edit.mp4",
  "video_20260712_165508_edit.mp4",
  "video_20260712_165645_edit.mp4",
  "video_20260712_165925_edit.mp4",
];
const works = [
  [
    "The Green Dress",
    "Thalia Encarnado",
    "Oil on canvas",
    "Digital from $12 · Original $680",
    posterImages[0],
  ],
  ["Becoming", "Thalia Encarnado", "Oil & charcoal", "Digital from $14 · Original $520", posterImages[1]],
  [
    "Old Soul Study",
    "Thalia Encarnado",
    "Graphite & pastel",
    "Digital from $10 · Original $240",
    posterImages[2],
  ],
  [
    "Halo Garden",
    "Thalia Encarnado",
    "Mixed media on canvas",
    "Digital from $14 · Original $740",
    posterImages[3],
  ],
];
const featuredWorks = [{work:works[3],index:3},{work:works[1],index:1},{work:works[2],index:2}];
const details = [
  {title:'The Green Dress',medium:'Oil on canvas',year:'2026',image:posterImages[0],original:680,base:12,dimensions:'61 × 46 cm',video:5,narrative:'The portrait begins with likeness, but becomes interesting when personality starts to move through the paint.',story:'A finished figurative portrait built through layered oil brushwork, observation, and quiet shifts of color.'},
  {title:'Becoming',medium:'Oil & charcoal on canvas',year:'2026',image:posterImages[1],original:520,base:14,dimensions:'56 × 42 cm',video:3,narrative:'I wanted the searching lines to remain visible — the moment before a portrait fully settles into itself.',story:'Painted passages meet exposed canvas and charcoal construction marks, preserving the work’s evolution as part of its final state.'},
  {title:'Old Soul Study',medium:'Graphite & white pastel',year:'2026',image:posterImages[2],original:240,base:10,dimensions:'42 × 30 cm',video:7,narrative:'Age gives the face its own landscape. Every line carries time, memory, and a kind of earned stillness.',story:'A contemplative study on toned paper, shaped with graphite, charcoal, and restrained white pastel.'},
  {title:'Halo Garden',medium:'Mixed media on canvas',year:'2026',image:posterImages[3],original:740,base:14,dimensions:'76 × 56 cm',video:6,narrative:'The figure sits within a garden of patterns — portrait, memory, and ornament held in the same visual rhythm.',story:'A richly patterned portrait surrounded by hand-painted botanical and geometric panels in olive, orange, black, and cream.'},
];
function Logo() {
  return (
    <span className="logo">
      A<small>THALIA</small>
    </span>
  );
}
function Header({ go }: { go: (v: View) => void }) {
  return (
    <header>
      <button onClick={() => go("home")}>
        <Logo />
      </button>
      <nav>
        <button onClick={() => go("home")}>Explore art</button>
        <button onClick={() => go("upload")}>For artists</button>
        <a href="/studio">Artist login</a>
      </nav>
      <button className="outline" onClick={() => go("upload")}>
        Submit work ↗
      </button>
    </header>
  );
}
function ArtImage({
  src,
  className = "",
  alt = "Original artwork",
}: {
  src: string;
  className?: string;
  alt?: string;
}) {
  return (
    <span className={`art-photo ${className}`}>
      <img src={media + src} alt={alt} />
    </span>
  );
}
function Home({ go, openArt }: { go: (v: View) => void; openArt:(index:number)=>void }) {
  return (
    <>
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">ART WITH EVIDENCE · EDITION 01</p>
            <h1>
              Original Art.
              <br />
              <i>Humanely</i> made
            </h1>
            <p className="lede">
              Collect original physical works or museum-worthy poster editions.
              Every piece arrives with the raw, human story of how it came to
              be.
            </p>
            <button
              className="black"
              onClick={() =>
                document
                  .querySelector("#collection")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore the collection
            </button>
            <button className="plain" onClick={() => go("upload")}>
              I’m an artist →
            </button>
          </div>
          <button className="feature" onClick={() => openArt(0)}>
            <ArtImage
              src={posterImages[0]}
              alt="Thalia Encarnado painting The Green Dress"
            />
            <span className="caption">
              <span>
                <strong>The Green Dress</strong>
                <small>Thalia Encarnado · Manila</small>
              </span>
              <b>Prints $12 · Original $680</b>
            </span>
          </button>
        </section>
        <section className="standard">
          <p>THE ATHALIA STANDARD</p>
          <h2>
            Not generated. Not guessed.
            <br />A real object, made in a real room.
          </h2>
          <div>
            <span>
              <b>01</b> Raw process footage
            </span>
            <span>
              <b>02</b> Signed physical backing
            </span>
            <span>
              <b>03</b> Print-ready at 300 DPI
            </span>
          </div>
        </section>
        <section id="collection" className="collection">
          <div className="section-title">
            <span>
              <p className="eyebrow">CURATED THIS WEEK</p>
              <h2>New physical works</h2>
            </span>
            <p>
              Choose a print-ready poster in your preferred size,
              <br />
              or acquire the signed original when available.
            </p>
          </div>
          <div className="grid">
            {featuredWorks.map(({work:w,index}) => (
              <button className="card" key={w[0]} onClick={() => openArt(index)}>
                <ArtImage src={w[4]} alt={`${w[0]} by ${w[1]}`} />
                <span className="caption">
                  <span>
                    <strong>{w[0]}</strong>
                    <small>
                      {w[1]} · {w[2]}
                    </small>
                  </span>
                  <b>{w[3]}</b>
                </span>
              </button>
            ))}
          </div>
        </section>
        <StudioFilm />
        <section className="featured-artist">
          <div>
            <p className="eyebrow">FEATURED ARTIST · MANILA</p>
            <h2>
              Thalia
              <br />
              <i>Encarnado</i>
            </h2>
            <p>
              Portraiture built through observation, patience, and visible
              layers of the hand.
            </p>
            <button className="black" onClick={() => go("artist")}>
              Visit Thalia’s profile →
            </button>
          </div>
          <ArtImage src={artImages[0]} alt="Thalia Encarnado in her studio" />
        </section>
        <section className="artist">
          <p className="eyebrow">FOR PHYSICAL ARTISTS</p>
          <h2>
            Your work deserves
            <br />a wider wall.
          </h2>
          <p>
            Turn one original into poster editions that can reach collectors
            worldwide — and list the signed physical artwork at your own price.
            ATHALIA gives your practice a curated exhibition space, proof of
            authorship, automated print files, and a new audience without
            gatekeepers.
          </p>
          <div className="artist-benefits">
            <span>
              <b>01</b>Get exhibited in a curated digital gallery
            </span>
            <span>
              <b>02</b>Reach collectors beyond your local market
            </span>
            <span>
              <b>03</b>Sell scalable poster editions and your original
            </span>
          </div>
          <button onClick={() => go("upload")}>Open your free studio ↗</button>
          <em>
            Your studio.
            <br />A wider world.
          </em>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}
function StudioFilm() {
  return (
    <section className="studio-film">
      <div className="section-title">
        <span>
          <p className="eyebrow">INSIDE THE STUDIO</p>
          <h2>Watch the work become real.</h2>
        </span>
        <p>
          Unpolished moments from the making — brushwork,
          <br />
          materials, movement, and the artist’s own environment.
        </p>
      </div>
      <div className="film-grid">
        {processVideos.slice(1).map((src, i) => (
          <figure key={src} className={i === 0 ? "wide" : ""}>
            <video
              src={media + src}
              controls={i === 0}
              muted={i !== 0}
              autoPlay={i !== 0}
              loop
              playsInline
              preload="metadata"
            />
            <figcaption>
              <span>PROCESS STUDY · 0{i + 1}</span>
              <span>{i % 2 ? "DETAIL & LAYER" : "GESTURE & MATERIAL"}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
function Art({ go, artworkIndex }: { go: (v: View) => void; artworkIndex:number }) {
  const [image, setImage] = useState(0),
    [added, setAdded] = useState(false),
    [format, setFormat] = useState<"poster" | "original">("poster"),
    [size, setSize] = useState("12 × 18 in");
  const d=details[artworkIndex];
  const processImage=artworkIndex===2?artImages[3]:artImages[2];
  const shown = [d.image, processImage, artImages[1]];
  const price =
    format === "original"
      ? `$${d.original}.00`
      : size === "24 × 36 in"
        ? `$${d.base+16}.00`
        : size === "16 × 24 in"
          ? `$${d.base+8}.00`
          : `$${d.base}.00`;
  return (
    <main className="detail">
      <button className="back" onClick={() => go("home")}>
        ← Back to collection
      </button>
      <section className="product">
        <div className="gallery">
          <ArtImage
            className="large"
            src={shown[image]}
            alt="Artwork gallery view"
          />
          <div className="thumbs">
            {[
              ["Artist & work", shown[0]],
              ["In process", shown[1]],
              ["Studio details", shown[2]],
            ].map((x, i) => (
              <button
                className={image === i ? "active" : ""}
                onClick={() => setImage(i)}
                key={x[0]}
              >
                <ArtImage src={x[1]} />
                {x[0]}
              </button>
            ))}
          </div>
        </div>
        <aside>
          <p className="eyebrow">VERIFIED PHYSICAL ORIGINAL · 01</p>
          <h1>{d.title}</h1>
          <button className="artist-link" onClick={() => go("artist")}>
            Thalia Encarnado →
          </button>
          <a href="https://instagram.com/thalia_nado" target="_blank" rel="noreferrer">
            @thalia_nado ↗
          </a>
          <p className="muted">Manila, Philippines · {d.medium} · {d.year}</p>
          <div className="purchase-type">
            <button
              className={format === "poster" ? "active" : ""}
              onClick={() => {
                setFormat("poster");
                setAdded(false);
              }}
            >
              <span>Poster edition</span>
              <small>Print-ready digital file</small>
            </button>
            <button
              className={format === "original" ? "active" : ""}
              onClick={() => {
                setFormat("original");
                setAdded(false);
              }}
            >
              <span>Signed original</span>
              <small>One of one · available</small>
            </button>
          </div>
          <div className="price">
            <b>{price}</b>
            <span>
              {format === "poster"
                ? "Digital poster edition"
                : "Original artwork · shipping quoted separately"}
            </span>
          </div>
          {format === "poster" ? (
            <div className="size-picker">
              <label>
                Choose display size
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="12 × 18 in">12 × 18 in — ${d.base}</option>
                  <option value="16 × 24 in">16 × 24 in — ${d.base+8}</option>
                  <option value="24 × 36 in">24 × 36 in — ${d.base+16}</option>
                </select>
              </label>
              <div className="files">
                <p>Your download includes</p>
                <span>✓ Selected high-resolution poster file</span>
                <span>✓ 300 DPI · ready for professional printing</span>
                <span>✓ Artist story and provenance assets</span>
              </div>
            </div>
          ) : (
            <div className="original-facts">
              <span>
                <b>Dimensions</b>{d.dimensions}
              </span>
              <span>
                <b>Condition</b>Artist studio · excellent
              </span>
              <span>
                <b>Includes</b>Certificate + signed backing
              </span>
              <span>
                <b>Fulfilment</b>Ships from Manila
              </span>
            </div>
          )}
          <button className="buy" onClick={() => setAdded(true)}>
            {added
              ? `${format === "original" ? "Original reserved" : "Poster added"} ✓`
              : `${format === "original" ? "Reserve the original" : "Add poster to collection"} →`}
          </button>
          <small>
            {format === "poster"
              ? "Instant download · Personal display license"
              : "Secure checkout · Insured shipping arranged after purchase"}
          </small>
          <div className="verified">
            <b>
              HUMAN
              <br />
              MADE
              <br />✓
            </b>
            <p>
              <strong>Radical trust provenance</strong>Process footage and the
              physical work connect this listing directly to the artist’s hand.
            </p>
          </div>
        </aside>
      </section>
      <section className="story">
        <div>
          <p className="eyebrow">THE HUMAN NARRATIVE</p>
          <blockquote>
            “{d.narrative}”
          </blockquote>
          <p>{d.story}</p>
        </div>
        <video
          className="detail-video"
          src={media + processVideos[d.video]}
          controls
          playsInline
          preload="metadata"
        />
      </section>
    </main>
  );
}
function ArtistProfile({ go, openArt }: { go: (v: View) => void; openArt:(index:number)=>void }) {
  return <main className="artist-profile">
    <section className="profile-hero"><div><button className="back" onClick={() => go("home")}>← Back to collection</button><p className="eyebrow">FEATURED ARTIST · MANILA, PHILIPPINES</p><h1>Thalia<br/><i>Encarnado</i></h1><p className="profile-intro">A figurative artist exploring presence, character, and the quiet psychology of portraiture through oil, graphite, and pastel.</p><a className="instagram" href="https://instagram.com/thalia_nado" target="_blank" rel="noreferrer">Instagram · @thalia_nado ↗</a><dl><div><dt>Practice</dt><dd>Figurative painting & drawing</dd></div><div><dt>Based in</dt><dd>Manila, Philippines</dd></div><div><dt>On ATHALIA</dt><dd>Poster editions + originals</dd></div></dl></div><ArtImage src={artImages[0]} alt="Thalia Encarnado painting in her studio"/></section>
    <section className="profile-statement"><p className="eyebrow">ARTIST STATEMENT</p><blockquote>“I’m drawn to the point where a portrait stops being an image and begins to feel like a person in the room.”</blockquote><p>Thalia’s work is grounded in direct observation and the physical ritual of making. Her portraits retain the traces of their construction — the searching line, mixed palette, unfinished edge, and layered brushstroke. Each work exists first as a tangible object, then as an accessible poster edition that carries its story into more homes.</p></section>
    <section className="profile-process"><div><p className="eyebrow">THE PRACTICE</p><h2>Evidence of<br/><i>the hand.</i></h2><p>From palette to final gesture, Thalia documents the real-time decisions behind each piece.</p></div><video src={media+processVideos[2]} controls playsInline preload="metadata"/><video src={media+processVideos[5]} controls playsInline preload="metadata"/></section>
    <section className="profile-work"><div className="section-title"><span><p className="eyebrow">AVAILABLE WORK</p><h2>Art by Thalia</h2></span><p>Collect as a print-ready poster edition,<br/>or acquire the signed original when available.</p></div><div className="profile-grid">{works.map((w,index)=><button key={w[0]} onClick={() => openArt(index)}><ArtImage src={w[4]} alt={`${w[0]} by Thalia Encarnado`}/><span className="caption"><span><strong>{w[0]}</strong><small>{w[2]} · Poster + original</small></span><b>{w[3]}</b></span><em>ORIGINAL AVAILABLE</em></button>)}</div></section>
    <section className="profile-follow"><ArtImage src={artImages[2]} alt="Thalia painting a portrait"/><div><p className="eyebrow">FOLLOW THE PROCESS</p><h2>See what<br/>comes next.</h2><p>New studies, works in progress, material experiments, and finished portraits from Thalia’s studio.</p><a href="https://instagram.com/thalia_nado" target="_blank" rel="noreferrer">Follow @thalia_nado on Instagram ↗</a></div></section>
    <Footer go={go}/>
  </main>
}
function Upload({ go }: { go: (v: View) => void }) {
  const [step, setStep] = useState(1),
    [done, setDone] = useState(false),
    [d, setD] = useState<Data>({
      title: "",
      medium: "",
      year: "",
      story: "",
      instagram: "",
      social: "",
      posterPrice: "12",
      originalPrice: "",
      sellOriginal: true,
    });
  const ready = useMemo(
    () =>
      step === 1
        ? !!(
            d.title &&
            d.medium &&
            d.year &&
            d.story.length > 20 &&
            d.posterPrice &&
            (!d.sellOriginal || d.originalPrice)
          )
        : step === 2
          ? !!d.instagram
          : !!(d.video && d.master && d.back),
    [step, d],
  );
  const field =
    (k: keyof Data) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setD({ ...d, [k]: e.target.value });
  const file = (k: keyof Data) => (e: ChangeEvent<HTMLInputElement>) =>
    setD({ ...d, [k]: e.target.files?.[0] });
  function next(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    step < 3 ? setStep(step + 1) : setDone(true);
  }
  if (done)
    return (
      <main className="success">
        <span>
          A<br />✓
        </span>
        <p className="eyebrow">SUBMISSION RECEIVED</p>
        <h1>
          Your work is
          <br />
          <i>ready for a wider wall.</i>
        </h1>
        <p>
          We’re preparing the poster editions, original listing, and your social
          proof kit.
        </p>
        <div>
          athalia.art/join?ref={d.instagram.replace("@", "")}{" "}
          <button
            onClick={() =>
              navigator.clipboard?.writeText(
                `athalia.art/join?ref=${d.instagram.replace("@", "")}`,
              )
            }
          >
            Copy
          </button>
        </div>
        <button className="black" onClick={() => go("home")}>
          Return to gallery
        </button>
      </main>
    );
  return (
    <main className="portal">
      <section className="portal-side">
        <button onClick={() => go("home")}>← Exit studio</button>
        <div>
          <p className="eyebrow">ARTIST STUDIO</p>
          <h1>
            One artwork.
            <br />
            <i>More ways to sell.</i>
          </h1>
          <p>
            Exhibit your practice, reach a global audience, sell poster editions
            at scale, and offer the signed original at your own price.
          </p>
        </div>
        <ol>
          {["The work & pricing", "Your practice", "Proof of hand"].map(
            (x, i) => (
              <li
                className={
                  step === i + 1 ? "active" : step > i + 1 ? "done" : ""
                }
                key={x}
              >
                <b>{step > i + 1 ? "✓" : `0${i + 1}`}</b>
                <span>
                  {x}
                  <small>
                    {i === 0
                      ? "Story, formats & value"
                      : i === 1
                        ? "Identity & audience"
                        : "Video & master files"}
                  </small>
                </span>
              </li>
            ),
          )}
        </ol>
      </section>
      <form onSubmit={next}>
        <div className="form-head">
          <span>0{step} / 03</span>
          <p>
            {step === 1
              ? "Choose how collectors can own it."
              : step === 2
                ? "Connect the maker to the work."
                : "The evidence is part of the art."}
          </p>
        </div>
        {step === 1 && (
          <div className="fields">
            <label>
              Title of work
              <input
                value={d.title}
                onChange={field("title")}
                placeholder="e.g. Resilience"
              />
            </label>
            <div className="split">
              <label>
                Medium
                <select value={d.medium} onChange={field("medium")}>
                  <option value="">Select</option>
                  <option>Oil</option>
                  <option>Acrylic</option>
                  <option>Watercolor</option>
                  <option>Mixed media</option>
                </select>
              </label>
              <label>
                Year created
                <input
                  type="number"
                  value={d.year}
                  onChange={field("year")}
                  placeholder="2026"
                />
              </label>
            </div>
            <label>
              The human narrative<small>What inspired this piece?</small>
              <textarea
                value={d.story}
                onChange={field("story")}
                placeholder="I began this piece when…"
              />
              <i>{d.story.length} / 600</i>
            </label>
            <div className="pricing-fields">
              <label>
                Poster edition base price (USD)
                <input
                  type="number"
                  min="1"
                  value={d.posterPrice}
                  onChange={field("posterPrice")}
                />
              </label>
              <label className="original-toggle">
                <input
                  type="checkbox"
                  checked={d.sellOriginal}
                  onChange={(e) =>
                    setD({ ...d, sellOriginal: e.target.checked })
                  }
                />
                <span>
                  <b>Also sell the physical original</b>
                  <small>One-off sale · you set the price</small>
                </span>
              </label>
              {d.sellOriginal && (
                <label>
                  Original artwork price (USD)
                  <input
                    type="number"
                    min="1"
                    value={d.originalPrice}
                    onChange={field("originalPrice")}
                    placeholder="e.g. 680"
                  />
                </label>
              )}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="fields">
            <label>
              Instagram handle
              <input
                value={d.instagram}
                onChange={field("instagram")}
                placeholder="@yourhandle"
              />
            </label>
            <label>
              TikTok or YouTube <small>Optional</small>
              <input
                value={d.social}
                onChange={field("social")}
                placeholder="@yourhandle or channel URL"
              />
            </label>
            <div className="note">
              <b>Built for discovery</b>
              <p>
                Your public artist page exhibits your work, process, story,
                poster editions, and available originals to collectors beyond
                your current following. We never require a follower minimum.
              </p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="fields">
            {(
              [
                [
                  "video",
                  "Raw process video",
                  "15–60 sec · MP4 or MOV · ambient sound on",
                  "video/*",
                ],
                [
                  "master",
                  "High-resolution master",
                  "4000px minimum short edge · 300 DPI",
                  "image/*",
                ],
                [
                  "back",
                  "Signed canvas back",
                  "Full backing visible · signature legible",
                  "image/*",
                ],
              ] as const
            ).map((x) => (
              <label className="upload" key={x[0]}>
                <input type="file" accept={x[3]} onChange={file(x[0])} />
                <b>{d[x[0]] ? "✓" : "↑"}</b>
                <span>
                  <strong>{d[x[0]]?.name || x[1]}</strong>
                  <small>{d[x[0]] ? "Ready" : x[2]}</small>
                </span>
                <em>{d[x[0]] ? "Replace" : "Choose file"}</em>
              </label>
            ))}
            <details>
              <summary>Filming & digitization standards ＋</summary>
              <p>
                Show hands mixing paint or adding brushstrokes. Keep ambient
                audio on and show one imperfection. Photograph the work parallel
                and in neutral, glare-free light.
              </p>
            </details>
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
          >
            ← Back
          </button>
          <button className="black" disabled={!ready}>
            {step === 3 ? "Submit for processing" : "Continue →"}
          </button>
        </div>
      </form>
    </main>
  );
}
function Footer({ go }: { go: (v: View) => void }) {
  return (
    <footer>
      <Logo />
      <p>Physical craft, preserved digitally.</p>
      <div>
        <button onClick={() => go("home")}>Collection</button>
        <button onClick={() => go("upload")}>Artist studio</button>
        <a className="mobile-artist-login" href="/studio">Artist login</a>
        <a href="mailto:studio@athalia.art">Contact</a>
      </div>
      <small>© 2026 ATHALIA · MANILA / EVERYWHERE</small>
    </footer>
  );
}
export default function Page() {
  const [view, setView] = useState<View>("home");
  const [artworkIndex,setArtworkIndex]=useState(0);
  const go=(next:View)=>{setView(next);requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"auto"}))};
  const openArt=(index:number)=>{setArtworkIndex(index);go("art")};
  return (
    <>
      <Header go={go} />
      {view === "home" ? (
        <Home go={go} openArt={openArt} />
      ) : view === "art" ? (
        <Art go={go} artworkIndex={artworkIndex} />
      ) : view === "artist" ? (
        <ArtistProfile go={go} openArt={openArt} />
      ) : (
        <Upload go={go} />
      )}
    </>
  );
}
