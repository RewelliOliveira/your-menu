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
                stroke={color || "#292D32"}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};