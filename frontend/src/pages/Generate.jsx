import { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN, fields, fieldToEndpoint } from "../constants";
import { assets } from "../assets/assets";

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

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

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
          setTimeout(() => {
            window.location.reload();
          }, 500); // odświeży po 0.5 sekundy
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

      // Tworzymy payload z selected lub losowymi wartościami
      fields.forEach((field) => {
        const selectedValue = selected[field];
        const availableOptions = options[field];

        if (selectedValue) {
          payload[field] = selectedValue;
        } else if (availableOptions && availableOptions.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableOptions.length
          );
          payload[field] = availableOptions[randomIndex].id;
        }
      });

      console.log("Wysyłany payload (z losowymi gdzie trzeba):", payload);

      const token = localStorage.getItem(ACCESS_TOKEN);

      const res = await axios.post(`${apiUrl}/generate/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImageUrl(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  console.log(options);
  return (
    <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl mx-auto py-12 px-4">
      <div className="flex-1 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6">
          Generate AI Image
        </h2>

        <div className="mb-6 space-y-2">
          <label className="block text-xs font-semibold tracking-wider text-white uppercase">
            Your prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="3"
            placeholder="Describe what you want to generate..."
            className="w-full p-4 rounded-3xl bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
          ></textarea>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-2">
            Try an example:
          </h3>
          <div className="flex flex-wrap gap-3">
            {examplePrompts.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="px-4 py-2 rounded-full bg-pink-400 text-white text-sm hover:bg-pink-500 transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-white uppercase mb-1">
                {field.replace("_", " ")}
              </label>
              <select
                name={field}
                onChange={handleSelectChange}
                className="w-full p-2 rounded-xl text-gray-700"
              >
                <option value="">Wybierz</option>

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

        <button
          onClick={generateImage}
          disabled={loading}
          className="w-full py-4 text-lg bg-gradient-to-r from-pink-400 to-orange-400 rounded-full font-bold hover:from-pink-500 hover:to-yellow-400 transition-all duration-300"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-2xl max-h-[500px] object-contain shadow-xl"
          />
        ) : (
          <div className="text-white text-lg text-center opacity-70">
            Your generated image will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
