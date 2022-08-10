export interface IState {
  isLoggedIn?: boolean;
  user?: Record<string, string> | null;
  client_id?: string | undefined;
  redirect_uri?: string | undefined;
  client_secret?: string | undefined;
  proxy_url?: string | undefined;
  projects?: Array<Record<string, string>>;
}

export interface IAction {
  type?: 'LOGIN' | 'LOGOUT' | 'PROJECTS';
  payload?: IState;
}

export const initialState: IState = {
  isLoggedIn: localStorage.getItem('isLoggedIn')
    ? JSON.parse(localStorage.getItem('isLoggedIn') as string)
    : false,
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  proxy_url: process.env.REACT_APP_PROXY_URL,
  projects: [],
};

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'LOGIN': {
      localStorage.setItem(
        'isLoggedIn',
        JSON.stringify(action.payload?.isLoggedIn)
      );
      localStorage.setItem('user', JSON.stringify(action.payload?.user));
      return {
        ...state,
        isLoggedIn: action.payload?.isLoggedIn,
        user: action.payload?.user,
      };
    }
    case 'LOGOUT': {
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    case 'PROJECTS': {
      localStorage.setItem(
        'projects',
        JSON.stringify(action.payload?.projects)
      );
      return {
        ...state,
        projects: action.payload?.projects,
      };
    }
    default:
      return state;
  }
};
