import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" style={{ backgroundImage: 'url(/images/factory.jpg)', backgroundSize: 'cover', backgroundPosition: 'left'}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <AppLogoIcon className="mr-2 size-8 fill-current text-white"/>
                    </div>
                    <div className="relative pl-2">{name}</div>
                </Link>
                <div className="relative z-20 mt-auto">
                    <footer className="text-sm text-center">
                        <p className="font-medium">Smart Inventory System</p>
                        <p>
                            Built by{' '}
                            <a 
                                href="https://am-dev.live" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="underline hover:text-primary font-medium "
                            >
                                am-dev.live
                            </a>
                        </p>
                        <p className="text-xs mt-4">© {new Date().getFullYear()} All rights reserved.</p>
                    </footer>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
