import React, { createContext, useContext, useState } from 'react';

type StateClick = {
    chat: boolean;
    cart: boolean;
    notification: boolean;
    userProfile: boolean;
};

type User = {
    name: string;
    accessToken: string;
    refreshToken: string;
    email: string;
};

const initialState: StateClick = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
};
type State = {
    activeMenu: boolean;
    setActiveMenu: (menu: boolean) => void;
    click: StateClick;
    setClick: (click: StateClick) => void;
    handleClick: (name: string) => void;
    user: User;
    setUser: (user: User) => void;
};

export const StateContext = createContext<State>({
    activeMenu: false,
    setActiveMenu(menu: boolean): void {},
    click: initialState,
    setClick(click: StateClick): void {},
    handleClick(name: string): void {},
    user: {
        name: '',
        accessToken: '',
        refreshToken: '',
        email: '',
    },
    setUser(user: User): void {},
});

type Props = {
    children: React.ReactNode;
};
export const ContextProvider = ({ children }: Props) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [accessToken, setAccessToken] = useState('');
    const [click, setClick] = useState(initialState);
    const [user, setUser] = useState<User>({ name: '', accessToken: '', refreshToken: '', email: '' });
    const handleClick = (name: string) => {
        setClick({ ...initialState, [name]: true });
        console.log(click);
    };
    return (
        <StateContext.Provider value={{ activeMenu, setActiveMenu, click, setClick, handleClick, user, setUser }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
