import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllEvents } from '../utils/EventFetchApi';
import { API_BASE_URL } from '../config';
// import DashboardIcon from '../assets/img/dashboardIcon.png'
import {
    Bars3Icon,
    IdentificationIcon,
    FolderIcon,
    UsersIcon,
    XMarkIcon,
    PresentationChartLineIcon

} from '@heroicons/react/24/outline';
import Visuals from './Visuals';
import EventSection from './EventSection';
import Credentials from './Credentials';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function DashBoard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 0
    });

    // Get the active tab from query parameter or default to 'dashboard'
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get('tab') || 'events';

    // Navigation configuration with updated href values
    const navigation = [
       
        { name: 'Events', href: '/dashboard?tab=events', icon: UsersIcon, current: activeTab === 'events' },
        { name: 'Credentials', href: '/dashboard?tab=credentials', icon: IdentificationIcon, current: activeTab === 'credentials' },
    ];

    // Also check for refreshed=true parameter
    useEffect(() => {
        if (queryParams.get('refreshed') === 'true') {
            fetchEvents();
            // Remove the parameter after refresh
            queryParams.delete('refreshed');
            const newSearch = queryParams.toString();
            navigate(`/dashboard?${newSearch}`, { replace: true });
        }
    }, [location.search]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getAllEvents(pagination.page, pagination.limit);
            console.log('Fetched events:', data);
            setEvents(data.events);
            setPagination(prev => ({
                ...prev,
                total: parseInt(data.pagination.total),
                total_pages: data.pagination.total_pages
            }));
        } catch (error) {
            setError(error.message);
            // if (error.message.includes('authentication')) {
            //     navigate('/login');
            // }
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        // Preserve existing query parameters when changing page
        const currentView = queryParams.get('view') || 'display';
        setPagination(prev => ({ ...prev, page: newPage }));

        // If we're on the events tab with a specific view, maintain that view when changing pages
        if (activeTab === 'events') {
            navigate(`/dashboard?tab=events&view=${currentView}`);
        }
    };

    // Handle navigation click
    const handleNavClick = (e, tab) => {
        e.preventDefault();

        // If navigating to events tab, include default view parameter
        if (tab.toLowerCase() === 'events') {
            navigate(`/dashboard?tab=events&view=display`);
        } else {
            navigate(`/dashboard?tab=${tab.toLowerCase()}`);
        }
    };

    // Render the appropriate component based on the active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return <EventSection
                    events={events}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                    setEvents={setEvents}
                />;
            case 'credentials':
                return <Credentials />;

            default:
                return <EventSection
                    events={events}
                    loading={loading}
                    error={error}
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                    setEvents={setEvents}
                />;
        }
    };

    return (
        <div>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 bg-gray-900/80 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />

            <div className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto bg-white lg:hidden transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-300 ease-in-out`}>
                <div className="flex h-16 shrink-0 items-center px-6">
                    <img
                        alt="Company Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-8 w-auto"
                    />
                    <button
                        type="button"
                        className="absolute top-5 right-4 p-2 text-gray-500"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex flex-1 flex-col px-6 pb-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            onClick={(e) => handleNavClick(e, item.name)}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-50 text-indigo-600 bg-[linear-gradient(90deg,#2BC155_7.39%,#7BF29C_104.06%)]'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold',
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                    'h-6 w-6 shrink-0',
                                                )}
                                            />
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>

                    </ul>
                </nav>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            alt="Zeal Interactive Services"
                            src="https://www.zealinteractive.in/wp-content/uploads/2024/10/Zeal-interactive-Logo.png"
                            className="h-8 w-auto"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col  ">
                        <ul role="list" className="-mx-2 space-y-1 ">
                            {navigation.map((item) => (
                                <li key={item.name} >
                                    <a
                                        href={item.href}
                                        onClick={(e) => handleNavClick(e, item.name)}
                                        className={classNames(
                                            item.current
                                                ? 'text-white bg-[linear-gradient(90deg,#2BC155_7.39%,#7BF29C_104.06%)] w-[205px] h-[40px] shrink-0 rounded-[0px_12px_70px_0px] '
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                            'group flex gap-x-3 p-2 text-sm font-semibold'
                                        )}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current ? 'text-white' : 'text-black group-hover:text-indigo-600',
                                                'h-6 w-6 shrink-0'
                                            )}
                                        />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile top bar */}
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700">
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" />
                </button>
                <div className="flex-1 text-sm font-semibold text-gray-900">Dashboard</div>
                <a href="#">
                    <span className="sr-only">Your profile</span>
                    <img
                        alt="Profile"
                        src="https://www.zealinteractive.in/wp-content/uploads/2024/10/Zeal-interactive-Logo.png"
                        className="h-8 w-8 rounded-full bg-gray-50"
                    />
                </a>
            </div>

            {/* Main content */}
            <main className="lg:pl-72">
                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'events' ? 'Events' :
                                activeTab === 'credentials' ? 'Client Credentials' :
                                    'Dashboard'}
                        </h1>
                    </div>

                    {/* Render the appropriate component based on the active tab */}
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default DashBoard;