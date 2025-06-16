import { Helmet } from 'react-helmet';

export default function Settings() {
  return (
    <>
      <Helmet>
        <title>Matcha - Settings</title>
      </Helmet>
      <main className="mt-12 lg:ml-64">
        <div>
          <h1 className="text-secondary text-2xl font-bold">Settings</h1>
          <span className="lg:text-md text-sm font-light text-gray-300">
            Manage your account details
          </span>
        </div>
      </main>
    </>
  );
}
