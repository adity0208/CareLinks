import React, { useState, useEffect, useRef } from "react";
import { firestoreService, ChildData } from "../services/firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ChildCard from "../components/Vaccination/ChildCard";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVaccineSchedule } from "../utils/vaccineSchedule";

const ChildVaccinationTable: React.FC = () => {
  const [childrenData, setChildrenData] = useState<ChildData[]>([]);
  const [newChild, setNewChild] = useState<Partial<ChildData> | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editedChild, setEditedChild] = useState<Partial<ChildData> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await firestoreService.getChildrenData();
        setChildrenData(data);
      } catch (error) {
        console.error("Error fetching children data:", error);
        toast.error("Failed to load child data");
      }
    };
    fetchData();
  }, []);

  const handleAddChild = () => {
    setNewChild({
      name: "",
      dateOfBirth: null,
      gender: "Male",
      weight: 0,
      height: 0,
    });
  };

  const handleSaveChild = async (child: Partial<ChildData>) => {
    try {
      if (!child.name || !child.dateOfBirth || !child.gender) {
        toast.error("Please fill out all required fields");
        return;
      }

      const childId = uuidv4();
      await firestoreService.saveChildData({ ...child, childId } as ChildData);
      const data = await firestoreService.getChildrenData();
      setChildrenData(data);
      setNewChild(null);
      toast.success("Child data saved successfully!");
    } catch (error) {
      console.error("Error saving child data:", error);
      toast.error("Failed to save child data.");
    }
  };

  const handleChildClick = (child: ChildData) => {
    setSelectedChild(child);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (selectedChild && cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setSelectedChild(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [selectedChild]);

  const handleShareAsPng = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${selectedChild?.name || "child"}-record.png`;
        link.click();
      } catch (error) {
        console.error("Error while creating PNG", error);
        toast.error("Failed to create PNG");
      }
    }
  };

  const handleEditClick = (child: ChildData) => {
    setEditingChildId(child.childId);
    setEditedChild({ ...child });
  };

  const handleUpdateChild = async () => {
    if (editedChild && editedChild.childId) {
      await firestoreService.updateChildData(editedChild.childId, editedChild as ChildData);
      const data = await firestoreService.getChildrenData();
      setChildrenData(data);
      setEditingChildId(null);
      setEditedChild(null);
      toast.success("Child data updated successfully!");
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      await firestoreService.deleteChildData(childId);
      const data = await firestoreService.getChildrenData();
      setChildrenData(data);
      toast.success("Child data deleted successfully!");
    } catch (error) {
      console.error("Error deleting child data:", error);
      toast.error("Failed to delete child data.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddChild}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Child
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Gender</th>
            <th className="border px-4 py-2">DOB</th>
            <th className="border px-4 py-2">Weight</th>
            <th className="border px-4 py-2">Height</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {newChild && (
            <tr>
              <td><input value={newChild.name || ""} onChange={(e) => setNewChild({ ...newChild, name: e.target.value })} className="border px-2 py-1" placeholder="Enter Name" /></td>
              <td><select value={newChild.gender || "Male"} onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })} className="border px-2 py-1"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></td>
              <td><DatePicker selected={newChild.dateOfBirth || null} onChange={(date: Date | null) => setNewChild({ ...newChild, dateOfBirth: date })} className="border px-2 py-1" /></td>
              <td><input type="number" value={newChild.weight || 0} onChange={(e) => setNewChild({ ...newChild, weight: parseFloat(e.target.value) })} className="border px-2 py-1" /></td>
              <td><input type="number" value={newChild.height || 0} onChange={(e) => setNewChild({ ...newChild, height: parseFloat(e.target.value) })} className="border px-2 py-1" /></td>
              <td><button onClick={() => handleSaveChild(newChild)} className="bg-green-500 text-white px-4 py-2 rounded">Save</button></td>
            </tr>
          )}
          {childrenData.map((child) => (
            <tr key={child.childId} className="hover:bg-gray-100">
              {editingChildId === child.childId ? (
                <>
                  <td><input value={editedChild?.name || ""} onChange={(e) => setEditedChild({ ...editedChild!, name: e.target.value })} className="border px-2 py-1" /></td>
                  <td><select value={editedChild?.gender || ""} onChange={(e) => setEditedChild({ ...editedChild!, gender: e.target.value })} className="border px-2 py-1"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></td>
                  <td><DatePicker selected={editedChild?.dateOfBirth ? new Date(editedChild.dateOfBirth) : null} onChange={(date: Date | null) => setEditedChild({ ...editedChild!, dateOfBirth: date! })} className="border px-2 py-1" /></td>
                  <td><input type="number" value={editedChild?.weight || 0} onChange={(e) => setEditedChild({ ...editedChild!, weight: parseFloat(e.target.value) })} className="border px-2 py-1" /></td>
                  <td><input type="number" value={editedChild?.height || 0} onChange={(e) => setEditedChild({ ...editedChild!, height: parseFloat(e.target.value) })} className="border px-2 py-1" /></td>
                  <td>
                    <button onClick={handleUpdateChild} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
                    <button onClick={() => setEditingChildId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td onClick={() => handleChildClick(child)} className="cursor-pointer border px-4 py-2">{child.name}</td>
                  <td className="border px-4 py-2">{child.gender}</td>
                  <td className="border px-4 py-2">{child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : "N/A"}</td>
                  <td className="border px-4 py-2">{child.weight}</td>
                  <td className="border px-4 py-2">{child.height}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEditClick(child)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDeleteChild(child.childId)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedChild && (
        <div ref={cardRef} className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <ChildCard
            child={selectedChild}
            vaccineSchedule={selectedChild.dateOfBirth ? getVaccineSchedule(new Date(selectedChild.dateOfBirth)) : []}
            onShareAsPng={handleShareAsPng}
          />
        </div>
      )}
    </div>
  );
};

export default ChildVaccinationTable;
