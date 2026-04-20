import { useState, useEffect } from 'react'

const MCU_MOVIES = [
  { title: "Iron Man", year: 2008, phase: 1, tmdbId: 1726 },
  { title: "The Incredible Hulk", year: 2008, phase: 1, tmdbId: 1724 },
  { title: "Iron Man 2", year: 2010, phase: 1, tmdbId: 10138 },
  { title: "Thor", year: 2011, phase: 1, tmdbId: 10195 },
  { title: "Captain America: The First Avenger", year: 2011, phase: 1, tmdbId: 1771 },
  { title: "The Avengers", year: 2012, phase: 1, tmdbId: 24428 },
  { title: "Iron Man 3", year: 2013, phase: 2, tmdbId: 68721 },
  { title: "Thor: The Dark World", year: 2013, phase: 2, tmdbId: 76338 },
  { title: "Captain America: The Winter Soldier", year: 2014, phase: 2, tmdbId: 100402 },
  { title: "Guardians of the Galaxy", year: 2014, phase: 2, tmdbId: 118340 },
  { title: "Avengers: Age of Ultron", year: 2015, phase: 2, tmdbId: 99861 },
  { title: "Ant-Man", year: 2015, phase: 2, tmdbId: 102899 },
  { title: "Captain America: Civil War", year: 2016, phase: 3, tmdbId: 271110 },
  { title: "Doctor Strange", year: 2016, phase: 3, tmdbId: 284052 },
  { title: "Guardians of the Galaxy Vol. 2", year: 2017, phase: 3, tmdbId: 283995 },
  { title: "Spider-Man: Homecoming", year: 2017, phase: 3, tmdbId: 315635 },
  { title: "Thor: Ragnarok", year: 2017, phase: 3, tmdbId: 284053 },
  { title: "Black Panther", year: 2018, phase: 3, tmdbId: 284054 },
  { title: "Avengers: Infinity War", year: 2018, phase: 3, tmdbId: 299536 },
  { title: "Ant-Man and the Wasp", year: 2018, phase: 3, tmdbId: 363088 },
  { title: "Captain Marvel", year: 2019, phase: 3, tmdbId: 299537 },
  { title: "Avengers: Endgame", year: 2019, phase: 3, tmdbId: 299534 },
  { title: "Spider-Man: Far From Home", year: 2019, phase: 3, tmdbId: 429617 },
  { title: "Black Widow", year: 2021, phase: 4, tmdbId: 497698 },
  { title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, phase: 4, tmdbId: 566525 },
  { title: "Eternals", year: 2021, phase: 4, tmdbId: 524434 },
  { title: "Spider-Man: No Way Home", year: 2021, phase: 4, tmdbId: 634649 },
  { title: "Doctor Strange in the Multiverse of Madness", year: 2022, phase: 4, tmdbId: 453395 },
  { title: "Thor: Love and Thunder", year: 2022, phase: 4, tmdbId: 616037 },
  { title: "Black Panther: Wakanda Forever", year: 2022, phase: 4, tmdbId: 505642 },
  { title: "Ant-Man and the Wasp: Quantumania", year: 2023, phase: 5, tmdbId: 640146 },
  { title: "Guardians of the Galaxy Vol. 3", year: 2023, phase: 5, tmdbId: 447365 },
  { title: "The Marvels", year: 2023, phase: 5, tmdbId: 609681 },
  { title: "Captain America: Brave New World", year: 2025, phase: 5, tmdbId: 822119 },
  { title: "Thunderbolts*", year: 2025, phase: 5, tmdbId: 986056 },
  { title: "The Fantastic Four: First Steps", year: 2025, phase: 6, tmdbId: 617126 },
  { title: "Spider-Man: Brand New Day", year: 2026, phase: 6, tmdbId: 969681 },
]

const PHASE_META = {
  1: { label: "Phase 1", saga: "The Infinity Saga" },
  2: { label: "Phase 2", saga: "The Infinity Saga" },
  3: { label: "Phase 3", saga: "The Infinity Saga" },
  4: { label: "Phase 4", saga: "The Multiverse Saga" },
  5: { label: "Phase 5", saga: "The Multiverse Saga" },
  6: { label: "Phase 6", saga: "The Multiverse Saga" },
}

const TMDB_IMG = "https://image.tmdb.org/t/p/w342"
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || ""
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

export default function App() {
  const [watched, setWatched] = useState({})
  const [ratings, setRatings] = useState({})
  const [saving, setSaving] = useState(null)
  const [filter, setFilter] = useState("all")
  const [posters, setPosters] = useState({})

  // Load Supabase data
  useEffect(() => {
    if (!SB_URL || !SB_KEY) return
    fetch(`${SB_URL}/rest/v1/marvel_tracker?select=*`, {
      headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (!data) return
      const w = {}, r = {}
      data.forEach(row => { w[row.id] = row.watched; if (row.rating) r[row.id] = row.rating })
      setWatched(w); setRatings(r)
    }).catch(() => {})
  }, [])

  // Fetch posters from TMDB
  useEffect(() => {
    if (!TMDB_KEY) {
      console.warn('VITE_TMDB_KEY is not set — posters will not load')
      return
    }
    const fetchAll = async () => {
      for (let i = 0; i < MCU_MOVIES.length; i += 6) {
        const batch = MCU_MOVIES.slice(i, i + 6)
        const results = {}
        await Promise.all(batch.map(async m => {
          try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${m.tmdbId}?api_key=${TMDB_KEY}`)
            if (res.ok) {
              const d = await res.json()
              if (d.poster_path) results[m.tmdbId] = d.poster_path
            }
          } catch (e) {}
        }))
        setPosters(prev => ({ ...prev, ...results }))
      }
    }
    fetchAll()
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
    await sbSave(key, watched[key] || false, r)
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
    <div style={{ minHeight: '100vh', background: '#F5F3EE', fontFamily: "'Georgia', serif" }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', fontFamily: 'Geist, sans-serif', marginBottom: 12 }}>
            Marvel Cinematic Universe
          </p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', margin: '0 0 1.5rem' }}>
            <em>Watch</em> every film<br />before Doomsday.
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: '#666', fontFamily: 'system-ui, sans-serif' }}>
              {watchedCount} watched — {MCU_MOVIES.length - watchedCount} remaining — {MCU_MOVIES.length} total
            </span>
            {SB_KEY && <span style={{ fontSize: 12, color: '#888', fontFamily: 'system-ui, sans-serif' }}>✓ synced</span>}
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ height: 3, background: '#E5E2DA', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#1a1a1a', borderRadius: 2, transition: 'width 0.6s ease' }} />
          </div>
          <p style={{ fontSize: 12, color: '#aaa', fontFamily: 'system-ui, sans-serif', margin: 0 }}>{pct}% complete</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '3rem' }}>
          {['all', 'watched', 'unwatched'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 18px', fontSize: 13, fontFamily: 'system-ui, sans-serif',
              background: filter === f ? '#1a1a1a' : 'transparent',
              color: filter === f ? '#fff' : '#888',
              border: `1px solid ${filter === f ? '#1a1a1a' : '#D5D2CA'}`,
              borderRadius: 100, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {byPhase.map(({ phase, movies, total, done }) => {
          const meta = PHASE_META[phase]
          return (
            <div key={phase} style={{ marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: 18, fontWeight: 400, color: '#1a1a1a', fontStyle: 'italic' }}>{meta.label}</span>
                  <span style={{ fontSize: 13, color: '#aaa', marginLeft: 10, fontFamily: 'system-ui, sans-serif' }}>{meta.saga}</span>
                </div>
                <span style={{ fontSize: 13, color: '#aaa', fontFamily: 'system-ui, sans-serif' }}>{done}/{total}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
                {movies.map(movie => {
                  const isWatched = watched[movie.title]
                  const rating = ratings[movie.title]
                  const isSaving = saving === movie.title
                  const posterPath = posters[movie.tmdbId]

                  return (
                    <div key={movie.title}
                      onClick={() => toggleWatched(movie)}
                      style={{
                        borderRadius: 14, overflow: 'hidden', background: '#fff', cursor: 'pointer',
                        boxShadow: isWatched ? '0 4px 20px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.06)',
                        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
                        outline: isWatched ? '1.5px solid #1a1a1a' : 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = isWatched ? '0 4px 20px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.06)' }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '2/3', background: '#F0EDE8', overflow: 'hidden' }}>
                        {posterPath ? (
                          <img src={`${TMDB_IMG}${posterPath}`} alt={movie.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                            <span style={{ fontSize: 12, color: '#ccc', textAlign: 'center', lineHeight: 1.4, fontFamily: 'system-ui, sans-serif' }}>
                              {TMDB_KEY ? 'Loading…' : movie.title}
                            </span>
                          </div>
                        )}
                        {isWatched && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        )}
                        {isSaving && <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#F59E0B' }} />}
                      </div>

                      <div style={{ padding: '10px 12px 12px' }}>
                        <p style={{ fontSize: 12, fontWeight: 400, margin: '0 0 2px', lineHeight: 1.35, color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {movie.title}
                        </p>
                        <p style={{ fontSize: 11, color: '#bbb', margin: '0 0 8px', fontFamily: 'system-ui, sans-serif' }}>{movie.year}</p>
                        {isWatched ? (
                          <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
                            {[1,2,3,4,5].map(s => (
                              <span key={s} onClick={e => setRating(movie, s, e)}
                                style={{ fontSize: 13, cursor: 'pointer', color: rating >= s ? '#1a1a1a' : '#DDD', userSelect: 'none', transition: 'color 0.1s' }}>★</span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: 11, color: '#ccc', margin: 0, fontFamily: 'system-ui, sans-serif' }}>tap to mark watched</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center', marginTop: '1rem', fontFamily: 'system-ui, sans-serif' }}>
          Poster images via The Movie Database (TMDB)
        </p>
      </div>
    </div>
  )
}