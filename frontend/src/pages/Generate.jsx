import { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN, fields, fieldToEndpoint } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [selected, setSelected] = useState({});

  const examplePrompts = [
    "A futuristic city skyline at night",
    "Cute cat wearing glasses",
    "Fantasy forest with glowing mushrooms",
    "Minimalist abstract shapes",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const responses = await Promise.all(
          fields.map((field) =>
            axios.get(`${apiUrl}/${fieldToEndpoint[field]}/`, config)
          )
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

    fetchData();
  }, []);

  const handleSelectChange = (e) => {
    setSelected((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value),
    }));
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const payload = { prompt };
      fields.forEach((field) => {
        const selectedValue = selected[field];
        const availableOptions = options[field];
        if (selectedValue) {
          payload[field] = selectedValue;
        } else if (availableOptions?.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableOptions.length);
          payload[field] = availableOptions[randomIndex].id;
        }
      });

      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await axios.post(`${apiUrl}/generate/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImageUrl(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto pt-8 px-4">
      {/* LEWY PANEL */}
      <div className="flex-1 bg-[#2a2b2b] rounded-4xl p-8 shadow-lg ">
        
        {/* PROMPT */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
            Your prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="3"
            placeholder="Describe what you want to generate..."
            className="w-full p-4 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
        </div>

        {/* EXAMPLES */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-3">Try an example:</h3>
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-1">
                {field.replace("_", " ")}
              </label>
              <select
                name={field}
                onChange={handleSelectChange}
                className="w-full p-2 rounded-lg bg-[#374b4b] text-[#d2e4e2] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
              >
                <option value="">Choose</option>
                {Array.isArray(options[field]) &&
                  options[field].map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nazwa}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={generateImage}
          disabled={loading}
          className="w-full py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* PRAWY PANEL */}
      <div className="flex-1 flex items-center justify-center bg-[#2a2b2b] rounded-4xl p-8 shadow-lg ">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-xl max-h-[500px] object-contain shadow-xl"
          />
        ) : (
          <div className="text-[#989c9e] text-lg text-center opacity-70">
            Your generated image will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
