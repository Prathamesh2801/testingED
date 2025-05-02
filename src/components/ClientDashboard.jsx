'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from '@headlessui/react'
import {
    Bars3Icon,
    ChartPieIcon,
    Cog6ToothIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import ClientVisuals from './ClientVisuals'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'
import ClientSection from './ClientSection'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ClientDashboard() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [logo, setLogo] = useState(localStorage.getItem('clientLogo') || '')

    // Get the active tab from query parameter or default to 'dashboard'
    const getActiveTab = () => {
        // Parse the current URL to extract query parameters
        const url = new URL(window.location.href)
        const queryParams = new URLSearchParams(url.hash.split('?')[1] || '')
        return queryParams.get('tab') || 'dashboard'
    }

    const [activeTab, setActiveTab] = useState(getActiveTab())

    // Navigation configuration
    const navigation = [
        {
            name: 'Dashboard',
            href: '#/clientDashboard?tab=dashboard',
            icon: ChartPieIcon,
            current: activeTab === 'dashboard'
        },
        {
            name: 'User Data',
            href: '#/clientDashboard?tab=userdata',
            icon: UsersIcon,
            current: activeTab === 'userdata'
        },
    ]

    const userNavigation = [
        { name: 'Your profile', href: '#' },
        { name: 'Sign out', onClick: handleSignOut },
    ]

    // Update active tab when URL changes
    useEffect(() => {
        const handleLocationChange = () => {
            setActiveTab(getActiveTab())
        }

        setLogo(localStorage.getItem('clientLogo'))
        // Set up event listener for URL changes
        window.addEventListener('hashchange', handleLocationChange)

        // Initial check
        handleLocationChange()

        // Cleanup listener
        return () => {
            window.removeEventListener('hashchange', handleLocationChange)
        }
    }, [])

    // Handle navigation click
    const handleNavClick = (e, tab) => {
        e.preventDefault()

        // Navigate to new URL with query parameter
        const tabName = tab.toLowerCase().replace(' ', '')
        window.location.hash = `/clientDashboard?tab=${tabName}`
        setActiveTab(tabName)
        setSidebarOpen(false) // Close sidebar on mobile after click
    }

    function handleSignOut() {
        const eventId = localStorage.getItem('eventId')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('eventId')
        navigate(`/clientLogin/${eventId}`)
    }


    // Render the appropriate component based on the active tab

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ClientVisuals />
            case 'userdata':
                return <ClientSection/>
            default:
                return <ClientVisuals />
        }
    }

    return (
        <>
            <div>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component for mobile */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        alt="Client Logo"
                                        src={`${API_BASE_URL}/uploads/event_logos/${logo}`}
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
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
                                                                    ? 'bg-gray-50 text-white bg-[linear-gradient(90deg,#2BC155_7.39%,#7BF29C_104.06%)]  w-[235px]  rounded-[0px_12px_70px_0px]'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#36C95F]',
                                                                'group flex gap-x-3  p-2 text-sm/6 font-semibold ',
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    item.current ? 'text-white' : 'text-gray-400 group-hover:text-[#36C95F]',
                                                            'size-6 shrink-0',
                                                                )}
                                                            />
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        <li className="mt-auto">
                                            <a
                                                href="#"
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            >
                                                <Cog6ToothIcon
                                                    aria-hidden="true"
                                                    className="size-6 shrink-0 text-gray-400 group-hover:text-[#36C95F] "
                                                />
                                                Settings
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white  px-6 pb-4">
                        <div className="flex h-24 shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src={`${API_BASE_URL}/uploads/event_logos/${logo}`}
                                className="h-18 w-18 rounded-full"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
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
                                                            ? 'bg-gray-50 text-white bg-[linear-gradient(90deg,#2BC155_7.39%,#7BF29C_104.06%)]  w-[235px]  rounded-[0px_12px_70px_0px]'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#36C95F]',
                                                        'group flex gap-x-3  p-2 text-sm/6 font-semibold ',
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            item.current ? 'text-white' : 'text-gray-400 group-hover:text-[#36C95F]',
                                                            'size-6 shrink-0',
                                                        )}
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="mt-auto">
                                    <a
                                        href="#"
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                    >
                                        <Cog6ToothIcon
                                            aria-hidden="true"
                                            className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                        />
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 ">
                        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon aria-hidden="true" className="size-6" />
                            </button>

                            {/* Separator */}
                            <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

                            <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                                <div className="flex items-center gap-x-4 lg:gap-x-6">
                                    {/* Separator */}
                                    <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative">
                                        <MenuButton className=" flex items-center p-1.5 px-16">
                                            <span className="sr-only">Open user menu</span>
                                            <span className="hidden lg:flex lg:items-center">
                                                <UserCircleIcon className='w-7 h-auto' />
                                                <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
                                                    Profile
                                                </span>
                                                <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                                            </span>
                                        </MenuButton>
                                        <MenuItems
                                            transition
                                            className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                        >
                                            {userNavigation.map((item) => (
                                                <MenuItem
                                                    key={item.name}
                                                    as={item.onClick ? 'button' : 'a'}
                                                    {...(item.onClick
                                                        ? { onClick: item.onClick, type: 'button' }
                                                        : { href: item.href }
                                                    )}
                                                    className="block w-full text-left px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
                                                >
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </MenuItems>

                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="py-10 bg-gray-100">
                        <div className="mx-auto min-h-[80vh] px-4 sm:px-6 lg:px-14">
                            {/* Dynamic content based on active tab */}
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}