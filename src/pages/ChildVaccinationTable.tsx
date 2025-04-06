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
    const [editingChildId, setEditingChildId] = useState<string | null>(null);
    const [editedChild, setEditedChild] = useState<Partial<ChildData> | null>(null);
    const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
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
        setIsAddingNew(true);
        setNewChild({
            name: "",
            dateOfBirth: null,
            gender: "Male",
            malnutritionStatus: "",
            weight: 0,
            height: 0,
        });
        setEditingChildId(null);
        setSelectedChild(null);
    };

    const handleEditClick = (child: ChildData) => {
        setEditingChildId(child.childId);
        setEditedChild({ ...child });
        setIsAddingNew(false);
        setNewChild(null);
        setSelectedChild(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof ChildData) => {
        setEditedChild({ ...editedChild, [field]: e.target.value });
    };

    const handleDateChange = (date: Date | null) => {
        if (isAddingNew) {
            setNewChild({ ...newChild, dateOfBirth: date });
        } else if (editingChildId) {
            setEditedChild({ ...editedChild, dateOfBirth: date });
        }
    };

    const handleSaveNewChild = async () => {
        if (!newChild?.name || newChild?.dateOfBirth === undefined || !newChild?.gender || newChild?.malnutritionStatus === undefined) {
            toast.error("Please fill out all required fields");
            return;
        }

        try {
            const { name, dateOfBirth, gender, weight = 0, height = 0, malnutritionStatus = "" } = newChild;

            const childDataToSave: Omit<ChildData, "childId"> = {
                name,
                dateOfBirth, // dateOfBirth is already Date | null from DatePicker
                gender,
                malnutritionStatus,
                weight,
                height,
            };
            await firestoreService.saveChildData(childDataToSave);
            const data = await firestoreService.getChildrenData();
            setChildrenData(data);
            setNewChild(null);
            setIsAddingNew(false);
            toast.success("Child data saved successfully!");
        } catch (error) {
            console.error("Error saving child data:", error);
            toast.error("Failed to save child data.");
        }
    };

    const handleUpdateChild = async () => {
        if (!editedChild?.name || editedChild?.dateOfBirth === undefined || !editedChild?.gender || editedChild?.malnutritionStatus === undefined || !editingChildId) {
            toast.error("Please fill out all required fields");
            return;
        }

        try {
            const { name, dateOfBirth, gender, weight = 0, height = 0, malnutritionStatus = "", nextAppointment, mobileNumber } = editedChild;

            const childDataToUpdate: Omit<ChildData, "childId"> = {
                name,
                dateOfBirth,
                gender,
                malnutritionStatus,
                weight,
                height,
                nextAppointment,
                mobileNumber,
            };

            await firestoreService.updateChildData(editingChildId, childDataToUpdate);
            const data = await firestoreService.getChildrenData();
            setChildrenData(data);
            setEditingChildId(null);
            setEditedChild(null);
            toast.success("Child data updated successfully!");
        } catch (error) {
            console.error("Error updating child data:", error);
            toast.error("Failed to update child data.");
        }
    };

    const handleCancelEdit = () => {
        setEditingChildId(null);
        setEditedChild(null);
        setIsAddingNew(false);
        setNewChild(null);
    };

    const handleDeleteChild = async (childId: string) => {
        if (window.confirm("Are you sure you want to delete this child's record?")) {
            try {
                await firestoreService.deleteChildData(childId);
                const data = await firestoreService.getChildrenData();
                setChildrenData(data);
                toast.success("Child data deleted successfully!");
            } catch (error) {
                console.error("Error deleting child data:", error);
                toast.error("Failed to delete child data.");
            }
        }
    };

    const handleRowClick = (child: ChildData) => {
        if (editingChildId !== child.childId) {
            setSelectedChild(child);
        }
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
        if (cardRef.current && selectedChild) {
            try {
                const canvas = await html2canvas(cardRef.current);
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `${selectedChild.name}-record.png`;
                link.click();
            } catch (error) {
                console.error("Error while creating PNG", error);
                toast.error("Failed to create PNG");
            }
        } else {
            toast.warn("Please select a child to share.");
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
                        <th className="border px-4 py-2">Malnutrition Status</th>
                        <th className="border px-4 py-2">Weight</th>
                        <th className="border px-4 py-2">Height</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isAddingNew && newChild && (
                        <tr>
                            {/* ... (Add New Child row input fields) ... */}
                            <td>
                                <input
                                    value={newChild.name || ""}
                                    onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                                    className="border px-2 py-1"
                                    placeholder="Enter Name"
                                />
                            </td>
                            <td>
                                <select
                                    value={newChild.gender || "Male"}
                                    onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}
                                    className="border px-2 py-1"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </td>
                            <td>
                                <DatePicker
                                    selected={newChild.dateOfBirth || null}
                                    onChange={handleDateChange}
                                    className="border px-2 py-1"
                                    placeholderText="Select DOB"
                                />
                            </td>
                            <td>
                                <input
                                    value={newChild.malnutritionStatus || ""}
                                    onChange={(e) => setNewChild({ ...newChild, malnutritionStatus: e.target.value })}
                                    className="border px-2 py-1"
                                    placeholder="Enter Status"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={newChild.weight || 0}
                                    onChange={(e) =>
                                        setNewChild({ ...newChild, weight: parseFloat(e.target.value) })
                                    }
                                    className="border px-2 py-1"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={newChild.height || 0}
                                    onChange={(e) =>
                                        setNewChild({ ...newChild, height: parseFloat(e.target.value) })
                                    }
                                    className="border px-2 py-1"
                                />
                            </td>
                            <td>
                                <button
                                    onClick={handleSaveNewChild}
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-400 text-white px-2 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}
                    {childrenData.map((child) => (
                        <tr key={child.childId} className="hover:bg-gray-100">
                            {editingChildId === child.childId ? (
                                <>
                                    {/* ... (Editable row input fields) ... */}
                                    <td>
                                        <input
                                            value={editedChild?.name || ""}
                                            onChange={(e) => handleInputChange(e, "name")}
                                            className="border px-2 py-1"
                                            placeholder="Enter Name"
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={editedChild?.gender || "Male"}
                                            onChange={(e) => handleInputChange(e, "gender")}
                                            className="border px-2 py-1"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </td>
                                    <td>
                                        <DatePicker
                                            selected={editedChild?.dateOfBirth || null}
                                            onChange={handleDateChange}
                                            className="border px-2 py-1"
                                            placeholderText="Select DOB"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={editedChild?.malnutritionStatus || ""}
                                            onChange={(e) => handleInputChange(e, "malnutritionStatus")}
                                            className="border px-2 py-1"
                                            placeholder="Enter Status"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editedChild?.weight || 0}
                                            onChange={(e) => handleInputChange(e, "weight")}
                                            className="border px-2 py-1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editedChild?.height || 0}
                                            onChange={(e) => handleInputChange(e, "height")}
                                            className="border px-2 py-1"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={handleUpdateChild}
                                            className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-400 text-white px-2 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    {/* ... (Normal row display) ... */}
                                    <td onClick={() => handleRowClick(child)} className="cursor-pointer border px-4 py-2">{child.name}</td>
                                    <td className="border px-4 py-2">{child.gender}</td>
                                    <td className="border px-4 py-2">
                                        {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">{child.malnutritionStatus}</td>
                                    <td className="border px-4 py-2">{child.weight}</td>
                                    <td className="border px-4 py-2">{child.height}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleEditClick(child)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChild(child.childId)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedChild && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div
                        ref={cardRef}
                        className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl"
                    >
                        <ChildCard
                            child={selectedChild}
                            vaccineSchedule={
                                selectedChild.dateOfBirth
                                    ? getVaccineSchedule(new Date(selectedChild.dateOfBirth))
                                    : []
                            }
                            onShareAsPng={handleShareAsPng}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChildVaccinationTable;