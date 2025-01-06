/**
 * Get a universally unique id (uuid).
 *
 * @returns {String} - The uuid.
 */
const create_uuid = () => {
    let uuid;
    if (window.crypto.randomUUID) {
        // Create a real UUID
        // window.crypto.randomUUID does only exist in browsers with secure
        // context.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
        uuid = window.crypto.randomUUID();
    } else {
        // Create a sufficiently unique ID
        const array = new Uint32Array(4);
        uuid = window.crypto.getRandomValues(array).join("");
    }
    return uuid;
};
export default create_uuid;
