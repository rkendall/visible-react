### v0.0.8 (2016-10-18)

#### New Features

- You can disable Continuous Refresh of the Monitor and manually refresh instead for better performance 
- Monitor shows whether setState has been called in a component
- Better styling in Monitor for showing presence of overridden lifecycle methods in wrapped component
- The Component List is sortable by column
- You can filter the Component List
- Component List is responsive
- Faster performance

#### Bug Fixes

- Presence of overridden lifecycle methods in wrapped component now correctly detected
- States/props now correctly flagged as different if one is null
- Component names now displayed properly in React debugger
- Scrollbar now works correctly in Component List


### v0.0.5 (2016-10-10)

#### New Features

- Global configuration can be set from webpack build
- Component-level configuration can be set through arguments passed to Visible wrapper function