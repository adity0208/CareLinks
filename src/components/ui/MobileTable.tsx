import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, Calendar, Phone, Eye } from 'lucide-react';
import { RiWhatsappFill } from 'react-icons/ri';

interface MobileTableProps {
    data: any[];
    columns: {
        key: string;
        label: string;
        render?: (value: any, item: any) => React.ReactNode;
        mobileHidden?: boolean;
    }[];
    actions?: {
        label: string;
        icon: React.ReactNode;
        onClick: (item: any) => void;
        variant?: 'primary' | 'secondary' | 'danger';
    }[];
    onRowClick?: (item: any) => void;
}

export default function MobileTable({ data, columns, actions, onRowClick }: MobileTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const toggleDropdown = (id: string) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Mobile Card View
    const MobileCard = ({ item }: { item: any }) => {
        const isExpanded = expandedRows.has(item.id);
        const isDropdownActive = activeDropdown === item.id;

        return (
            <div className="card mb-4 overflow-hidden">
                <div className="card-body">
                    {/* Main Info Row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate text-lg">
                                {item.name || 'Unknown Patient'}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <span>Age: {item.age || 'N/A'}</span>
                                <span className="capitalize">{item.gender || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Actions Dropdown */}
                        {actions && actions.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown(item.id)}
                                    className="btn btn-ghost btn-sm p-2"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {isDropdownActive && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                        {actions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    action.onClick(item);
                                                    setActiveDropdown(null);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                                                    }`}
                                            >
                                                {action.icon}
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{item.mobileNumber || 'No phone'}</span>
                        </div>
                        {item.mobileNumber && (
                            <a
                                href={`https://wa.me/${item.mobileNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-sm p-1"
                            >
                                <RiWhatsappFill className="w-4 h-4 text-green-500" />
                            </a>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mb-3">
                        <button className="btn btn-sm btn-secondary flex-1">
                            <Calendar className="w-4 h-4" />
                            Schedule
                        </button>
                        <button className="btn btn-sm btn-secondary flex-1">
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                        <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
                            {/* Vital Signs */}
                            {item.vitalSigns && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Vital Signs</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">BP:</span>
                                            <span className="ml-1">{item.vitalSigns.bloodPressure || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Temp:</span>
                                            <span className="ml-1">{item.vitalSigns.temperature || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">HR:</span>
                                            <span className="ml-1">{item.vitalSigns.heartRate || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Symptoms */}
                            {item.symptoms && item.symptoms.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Symptoms</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {item.symptoms.map((symptom: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {symptom}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {item.notes && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                    <p className="text-sm text-gray-600">{item.notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Expand/Collapse Button */}
                    <button
                        onClick={() => toggleRow(item.id)}
                        className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            </div>
        );
    };

    // Desktop Table View
    const DesktopTable = () => (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className={column.mobileHidden ? 'hidden lg:table-cell' : ''}>
                                {column.label}
                            </th>
                        ))}
                        {actions && actions.length > 0 && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onRowClick?.(item)}
                            className={onRowClick ? 'cursor-pointer' : ''}
                        >
                            {columns.map((column) => (
                                <td key={column.key} className={column.mobileHidden ? 'hidden lg:table-cell' : ''}>
                                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                                </td>
                            ))}
                            {actions && actions.length > 0 && (
                                <td>
                                    <div className="flex gap-2">
                                        {actions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    action.onClick(item);
                                                }}
                                                className={`btn btn-sm ${action.variant === 'danger' ? 'btn-danger' :
                                                        action.variant === 'primary' ? 'btn-primary' : 'btn-secondary'
                                                    }`}
                                                title={action.label}
                                            >
                                                {action.icon}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            {/* Mobile View */}
            <div className="block lg:hidden">
                {data.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    </div>
                ) : (
                    data.map((item) => <MobileCard key={item.id} item={item} />)
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
                {data.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    </div>
                ) : (
                    <DesktopTable />
                )}
            </div>

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </>
    );
}