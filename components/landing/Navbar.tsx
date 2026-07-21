import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="flex items-center gap-2.5 space-x-3 text-gray-400 text-sm">
            <Link to="/about" className="hover:text-white hover:cursor-pointer">About</Link>
            <Link to="/contact" className="hover:text-white hover:cursor-pointer">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-white hover:cursor-pointer">Privacy</Link>
        </div>
    )
}

export default Navbar