export const updateInitialWidth = (autoWidth) => (state, props) => {
    return {
        initialWidth: props.initialWidth || autoWidth,
    };
};

export const nextStep = (state, props) => {
    return {
        currentWord: (state.currentWord + 1) % props.options.length,
    };
};