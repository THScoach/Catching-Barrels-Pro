import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                        Join CatchBarrels
                    </h1>
                    <p className="text-lg text-slate-600">
                        Choose your account type to get started
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Parent Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-emerald-500 transition-all">
                        <div className="text-5xl mb-4 text-center">👨‍👩‍👧</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                            I'm a Parent
                        </h2>
                        <p className="text-slate-600 mb-6 text-center">
                            Register to manage athlete profiles and subscriptions
                        </p>
                        <ul className="space-y-2 mb-6 text-sm text-slate-600">
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                Create profiles for your athletes
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                View progress and analytics
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                Manage billing and subscriptions
                            </li>
                        </ul>
                        <Link
                            href="/signup/parent"
                            className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-center"
                        >
                            Sign Up as Parent
                        </Link>
                    </div>

                    {/* Athlete Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-slate-200">
                        <div className="text-5xl mb-4 text-center">⚾</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                            I'm an Athlete
                        </h2>
                        <p className="text-slate-600 mb-6 text-center">
                            Your coach or parent will create your account
                        </p>
                        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-600 text-center">
                            Athletes don't sign up directly. Your parent or coach will create
                            your profile and provide you with login credentials.
                        </div>
                        <p className="text-center text-sm text-slate-500 mb-4">
                            Already have credentials?
                        </p>
                        <Link
                            href="/auth/login"
                            className="block w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium text-center"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Coach Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-emerald-500 transition-all">
                        <div className="text-5xl mb-4 text-center">👔</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                            I'm a Coach
                        </h2>
                        <p className="text-slate-600 mb-6 text-center">
                            Manage your facility and all your athletes
                        </p>
                        <ul className="space-y-2 mb-6 text-sm text-slate-600">
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                Create and manage athlete profiles
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                Run analysis for all athletes
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 mr-2">✓</span>
                                Team and facility management
                            </li>
                        </ul>
                        <Link
                            href="/signup/coach"
                            className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-center"
                        >
                            Sign Up as Coach
                        </Link>
                    </div>

                </div>

                <p className="text-center mt-8 text-slate-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
