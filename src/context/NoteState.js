import React from "react";
import { useState } from "react";
import Notecontext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const noteinital = []
  const [notes, setNotes] = useState(noteinital)


  const getNote = async () => {
    const response = await fetch(`${host}/api/note/fetchallnotes`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json();
    setNotes(json)
    console.log(json)
  }


  const addNote = async (title, description, tag) => {
    console.log("addnote clicked")
    //Todo API CALL
    const response = await fetch(`${host}/api/note/addnote`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await response.json();


    console.log("Adding a new note")
    // const note = {
    //   "_id": "6488be574f1580f87f9ff47a3",
    //   "user": "64880489e957200febe3e4a5",
    //   "title": title,
    //   "description": description,
    //   "tag": tag,
    //   "date": "2023-06-16T04:30:44.673Z",
    //   "__v": 0
    // }
    setNotes(notes.concat(note))
  }
  const editNote = async (id, title, description, tag) => {
    console.log("edit start")
    const response = await fetch(`${host}/api/note/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = response.json();
    console.log(json);
    let newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }

    }
    setNotes(newNotes)
    console.log("edit end")

  }
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/note/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    console.log(json)

    //Todo API CALL
    console.log("deleting Note with id " + id)
    const newNote = notes.filter((note) => {
      return note._id !== id
    })
    setNotes(newNote);

  }
  return (
    <Notecontext.Provider value={{ notes, addNote, editNote, deleteNote, getNote }}>
      {props.children}
    </Notecontext.Provider>
  );
};
export default NoteState
