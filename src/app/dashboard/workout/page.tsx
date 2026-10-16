import RestTimer from "@/components/workout/RestTimer";
import WorkoutLocationSelector from "@/components/workout/WorkoutLocationSelector";

export default function WorkoutPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center p-4 bg-[#07090e] gap-6">
      <WorkoutLocationSelector />
      <RestTimer />
    </div>
  );
}
