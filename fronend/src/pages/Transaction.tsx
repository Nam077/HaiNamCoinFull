import React, { useEffect } from 'react';
import { Header } from '../components';
import { Crypto } from '../components/Charts/Crypto';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Block {
    id: number;
    from: User;
    to: User;
    value: number;
    updatedAt: string;
    preHashCode: string;
    hashCode: string;
}
type Props = {};
export const Transaction = (props: Props) => {
    // const [blocks, setBlocks] = React.useState<Block[]>([]);
    const navigate = useNavigate();
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const { user, setUser } = useStateContext();
    React.useEffect(() => {
        getBlocks().then((res) => {
            setBlocks(res);
        });
    }, [blocks]);
    const getBlocks = async () => {
        try {
            const { data, status } = await axios.get('http://192.168.1.20:3000/block', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.accessToken}`,
                },
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const convertUpdatedTime = (time: string): string => {
        // 2021-07-01T08:00:00.000Z => 01/07/2021 08:00:00
        const date = new Date(time);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };
    return (
        <div className={'m-2 md:m10 p-2 md:p-10 bg-white rounded-2xl'}>
            np <Header category={'Main'} title={'Lịch sử giao dịch'} />
            <div className={'overflow-x-auto'}>
                <table className={'table-auto w-full relative'}>
                    <thead>
                        <tr>
                            <th className={'px-4 py-2'}>From</th>
                            <th className={'px-4 py-2'}>To</th>
                            <th className={'px-4 py-2'}>Value</th>
                            <th className={'px-4 py-2'}>Time</th>
                            <th className={'px-4 py-2'}>Prehash</th>
                            <th className={'px-4 py-2'}>Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blocks.map((block) => (
                            <tr key={block.id}>
                                <td className={'border px-4 py-2'}>{block.from.email}</td>
                                <td className={'border px-4 py-2'}>{block.to.email}</td>
                                <td className={'border px-4 py-2'}>{block.value}</td>
                                <td className={'border px-4 py-2'}>{convertUpdatedTime(block.updatedAt)}</td>
                                <td className={'border px-4 py-2'}>{block.preHashCode}</td>
                                <td className={'border px-4 py-2'}>{block.hashCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
