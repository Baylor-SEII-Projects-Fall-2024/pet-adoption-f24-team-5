// tokenUtils.jsx
export function getPayloadFromToken(token) {
    try {
        const base64Url = token.split('.')[1]; // Get the payload part of the token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Handle URL-safe base64
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload); // Return the entire payload as an object
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}

export function getSubjectFromToken(token) {
    const payload = getPayloadFromToken(token);
    return payload ? payload.sub : null; // Return the subject (email or identifier)
}

export function getAuthorityFromToken(token) {
    const payload = getPayloadFromToken(token);
    return payload ? payload.authorities : null; // Return the authorities (user type)
}
