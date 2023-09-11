import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export function Messenger(props) {
    const [messageBody, setMessageBody] = useState("");
    const [rooms, setRooms] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [wsMessenger, setWsMessenger] = useState("");
    const authenticated = useSelector((state) => state.authenticated.user);

    useEffect(() => {
        if (selectedRoom) {
            let wsMessenger = new WebSocket(
                `ws://${window.location.hostname}:8000/ws/chat/${selectedRoom.id}?token=${authenticated.token}`,
            );
            setWsMessenger(wsMessenger);

            wsMessenger.onmessage = (e) => {
                /*
                create messages copy array and push new message
                replace local state with updated copy
                */
                let event = JSON.parse(e.data);
                if (event.room === selectedRoom.id) {
                    let room = { ...selectedRoom };
                    room.messages = [...room.messages, event];
                    setSelectedRoom(room);
                }
            };
            // ws.onerror = (e) => {
            //     console.log(e);
            // };
            // ws.onclose = (e) => {
            //     console.log(e);
            // };
        }
    }, [authenticated, selectedRoom]); // without second param useEffect will stuck in update loop

    const last_message_preview = (room) => {
        if (room.messages.length >= 1) {
            return room.messages[room.messages.length - 1].body.slice(0, 30);
        } else {
            return "No Messages";
        }
    };

    const format_message_timestamp = (messageBody) => {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            hour: "2-digit",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        const date = new Date(messageBody);
        const result = formatter.format(date);
        return result;
    };

    useEffect(() => {
        // console.log(Object.keys(window.location));
        // console.log(window.location.protocol)
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
    }, [authenticated]); // useEffect will re-run whenever object in it's dependency array changes

    const send_message = (event) => {
        event.preventDefault();
        wsMessenger.send(
            JSON.stringify({
                body: messageBody,
                room: selectedRoom.id,
                sender: authenticated.id,
            }),
        );
        setMessageBody("");
    };

    const select_room = (event, room) => {
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
    };

    return (
        <div className="flex font-bold w-1/2 mx-auto space-x-1 h-[calc(100%-10%)] mt-1">
            <div
                className="w-1/3 bg-gray-300 rounded-lg p-2 max-h-screen overflow-y-scroll
             border-2 border-gray-400"
            >
                {rooms &&
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={(event) => select_room(event, room)}
                            className={`border-2 ${
                                selectedRoom.id === room.id
                                    ? "bg-green-500/20 border-gray-400"
                                    : "border-gray-300"
                            } mb-1 p-2 rounded-lg hover:bg-green-500/20`}
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
                                    {room.users
                                        .filter(
                                            (user) =>
                                                user.id !== authenticated.id,
                                        )
                                        .map((user) => user.username)}
                                    <br />
                                    <div className="text-xs text-black/50">
                                        {last_message_preview(room)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div
                className="overflow-hidden flex flex-col w-2/3 bg-gray-300 rounded-lg
              max-h-screen border-2 border-gray-400"
            >
                <div className="text-center m-1 p-2 bg-green-500/20 rounded-lg border-2 border-gray-400">
                    {selectedRoom ? (
                        selectedRoom.users
                            .filter((user) => user.id !== authenticated.id)
                            .map((user) => user.username)
                    ) : (
                        <br />
                    )}
                </div>
                <div className="mx-1 min-h-screen max-h-screen overflow-y-scroll border-t-2 border-gray-400">
                    <div className="mt-1">
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
                                            {format_message_timestamp(
                                                message.created_at,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                {selectedRoom && (
                    <div className="sticky bottom-0 w-full bg-gray-300">
                        <form
                            onSubmit={send_message}
                            className="flex space-x-1 py-1 border-t-2 border-gray-400 mx-1"
                        >
                            <input
                                className="w-5/6 p-2 rounded-lg bg-green-500/20 focus:outline-none
                                 border-2 border-gray-400"
                                value={messageBody}
                                onChange={(event) =>
                                    setMessageBody(event.target.value)
                                }
                                required
                            />
                            <button
                                type="submit"
                                className="w-1/6 p-2 rounded-lg bg-green-500/20 border-2 border-gray-400"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
