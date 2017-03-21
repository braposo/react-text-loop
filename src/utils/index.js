export const updateInitialWidth = (autoWidth) => (state, props) => {
    return {
        initialWidth: props.initialWidth || autoWidth,
    };
};