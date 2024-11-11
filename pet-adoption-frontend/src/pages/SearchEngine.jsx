import React from 'react'
import Head from "next/head";
import { Button, Stack } from "@mui/material";
import TitleBar from "@/components/TitleBar";

const DogPress = () => {
    alert('You Like DOGS!');
}
const CatPress = () => {
    alert('You Like CATS!');
}
const OtherPress = () => {
    alert('You are LOST!');
}
function DogButton() {
    return (
        <button className="styled-button" onClick={DogPress}>
            I prefer Dogs
        </button>
    );
}
function CatButton() {
    return (
        <button className="styled-button" onClick={CatPress}>
            I prefer Cats
        </button>
    );
}
function OtherButton() {
    return (
        <button className="styled-button" onClick={OtherPress}>
            I prefer Another Species
        </button>
    );
}
const SearchEngine = () => {

    return (
        <div>
            <h1>Welcome to the Search Engine Page!</h1>
            <h3 >Please select your preference:</h3>
            <Stack direction={"row"} spacing={2}>
                <DogButton />
                <CatButton />
                <OtherButton />
            </Stack>
            <p></p>
        </div>


    )
}

export default SearchEngine
