import React, { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    marks1: "",
    marks2: "",
    marks3: "",
    marks4: "",
    marks5: "",
  });

  const [errors, setErrors] = useState({});
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState({ name: "", division: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let message = "";
    if (name === "name" && !value.trim()) message = "Name is required.";
    else if (name === "age") {
      if (!/^[0-9]+$/.test(value)) message = "Age must be a number.";
    } else if (["marks1", "marks2", "marks3", "marks4", "marks5"].includes(name)) {
      const num = Number(value);
      if (!/^-?\d+$/.test(value)) message = `Marks ${name.slice(1)} must be a number.`;
      else if (num < 0) message = `Marks ${name.slice(1)} cannot be negative.`;
      else if (num > 100) message = `Marks ${name.slice(1)} cannot exceed 100.`;
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validate = () => {
    const allFields = Object.keys(formData);
    allFields.forEach((field) => validateField(field, formData[field]));
    return allFields.every((field) => !errors[field]);
  };

  const calculatePercentage = (marks1, marks2, marks3, marks4, marks5) => {
    const total = [marks1, marks2, marks3, marks4, marks5].reduce((acc, mark) => acc + Number(mark), 0);
    return (total / 5).toFixed(1);
  };

  const getDivision = (percentage) => {
    if (percentage >= 60) return "First Division";
    else if (percentage >= 50) return "Second Division";
    else return "Third Division";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const percentage = calculatePercentage(
      formData.marks1,
      formData.marks2,
      formData.marks3,
      formData.marks4,
      formData.marks5
    );
    const division = getDivision(percentage);

    const newRecord = { ...formData, percentage, division };

    if (editIndex !== null) {
      const updatedRecords = [...records];
      updatedRecords[editIndex] = newRecord;
      setRecords(updatedRecords);
      setEditIndex(null);
    } else {
      setRecords([...records, newRecord]);
    }

    setFormData({ name: "", age: "", marks1: "", marks2: "", marks3: "", marks4: "", marks5: "" });
    setErrors({});
  };

  const handleEdit = (index) => {
    setFormData(records[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      r.division.toLowerCase().includes(filter.division.toLowerCase())
  );
  const studentInput=["name", "age", "marks1", "marks2", "marks3", "marks4", "marks5"]

  return (
    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen font-sans">
      <h2 className="text-1xl font-bold mb-6 text-blue-800">Enter Student Record</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 bg-white p-6 rounded-lg shadow-md">
        {studentInput.map((field) => (
          <div key={field} className="flex flex-col">
            <label className="mb-1 font-medium text-sm text-gray-700">
              {field === "name"
                ? "Student Name"
                : field === "age"
                ? "Student Age"
                : `Marks ${field.slice(1)}`}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={`border p-2 rounded focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
            />
          {console.log(formData)}
            {errors[field] && (
              <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
        >
          {editIndex !== null ? "Update Record" : "Add Record"}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Student Records</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by Name"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Filter by Division"
            value={filter.division}
            onChange={(e) => setFilter({ ...filter, division: e.target.value })}
            className="border p-2 rounded w-1/2"
          />
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 shadow-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  {["Name", "Age", "marks1", "marks2", "marks3", "marks4", "marks5", "Percentage", "Division", "Edit", "Delete"].map((head) => (
                    <th key={head} className="py-2 px-3 border">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <tr key={i} className="text-center border-t hover:bg-blue-50">
                    <td className="border px-2 py-1">{r.name}</td>
                    <td className="border px-2 py-1">{r.age}</td>
                    <td className="border px-2 py-1">{r.marks1}</td>
                    <td className="border px-2 py-1">{r.marks2}</td>
                    <td className="border px-2 py-1">{r.marks3}</td>
                    <td className="border px-2 py-1">{r.marks4}</td>
                    <td className="border px-2 py-1">{r.marks5}</td>
                    <td className="border px-2 py-1 font-medium">{r.percentage}</td>
                    <td className="border px-2 py-1">{r.division}</td>
                    <td className="border bg-grey px-2 py-1">
                      <button onClick={() => handleEdit(i)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
                        Edit
                      </button>
                    </td>
                    <td className="border px-2 py-1">
                      <button onClick={() => handleDelete(i)} className="text-white bg-red-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 ">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-6">No record found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
