import { ReactNode } from "react";
import { AiFillEnvironment } from "react-icons/ai";

interface AddressLinkProps {
    children: ReactNode;
    className?: string;
}

export default function AddressLink({ children, className = "my-3 block" }: AddressLinkProps): JSX.Element {
    const linkClass = `${className} flex gap-1 font-semibold`;

    return (
        <a
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
            href={"https://maps.google.com/?q=" + children}
        >
            <AiFillEnvironment className="text-primary" size={24} />
            {children}
        </a>
    );
}
