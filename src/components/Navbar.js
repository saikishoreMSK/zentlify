// src/app/components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/products">Products</Link></li>
            </ul>
        </nav>
    );
}
