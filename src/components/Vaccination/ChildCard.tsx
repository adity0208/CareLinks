import React, { useState } from "react";
import { ChildData } from "../../services/firebase/firestore";
import { Vaccine } from "../../utils/vaccineSchedule";

interface ChildCardProps {
  child: ChildData;
  vaccineSchedule: Vaccine[];
  onShareAsPng: () => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, vaccineSchedule, onShareAsPng }) => {
  const [vaccineStatus, setVaccineStatus] = useState<boolean[]>(vaccineSchedule.map(() => false));

  const handleVaccineChange = (index: number) => {
    setVaccineStatus((prev) =>
      prev.map((status, i) => (i === index ? !status : status))
    );
  };

  return (
    <div className="bg-white p-5 rounded-lg max-w-md w-full shadow-lg">
      <h2 className="text-xl font-semibold mb-2">{child.name}</h2>
      <p><strong>DOB:</strong> {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Gender:</strong> {child.gender}</p>
      <p><strong>Weight:</strong> {child.weight} kg</p>
      <p><strong>Height:</strong> {child.height} cm</p>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Vaccine Schedule</h3>
        {vaccineSchedule.map((vaccine, index) => (
          <div key={vaccine.name} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="font-medium">{vaccine.name}</p>
              <p className="text-sm text-gray-500">
                Due: {vaccine.dueDate.toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleVaccineChange(index)}
              className={`px-3 py-1 rounded ${
                vaccineStatus[index] ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {vaccineStatus[index] ? 'Given' : 'Pending'}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onShareAsPng}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Share as PNG
      </button>
    </div>
  );
};

export default ChildCard;
