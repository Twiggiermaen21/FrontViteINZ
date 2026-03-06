import { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN, fields, fieldToEndpoint } from "../constants";
import { Trash2 } from "lucide-react";
import GenerateButton from "../components/imageGeneratorElements/GenerateButton.jsx";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [addingNewField, setAddingNewField] = useState(null);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [imageName, setImageName] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [active, setActive] = useState(false);
  const examplePrompts = [
    "Futurystyczna panorama miasta nocą",
    "Słodki kot w kapeluszu",
    "Fantastyczny las ze świecącymi grzybami",
    "Minimalistyczne, abstrakcyjne kształty",
  ];

  useEffect(() => {
    const Modestaff = () => {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        setIsStaff(parsed.is_staff); 
      }
    };
    const fetchData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const responses = await Promise.all(
          fields.map((field) =>
            axios.get(`${apiUrl}/${fieldToEndpoint[field]}/`, config),
          ),
        );

        const opt = {};
        fields.forEach((field, i) => {
          opt[field] = responses[i].data;
        });
        setOptions(opt);
      } catch (err) {
        console.error("Error fetching select data", err);
        if (err.response?.status === 401) {
          setTimeout(() => window.location.reload(), 500);
        }
      }
    };
    Modestaff();
    fetchData();
  }, []);

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    if (value === "__add_new__") {
      setAddingNewField(field);
      setNewOptionValue("");
    } else {
      setSelectedValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleConfirmNewOption = async (field) => {
    const trimmed = newOptionValue.trim();
    if (!trimmed) {
      cancelAddingNewOption();
      return;
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const endpoint = fieldToEndpoint[field];
      if (!endpoint) {
        console.error(`Brak endpointa dla pola: ${field}`);
        cancelAddingNewOption();
        return;
      }

      const res = await axios.post(
        `${apiUrl}/${endpoint}/`,
        { nazwa: trimmed },
        config,
      );

      setOptions((prev) => {
        const existing = prev[field]?.results || [];
        const updated = [...existing, res.data];
        return {
          ...prev,
          [field]: { ...prev[field], results: updated },
        };
      });

      setSelectedValues((prev) => ({ ...prev, [field]: res.data.id }));
    } catch (err) {
      console.error("❌ Błąd przy dodawaniu nowej opcji:", err);
      alert("Nie udało się dodać nowej opcji do bazy danych.");
    } finally {
      cancelAddingNewOption();
    }
  };

  const cancelAddingNewOption = () => {
    setAddingNewField(null);
    setNewOptionValue("");
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const payload = { prompt, name: imageName || "Generated Image" };
      fields.forEach((field) => {
        const selectedValue = selectedValues[field];
        const availableOptions = options[field]?.results;
        if (selectedValue) {
          payload[field] = selectedValue;
        } else if (availableOptions?.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableOptions.length,
          );
          payload[field] = availableOptions[randomIndex].id;
        }
      });

      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await axios.post(`${apiUrl}/generate/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages((prev) => [...prev, res.data.url]);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteOption = async (field, id) => {
    const confirmDelete = window.confirm(
      "Czy na pewno chcesz usunąć ten element?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 🔹 Usunięcie w backendzie
      await axios.delete(`${apiUrl}/${fieldToEndpoint[field]}/${id}/`, config);

      // 🔹 Odśwież tylko dany select w options
      setOptions((prevOptions) => {
        const updatedOptions = { ...prevOptions };

        // 🛠 Konwersja typów, jeśli id jest string/number
        updatedOptions[field].results = updatedOptions[field].results.filter(
          (item) => String(item.id) !== String(id),
        );

        return updatedOptions;
      });

      // 🔹 Jeśli była wybrana usunięta opcja, wyczyść select
      setSelectedValues((prev) => {
        if (String(prev[field]) === String(id)) {
          return { ...prev, [field]: "" };
        }
        return prev;
      });

      // 🔹 Opcjonalnie zakończ tryb dodawania
      if (addingNewField === field) setAddingNewField(null);

      // alert nie jest konieczny, można pominąć
    } catch (err) {
      console.error("Błąd podczas usuwania:", err);
      alert("Nie udało się usunąć elementu ❌");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full pt-8 px-4">
      {/* LEWY PANEL */}
      <div className="lg:w-4/10 bg-[#2a2b2b] rounded-4xl p-8 shadow-lg relative">
        {/* PROMPT */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
            Twój opis grafiki
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="3"
            placeholder="Opisz, co chcesz wygenerować..."
            className="w-full p-4 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
        </div>

        {/* EXAMPLES */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3">
            Wypróbuj gotowe prompt'y:
          </h3>
          <div className="flex flex-wrap gap-3">
            {examplePrompts.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="px-4 py-2 rounded-full bg-[#6d8f91] text-white text-sm hover:bg-[#afe5e6] hover:text-[#1e1f1f] transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTY */}

        <div className="max-h-50 overflow-y-auto pr-2 grid grid-cols-1 gap-4 mb-6 custom-scroll">
          {fields.map((field) => {
            const fieldOptions = Array.isArray(options[field]?.results)
              ? options[field].results
              : [];

            const isAddingNew = addingNewField === field;

            return (
              <div key={field} className="relative">
                <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-1">
                  {field.replace("_", " ")}
                </label>

                <div className="flex items-center gap-2">
                  {isStaff && isAddingNew ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Wprowadź nową wartość"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      onBlur={() => handleConfirmNewOption(field)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleConfirmNewOption(field);
                        if (e.key === "Escape") cancelAddingNewOption();
                      }}
                      className="flex-1 p-2 rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                    />
                  ) : (
                    <select
                      name={field}
                      value={selectedValues[field] || ""}
                      onChange={(e) => handleSelectChange(e, field)}
                      className="flex-1 p-2 rounded-lg bg-[#374b4b] text-[#d2e4e2] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                    >
                      <option value="">Wybierz</option>
                      {fieldOptions.map((item) => (
                        <option
                          key={item.id || item.nazwa}
                          value={item.id || item.nazwa}
                        >
                          {item.nazwa}
                        </option>
                      ))}
                      {isStaff && (
                        <option value="__add_new__">➕ Add new...</option>
                      )}
                    </select>
                  )}

                  {/* 🔥 Ikona kosza obok pola */}
                  {isStaff &&
                    selectedValues[field] !== "" &&
                    selectedValues[field] !== undefined && (
                      <button
                        onClick={() =>
                          handleDeleteOption(field, selectedValues[field])
                        }
                        className="p-2 text-red-400 hover:text-red-600 transition"
                        title="Usuń wybraną opcję"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* IMAGE NAME */}
        <label
          htmlFor="imageName"
          className="block text-xs font-semibold text-[#989c9e] uppercase mb-1"
        >
          Nazwa grafiki
        </label>
        <input
  type="text"
  id="imageName"
  value={imageName}
  onChange={(e) => {
    const newValue = e.target.value;
    setImageName(newValue);

    if (newValue.trim() === "") {
      setActive(false);
    } else {
      setActive(true);
    }
  }}
  placeholder="Wprowadź nazwę grafiki"
  className="w-full p-2 mb-4 rounded-lg bg-[#374b4b] text-[#d2e4e2] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
/>

        {/* BUTTON */}
        <GenerateButton active={active} generateImage={generateImage} loading={loading} />
      </div>

      {/* PRAWY PANEL */}
      <div className="lg:w-6/10 flex flex-col items-center justify-start bg-[#2a2b2b] rounded-4xl p-4 shadow-lg max-h-[80vh]">
        <div className="rounded-2xl pr-2 overflow-y-auto custom-scroll">
          {loading && (
            <div className="flex items-center justify-center w-full h-32">
              <div className="w-16 h-16 border-4 border-t-[#afe5e6] border-b-[#6d8f91] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {images.length === 0 && !loading && (
            <div className="text-[#989c9e] text-lg text-center opacity-70 mt-4">
              Wygenerowane obrazy pojawią się tutaj.
            </div>
          )}
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Generated ${index}`}
              className="rounded-xl w-full object-contain shadow-xl mb-4"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
