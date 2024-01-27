import React from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { SketchPicker } from "react-color";
import "../App.css";
import { ScanEye, ShieldAlert } from "lucide-react";
import useEyeDropper from "use-eye-dropper";
import { Minus, Plus } from "lucide-react";
import { Sparkles } from "lucide-react";
import { ImageDown } from "lucide-react";
// Color of background
let bgcolor;
// Image's url
let imageUrl = "";
// Background design
const bgImg =
  "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png";
const mask =
  // Mask image
  "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png";
// Stroke around the image
const maskStroke =
  "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png";
class CanvasEditor {
  constructor(canvasRef, templateData) {
    this.canvas = canvasRef.current;
    this.ctx = this.canvas.getContext("2d");
    this.templateData = templateData;
    // Function calls to perform tasks in order
    // Setting up the canvas -> Drawing the Design -> Drawing the mask -> Drawing he masking stroke ->Drawing the caption, CTA
    this.setupCanvas();
    this.drawTemplate();
    this.drawImage();
    this.drawCaption();
    this.drawCTA();
  }

  setupCanvas() {
    // Set up canvas properties (size, etc.)
    this.canvas.width = 600; // Set canvas width
    this.canvas.height = 600; // Set canvas height
  }

  drawTemplate() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background color
    this.ctx.fillStyle = bgcolor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Background design image
    const imgBg = new Image();
    imgBg.src = bgImg;
    imgBg.onload = () => {
      this.ctx.drawImage(imgBg, 0, 0, this.canvas.width, this.canvas.height); // Set your image position and size
    };
    // Mask stroke
    const maskStr = new Image();
    maskStr.src = maskStroke;
    maskStr.onload = () => {
      this.ctx.drawImage(maskStr, 0, 0, this.canvas.width, this.canvas.height);
    };
  }
  drawImage() {
    const img = new Image();
    img.src = imageUrl !== "" ? imageUrl : "";

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    img.onload = () => {
      // Draw the mask on the temporary canvas
      const maskImg = new Image();
      maskImg.src = mask;
      maskImg.onload = () => {
        tempCtx.drawImage(maskImg, 0, 0, tempCanvas.width, tempCanvas.height);

        // Apply the mask to the new image on the temporary canvas
        tempCtx.globalCompositeOperation = "source-in";
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.globalCompositeOperation = "source-over";

        // Copy the result back to the main canvas
        this.ctx.drawImage(tempCanvas, 0, 0);
      };
    };
  }
  drawCaption() {
    const { caption } = this.templateData;
    this.ctx.fillStyle = "white"; // Set text color
    this.ctx.font = "20px Arial"; // Set font style
    const drawTextInLines = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(" ");
      let line = "";
      // This for loop is to check if the word count is exceeding 31, it is done to keep only 31 words in a line
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = this.ctx.measureText(testLine).width;
        if (testWidth > maxWidth && i > 0) {
          this.ctx.fillText(line, x, y);
          line = words[i] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      this.ctx.fillText(line, x, y);
    };

    const captionMaxWidth = 300; // Set max width for caption text

    const lineHeight = 25;
    drawTextInLines(caption, 50, 50, captionMaxWidth, lineHeight);
  }
  // Call to action Text
  drawCTA() {
    const { callToAction } = this.templateData;
    let minWidth = 150; // this is the minimum width of rectangular box
    let height = 60;

    // Calculate the width based on the length of the call to action text
    const getTextWidth = (text) => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.font = "20px Arial";
      return tempCtx.measureText(text).width + 40; // Add some padding for
    };

    const ctaTextWidth = getTextWidth(callToAction);
    let width = Math.max(ctaTextWidth, minWidth); // Ensure the width is at least minWidth

    // To remove the rectangle in case no call to action text exists
    this.ctx.fillStyle = callToAction === "" ? bgcolor : "white";
    this.ctx.strokeStyle = callToAction === "" ? bgcolor : "white";
    // Draw the curved edges rectangle
    this.ctx.beginPath();
    this.ctx.roundRect(50, 110, width, height, [15]);
    this.ctx.stroke();
    this.ctx.fill();

    // text color and font style
    this.ctx.fillStyle = "black";
    this.ctx.font = "20px Arial";

    this.ctx.fillText(callToAction, 78, 147);
  }
}

function Specifications({ templateData, onChange }) {
  // ######   SPECIFICATIONS FOR INPUTS/IMAGES/COLORS   ######
  const [color, setColor] = useState(templateData.backgroundColor);
  const imageInputRef = useRef(null);
  const [colorHistory, setColorHistory] = useState([]);
  const [pickerOn, setPickerOn] = useState(false);
  bgcolor = color;
  const { open, close, isSupported } = useEyeDropper();
  const handleColorChange = (newColor) => {
    // Update the current color
    setColor(newColor.hex);

    // Add the new color to the color history array
    setColorHistory((prevColorHistory) => {
      // Keep only the 5 most recent colors
      const updatedHistory = [newColor.hex, ...prevColorHistory.slice(0, 4)];
      return updatedHistory;
    });
  };
  const pickColor = useCallback(() => {
    const openPicker = async () => {
      try {
        const color = await open();
        setColor(color.sRGBHex);
        setColorHistory((prevColorHistory) => {
          // Keep only the 5 most recent colors
          const updatedHistory = [
            color.sRGBHex,
            ...prevColorHistory.slice(0, 4),
          ];
          return updatedHistory;
        });
      } catch (e) {
        console.log(e);
        alert(e);
      }
    };
    openPicker();
  }, [open]);
  const handleSpanClick = () => {
    // Trigger a click event on the input element
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  const handleColorItemClick = (clickedColor) => {
    // Set the current color to the clicked color
    setColor(clickedColor);
  };

  // ###### CANVAS EDITOR FUNCTIONS ######

  const canvasRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState(templateData.caption);
  const [callToAction, setCallToAction] = useState(templateData.callToAction);
  // This function converts the uploaded image into a URL
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    //const imageInput = imageInputRef.current;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ imageUrl: reader.result });
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    imageUrl = imageFile === null ? "" : imageFile;
  }, [imageFile]);
  // FUNCTION TO UPDATE CAPTION VALUE
  const handleCaptionChange = (event) => {
    const newCaption = event.target.value;
    onChange({ caption: newCaption });
    setCaption(newCaption);
  };
  // FUNCTION TO UPDATE CTA VALUE
  const handleCallToActionChange = (event) => {
    const newCallToAction = event.target.value;
    onChange({ callToAction: newCallToAction });
    setCallToAction(newCallToAction);
  };

  useEffect(() => {
    const canvasEditor = new CanvasEditor(canvasRef, {
      ...templateData,
      caption,
      callToAction,
    });
    bgcolor = color;
  }, [templateData, imageFile, caption, callToAction, color]);

  return (
    <>
      <div className=" flex-1 items-center justify-center flex  background-divs ">
        {/* CANVAS REF */}
        <canvas
          ref={canvasRef}
          className="border"
          width={"1080"}
          height={"1080"}
        />
      </div>
      <div className=" flex-1 flex flex-col gap-5 items-center relative">
        <section className=" mt-14 flex flex-col items-center">
          <h1 className=" font-extrabold">Ad Customization</h1>
          <p className=" text-gray-500 text-center">
            Customise your ad and get the templates accordingly
          </p>
        </section>
        <section className=" w-4/5 p-3 border border-gray-200 flex rounded-lg">
          {/* UPLOAD IMAGE */}
          <ImageDown color="lightblue" className=" mr-2" />
          <p className=" text-gray-400">Change the ad creative image.</p>
          <span
            className="text-blue-600 underline ml-1"
            onClick={handleSpanClick}
            style={{ cursor: "pointer" }}
          >
            Select file
          </span>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </section>
        <section className="relative flex items-center justify-center w-4/5">
          <p className="text-gray-400 text-sm px-3 relative">Edit contents</p>
          <div className="w-[40%] bg-gray-200 absolute h-[0.5px] left-0"></div>
          <div className="w-[40%] bg-gray-200 absolute h-[0.5px] right-0"></div>
        </section>

        <section className=" relative w-4/5 p-3 border border-gray-200 flex rounded-lg">
          <span className=" absolute top-1 left-3 text-[9px]">Ad Content</span>
          {/* INPUT CONTENT */}
          <input
            className=" border-none w-full focus:border-none outline-none"
            type="text"
            placeholder="Enter something..."
            value={caption}
            onChange={handleCaptionChange}
          />
          <Sparkles
            fill="blue"
            strokeWidth={"0.5px"}
            stroke="blue"
            size={"20"}
          />
        </section>
        <section className=" relative w-4/5 p-3 border border-gray-200 flex rounded-lg">
          <span className=" absolute top-1 left-3 text-[9px]">CTA</span>
          {/* CTA CONTENT */}
          <input
            className=" border-none w-full focus:border-none outline-none"
            type="text"
            placeholder="Enter something..."
            value={callToAction}
            onChange={handleCallToActionChange}
          />
        </section>
        <section className=" w-4/5 mt-[-15px]">
          <span className=" text-left text-xs">Choose your color</span>
        </section>
        <div className=" flex gap-3 items-start w-4/5 p-2 ">
          {/* 5 MOST RECENT COLORS TO CHOOSE FROM */}
          {colorHistory.map((item, ind) => (
            <span
              key={ind}
              style={{ backgroundColor: item }}
              onClick={() => handleColorItemClick(item)}
              className={`rounded-full w-5 h-5 cursor-pointer hover:border-2 hover:border-blue-400`}
            ></span>
          ))}
          <button
            className=" bg-slate-300 rounded-full p-1"
            onClick={() => setPickerOn(!pickerOn)}
          >
            {!pickerOn ? <Plus size={"15"} /> : <Minus size={"15"} />}
          </button>
          {/* EYE DROPPER FUNCTIONALITY */}
          {isSupported() ? (
            <section className=" relative  w-[18%]">
              <button onClick={pickColor}>
                <ScanEye />
                <span className=" text-[7px] absolute top-1 right-0 ">
                  Pick using a eyedropper
                </span>
              </button>
            </section>
          ) : (
            <p className=" text-center flex gap-2">
              <ShieldAlert /> Sorry, Eyedropper color selection not available
              for this browser.
            </p>
          )}
        </div>
        {/* COLOR PICKER FUNCTIONALITY */}
        {pickerOn && (
          <SketchPicker
            color={color}
            onChange={handleColorChange}
            className=" absolute top-20 left-20"
          />
        )}
      </div>
    </>
  );
}

export default Specifications;
