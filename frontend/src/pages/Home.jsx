import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    return (
        <div className="">
            <div className="w-full max-w-4xl bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-8">Your Notes</h2>

                <div className="space-y-4 mb-10">
                    {notes.map((note) => (
                        <Note note={note} onDelete={deleteNote} key={note.id} />
                    ))}
                </div>

                <h2 className="text-2xl font-semibold text-white mb-6">Create a New Note</h2>

                <form onSubmit={createNote} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-xs font-semibold tracking-wider text-white uppercase mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                            placeholder="Enter title"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-xs font-semibold tracking-wider text-white uppercase mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 rounded-3xl bg-white text-gray-600 placeholder:text-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                            rows="4"
                            placeholder="Write your note here..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 text-lg bg-gradient-to-r from-pink-400 to-orange-400 
                                   rounded-full font-bold hover:from-pink-500 hover:to-yellow-400 transition-all duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
