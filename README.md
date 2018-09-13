## react-text-loop

![text-loop2](https://cloud.githubusercontent.com/assets/38172/24254063/d5e9c38c-0fd9-11e7-9b75-46dc00421cd7.gif)

An animated loop of text nodes for your headings. Uses
[react-motion](https://github.com/chenglou/react-motion) for the transition so it handles super fast
animations and spring params.

---

## Installation

`npm install react-text-loop` || `yarn add react-text-loop`

## How to use

### Code

```jsx
import TextLoop from "react-text-loop";

class App extends Component {
    render() {
        return (
            <h2>
                <TextLoop>
                    <span>First item</span>
                    <Link to="/">Second item</Link>
                    <BodyText>Third item</BodyText>
                </TextLoop>{" "}
                and something else.
            </h2>
        );
    }
}
```

### Props

| Prop           | Type            | Default                           | Definition                                                                                                                                    |
| -------------- | --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| interval       | number          | `3000`                            | The frequency (in ms) that the words change.                                                                                                  |
| adjustingSpeed | number          | `150`                             | The speed that the container around each word adjusts to the next one (in ms)                                                                 |
| fade           | boolean         | `true`                            | Enable or disable the fade animation on enter and leave                                                                                       |
| mask           | boolean         | `false`                           | Mask the animation around the bounding box of the animated content                                                                            |
| springConfig   | object          | `{ stiffness: 340, damping: 30 }` | Configuration for [react-motion spring](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig) |
| style          | object or array |                                   | Any additional styles you might want to send to the wrapper. Uses glamor to process it so you can send either objects or arrays.              |
| children       | node            |                                   | The words you want to loop (required)                                                                                                         |

### Caveats

Because `<TextLoop>` loops through its children nodes, only root-level nodes will be considered so
doing something like:

```jsx
<TextLoop>
    <div>
        <span>First item</span>
        <span>Second item</span>
    </div>
    <div>Third item</div>
</TextLoop>;
```

will make first and second item to be treated as one and animate together.

You can also just send a normal array as children prop if you don't need any individual styling for
each node.

```jsx
<TextLoop children={["Trade faster", "Increase sales", "Stock winners", "Price perfectly"]} />;
```

## Examples

### Fast transition

![text-loop-fast-small](https://cloud.githubusercontent.com/assets/38172/24275301/5d48c6e2-1026-11e7-85b8-e7cfe07f4714.gif)

```jsx
<TextLoop speed={100}>...</TextLoop>;
```

### Wobbly animation

![text-loop-bouncy](https://cloud.githubusercontent.com/assets/38172/24275347/b0e45b2c-1026-11e7-8e04-04bdafdef249.gif)

```jsx
<TextLoop springConfig={{ stiffness: 180, damping: 8 }}>...</TextLoop>;
```

## Contributing

Please follow our
[contributing guidelines](https://github.com/EDITD/react-text-loop/blob/master/CONTRIBUTING.md).

## License

[MIT](https://github.com/EDITD/react-text-loop/blob/master/LICENSE)
