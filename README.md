## react-text-loop

![text-loop2](https://cloud.githubusercontent.com/assets/38172/24254063/d5e9c38c-0fd9-11e7-9b75-46dc00421cd7.gif)

An animated loop of text nodes for your headings. Uses
[react-motion](https://github.com/chenglou/react-motion) for the transition so it handles super fast
animations and spring params.

[![npm version][version-badge]][npm]
[![npm downloads][downloads-badge]][npm]
[![gzip size][size-badge]][size]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]

---

## Installation

`npm install react-text-loop` or `yarn add react-text-loop`

## How to use

[![Edit react-text-loop][codesandbox-badge]][codesandbox]

You can also run the examples by cloning the repo and running `yarn start`.

### Usage

```jsx
import TextLoop from "react-text-loop";
import Link from "react-router";
import { BodyText } from "./ui";

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
| interval       | number \| array | `3000`                            | The frequency (in ms) that the words change. Can also pass an array if you want a different interval per children |
| delay       | number | `0`                            | A delay (in ms) for the animation to start. This allows to use multiple instances to create a staggered animation effect for example. |
| adjustingSpeed | number          | `150`                             | The speed that the container around each word adjusts to the next one (in ms). Usually you don't need to change this.                                                                 |
| fade           | boolean         | `true`                            | Enable or disable the fade animation on enter and leave                                                                                       |
| mask           | boolean         | `false`                           | Mask the animation around the bounding box of the animated content                                                                            |
| noWrap           | boolean         | `true`                           | Disable `whitepace: nowrap` style for each element. This is used by default so we can always get the right width of the element but can have issues sometimes. |
| springConfig   | object          | `{ stiffness: 340, damping: 30 }` | Configuration for [react-motion spring](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig) |
| className | string | | Any additional CSS classes you might want to use to style the image |
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
<TextLoop interval={100}>...</TextLoop>;
```

### Wobbly animation

![text-loop-bouncy](https://cloud.githubusercontent.com/assets/38172/24275347/b0e45b2c-1026-11e7-8e04-04bdafdef249.gif)

```jsx
<TextLoop springConfig={{ stiffness: 180, damping: 8 }}>...</TextLoop>;
```

For many other examples, please have a look at the [CodeSandbox playground][codesandbox].

## Contributing

Please follow our
[contributing guidelines](https://github.com/braposo/react-text-loop/blob/master/CONTRIBUTING.md).

## License

[MIT](https://github.com/braposo/react-text-loop/blob/master/LICENSE)

[npm]: https://www.npmjs.com/package/react-text-loop
[license]: https://github.com/braposo/react-text-loop/blob/master/LICENSE
[prs]: http://makeapullrequest.com
[size]: https://unpkg.com/react-text-loop/dist/react-text-loop.min.js
[version-badge]: https://img.shields.io/npm/v/react-text-loop.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/react-text-loop.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-text-loop.svg?style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/react-text-loop/dist/react-text-loop.min.js?compression=gzip&style=flat-square
[modules-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-green.svg?style=flat-square
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[codesandbox-badge]: https://codesandbox.io/static/img/play-codesandbox.svg
[codesandbox]: https://codesandbox.io/s/react-text-loop-playground-br4q1
