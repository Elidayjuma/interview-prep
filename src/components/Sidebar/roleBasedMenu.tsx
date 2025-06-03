import React from "react";
import {
    BanknotesIcon,
    BookOpenIcon,
    SquaresPlusIcon,
    HomeIcon,
    TruckIcon,
    BriefcaseIcon,
    ListBulletIcon,
    SpeakerWaveIcon
} from "@heroicons/react/24/solid";



const allMenuGroups = [
    {
        name: "MENU",
        menuItems: [
            {
                icon: <HomeIcon className="size-6" />,
                label: "Home",
                route: "/home",
                roles: ["CLIENT", "DRIVER", "OWNER", "ADMIN"],
            },
            {
                icon: <BriefcaseIcon className="size-6" />,
                label: "Gigs",
                route: "#",
                roles: ["DRIVER", "OWNER", "ADMIN", "CLIENT"],
                children: [
                    { label: "My Gigs", route: "/gigs" },
                    { label: "Gigs Market", route: "/gigs/market" },
                    { label: "Add Gig", route: "/gigs/add" },
                ],
            },
            {
                icon: <SpeakerWaveIcon className="size-6" />,
                label: "Bids",
                route: "#",
                roles: ["DRIVER", "OWNER", "ADMIN"],
                children: [
                    { label: "My Bids", route: "/bids" },
                ],
            },
            {
                icon: <SquaresPlusIcon className="size-6" />,
                label: "Driver",
                route: "/driver",
                roles: ["ADMIN"],
            },
            {
                icon: <TruckIcon className="size-6" />,
                label: "Vehicles",
                route: "#",
                roles: ["DRIVER", "OWNER", "ADMIN"],
                children: [
                    { label: "My Vehicles", route: "/vehicles" },
                    { label: "Vehicle services", route: "/vehicles/services" },
                ],
            },
            {
                icon: <ListBulletIcon className="size-6" />,
                label: "Vehicles Directory",
                route: "/vehicles/directory",
                roles: ["CLIENT", "DRIVER", "OWNER", "ADMIN"],
            },

            {
                icon: <BanknotesIcon className="size-6" />,
                label: "Profile",
                route: "#",
                roles: ["CLIENT", "DRIVER", "OWNER", "ADMIN"],
                children: [
                    { label: "My Profile", route: "/profile" },
                    // { label: "Profile Setting", route: "/settings" }, TODO: Add settings page
                ],
            },
            {
                icon: <BookOpenIcon className="size-6" />,
                label: "Resources",
                route: "#",
                roles: ["CLIENT", "DRIVER", "OWNER", "ADMIN"],
                children: [
                    {
                        label: "Read our blogs",
                        route:
                            "https://tosomewherelogistics.africa/",
                    },
                ],
            },
            {
                icon: <ListBulletIcon className="size-6" />,
                label: "Become a driver",
                route: "/driver/add",
                roles: ["CLIENT"],
            },
        ],
    },
];


export default allMenuGroups;