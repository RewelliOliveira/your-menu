import { Header } from "../components/header";
import { Banner } from "../components/ui/banner";

export function Orders() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <Header />

      <Banner />


      <main className="w-full max-w-md mt-8 px-4 space-y-6">
        <p className="text-gray-700 text-center">resto das coisa</p>
      </main>
    </div>
  );
}
