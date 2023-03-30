import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Messenger = (props) => {
    const [input, setInput] = useState("");
    const [rooms, setRooms] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");

    let currentUser = useSelector((state) => state.users.currentUser);
    const ws = props.ws;

    ws.onmessage = (e) => {
        /*
        create messages copy array and push new message
        replace local state with updated copy
        */
        let ws_event = JSON.parse(e.data);
        console.log(ws_event);
        if (ws_event.room === selectedRoom.id) {
            let temp_room = { ...selectedRoom };
            temp_room.messages = [...temp_room.messages, ws_event];
            setSelectedRoom(temp_room);
        }
    };

    const lastMessagePreview = (room) => {
        if (room.messages.length >= 1) {
            return room.messages[room.messages.length - 1].body.slice(0, 30);
        } else {
            return "No Messages";
        }
    };

    const formatMessageTimestamp = (input) => {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            hour: "2-digit",
        });
        const date = new Date(input);
        const result = formatter.format(date);
        return result;
    };

    useEffect(() => {
        // console.log(Object.keys(window.location));
        // console.log(window.location.protocol)
        axios
            .get(
                window.location.protocol +
                    "//" +
                    window.location.hostname +
                    ":8000/rooms/",
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser]); // useEffect will re-run whenever object in it's dependency array changes

    const sendMessage = (event) => {
        event.preventDefault();
        ws.send(
            JSON.stringify({
                body: input,
                room: selectedRoom.id,
                sender: currentUser.id,
            })
        );
        setInput("");
    };

    const getRoom = (event, room) => {
        axios
            .get(
                window.location.protocol +
                    "//" +
                    window.location.hostname +
                    ":8000/rooms/" +
                    room.id,
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                setSelectedRoom(response.data);
            });
    };

    return (
        <div className="flex font-bold space-x-1 m-1 w-1/2 mx-auto min-h-screen max-h-screen overflow-hidden">
            <div className="w-1/3 bg-gray-300 rounded-lg p-2">
                {rooms &&
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={(event) => getRoom(event, room)}
                            className={`${
                                selectedRoom.id === room.id
                                    ? "bg-green-500/20"
                                    : ""
                            } mb-2 p-2 rounded-lg hover:bg-green-500/20`}
                        >
                            <div className="flex space-x-1">
                                {/* <img
                                    className="w-12 rounded-lg"
                                    src={
                                        "http://localhost:8000" +
                                        room.users.filter(
                                            (user) => user.id !== currentUser.id
                                        )[0].image
                                    }
                                    alt="..."
                                /> */}
                                <div>
                                    {room.type === "group" && room.type + ": "}
                                    {room.users
                                        .filter(
                                            (user) => user.id !== currentUser.id
                                        )
                                        .map((user) => user.username)}
                                    <br />
                                    {lastMessagePreview(room)}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="w-2/3 bg-gray-300 rounded-lg overflow-y-scroll flex flex-col">
                <div className="text-center m-2 p-2 bg-green-500/20 rounded-lg">
                    {selectedRoom
                        ? selectedRoom.users
                              .filter((user) => user.id !== currentUser.id)
                              .map((user) => user.username)
                        : "SELECT_CHAT"}
                </div>
                <div className="mx-2">
                    {selectedRoom["messages"] &&
                        selectedRoom["messages"].map((message) => (
                            <div
                                className={`flex ${
                                    message.sender === currentUser.id
                                        ? "flex-row-reverse"
                                        : ""
                                }`}
                                key={message.id}
                            >
                                <div
                                    className="p-2 mb-2 rounded-lg w-1/2 bg-green-500/20"
                                    key={message.id}
                                >
                                    <div>{message.body}</div>
                                    <div className="text-xs">
                                        {formatMessageTimestamp(
                                            message.created_at
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {selectedRoom && (
                    <div className="sticky bottom-0 bg-gray-300 mx-2">
                        <form
                            onSubmit={sendMessage}
                            className="flex space-x-1 py-2"
                        >
                            <input
                                className="w-5/6 p-2 rounded-lg bg-green-500/20 focus:outline-none"
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                required
                            />
                            <button
                                type="submit"
                                className="w-1/6 p-2 rounded-lg bg-green-500/20"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messenger;
