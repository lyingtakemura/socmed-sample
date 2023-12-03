import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function MessengerComponent(props) {
    const [input, setInput] = useState("");
    const [rooms, setRooms] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [websocket, setWebsocket] = useState("");
    const authenticated = useSelector((state) => state.authenticated.user);

    useEffect(() => {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/rooms/`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        if (selectedRoom) {
            let websocket = new WebSocket(
                `ws://${window.location.hostname}:8000/ws/chat/${selectedRoom.id}?token=${authenticated.token}`,
            );
            setWebsocket(websocket);

            websocket.onmessage = (e) => {
                let event = JSON.parse(e.data);
                if (event.room === selectedRoom.id) {
                    let room = { ...selectedRoom };
                    room.messages = [...room.messages, event];
                    setSelectedRoom(room);
                }
            };
        }
    }, [authenticated, selectedRoom]); // without second param useEffect will stuck in update loop

    function lastMessagePreview(room) {
        if (room.messages.length >= 1) {
            return room.messages[room.messages.length - 1].body.slice(0, 30);
        } else {
            return "No Messages";
        }
    }

    function formatMessageDatetime(input) {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            hour: "2-digit",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        const date = new Date(input);
        const result = formatter.format(date);
        return result;
    }

    function sendMessage(event) {
        event.preventDefault();
        websocket.send(
            JSON.stringify({
                body: input,
                room: selectedRoom.id,
                sender: authenticated.id,
            }),
        );
        setInput("");
    }

    function selectRoom(event, room) {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/rooms/${room.id}`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                setSelectedRoom(response.data);
            });
    }

    return (
        <div className="flex font-bold w-1/2 mx-auto space-x-1 h-[calc(100%-10%)] mt-1">
            <div className="w-1/3 messenger-column scrollbar-hide">
                {rooms &&
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={(event) => selectRoom(event, room)}
                            className={`border-2  m-1 ${
                                selectedRoom.id === room.id
                                    ? "bg-green-500/20 border-gray-400"
                                    : "border-gray-300"
                            } mb-1 p-2 rounded-lg hover:bg-green-500/20`}
                        >
                            <div className="flex space-x-1">
                                <div>
                                    {room.users
                                        .filter((user) => user.id !== authenticated.id)
                                        .map((user) => user.username)}
                                    <br />
                                    <div className="text-xs text-black/50">
                                        {lastMessagePreview(room)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="w-2/3 messenger-column scrollbar-hide">
                <div className="max-h-screen min-h-screen m-1">
                    {selectedRoom["messages"] &&
                        selectedRoom["messages"].map((message) => (
                            <div
                                className={`flex ${
                                    message.sender === authenticated.id
                                        ? "flex-row-reverse"
                                        : ""
                                } last:mb-48`}
                                key={message.id}
                            >
                                <div
                                    className="border-2 border-gray-400 p-2 mb-1 rounded-lg w-1/2
                                    bg-green-500/20"
                                    key={message.id}
                                >
                                    <div>{message.body}</div>
                                    <div className="text-xs text-black/50">
                                        {formatMessageDatetime(message.created_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                {selectedRoom && (
                    <div className="sticky bottom-0 w-full bg-gray-300">
                        <form
                            onSubmit={sendMessage}
                            className="flex space-x-1 border-t-2 border-gray-400 mx-1"
                        >
                            <input
                                className="input"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                required
                            />
                            <button type="submit" className="button w-1/6">
                                SEND
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
