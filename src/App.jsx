import { useState } from 'react'

const MCU_MOVIES = [
  { title: "Iron Man", year: 2008, phase: 1, poster: "/A1oB9dMzRfRnPjuXACqHRYqHFuL.jpg" },
{ title: "The Incredible Hulk", year: 2008, phase: 1, poster: "/gKzYx79y0AQTL4UAk1cZNAs1jeW.jpg" },
{ title: "Iron Man 2", year: 2010, phase: 1, poster: "/6WBeq4fCfn7AN33GmGME0vWKRZH.jpg" },
{ title: "Thor", year: 2011, phase: 1, poster: "/bIuOWTtyFPjsFDevqvF3QnheVoO.jpg" },
{ title: "Captain America: The First Avenger", year: 2011, phase: 1, poster: "/vSNxAJTeplLKGVEq7RUoTTfDuea.jpg" },
{ title: "The Avengers", year: 2012, phase: 1, poster: "/RYMX2wcKCBAr24UyPD7KE3ro0Q.jpg" },
  { title: "Iron Man 3", year: 2013, phase: 2, poster: "/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg" },
  { title: "Thor: The Dark World", year: 2013, phase: 2, poster: "/bnOf9JMCqL4YxSJdUbCbJt3MNbh.jpg" },
  { title: "Captain America: The Winter Soldier", year: 2014, phase: 2, poster: "/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg" },
  { title: "Guardians of the Galaxy", year: 2014, phase: 2, poster: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg" },
  { title: "Avengers: Age of Ultron", year: 2015, phase: 2, poster: "/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg" },
  { title: "Ant-Man", year: 2015, phase: 2, poster: "/MgKiA4AhHwEHaDsMFSaEnbQz4M.jpg" },
  { title: "Captain America: Civil War", year: 2016, phase: 3, poster: "/rAGiXaUfDiy7JwDWNGD5hA2aFoG.jpg" },
  { title: "Doctor Strange", year: 2016, phase: 3, poster: "/uGulsIO8GqLpDFB21hpijfPXe3K.jpg" },
  { title: "Guardians of the Galaxy Vol. 2", year: 2017, phase: 3, poster: "/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg" },
  { title: "Spider-Man: Homecoming", year: 2017, phase: 3, poster: "/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg" },
  { title: "Thor: Ragnarok", year: 2017, phase: 3, poster: "/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg" },
  { title: "Black Panther", year: 2018, phase: 3, poster: "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg" },
  { title: "Avengers: Infinity War", year: 2018, phase: 3, poster: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" },
  { title: "Ant-Man and the Wasp", year: 2018, phase: 3, poster: "/eivQmP8ysRTrDUJg3BNnkBxCNBj.jpg" },
  { title: "Captain Marvel", year: 2019, phase: 3, poster: "/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg" },
  { title: "Avengers: Endgame", year: 2019, phase: 3, poster: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
  { title: "Spider-Man: Far From Home", year: 2019, phase: 3, poster: "/lcq8dVxeeOqHvvgcte707K0KVx5.jpg" },
  { title: "Black Widow", year: 2021, phase: 4, poster: "/qAZ0pzat24kLdtLTTLmNMQOaLFu.jpg" },
  { title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, phase: 4, poster: "/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg" },
  { title: "Eternals", year: 2021, phase: 4, poster: "/6LaqAlIpZjnIO19MB1q9VtSFVsN.jpg" },
  { title: "Spider-Man: No Way Home", year: 2021, phase: 4, poster: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" },
  { title: "Doctor Strange in the Multiverse of Madness", year: 2022, phase: 4, poster: "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg" },
  { title: "Thor: Love and Thunder", year: 2022, phase: 4, poster: "/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg" },
  { title: "Black Panther: Wakanda Forever", year: 2022, phase: 4, poster: "/sv1xJUazXoQuIDtiiz8746tqL9R.jpg" },
  { title: "Ant-Man and the Wasp: Quantumania", year: 2023, phase: 5, poster: "/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg" },
  { title: "Guardians of the Galaxy Vol. 3", year: 2023, phase: 5, poster: "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" },
  { title: "The Marvels", year: 2023, phase: 5, poster: "/Ag3D9qXjhJ2FUkrlJ0Cv1pgxqYQ.jpg" },
  { title: "Captain America: Brave New World", year: 2025, phase: 5, poster: "/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg" },
  { title: "Thunderbolts*", year: 2025, phase: 5, poster: "/m9EtP5J8bMZFZoNwOFibZ6ULLMU.jpg" },
  { title: "The Fantastic Four: First Steps", year: 2025, phase: 6, poster: "/9mNBPCWv5aFnVMxSHBqpWXFrBRf.jpg" },
  { title: "Spider-Man: Brand New Day", year: 2026, phase: 6, poster: null },
]

const PHASE_META = {
  1: { label: "Phase 1 — The Infinity Saga", color: "#C2853A" },
  2: { label: "Phase 2 — The Infinity Saga", color: "#9B6DD4" },
  3: { label: "Phase 3 — The Infinity Saga", color: "#4A90D9" },
  4: { label: "Phase 4 — The Multiverse Saga", color: "#3DAB7A" },
  5: { label: "Phase 5 — The Multiverse Saga", color: "#D4547E" },
  6: { label: "Phase 6 — The Multiverse Saga", color: "#CC4444" },
}

const TMDB_IMG = "https://image.tmdb.org/t/p/w342"
const SB_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY || ""

async function sbSave(id, watchedVal, ratingVal) {
  if (!SB_URL || !SB_KEY) return
  try {
    await fetch(`${SB_URL}/rest/v1/marvel_tracker`, {
      method: "POST",
      headers: {
        "apikey": SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify({ id, watched: watchedVal, rating: ratingVal || null }),
    })
  } catch (e) {}
}

async function sbLoad() {
  if (!SB_URL || !SB_KEY) return null
  try {
    const res = await fetch(`${SB_URL}/rest/v1/marvel_tracker?select=*`, {
      headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
    })
    if (res.ok) return res.json()
  } catch (e) {}
  return null
}

export default function App() {
  const [watched, setWatched] = useState({})
  const [ratings, setRatings] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(null)
  const [filter, setFilter] = useState("all")

  useState(() => {
    sbLoad().then(data => {
      if (data) {
        const w = {}, r = {}
        data.forEach(row => { w[row.id] = row.watched; if (row.rating) r[row.id] = row.rating })
        setWatched(w); setRatings(r)
      }
      setLoaded(true)
    })
  }, [])

  async function toggleWatched(movie) {
    const key = movie.title
    const newVal = !watched[key]
    setWatched(p => ({ ...p, [key]: newVal }))
    setSaving(key)
    await sbSave(key, newVal, ratings[key])
    setSaving(null)
  }

  async function setRating(movie, val, e) {
    e.stopPropagation()
    const key = movie.title
    const r = ratings[key] === val ? null : val
    setRatings(p => ({ ...p, [key]: r }))
    setSaving(key)
    await sbSave(key, watched[key] || false, r)
    setSaving(null)
  }

  const filtered = MCU_MOVIES.filter(m =>
    filter === "all" ? true : filter === "watched" ? watched[m.title] : !watched[m.title]
  )
  const watchedCount = MCU_MOVIES.filter(m => watched[m.title]).length
  const pct = Math.round((watchedCount / MCU_MOVIES.length) * 100)

  const byPhase = [1,2,3,4,5,6].map(ph => ({
    phase: ph,
    movies: filtered.filter(m => m.phase === ph),
    total: MCU_MOVIES.filter(m => m.phase === ph).length,
    done: MCU_MOVIES.filter(m => m.phase === ph && watched[m.title]).length,
  })).filter(p => p.movies.length > 0)

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#E24B4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#f0f0f0" }}>Marvel Watch Tracker</p>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{watchedCount}/{MCU_MOVIES.length} watched · {MCU_MOVIES.length - watchedCount} to go before Doomsday</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all","watched","unwatched"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "6px 14px", fontSize: 13, background: filter === f ? "#222" : "transparent", color: filter === f ? "#f0f0f0" : "#888", border: `1px solid ${filter === f ? "#444" : "#2a2a2a"}`, borderRadius: 20, cursor: "pointer", fontWeight: filter === f ? 500 : 400, transition: "all 0.15s" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#888" }}>Overall progress</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f0" }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#3DAB7A" : "#E24B4A", borderRadius: 3, transition: "width 0.5s ease" }} />
        </div>
        {SB_KEY && <p style={{ fontSize: 12, color: "#3DAB7A", margin: "6px 0 0" }}>✓ Synced to Supabase</p>}
      </div>

      {byPhase.map(({ phase, movies, total, done }) => {
        const meta = PHASE_META[phase]
        const phasePct = Math.round((done / total) * 100)
        return (
          <div key={phase} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: 10, borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: meta.color }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#d0d0d0" }}>{meta.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 60, height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${phasePct}%`, background: meta.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 12, color: "#666" }}>{done}/{total}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
              {movies.map(movie => {
                const isWatched = watched[movie.title]
                const rating = ratings[movie.title]
                const isSaving = saving === movie.title
                return (
                  <div key={movie.title}
                    onClick={() => toggleWatched(movie)}
                    style={{ borderRadius: 10, overflow: "hidden", border: isWatched ? `1.5px solid ${meta.color}55` : "1px solid #1e1e1e", background: "#111", cursor: "pointer", transition: "transform 0.15s ease", display: "flex", flexDirection: "column" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    <div style={{ position: "relative", aspectRatio: "2/3", background: "#1a1a1a", overflow: "hidden" }}>
                      {movie.poster ? (
                        <img src={`${TMDB_IMG}${movie.poster}`} alt={movie.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center" }}>
                          <span style={{ fontSize: 11, color: "#555", lineHeight: 1.3 }}>{movie.title}</span>
                        </div>
                      )}
                      {isWatched && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: meta.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        </div>
                      )}
                      {isSaving && <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#F59E0B" }} />}
                    </div>
                    <div style={{ padding: "9px 10px 11px" }}>
                      <p style={{ fontSize: 11, fontWeight: 500, margin: "0 0 2px", lineHeight: 1.3, color: "#e0e0e0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{movie.title}</p>
                      <p style={{ fontSize: 10, color: "#555", margin: "0 0 7px" }}>{movie.year}</p>
                      {isWatched ? (
                        <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} onClick={e => setRating(movie, s, e)}
                              style={{ fontSize: 13, cursor: "pointer", color: rating >= s ? meta.color : "#333", userSelect: "none" }}>★</span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 10, color: "#444", margin: 0 }}>click to mark watched</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <p style={{ fontSize: 11, color: "#333", textAlign: "center", marginTop: "1rem" }}>
        Poster images via The Movie Database (TMDB)
      </p>
    </div>
  )
}
