"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { hasSupabase, supabase } from "@/lib/supabase";

type Profile = {
  display_name: string;
  slug: string;
  bio: string;
  artist_statement: string;
  instagram: string;
  social_url: string;
  location: string;
  practice: string;
  avatar_url: string;
  cover_url: string;
  is_public: boolean;
};
type ArtworkDraft = {
  id: string;
  title: string;
  medium: string;
  year: string;
  narrative: string;
  poster_price: string;
  poster_price_medium: string;
  poster_price_large: string;
  original_price: string;
  sell_original: boolean;
  image_url: string;
  thumbnail_urls: string[];
  backing_url: string;
  process_video_url: string;
  status: "draft" | "published";
};
const initial: Profile = {
  display_name: "Thalia Encarnado",
  slug: "thalia-encarnado",
  bio: "A figurative artist exploring presence, character, and the quiet psychology of portraiture.",
  artist_statement:
    "I’m drawn to the point where a portrait stops being an image and begins to feel like a person in the room.",
  instagram: "@thalia_nado",
  social_url: "",
  location: "Manila, Philippines",
  practice: "Figurative painting & drawing",
  avatar_url: "/media/Screenshot_20260712_164126.jpg",
  cover_url: "/media/Screenshot_20260712_165108.jpg",
  is_public: true,
};
const initialArtworks: ArtworkDraft[] = [
  {id:"halo-garden",title:"Halo Garden",medium:"Mixed media on canvas",year:"2026",narrative:"A portrait held inside a garden of hand-painted pattern, memory, and ornament.",poster_price:"14",poster_price_medium:"22",poster_price_large:"30",original_price:"740",sell_original:true,image_url:"/media/poster-halo-garden.jpg",thumbnail_urls:["/media/Screenshot_20260712_164157.jpg"],backing_url:"",process_video_url:"/media/video_20260712_165645_edit.mp4",status:"published"},
  {id:"old-soul",title:"Old Soul Study",medium:"Graphite & white pastel",year:"2026",narrative:"A quiet study of age, memory, and the landscape held in a human face.",poster_price:"10",poster_price_medium:"18",poster_price_large:"26",original_price:"240",sell_original:true,image_url:"/media/poster-old-soul.jpg",thumbnail_urls:["/media/Screenshot_20260712_170054.jpg"],backing_url:"",process_video_url:"/media/video_20260712_165925_edit.mp4",status:"published"},
];
const blankArtwork:ArtworkDraft={id:"",title:"",medium:"",year:new Date().getFullYear().toString(),narrative:"",poster_price:"12",poster_price_medium:"20",poster_price_large:"28",original_price:"",sell_original:true,image_url:"",thumbnail_urls:[],backing_url:"",process_video_url:"",status:"draft"};

export default function Studio() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null),
    [authReady, setAuthReady] = useState(false),
    [email, setEmail] = useState("artist@athalia.test"),
    [password, setPassword] = useState("Athalia2026!"),
    [mode, setMode] = useState<"login" | "signup">("login"),
    [profile, setProfile] = useState(initial),
    [saved, setSaved] = useState(false),
    [error, setError] = useState(""),
    [tab, setTab] = useState<"profile" | "portfolio" | "artworks">("profile"),
    [artworks,setArtworks]=useState<ArtworkDraft[]>(initialArtworks),
    [artwork,setArtwork]=useState<ArtworkDraft>(blankArtwork);
  useEffect(() => {
    if (!supabase) {
      const logged = localStorage.getItem("athalia-demo-session");
      if (logged) setUser({ id: "demo", email: logged });
      const stored = localStorage.getItem("athalia-artist-profile");
      if (stored) setProfile(JSON.parse(stored));
      const storedArtworks=localStorage.getItem("athalia-artist-artworks");
      if(storedArtworks)setArtworks(JSON.parse(storedArtworks).map((item:ArtworkDraft)=>({...blankArtwork,...item,thumbnail_urls:item.thumbnail_urls||[]})));
      setAuthReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email });
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) =>
      setUser(s?.user ? { id: s.user.id, email: s.user.email } : null),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("artist_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({ ...initial, ...data });
      });
    supabase.from("artworks").select("*").eq("artist_id",user.id).order("created_at",{ascending:false}).then(({data})=>{
      if(data)setArtworks(data.map(item=>({...blankArtwork,id:item.id,title:item.title,medium:item.medium,year:String(item.year_created),narrative:item.narrative,poster_price:String(item.poster_base_price_cents/100),original_price:item.original_price_cents?String(item.original_price_cents/100):"",sell_original:item.original_for_sale,image_url:item.master_path||"",process_video_url:item.process_video_path||"",status:item.status==="published"?"published":"draft"})));
    });
  }, [user]);
  async function authenticate(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!hasSupabase) {
      localStorage.setItem(
        "athalia-demo-session",
        email || "artist@athalia.art",
      );
      setUser({ id: "demo", email: email || "artist@athalia.art" });
      return;
    }
    const result =
      mode === "login"
        ? await supabase!.auth.signInWithPassword({ email, password })
        : await supabase!.auth.signUp({ email, password });
    if (result.error) setError(result.error.message);
    else if (result.data.user)
      setUser({ id: result.data.user.id, email: result.data.user.email });
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!supabase) {
      localStorage.setItem("athalia-artist-profile", JSON.stringify(profile));
      setSaved(true);
      return;
    }
    const { error } = await supabase
      .from("artist_profiles")
      .upsert({
        id: user!.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    if (error) setError(error.message);
    else setSaved(true);
  }
  async function upload(
    kind: "avatar_url" | "cover_url",
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!supabase) {
      const reader = new FileReader();
      reader.onload = () =>
        setProfile({ ...profile, [kind]: reader.result as string });
      reader.readAsDataURL(file);
      return;
    }
    const path = `${user!.id}/${kind}-${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "-")}`;
    const { error } = await supabase.storage
      .from("artist-public")
      .upload(path, file, { upsert: true });
    if (error) {
      setError(error.message);
      return;
    }
    const { data } = supabase.storage.from("artist-public").getPublicUrl(path);
    setProfile({ ...profile, [kind]: data.publicUrl });
  }
  function artworkFile(kind:"image_url"|"backing_url"|"process_video_url",e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>setArtwork({...artwork,[kind]:reader.result as string});reader.readAsDataURL(file);
  }
  function artworkThumbnails(e:ChangeEvent<HTMLInputElement>){
    const files=Array.from(e.target.files||[]).slice(0,6);if(!files.length)return;
    Promise.all(files.map(file=>new Promise<string>(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result as string);reader.readAsDataURL(file)}))).then(urls=>setArtwork({...artwork,thumbnail_urls:[...artwork.thumbnail_urls,...urls].slice(0,6)}));
  }
  async function saveArtwork(e:FormEvent){
    e.preventDefault();setError("");setSaved(false);
    const next={...artwork,id:artwork.id||crypto.randomUUID()};
    const updated=artworks.some(a=>a.id===next.id)?artworks.map(a=>a.id===next.id?next:a):[...artworks,next];
    setArtworks(updated);setArtwork(next);
    if(!supabase){localStorage.setItem("athalia-artist-artworks",JSON.stringify(updated));setSaved(true);return}
    const {error}=await supabase.from("artworks").upsert({id:next.id,artist_id:user!.id,title:next.title,medium:next.medium,year_created:Number(next.year),narrative:next.narrative,poster_base_price_cents:Number(next.poster_price)*100,original_for_sale:next.sell_original,original_price_cents:next.sell_original?Number(next.original_price)*100:null,status:next.status});
    if(error)setError(error.message);else setSaved(true);
  }
  function editArtwork(item:ArtworkDraft){setArtwork(item);setTab("artworks");window.scrollTo({top:0,behavior:"smooth"})}
  function newArtwork(){setArtwork({...blankArtwork});setTab("artworks");window.scrollTo({top:0,behavior:"smooth"})}
  async function logout() {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("athalia-demo-session");
    setUser(null);
  }
  if (!authReady)
    return <main className="studio-loading">Opening your studio…</main>;
  if (!user)
    return (
      <main className="studio-auth">
        <section>
          <a href="/" className="studio-logo">
            A<small>THALIA</small>
          </a>
          <div>
            <p className="eyebrow">PRIVATE ARTIST STUDIO</p>
            <h1>
              Welcome back
              <br />
              to your <i>practice.</i>
            </h1>
            <p>
              Manage your public profile, artwork, poster editions, originals,
              and the story collectors see.
            </p>
          </div>
          <small>
            {hasSupabase
              ? "Secure artist authentication"
              : "Demo mode · connect Supabase for production accounts"}
          </small>
        </section>
        <form onSubmit={authenticate}>
          <p className="eyebrow">
            {mode === "login" ? "ARTIST LOGIN" : "CREATE ARTIST ACCOUNT"}
          </p>
          <h2>
            {mode === "login" ? "Enter your studio" : "Begin your profile"}
          </h2>
          {mode === "login" && !hasSupabase && <div className="test-login"><p className="eyebrow">TEST ARTIST LOGIN</p><button type="button" onClick={()=>{setEmail("artist@athalia.test");setPassword("Athalia2026!")}}><span><b>artist@athalia.test</b><small>Password: Athalia2026!</small></span><em>Use credentials →</em></button></div>}
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </label>
          {error && <p className="studio-error">{error}</p>}
          <button className="studio-primary">
            {mode === "login" ? "Log in →" : "Create account →"}
          </button>
          <button
            type="button"
            className="studio-switch"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login"
              ? "New to ATHALIA? Create an account"
              : "Already have an account? Log in"}
          </button>
        </form>
      </main>
    );
  return (
    <main className="dashboard">
      <aside>
        <a href="/" className="studio-logo">
          A<small>THALIA</small>
        </a>
        <div className="studio-user">
          <span>{profile.display_name.charAt(0) || "A"}</span>
          <p>
            {profile.display_name}
            <small>{user.email}</small>
          </p>
        </div>
        <nav>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
          >
            Profile & story
          </button>
          <button
            className={tab === "portfolio" ? "active" : ""}
            onClick={() => setTab("portfolio")}
          >
            Portfolio images
          </button>
          <button className={tab === "artworks" ? "active" : ""} onClick={()=>setTab("artworks")}>Artworks & pricing</button>
          <a href="/">View marketplace ↗</a>
        </nav>
        <button className="logout" onClick={logout}>
          Sign out
        </button>
      </aside>
      <section className="dashboard-main">
        <header>
          <div>
            <p className="eyebrow">ARTIST STUDIO</p>
            <h1>
              {tab === "profile" ? "Your public profile" : tab === "portfolio" ? "Your visual portfolio" : artwork.id ? `Edit ${artwork.title}` : "Add a new artwork"}
            </h1>
          </div>
          <span className={profile.is_public ? "live" : "draft"}>
            ● {profile.is_public ? "Profile live" : "Profile hidden"}
          </span>
        </header>
        {tab === "profile" ? (
          <form className="profile-editor" onSubmit={save}>
            <div className="editor-section">
              <div>
                <h2>Identity</h2>
                <p>The essentials shown at the top of your artist page. Use simple words. English does not need to be perfect.</p>
                <div className="guide-card"><b>Writing cue</b><p>Practice = what you make + your main material.</p><small>Example: “Portrait painting in oil and charcoal”</small></div>
              </div>
              <div className="editor-fields">
                <label>
                  Display name
                  <input
                    value={profile.display_name}
                    onChange={(e) =>
                      setProfile({ ...profile, display_name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Profile URL<span>athalia.art/artists/</span>
                  <input
                    value={profile.slug}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                  />
                </label>
                <div className="editor-split">
                  <label>
                    Based in
                    <input
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Practice
                    <input
                      value={profile.practice}
                      onChange={(e) =>
                        setProfile({ ...profile, practice: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  Instagram
                  <input
                    value={profile.instagram}
                    onChange={(e) =>
                      setProfile({ ...profile, instagram: e.target.value })
                    }
                  />
                </label>
                <label>
                  Website or other social <small>Optional</small>
                  <input
                    value={profile.social_url}
                    onChange={(e) =>
                      setProfile({ ...profile, social_url: e.target.value })
                    }
                  />
                </label>
              </div>
            </div>
            <div className="editor-section">
              <div>
                <h2>About your practice</h2>
                <p>
                  Give collectors a reason to remember the human behind the
                  work.
                </p>
                <div className="guide-card"><b>Easy formula</b><p>1. What do you make? 2. What inspires you? 3. What should people feel?</p><small>Short, honest sentences work best. Write in your language first, then translate.</small></div>
              </div>
              <div className="editor-fields">
                <label>
                  Short biography
                  <span className="field-cue">Write 2–3 sentences: your location, art form, subjects, and inspiration.</span>
                  <textarea
                    value={profile.bio}
                    maxLength={360}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                  <small>{profile.bio.length}/360</small>
                  <button type="button" className="example-copy" onClick={()=>setProfile({...profile,bio:`${profile.display_name} is an artist based in ${profile.location}, working in ${profile.practice.toLowerCase()}. Their work explores people, memory, and the stories held in everyday life.`})}>Use suggested structure</button>
                </label>
                <label>
                  Artist statement
                  <span className="field-cue">Explain why you make art, how you work, and what makes the work personal.</span>
                  <textarea
                    className="tall"
                    value={profile.artist_statement}
                    maxLength={800}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        artist_statement: e.target.value,
                      })
                    }
                  />
                  <small>{profile.artist_statement.length}/800</small>
                  <button type="button" className="example-copy" onClick={()=>setProfile({...profile,artist_statement:"I begin each work with observation and build it slowly by hand. I am interested in the emotions that appear through color, texture, and small imperfections. I hope each piece gives the viewer space to remember something from their own life."})}>Insert example to edit</button>
                </label>
              </div>
            </div>
            <div className="visibility">
              <label>
                <input
                  type="checkbox"
                  checked={profile.is_public}
                  onChange={(e) =>
                    setProfile({ ...profile, is_public: e.target.checked })
                  }
                />
                <span>
                  <b>Publish my artist page</b>
                  <small>
                    Collectors can discover your profile and available work.
                  </small>
                </span>
              </label>
            </div>
            <div className="save-bar">
              {saved && <span>✓ Changes saved</span>}
              {error && <span className="studio-error">{error}</span>}
              <button className="studio-primary">Save profile</button>
            </div>
          </form>
        ) : tab === "portfolio" ? (
          <form className="portfolio-editor" onSubmit={save}>
            <div className="image-editor">
              <div>
                <h2>Profile image</h2>
                <p>
                  A clear portrait or studio image. Portrait crop recommended.
                </p>
                <div className="media-spec"><b>Profile image requirements</b><span>JPG, PNG, or WebP</span><span>Minimum 1200 × 1500 px</span><span>Maximum 10 MB · vertical 4:5</span><small>Use natural light. Show your face clearly. Avoid filters and text.</small></div>
                <label className="image-upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => upload("avatar_url", e)}
                  />
                  <img src={profile.avatar_url} alt="Current artist profile" />
                  <span>Replace image ↑</span>
                </label>
              </div>
              <div>
                <h2>Cover image</h2>
                <p>
                  Show your work, environment, or process in a wide editorial
                  image.
                </p>
                <div className="media-spec"><b>Cover image requirements</b><span>JPG, PNG, or WebP</span><span>Minimum 2000 × 1200 px</span><span>Maximum 10 MB · horizontal 5:3</span><small>Show your studio, materials, or one strong artwork with space around it.</small></div>
                <label className="image-upload cover">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => upload("cover_url", e)}
                  />
                  <img src={profile.cover_url} alt="Current artist cover" />
                  <span>Replace image ↑</span>
                </label>
              </div>
            </div>
            <div className="portfolio-note">
              <b>Artwork portfolio</b>
              <p>
                Artwork images and poster listings are managed from each artwork
                submission. Your published work automatically appears on your
                profile page.
              </p>
              <button type="button" onClick={newArtwork}>Submit another artwork →</button>
            </div>
            <div className="save-bar">
              {saved && <span>✓ Images saved</span>}
              <button className="studio-primary">Save images</button>
            </div>
          </form>
        ) : (
          <form className="artwork-editor" onSubmit={saveArtwork}>
            <div className="artwork-list-head"><div><h2>Your artworks</h2><p>Edit an existing listing or build a new one using the guide.</p></div><button type="button" className="studio-secondary" onClick={newArtwork}>＋ New artwork</button></div>
            <div className="artwork-list">{artworks.map(item=><button type="button" key={item.id} className={artwork.id===item.id?"active":""} onClick={()=>editArtwork(item)}>{item.image_url?<img src={item.image_url} alt=""/>:<span/>}<p><b>{item.title}</b><small>{item.status} · Poster ${item.poster_price}{item.sell_original?` · Original $${item.original_price}`:""}</small></p><em>Edit →</em></button>)}</div>
            <div className="editor-section artwork-basics"><div><p className="eyebrow">01 · THE WORK</p><h2>Name and describe it</h2><p>Simple English is best. You can write your first draft in your own language, then use the sentence cues.</p><div className="guide-card"><b>Story formula</b><p>“I created this work when… It explores… I used… I hope the viewer feels…”</p></div></div><div className="editor-fields"><label>Artwork title<span className="field-cue">Choose 1–5 memorable words. A feeling, place, person, or moment works well.</span><input required value={artwork.title} onChange={e=>setArtwork({...artwork,title:e.target.value})} placeholder="Example: Halo Garden"/></label><div className="editor-split"><label>Medium<input required value={artwork.medium} onChange={e=>setArtwork({...artwork,medium:e.target.value})} placeholder="Oil on canvas"/></label><label>Year created<input required type="number" value={artwork.year} onChange={e=>setArtwork({...artwork,year:e.target.value})}/></label></div><label>Human narrative<span className="field-cue">Write 2–4 sentences about the real moment, idea, material, or person behind this work.</span><textarea className="tall" required minLength={30} maxLength={700} value={artwork.narrative} onChange={e=>setArtwork({...artwork,narrative:e.target.value})} placeholder="I began this work after…"/><small>{artwork.narrative.length}/700</small><button type="button" className="example-copy" onClick={()=>setArtwork({...artwork,narrative:"I created this work while thinking about memory and the people who shape us. I built it slowly by hand, allowing the marks and changes to remain visible. I hope it gives the viewer a quiet moment to connect with their own story."})}>Insert an example to edit</button></label></div></div>
            <div className="editor-section"><div><p className="eyebrow">02 · HOW IT CAN BE OWNED</p><h2>Set your prices</h2><p>Offer downloadable poster sizes, the one-off physical original, or both.</p><div className="guide-card"><b>Pricing cue</b><p>Poster downloads often begin at $10–$25. Consider time, materials, size, experience, and shipping when pricing the original.</p></div></div><div className="editor-fields"><div className="price-size-grid"><label>12 × 18 in (USD)<input required type="number" min="1" value={artwork.poster_price} onChange={e=>setArtwork({...artwork,poster_price:e.target.value})}/></label><label>16 × 24 in (USD)<input required type="number" min="1" value={artwork.poster_price_medium} onChange={e=>setArtwork({...artwork,poster_price_medium:e.target.value})}/></label><label>24 × 36 in (USD)<input required type="number" min="1" value={artwork.poster_price_large} onChange={e=>setArtwork({...artwork,poster_price_large:e.target.value})}/></label></div><span className="field-cue">Each purchase includes the correct 2:3, 3:4, 4:5, or ISO print-ready file for the selected size.</span><label className="original-toggle"><input type="checkbox" checked={artwork.sell_original} onChange={e=>setArtwork({...artwork,sell_original:e.target.checked})}/><span><b>Also sell the physical original</b><small>Only one collector can purchase it.</small></span></label>{artwork.sell_original&&<label>Original artwork price (USD)<input required type="number" min="1" value={artwork.original_price} onChange={e=>setArtwork({...artwork,original_price:e.target.value})}/></label>}</div></div>
            <div className="editor-section"><div><p className="eyebrow">03 · IMAGES & PROOF</p><h2>Show the real work</h2><p>Clear, honest media builds collector trust and helps us prepare accurate poster files.</p></div><div className="guided-uploads"><label className="guided-upload"><input type="file" accept="image/jpeg,image/png,image/webp,image/tiff" onChange={e=>artworkFile("image_url",e)}/>{artwork.image_url?<img src={artwork.image_url} alt="Artwork preview"/>:<span className="upload-placeholder">↑</span>}<div><b>Master artwork image</b><span>JPG, PNG, WebP, or TIFF</span><span>Minimum 4000 px shortest edge · 300 DPI target</span><span>Maximum 50 MB · camera parallel to artwork</span><small>Used for poster downloads. Use neutral daylight, no glare, no frame, and crop to the artwork edges.</small></div></label><label className="guided-upload gallery-upload"><input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={artworkThumbnails}/><span className="upload-placeholder">＋</span><div><b>Supporting gallery thumbnails ({artwork.thumbnail_urls.length}/6)</b><span>Upload up to 6 JPG, PNG, or WebP images</span><span>Minimum 1200 px wide · maximum 10 MB each</span><small>Add a room view, texture close-up, side angle, scale reference, and detail. These appear below the main product image.</small></div></label>{artwork.thumbnail_urls.length>0&&<div className="thumbnail-manager">{artwork.thumbnail_urls.map((url,i)=><figure key={i}><img src={url} alt={`Supporting artwork view ${i+1}`}/><button type="button" onClick={()=>setArtwork({...artwork,thumbnail_urls:artwork.thumbnail_urls.filter((_,n)=>n!==i)})}>Remove</button></figure>)}</div>}<label className="guided-upload"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>artworkFile("backing_url",e)}/>{artwork.backing_url?<img src={artwork.backing_url} alt="Signed artwork backing"/>:<span className="upload-placeholder">✎</span>}<div><b>Signed back of the original</b><span>JPG, PNG, or WebP · minimum 1600 px wide</span><span>Maximum 10 MB · signature must be readable</span><small>Show the entire back, frame corners, and your ink signature. This supports physical provenance.</small></div></label><label className="guided-upload"><input type="file" accept="video/mp4,video/quicktime" onChange={e=>artworkFile("process_video_url",e)}/>{artwork.process_video_url?<video src={artwork.process_video_url} muted playsInline/>:<span className="upload-placeholder">▶</span>}<div><b>Raw process video</b><span>MP4 or MOV · H.264 recommended</span><span>15–60 seconds · vertical or square</span><span>1080 × 1080 or 1080 × 1920 · maximum 200 MB</span><small>Show hands, tools, brushwork, and ambient sound. Avoid polished time-lapses.</small></div></label><div className="media-checklist"><b>Before publishing</b><span>□ Master artwork image added</span><span>□ At least 2 supporting thumbnails added</span><span>□ Signed artwork back is clearly visible</span><span>□ Process video includes hands and ambient sound</span><span>□ Poster and original prices are correct</span></div></div></div>
            <div className="visibility"><label><input type="checkbox" checked={artwork.status==="published"} onChange={e=>setArtwork({...artwork,status:e.target.checked?"published":"draft"})}/><span><b>Publish this artwork</b><small>It will appear on your public artist profile and in the collection.</small></span></label></div>
            <div className="save-bar">{saved&&<span>✓ Artwork saved</span>}{error&&<span className="studio-error">{error}</span>}<button className="studio-primary">Save artwork</button></div>
          </form>
        )}
      </section>
    </main>
  );
}
