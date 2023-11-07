import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { user } from './reducers';

const config = {
    key: 'root',
    storage,
    whitelist: ['user'],
}

const store = createStore(
    persistCombineReducers(config, { user }),
    undefined,
    compose(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export { store, persistor }