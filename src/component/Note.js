import { useContext, useEffect, useRef, useState } from "react";
import Notecontext from "../context/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";
const Note = (props) => {
    let navigate = useNavigate();
    const context = useContext(Notecontext);
    const { notes, getNote, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNote();
        }
        else {
            navigate("/login")

        }

        // eslint-disable-next-line 
    }, [])
    const [note, setNote] = useState({ eid: "", etitle: "", edescription: "", etag: "default" });
    const ref = useRef(null);
    const refClose = useRef(null);
    const updateNote = (currentnote) => {
        ref.current.click();
        setNote({ eid: currentnote._id, etitle: currentnote.title, edescription: currentnote.description, etag: currentnote.tag })
    }

    const handleClick = (e) => {
        console.log("update button clicked")
        editNote(note.eid, note.etitle, note.edescription, note.etag)
        // setNote({ eid: note.eid, etitle: note.etitle, edescription: note.edescription, etag: note.etag })
        refClose.current.click();
        props.showAlert("Updated successfully", "success")


    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className="row my-3">
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" className="form-control" id="etitle" aria-describedby="emailHelp" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>

                                <button type="submit" disabled={note.etitle.length < 5 || note.edescription.length < 5} className="btn btn-primary my-1" onClick={handleClick}>Submit</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <AddNote showAlert={props.showAlert} />
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <h2>Your Note</h2>
            {
                notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} />

                })
            }
        </div>
    )
}

export default Note;