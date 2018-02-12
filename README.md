# React Node Resolver

A generic technique for resolving the DOM node of any react component.

### Install

```bash
yarn add react-node-resolver
```

### Use

```jsx
import NodeResolver from 'react-node-resolver';

class ObfuscatedComponent extends Component {
  render() {
    return <div id="inaccessible-node" />;
  }
}

class GroovyThing extends Component {
  getNode = (ref) => {
    console.log(ref); // <div id="inaccessible-node" />
  }
  render () {
    return (
      <NodeResolver innerRef={this.getNode}>
        <ObfuscatedComponent />
      </NodeResolver>
    );
  }
}
```
