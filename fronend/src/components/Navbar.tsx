// @flow
import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
// @ts-ignore
import avatar from '../data/avatar.jpg';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Cart } from './Cart';
import { Notification } from './Notification';
import { Chat } from './Chat';
import { UserProfile } from './UserProfile';
type Props = {};
export const Navbar = (props: Props) => {
    const { activeMenu, setActiveMenu, click, handleClick } = useStateContext();
    return (
        <div className={'flex justify-between p-2 md:mx-6 relative'}>
            <NavbarButton
                title={'Menu'}
                customFunction={() => {
                    setActiveMenu(!activeMenu);
                }}
                dotColor={'#03C9D7'}
                icon={<AiOutlineMenu />}
                color={'blue'}
            ></NavbarButton>
            <div className={'flex'}>
                <NavbarButton
                    customFunction={() => {
                        handleClick('cart');
                    }}
                    title={'Cart'}
                    icon={<FiShoppingCart />}
                    color={'blue'}
                ></NavbarButton>
                <NavbarButton
                    title={'Chat'}
                    customFunction={() => {
                        handleClick('chat');
                    }}
                    icon={<BsChatLeft />}
                    color={'blue'}
                ></NavbarButton>
                <NavbarButton
                    title={'Notification'}
                    customFunction={() => {
                        handleClick('notification');
                    }}
                    icon={<RiNotification3Line />}
                    color={'blue'}
                ></NavbarButton>
                <TooltipComponent content={'Profile'} position={'BottomCenter'}>
                    <div
                        onClick={() => handleClick('userProfile')}
                        className={'flex items-center gap-2 cursor-pointer p-1'}
                    >
                        <img className={'w-8 h-8 rounded-full'} src={avatar} alt={''} />
                        <p>
                            <span className={'text-gray-400 text-14'}>Hi, </span>
                            <span className={'text-gray-400 font-bold ml-1 text-14'}>Michael</span>
                        </p>
                        <MdKeyboardArrowDown></MdKeyboardArrowDown>
                    </div>
                </TooltipComponent>
                {click.cart && <Cart></Cart>}
                {click.notification && <Notification></Notification>}
                {click.chat && <Chat></Chat>}
                {click.userProfile && <UserProfile></UserProfile>}
            </div>
        </div>
    );
};

type PropButton = {
    title: string;
    customFunction: () => void;
    icon: React.ReactNode;
    color: string;
    dotColor?: string;
};
export const NavbarButton = (props: PropButton) => {
    return (
        <TooltipComponent content={props.title} position={'BottomCenter'}>
            <button
                onClick={props.customFunction}
                className={'relative text rounded-full p-3 hover:bg-light-gray'}
                style={{ color: props.color }}
            >
                <span
                    style={{ backgroundColor: props.dotColor }}
                    className={'absolute inline-flex rounded-full h-2 w-2 right-2 top-2'}
                >
                    {props.icon}
                </span>
            </button>
        </TooltipComponent>
    );
};
