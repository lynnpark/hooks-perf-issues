## Hooks performance test

Here is an example of how I have found hooks can occasionally cause performance problems. This does not mean that hooks should be avoided, just that performance with hooks needs to managed carefully.

This demo was modelled off a real world performance issue I was tasked to solve where we had special URL qualification logic that took a long time as our app was writing out special hrefs to link tags.

## Run as hook

```
yarn build-hooks
yarn serve
```

<img src="example.png" />

Click on a blue square. Eventually the yellow square next to it should turn white.

Notice clicks take roughly 940-1090ms to propagate

<img src="hooks.png" />

## Run as class

```
yarn build-class
yarn serve
```

Click on a blue square. Again eventually the yellow square next to it should turn white.

Notice clicks take roughly 220-320ms to propagate

<img src="class.png" />

## What's the difference?

Basically hooks are slower because they break the `React.memo()` cache on downstream components by recreating callbacks when the state changes.

Our hooks App implementation works like so:

```js
function App() {
  const [isYellow, setIsYellow] = useState(true);

  const handleClick = useCallback(() => {
    setIsYellow(!isYellow);
  }, [isYellow]);

  return (
    <>
      <h1>App.hooks.js</h1>
      <Box isYellow={isYellow} depth={12} onClick={handleClick} />
    </>
  );
}
```

Our class implementation works like so:

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isYellow: true
    };
  }

  handleClick = () => {
    this.setState(({ isYellow }) => ({
      isYellow: !isYellow
    }));
  };

  render() {
    const isYellow = this.state.isYellow;
    const handleClick = this.handleClick;
    return (
      <>
        <h1>App.class.js</h1>
        <Box isYellow={isYellow} depth={12} onClick={handleClick} />
      </>
    );
  }
}
```

The other components in the tree remain the same.

Our memoized component is the Button component:

```js
export default memo(({ onClick }) => {
  // do some expensive work calculating the button guarded by the memo
  let work = 0.5;
  for (let i = 0; i < 10000; i++) {
    work = (work + Math.random()) / 2;
  }
  return <div style={style} onClick={onClick} />;
});
```
