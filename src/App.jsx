import { useCallback, useEffect, useState } from 'react'
import './App.css'
import TextSections from './components/noteTextSection'

function App() {
  
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("pocketNotes")
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState((null))
  const [isMobileView, setIsMobileView] = useState(false);
  // const [showNotes, setShowNotes] = useState(false)
  
  const colors = ["#B38BFA", "#FF79F2", "#43E6FC", "#F19576", "#0047FF", "#6691FF"];

  // useEffect(() => {
  //   if (selectedNote) {
  //     localStorage.setItem("selectedNote", JSON.stringify(selectedNote));
  //   }
  // }, [selectedNote]);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 320);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    localStorage.setItem("pocketNotes", JSON.stringify(notes));
  }, [notes]);

  const savedNotes = useCallback((updatedNotes) => {
    localStorage.setItem("pocketNotes",JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }, [])

  const handleNoteSelect = useCallback((note) =>{
      setSelectedNote(note)
      document.body.style.overflow = 'hidden';
  }, [])

    
  
  const handleAddNote = useCallback(() =>{
    setModal(true);
  }, [])

  

  // const handleCreateNote = (() =>{
  //   if(newNote && selectedColor){
  //     const updatedNotes = [...notes, {
  //       name: newNote,
  //       color: selectedColor
  //       // id: Date.now()
  //     }];
  //     savedNotes(updatedNotes)
  //     setNewNote("");
  //     setSelectedColor("");
  //     setModal(false)
  //   }
  //   else{
  //     alert("enter notes name and select color")
  //   }
  // });

  const handleCreateNote = useCallback(() => {
    if(!newNote.trim() || !selectedColor){
      alert("enter notes name and select color")
      return
    }

    const updatedNotes = {
      id: Date.now(),
      name: newNote.trim(),
      color: selectedColor,
      contents: []
    }

    savedNotes(prev => [...prev, updatedNotes])
    setNewNote("")
    setSelectedColor("")
    setModal(false)
  }, [newNote, selectedColor]);

  const handleUpdateNoteContents = useCallback((noteId, contents) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId 
          ? { ...note, contents: contents }
          : note
      )
    );
  }, []);

  const handleModalClose = useCallback((e) => {
    if(e.target.className === "modalContainer"){
      setModal(false)
    }
  }, [])

  const handleBack = useCallback(() => {
    // setShowNotes(false)
    setSelectedNote(null)
    document.body.style.overflow = "auto";
    // localStorage.removeItem("selectedNote")
  }, [])

  const getInitials = useCallback((name) => {
    const words = name.trim().split(" ")
    return words.length > 1
      ? `${words[0][0].toUpperCase()}${words[1][0].toUpperCase()}`
      : words[0][0].toUpperCase()
  },[])

  return (
    <>
      <div className={`mainContainer ${selectedNote && isMobileView ? 'showRight' : ''}`}>

        <div className='leftContainer'>
          <h1>Pocket Notes</h1>
          <div className='notesListContainer'>
            <ul className='notesList'>
              {notes.map((note) =>(
                  <li key={note.id} onClick={() => handleNoteSelect(note)}>
                    <div className='noteProfile' style={{backgroundColor:note.color}}>
                      {getInitials(note.name)}
                    </div>
                    <div className='noteName'>
                      {note.name}
                    </div>
                  </li>
                
              ))}
            </ul>
          </div>
            <img src="\btnAdd.png" alt="add" className='btnAdd' onClick={handleAddNote} />
        </div>

        <div className='rightContainer'>
          {!selectedNote ? (
            <>
              <div className='topContainer'>
                <img src="\pocketNotesImg.png" alt="pocketNotesImg" />
                <h1>Pocket Notes</h1>
                <p>Send and receive messages without keeping your phone online.</p>
                <p>Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
              </div>
              <div className='bottomContainer'>
                <p>
                  <img src="\lock.png" alt="encryption" /> end-to-end encrypted
                </p>
              </div>
            </>
          ):(
            <>
              <TextSections note={selectedNote} onBack={handleBack} onUpdateContents={handleUpdateNoteContents} />
            </>
          )}
        </div>
      </div>

      {modal && (
        <div className='modalContainer' onClick={handleModalClose}>
          <div className='modalContent'>
            <h2>Create New Group</h2>
            <br />
            <label htmlFor='groupName' className='nameLabel'>Group Name: </label>
            <input id='groupName' type="text" placeholder="  Enter group name" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            
            <div className='colorChooser'>
              <span className='colorLabel'>Choose Color: </span>
              <div className='colorOptions'>
                {colors.map((color)=>(
                  <div key={color} className={`colorButton ${selectedColor === color ? 'selected' : ""}`} style={{backgroundColor: color, width: "30px", height:"30px",borderRadius:"50%", margin:"5px", cursor:"pointer"}} onClick={()=>setSelectedColor(color)}></div>
                ))}
              </div>
            </div>
            <button onClick={handleCreateNote} className='btnCreate'>Create</button>
          </div>
        </div>
      )}

    </>
  )
}

export default App
