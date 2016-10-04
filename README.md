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

The Component Pane on the left side of the Monitor presents a list of all the components in your app that are currently or were formerly mounted. Colored dots appear in the leftmost column if the component's props or state changed during the last render (blue dots for props, green for state). The **Rendered** column shows how many times the component has been rendered since mounting. The **Warnings** column shows the number of times that **Visible React** has prevented a component from unnecessarily rerendering when its props and state have not changed.

The Lifecycle Pane on the right side of the monitor provides a visualization of the selected component's lifecycle events. The three columns of cards represent the three possible types of lifecycle activity: intial mounting, updating, and unmounting. Each card represents a lifecycle method, and a glow effect shows which methods were called as part of the component's last lifecycle activity. Each Method Card provides the following information.

* A green box indicates whether the state can be set within the method.
* The card lists all the props and state variables available in the method and shows the values they had the last time that method was called. Click on a value to see its complete JSON.
* If a new props or state value is different from the old one (eg., `nextProps` compared to `this.props`), both values are shown. If they are the same, only a single value is shown for both variables. The popup JSON view shows a line-by-line diff of any differences between old and new values.
* Colored text (blue for props, greem for state) shows where in the lifecylce any data changes have been introduced.
* The **Times called** field shows the number of times the method has been called since mounting.
* A large blue dot ( ![icon showing that method exists](images/blue-dot.png) ) to the left of the method name indicates that the method is called by the underlying wrapped component.
* At the bottom of the **shouldComponentUpdate** card a warning will appear if **Visible React** has prevented a component from unnecessarily rerendering when its props and state have not changed.
* At the bottom of the **componentDidMount** and **componentDidUpdate** cards a warning will appear if `setState` was called within these methods, indicating that the extra rerender this causes may have been unnecessary.

## Life Insurance

By default, React rerenders a component every time the props or state are updated, even if the actual data hasn’t changed. These unnecessary rerenders can slow performance if the component is large or has a lot of children (which will also rerender), or if multiple rerenders occur in quick succession.

React provides a preventative measure for this 'rerenderitis' in the form of the `shouldComponentUpdate` method. You can use it to evaluate the component’s state and props, and if nothing has changed, you can return false from the method to prevent a rerender.

There are complications, though. If the data structure is deeply nested you’ll have to do a deep comparison to avoid a false negative, unless you’re using immutable data structures. A deep compare on a very large data structure could potentially take longer than the rerender it is potentially preventing.

This is where **Visible React** comes in. It provides a feature called Life Insurance, which by default performs the following functions.

1. Overrides `shouldComponentUpdate` in every wrapped component
1. Intercepts the returned value
1. If an existing `shouldComponentUpdate` method returns false, Life Insurance returns false
1. Otherwise it deep compares the new and old props and states
1. Returns false if there are no changes
1. Provides warnings in the Visible React Monitor if unnecessary rerenders have been prevented

You can gain very fine-tuned control over Life Insurance behavior by setting variables in your build. (See below.)

## Configuring Visible React

### Quick Start

If you include the following line in a Gulp task in your build, **Visible React** will determine 'development' or 'production' mode from your NODE_ENV variable or from the default value you pass to the `stringify` function ('development' in the example below). By default, monitoring and preventive comparison will be active in 'development' and everything will be disabled in 'production.' 

```javascript
gulp.task('set-vr', function() {
	gulp.src('dist/index.js')
        .pipe(replace('process.env.NODE_ENV', process.env.NODE_ENV || JSON.stringify('development')))
        .pipe(gulp.dest('dist'));
```

To activate preventive comparison in 'production' mode, make the following addition.

```javascript
gulp.task('set-vr', function() {
	gulp.src('dist/index.js')
        .pipe(replace('process.env.NODE_ENV', process.env.NODE_ENV || JSON.stringify('development')))
        .pipe(replace('process.env.VR_PROD_CONTROL', JSON.stringify('all')))
        .pipe(gulp.dest('dist'));
```

When Life Insurance is active in production, by default it will perform a preventive shallow compare on each component. This is the same functionality as that provided by React's pureRenderMixin, except that Life Insurance doesn't override a false value that is returned from an existing `shouldComponentUpdate` method. See below for more configuration details.

### Global Configuration

You can use a build tool such as Gulp to pass variables to **Visible React** to configure its features. The following four variables determine which features are active in which components, and they all accept the same three values. A value of *'all'* will enable the feature in all components; *'none'* will disable it in all components; *'seletected'* will enable it only where specified by a local configuration setting. (See below for setting local configuration options.)

**enabled** *'all'|'selected'|'none'*
Whether **Visible React** is enabled. If set to *'none'*, the following features will all be disabled and the `Visible` function will noninvasively pass values through to the wrapped component.
**monitor:** *'all'|'selected'|'none'*
Whether or not to display the Monitor Window.
**logging:** *'all'|'selected'|'none'*
Whether to log messages to the browser console for each lifecycle event and setState call.
**controlRender** *'all'|'selected'|'none'*
Whether to prevent component rerenders if props or state have not changed.

An additional variable determines the type of comparison that **Visible React** performs.

**comparison** *'none'|'shallow'|'deep'*

There are two ways of passing these variables to **Visible React.** 

#### Setting Development/Production Values

Normally you will want to have one configuration for development and one for production that disables the dev tools. It's easy to accomplish a conditional configuration with a Grunt task, and you can set the relevant configuration options either in environement variables or directly in Grunt. The following Grunt task will configure **Visible React** using the values found in the specified environement variables. If the variables are not set, it will use the default values specified in the task. (Requires `gulp-replace`.) The default values shown below are the ones that **Visible React** currently defaults to, so you need only include pipes for values you wish to depart from the built-in defaults;

```javascript
var replace = require('gulp-replace');

gulp.task('set-vr', function() {

	gulp.src('dist/index.js')
	
	    // Sets Visible React's mode to either the value of NODE_ENV or 'development'
		.pipe(replace('process.env.NODE_ENV', process.env.NODE_ENV || JSON.stringify('development')))
		
		// These values take effect if NODE_ENV === 'development'
		.pipe(replace('process.env.VR_DEV_ENABLED', process.env.VR_DEV_ENABLED || JSON.stringify('all')))
		.pipe(replace('process.env.VR_DEV_MONITOR', process.env.VR_DEV_MONITOR || JSON.stringify('all')))
		.pipe(replace('process.env.VR_DEV_LOGGING', process.env.VR_DEV_LOGGING || JSON.stringify('none')))
		.pipe(replace('process.env.VR_DEV_CONTROL', process.env.VR_DEV_CONTROL || JSON.stringify('all')))
		.pipe(replace('process.env.VR_DEV_COMPARE', process.env.VR_DEV_COMPARE || JSON.stringify('deep')))

        // These values take effect if NODE_ENV === 'production'
		.pipe(replace('process.env.VR_PROD_ENABLED', process.env.VR_PROD_ENABLED || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_MONITOR', process.env.VR_PROD_MONITOR || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_LOGGING', process.env.VR_PROD_LOGGING || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_CONTROL', process.env.VR_PROD_CONTROL || JSON.stringify('none')))
		.pipe(replace('process.env.VR_PROD_COMPARE', process.env.VR_PROD_COMPARE || JSON.stringify('shallow')))
	
		.pipe(gulp.dest('dist'));
		
});
```

If there are no environement variables, you can just directly specify the values as follows:

```javascript
.pipe(replace('process.env.VR_DEV_ENABLED', JSON.stringify('all')))
.pipe(replace('process.env.VR_DEV_MONITOR', JSON.stringify('all')))
```

#### Setting Absolute Values

An alternative approach to configuration is hardcode values into each of your builds. The following Gulp task sets values that don't depend on NODE_ENV and will in fact override any settings connected specifically with 'development' or 'production'.

```javascript
gulp.task('vr-settings', function() {

	gulp.src('dist/index.js')

		.pipe(replace('process.env.VR_ENABLED', process.env.VR_ENABLED || JSON.stringify('all')))
		.pipe(replace('process.env.VR_MONITOR', process.env.VR_MONITOR || JSON.stringify('all')))
		.pipe(replace('process.env.VR_LOGGING', process.env.VR_LOGGING || JSON.stringify('none')))
		.pipe(replace('process.env.VR_CONTROL', process.env.VR_CONTROL || JSON.stringify('all')))
		.pipe(replace('process.env.VR_COMPARE', process.env.VR_COMPARE || JSON.stringify('shallow')))
		
		.pipe(gulp.dest('dist'));
		
});
```

### Local Configuration

For more fine-grained control, you can pass arguments to the `Visible` wrapper function to control how **Visible React** handles individual components. You can configure a component by passing a configuration object as an argument to the `Visible` function. The supported variables correspond to the build-level variables, but most of them accept boolean values, since they apply only to a single component.

**enabled** *true|false*
Whether **Visible React** is enabled for the component.
**monitor:** *true|false*
Whether or not to include the component in the Monitor Window display.
**logging:** *true|false*
Whether to log messages to the browser console for the component.
**compare** *'none'|'shallow'|'deep'*
Type of comparison to perform for the component.

Local configuration is useful to log calls only from selected components. If you notice that **Visible React** is degrading the performance of your application, you can improve performance by including only selected components in the monitoring. Below is an example.
 
```javascript
const options = {
    enabled: true,
    monitor: true,
    logging: true,
    compare: 'shallow'
}
export default Visible(options)(MyWidget);
```

### Configuration Examples

Enables logging in development mode (monitoring is enabled by default) and does a shallow preventive compare in production mode.

```javascript
gulp.task('set-vr', function() {
	gulp.src('dist/index.js')
		.pipe(replace('process.env.NODE_ENV', process.env.NODE_ENV || JSON.stringify('development')))
		.pipe(replace('process.env.VR_DEV_LOGGING', JSON.stringify('all')))
		.pipe(replace('process.env.VR_PROD_CONTROL', JSON.stringify('all')))
		.pipe(replace('process.env.VR_PROD_COMPARE', JSON.stringify('shallow')))
		.pipe(gulp.dest('dist'));
});
```

Disables monitoring regardless of mode and performs a preventive deep compare in MyWidget.js

```javascript
// In gulpfile.js
gulp.task('set-vr', function() {
	gulp.src('dist/index.js')
		.pipe(replace('process.env.VR_MONITOR', JSON.stringify('none')))
		.pipe(replace('process.env.VR_CONTROL', JSON.stringify('selected')))
		.pipe(gulp.dest('dist'));
});

// In MyWidget.js
const options = {
    enabled: true,
    compare: 'deep'
}
export default Visible(options)(MyWidget);
```


### License

[MIT](LICENSE)  
Copyright (c) 2016 [Robert Kendall](http://robertkendall.com)