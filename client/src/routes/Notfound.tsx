import LinkPrimary from "../components/Links/LinkPrimary";

export default function Notfound() {
  return (
    <main className="mx-auto flex h-screen min-w-xs items-center justify-center px-5">
      <div className="flex flex-col items-center gap-16 lg:flex-row">
        <img
          src="/astronaut.svg"
          alt="astronaut"
          draggable={false}
          className="w-xl"
        />
        <div className="flex flex-col items-center lg:items-start">
          <span className="text-primary text-8xl font-bold">404</span>
          <div className="mt-2 flex flex-col items-center gap-8 lg:items-start">
            <span className="text-secondary text-2xl font-bold">
              UH OH! You're lost.
            </span>
            <p className="text-grayDark text-center text-sm sm:w-sm lg:text-left xl:w-96">
              The page you are looking for does not exist. How you got here is a
              mystery. But you can click the button below to go back to the
              homepage.
            </p>
            <LinkPrimary to="/" value="Home" className="w-48 lg:w-32" />
          </div>
        </div>
      </div>
    </main>
  );
}
