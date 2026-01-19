import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function CompleteProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect('/auth/login');

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect('/auth/login');
    if (user.firstLoginCompleted) redirect('/dashboard');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">⚾</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome to CatchBarrels, {user.name}!
                    </h1>
                    <p className="text-slate-600">
                        Let's complete your profile to get started with swing analysis
                    </p>
                </div>

                <form action="/api/complete-profile" method="POST" className="space-y-8">

                    {/* Step 1: Change Password */}
                    <section className="border-b border-slate-200 pb-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            Step 1: Create Your Password
                        </h2>
                        <p className="text-sm text-slate-600 mb-4">
                            For security, please create a new password
                        </p>
                        <div className="grid gap-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Min. 8 characters"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Step 2: Verify Physical Attributes */}
                    <section className="border-b border-slate-200 pb-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            Step 2: Verify Your Information
                        </h2>
                        <p className="text-sm text-slate-600 mb-4">
                            Please confirm or update these details for accurate biomechanical analysis
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-2">
                                    Height (inches) *
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    defaultValue={user.height || ''}
                                    required
                                    step="0.5"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="72"
                                />
                                <p className="text-xs text-slate-500 mt-1">6'0" = 72"</p>
                            </div>
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-2">
                                    Weight (lbs) *
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    defaultValue={user.weight || ''}
                                    required
                                    step="0.5"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    placeholder="180"
                                />
                            </div>
                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700 mb-2">
                                    Birth Date *
                                </label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    defaultValue={user.birthDate?.toISOString().split('T')[0] || ''}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Step 3: Terms */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">
                            Step 3: Terms of Use
                        </h2>
                        <label className="flex items-start">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                required
                                className="mt-1 mr-2"
                            />
                            <span className="text-sm text-slate-600">
                                I accept the <a href="/terms" className="text-emerald-600">Terms of Use</a> and{' '}
                                <a href="/privacy" className="text-emerald-600">Privacy Policy</a>
                            </span>
                        </label>
                    </section>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                        Complete Profile & Get Started
                    </button>
                </form>
            </div>
        </div>
    );
}
