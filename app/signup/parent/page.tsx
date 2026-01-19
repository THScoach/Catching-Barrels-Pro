export default function ParentSignupPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Parent Registration</h1>
                <p className="text-slate-600 mb-8">Create your account to manage athlete profiles</p>

                <form action="/api/signup/parent" method="POST">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="John Smith"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength={8}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Min. 8 characters"
                            />
                        </div>

                        <div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    required
                                    className="mt-1 mr-2"
                                />
                                <span className="text-sm text-slate-600">
                                    I agree to the <a href="/terms" className="text-emerald-600">Terms of Service</a> and{' '}
                                    <a href="/privacy" className="text-emerald-600">Privacy Policy</a>
                                </span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                        Create Parent Account
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-slate-600">
                    After registration, you'll be able to add athlete profiles.
                </p>
            </div>
        </div>
    );
}
