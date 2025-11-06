import React from 'react';
import { AiToolsData } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const AiTools = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 sm:px-20 xl:px-32 my-24 text-[#d2e4e2]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-semibold">Powerful AI Tools</h2>
        <p className="text-[#989c9e] max-w-lg mx-auto">
          Explore our collection of AI tools designed to enhance your creativity.
        </p>
      </div>

      <div className="flex flex-wrap justify-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => navigate(tool.path)}
            className="p-8 m-4 max-w-xs rounded-2xl bg-[#2a2b2b] border border-[#374b4b]
                       hover:scale-105 transition-all duration-300 shadow-md cursor-pointer"
          >
            <tool.Icon
              className="w-12 h-12 p-3 text-[#1e1f1f] rounded-xl"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />
            <h3 className="mt-6 mb-3 text-lg font-semibold">{tool.title}</h3>
            <p className="text-[#989c9e] text-sm">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiTools;
