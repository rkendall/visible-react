# Visible React

See a visual representation of the component lifecycle events as they occur in your React application. Analyze and correct performance lags caused by unnecessary component rerenders.

[Try out the demo](https://rawgit.com/rkendall/visible-react/master/demo/dist/demo.html)
(Your popup blocker must be disabled)

[This tool has not yet been tested on versions of React prior to 15 or on browsers other than Chrome and Firefox.]

## What Is Visible React?

Include **Visible React** in your React project, and a Monitor Window will open when your project launches in a development environment. (You must disable your browser's popup blocker to enable the window.) The Monitor provides a visualization of the lifecycle events in every component mounted in your app, along with views of the data passing through them. It also warns you about components that are rerendering unnecessarily, potentially slowing performance. In a production environment, it optionally provides a means for avoiding these unnecessary rerenders.

## Why Visible React?

#### Learning

Creating full-featured, efficient components in React requires a thorough understanding of the component rendering lifecycle and the methods associated with lifecycle events. The React lifecycle can be confusing even to experienced React users, however, because of its complexity. There are different events for the initial render and subsequent rerenders. You have to know which of the available versions of props and state to read at any given point in the lifecycle. You can set the component's state inside some lifecycle methods but not others, and optimal performance depends upon setting the state in the correct places. Performance further depends upon preventing unnecessary rerenders by checking for changes in data. **Visible React** clarifies these issues by means of detailed visualizations.

#### Debugging

In the **Visible React** Monitor, trace the flow of props and states through the different components of your app, view and diff props/state values, see which lifecycle events have been triggered, and see whenever setState has been called. In the browser console, view a log of all the lifecycle events triggered by your components.

#### Performance Analysis 
Your app can be slowed by unnecessary rerenders that are normally very difficult to identify. **Visible React** finds these performance bottlenecks for you.

#### Performance Enhancement

**Visible React** provides a global solution for preventing many unnecessary rerenders by overriding the `shouldComponentUpdate` method.

## Adding It to Your Project

Install from NPM.

`npm install visible-react`

Import **Visible React** into each component you want to monitor.

`import Visible from 'visible-react';`

or

`var Visible = require('visible-react');`

Wrap the component's export in the `Visible` function.
 
`export default Visible()(MyWidget);`

If the component has other wrappers, wrap it with Visible first.

`export default Radium(Visible()(MyWidget));`


## The Visible React Monitor

The Component Pane on the left side of the Monitor presents a list of all the components in your app that are currently or were formerly mounted. Colored dots appear in the leftmost column if the component's props or state changed during the last render (blue dots for props, green for state). The **Rendered** column shows how many times the component has been rendered since mounting. (The value is reset upon each unmounting.) The **Warnings** column shows the number of times that **Visible React** has prevented a component from unnecessarily rerendering when its props and state have not changed. To filter the component list, type filtering text into the **Filter** field. To sort the list, click on the header of the column you wish to sort by.

The Lifecycle Pane on the right side of the monitor provides a visualization of the selected component's lifecycle events. The three columns of cards represent the three possible types of lifecycle activity: initial mounting, updating, and unmounting. Each card represents a lifecycle method, and a glow effect shows which methods were called as part of the component's last lifecycle activity. Each Method Card provides the following information.

* A yellow box around the method name indicates that the method is called by the underlying wrapped component.
* The **Times called** field shows the number of times the method has been called since mounting.
* The card lists all the props and state variables available in the method and shows the values they had the last time that method was called. Click on a value to see its complete JSON.
* If a new props or state value is different from the old one (eg., `nextProps` compared to `this.props`), both values are shown. If they are the same, only a single value is shown for both variables. The popup JSON view shows a line-by-line diff of any differences between old and new values.
* Colored text (blue for props, green for state) shows where in the lifecycle any data changes have been introduced.
* A gray box indicates whether the state can be set within the method.
* A green box around `setState` indicates that `setState` was called by the method.
* At the bottom of the **shouldComponentUpdate** card a warning will appear if **Visible React** has prevented a component from unnecessarily rerendering when its props and state have not changed.
* At the bottom of the **componentDidMount** and **componentDidUpdate** cards, a warning will appear if `setState` was called within these methods, indicating that the extra rerender this causes may have been unnecessary.

If your app is complex or uses large data sets, the **Visible React** Monitor Window may slow its performance. If this is the case, you can eliminate all or most of this performance lag by unselecting the Continuous Refresh checkbox at the left. Then click the Refresh button every time you want to refresh the contents of the Monitor Window.

## Managing Rerenders with Life Insurance

By default, React rerenders a component every time the props or state are updated, even if the actual data hasn’t changed. These unnecessary rerenders can slow performance if the component is large or has a lot of children (which will also rerender), or if multiple rerenders occur in quick succession.

React provides a preventive measure for this _rerenderitis_ in the form of the `shouldComponentUpdate` method. You can use it to evaluate the component’s state and props, and if nothing has changed, you can return false from the method to prevent a rerender. There are complications, though. If the data structure is deeply nested you’ll have to do a deep comparison to avoid a false negative, unless you’re using immutable data structures. A deep compare on a very large data structure could potentially take longer than the rerender it is preventing.

This is where **Visible React** comes in. It provides a feature called Life Insurance, which by default performs the following functions in a development environment.

1. Overrides `shouldComponentUpdate` in every wrapped component
1. Intercepts the returned value
1. If an existing `shouldComponentUpdate` method returns false, Life Insurance returns false
1. Otherwise it deep compares the new and old props and states
1. Returns false if there are no changes (preventing a rerender)
1. Provides warnings in the Visible React Monitor if unnecessary rerenders have been prevented

Life Insurance is disabled by default in production environments, but you can enable it to prevent unnecessary rerenders. See below for instructions on configuring **Visible React** and Life Insurance.

## Configuring Visible React

### Quick Start

To specify a development or production environment for **Visible React**, you must include a task in your build process to replace `process.env.NODE_ENV` in your build with the appropriate value. (This is also the recommended method for specifying the environment to React.) If no environment is specified, **Visible React** defaults to 'development.' The following example sets the environment to 'production' in a Gulp build. (Requires `gulp-replace`.)

```javascript
gulp.task('set-vr', function() {
	gulp.src('build/bundle.js')
        .pipe(replace('process.env.NODE_ENV', JSON.stringify('production')))
        .pipe(gulp.dest('dist'));
});
```

To activate preventive comparison in a 'production' environment, make the following addition. This will trigger a shallow comparison on the data going into each component and prevent any unnecessary rerenders. This is the same functionality as that provided by React's pureRenderMixin, except that Life Insurance doesn't override a false value that is returned from an existing `shouldComponentUpdate` method. See below for more configuration details.

```javascript
gulp.task('set-vr', function() {
	gulp.src('build/bundle.js')
        .pipe(replace('process.env.NODE_ENV', JSON.stringify('production')))
        .pipe(replace('process.env.VR_PROD_ENABLED', JSON.stringify('all')))
        .pipe(gulp.dest('dist'));
});
```

### Global Configuration

The following variables can be set with a build tool, as shown above. Each variable name must be prefixed with either `VR_DEV_` or `VR_PROD_` to determine which environment (development or production) it will take effect in. For example, `VR_DEV_ENABLED` determines whether **Visible React** is enabled in a development environment. The first three variables listed below all accept the same three values: _'all'_ enables the feature in all components; *'none'* disables it in all components; *'selected'* enables it only where specified by a component configuration setting. (See below for setting component configuration options.)

**ENABLED**  
*'all'|'selected'|'none'*  
Whether **Visible React** is enabled. If set to *'none'*, the features controlled by the following variables will all be disabled and the `Visible` function will noninvasively pass values through to the wrapped component without overriding any methods. Defaults to _'all'_ in development and _'none'_ in production.  
**MONITOR**  
*'all'|'selected'|'none'*  
Whether or not to display the Monitor Window. Defaults to _'all'_ in development and _'none'_ in production.  
**LOGGING**  
*'all'|'selected'|'none'*  
Whether to log messages to the browser console for each lifecycle event and setState call. Defaults to _'selected'_ in development and _'none'_ in production.  
**CONTROL**  
*'all'|'none'*  
Whether to prevent component rerenders if props or state have not changed. 'selected' is not an option for this variable. Defaults to _'all'_ in both environments.  
**COMPARE**  
*'none'|'shallow'|'deep'*  
The type of comparison to perform. If CONTROL is false, no comparison will be performed. Defaults to _'deep'_ in development and _'shallow'_ in production.  

#### Setting Variables in a Build

Normally you will want to have one configuration for development that enables the dev tools and one for production that disables them. It's easy to accomplish a conditional configuration with a Gulp task, and you can set the relevant configuration options either in environment variables or directly in Gulp. The following Gulp task will configure **Visible React** using the values found in any existing Node environment variables. If any variable is undefined, **Visible React** will use its default value. The following example will set the environment to 'production,' enable logging for all components in 'development,' and enable **Visible React** in 'production.'

```javascript
var replace = require('gulp-replace');

process.env.NODE_ENV = 'production';
process.env.VR_DEV_LOGGING = 'all';
process.env.VR_PROD_ENABLED = 'all';

gulp.task('set-vr', function() {

	gulp.src('build/bundle.js')
	
		.pipe(replace('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV) || null))

		.pipe(replace('process.env.VR_DEV_ENABLED', JSON.stringify(process.env.VR_DEV_ENABLED) || null))
		.pipe(replace('process.env.VR_DEV_MONITOR', JSON.stringify(process.env.VR_DEV_MONITOR) || null))
		.pipe(replace('process.env.VR_DEV_LOGGING', JSON.stringify(process.env.VR_DEV_LOGGING) || null))
		.pipe(replace('process.env.VR_DEV_CONTROL', JSON.stringify(process.env.VR_DEV_CONTROL) || null))
		.pipe(replace('process.env.VR_DEV_COMPARE', JSON.stringify(process.env.VR_DEV_COMPARE) || null))

		.pipe(replace('process.env.VR_PROD_ENABLED', JSON.stringify(process.env.VR_PROD_ENABLED) || null))
		.pipe(replace('process.env.VR_PROD_MONITOR', JSON.stringify(process.env.VR_PROD_MONITOR) || null))
		.pipe(replace('process.env.VR_PROD_LOGGING', JSON.stringify(process.env.VR_PROD_LOGGING) || null))
		.pipe(replace('process.env.VR_PROD_CONTROL', JSON.stringify(process.env.VR_PROD_CONTROL) || null))
		.pipe(replace('process.env.VR_PROD_COMPARE', JSON.stringify(process.env.VR_PROD_COMPARE) || null))
	
		.pipe(gulp.dest('dist'));
		
});
```

If you don't wish to set environment variables, you can accomplish the same configuration as above with the following more-concise syntax.

```javascript
gulp.task('set-vr', function() {
	gulp.src('build/bundle.js')
		.pipe(replace('process.env.NODE_ENV', JSON.stringify('production')))
		.pipe(replace('process.env.VR_DEV_LOGGING', JSON.stringify('all')))
		.pipe(replace('process.env.VR_PROD_ENABLED', JSON.stringify('all'))
		.pipe(gulp.dest('dist'));
});
```

### Component Configuration

For more fine-grained control, you can pass arguments to the `Visible` wrapper function to control how **Visible React** handles individual components. You can configure a component by passing a configuration object as an argument to the `Visible` function. The supported variables correspond to the global configuration variables, but most of them accept Boolean values, since they apply only to a single component. All values default to false, except for `compare`, which defaults to null.

**enabled**  
*true|false*  
Whether **Visible React** is enabled for the component.  
**monitor:**  
*true|false*  
Whether or not to include the component in the Monitor Window display.  
**logging:**  
*true|false*  
Whether to log messages to the browser console for the component.  
**compare**  
*'none'|'shallow'|'deep'*  
Type of comparison to perform for the component. This value will override any `compare` value specified in a build variable.  

Component configuration lets you optimize performance by specifying which type of preventive comparison to perform for each component. Shallow compares can return false negatives. Deep compares, while always accurate, are not always cost effective. Logging can be quite verbose, so it can be useful to log calls for only selected components. Enabling **Visible React** only for selected components can be useful if you find that the Monitor Window is degrading the performance of your app. Below is an example of a component configuration.
 
```javascript
const options = {
    enabled: true,
    monitor: true,
    logging: true,
    compare: 'shallow'
}
export default Visible(options)(MyComponent);
```

### More Configuration Examples

Sets environment to 'development' and enables logging and monitoring only for MyComponent in that environment.

```javascript
// In gulpfile.js
gulp.task('set-vr', function() {
	gulp.src('build/bundle.js')
		.pipe(replace('process.env.NODE_ENV', JSON.stringify('development')))
		.pipe(replace('process.env.VR_DEV_MONITOR', JSON.stringify('selected'))
		.pipe(replace('process.env.VR_DEV_LOGGING', JSON.stringify('selected')))
		.pipe(gulp.dest('dist'));
});

// In MyComponent.js
const options = {
    monitor: true,
    logging: true
}
export default Visible(options)(MyComponent);
```

Sets environment to 'production' and enables **Visible React** in production to do a only preventive shallow compare (the default) for every component except MyComponent, which undergoes a deep compare.

```javascript
// In gulpfile.js
gulp.task('set-vr', function() {
	gulp.src('build/bundle.js')
		.pipe(replace('process.env.NODE_ENV', JSON.stringify('production')))
		.pipe(replace('process.env.VR_PROD_ENABLED', JSON.stringify('all'))
		.pipe(gulp.dest('dist'));
});

// In MyComponent.js
const options = {
    compare: 'deep'
}
export default Visible(options)(MyComponent);
```

Sets environment to 'production' and prevents comparison in production in every component except MyComponent, which undergoes a shallow compare.

```javascript
// In gulpfile.js
gulp.task('set-vr', function() {
	gulp.src('build/bundle.js')
		.pipe(replace('process.env.NODE_ENV', JSON.stringify('production')))
		.pipe(replace('process.env.VR_PROD_COMPARE', JSON.stringify('none')))
		.pipe(gulp.dest('dist'));
});

// In MyComponent.js
const options = {
    compare: 'shallow'
}
export default Visible(options)(MyComponent);
```

### License

[MIT](LICENSE)  
Copyright (c) 2016 [Robert Kendall](http://robertkendall.com)