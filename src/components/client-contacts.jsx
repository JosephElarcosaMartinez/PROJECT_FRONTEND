import React, { useState, useRef } from "react";
import AddContact from "../components/add-contact";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const ClientContact = () => {
  const [tableData, setTableData] = useState([
    {
      id: 1,
      clientContact_fullname: "Maria Gomez",
      clientContact_email: "maria@example.com",
      clientContact_phonenum: "09123456789",
      clientContact_relation: "Sister",
      clientContact_client: "Juan Dela Cruz",
    },
    {
      id: 2,
      clientContact_fullname: "James Smith",
      clientContact_email: "james@example.com",
      clientContact_phonenum: "09987654321",
      clientContact_relation: "Brother",
      clientContact_client: "John Smith",
    },
    {
      id: 3,
      clientContact_fullname: "Anna Reyes",
      clientContact_email: "anna@example.com",
      clientContact_phonenum: "09111111111",
      clientContact_relation: "Mother",
      clientContact_client: "Leo Reyes",
    },
    {
      id: 4,
      clientContact_fullname: "Carla Santos",
      clientContact_email: "carla@example.com",
      clientContact_phonenum: "09222222222",
      clientContact_relation: "Friend",
      clientContact_client: "Diana Santos",
    },
    {
      id: 5,
      clientContact_fullname: "Mark Tan",
      clientContact_email: "mark@example.com",
      clientContact_phonenum: "09333333333",
      clientContact_relation: "Father",
      clientContact_client: "Luke Tan",
    },
    {
      id: 6,
      clientContact_fullname: "Nina Cruz",
      clientContact_email: "nina@example.com",
      clientContact_phonenum: "09444444444",
      clientContact_relation: "Wife",
      clientContact_client: "Samuel Cruz",
    },
  ]);

  const [showAddContacts, setShowAddContacts] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editContact, setEditContact] = useState(null);

  // For Delete Confirmation Modal
  const [isDeleteContactModalOpen, setIsDeleteContactModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const itemsPerPage = 5;

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const modalRef = useRef(null);
  useClickOutside([modalRef], () => {
    if (isModalOpen) setIsModalOpen(false);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-blue rounded-xl">
      {error && (
        <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
          <div>
            <span>{error.message}</span>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title">Clients {" > "} Contacts</h1>
          <p className="text-sm text-gray-500">
            Manage all client contacts information here...
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
        <input
          type="text"
          placeholder="Search client contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 md:flex-1"
        />
        <button
          onClick={() => {
            setSearchTerm("");
            setShowAddContacts(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          Add Contacts
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-lg overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="card-title text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Company Name / Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role/Relation</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white">
            {currentItems.map((contact) => (
              <tr
                key={contact.id}
                className="border-t hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <td className="px-4 py-3">{contact.clientContact_fullname}</td>
                <td className="px-4 py-3">{contact.clientContact_email}</td>
                <td className="px-4 py-3">{contact.clientContact_phonenum}</td>
                <td className="px-4 py-3">{contact.clientContact_relation}</td>
                <td className="px-4 py-3">{contact.clientContact_client}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setEditContact(contact)}
                      className="text-yellow-600 hover:text-yellow-700"
                      title="Edit Contact"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setContactToDelete(contact);
                        setIsDeleteContactModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                      title="Delete Contact"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
        >
          &lt;
        </button>

        <span className="text-sm text-gray-700 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
        >
          &gt;
        </button>
      </div>

      {/* Add Contact Modal */}
      {showAddContacts && (
        <AddContact
          onClose={() => setShowAddContacts(false)}
          onAdd={(newContact) => {
            setTableData((prev) => [
              ...prev,
              { id: Date.now(), ...newContact },
            ]);
            setCurrentPage(1);
            setShowAddContacts(false);
          }}
        />
      )}

      {/* Edit Contact Modal */}
      {editContact && (
        <EditContactModal
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSave={(updatedContact) => {
            setTableData((prevData) =>
              prevData.map((item) =>
                item.id === updatedContact.id ? updatedContact : item
              )
            );
            setEditContact(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete contact{" "}
              <span className="font-semibold">
                {contactToDelete?.clientContact_fullname}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteContactModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTableData((prevData) =>
                    prevData.filter((item) => item.id !== contactToDelete.id)
                  );
                  setIsDeleteContactModalOpen(false);
                  setContactToDelete(null);

                  toast.success("Contact successfully deleted", {
                    id: "delete-success",
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="mt-6">
        <a href="/clients" className="text-blue-600 hover:underline">
          {" < Back "}
        </a>
      </div>
    </div>
  );
};

export default ClientContact;

// EditContactModal Component
const EditContactModal = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...contact });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-slate-800">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Edit Contact
        </h2>
        <div className="space-y-3">
          <input
            name="clientContact_fullname"
            value={formData.clientContact_fullname}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Full Name"
          />
          <input
            name="clientContact_email"
            value={formData.clientContact_email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Email"
          />
          <input
            name="clientContact_phonenum"
            value={formData.clientContact_phonenum}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Phone Number"
          />
          <input
            name="clientContact_relation"
            value={formData.clientContact_relation}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Relation"
          />
          <input
            name="clientContact_client"
            value={formData.clientContact_client}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Client"
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(formData);
              toast.success("Contact successfully updated", {
                id: "update-success",
              });
            }}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
