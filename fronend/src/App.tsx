import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FiSettings } from 'react-icons/fi';
import './App.css';
import { Footer, Navbar, Sidebar } from './components';
import {
    Area,
    Bar,
    Calendar,
    ColorMapping,
    ColorPicker,
    Customer,
    Ecommerce,
    Editor,
    Employee,
    Error404,
    Financial,
    Kanban,
    Line,
    Orders,
    Pie,
    Pyramid,
    Stacked,
} from './pages';
import { useStateContext } from './contexts/ContextProvider';
import { Login } from './pages/Login';
import { Transaction } from './pages/Transaction';

const App = () => {
    const { activeMenu, setActiveMenu, user, setUser } = useStateContext();
    return (
        <div>
            <BrowserRouter>
                <div className="flex relative dark:bg-main-dark-bg">
                    <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                        <TooltipComponent content="Settings" position="TopCenter">
                            <button
                                style={{ backgroundColor: 'blue', borderRadius: '50%' }}
                                type="button"
                                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
                            >
                                <FiSettings />
                            </button>
                        </TooltipComponent>
                    </div>
                    {activeMenu ? (
                        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                            <Sidebar />
                        </div>
                    ) : (
                        <div className="w-0 dark:bg-secondary-dark-bg">
                            <Sidebar />
                        </div>
                    )}
                    <div
                        className={
                            activeMenu
                                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
                        }
                    >
                        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                            <Navbar />
                        </div>
                        <div>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                {/* dashboard  */}
                                <Route path="/" element={<Ecommerce />} />
                                <Route path="/ecommerce" element={<Ecommerce />} />
                                {/* pages  */}
                                <Route path="/orders" element={<Orders />} />
                                <Route path="/employees" element={<Employee />} />
                                <Route path="/customers" element={<Customer />} />
                                {/* apps  */}
                                <Route path="/kanban" element={<Kanban />} />
                                <Route path="/editor" element={<Editor />} />
                                <Route path="/calendar" element={<Calendar />} />
                                <Route path="/color-picker" element={<ColorPicker />} />
                                {/* charts  */}
                                <Route path="/line" element={<Line />} />
                                <Route path="/area" element={<Area />} />
                                <Route path="/bar" element={<Bar />} />
                                <Route path="/pie" element={<Pie />} />
                                <Route path="/financial" element={<Financial />} />
                                <Route path="/color-mapping" element={<ColorMapping />} />
                                <Route path={'/transaction'} element={<Transaction />} />
                                {/*<PrivateRoute path="/transaction" element={<Transaction />} />*/}
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;

const PrivateRoute = ({ children, ...rest }: any) => {
    const { user } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    return <Route {...rest} element={children} />;
};
