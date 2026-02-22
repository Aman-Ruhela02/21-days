import { Link } from "react-router-dom";
import { FaCheckCircle, FaChartLine, FaCalendarAlt } from "react-icons/fa";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">
            DisciplineApp
          </h1>

          <div className="space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
            Build Discipline.<br />
            One Day at a Time.
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-blue-100 mb-8">
            A powerful 21-day challenge system to help you stay consistent,
            build habits, and track real progress.
          </p>

          <Link
            to="/register"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-100 transition"
          >
            Start Your Challenge 🚀
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why DisciplineApp?
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<FaCheckCircle />}
              title="Daily Task Tracking"
              text="Simple daily goals that keep you focused and accountable."
            />

            <Feature
              icon={<FaChartLine />}
              title="Progress Analytics"
              text="Visual insights into your consistency and performance."
            />

            <Feature
              icon={<FaCalendarAlt />}
              title="21-Day System"
              text="Scientifically proven habit-building framework."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-12">
            How It Works
          </h3>

          <div className="grid gap-8 md:grid-cols-3">
            <Step
              number="01"
              title="Create Account"
              text="Sign up and instantly get your 21-day challenge."
            />

            <Step
              number="02"
              title="Complete Tasks"
              text="Finish daily tasks without missing a single day."
            />

            <Step
              number="03"
              title="Build Discipline"
              text="Complete 21 days and transform your habits."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-4">
            Your discipline decides your future.
          </h3>
          <p className="text-gray-300 mb-8">
            Start today. Stay consistent. Become unstoppable.
          </p>

          <Link
            to="/register"
            className="inline-block bg-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Join Now 💪
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 text-sm text-center py-6">
        © {new Date().getFullYear()} DisciplineApp. All rights reserved.
      </footer>
    </div>
  );
}

/* COMPONENTS */

const Feature = ({ icon, title, text }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition">
    <div className="text-blue-600 text-3xl mb-4 flex justify-center">
      {icon}
    </div>
    <h4 className="font-semibold text-lg mb-2">
      {title}
    </h4>
    <p className="text-gray-600 text-sm">
      {text}
    </p>
  </div>
);

const Step = ({ number, title, text }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <span className="text-blue-600 font-bold text-lg">
      {number}
    </span>
    <h4 className="font-semibold text-lg mt-2 mb-2">
      {title}
    </h4>
    <p className="text-gray-600 text-sm">
      {text}
    </p>
  </div>
);
