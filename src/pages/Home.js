function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Hi, I'm Ashik Kumar Das</h1>
        <p className="text-lg md:text-2xl mb-6 text-gray-300">
          I'm a QA Engineer with a passion for automation, AI testing, and building reliable software.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}

export default Home;
