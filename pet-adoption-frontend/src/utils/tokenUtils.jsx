// tokenUtils.jsx
export function getSubjectFromToken(token) {
    try {
        const base64Url = token.split('.')[1]; // Get the payload part of the token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Handle URL-safe base64
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const payload = JSON.parse(jsonPayload);
        return payload.sub; // Return the subject (email or identifier)
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
