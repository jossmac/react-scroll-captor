# 📜 React Scroll Captor

A component that confines scroll events to its immediate child. Great for dropdown menus etc.

### Install

```bash
yarn add react-scroll-captor
```

### Use

```jsx
import ScrollCaptor from 'react-scroll-captor';

class GroovyThing extends Component {
  atBottom = () => {
    // user has scrolled to the bottom
  }
  render () {
    return (
      <ScrollCaptor onBottomArrive={this.atBottom}>
        <ScrollableElement />
      </ScrollCaptor>
    );
  }
}
```

### Props

| Property         | Type       | Default    | Description |
| ---------------- | ---------- | ---------- | ----------- |
| `isEnabled`      | `boolean`  | `true` | Enable or disable the component. |
| `onBottomArrive` | `function` | --     | Called when the user reaches the bottom of the scrollable element. |
| `onBottomLeave`  | `function` | --     | Called when the user leaves the bottom of the scrollable element. |
| `onTopArrive`    | `function` | --     | Called when the user reaches the top of the scrollable element. |
| `onTopLeave`     | `function` | --     | Called when the user leaves the top of the scrollable element. |
