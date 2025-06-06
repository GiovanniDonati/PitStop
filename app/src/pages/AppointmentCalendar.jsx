import React, { useState, useEffect } from "react";

// Message Box Component (for confirmations/alerts)
// This component is included here as it's a direct dependency for AppointmentCalendar
const MessageBox = ({ message, type, onClose }) => {
  const bgColor =
    type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-green-100 border-green-400 text-green-700";
  const borderColor = type === "error" ? "border-red-500" : "border-green-500";

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center ${bgColor} ${borderColor} border-l-4 z-50`}
    >
      <p className="flex-grow">{message}</p>
      <button onClick={onClose} className="ml-4 text-lg font-bold">
        &times;
      </button>
    </div>
  );
};

// Helper function to convert time string (HH:MM) to minutes from midnight
// This helper is also included here as it's specific to AppointmentCalendar's logic
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to format a Date object to YYYY-MM-DD string
const formatDateToISO = (date) => date.toISOString().split("T")[0];

// Helper function to get the Monday of a given week (at 00:00:00 local time)
// This helper is kept as it might be useful for initial load or other specific snapping,
// but it's not directly used in the 3-day navigation logic anymore.
const getMondayOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday (1)
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  monday.setHours(0, 0, 0, 0); // Ensure it's the very start of the day
  return monday;
};

// Appointment Calendar Component
const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]); // Local state for appointments
  // Initialize currentWeekStart to today's date, normalized to start of day
  const [currentWeekStart, setCurrentWeekStart] = useState(
    () => new Date(new Date().setHours(0, 0, 0, 0))
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Form state for new/editing appointment
  const [formData, setFormData] = useState({
    clientName: "",
    vehicle: "",
    serviceType: "",
    date: formatDateToISO(currentWeekStart), // Default to current selected day (formatted string)
    time: "09:00", // HH:MM format
    duration: "60", // in minutes
  });

  // Load appointments from localStorage on initial component mount
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem("carAppointments");
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error("Failed to load appointments from localStorage:", error);
      showMessage(
        "Erro ao carregar agendamentos do armazenamento local.",
        "error"
      );
    }
  }, []);

  // Save appointments to localStorage whenever the 'appointments' state changes
  useEffect(() => {
    try {
      localStorage.setItem("carAppointments", JSON.stringify(appointments));
    } catch (error) {
      console.error("Failed to save appointments to localStorage:", error);
      showMessage(
        "Erro ao salvar agendamentos no armazenamento local.",
        "error"
      );
    }
  }, [appointments]);

  // Update form date when currentWeekStart changes (set to the first day of the visible week by default)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: formatDateToISO(currentWeekStart), // Use helper for consistent formatting
    }));
  }, [currentWeekStart]);

  // Function to generate Date objects for the current 3-day view (for display with toLocaleDateString)
  const generateVisibleDateObjects = (startDate) => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      // Display 3 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(0, 0, 0, 0); // Normalize to start of day
      dates.push(date);
    }
    return dates;
  };

  const visibleDateObjects = generateVisibleDateObjects(currentWeekStart);

  // Function to generate YYYY-MM-DD strings for filtering (from Date objects)
  const generateVisibleDateStrings = (dateObjects) => {
    return dateObjects.map((date) => formatDateToISO(date));
  };

  const visibleDateStrings = generateVisibleDateStrings(visibleDateObjects);

  // Filter appointments for the currently visible dates and sort them by time
  const appointmentsForVisibleDates = appointments
    .filter((app) => {
      const appDateString = app.date; // already YYYY-MM-DD from form input and localStorage

      // Direct string comparison for robust filtering
      return visibleDateStrings.includes(appDateString);
    })
    .sort((a, b) => {
      // Sort first by date string, then by time string
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date); // String comparison for YYYY-MM-DD
      }
      const timeA = timeToMinutes(a.time);
      const timeB = timeToMinutes(b.time);
      return timeA - timeB;
    });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding or updating an appointment (now using local state)
  const handleAddOrUpdateAppointment = async () => {
    if (
      !formData.clientName ||
      !formData.vehicle ||
      !formData.serviceType ||
      !formData.date ||
      !formData.time ||
      !formData.duration
    ) {
      showMessage(
        "Por favor, preencha todos os campos do agendamento.",
        "error"
      );
      return;
    }

    const appData = {
      ...formData,
      duration: parseInt(formData.duration),
      // Ensure dateTime is also stored consistently, though 'date' is used for primary filtering
      dateTime: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
    };

    if (editingAppointment) {
      setAppointments((prevApps) =>
        prevApps.map((app) =>
          app.id === editingAppointment.id ? { ...appData, id: app.id } : app
        )
      );
      showMessage("Agendamento atualizado com sucesso!");
    } else {
      const newId = Date.now().toString(); // Simple unique ID for local state
      setAppointments((prevApps) => [...prevApps, { ...appData, id: newId }]);
      showMessage("Agendamento adicionado com sucesso!");
    }
    setShowAddModal(false);
    setEditingAppointment(null);
    resetFormData();
  };

  // Set form data for editing an existing appointment
  const handleEditAppointment = (app) => {
    setEditingAppointment(app);
    setFormData({
      clientName: app.clientName,
      vehicle: app.vehicle,
      serviceType: app.serviceType,
      date: app.date, // This is already in YYYY-MM-DD string format
      time: app.time,
      duration: String(app.duration),
    });
    setShowAddModal(true);
  };

  // Handle deleting an appointment (now using local state)
  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      setAppointments((prevApps) => prevApps.filter((app) => app.id !== id));
      showMessage("Agendamento excluído com sucesso!");
    }
  };

  // Reset form fields to initial state
  const resetFormData = () => {
    setFormData({
      clientName: "",
      vehicle: "",
      serviceType: "",
      date: formatDateToISO(currentWeekStart), // Reset to current week start date (formatted)
      time: "09:00",
      duration: "60",
    });
  };

  // Display messages to the user
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  // Calendar navigation functions - now jumping by 3 days
  const goToPrevious3Days = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 3); // Go back 3 days
    setCurrentWeekStart(newDate);
  };

  const goToNext3Days = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 3); // Go forward 3 days
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    setCurrentWeekStart(new Date(new Date().setHours(0, 0, 0, 0))); // Set to today's date, normalized
  };

  // Generate time slots for the daily view (e.g., every 30 minutes from 8 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
      if (hour < 18) {
        slots.push(`${String(hour).padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Agendamento de Revisões
      </h2>
      <MessageBox
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      {/* Calendar Navigation and Add Button */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6 flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious3Days} // Updated onClick to new function
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
          >
            {/* Left Arrow Icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <span className="text-xl font-semibold text-gray-800">
            {/* Display the date range for the current view */}
            {visibleDateObjects[0].toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {visibleDateObjects[2].toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <button
            onClick={goToNext3Days} // Updated onClick to new function
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
          >
            {/* Right Arrow Icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="ml-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 shadow-sm"
          >
            Hoje
          </button>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setEditingAppointment(null);
            resetFormData();
          }}
          className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out shadow-lg flex items-center"
        >
          {/* Plus Icon */}
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Novo Agendamento
        </button>
      </div>

      {/* Appointment Grid */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {/* Header Row for Days */}
        <div className="grid grid-cols-[80px_repeat(3,minmax(0,1fr))] md:grid-cols-[100px_repeat(3,minmax(0,1fr))] gap-x-4 border-b border-gray-200 pb-2 mb-2">
          <div className="text-right pr-2 text-sm font-semibold text-gray-600">
            Horário
          </div>
          {visibleDateObjects.map((date) => (
            <div
              key={date.toISOString()}
              className="text-center text-sm font-semibold text-gray-600"
            >
              {date.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
              })}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[80px_repeat(3,minmax(0,1fr))] md:grid-cols-[100px_repeat(3,minmax(0,1fr))] gap-x-4 relative">
          {/* Time Column (Left side) */}
          <div className="flex flex-col">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="h-12 border-b border-gray-200 flex items-start py-1 justify-end pr-2 text-sm text-gray-500"
              >
                {slot}
              </div>
            ))}
          </div>

          {/* Columns for each day (right side) */}
          {visibleDateObjects.map((date, dayIndex) => (
            <div
              key={date.toISOString()}
              className="relative border-l border-gray-200 h-full"
            >
              {appointmentsForVisibleDates
                .filter((app) => app.date === formatDateToISO(date)) // Use consistent string comparison
                .map((app) => {
                  const startTimeInMinutes = timeToMinutes(app.time);
                  const startOfDayMinutes = timeToMinutes("08:00");
                  const topOffsetMinutes =
                    startTimeInMinutes - startOfDayMinutes;

                  const pxPerMinute = 48 / 30;
                  const top = topOffsetMinutes * pxPerMinute;
                  const height = app.duration * pxPerMinute;

                  const colors = [
                    "bg-blue-200",
                    "bg-green-200",
                    "bg-yellow-200",
                    "bg-purple-200",
                    "bg-red-200",
                  ];
                  const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];

                  return (
                    <div
                      key={app.id}
                      className={`absolute w-full p-2 rounded-lg shadow-sm cursor-pointer border border-transparent hover:border-blue-500 transition duration-200 ${randomColor} text-sm text-gray-800`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: 0, // Position within its grid column
                        right: 0,
                        overflow: "hidden",
                      }}
                      onClick={() => handleEditAppointment(app)}
                    >
                      <p className="font-semibold truncate">
                        {app.clientName} - {app.vehicle}
                      </p>
                      <p className="text-xs truncate">{app.serviceType}</p>
                      <p className="text-xs">
                        {app.time} ({app.duration} min)
                      </p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="clientName"
                placeholder="Nome do Cliente"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="vehicle"
                placeholder="Veículo (Marca/Modelo)"
                value={formData.vehicle}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="serviceType"
                placeholder="Tipo de Serviço (Ex: Revisão, Troca de Óleo)"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="duration"
                placeholder="Duração (minutos)"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAppointment(null);
                  resetFormData();
                }}
                className="bg-gray-300 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-400 transition duration-200 shadow-md"
              >
                Cancelar
              </button>
              {editingAppointment && (
                <button
                  onClick={() => handleDeleteAppointment(editingAppointment.id)}
                  className="bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600 transition duration-200 shadow-md"
                >
                  Excluir
                </button>
              )}
              <button
                onClick={handleAddOrUpdateAppointment}
                className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg"
              >
                {editingAppointment ? "Atualizar" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;
