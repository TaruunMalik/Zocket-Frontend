import "./App.css";
import { useState } from "react";
import Specifications from "./components/Specifications";
import template_data from "./utils/template";

function App() {
  const caption_template = template_data.caption.text;
  const cta_template = template_data.cta.text;
  // Using the template data to store in a new state, hence not modifying the original data.
  const [templateData, setTemplateData] = useState({
    imageUrl: "",
    caption: caption_template,
    callToAction: cta_template,
    backgroundColor: "#6895D2",
  });
  // Function to handle changes in the template data
  const handleTemplateChange = (newData) => {
    setTemplateData({ ...templateData, ...newData });
  };
  return (
    <div className="w-full h-screen bg-white flex ">
      {/* THIS IS THE MAIN COMPONENT WHICH COMPRISES OF INPUTS AND CANVAS */}
      <Specifications
        templateData={templateData}
        onChange={handleTemplateChange}
      />
    </div>
  );
}

export default App;
