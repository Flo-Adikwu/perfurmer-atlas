import { useState, useEffect } from 'react'
import { 
  Search, 
  Star, 
  Sun, 
  Flower2, 
  Trees, 
  Flame, 
  Leaf, 
  Wind, 
  Droplet, 
  X, 
  Heart, 
  TriangleAlert, 
  Lightbulb,
  ChevronLeft
} from 'lucide-react'
import { notes } from './data/notes'

const FamilyIcon = ({ family, className = "w-4 h-4" }) => {
  if (!family) return <Leaf className={className} />;
  const f = family.toLowerCase();
  
  if (f.includes('citrus') || f.includes('fruity')) return <Sun className={className} />;
  if (f.includes('floral') || f.includes('powdery')) return <Flower2 className={className} />;
  if (f.includes('wood')) return <Trees className={className} />;
  if (f.includes('spic')) return <Flame className={className} />;
  if (f.includes('resin') || f.includes('oriental') || f.includes('balsamic') || f.includes('aquatic')) return <Droplet className={className} />;
  if (f.includes('sweet') || f.includes('gourmand')) return <Star className={className} />;
  if (f.includes('musk') || f.includes('fresh') || f.includes('leather') || f.includes('ozonic') || f.includes('animalic')) return <Wind className={className} />;
  if (f.includes('earth') || f.includes('herb') || f.includes('green') || f.includes('aromatic') || f.includes('moss')) return <Leaf className={className} />;

  return <Leaf className={className} />;
}

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [compareMode, setCompareMode] = useState(false)
  const [compareList, setCompareList] = useState([])
  const [view, setView] = useState('browser') // 'browser' or 'detail' for mobile
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('perfumers-favourites')
    return saved ? JSON.parse(saved) : []
  })
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false)

  const selectedNote = notes.find(n => n.id === selectedNoteId)

  useEffect(() => {
    localStorage.setItem('perfumers-favourites', JSON.stringify(favourites))
  }, [favourites])

  useEffect(() => {
    if (selectedNote) {
      console.log(`Debug - Note: ${selectedNote.name}, Family: "${selectedNote.family}"`);
    }
  }, [selectedNote])

  const toggleFavourite = (id) => {
    setFavourites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const filteredNotes = notes.filter(note => {
    const matchesFilter = filter === 'all' || note.layer === filter
    const matchesSearch = note.name.toLowerCase().includes(search.toLowerCase()) || 
                         note.family.toLowerCase().includes(search.toLowerCase())
    const matchesFavourites = !showFavouritesOnly || favourites.includes(note.id)
    return matchesFilter && matchesSearch && matchesFavourites
  })

  // Handle note selection with view switching for mobile
  const handleNoteClick = (id) => {
    if (compareMode) {
      toggleCompare(id)
    } else {
      setSelectedNoteId(id)
      setView('detail')
    }
  }

  return (
    <div className="flex flex-col h-screen h-[100dvh] md:flex-row bg-background text-charcoal font-inter overflow-hidden">
      {/* Left Panel: Note Browser */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-moss/20 flex flex-col h-full bg-white shadow-sm z-10 overflow-hidden ${view === 'detail' ? 'hidden md:flex' : 'fixed inset-0 md:relative flex'}`}>
        <header className="p-6 border-b border-moss/10 bg-background/50 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-playfair font-bold text-moss">The Perfumer's Atlas</h1>
            <button 
              onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
              className={`p-2 rounded-full transition-colors ${showFavouritesOnly ? 'bg-terracotta text-white' : 'bg-moss/5 text-moss hover:bg-moss/10'}`}
              title="Show Favourites"
            >
              <Star className="w-5 h-5" fill={showFavouritesOnly ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search notes or families..."
                className="w-full pl-4 pr-10 py-2 bg-white border border-moss/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss/30 transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-moss/40" />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'top', 'heart', 'base'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full capitalize text-xs font-medium transition-colors whitespace-nowrap ${
                    filter === f 
                      ? 'bg-moss text-white shadow-sm' 
                      : 'bg-moss/5 text-moss hover:bg-moss/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-[#fcfaf7] pb-32 md:pb-4">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border group relative active:scale-95 ${
                (compareMode ? compareList.includes(note.id) : selectedNoteId === note.id)
                  ? 'bg-moss text-white border-moss shadow-lg md:scale-[1.02]' 
                  : 'bg-white border-moss/10 md:hover:border-moss/30 md:hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    (compareMode ? compareList.includes(note.id) : selectedNoteId === note.id) 
                      ? 'bg-white/20' 
                      : 'bg-moss/5 text-moss'
                  }`}>
                    <FamilyIcon family={note.family} />
                  </div>
                  <h3 className="font-bold text-base">{note.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {favourites.includes(note.id) && ! (compareMode ? compareList.includes(note.id) : selectedNoteId === note.id) && (
                    <Star className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                  )}
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                    (compareMode ? compareList.includes(note.id) : selectedNoteId === note.id) ? 'bg-white/20' : 'bg-moss/10 text-moss'
                  }`}>
                    {note.layer}
                  </span>
                </div>
              </div>
              <div className="pl-11">
                <p className={`text-[11px] ${ (compareMode ? compareList.includes(note.id) : selectedNoteId === note.id) ? 'text-white/80' : 'text-charcoal/60'}`}>
                  {note.family}
                </p>
              </div>
              
              {!compareMode && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(note.id);
                  }}
                  className={`absolute bottom-3 right-3 transition-opacity ${
                    favourites.includes(note.id) ? 'text-terracotta opacity-100' : 'text-moss/30 md:opacity-0 md:group-hover:opacity-100 hover:text-moss/60'
                  }`}
                >
                  <Star className="w-4 h-4" fill={favourites.includes(note.id) ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <footer className="p-4 border-t border-moss/10 bg-white flex-shrink-0 z-30 fixed bottom-0 left-0 right-0 md:static shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:shadow-none">
          <button 
            onClick={() => {
              setCompareMode(!compareMode)
              if (!compareMode) {
                setCompareList(selectedNoteId ? [selectedNoteId] : [])
              }
            }}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
              compareMode 
                ? 'bg-terracotta text-white shadow-inner' 
                : 'bg-moss/10 text-moss hover:bg-moss/20'
            }`}
          >
            {compareMode ? 'Exit Comparison' : 'Comparison Mode'}
          </button>
          {compareMode && (
            <div className="mt-2 space-y-2">
              <p className="text-[10px] text-center text-charcoal/50 uppercase tracking-widest font-bold">Select up to 3 notes</p>
              <button
                onClick={() => setView('detail')}
                className="md:hidden w-full py-2 bg-moss text-white rounded-lg text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                View Comparison ({compareList.length})
              </button>
            </div>
          )}
        </footer>
      </div>

      {/* Right Panel: Note Detail or Comparison */}
      <div className={`flex-1 overflow-y-auto bg-background relative ${view === 'browser' ? 'hidden md:block' : 'fixed inset-0 flex flex-col z-40'}`}>
        {/* Mobile Back Button */}
        <div className="md:hidden sticky top-0 z-20 p-4 bg-background/80 backdrop-blur-md border-b border-moss/10">
          <button 
            onClick={() => setView('browser')}
            className="flex items-center gap-2 text-moss font-bold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Atlas
          </button>
        </div>

        {compareMode ? (
          <div className="p-8 lg:p-12 h-full">
            {/* Mobile Back Button */}
            <button 
              onClick={() => {
                setCompareMode(false);
                setView('browser');
              }}
              className="md:hidden flex items-center gap-2 text-moss mb-6 font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Atlas
            </button>
            <h2 className="text-4xl font-playfair font-bold text-charcoal mb-12 text-center italic">Comparison Guide</h2>
            
            {compareList.length === 0 ? (
              <div className="h-2/3 flex items-center justify-center text-charcoal/30 italic">
                Select notes from the browser to compare side-by-side
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {compareList.map(id => {
                  const note = notes.find(n => n.id === id)
                  return (
                    <div key={id} className="bg-white rounded-3xl p-6 shadow-xl border border-moss/5 relative">
                      <button 
                        onClick={() => toggleCompare(id)}
                        className="absolute top-4 right-4 text-charcoal/20 hover:text-terracotta transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                           <FamilyIcon family={note.family} className="w-3.5 h-3.5 text-moss/60" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-moss/60">{note.layer} Layer</span>
                        </div>
                        <h3 className="text-3xl font-playfair font-bold text-charcoal mb-4">{note.name}</h3>
                        <p className="text-sm italic text-charcoal/70 line-clamp-3 leading-relaxed">{note.character}</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-moss mb-3 border-b border-moss/10 pb-1 flex items-center gap-2">
                            <Heart className="w-3 h-3" /> Pairings
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {note.pairsWith.map(pid => (
                              <button 
                                key={pid} 
                                onClick={() => {
                                  setSelectedNoteId(pid);
                                  if (view === 'browser') setView('detail');
                                }}
                                className="px-2 py-1 bg-moss/5 text-moss text-[10px] rounded-md font-medium hover:bg-moss/10 transition-colors"
                              >
                                {notes.find(n => n.id === pid)?.name || pid}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-terracotta mb-3 border-b border-terracotta/10 pb-1 flex items-center gap-2">
                            <TriangleAlert className="w-3 h-3" /> Clashes
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {note.clashesWith.map(cid => (
                              <button 
                                key={cid} 
                                onClick={() => {
                                  setSelectedNoteId(cid);
                                  if (view === 'browser') setView('detail');
                                }}
                                className="px-2 py-1 bg-terracotta/5 text-terracotta text-[10px] rounded-md font-medium hover:bg-terracotta/10 transition-colors"
                              >
                                {notes.find(n => n.id === cid)?.name || cid}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {compareList.length < 3 && (
                  <div className="border-2 border-dashed border-moss/10 rounded-3xl flex items-center justify-center p-12 text-center min-h-[300px]">
                    <p className="text-sm text-charcoal/30 italic">Select another note<br/>(up to 3 total)</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Normal Detail Mode */
          <div className="h-full">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none">
              <svg viewBox="0 0 200 200" fill="currentColor" className="text-moss">
                <path d="M40,100 Q40,40 100,40 Q160,40 160,100 Q160,160 100,160 Q40,160 40,100" />
              </svg>
            </div>
            
            {selectedNote ? (
              <div className="max-w-4xl mx-auto p-8 lg:p-16 relative z-10 pb-24">
                <div className="mb-12">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex gap-3">
                      <span className="px-4 py-1.5 bg-moss/10 text-moss rounded-full text-xs font-bold uppercase tracking-widest border border-moss/10 flex items-center gap-2">
                        <FamilyIcon family={selectedNote.family} className="w-3 h-3" />
                        {selectedNote.family}
                      </span>
                      <span className="px-4 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-xs font-bold uppercase tracking-widest border border-terracotta/10">
                        {selectedNote.layer} Layer
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleFavourite(selectedNote.id)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        favourites.includes(selectedNote.id) 
                          ? 'bg-terracotta text-white shadow-md' 
                          : 'bg-white border border-moss/20 text-moss hover:bg-moss/5'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={favourites.includes(selectedNote.id) ? "currentColor" : "none"} />
                      {favourites.includes(selectedNote.id) ? 'Saved' : 'Save to Favourites'}
                    </button>
                  </div>
                  <h2 className="text-6xl lg:text-7xl font-playfair font-bold text-charcoal mb-6 leading-tight">
                    {selectedNote.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-8">
                    <FamilyIcon family={selectedNote.family} className="w-6 h-6 text-terracotta opacity-60" />
                    <div className="h-px flex-1 bg-terracotta/20"></div>
                  </div>
                  <p className="text-2xl italic text-charcoal/80 leading-relaxed font-playfair border-l-4 border-moss/20 pl-8 py-2">
                    "{selectedNote.character}"
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
                  <section className="bg-white/50 p-8 rounded-3xl border border-moss/10 backdrop-blur-sm">
                    <h3 className="text-2xl font-playfair font-bold text-moss mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-moss/10 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      Pairs Beautifully With
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.pairsWith.map(pairId => {
                        const pair = notes.find(n => n.id === pairId)
                        return (
                          <button 
                            key={pairId}
                            onClick={() => setSelectedNoteId(pairId)}
                            className="px-5 py-2.5 bg-moss text-white rounded-full text-sm font-medium hover:bg-moss/90 transition-all hover:shadow-md active:translate-y-0"
                          >
                            {pair?.name || pairId}
                          </button>
                        )
                      })}
                    </div>
                  </section>

                  <section className="bg-white/50 p-8 rounded-3xl border border-terracotta/10 backdrop-blur-sm">
                    <h3 className="text-2xl font-playfair font-bold text-terracotta mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                        <TriangleAlert className="w-4 h-4" />
                      </div>
                      Handle With Care
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.clashesWith.map(clashId => {
                        const clash = notes.find(n => n.id === clashId)
                        return (
                          <button 
                            key={clashId}
                            onClick={() => setSelectedNoteId(clashId)}
                            className="px-5 py-2.5 bg-terracotta text-white rounded-full text-sm font-medium hover:bg-terracotta/90 transition-all hover:shadow-md active:translate-y-0"
                          >
                            {clash?.name || clashId}
                          </button>
                        )
                      })}
                    </div>
                  </section>
                </div>

                <div className="bg-moss text-white rounded-3xl p-10 shadow-xl relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-4 h-4 text-white/70" />
                      <h4 className="text-xs uppercase tracking-[0.3em] text-white/70 font-bold">Did You Know?</h4>
                    </div>
                    <p className="text-2xl font-playfair italic leading-relaxed">"{selectedNote.funFact}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center">
                <div className="max-w-md">
                  <div className="w-24 h-24 bg-moss/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Leaf className="w-10 h-10 text-moss/40" />
                  </div>
                  <h2 className="text-3xl font-playfair italic text-moss/60 mb-4">Choose a Note</h2>
                  <p className="text-charcoal/40">Select a fragrance note from the atlas to explore its character and pairings.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App