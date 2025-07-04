import { LogoYourMenu } from "@/assets/icons-full";
import { DropdownMenuDemo } from "./ui/drop-menu";


export function Header() {
    return (
 <header className="flex justify w-full justify-between px-7 py-1" >
            <div>
                <LogoYourMenu className="w-45"/>
            </div>
            <div className="flex items-center">
                <DropdownMenuDemo/>
            </div>
        </header>
    );
};