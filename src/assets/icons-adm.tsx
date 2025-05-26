export const ArrowLeft = ({ color, className }: any) => {
    return (
        <svg
            className={className}
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.75 24.9L10.6 16.75C9.63749 15.7875 9.63749 14.2125 10.6 13.25L18.75 5.09998"
                stroke={color || "#FFFFFF"}
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
export const DropMenu = ({ color, className }: any) => {
    return (
        <svg
            width="57"
            height="57"
            viewBox="0 0 57 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>

            <path
                d="M49.875 18.4062H7.125C6.15125 18.4062 5.34375 17.5987 5.34375 16.625C5.34375 15.6513 6.15125 14.8438 7.125 14.8438H49.875C50.8488 14.8438 51.6562 15.6513 51.6562 16.625C51.6562 17.5987 50.8488 18.4062 49.875 18.4062Z"
                fill={color || "#292D32"} />
            <path
                d="M49.875 30.2812H7.125C6.15125 30.2812 5.34375 29.4737 5.34375 28.5C5.34375 27.5263 6.15125 26.7188 7.125 26.7188H49.875C50.8488 26.7188 51.6562 27.5263 51.6562 28.5C51.6562 29.4737 50.8488 30.2812 49.875 30.2812Z"
                fill={color || "#292D32"} />
            <path
                d="M49.875 42.1562H7.125C6.15125 42.1562 5.34375 41.3487 5.34375 40.375C5.34375 39.4013 6.15125 38.5938 7.125 38.5938H49.875C50.8488 38.5938 51.6562 39.4013 51.6562 40.375C51.6562 41.3487 50.8488 42.1562 49.875 42.1562Z"
                fill={color || "#292D32"} />
        </svg>

    );
};


