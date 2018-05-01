# ida-poc

Invoice Documentation Assistant POC.

This is a Vue.js single page application.

# Screenshots

### Splash Screen
![pretty print](https://github.com/presencelearning/ida-poc/blob/master/src/assets/readme-spash-screen.png?raw=true)

### Documentation Task List
![pretty print](https://github.com/presencelearning/ida-poc/blob/master/src/assets/readme-ida-component.png?raw=true)

### Vue.js Devtools
![pretty print](https://github.com/presencelearning/ida-poc/blob/master/src/assets/readme-vuejs-devtools.png?raw=true)

# Purpose of this POC

1. Evaluate feasibility of building a single page Invoice Documentation task list assistant
2. Evaluate application performance of the task list functions
3. Evaluate the efficiency and usability of the task list from a user perspective
4. Experiment with user interface usability features

* preload all necessary data, including appointments, billing codes, client services, locations, etc
* provide realtime stateful task-burndown information
* provide an intuitive single page task list-detail interface to quickly document unsigned appointments
* desktop-like experience with smooth animations and transitions
* pleasant UI appearance and affordances

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## API auth token
Make sure to update the data in modules/Auth.js with the user and token info from login /status
