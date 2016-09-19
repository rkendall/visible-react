# Visible React [Prerelease Version]

See a visual representation of the component lifecycle events as they occur in your React application. Analyze and correct performance lags caused by unnecessary component rerenders.

[Try out the demo](https://rawgit.com/rkendall/visible-react/master/demo/dist/demo.html)
(Your popup blocker must be disabled)

[This tool has not yet been tested on versions of React prior to 15 or on browsers other than Chrome and Firefox.]

## What Is Visible React?

Include **Visible React** in your React project, and a monitor window will open whenever your project launches in dev mode. (You must disable your browser's popup blocker to enable the window.) The monitor provides a visualization of the lifecycle events in every component mounted in your app. It will also warn you about components that are rerendering uncessarily, potentially slowing performance. In production mode, it will provide a means for avoiding these unnecessary rerenders.

## Why Visible React?

#### Learning

Creating full-featured, efficient components in React requires a thorough understanding of the component rendering lifecycle and the methods associated with lifecycle events. The React lifecycle can be confusing even to experienced React users, however, because of its complexity. There are different events for the initial render and subsequent rerenders. You can set the component's state inside some lifecycle methods but not others, and optimal performance depends upon setting the state in the correct places. You have to know which of the available versions of props and state to read at any given point in the lifecycle. **Visible React** clarifies these issues by means of detailed visualizations.

#### Debugging

In the **Visible React** Monitor, trace the flow of props and states through the different components of your app, view and diff props/state values, and see which lifecycle events have been triggered. In the browser console, view a log of all the lifecycle events triggered by your components.

#### Performance Analysis 
Your app can be slowed by unnecessary rerenders that are normally very difficult to identify. **Visible React** finds these performance bottlenecks for you.

#### Performance Enhancement

**Visible React** provides a global solution for preventing many unnecessary rerenders by overriding the `shouldComponentUpdate` method.

## Adding It to Your Project

Install from NPM.

`npm install visible-react --save`

Import **Visible React** into each component you want to monitor.

`import Visible from 'visible-react';`

or

`var Visible = require('visible-react');`

Wrap the component's export in the `Visible` function.
 
`export default Visible()(MyWidget);`

If the component has other wrappers, wrap it with Visible first.

`export default Radium(Visible()(MyWidget));`


## The Visible React Monitor

The Component Pane on the left side of the Monitor presents a list of all the components in your app that are currently or were formerly mounted. Colored dots appear in the leftmost column if the component's props or state changed during the last render (blue dots for props, green for state).

The Lifecycle Pane on the right side of the monitor provides a visualization of the selected component's lifecycle events. The three columns of cards represent the three possible types of lifecycle activity: intial mounting, updating, and unmounting. Each card represents a lifecycle method, and a glow effect shows which methods were called as part of the component's last lifecycle activity. Each Method Card provides the following information.

* A green box indicates whether the state can be set within the method.
* The card lists all the props and state variables available in the method and shows the values they had the last time that method was called. Click on a value to see its complete JSON.
* If a new props or state value is different from the old one (eg., `nextProps` compared to `this.props`), both values are shown. If they are the same, only a single value is shown for both variables. The popup JSON view shows a line-by-line diff of any differences between old and new values.
* Colored text (blue for props, greem for state) shows where in the lifecylce any data changes have been introduced.
* The **Times called** field shows the number of times the method has been called since mounting.
* A large blue dot ( ![icon showing that method exists](images/blue-dot.png) ) to the left of the method name indicates that the method is called by the underlying wrapped component.

## Life Insurance

By default, React rerenders a component every time the props or state are updated, even if the actual data hasn’t changed. These unnecessary rerenders can slow performance if the component is large or has a lot of children (which will also rerender), or if multiple rerenders occur in quick succession.

React provides a preventative measure for this 'rerenderitis' in the form of the `shouldComponentUpdate` method. You can use it to evaluate the component’s state and props, and if nothing has changed, you can return false from the method to prevent a rerender.

There are complications, though. If the data structure is deeply nested you’ll have to do a deep comparison to avoid a false negative, unless you’re using immutable data structures. A deep compare on a very large data structure could potentially take longer than the rerender it is potentially preventing.

This is where **Visible React** comes in. It provides a feature called Life Insurance, which performs the following functions in dev mode (`process.env.NODE_ENV === 'development'`).

1. Overrides `shouldComponentUpdate` in every wrapped component
1. Intercepts the returned value
1. If an existing `shouldComponentUpdate` method returns false, Life Insurance returns false
1. Otherwise it deep compares the new and old props and states
1. Returns false if there are no changes
1. Provides warnings in the Visible React Monitor if unnecessary rerenders have been prevented

[This behavior will be enhanced to support either shallow or deep comparison.]

If `process.env.NODE_ENV` is set to `'production'` instead of `'development'`, the behavior will change as follows.

* Life Insurance will perform a shallow rather than a deep compare.
* The **Visible React** Monitor will be disabled, so there will be no warnings.
 
This functionality is the same as that provided by React's pureRenderMixin, except that Life Insurance doesn't override a false value that is returned from an existing `shouldComponentUpdate` method.

## Configuring Visible React

You can configure Visible React in development mode by passing a configuration object as an argument to `Visible()`. Include the argument the first time `Visible()` is called--that is, when wrapping the first-loaded component.
 
```javascript
const options = {
    monitor: false,
    logging: false
}
export default Visible(options)(MyWidget);
```

The possible configuration options are as follows.

**monitor:** *true|false*
Whether or not to display the Monitor Window in development mode. The Monitor Window is never displayed in production mode.
**logging:** *true|false*
Whether to log messages for each lifecycle event to the browser console.

### License

[MIT](LICENSE)  
Copyright (c) 2016 [Robert Kendall](http://robertkendall.com)