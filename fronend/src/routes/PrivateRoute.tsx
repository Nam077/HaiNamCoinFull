import { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

export const PrivateRoute = ({ children, ...rest }: any) => {
    const { user } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return <Route {...rest}>{children}</Route>;
};
