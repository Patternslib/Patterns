const change_event = () => {
    return new Event("change", {
        bubbles: true,
        cancelable: false,
    });
};

const input_event = () => {
    return new Event("input", {
        bubbles: true,
        cancelable: false,
    });
};

const submit_event = () => {
    return new Event("submit", {
        bubbles: true,
        cancelable: true,
    });
};

export default {
    change_event: change_event,
    input_event: input_event,
    submit_event: submit_event,
};
