import { applyMiddleware, compose, createStore } from "redux";
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from "../reducer";

const initialState = {}

const middleware = [thunk, logger]
const Store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware)))

export default Store