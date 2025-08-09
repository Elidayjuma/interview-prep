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
                route: "/dashboard",
            },
            {
                icon: <ListBulletIcon className="size-6" />,
                label: "Resume Builder",
                route: "/dashboard/resume-builder",
            },
            {
                icon: <BanknotesIcon className="size-6" />,
                label: "Billing",
                route: "/dashboard/billing",
            },
            {
                icon: <BriefcaseIcon className="size-6" />,
                label: "Jobs Board",
                route: "/dashboard/jobs",
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
                            "https://elidayjuma.com/blog",
                        target: "_blank",
                    },
                ],
            },
        ],
    },
];


export default allMenuGroups;