import React, { useContext, useState } from 'react'
import Notecontext from "../context/noteContext";

const AddNote = (props) => {
    const context = useContext(Notecontext)
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "default" });
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "default" })
        props.showAlert("Added successfully", "success")

    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <div className="container">
            <h2>Add a Note</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" aria-describedby="emailHelp" name="title" value={note.title} onChange={onChange} minLength={5} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" disabled={note.title.length < 5 || note.description.length < 5} className="btn btn-primary" onClick={handleClick}>Submit</button>
            </form>
        </div>
    )
}
export default AddNote;