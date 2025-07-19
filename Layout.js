
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Home, 
    Grid3X3, 
    Clock, 
    Star, 
    Tag, 
    Bell,
    Menu,
    X,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
    {
        title: "Início",
        url: createPageUrl("Home"),
        icon: Home,
    },
    {
        title: "Categorias",
        url: createPageUrl("Categories"),
        icon: Grid3X3,
    },
    {
        title: "Recentes",
        url: createPageUrl("Recent"),
        icon: Clock,
    },
    {
        title: "Destaques",
        url: createPageUrl("Featured"),
        icon: Star,
    },
    {
        title: "Cupons",
        url: createPageUrl("Coupons"),
        icon: Tag,
    },
    {
        title: "Alertas",
        url: createPageUrl("Alerts"),
        icon: Bell,
    },
];

const SocialIcon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = React.useState("");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to={createPageUrl("Home")} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">V</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                VitaoTech
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.url}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        location.pathname === item.url
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar produtos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold">V</span>
                                            </div>
                                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                VitaoTech
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Search */}
                                    <div className="relative mb-6">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Buscar produtos..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    {/* Mobile Navigation */}
                                    <nav className="flex flex-col space-y-2">
                                        {navigationItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                to={item.url}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    location.pathname === item.url
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                }`}
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.title}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">V</span>
                                </div>
                                <span className="text-2xl font-bold">VitaoTech</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                As melhores ofertas e promoções em tecnologia. 
                                Encontre produtos com os melhores preços e cupons de desconto.
                            </p>
                            <div className="flex space-x-6 mt-6">
                                <SocialIcon href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.28C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.15 2.33,6.94C2.33,8.43 3.11,9.75 4.26,10.54C3.55,10.51 2.88,10.31 2.3,10.03C2.3,10.05 2.3,10.06 2.3,10.08C2.3,12.25 3.84,14.08 5.91,14.49C5.58,14.58 5.22,14.62 4.85,14.62C4.59,14.62 4.34,14.6 4.1,14.56C4.66,16.34 6.25,17.62 8.12,17.65C6.59,18.84 4.7,19.52 2.67,19.52C2.34,19.52 2,19.5 1.67,19.45C3.55,20.69 5.75,21.4 8.12,21.4C16,21.4 20.33,14.96 20.33,9.23C20.33,9.03 20.33,8.82 20.32,8.62C21.16,8.03 21.88,7.28 22.46,6Z"></path></svg>
                                </SocialIcon>
                                <SocialIcon href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.86 7.85,17.39 8.12,16.89C8.39,16.39 8.58,15.85 8.68,15.28L8.47,15.21C8.16,15.31 7.84,15.36 7.5,15.36C7.17,15.36 6.85,15.31 6.54,15.21L6.33,15.28C6.43,15.85 6.62,16.39 6.89,16.89C7.16,17.39 7.5,17.86 7.93,18.28L7.07,18.28M12.75,12.64C12.44,13.15 12.06,13.59 11.6,13.97C11.14,14.35 10.61,14.65 10.03,14.86L9.9,14.8C10.15,14.6 10.37,14.36 10.56,14.11C10.75,13.86 10.9,13.57 11.03,13.25L12,12L12.75,12.64M16.93,18.28L16.07,18.28C16.5,17.86 16.84,17.39 17.11,16.89C17.38,16.39 17.57,15.85 17.67,15.28L17.46,15.21C17.15,15.31 16.83,15.36 16.5,15.36C16.17,15.36 15.85,15.31 15.54,15.21L15.33,15.28C15.43,15.85 15.62,16.39 15.89,16.89C16.16,17.39 16.5,17.86 16.93,18.28M17.65,11.56L16.75,12.64C16.56,12.15 16.34,11.69 16.11,11.25C15.88,10.81 15.63,10.39 15.38,10L16.2,9.33C16.94,9.94 17.43,10.7 17.65,11.56M12,6.5C12.55,6.5 13.05,6.7 13.45,7.05C13.85,7.4 14.15,7.85 14.35,8.35C14.55,8.85 14.6,9.4 14.5,9.95C14.4,10.45 14.15,10.95 13.8,11.3C13.45,11.65 12.95,11.9 12.45,12C11.9,12.05 11.35,12 10.85,11.8C10.35,11.6 9.9,11.3 9.55,10.9C9.2,10.5 9,10 9,9.5C9,8.84 9.26,8.21 9.71,7.76C10.16,7.31 10.79,7.05 11.45,7C11.6,7 11.8,6.5 12,6.5M6.35,11.56C6.57,10.7 7.06,9.94 7.8,9.33L8.62,10C8.37,10.39 8.12,10.81 7.89,11.25C7.66,11.69 7.44,12.15 7.25,12.64L6.35,11.56Z"></path></svg>
                                </SocialIcon>
                                <SocialIcon href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"></path></svg>
                                </SocialIcon>
                                <SocialIcon href="#">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17,2H7A5,5 0 0,0 2,7V17A5,5 0 0,0 7,22H17A5,5 0 0,0 22,17V7A5,5 0 0,0 17,2M17,14H14.5V20H11.5V14H9V11H11.5V9C11.5,6.5 13,5 15.5,5H18V8H16C15.2,8 14.5,8.2 14.5,9.2V11H18L17,14Z"></path></svg>
                                </SocialIcon>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-4">Navegação</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to={createPageUrl("Categories")} className="hover:text-white transition-colors">Categorias</Link></li>
                                <li><Link to={createPageUrl("Featured")} className="hover:text-white transition-colors">Destaques</Link></li>
                                <li><Link to={createPageUrl("Coupons")} className="hover:text-white transition-colors">Cupons</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-4">Lojas Parceiras</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Amazon</li>
                                <li>Mercado Livre</li>
                                <li>Shopee</li>
                                <li>AliExpress</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Comunidade & Ajuda</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="#" className="hover:text-white transition-colors">Fórum</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Contate-nos</Link></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 VitaoTech. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
