interface ButtonLoginProps {
    children: React.ReactNode,
    onClick?: () => void,
    type?: "button" | "submit" | "reset"
}

export function ButtonLogin({ children, onClick, type = "button" }: ButtonLoginProps) {
    return (
        <button onClick={onClick} type={type}>
            {children}
        </button>
    );
}

