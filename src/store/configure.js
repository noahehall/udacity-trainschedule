// https://github.com/jarredwitt/react-boilerplate/blob/master/app/store/store.jsx
import { compose, createStore, applyMiddleware } from 'redux';
import { combineReducers, routerReducer, stateTransformer } from 'redux-seamless-immutable';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import * as reducers from './reducers';

export default (initialState) => {
  // console.log('init state', initialState);
  // always on middlewares
  const middleWares = [
    promise,
    thunk,
  ];

  const isProd = process.env.NODE_ENV === "production";
  const reduxTools = !isProd &&
    typeof window !== 'undefined' &&
    window.devToolsExtension ?
      window.devToolsExtension() :
      (f) => f;

  // all non production middlewares
  if (!isProd) {
    const loggerMiddleware = createLogger({
      collapsed: true,
      duration: true,
      level: 'log',
      logErrors: true,
      stateTransformer: stateTransformer,
      timestamp: true,
    });
    middleWares.push(loggerMiddleware);
  }

  // all production only middle wares
  if (isProd) {
    // do nothing
  }

  return createStore(
    combineReducers({
      ...reducers,
      routing: routerReducer
    }),
    initialState,
    compose(
      applyMiddleware(
        ...middleWares
      ),
      reduxTools
    )
  );
};
