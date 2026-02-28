import {Activity, Brain, Calendar, Heart, Shield, Video} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white"/>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Healio</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features"
                               className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
                            <a href="#services"
                               className="text-gray-600 hover:text-primary-600 transition-colors">Services</a>
                            <a href="#about"
                               className="text-gray-600 hover:text-primary-600 transition-colors">About</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-600 hover:text-primary-600 font-medium">Sign In</button>
                            <button
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="py-20 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto">
                            <div
                                className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Shield className="w-4 h-4"/>
                                HIPAA Compliant Platform
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                AI-Powered Healthcare at Your Fingertips
                            </h1>
                            <p className="text-xl text-gray-600 mb-10">
                                Connect with doctors, analyze symptoms, and manage your health journey with our
                                intelligent telemedicine platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
                                    Start Free Consultation
                                </button>
                                <button
                                    className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-300 hover:text-primary-600 transition-colors">
                                    View Doctors
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Smart Features for Better Healthcare
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Leverage AI to get instant health insights and connect with medical professionals
                                effortlessly.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div
                                className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                    <Brain className="w-7 h-7 text-blue-600"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Symptom Analysis</h3>
                                <p className="text-gray-600">
                                    Describe your symptoms to our AI assistant and get instant insights about potential
                                    conditions before your appointment.
                                </p>
                            </div>
                            <div
                                className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 hover:shadow-lg transition-shadow">
                                <div
                                    className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                    <Calendar className="w-7 h-7 text-green-600"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Scheduling</h3>
                                <p className="text-gray-600">
                                    Book appointments instantly with available doctors. Get automated reminders via SMS
                                    and email.
                                </p>
                            </div>
                            <div
                                className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-lg transition-shadow">
                                <div
                                    className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                    <Video className="w-7 h-7 text-purple-600"/>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Telemedicine Consultations</h3>
                                <p className="text-gray-600">
                                    Connect with doctors through secure video calls from the comfort of your home.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Comprehensive Healthcare Services
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                From preventive care to specialized consultations, we've got you covered.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {icon: Activity, name: "General Medicine", color: "blue"},
                                {icon: Heart, name: "Cardiology", color: "red"},
                                {icon: Brain, name: "Neurology", color: "purple"},
                                {icon: Shield, name: "Pediatrics", color: "green"},
                            ].map((service) => (
                                <div key={service.name}
                                     className="bg-white p-6 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer">
                                    <service.icon className={`w-10 h-10 text-${service.color}-500 mb-4`}/>
                                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary-600">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Transform Your Healthcare Experience?
                        </h2>
                        <p className="text-xl text-primary-100 mb-10">
                            Join thousands of patients who trust Healio for their healthcare needs.
                        </p>
                        <button
                            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors">
                            Get Started for Free
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white"/>
                            </div>
                            <span className="text-lg font-semibold text-white">Healio</span>
                        </div>
                        <p className="text-sm">© 2026 Healio. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
