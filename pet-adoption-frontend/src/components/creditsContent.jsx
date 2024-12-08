import React from "react";

const CreditsPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Our Story</h1>
                <p style={styles.description}>
                    At DogPile Solutions, we strive to revolutionize pet adoption through innovative technology. Here's an exclusive look at our journey and contributors.
                </p>
            </div>
            <div style={styles.iframeContainer}>
                <iframe
                    src="https://gamma.app/embed/gzhsmxzf8cl5tox"
                    style={styles.iframe}
                    allow="fullscreen"
                    title="DogPile Solutions: Revolutionizing Pet Adoption"
                >Presentation</iframe>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        backgroundColor: "#f9f9f9",
        color: "#333",
        textAlign: "center",
        minHeight: "100vh",
    },
    header: {
        marginBottom: "30px",
    },
    title: {
        fontSize: "36px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    description: {
        fontSize: "18px",
        lineHeight: "1.6",
        marginBottom: "20px",
    },
    iframeContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 250px)",
    },
    iframe: {
        width: "75%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: "100%",
        border: "none",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
    },
};

export default CreditsPage;