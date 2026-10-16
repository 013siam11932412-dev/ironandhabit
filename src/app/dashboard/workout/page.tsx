import WorkoutFlow from "@/components/workout/WorkoutFlow";

export default function WorkoutPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-start p-4 sm:p-6 bg-[#07090e]">
      <WorkoutFlow />
    </div>
  );
}
