import { LogoYourMenu } from "@/assets/icons-full";
import { DropdownMenuDemo } from "./ui/drop-menu";


export function Header() {
    return (
        <header className="flex justify w-full justify-between px-7 py-2" >
            <div>
                <LogoYourMenu className="w-55"/>
            </div>
            <div>
                <DropdownMenuDemo/>
            </div>
        </header>
    );
};