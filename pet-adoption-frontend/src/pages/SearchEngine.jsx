import React from 'react'
import Head from "next/head";
import {Button, Stack} from "@mui/material";

function DogButton(){
    return (
      <button className="styled-button">
          I prefer Dogs
      </button>
    );
}
function CatButton(){
    return (
      <button className="styled-button">
          I prefer Cats
      </button>
    );
}
function OtherButton(){
    return (
        <button className="styled-button">
            I prefer Another Species
        </button>
    );
}
const SearchEngine = () => {
    return (
        <div>
            <h1>Welcome to the Search Engine Page!</h1>
            <h3>Please select your preference:</h3>
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
