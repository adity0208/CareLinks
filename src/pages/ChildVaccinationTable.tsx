import React, { useState, useEffect, useRef } from "react";
import { optimizedFirestoreService, ChildData } from "../services/firebase/optimizedFirestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ChildCard from "../components/Vaccination/ChildCard";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVaccineSchedule } from "../utils/vaccineSchedule";
import { useAuth } from "../contexts/AuthContext";
import {
    User,
    Edit,
    Plus,
    Save,
    Search,
    Trash,
    X,
    Activity
} from "lucide-react";

const ChildVaccinationTable: React.FC = () => {
    const { currentUser } = useAuth();
    const [childrenData, setChildrenData] = useState<ChildData[]>([]);
    const [filteredData, setFilteredData] = useState<ChildData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newChild, setNewChild] = useState<Partial<ChildData> | null>(null);
    const [editingChildId, setEditingChildId] = useState<string | null>(null);
    const [editedChild, setEditedChild] = useState<Partial<ChildData> | null>(null);
    const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const data = await optimizedFirestoreService.getChildrenData(currentUser.uid);
                setChildrenData(data);
                setFilteredData(data);
            } catch (error) {
                console.error("Error fetching children data:", error);
                toast.error("Failed to load child data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        const filtered = childrenData.filter(child =>
            child.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, childrenData]);


    const handleAddChild = () => {
        setIsAddingNew(true);
        setNewChild({
            name: "",
            dateOfBirth: null,
            gender: "Male",
            malnutritionStatus: "Normal",
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

    const handleNewChildInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof ChildData) => {
        if (!newChild) return;
        setNewChild({ ...newChild, [field]: e.target.value });
    };


    const handleDateChange = (date: Date | null) => {
        if (isAddingNew && newChild) {
            setNewChild({ ...newChild, dateOfBirth: date });
        } else if (editingChildId && editedChild) {
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
                dateOfBirth,
                gender,
                malnutritionStatus,
                weight: Number(weight),
                height: Number(height),
            };
            await optimizedFirestoreService.saveChildData(childDataToSave, currentUser!.uid);
            const data = await optimizedFirestoreService.getChildrenData(currentUser!.uid);
            setChildrenData(data);
            setNewChild(null);
            setIsAddingNew(false);
            toast.success("Child added successfully!");
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
                weight: Number(weight),
                height: Number(height),
                nextAppointment,
                mobileNumber,
            };

            await optimizedFirestoreService.updateChildData(editingChildId, childDataToUpdate, currentUser!.uid);
            const data = await optimizedFirestoreService.getChildrenData(currentUser!.uid);
            setChildrenData(data);
            setEditingChildId(null);
            setEditedChild(null);
            toast.success("Child record updated!");
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
                await optimizedFirestoreService.deleteChildData(childId, currentUser!.uid);
                const data = await optimizedFirestoreService.getChildrenData(currentUser!.uid);
                setChildrenData(data);
                toast.success("Record deleted successfully");
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

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'normal': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'mild': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'severe': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const tableInputStyle = "w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm";
    const selectStyle = "w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm appearance-none";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Background Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                Child Immunization Records
                            </h1>
                            <p className="text-slate-600 text-sm mt-1">Track vaccinations and growth metrics</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search children..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm w-64"
                            />
                        </div>
                        <button
                            onClick={handleAddChild}
                            disabled={isAddingNew}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Child</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col min-h-[500px]">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-slate-500">Loading records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-slate-100 to-blue-50/50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date of Birth</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Weight (kg)</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Height (cm)</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isAddingNew && newChild && (
                                        <tr className="bg-blue-50/50 animate-in fade-in duration-300">
                                            <td className="px-6 py-4"><input value={newChild.name || ""} onChange={(e) => handleNewChildInputChange(e, 'name')} className={tableInputStyle} placeholder="Name" autoFocus /></td>
                                            <td className="px-6 py-4">
                                                <select value={newChild.gender || "Male"} onChange={(e) => handleNewChildInputChange(e, 'gender')} className={selectStyle}>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <DatePicker selected={newChild.dateOfBirth} onChange={handleDateChange} className={tableInputStyle} placeholderText="Select DOB" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select value={newChild.malnutritionStatus || "Normal"} onChange={(e) => handleNewChildInputChange(e, 'malnutritionStatus')} className={selectStyle}>
                                                    <option value="Normal">Normal</option>
                                                    <option value="Mild">Mild</option>
                                                    <option value="Moderate">Moderate</option>
                                                    <option value="Severe">Severe</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4"><input type="number" value={newChild.weight || 0} onChange={(e) => handleNewChildInputChange(e, 'weight')} className={tableInputStyle} /></td>
                                            <td className="px-6 py-4"><input type="number" value={newChild.height || 0} onChange={(e) => handleNewChildInputChange(e, 'height')} className={tableInputStyle} /></td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end space-x-2">
                                                    <button onClick={handleSaveNewChild} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"><Save className="w-4 h-4" /></button>
                                                    <button onClick={handleCancelEdit} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><X className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {filteredData.length === 0 && !isAddingNew ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-12 text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                        <Search className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <p className="text-lg font-medium">No children found</p>
                                                    <p className="text-sm">Try dealing with your search or add a new record.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((child) => (
                                            <tr key={child.childId} className="hover:bg-slate-50/80 transition-colors group">
                                                {editingChildId === child.childId ? (
                                                    // Editing Row
                                                    <>
                                                        <td className="px-6 py-4"><input value={editedChild?.name || ""} onChange={(e) => handleInputChange(e, 'name')} className={tableInputStyle} /></td>
                                                        <td className="px-6 py-4">
                                                            <select value={editedChild?.gender || "Male"} onChange={(e) => handleInputChange(e, 'gender')} className={selectStyle}>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <DatePicker selected={editedChild?.dateOfBirth} onChange={handleDateChange} className={tableInputStyle} />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select value={editedChild?.malnutritionStatus || ""} onChange={(e) => handleInputChange(e, 'malnutritionStatus')} className={selectStyle}>
                                                                <option value="Normal">Normal</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4"><input type="number" value={editedChild?.weight || 0} onChange={(e) => handleInputChange(e, 'weight')} className={tableInputStyle} /></td>
                                                        <td className="px-6 py-4"><input type="number" value={editedChild?.height || 0} onChange={(e) => handleInputChange(e, 'height')} className={tableInputStyle} /></td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end space-x-2">
                                                                <button onClick={handleUpdateChild} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"><Save className="w-4 h-4" /></button>
                                                                <button onClick={handleCancelEdit} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><X className="w-4 h-4" /></button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    // Display Row
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleRowClick(child)}>
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${child.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                                                                    }`}>
                                                                    {child.name.charAt(0)}
                                                                </div>
                                                                <div className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{child.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 text-sm">{child.gender}</td>
                                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                                            {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(child.malnutritionStatus)}`}>
                                                                {child.malnutritionStatus || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 font-medium text-sm">{child.weight}</td>
                                                        <td className="px-6 py-4 text-slate-600 font-medium text-sm">{child.height}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleRowClick(child)}
                                                                    className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Activity className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditClick(child)}
                                                                    className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteChild(child.childId)}
                                                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Child Details Modal */}
            {selectedChild && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
                    <div
                        ref={cardRef}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 right-0 z-10 flex justify-end p-4">
                            <button
                                onClick={() => setSelectedChild(null)}
                                className="bg-white/50 hover:bg-white p-2 rounded-full backdrop-blur-sm transition-all shadow-sm"
                            >
                                <X className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>

                        <div className="p-1">
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
                </div>
            )}
        </div>
    );
};

export default ChildVaccinationTable;