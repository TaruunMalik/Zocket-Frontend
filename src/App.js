import "./App.css";
import { useState } from "react";
import Specifications from "./components/Specifications";
import template_data from "./utils/template";

function App() {
  const caption_template = template_data.caption.text;
  const cta_template = template_data.cta.text;
  const [templateData, setTemplateData] = useState({
    imageUrl: "",
    caption: caption_template,
    callToAction: cta_template,
    backgroundColor: "#6895D2",
  });

  const handleTemplateChange = (newData) => {
    setTemplateData({ ...templateData, ...newData });
  };
  return (
    <div className="w-full h-screen bg-white flex ">
      <Specifications
        templateData={templateData}
        onChange={handleTemplateChange}
      />
    </div>
  );
}

export default App;
