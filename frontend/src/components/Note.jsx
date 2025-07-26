import React from "react";


function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")

    return (
        <div className="">
            <p className="">{note.title}</p>
            <p className="">{note.content}</p>
            <p className="">{formattedDate}</p>
            <button className="" onClick={() => onDelete(note.id)}>
                Delete
            </button>
        </div>
    );
}

export default Note