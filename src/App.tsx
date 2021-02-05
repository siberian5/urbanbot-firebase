import React, { useState } from 'react';
import fs from 'fs';
import { Route, Router, Text, ButtonGroup, Button, useText, Image } from '@urban-bot/core';
import logo from './assets/logo.png';
import { dataClient } from "./index";
import FirebaseHandler from "./data/firebase/FirebaseHandler";

function Echo() {
    const [text, setText] = useState('Say something');

    useText(({ text, chat }) =>  {
      async function load() {
      const tasks = await (await FirebaseHandler.create( await dataClient)).listUnfinishedUserTasks(Number(chat.id), 20)
        console.log(`tasks: ${JSON.stringify(tasks)}`)
    }
    load().then(_=>{})


      setText(text);
    });

    return (
        <Text>
            <i>{text}</i>
        </Text>
    );
}

function Logo() {
    const [title, setTitle] = useState('Urban Bot');

    const addRobot = () => {
        setTitle(title + '🤖');
    };

    return (
        <Image
            title={title}
            file={fs.createReadStream(logo)}
            buttons={
                <ButtonGroup>
                    <Button onClick={addRobot}>Add robot</Button>
                </ButtonGroup>
            }
        />
    );
}

export function App() {
    return (
        <>
            <Text>Welcome to Urban Bot! Type /echo or /logo.</Text>
            <Router>
                <Route path="/echo">
                    <Echo />
                </Route>
                <Route path="/logo">
                    <Logo />
                </Route>
            </Router>
        </>
    );
}
