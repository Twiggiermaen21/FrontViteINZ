import { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN, fields, fieldToEndpoint } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([
    "https://res.cloudinary.com/dhgml9qt5/image/upload/v1759260406/generated_images/generated_b163444da3ed493a8878d8d0210ca2fa.jpg",
    "https://res.cloudinary.com/dhgml9qt5/image/upload/v1753272595/generated_images/generated_image_92.jpg",
    "https://res.cloudinary.com/dhgml9qt5/image/upload/v1753213490/generated_image_89_znxn81.jpg",
    "https://res.cloudinary.com/dhgml9qt5/image/upload/v1753213490/generated_image_87_pn8akp.jpg",
    "https://res.cloudinary.com/dhgml9qt5/image/upload/v1753213490/generated_image_88_ah7yrr.jpg",
  ]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [selected, setSelected] = useState({});

  const examplePrompts = [
    "A futuristic city skyline at night",
    "Cute cat wearing glasses",
    "Fantasy forest with glowing mushrooms",
    "Minimalist abstract shapes",
  ];

  // fetch options for selects
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
        const availableOptions = options[field]?.results;

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

      setImages((prev) => [...prev, res.data.url]);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full  pt-8 px-4">
      {/* LEWY PANEL */}
      <div className="lg:w-4/10 bg-[#2a2b2b] rounded-4xl p-8 shadow-lg">
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
                {Array.isArray(options[field]?.results) &&
                  options[field].results.map((item) => (
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

      {/* PRAWY PANEL - CUSTOM SCROLL */}
      <div className="lg:w-6/10 flex flex-col items-center justify-start bg-[#2a2b2b] rounded-4xl p-4 shadow-lg max-h-[80vh]">
        
         <div className="  pr-2 overflow-y-auto custom-scroll">
        {loading && (
          <div className="flex items-center justify-center w-full h-32">
            <div className="w-16 h-16 border-4 border-t-[#afe5e6] border-b-[#6d8f91] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="text-[#989c9e] text-lg text-center opacity-70 mt-4">
            Your generated images will appear here.
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
