import { LogoYourMenu } from "@/assets/icons-full";

export function Header() {
    return (
        <header className="w-full px-4 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:px-7 md:py-1">
            <div className="w-full flex justify-between items-center md:w-auto">
                <LogoYourMenu className="w-35 md:w-45" />
            </div>
        </header>
    );
}
