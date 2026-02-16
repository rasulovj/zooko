import ZookoLoader from "../components/ZookoLoader";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <ZookoLoader text="Yuklanmoqda…" />
    </div>
  );
}
