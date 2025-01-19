import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/noteSection.module.css'
// import styles from '../styles/note.module.css'

function NoteTextSection({note, onBack, onUpdateContents }){
    const [inputValue, setInputValue] = useState("");
    const [typedContents, setTypedContents] = useState(() => {
        return note.contents || []
    });
    
    useEffect(() => {
        const savedNotes = localStorage.getItem(`notes-${note.id}`)
        setTypedContents(savedNotes ? JSON.parse(savedNotes) : []);
    }, [note.id])

    useEffect(() =>{
        localStorage.setItem(`notes-${note.id}`, JSON.stringify(typedContents))
        onUpdateContents (note.id, typedContents)
    }, [typedContents, note.id, onUpdateContents])

    

    // useEffect(() => {
    //     // setTypedContents([])
    //     setInputValue("")
    // },[note.id])

    const getInitials = useCallback((name) =>{
        const words = name.trim().split(" ")
        return words.length > 1
            ? `${words[0][0].toUpperCase()}${words[1][0].toUpperCase()}`
            : `${words[0][0].toUpperCase()}`;
    }, [])

    const handleSend = useCallback(() =>{
        if(!inputValue.trim()){
            alert("Pls enter text!!")
            return
        }
        const newContent = {
            id: Date.now(),
            content: inputValue.trim(),
            timestamp: new Date().toISOString()
        };
        setTypedContents(prev => [...prev, newContent]);
        setInputValue("");
    },[inputValue])

    const handleEnterSend = useCallback((e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    return(
        <div className={styles.noteSectionContainer}>
            <div className={styles.noteNav}>
                <img src="/back-arrow.png" alt="back" className={styles.backButton} onClick={onBack} />
                <div className={styles.noteProfile} style={{backgroundColor: note.color}}>
                    {getInitials(note.name)}
                </div>
                <h2>{note.name}</h2>
            </div>

            <div className={styles.noteInfo}>
                {typedContents.map(({id, content, timestamp }) => (
                    <div key={id} className={styles.noteTyped}>
                        <p style={{textAlign: "left"}}>{content}</p>
                        <br />
                        <span className={styles.timestamp}>
                            {new Date(timestamp).toLocaleString().replace(","," .")}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.textArea}>
                <textarea placeholder=" Enter your text here........" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleEnterSend} />
                <img src="\btnSend.png" alt="send" onClick={handleSend} />                
            </div>
        </div>
    )
}

export default NoteTextSection;
