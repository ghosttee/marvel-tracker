import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'

const MCU_MOVIES = [
  { title: "Iron Man", year: 2008, phase: 1, tmdbId: 1726, characters: ["ironman"] },
  { title: "The Incredible Hulk", year: 2008, phase: 1, tmdbId: 1724, characters: [] },
  { title: "Iron Man 2", year: 2010, phase: 1, tmdbId: 10138, characters: ["ironman"] },
  { title: "Thor", year: 2011, phase: 1, tmdbId: 10195, characters: ["thor"] },
  { title: "Captain America: The First Avenger", year: 2011, phase: 1, tmdbId: 1771, characters: ["cap"] },
  { title: "The Avengers", year: 2012, phase: 1, tmdbId: 24428, characters: ["ironman","thor","cap"] },
  { title: "Iron Man 3", year: 2013, phase: 2, tmdbId: 68721, characters: ["ironman"] },
  { title: "Thor: The Dark World", year: 2013, phase: 2, tmdbId: 76338, characters: ["thor"] },
  { title: "Captain America: The Winter Soldier", year: 2014, phase: 2, tmdbId: 100402, characters: ["cap"] },
  { title: "Guardians of the Galaxy", year: 2014, phase: 2, tmdbId: 118340, characters: ["guardians"] },
  { title: "Avengers: Age of Ultron", year: 2015, phase: 2, tmdbId: 99861, characters: ["ironman","thor","cap"] },
  { title: "Ant-Man", year: 2015, phase: 2, tmdbId: 102899, characters: [] },
  { title: "Captain America: Civil War", year: 2016, phase: 3, tmdbId: 271110, characters: ["ironman","cap","spiderman"] },
  { title: "Doctor Strange", year: 2016, phase: 3, tmdbId: 284052, characters: ["strange"] },
  { title: "Guardians of the Galaxy Vol. 2", year: 2017, phase: 3, tmdbId: 283995, characters: ["guardians"] },
  { title: "Spider-Man: Homecoming", year: 2017, phase: 3, tmdbId: 315635, characters: ["spiderman"] },
  { title: "Thor: Ragnarok", year: 2017, phase: 3, tmdbId: 284053, characters: ["thor"] },
  { title: "Black Panther", year: 2018, phase: 3, tmdbId: 284054, characters: ["panther"] },
  { title: "Avengers: Infinity War", year: 2018, phase: 3, tmdbId: 299536, characters: ["ironman","thor","cap","strange","spiderman","guardians"] },
  { title: "Ant-Man and the Wasp", year: 2018, phase: 3, tmdbId: 363088, characters: [] },
  { title: "Captain Marvel", year: 2019, phase: 3, tmdbId: 299537, characters: [] },
  { title: "Avengers: Endgame", year: 2019, phase: 3, tmdbId: 299534, characters: ["ironman","thor","cap","panther","spiderman","guardians"] },
  { title: "Spider-Man: Far From Home", year: 2019, phase: 3, tmdbId: 429617, characters: ["spiderman"] },
  { title: "Black Widow", year: 2021, phase: 4, tmdbId: 497698, characters: [] },
  { title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, phase: 4, tmdbId: 566525, characters: [] },
  { title: "Eternals", year: 2021, phase: 4, tmdbId: 524434, characters: [] },
  { title: "Spider-Man: No Way Home", year: 2021, phase: 4, tmdbId: 634649, characters: ["spiderman","strange"] },
  { title: "Doctor Strange in the Multiverse of Madness", year: 2022, phase: 4, tmdbId: 453395, characters: ["strange"] },
  { title: "Thor: Love and Thunder", year: 2022, phase: 4, tmdbId: 616037, characters: ["thor"] },
  { title: "Black Panther: Wakanda Forever", year: 2022, phase: 4, tmdbId: 505642, characters: ["panther"] },
  { title: "Ant-Man and the Wasp: Quantumania", year: 2023, phase: 5, tmdbId: 640146, characters: [] },
  { title: "Guardians of the Galaxy Vol. 3", year: 2023, phase: 5, tmdbId: 447365, characters: ["guardians"] },
  { title: "The Marvels", year: 2023, phase: 5, tmdbId: 609681, characters: [] },
  { title: "Captain America: Brave New World", year: 2025, phase: 5, tmdbId: 822119, characters: ["cap"] },
  { title: "Thunderbolts*", year: 2025, phase: 5, tmdbId: 986056, characters: [] },
  { title: "The Fantastic Four: First Steps", year: 2025, phase: 6, tmdbId: 617126, characters: [] },
  { title: "Spider-Man: Brand New Day", year: 2026, phase: 6, tmdbId: 969681, characters: ["spiderman"] },
]

const PHASE_META = {
  1: { label: "Phase 1", saga: "The Infinity Saga" },
  2: { label: "Phase 2", saga: "The Infinity Saga" },
  3: { label: "Phase 3", saga: "The Infinity Saga" },
  4: { label: "Phase 4", saga: "The Multiverse Saga" },
  5: { label: "Phase 5", saga: "The Multiverse Saga" },
  6: { label: "Phase 6", saga: "The Multiverse Saga" },
}

const CHARACTER_NAMES = {
  ironman: "Iron Man",
  thor: "Thor",
  cap: "Captain America",
  spiderman: "Spider-Man",
  strange: "Doctor Strange",
  panther: "Black Panther",
  guardians: "Guardians of the Galaxy",
}

const TMDB_IMG = "https://image.tmdb.org/t/p/w342"
const TMDB_IMG_LG = "https://image.tmdb.org/t/p/w780"
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || ""
const SB_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY || ""

const supabase = createClient(SB_URL, SB_KEY)

const DOOMSDAY = new Date('2026-12-18T00:00:00')

function daysUntil(date) {
  return Math.max(0, Math.ceil((date - new Date()) / 86400000))
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function MovieCard({ movie, poster, isWatched, isSaving, rating, expanded, overview, onSelect, onRate, onToggleExpand }) {
  return (
    <motion.div
      data-movie-id={movie.tmdbId}
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 24, stiffness: 320 }}
      style={{
        borderRadius: 14, overflow: 'hidden', background: '#fff', cursor: 'pointer',
        boxShadow: isWatched
          ? '0 1px 2px rgba(0,0,0,0.04), 0 6px 20px -6px rgba(0,0,0,0.18)'
          : '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px -2px rgba(0,0,0,0.06)',
        outline: isWatched ? '1.5px solid #1a1a1a' : 'none',
        transitionProperty: 'box-shadow',
        transitionDuration: '0.2s',
      }}
    >
      <motion.div
        layoutId={`poster-${movie.tmdbId}`}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        style={{ position: 'relative', aspectRatio: '2/3', background: '#F0EDE8', overflow: 'hidden' }}
      >
        {poster ? (
          <img src={`${TMDB_IMG}${poster}`} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <span style={{ fontSize: 12, color: '#ccc', textAlign: 'center', lineHeight: 1.4 }}>{movie.title}</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
        {isWatched && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
        {isSaving && <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#F59E0B' }} />}
      </motion.div>

      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{ fontSize: 12, fontWeight: 500, margin: '0 0 2px', lineHeight: 1.35, color: '#1a1a1a', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textWrap: 'pretty' }}>
          {movie.title}
        </p>
        <p style={{ fontSize: 11, color: '#bbb', margin: '0 0 6px', fontVariantNumeric: 'tabular-nums' }}>{movie.year}</p>
        {isWatched ? (
          <div style={{ display: 'flex', gap: 2, marginBottom: 6 }} onClick={e => e.stopPropagation()}>
            {[1,2,3,4,5].map(s => (
              <span key={s} onClick={e => onRate(s, e)}
                style={{ fontSize: 13, cursor: 'pointer', color: rating >= s ? '#1a1a1a' : '#DDD', userSelect: 'none', padding: '2px 1px' }}>★</span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 11, color: '#ccc', margin: '0 0 6px' }}>tap to view</p>
        )}
        {overview && (
          <div onClick={e => { e.stopPropagation(); onToggleExpand() }}>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', transform: expanded ? 'rotate(90deg)' : 'none', transitionProperty: 'transform', transitionDuration: '0.15s', transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)', fontSize: 9 }}>▶</span>
              Synopsis
            </p>
            {expanded && (
              <p style={{ fontSize: 11, color: '#666', margin: 0, lineHeight: 1.5, textWrap: 'pretty' }}>{overview}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 28, stiffness: 320 } },
}

function ModalSection({ children, style }) {
  return (
    <motion.div variants={SECTION_VARIANTS} style={style}>
      {children}
    </motion.div>
  )
}

function MovieModal({ movie, poster, overview, cast, isWatched, rating, onClose, onToggleWatch, onRate }) {
  const isMobile = useIsMobile()
  const meta = PHASE_META[movie.phase]
  const fallbackCharacters = movie.characters
    .map(c => CHARACTER_NAMES[c])
    .filter(Boolean)
    .map(name => ({ name, character: '' }))
  const displayCast = cast?.length ? cast : fallbackCharacters

  useEffect(() => {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const sheetStyle = isMobile ? {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#F5F3EE',
    borderRadius: '28px 28px 0 0',
    maxHeight: '92vh',
    overflow: 'auto',
    boxShadow: '0 -1px 0 rgba(0,0,0,0.04), 0 -24px 48px -12px rgba(0,0,0,0.25)',
    zIndex: 101,
  } : {
    position: 'fixed', top: '50%', left: '50%',
    width: 'min(440px, 92vw)',
    maxHeight: '88vh',
    overflow: 'auto',
    background: '#F5F3EE',
    borderRadius: 28,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 32px 64px -12px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(0,0,0,0.06)',
    zIndex: 101,
  }

  const sheetMotion = isMobile ? {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'spring', damping: 34, stiffness: 320 },
  } : {
    initial: { opacity: 0, scale: 0.96, x: '-50%', y: '-50%' },
    animate: { opacity: 1, scale: 1, x: '-50%', y: '-50%' },
    exit: { opacity: 0, scale: 0.96, x: '-50%', y: '-50%' },
    transition: { type: 'spring', damping: 30, stiffness: 360 },
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(20, 18, 14, 0.5)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 100,
          willChange: 'opacity',
        }}
      />

      <motion.div {...sheetMotion} style={sheetStyle}>
        {isMobile && (
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'linear-gradient(180deg, #F5F3EE 60%, rgba(245,243,238,0))', display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.18)' }} />
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <motion.div
            layoutId={`poster-${movie.tmdbId}`}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            style={{
              width: '100%',
              aspectRatio: '2/3',
              maxHeight: isMobile ? 380 : 420,
              background: '#F0EDE8',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {poster ? (
              <img
                src={`${TMDB_IMG_LG}${poster}`}
                alt={movie.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, color: '#ccc' }}>{movie.title}</span>
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.45))', pointerEvents: 'none' }} />
          </motion.div>

          <motion.button
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 360, delay: 0.18 }}
            style={{
              position: 'absolute', top: isMobile ? 22 : 16, right: 16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer',
              transitionProperty: 'background-color',
              transitionDuration: '0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.65)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span style={{ position: 'absolute', inset: -6 }} aria-hidden="true" />
          </motion.button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}
          style={{ padding: '22px 24px 32px' }}
        >
          <ModalSection>
            <p style={{ fontSize: 11, color: '#9c9486', margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>
              {meta.label} <span style={{ color: '#ccc', margin: '0 6px' }}>·</span> {meta.saga}
            </p>
          </ModalSection>

          <ModalSection style={{ marginTop: 10 }}>
            <h2 style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', margin: '0 0 6px', fontFamily: 'Georgia, serif', textWrap: 'balance' }}>
              <em>{movie.title}</em>
            </h2>
            <p style={{ fontSize: 14, color: '#888', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{movie.year}</p>
          </ModalSection>

          {displayCast.length > 0 && (
            <ModalSection style={{ marginTop: 24 }}>
              <p style={{ fontSize: 11, color: '#9c9486', margin: '0 0 10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                Cast
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {displayCast.slice(0, 8).map((p, i) => (
                  <div key={`${p.name}-${i}`} style={{
                    background: '#FFFFFF',
                    color: '#444',
                    padding: '7px 12px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 500,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.06)',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>{p.name}</span>
                    {p.character && (
                      <span style={{ color: '#aaa', fontSize: 11 }}>· {p.character.split('/')[0].trim()}</span>
                    )}
                  </div>
                ))}
              </div>
            </ModalSection>
          )}

          {overview && (
            <ModalSection style={{ marginTop: 24 }}>
              <p style={{ fontSize: 11, color: '#9c9486', margin: '0 0 8px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                Synopsis
              </p>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, margin: 0, textWrap: 'pretty' }}>
                {overview}
              </p>
            </ModalSection>
          )}

          <ModalSection style={{ marginTop: 24 }}>
            <p style={{ fontSize: 11, color: '#9c9486', margin: '0 0 8px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
              Your rating
            </p>
            <div style={{ display: 'flex', gap: 2, marginLeft: -4 }}>
              {[1,2,3,4,5].map(s => (
                <button
                  key={s}
                  onClick={e => onRate(s, e)}
                  aria-label={`Rate ${s} star${s === 1 ? '' : 's'}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px 6px', fontSize: 24, lineHeight: 1,
                    color: rating >= s ? '#1a1a1a' : '#D5D2CA',
                    transitionProperty: 'color, transform',
                    transitionDuration: '0.15s',
                    transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
                  }}
                >★</button>
              ))}
            </div>
          </ModalSection>

          <ModalSection style={{ marginTop: 28 }}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleWatch(movie)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: isWatched ? '#fff' : '#1a1a1a',
                color: isWatched ? '#1a1a1a' : '#fff',
                border: 'none',
                boxShadow: isWatched
                  ? 'inset 0 0 0 1px #E5E2DA, 0 1px 2px rgba(0,0,0,0.03)'
                  : '0 1px 2px rgba(0,0,0,0.06), 0 8px 20px -8px rgba(26,26,26,0.45)',
                borderRadius: 14,
                fontSize: 15, fontWeight: 500,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'inherit',
                transitionProperty: 'background-color, color, box-shadow',
                transitionDuration: '0.18s',
                transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              {isWatched ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17L4 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Watched</span>
                </>
              ) : (
                <span>Mark as watched</span>
              )}
            </motion.button>
          </ModalSection>
        </motion.div>
      </motion.div>
    </>
  )
}

function FloatingCountdown({ filmsLeft, totalFilms, watchedCount, nextUnwatched }) {
  const daysRemaining = daysUntil(DOOMSDAY)
  if (filmsLeft === 0 || daysRemaining === 0) return null

  const daysPerFilm = daysRemaining / filmsLeft
  const paceLabel = daysPerFilm >= 7 ? 'doable' : daysPerFilm >= 3 ? 'steady pace' : daysPerFilm >= 1 ? 'tight pace' : 'urgent'
  const paceTone = daysPerFilm >= 3 ? '#6a6a6a' : daysPerFilm >= 1 ? '#f5d36a' : '#ff6a3d'
  const dotsLit = Math.min(10, Math.round((watchedCount / totalFilms) * 10))

  function handleResume() {
    if (!nextUnwatched) return
    const el = document.querySelector(`[data-movie-id="${nextUnwatched.tmdbId}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 32, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 50, fontFamily: 'Geist, system-ui, sans-serif' }}>
      <div style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'stretch',
        background: 'linear-gradient(180deg, #161618 0%, #0a0a0c 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 100,
        padding: '10px 10px 10px 24px',
        gap: 18,
        boxShadow: '0 24px 48px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(229, 36, 36, 0.06), 0 0 60px -10px rgba(229, 36, 36, 0.25)',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,36,36,0.18) 0%, rgba(229,36,36,0) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="13" r="8" stroke="#E52424" strokeWidth="1.6"/>
              <path d="M12 9v4l2.5 1.5" stroke="#E52424" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M9 3h6" stroke="#E52424" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: 24, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{daysRemaining}</span>
              <span style={{ fontSize: 11, color: '#9d9d9d', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500 }}>days</span>
            </div>
            <span style={{ fontSize: 10, color: '#6a6a6a', letterSpacing: '0.04em' }}>until Avengers: Doomsday</span>
          </div>
        </div>

        <div style={{ width: 1, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12) 50%, transparent)' }} />

        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 6px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: 24, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{filmsLeft}</span>
              <span style={{ fontSize: 11, color: '#9d9d9d', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500 }}>films left</span>
            </div>
            <span style={{ fontSize: 10, color: paceTone, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>~1 every {daysPerFilm.toFixed(1)} days · {paceLabel}</span>
          </div>
        </div>

        <div style={{ width: 1, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12) 50%, transparent)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '8px 0 8px 6px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < dotsLit ? '#E52424' : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>

        <button
          onClick={handleResume}
          disabled={!nextUnwatched}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 22px',
            background: '#fff', color: '#0a0a0c',
            border: 'none', borderRadius: 100,
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
            cursor: nextUnwatched ? 'pointer' : 'default',
            opacity: nextUnwatched ? 1 : 0.5,
          }}
        >
          <span>Resume</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m-5-5l5 5-5 5" stroke="#0a0a0c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [watched, setWatched] = useState({})
  const [ratings, setRatings] = useState({})
  const [saving, setSaving] = useState(null)
  const [filter, setFilter] = useState("all")
  const [posters, setPosters] = useState({})
  const [expanded, setExpanded] = useState({})
  const [overviews, setOverviews] = useState({})
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [credits, setCredits] = useState({})

  // Handle auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
      if (session?.user) loadUserData()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadUserData()
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData() {
    const { data, error } = await supabase.from('marvel_tracker').select('*')
    if (data) {
      const w = {}, r = {}
      data.forEach(row => {
        w[row.id] = row.watched
        if (row.rating) r[row.id] = row.rating
      })
      setWatched(w)
      setRatings(r)
    }
  }

  // Fetch posters from TMDB
  useEffect(() => {
    if (!TMDB_KEY) return
    const fetchAll = async () => {
      for (let i = 0; i < MCU_MOVIES.length; i += 6) {
        const batch = MCU_MOVIES.slice(i, i + 6)
        const results = {}, overviewResults = {}
        await Promise.all(batch.map(async m => {
          try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${m.tmdbId}?api_key=${TMDB_KEY}`)
            if (res.ok) {
              const d = await res.json()
              if (d.poster_path) results[m.tmdbId] = d.poster_path
              if (d.overview) overviewResults[m.tmdbId] = d.overview
            }
          } catch (e) {}
        }))
        setPosters(prev => ({ ...prev, ...results }))
        setOverviews(prev => ({ ...prev, ...overviewResults }))
      }
    }
    fetchAll()
  }, [])

  // Lazily fetch cast credits when modal opens
  useEffect(() => {
    if (!selectedMovie || !TMDB_KEY) return
    if (credits[selectedMovie.tmdbId]) return
    const id = selectedMovie.tmdbId
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_KEY}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setCredits(prev => ({ ...prev, [id]: (data.cast ?? []).slice(0, 6) }))
      })
      .catch(() => {})
  }, [selectedMovie])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setWatched({})
    setRatings({})
  }

  async function toggleWatched(movie) {
    if (!user) return
    const key = movie.title
    const newVal = !watched[key]
    setWatched(p => ({ ...p, [key]: newVal }))
    setSaving(key)
    await supabase.from('marvel_tracker').upsert({
      id: key, watched: newVal, rating: ratings[key] || null, user_id: user.id
    })
    setSaving(null)
  }

  async function setRating(movie, val, e) {
    if (e) e.stopPropagation()
    if (!user) return
    const key = movie.title
    const r = ratings[key] === val ? null : val
    setRatings(p => ({ ...p, [key]: r }))
    await supabase.from('marvel_tracker').upsert({
      id: key, watched: watched[key] || false, rating: r, user_id: user.id
    })
  }

  function toggleExpanded(tmdbId) {
    setExpanded(p => ({ ...p, [tmdbId]: !p[tmdbId] }))
  }

  const filtered = MCU_MOVIES.filter(m =>
    filter === "all" ? true : filter === "watched" ? watched[m.title] : !watched[m.title]
  )
  const watchedCount = MCU_MOVIES.filter(m => watched[m.title]).length
  const pct = Math.round((watchedCount / MCU_MOVIES.length) * 100)
  const nextUnwatched = MCU_MOVIES.find(m => !watched[m.title])

  const byPhase = [1,2,3,4,5,6].map(ph => ({
    phase: ph,
    movies: filtered.filter(m => m.phase === ph),
    total: MCU_MOVIES.filter(m => m.phase === ph).length,
    done: MCU_MOVIES.filter(m => m.phase === ph && watched[m.title]).length,
  })).filter(p => p.movies.length > 0)

  const s = { fontFamily: 'Geist, system-ui, sans-serif' }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
      <p style={{ color: '#aaa', fontSize: 14 }}>Loading…</p>
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
      <div style={{ maxWidth: 400, width: '100%', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>
            Marvel Cinematic Universe
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', margin: '0 0 1rem', fontFamily: 'Georgia, serif', textWrap: 'balance' }}>
            <em>Watch</em> every film<br />before Doomsday.
          </h1>
          <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
            Sign in to track your progress across devices.
          </p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E5E2DA', padding: '1.5rem' }}>
          <button onClick={signInWithGoogle}
            style={{ width: '100%', padding: '12px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 500, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'Geist, system-ui, sans-serif' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
        <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center', marginTop: 16 }}>
          Your progress is saved privately to your account.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3EE', ...s }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', margin: 0 }}>
              Marvel Cinematic Universe
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <button onClick={handleSignOut} style={{ fontSize: 12, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Geist, system-ui, sans-serif' }}>
                Sign out
              </button>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', margin: '0 0 1.5rem', fontFamily: 'Georgia, serif', textWrap: 'balance' }}>
            <em>Watch</em> every film<br />before Doomsday.
          </h1>
          <span style={{ fontSize: 14, color: '#666', fontVariantNumeric: 'tabular-nums' }}>
            {watchedCount} watched — {MCU_MOVIES.length - watchedCount} remaining — {MCU_MOVIES.length} total
          </span>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ height: 3, background: '#E5E2DA', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#1a1a1a', borderRadius: 2, transitionProperty: 'width', transitionDuration: '0.6s', transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)' }} />
          </div>
          <p style={{ fontSize: 12, color: '#aaa', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{pct}% complete</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '3rem' }}>
          {['all', 'watched', 'unwatched'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 18px', fontSize: 13,
              background: filter === f ? '#1a1a1a' : 'transparent',
              color: filter === f ? '#fff' : '#888',
              border: `1px solid ${filter === f ? '#1a1a1a' : '#D5D2CA'}`,
              borderRadius: 100, cursor: 'pointer',
              transitionProperty: 'background-color, color, border-color',
              transitionDuration: '0.15s',
              transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
              fontFamily: 'Geist, system-ui, sans-serif',
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
                  <span style={{ fontSize: 18, fontWeight: 400, color: '#1a1a1a', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>{meta.label}</span>
                  <span style={{ fontSize: 13, color: '#aaa', marginLeft: 10 }}>{meta.saga}</span>
                </div>
                <span style={{ fontSize: 13, color: '#aaa', fontVariantNumeric: 'tabular-nums' }}>{done}/{total}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14 }}>
                {movies.map(movie => (
                  <MovieCard
                    key={movie.title}
                    movie={movie}
                    poster={posters[movie.tmdbId]}
                    overview={overviews[movie.tmdbId]}
                    isWatched={!!watched[movie.title]}
                    isSaving={saving === movie.title}
                    rating={ratings[movie.title]}
                    expanded={!!expanded[movie.tmdbId]}
                    onSelect={() => setSelectedMovie(movie)}
                    onRate={(val, e) => setRating(movie, val, e)}
                    onToggleExpand={() => toggleExpanded(movie.tmdbId)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        <p style={{ fontSize: 12, color: '#ccc', textAlign: 'center', marginTop: '1rem', marginBottom: '6rem' }}>
          Poster images via The Movie Database (TMDB)
        </p>
      </div>

      <FloatingCountdown
        filmsLeft={MCU_MOVIES.length - watchedCount}
        totalFilms={MCU_MOVIES.length}
        watchedCount={watchedCount}
        nextUnwatched={nextUnwatched}
      />

      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            key={selectedMovie.tmdbId}
            movie={selectedMovie}
            poster={posters[selectedMovie.tmdbId]}
            overview={overviews[selectedMovie.tmdbId]}
            cast={credits[selectedMovie.tmdbId] ?? []}
            isWatched={!!watched[selectedMovie.title]}
            rating={ratings[selectedMovie.title]}
            onClose={() => setSelectedMovie(null)}
            onToggleWatch={toggleWatched}
            onRate={(val, e) => setRating(selectedMovie, val, e)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
