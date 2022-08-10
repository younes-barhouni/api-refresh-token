import React, { createContext, Dispatch, useReducer } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Studio from './core/layout/components/studio/Studio';
import Login from './core/layout/components/auth/login/Login';
import Projects from "./core/layout/components/studio/content/views/projects/Projects";
import { NotificationsProvider } from '@mantine/notifications';
import Signup from "./core/layout/components/auth/signin/Signup";
import { IAction, initialState, reducer } from "./store/reducer";

import './app.css';


const dispatcher: Dispatch<IAction> = () => {};
export const AuthContext = createContext({
  state: initialState,
  dispatch: dispatcher
});

function App(): JSX.Element {
  
    const [state, dispatch] = useReducer(reducer, initialState);
    const views = {
        default: () => <div>Default</div>,
        projects: Projects,
    };

    const { view } = useParams();
    const TagName = (views as any)[view || 'default'] ;

    const Navigation = (): JSX.Element => (
        <nav>
            <ul>
                <li>
                <Link to="/">Home</Link>
                </li>
                <li>
                <Link to="/login">Login</Link>
                </li>
                <li>
                <Link to="/studio">Studio</Link>
                </li>
                <li>
                <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>
    );

    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <NotificationsProvider>
                <Router>
                    <div>
                    {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                    <Routes>
                        <Route path="/" element={ <Navigation /> } />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Signup />} />
                        <Route path="/studio" element={<Studio />} >
                            <Route path=":view" element={<TagName />}/>
                        </Route>
                    </Routes>
                    </div>
                </Router>
            </NotificationsProvider>
        </AuthContext.Provider>
    );
}

export default App;