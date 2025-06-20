import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Smart Inventory System - Streamline Your Business Operations">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
                <meta name="description" content="Transform your inventory management with our intelligent, real-time tracking system. Perfect for businesses of all sizes." />
            </Head>
            
            {/* Navigation */}
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">SmartInventory</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Hero Section */}
                <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                New: AI-Powered Inventory Insights
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 dark:text-white">
                                Smart Inventory
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> System</span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed dark:text-gray-300">
                                Transform your business operations with intelligent inventory management.
                                Track, analyze, and optimize your stock levels with real-time insights and automated workflows.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Trial'}
                                </Link>
                                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all duration-200 font-semibold text-lg dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500">
                                    Watch Demo
                                </button>
                            </div>
                            {/* <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">
                                ✨ No credit card required • 14-day free trial • Cancel anytime
                            </p> */}
                        </div>
                    </div>
                </section>

                {/* Dashboard Preview */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:bg-gray-800 dark:border-gray-700/50">
                                {/* Browser Bar */}
                                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-sm text-gray-500 dark:bg-gray-600 dark:text-gray-300">
                                            smartinventory.com/dashboard
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Dashboard Content */}
                                <div className="p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <span className="text-green-600 text-sm font-medium">+12%</span>
                                            </div>
                                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">2,847</div>
                                            <div className="text-blue-600 text-sm dark:text-blue-300">Total Items</div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className="text-green-600 text-sm font-medium">+8%</span>
                                            </div>
                                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">2,124</div>
                                            <div className="text-green-600 text-sm dark:text-green-300">In Stock</div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <span className="text-orange-600 text-sm font-medium">-2%</span>
                                            </div>
                                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">47</div>
                                            <div className="text-orange-600 text-sm dark:text-orange-300">Low Stock</div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <span className="text-red-600 text-sm font-medium">-15%</span>
                                            </div>
                                            <div className="text-3xl font-bold text-red-900 dark:text-red-100">12</div>
                                            <div className="text-red-600 text-sm dark:text-red-300">Out of Stock</div>
                                        </div>
                                    </div>
                                    
                                    {/* Activity Feed */}
                                    <div className="bg-gray-50 rounded-xl p-6 dark:bg-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {[
                                                { item: "iPhone 14 Pro", change: "+25", type: "increase", time: "2 min ago" },
                                                { item: "MacBook Air M2", change: "-8", type: "decrease", time: "5 min ago" },
                                                { item: "AirPods Pro", change: "+15", type: "increase", time: "12 min ago" },
                                                { item: "iPad Pro", change: "-3", type: "decrease", time: "18 min ago" }
                                            ].map((activity, index) => (
                                                <div key={index} className="flex items-center justify-between py-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-2 h-2 rounded-full ${activity.type === 'increase' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <span className="text-gray-700 dark:text-gray-300">{activity.item}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                            activity.type === 'increase' 
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                        }`}>
                                                            {activity.change}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 dark:text-white">
                                Powerful Features for
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Modern Businesses</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
                                Everything you need to manage your inventory efficiently and scale your business with confidence.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    ),
                                    title: "Real-time Tracking",
                                    description: "Monitor stock levels, movements, and changes across all locations instantly with live updates.",
                                    color: "blue"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: "Smart Alerts",
                                    description: "Get intelligent notifications for low stock, expiring items, and optimal reorder points.",
                                    color: "green"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m0 0V4m0 4h12m0 0V4m0 4v8M4 12v8" />
                                        </svg>
                                    ),
                                    title: "Barcode Scanning",
                                    description: "Quickly add, update, and track items using advanced barcode scanning technology.",
                                    color: "red"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    ),
                                    title: "Analytics & Reports",
                                    description: "Generate detailed insights and reports to understand inventory trends and optimize performance.",
                                    color: "orange"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    ),
                                    title: "Multi-location",
                                    description: "Manage inventory across multiple warehouses, stores, and locations from a single dashboard.",
                                    color: "blue"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                        </svg>
                                    ),
                                    title: "API Integration",
                                    description: "Seamlessly integrate with your existing systems, e-commerce platforms, and third-party tools.",
                                    color: "red"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="group">
                                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600">
                                        <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-xl flex items-center justify-center mb-6 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed dark:text-gray-300">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 shadow-2xl">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                Ready to Transform Your Inventory?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Join thousands of businesses that trust SmartInventory to streamline their operations and boost efficiency.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-semibold text-lg shadow-lg"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Your Free Trial'}
                                </Link>
                                <button className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg">
                                    Schedule Demo
                                </button>
                            </div>
                            <p className="text-blue-100 text-sm mt-6">
                                ✨ 14-day free trial • No setup fees • Cancel anytime
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold">SmartInventory</span>
                            </div>
                            <div className="flex space-x-6 text-gray-400">
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                                <a href="https://github.com/Am0605" target="_blank" className="hover:text-white transition-colors">Contact</a>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 SmartInventory. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
