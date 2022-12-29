// @flow
import React from 'react';
import { StateContext, useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
type Props = {};
export const Login = (props: Props) => {
    const navigate = useNavigate();
    const { user, setUser } = useStateContext();
    // xử lý sự kiện khi change input email và password
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.name) {
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                console.log(e.target.value);
                setPassword(e.target.value);
                break;
            default:
                break;
        }
        console.log(email, password);
    };
    // xử lý sự kiện khi click vào button login input type="submit"
    const handleSubmit = async (e: any) => {
        const { data, status } = await axios.post(
            'http://192.168.1.20:3000/login',
            {
                email,
                password,
            },
            {
                //apply header
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        setUser(data);
        navigate('/transaction');
    };

    return (
        <div className={'flex flex-col items-center justify-center h-screen'}>
            <div className={'flex flex-col gap-2'}>
                <input
                    type={'text'}
                    placeholder={'Username'}
                    className={'p-2 rounded-md'}
                    onChange={handleChange}
                    name={'email'}
                />
                <input
                    type={'password'}
                    placeholder={'Password'}
                    className={'p-2 rounded-md'}
                    onChange={handleChange}
                    name={'password'}
                />
                <input
                    type={'submit'}
                    className={'p-2 rounded-md bg-blue-500 text-white'}
                    value={'Login'}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
};
