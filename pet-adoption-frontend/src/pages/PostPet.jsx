import React from 'react'

const PostPet = () => {
    const [species, setSpecies] = React.useState('');
    const [petName, setPetName] = React.useState('');
    const [breed, setBreed] = React.useState('');
    const [color, setColor] = React.useState('');
    const [age, setAge] = React.useState('');
    const [adoptionStatus, setStatus] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [pets, setPets] = React.useState(
        {name: "Pet name", image: "image of pet", description: "description of pets"}
    );
    const [postNewPet, setPostNewPet] = React.useState(false);



    return (
        <div>
            <h1>Post a Pet for Adoption Here</h1>
        </div>
    )
}

export default PostPet